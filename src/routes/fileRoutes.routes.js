import express from 'express';
import { uploadFile, downloadFile, getJsonData } from '../controllers/fileController.js';
import { getJsonPerfil, getJsonaGeneral } from "../controllers/ControllerPerfiles.js";

const router = express.Router();

router.post('/upload', uploadFile);
router.get('/download', downloadFile);
router.get('/json-data', getJsonData); // Nueva ruta para el JSON
router.get('/json-perfil', getJsonPerfil); // Ruta para obtener el perfil JSON
router.get('/jsonGeneral', getJsonaGeneral )

export default router;


//GET http://localhost:3000/api/files/json-perfil?filename=88271021.json
//http://localhost:3000/api/files/jsonGeneral   -- para los general 