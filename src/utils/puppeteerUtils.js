import puppeteer from 'puppeteer';
import fs from 'fs';

export const downloadFile = async (url, path) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
    // Lógica para extraer el contenido del archivo
    return document.querySelector('body').innerText; // Ejemplo básico
  });

  fs.writeFileSync(path, data);
  await browser.close();
};
