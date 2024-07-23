import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getOperariosInsp } from "./Controllers.Personal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(
  __dirname,
  "../../models/Reporte Atento NEW.json"
);

async function loadJSON(filePath) {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

// Función para obtener todo el JSON como un array
export async function getAllData() {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    return perfiles;
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return [];
  }
}

// Función para buscar por tipo de Inspeccion
export async function getAtentosCantidad(sedeid) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    const personal = await getOperariosInsp();
    const atentosResultado = [];

    for (let i = 0; i < perfiles.length; i++) {
      for (let j = 0; j < personal.length; j++) {
        if (
          perfiles[i]["Codigo Usuario reporta"] ===
          String(personal[j]["N° de cédula"])
        ) {
          if (perfiles[i]["Codigo Usuario reporta"] !== "1065874827") {
            perfiles[i]["AtentosResult"] = personal[j]["Proyecto/Sede_1"];
          } else {
            perfiles[i]["AtentosResult"] = "AGUACHICA-SSTA";
          }
        }
      }
      atentosResultado.push(perfiles[i]);
    }
    const datosAtentos = atentosResultado.filter((e) => {
      if (e.AtentosResult === sedeid) {
        return true;
      }
    });
    return datosAtentos;
  } catch (error) {
    console.error("Error al buscar por propiedad:", error);
    return [];
  }
}

export async function AtentosPerfil(id) {
  try {
    const datos = await loadJSON(jsonFilePath);

    // Verifica si los datos son un array
    if (!Array.isArray(datos)) {
      throw new TypeError("El archivo JSON no contiene un array");
    }

    const datosAtentos = datos.filter((elemento) => {
      return elemento["Codigo Usuario reporta"] === String(id);
    });

    return datosAtentos;
  } catch (error) {
    console.error(
      "Error al conseguir los datos de los atentos sin corrección:",
      error
    );
  }
}
