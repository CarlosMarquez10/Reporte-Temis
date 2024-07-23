import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fileRoutes from "./routes/fileRoutes.routes.js";
import dotenv from "dotenv";
import { PORT } from "./config.js";
import scheduleTasks from "./scheduler.js"; // Importar la función de programación de tareas

dotenv.config();

const app = express();

// Necesario para resolver __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/download", express.static(path.join(__dirname, "../Download")));

app.use("/api/files", fileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  scheduleTasks();
});
