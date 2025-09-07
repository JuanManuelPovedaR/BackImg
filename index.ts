import { readdir } from "fs/promises";

const GITHUB_USER = "JuanManuelPovedaR";   // tu usuario de GitHub
const REPO = "BackImg";                   // nombre de tu repo
const BRANCH = "main";                    // rama (main/master)
const FOLDER = "images";                  // carpeta donde guardas las imágenes

const server = Bun.serve({
  port: 3000,
  fetch() {
    return new Response("Servidor corriendo 🚀\nMira la consola para ver las URLs RAW");
  },
});

console.log(`Servidor corriendo en http://localhost:${server.port}`);

// 📸 Generar enlaces RAW de GitHub y mostrarlos en consola
(async () => {
  try {
    const files = await readdir(`./${FOLDER}`);
    console.log("\n📸 Enlaces RAW de GitHub:\n");
    files.forEach((file) => {
      const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/${BRANCH}/${FOLDER}/${file}`;
      console.log(`${file} -> ${url}`);
    });
    console.log("\n⚠️ Recuerda: hasta que no hagas 'git add/commit/push' esos enlaces no funcionarán.\n");
  } catch (err) {
    console.error("❌ Error leyendo carpeta de imágenes:", err);
  }
})();
