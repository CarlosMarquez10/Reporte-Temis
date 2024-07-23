import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const perfilesAuth = {
  DiegoMedina: 1090391002,
  EdgarMendoza: 88273237,
  JonathanEstupinan: 1090410612,
  AlvaroGonzalez: 88271021,
  EdsonJaimes: 1090379569,
  MarcosSuarez: 1090395283,
  MiryamSierra: 1093736192,
  AndersonOrtiz: 1092352956,
  MariaRodriguez: 60300528,
  HoberDavila: 1094662916,
  AlexisMartinez: 1090465860,
  SolRodriguez: 1090983561,
  CristianPeñaranda: 1091654268,
  JoseNovoa: 18926009,
  CristianNoriega: 1064841699,
  EudinContreras: 1090404495,
  EdgardoBayona: 88247516,
  EdgarTulio: 13473944,
  KarenPacheco: 1065874827,
  EduarCoral: 1116801169,
  FranciscoGalan: 5401549,
  AndresTovar: 88241861,


};

// Nuevo controlador para servir el archivo JSON
export const getJsonPerfil = (req, res) => {
  const { filename } = req.query; // Obtener el nombre del archivo de los parámetros de consulta

  // Eliminar espacio del nombre
  const nombreSinEspacio = filename.replace(" ", "");

  // Buscar el valor en el objeto
  const valorPerfil = perfilesAuth[nombreSinEspacio];

  if (valorPerfil) {
    // Concatenar .json al valor encontrado
    const jsonFileName = `${valorPerfil}.json`;
    const jsonFilePath = path.join(
      __dirname,
      "..",
      "Res",
      "Inspectores",
      jsonFileName
    );

    // Verificar si el archivo existe
    if (fs.existsSync(jsonFilePath)) {
      res.sendFile(jsonFilePath);
    } else {
      res.status(404).json({ error: "Archivo no encontrado" });
    }
  } else {
    res.status(404).json({ error: "Inspector no encontrado" });
  }
};

export const getJsonaGeneral = (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "Res",
    "Inspectores",
    "Generales.json"
  );

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: "Error al leer el archivo" });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      console.error("Error al parsear el JSON:", parseError);
      res.status(500).json({ error: "Error al procesar el archivo JSON" });
    }
  });
};
