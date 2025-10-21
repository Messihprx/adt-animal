import express from 'express';
import { json } from 'body-parser';
import { router as petsRouter } from './server/routes/pets';
import { router as adoptersRouter } from './server/routes/adopters';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use('/api/pets', petsRouter);
app.use('/api/adopters', adoptersRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});