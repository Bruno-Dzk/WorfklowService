import express from 'express';
import HealthCheckRouter from './routes/HealthCheckRouter.js'

const app = express();
const port = 3000;

const mainRouter = express.Router();

mainRouter.use("/healthcheck", HealthCheckRouter);

app.use("/workflow-service", mainRouter);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});