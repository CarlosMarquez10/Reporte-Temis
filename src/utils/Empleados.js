import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import { UserCorreo, Password } from "../config.js";
import fs from "fs";

export async function ArchivoEmpleado() {
  // Verifica que User y Password son cadenas de texto
  if (typeof UserCorreo !== "string" || typeof Password !== "string") {
    console.error("User o Password no son cadenas de texto válidas");
    return false;
  }

  console.log(`User: ${UserCorreo}, Password: ${Password}`); // Para verificar que se están cargando correctamente

  // Obtiene la ruta del directorio del módulo actual
  const dirname = path.dirname(fileURLToPath(import.meta.url));

  // Define la ruta de la carpeta del proyecto donde quieres guardar el archivo
  const downloadPath = path.resolve(dirname, "../Download");

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    ignoreHTTPSErrors: true, // Ignora los errores de certificado
    defaultViewport: { width: 1280, height: 800 }, // Ajusta el tamaño de la ventana
  });
  const page = await browser.newPage();

  // Crea una nueva sesión del Protocolo de Depuración de Chrome
  const client = await page.target().createCDPSession();

  // Habilita la descarga en la página
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadPath,
  });

  // Asegúrate de que la URL sea correcta
  await page.goto("https://inmelingenieria.sharepoint.com/sites/009H/Documentos%20compartidos/Forms/AllItems.aspx?RootFolder=%2Fsites%2F009H%2FDocumentos%20compartidos%2F2%2DHacer%2F10%2DAprovisionamiento%2F1%2EMaterializaci%C3%B3n%2F3%2E%20Consolidados%20e%20Inspecciones%2FVARIOS%2FPERSONAL%20CONTRATO%20009H&FolderCTID=0x012000A7E513CE7D79E743A8F571BFCA4C449C&View=%7BF8B4F58D%2D5DBA%2D4B9A%2D9C01%2DE86388CD246C%7D", { waitUntil: 'networkidle0' });

  await page.waitForSelector('div[id="lightbox"]');
  // Espera a que los campos de entrada estén disponibles 
  await page.waitForSelector("#i0116");

  // Llena el formulario
  await page.type("#i0116", UserCorreo);

  await page.waitForSelector('input[id="idSIButton9"]');
  await page.click('input[id="idSIButton9"]');

  // Opcional: Espera un poco después de hacer clic para asegurarte de que la lista se despliegue
  await new Promise((r) => setTimeout(r, 2000));
  await page.waitForSelector('div[id="lightbox"]');
  await page.waitForSelector("#i0118");
  await page.type("#i0118", Password);
  await page.waitForSelector('input[id="idSIButton9"]');
  await page.click('input[id="idSIButton9"]');

  await page.waitForSelector('div[id="lightbox"]');
  await page.waitForSelector('input[id="idSIButton9"]');
  await page.click('input[id="idSIButton9"]');

  // Esperar a que el selector esté disponible
  await page.waitForSelector('div.ms-list-itemLink');

  // Hacer clic en el div
  await page.click('div.ms-list-itemLink');

  await page.waitForSelector('a.js-callout-action');
  await new Promise((r) => setTimeout(r, 1000));
  await page.click('a.js-callout-action');

  await page.waitForSelector('a#ID_DownloadACopy');
  await new Promise((r) => setTimeout(r, 1000));
  await page.click('a#ID_DownloadACopy');

  // Esperar a que se complete la descarga
  await new Promise((r) => setTimeout(r, 5000));

  // Verifica si el archivo se descargó
  const fileName = "PERSONAL INMEL 009H.xlsx"; // Cambia esto al nombre real del archivo
  const fileDownloaded = fs.existsSync(path.join(downloadPath, fileName));
  await new Promise((r) => setTimeout(r, 30000));
  await browser.close();

  return fileDownloaded;
}

