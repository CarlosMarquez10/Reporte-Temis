import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initializeDatabase = async () => {
  const db = await open({
    filename: process.env.DATABASE_URL,
    driver: sqlite3.Database
  });

  await db.exec("CREATE TABLE IF NOT EXISTS files (name TEXT, content BLOB)");

  return db;
};

export const saveFile = async (db, name, content) => {
  await db.run("INSERT INTO files (name, content) VALUES (?, ?)", [name, content]);
};

export const readFile = async (db, name) => {
  const file = await db.get("SELECT content FROM files WHERE name = ?", [name]);
  return file ? file.content : null;
};
