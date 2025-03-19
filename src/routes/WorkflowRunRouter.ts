import { Router } from "express";
import * as WorkflowRunService from "../services/WorkflowRunService.js";
import { StateMachineDoesNotExist } from "@aws-sdk/client-sfn";
import { authenticateJwt } from "../middlewares/AuthenticateJwt.js";
import { authorizeOrganization } from "../middlewares/AuthorizeOrganizationMiddleware.js";
import { RunDetails } from "../services/WorkflowRunService.js";

const router = Router();

router.post(
  "/organizations/:organization/workflows/:workflow/runs",
  authenticateJwt,
  authorizeOrganization,
  async (req, res, next) => {
    const workflowName = req.params.workflow;
    try {
      const runDetails = await WorkflowRunService.createExecution(workflowName);
      res.status(201).json(runDetails);
    } catch (err) {
      if (err instanceof StateMachineDoesNotExist) {
        res.sendStatus(404);
      }
      console.error(err);
      return next(err);
    }
  },
);

router.get(
  "/organizations/:organization/workflows/:workflow/runs/:run",
  authenticateJwt,
  authorizeOrganization,
  async (req, res, next) => {
    const workflowName = req.params.workflow;
    const runId = req.params.run;
    try {
      const runDetails = new RunDetails(workflowName, runId);
      const result = await WorkflowRunService.getExecution(runDetails);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof StateMachineDoesNotExist) {
        res.sendStatus(404);
      }
      console.error(err);
      return next(err);
    }
  },
);

export default router;
