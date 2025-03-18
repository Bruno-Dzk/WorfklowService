import express from "express";
import HealthCheckRouter from "./routes/HealthCheckRouter.js";
import WorkflowRouter from "./routes/WorkflowRouter.js";
import WorkflowDeploymentRouter from "./routes/WorkflowDeploymentRouter.js";

const app = express();
const port = 3000;

const mainRouter = express.Router();

mainRouter.use("/healthcheck", HealthCheckRouter);
mainRouter.use(WorkflowDeploymentRouter);
mainRouter.use(WorkflowRouter);

app.use(express.json());

app.use("/workflow-service", mainRouter);
app.use((err, req, res, next) => {
  // Log the error stack for debugging
  console.error(err.stack);

  // Respond with a 500 status code and a JSON error message
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
