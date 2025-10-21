import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import petsRoutes from './routes/pets';
import adoptersRoutes from './routes/adopters';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/pets', petsRoutes);
app.use('/api/adopters', adoptersRoutes);

const startServer = async () => {
    try {
        const db = await createConnection({ filename: './db/pet-adoption.db' });
        console.log('Connected to the database.');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

startServer();