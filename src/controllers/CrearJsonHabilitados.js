import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para convertir número de serie de Excel a fecha
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);

  const seconds = total_seconds % 60;
  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

// Formatear fecha a cadena legible sin AM/PM
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return date.toLocaleString('es-ES', options).replace(',', '');
}

export async function convertExcelToJson() {
  try {
    // Ruta del archivo Excel (ajustada)
    const excelFilePath = path.join(__dirname, '..', 'Download', 'Reporte General Habilitaciones, Charlas, Vehiculos.xlsx');
    
    // Leer el archivo Excel
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convertir la hoja de Excel a un array de objetos
    let jsonData = xlsx.utils.sheet_to_json(sheet, { raw: true });

    // Conservar el formato de fecha como string y agregar hora_reporte
    const currentDate = new Date();
    const horaReporte = formatDate(currentDate);
    jsonData = jsonData.map(item => {
      if (item["Fecha Final De Ejecucion"]) {
        item["Fecha Final De Ejecucion"] = formatDate(excelDateToJSDate(item["Fecha Final De Ejecucion"]));
      }
      return {
        ...item,
        hora_reporte: horaReporte
      };
    });
    
    // Crear la carpeta 'models' si no existe
    const modelsDirPath = path.join(__dirname, '..', 'models');
    if (!fs.existsSync(modelsDirPath)) {
      fs.mkdirSync(modelsDirPath);
    }
    
    // Ruta del archivo JSON
    const jsonFilePath = path.join(modelsDirPath, 'RepoHabilitacion.json');
    
    // Escribir el array de objetos en un archivo JSON
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    
    console.log('El archivo JSON se ha creado correctamente en la carpeta models.');
  } catch (error) {
    console.error('Ocurrió un error:', error);
  }
}


