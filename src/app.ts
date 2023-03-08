import express from 'express';
const app = express();

import playersRouter from './routes/playersRoutes';
import clubsRouter from './routes/clubsRoutes';
import {reqLogger} from './middleware/requestLogger';
import {errors, notFoundError} from './middleware/errors';

app.use(express.json());
app.use(reqLogger);

app.use('/players', playersRouter);
app.use('/clubs', clubsRouter);

app.use(notFoundError);
app.use(errors);

let port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}...`);
});
