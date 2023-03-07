import express from 'express';
const app = express();

import playersRouter from './routes/playersRoutes';
import clubsRouter from './routes/clubsRoutes';

app.use(express.json());

app.use('/players', playersRouter);
app.use('/clubs', clubsRouter);

app.use((req, res) => {
    return res.status(404).send('404 - Not Found');
});

let port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
    console.log(`Server listening on port: ${port}...`);
});
