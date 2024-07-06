import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = (req, res) => {
  // Implementación del controlador uploadFile
};

export const downloadFile = (req, res) => {
  // Implementación del controlador downloadFile
};

// Nuevo controlador para servir el archivo JSON
export const getJsonData = (req, res) => {
  const jsonFilePath = path.join(__dirname, '..', 'models', 'RepoHabilitacion.json');
  res.sendFile(jsonFilePath);
};