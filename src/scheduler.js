import cron from 'node-cron';
import { HilitacionesReporte } from './utils/HabilitacionDia.js';
import { convertExcelToJson } from "../src/controllers/CrearJsonHabilitados.js";

// Definir una función que programe las tareas
function scheduleTasks() {
  // 6:50 am
  cron.schedule('55 6 * * *', async () => {
    console.log('Ejecutando HilitacionesReporte a las 6:50 am');
    await HilitacionesReporte();
    convertExcelToJson();
  });

  // 7:20 am
  cron.schedule('25 7 * * *', async () => {
    console.log('Ejecutando HilitacionesReporte a las 7:20 am');
    await HilitacionesReporte();
    convertExcelToJson();
  });

  // 7:50 am
  cron.schedule('55 7 * * *', async () => {
    console.log('Ejecutando HilitacionesReporte a las 7:50 am');
    await HilitacionesReporte();
    convertExcelToJson();
  });

  // 8:30 am
  cron.schedule('35 8 * * *', async () => {
    console.log('Ejecutando HilitacionesReporte a las 8:30 am');
    await HilitacionesReporte();
    convertExcelToJson();
  });

  // 10:30 pm
//   cron.schedule('35 22 * * *', async () => {
//     console.log('Ejecutando HilitacionesReporte a las 10:30 pm');
//     await HilitacionesReporte();
//     convertExcelToJson();
//   });
}

// Exportar la función de programación de tareas
export default scheduleTasks;
