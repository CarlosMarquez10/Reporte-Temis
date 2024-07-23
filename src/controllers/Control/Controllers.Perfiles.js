import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Esta parte es necesaria para obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

const jsonFilePath = path.join(__dirname, "../../models/data/Perfiles.json");

async function getDataById(id) {
  try {
    const Perfiles = await loadJSON(jsonFilePath);
    const perfilesArray = Object.entries(Perfiles); // Convertir el objeto en un array de pares [key, value]
    const data = perfilesArray
      .filter(([key, value]) => key === String(id))
      .map(([key, value]) => value)[0];
    return data;
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return null;
  }
}

async function getDatosPerfiles() {
  try {
    const Perfiles = loadJSON(jsonFilePath);
    return Perfiles;
  } catch (error) {
    console.error("Error en al velver los datos perfil");
  }
}

export { getDataById, getDatosPerfiles };
