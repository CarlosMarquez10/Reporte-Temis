import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getDataById } from "./Control/Controllers.Perfiles.js";
import {
  getDataInspCampo,
  findPendingInspections,
  getPosteriorInsp,
  getInmediataInsp,
  getTipoInsp,
} from "./Control/Controllers.InspCampo.js";
import { getDataNc } from "./Control/Controllers.Nconforme.js";
import { AtentosPerfil } from "./Control/Controllers.Atentos.js";
import { getOperativaPorSede } from "./Control/Controllers.Personal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirPath = path.join(__dirname, "../Res/Inspectores");

if (!fs.existsSync(dirPath)) {
  throw new Error(`La carpeta de destino no existe: ${dirPath}`);
}

const ids = [
  1065874827, 1116801169, 1090410612, 88241861, 5401549, 1090379569, 88247516,
  1090404495, 13473944, 1090465860, 1094662916, 1090983561, 1091654268,
  18926009, 1064841699, 1093736192, 60300528, 1090391002, 88273237, 1092352956,
  88271021,
];

const template = {
  Nombre: "",
  Cedula: 0,
  Rol: "",
  ProyectoSede: "",
  Proceso: "",
  CantidadOperativa: 0,
  Cantidad_Inspecciones: 0,
  Cantidad_InpsPendiente: 0,
  Cantidad_NoConformidades: 0,
  OperarioConNocomformidad: [],
  Cantidad_Atentos: 0,
  OperarioConAtentos: [],
  Cantidad_Inpeccionados: 0,
  NombreInsPeccionados: [],
  Nombre_PtePorInspecciones: [],
  Cantidad_PtePorInspecciones: 0,
  CantidaInspAnterior: 0,
  NombreInspAnterior: [],
  CantidadInspPosterior: 0,
  NombreInspPosterior: [],
  MotivoDeInspeccion: [],
  InspPorHora: {
    TipoDocumento: "",
    CantidadTipoDocumento: 0,
    HoraTipoDocumento: "",
  },
};

export async function CrearJson() {
  for (const id of ids) {
    try {
      console.log(`Procesando ID: ${id}`);
      const data = await getDataById(id);
      if (!data) {
        console.warn(`No data found for id: ${id}`);
        continue;
      }

      const PendientesInsp = await findPendingInspections(data["Proyecto/Sede"]);
      const Operativa = await getOperativaPorSede(data["Proceso"]);
      const InspPosterior = await getPosteriorInsp(id);
      const InspInmediata = await getInmediataInsp(id);
      const TipoInspecciones = await getTipoInsp(id);
      const Atentos = await AtentosPerfil(id);
      const { count: dtInspCamp, operarioInsp } = await getDataInspCampo(id);
      const { count: cantNc, operarioNc } = await getDataNc(id);

      const obj = { ...template };

      obj.Nombre = data.Nombre || "";
      obj.Cedula = id;
      obj.Rol = data.Rol || "";
      obj.ProyectoSede = data["Proyecto/Sede"] || "";
      obj.Proceso = data.Proceso || "";
      obj.CantidadOperativa = Operativa.length;
      obj.Cantidad_Inspecciones = (data["Inpecciones-semanal"] || 0) * 4;
      obj.Cantidad_InpsPendiente =
        (data["Inpecciones-semanal"] || 0) * 4 - dtInspCamp - cantNc || 0;
      obj.Cantidad_NoConformidades = cantNc || 0;
      obj.OperarioConNocomformidad = operarioNc;
      obj.Cantidad_Atentos = Atentos.length;
      obj.OperarioConAtentos = Atentos.map((atentos) => ({
        Nombre: atentos["Nombre Usuario Reportado"],
        tipoAtento: atentos["Tipo Atento"],
        DescubrirAtento: atentos["Describir lo reportado"],
        Observaciones: atentos["Observaciones"],
        fecha: atentos["Fecha Inicio de Ejecucion"],
      }));
      obj.Cantidad_Inpeccionados = dtInspCamp || 0;
      obj.NombreInsPeccionados = operarioInsp;
      obj.Nombre_PtePorInspecciones = PendientesInsp.map((persona) => ({
        Nombre: persona["NOMBRES Y APELLIDOS"],
        Proceso: persona["Proyecto/Sede_1"],
      }));
      obj.Cantidad_PtePorInspecciones = obj.Nombre_PtePorInspecciones.length;
      obj.CantidaInspAnterior = InspPosterior.length;
      obj.NombreInspAnterior = InspPosterior.map((persona) => ({
        Nombre: persona["Nombre Tecnico"],
        Proceso: persona["Resultado de Inspeccion"],
      }));
      obj.CantidadInspPosterior = InspInmediata.length;
      obj.NombreInspPosterior = InspInmediata.map((persona) => ({
        Nombre: persona["Nombre Tecnico"],
        ResultInsp: persona["Resultado de Inspeccion"],
      }));
      obj.MotivoDeInspeccion = TipoInspecciones.map((Insp) => ({
        TipoInspeccion: Insp["Tipo Documento"],
        Nombre: Insp["Nombre Tecnico"],
        FechaInicio: Insp["Fecha Inicio de Ejecucion"],
        FechaFinal: Insp["Fecha Final de Ejecucion"],
        ResultInsp: Insp["Resultado de Inspeccion"],
      }));
      obj.InspPorHora = {
        TipoDocumento: "",
        CantidadTipoDocumento: 0,
        HoraTipoDocumento: "",
      };

      const filePath = path.join(dirPath, `${id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
      console.log(`Archivo JSON creado para el id: ${id}`);
    } catch (error) {
      console.error(`Error al procesar el id ${id}:`, error);
    }
  }
  console.log("Proceso de creación de JSON completado.");
}

