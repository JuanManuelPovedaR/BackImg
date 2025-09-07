import { readdir } from "fs/promises";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Servir imágenes directamente
    if (url.pathname.startsWith("/images/")) {
      const imagePath = `./images${url.pathname.replace("/images", "")}`;
      const file = Bun.file(imagePath);

      if (!(await file.exists())) {
        return new Response("Imagen no encontrada", { status: 404 });
      }

      return new Response(file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });
    }

    return new Response("Servidor corriendo 🚀\nRevisa la consola para ver las URLs de las imágenes");
  },
});

console.log(`Servidor corriendo en http://localhost:${server.port}`);

// 🔥 Leer la carpeta y mostrar las URLs en consola
(async () => {
  try {
    const files = await readdir("./images");
    console.log("\n📸 Imágenes disponibles:\n");
    files.forEach((file) => {
      console.log(`${file} -> http://localhost:${server.port}/images/${file}`);
    });
    console.log("\n");
  } catch (err) {
    console.error("Error leyendo carpeta ./images:", err);
  }
})();
