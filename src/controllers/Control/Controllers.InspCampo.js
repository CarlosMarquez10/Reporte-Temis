import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getOperariosInsp } from "./Controllers.Personal.js";
import { getDatosPerfiles } from "./Controllers.Perfiles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(
  __dirname,
  "../../models/Reporte General Insp. ESSA Cens.json"
);

const CucutaDrastrico = [];
const CucutaFacturacion = [];
const CucutaScr = [];
const Pamplona = [];
const ocana = [];
const tibuPueblos = [];
const tibu = [];
const aguachica = [];
const CucutaAdmon = [];

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

// Función para obtener la cantidad de objetos en el JSON
export async function getObjectCount() {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    return perfiles.length;
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return 0;
  }
}

// Función para buscar por cualquier propiedad
export async function getPosteriorInsp(id) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    return perfiles.filter(
      (item) =>
        item["Codigo Inspector"] === String(id) &&
        item["Tipo de Inspeccion"] === "Posterior"
    );
  } catch (error) {
    console.error("Error al buscar por propiedad:", error);
    return [];
  }
}

// Función para buscar por cualquier propiedad
export async function getInmediataInsp(id) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    return perfiles.filter(
      (item) =>
        item["Codigo Inspector"] === String(id) &&
        item["Tipo de Inspeccion"] === "Inmediata"
    );
  } catch (error) {
    console.error("Error al buscar por propiedad:", error);
    return [];
  }
}

// Función para buscar por cualquier propiedad
export async function getPosteriorInmediata() {
  const perfil = await getDatosPerfiles();
  // console.log("Perfil obtenido:", perfil);
  try {
    const perfiles = await loadJSON(jsonFilePath);
    // console.log("Primer elemento de perfiles:", perfiles[0]);
    return perfiles.map((elemento) => {
      // console.log("Procesando elemento:", elemento["Codigo Inspector"]);
      if (perfil && perfil.hasOwnProperty(elemento["Codigo Inspector"])) {
        elemento.Regional = perfil[elemento["Codigo Inspector"]].Proceso;
        return elemento;
      }else{
        return perfil
      }
      
     
    });
   
  } catch (error) {
    console.error("Error al buscar por propiedad:", error);
    return [];
  }
}

// Función para buscar por tipo de Inspeccion
export async function getTipoInsp(id) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    return perfiles.filter((item) => item["Codigo Inspector"] === String(id));
  } catch (error) {
    console.error("Error al buscar por propiedad:", error);
    return [];
  }
}

// Función para filtrar objetos que cumplan una condición
export async function filterByCondition(condition) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    return perfiles.filter(condition);
  } catch (error) {
    console.error("Error al filtrar por condición:", error);
    return [];
  }
}

// Función para buscar los operarios pendientes por inspección a cargo del Inspector
export async function findPendingInspections(sede) {
  const noincluir = [
    1000,
    2000,
    3000,
    4000,
    5000,
    "5000NC",
    "1000NC",
    "2000NC",
    "3000NC",
    "4000NC",
  ];
  const personalInmel = await getOperariosInsp();
  try {
    const perfiles = await loadJSON(jsonFilePath);

    // Filtra los operarios que no se encuentran en perfiles y que pertenecen a la misma sede
    const pendingInspections = personalInmel.filter((persona) => {
      const cedulaPersona = persona["N° de cédula"].toString();
      return (
        !perfiles.some(
          (perfil) => perfil["Documento Empleado"] === cedulaPersona
        ) &&
        persona["Proyecto/Sede"] === sede &&
        persona["estado"] === "Activo" &&
        !noincluir.includes(persona["N° de cédula"])
      );
    });

    return pendingInspections;
  } catch (error) {
    console.error("Error al buscar coincidencias con array:", error);
    return [];
  }
}

// Función para buscar los operarios pendientes por inspección
export async function PendientePorInspections() {
  const personalInmel = await getOperariosInsp();
  try {
    const perfiles = await loadJSON(jsonFilePath);

    // Filtra los operarios que no se encuentran en perfiles
    const pendingInspections = personalInmel.filter((persona) => {
      const cedulaPersona = persona["N° de cédula"].toString();
      return !perfiles.some(
        (perfil) => perfil["Documento Empleado"] === cedulaPersona
      );
    });

    return pendingInspections;
  } catch (error) {
    console.error("Error al buscar coincidencias con array:", error);
    return [];
  }
}

//datos del los inspecionados
export async function getDataInspCampo(id) {
  try {
    const perfiles = await loadJSON(jsonFilePath);
    const data = perfiles.filter(
      (item) => item["Codigo Inspector"] === String(id)
    );
    const count = data.length;
    const operarioInsp = data.map((item) => ({
      Nombre: item["Nombre Tecnico"],
    }));
    return { count, operarioInsp };
  } catch (error) {
    console.error("Error al cargar el archivo JSON:", error);
    return { count: 0, operarioInsp: [] };
  }
}


