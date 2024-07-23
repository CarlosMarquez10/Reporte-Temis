import cron from "node-cron";
import { HilitacionesReporte } from "./utils/HabilitacionDia.js";
import { convertExcelToJson } from "./controllers/CrearJsonHabilitados.js";
import { ReportesExcel } from "./utils/ReportesExcel.js";
import { CrearJson } from "./controllers/ConstructorJson.js";
import { CrearJsonGeneral } from "./controllers/ConstructorGeneralJson.js";

async function ejecutarTareas() {
  try {
    console.log("Ejecutando ReportesExcel y luego CrearJson");
    await ReportesExcel();
    console.log("Iniciando proceso de creación de JSON.");
    await CrearJson();
    console.log("Proceso de creación de JSON finalizado.");
    await CrearJsonGeneral()
    console.log("Proceso de creación de JSON General finalizado.");
  } catch (error) {
    console.error("Error al ejecutar las tareas:", error);
  }
}

function scheduleTasks() {
  // // 6:55 am
  // cron.schedule("55 6 * * *", async () => {
  //   console.log("Ejecutando HilitacionesReporte a las 6:55 am");
  //   await HilitacionesReporte();
  //   convertExcelToJson();
  // });

  // // 7:25 am
  // cron.schedule("25 7 * * *", async () => {
  //   console.log("Ejecutando HilitacionesReporte a las 7:25 am");
  //   await HilitacionesReporte();
  //   convertExcelToJson();
  // });

  // // 7:45 am
  // cron.schedule("45 7 * * *", async () => {
  //   console.log("Ejecutando HilitacionesReporte a las 7:45 am");
  //   await HilitacionesReporte();
  //   convertExcelToJson();
  // });

  // // 8:25 am
  // cron.schedule("25 8 * * *", async () => {
  //   console.log("Ejecutando HilitacionesReporte a las 8:25 am");
  //   await HilitacionesReporte();
  //   convertExcelToJson();
  // });

  // 10:58 am
  cron.schedule("49 15 * * *", async () => {
    console.log("Ejecutando HilitacionesReporte a las 10:58 am");
    await ejecutarTareas()
   
  });
}


export default scheduleTasks;
