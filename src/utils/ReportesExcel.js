import { NoComformeRepo } from "./NoConformidades.js";
import { RepoAtentos } from "./RepoAtentos.js";
import { InspCampo } from "./ReposInspCampo.js";
import { ArchivoEmpleado } from "./Empleados.js";

import {
  checkFilesExist,
  processFiles,
} from "../controllers/CrearJsonInspCampo.js";

async function tryInspCampo(maxRetries) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await InspCampo();
      if (result) {
        console.log("Descarga exitosa de InspCampo");
        return true;
      } else {
        console.log(`Intento ${i + 1}/${maxRetries} de InspCampo fallido. Reintentando...`);
      }
    } catch (error) {
      console.error(`Error en intento ${i + 1} de InspCampo:`, error);
    }
  }
  return false;
}

async function tryRepoAtentos(maxRetries) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await RepoAtentos();
      if (result) {
        console.log("Descarga exitosa de RepoAtentos");
        return true;
      } else {
        console.log(`Intento ${i + 1}/${maxRetries} de RepoAtentos fallido. Reintentando...`);
      }
    } catch (error) {
      console.error(`Error en intento ${i + 1} de RepoAtentos:`, error);
    }
  }
  return false;
}

async function tryNoComformeRepo(maxRetries) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await NoComformeRepo();
      if (result) {
        console.log("Descarga exitosa de NoComformeRepo");
        return true;
      } else {
        console.log(`Intento ${i + 1}/${maxRetries} de NoComformeRepo fallido. Reintentando...`);
      }
    } catch (error) {
      console.error(`Error en intento ${i + 1} de NoComformeRepo:`, error);
    }
  }
  return false;
}

async function tryArchivoEmpleado(maxRetries) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await ArchivoEmpleado();
      if (result) {
        console.log("Descarga exitosa de ArchivoEmpleado");
        return true;
      } else {
        console.log(`Intento ${i + 1}/${maxRetries} de ArchivoEmpleado fallido. Reintentando...`);
      }
    } catch (error) {
      console.error(`Error en intento ${i + 1} de ArchivoEmpleado:`, error);
    }
  }
  return false;
}

export async function ReportesExcel() {
  const maxRetries = 3; // Número máximo de reintentos

  const Ic = await tryInspCampo(maxRetries);
  if (!Ic) {
    console.log("No se pudo descargar el reporte de InspCampo");
    return;
  }

  const Ra = await tryRepoAtentos(maxRetries);
  if (!Ra) {
    console.log("No se pudo descargar el reporte de RepoAtentos");
    return;
  }

  const Nc = await tryNoComformeRepo(maxRetries);
  if (!Nc) {
    console.log("No se pudo descargar el reporte de NoComformeRepo");
    return;
  }

  const Em = await tryArchivoEmpleado(maxRetries);
  if (!Em) {
    console.log("No se pudo descargar el reporte de ArchivoEmpleado");
    return;
  }

  try {
    await checkFilesExist();
    await processFiles();
    console.log("Archivos JSON creados...");
  } catch (error) {
    console.error("Error en checkFilesExist o processFiles:", error);
  }
}
