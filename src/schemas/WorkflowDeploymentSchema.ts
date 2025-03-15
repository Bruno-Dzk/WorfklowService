import { z } from "zod";

export const workflowDeploymentSchema = z.object({
  modules: z.string().array(),
});

export type WorkflowDeployment = z.infer<typeof workflowDeploymentSchema>;
