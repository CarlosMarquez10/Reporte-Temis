import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CantidadPorDiaLaboral } from "./Control/CalcularDiaLaboral.js";
import { getTipoInsp, getPosteriorInmediata } from "./Control/Controllers.InspCampo.js";
import { AtentosPerfil, getAtentosCantidad } from "./Control/Controllers.Atentos.js";
import { getInpNc, getNcEstados } from "./Control/Controllers.Nconforme.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirPath = path.join(__dirname, "../Res/Inspectores");

if (!fs.existsSync(dirPath)) {
  throw new Error(`La carpeta de destino no existe: ${dirPath}`);
}

const template = {
  CucutaDrastico: {},
  CucutaScr: {},
  CucutaFacturacion: {},
  Pamplona: {},
  Ocana: {},
  TibuPueblos: {},
  Tibu: {},
  Aguachica: {},
  CucutaSsta: {},
  AguachicaSsta: {},
  CucutaAdmon: {},
  TipoInspeccion: {},
  FormaInspeccion: {},
};

const inspMapping = [
  { key: "CucutaDrastico", superId: 1090379569, auxId: 5401549, laboral: 6, constInsp: 6.66, Regional: "CUCUTA-DRASTICOS" },
  { key: "CucutaScr", superId: 88271021, auxId: 1116801169, laboral: 6, constInsp: 6.66, Regional: "CUCUTA-SCR" },
  { key: "CucutaFacturacion", superId: 88271021, auxId: 1116801169, laboral: 6, constInsp: 6.66, Regional: "CUCUTA-FACTURACION" },
  { key: "Pamplona", superId: 1090465860, auxId: 1094662916, laboral: 6, constInsp: 6.66, Regional: "PAMPLONA" },
  { key: "Ocana", superId: 1090983561, auxId: 1091654268, laboral: 6, constInsp: 6.66, Regional: "OCAÑA"  },
  { key: "TibuPueblos", superId: 1090404495, auxId: 13473944, laboral: 6, constInsp: 6.66, Regional: "TIBU-PUEBLOS" },
  { key: "Tibu", superId: 88247516, auxId: 13473944, laboral: 5, constInsp: 6.66, Regional: "TIBU" },
  { key: "Aguachica", superId: 18926009, auxId: 1064841699, laboral: 6, constInsp: 6.66, Regional: "AGUACHICA" },
  { key: "CucutaSsta", superId: 1093736192, auxId: 1092352956, laboral: 6, constInsp: 7.54, Regional: "CUCUTA-SSTA" },
  { key: "AguachicaSsta", superId: 1065874827, auxId: 0, laboral: 6, constInsp: 4.40, Regional: "AGUACHICA-SSTA" },
  { key: "CucutaAdmon", superId: 88273237, auxId: 60300528, laboral: 6, constInsp: 4.99, coordId: 1090391002, Regional: "CUCUTA-ADMON" },
];

export async function CrearJsonGeneral() {
  const promises = inspMapping.map(async ({ superId, auxId, Regional }) => {
    const [superInsp, auxInsp, superAtentos, auxAtentos, superNc, AuxNc, atentosfiltrados, EstadoNc] = await Promise.all([
      getTipoInsp(superId),
      getTipoInsp(auxId),
      AtentosPerfil(superId),
      AtentosPerfil(auxId),
      getInpNc(superId),
      getInpNc(auxId),
      getAtentosCantidad(Regional),
      getNcEstados()
    ]);

    return { superInsp, auxInsp, superId, auxId, superAtentos, auxAtentos, superNc, AuxNc, atentosfiltrados, EstadoNc, Regional };
  });

  const inspResults = await Promise.all(promises);
  const posteriorInmediata = await getPosteriorInmediata();

  const obj = { ...template };

  inspResults.forEach(({ superInsp, auxInsp, superId, auxId, superAtentos, auxAtentos, superNc, AuxNc, atentosfiltrados, EstadoNc, Regional }, index) => {
    const { key, laboral, constInsp, coordId } = inspMapping[index];
    
    const regionalInspections = posteriorInmediata.filter(ele => ele.Regional === Regional);
    
    const tipoDocumentoCount = regionalInspections.reduce((acc, ele) => {
      const tipoDoc = ele['Tipo Documento'];
      if (!acc[tipoDoc]) {
        acc[tipoDoc] = { Cantidad: 1 };
      } else {
        acc[tipoDoc].Cantidad++;
      }
      return acc;
    }, {});

    obj[key] = {
      cantidadInspGeneral: CantidadPorDiaLaboral(constInsp),
      cantidadInspEjecutadas: superInsp.length + auxInsp.length,
      atentosEjecutado: atentosfiltrados.length ,
      NoConformidades: superNc + AuxNc,
      NoConformidaEstados: EstadoNc,
      constInsp,
      IdSupervisor: superId,
      IdAuxSupervisor: auxId,
      TipoInspeccion: tipoDocumentoCount,
      FormaInspeccion: {
        Posterior: regionalInspections.filter(ele => ele['Tipo de Inspeccion'] === 'Posterior').length,
        Inmediata: regionalInspections.filter(ele => ele['Tipo de Inspeccion'] === 'Inmediata').length,
      },
      ...(coordId ? { Coordinacion: coordId } : {}),
    };
  });

  const filePath = path.join(dirPath, "Generales.json");
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
  console.log(`Archivo JSON creado en: ${filePath}`);
}

// Llamar a la función para crear el JSON
// CrearJsonGeneral().catch(console.error);