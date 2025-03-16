import express from "express";
import * as WorkflowDeploymentService from "../services/WorkflowDeploymentService.js";
import { workflowDeploymentRequestSchema } from "../schemas/WorkflowDeploymentRequestSchema.js";
import { NotFoundError } from "../services/WorkflowDeploymentService.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  const deployment = workflowDeploymentRequestSchema.safeParse(req.body);
  if (!deployment.success) {
    res.sendStatus(400);
  }
  try {
    const deploymentInfo = await WorkflowDeploymentService.createDeployment(
      deployment.data,
    );
    res.status(200).json(deploymentInfo);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const deploymentId = req.params.id;
    const result = await WorkflowDeploymentService.getDeployment(deploymentId);
    if (result === null) {
      res.sendStatus(404);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deploymentId = req.params.id;
    await WorkflowDeploymentService.deleteDeployment(deploymentId);
    res.sendStatus(200);
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.sendStatus(404);
    }
    console.error(err);
    return next(err);
  }
});

export default router;
