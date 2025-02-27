import express from 'express';
import HealthCheckRouter from './routes/HealthCheckRouter.js'

const app = express();
const port = 3003;

app.use("/healthcheck", HealthCheckRouter);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});