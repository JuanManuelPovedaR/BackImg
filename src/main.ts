import { readdir } from "fs/promises";
import { join, extname } from "path";

const GITHUB_USER = "JuanManuelPovedaR";
const REPO = "BackImg";
const BRANCH = "main";
const FOLDER = "images";
const FOLDER_PATH = join(process.cwd(), FOLDER);

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // Headers CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Preflight OPTIONS
    if (req.method === "OPTIONS") {
      return new Response("", { headers: corsHeaders });
    }

    // Endpoint para subir imágenes
    if (req.method === "POST" && url.pathname === "/upload") {
      const contentType = req.headers.get("content-type") || "";
      if (!contentType.startsWith("multipart/form-data")) {
        return new Response("Formato no soportado", { status: 400 });
      }
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file || !(file instanceof File)) {
        return new Response("No se envió archivo", { status: 400 });
      }
      const uniqueId = crypto.randomUUID();
      const fileExtension = extname(file.name) || ".png";
      const fileName = `${uniqueId}${fileExtension}`;
      const filePath = join(FOLDER_PATH, fileName);
      await Bun.write(filePath, file);
      const rawUrl = `http://localhost:3001/images/${fileName}`;
      return new Response(rawUrl, {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // Endpoint para ver imágenes
    if (req.method === "GET" && url.pathname.startsWith("/images/")) {
      const filename = url.pathname.replace("/images/", "");
      const filePath = join(FOLDER_PATH, filename);
      try {
        const file = Bun.file(filePath);
        if (!(await file.exists())) {
          return new Response("Imagen no encontrada", { status: 404 });
        }
        // Detecta el tipo MIME por extensión
        const ext = extname(filename).toLowerCase();
        const mime =
          ext === ".jpg" || ext === ".jpeg"
            ? "image/jpeg"
            : ext === ".png"
            ? "image/png"
            : ext === ".gif"
            ? "image/gif"
            : "application/octet-stream";
        return new Response(file, {
          headers: {
            ...corsHeaders,
            "Content-Type": mime,
          },
        });
      } catch {
        return new Response("Error al leer la imagen", { status: 500 });
      }
    }

    // Página principal
    return new Response(
      "Servidor corriendo\nPOST /upload para subir imágenes\nGET /images/{nombre} para ver imágenes\nMira la consola para ver las URLs locales",
      { headers: corsHeaders }
    );
  },
});

console.log(`Servidor corriendo en http://localhost:${server.port}`);

// Mostrar enlaces locales de imágenes en consola
(async () => {
  try {
    const files = await readdir(FOLDER_PATH);
    console.log("\n Enlaces locales de imágenes:\n");
    files.forEach((file) => {
      const url = `http://localhost:3001/images/${file}`;
      console.log(`${file} -> ${url}`);
    });
    console.log(
      "\n Recuerda: para acceder a las imágenes desde tu frontend, usa las URLs locales generadas arriba."
    );
  } catch (err) {
    console.error(" Error leyendo carpeta de imágenes:", err);
  }
})();
