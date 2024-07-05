import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { downloadFile as downloadFileFromPuppeteer } from '../utils/puppeteerUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = (req, res) => {
  if (!req.body.fileName || !req.body.content) {
    return res.status(400).send('Missing fileName or content');
  }

  const filePath = path.join(__dirname, '../../Download', req.body.fileName);

  fs.writeFile(filePath, req.body.content, (err) => {
    if (err) {
      return res.status(500).send('Error saving file');
    }
    res.send('File saved successfully');
  });
};

export const downloadFile = async (req, res) => {
  const fileUrl = req.query.url;
  const filePath = path.join(__dirname, '../../Download', 'archivoDescargado.xlsx');

  await downloadFileFromPuppeteer(fileUrl, filePath);
  res.download(filePath);
};
