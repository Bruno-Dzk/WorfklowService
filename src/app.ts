import express from 'express';
import LambdaRouter from './routes/LambdaRouter.js'

const app = express();
const port = 3000;

app.use("/lambda", LambdaRouter);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});