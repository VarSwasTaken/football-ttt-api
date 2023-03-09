import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

import playersRouter from './routes/playersRoutes';
import clubsRouter from './routes/clubsRoutes';
import {reqLogger} from './middleware/requestLogger';
import {notFoundError, catchErrors} from './middleware/errors';

const app = express();

app.disable('x-powered-by');
app.use(
    rateLimit({
        windowMs: 60 * 1000,
        max: 60,
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(reqLogger);

app.use('/players', playersRouter);
app.use('/clubs', clubsRouter);

app.use(notFoundError);
app.use(catchErrors);

let port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
    console.log(`Server listening on port: ${port}...`);
});
