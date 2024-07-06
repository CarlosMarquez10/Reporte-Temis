import express from 'express';
import { uploadFile, downloadFile, getJsonData } from '../controllers/fileController.js';

const router = express.Router();

router.post('/upload', uploadFile);
router.get('/download', downloadFile);
router.get('/json-data', getJsonData); // Nueva ruta para el JSON

export default router;