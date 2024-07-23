import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Esta parte es necesaria para obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función asíncrona para cargar el archivo JSON
async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

// Ruta al archivo JSON
const jsonFilePath = path.join(__dirname, "../../models/PERSONAL INMEL 009H.json");

// Función para filtrar los datos por "Codigo Inspector"
function filterByInspector(perfiles, id) {
  return perfiles.filter(item => item["N° de cédula"] == String(id));
}

// Función para mapear los datos completos
function mapOperarioInsp(datosCompletos) {
  return datosCompletos.map(item => ({
    Nombre: item["NOMBRES Y APELLIDOS"],
    Cedula: item["N° de cédula"],
    Proceso: item["Proyecto/Sede_1"],
  }));
}

// funcion para devolver los objetos del array
export async function getOperariosInsp() {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    if (!Array.isArray(perfiles)) {
      throw new Error("El archivo JSON no es un array");
    }
    return perfiles;
  } catch (error) {
    console.error("Error al obtener los datos del Array", error);
    throw error; // Propagamos el error para que se maneje adecuadamente en la función que llama
  }
}

// Función para obtener datos personales
export async function getDataPersonal(id) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    const datosFiltrados = filterByInspector(perfiles, id);
    const operarioInsp = mapOperarioInsp(datosFiltrados);
    return { operarioInsp };
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return 0; // Retornar 0 en caso de error
  }
}

// devolver el json como un objeto javascript
export async function getdevolverDatos() {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    return perfiles;
  } catch (error) {
    console.error("Error al obtener los datos del JSON", error);
  }
}

// Nueva función para obtener la cantidad de objetos que cumplen con la condición
export async function getCountByInspector(id) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    const datosFiltrados = filterByInspector(perfiles, id);
    return datosFiltrados.length; // Devolver la cantidad
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return 0; // Retornar 0 en caso de error
  }
}

// Nueva función para obtener datos por proyecto
export async function getDataByProject(projectName) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    const datosFiltrados = perfiles.filter(item => item["Proyecto/Sede_1"] === projectName);
    return datosFiltrados;
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return 0; // Retornar 0 en caso de error
  }
}


// Nueva función para obtener datos por proyecto
export async function getOperativaPorSede(projectName) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    const datosFiltrados = perfiles.filter(item => item["Proyecto/Sede_1"] === projectName &&  item["estado"] === "Activo" && item["Proyecto/Sede_1"] !== "CUCUTA-INTERVENTOR" && item["Proyecto/Sede_1"] !== "CUCUTA-CGO" && item["Proyecto/Sede_1"] !== "ADMIN" );
    return datosFiltrados;
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return 0; // Retornar 0 en caso de error
  }
}


async function main() {
  const d = await getdevolverDatos();
  console.log(d);
}

// main(); // Llamar a la función principal para ejecutar el ejemplo
