import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { User, Password } from "../config.js";
import fs from "fs";

export async function NoComformeRepo() {
  // Obtiene la ruta del directorio del módulo actual
  const dirname = path.dirname(fileURLToPath(import.meta.url));

  // Define la ruta de la carpeta del proyecto donde quieres guardar el archivo
  const downloadPath = path.resolve(dirname, "../Download");

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    ignoreHTTPSErrors: true, // Ignora los errores de certificado
    defaultViewport: { width: 1024, height: 800 }, // Ajusta el tamaño de la ventana

  });



  const page = await browser.newPage();

  // Crea una nueva sesión del Protocolo de Depuración de Chrome
  const client = await page.target().createCDPSession();

  // Habilita la descarga en la página
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  await page.goto("https://temis.inmel.co/004/dist/#/login", {
    waitUntil: 'networkidle0', // Espera hasta que no haya más de 0 conexiones de red durante al menos 500 ms
  });

  // Espera a que los campos de entrada estén disponibles
  await page.waitForSelector("#inputEmail", { visible: true });
  await page.waitForSelector("#inputPassword", { visible: true });

  // Llena el formulario
  await page.type("#inputEmail", User);
  await page.type("#inputPassword", Password);

  // Opcional: Espera un poco después de llenar los campos para asegurarte de que la acción tenga tiempo de completarse
  await new Promise((r) => setTimeout(r, 2000));

  // Haz clic en el botón de Ingresar
  await page.click("button.btn.btn-primary");

  // Opcional: Espera un poco después de hacer clic para asegurarte de que la acción tenga tiempo de completarse
  await new Promise((r) => setTimeout(r, 2000));

  // Espera a que el enlace de la lista desplegable esté disponible
  await page.waitForSelector('a[data-toggle="collapse"][data-target="#NCyPlanesdeAcción"]');

  // Haz clic en el enlace para desplegar la lista
  await page.click('a[data-toggle="collapse"][data-target="#NCyPlanesdeAcción"]');

  // Opcional: Espera un poco después de hacer clic para asegurarte de que la lista se despliegue
  await new Promise((r) => setTimeout(r, 2000));

  // Espera a que el elemento de la lista esté disponible
  await page.waitForSelector('a[href="#/reporte/1058"]');

  // Haz clic en el elemento de la lista
  await page.click('a[href="#/reporte/1058"]');

  // Opcional: Espera un poco después de hacer clic para asegurarte de que la acción tenga tiempo de completarse
  await new Promise((r) => setTimeout(r, 15000));

  // Espera a que los botones del formulario estén disponibles
  await page.waitForSelector('section.col-md-12', {visible: true});
  await new Promise((r) => setTimeout(r, 5000));
  // Espera a que los campos de fecha estén disponibles
  await page.waitForSelector('input[name="FechaDocumento"]', {visible: true});
  await page.waitForSelector('input[name="FechaDocumento_adicional"]', {visible: true});

  // Espera dos segundos antes de ingresar la fecha desde
  await new Promise((r) => setTimeout(r, 2000));

  // Obtener la fecha actual y el primer día del mes
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const formattedFirstDay = firstDayOfMonth.toLocaleDateString("en-GB"); // '01/07/2024'
  const formattedCurrentDate = currentDate.toLocaleDateString("en-GB"); // '05/07/2024'

  // Llena el campo de fecha desde
  await page.type('input[name="FechaDocumento"]', formattedFirstDay);

  // Espera dos segundos antes de ingresar la fecha hasta
  await new Promise((r) => setTimeout(r, 2000));

  // Llena el campo de fecha hasta
  await page.type('input[name="FechaDocumento_adicional"]', formattedCurrentDate);

  // Opcional: Espera un poco después de llenar los campos para asegurarte de que la acción tenga tiempo de completarse
  await new Promise((r) => setTimeout(r, 5000));

  // Espera a que el campo de nombre de proyecto esté disponible
  await page.waitForSelector('input[id="p.Codigo_value"]');

  // Llena el campo de nombre de proyecto
  await page.type('input[id="p.Codigo_value"]', "09H");

  await new Promise((r) => setTimeout(r, 1000));

  await page.waitForSelector('button[ng-click="ValidarCampos() && GenerarReporteTabla()"]', {visible: true});
  await page.click('button[ng-click="ValidarCampos() && GenerarReporteTabla()"]');


  // Opcional: Espera un poco después de hacer clic para asegurarte de que la lista se despliegue
  await new Promise((r) => setTimeout(r, 1000));

  // Verifica si el archivo se descargó
  const fileName = "Reporte No Conformidades.xlsx"; // Cambia esto al nombre real del archivo
  const fileDownloaded = fs.existsSync(path.join(downloadPath, fileName));
  await new Promise((r) => setTimeout(r, 50000));
  await browser.close();

  return fileDownloaded;
}

// NoComformeRepo()