import { Database } from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './pet-adoption.db',
  driver: Database
});

export const getDb = async () => {
  return dbPromise;
};