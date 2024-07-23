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

const jsonFilePath = path.join(
  __dirname,
  "../../models/Reporte No Conformidades.json"
);

export async function getInpNc(id) {
  try {
    const prefiles = await loadJSON(jsonFilePath);
    const data = prefiles.filter(
      (elemento) => elemento["Codigo Detector"] === String(id)
    );
    return data.length;
  } catch (error) {
    console.error("Error al devolver las Insp Nconforme.. ", error);
  }
}

export async function getDataNc(id) {
  try {
    const perfiles = await loadJSON(jsonFilePath);

    // Filtrar los objetos que cumplan con la condición "Codigo Inspector" === id
    const data = perfiles.filter(
      (item) => item["Codigo Detector"] === String(id)
    );

    // Obtener la cantidad de objetos que cumplen con la condición
    const count = data.length;
    const operarioNc = data.map((item) => ({
      Nombre: item["Nombre a quien se le detecto"],
    }));
    return { count, operarioNc }; // Devolver la cantidad y el array de nombres
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return { count: 0, operarioNc: [] }; // Retornar 0 y un array vacío en caso de error
  }
}


export async function getNcEstados() {
  try {
    const datos = await loadJSON(jsonFilePath);
    const NcEstados = datos.filter((e) => e["Estado"] === "Abierta sin corrección");

    const result = NcEstados.map((e) => ({
      Inspector: e["Nombre del Detector"],
      Estado: e["Estado"],
      Operario: e["Nombre a quien se le detecto"],
      Description: e["Descripción NC"],
      Impacto: e["Control Impacto"],
      FechaInspNC: e["Fecha Deteccion"],
      FechaEspCorrecion: e["Fecha Esperada Correccion"],
    }));

    return result;
  } catch (error) {
    console.error("Error al crear el objeto con las NC Abiertas", error);
    return [];
  }
}
