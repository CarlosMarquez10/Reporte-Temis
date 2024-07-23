import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadDir = path.join(__dirname, '../Download');
const modelsDir = path.join(__dirname, '../models');

// Crear la carpeta models si no existe
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

// Archivos a procesar
const files = [
  'PERSONAL INMEL 009H.xlsx',
  'Reporte Atento NEW.xlsx',
  'Reporte General Insp. ESSA Cens.xlsx',
  'Reporte No Conformidades.xlsx'
];

// Función para verificar la existencia de los archivos
async function checkFilesExist() {
  files.forEach(file => {
    const filePath = path.join(downloadDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`${file} existe.`);
    } else {
      console.log(`${file} no existe.`);
    }
  });
}

// Función para leer y convertir los archivos Excel a JSON
async function processFiles() {
  files.forEach(file => {
    const filePath = path.join(downloadDir, file);
    if (fs.existsSync(filePath)) {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null }); // Include all columns

      // Get all unique column headers
      const headers = new Set();
      jsonData.forEach(row => {
        Object.keys(row).forEach(header => headers.add(header));
      });

      // Ensure all rows have all headers
      const normalizedData = jsonData.map(row => {
        const normalizedRow = {};
        headers.forEach(header => {
          normalizedRow[header] = row[header] || null;
        });
        return normalizedRow;
      });

      const jsonFileName = file.replace('.xlsx', '.json');
      const jsonFilePath = path.join(modelsDir, jsonFileName);

      fs.writeFileSync(jsonFilePath, JSON.stringify(normalizedData, null, 2));
      console.log(`Datos de ${file} guardados en ${jsonFileName}`);
    } else {
      console.log(`${file} no existe.`);
    }
  });
}

export { checkFilesExist, processFiles };
