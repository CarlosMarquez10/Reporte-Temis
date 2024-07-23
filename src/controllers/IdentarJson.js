import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Esto es necesario porque estás usando módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de archivos a las claves de indentación
const fileKeyMap = {
    'PERSONAL INMEL 009H.json': 'N° de cédula',
    'Reporte Atento NEW.json': 'Codigo Inspector',
    'Reporte General Insp. ESSA Cens.json': 'Codigo Inspector',
    'Reporte No Conformidades.json': 'Codigo Detector'
     // 'RepoHabilitacion.json': 'Codigo Inspector',
};

export async function readAndTransformJson(fileName) {
    const filePath = path.resolve(__dirname, '../models', fileName);
    const key = fileKeyMap[fileName];

    if (!key) {
        console.error(`No se encontró una clave de indentación para el archivo: ${fileName}`);
        return;
    }

    try {
        // Leer el archivo JSON
        const data = await fs.readFile(filePath, 'utf8');

        // Verificar si el JSON está vacío
        if (!data.trim()) {
            console.log(`El archivo ${fileName} está vacío. Se omitirá.`);
            return;
        }

        // Parsear el contenido del archivo
        const jsonData = JSON.parse(data);

        // Transformar los datos
        const transformedData = jsonData.reduce((acc, item) => {
            const cedula = item[key];
            acc[cedula] = item;
            return acc;
        }, {});

        // Escribir los datos transformados nuevamente en el archivo sin indentación
        await fs.writeFile(filePath, JSON.stringify(transformedData));
        console.log(`Archivo ${fileName} transformado y guardado exitosamente.`);
    } catch (err) {
        console.error('Error:', err);
    }
}

export const files = Object.keys(fileKeyMap);
