// @ts-nocheck

import { db } from ".";
import { tasks, steps } from "./schema";
import { eq } from "drizzle-orm";

async function getRandomTaskStepsA() {
  // Get a random task first
  const [randomTask] = await db.select({ id: tasks.id }).from(tasks).limit(1);

  if (!randomTask) {
    throw new Error("No tasks found");
  }

  // Get all steps for this task
  const taskSteps = await db
    .select()
    .from(steps)
    .where(eq(steps.taskId, randomTask.id))
    .orderBy(steps.order);

  return taskSteps;

  // {
  //   id: string;
  //   type: "TUTORIAL" | "EXAMPLE" | "QUESTION";
  //   order: number;
  //   content: StepContent;
  //   taskId: string;
  // }[]
}

async function getRandomTaskStepsB() {
  // Get a random task first
  const [randomTask] = await db.select({ id: tasks.id }).from(tasks).limit(1);

  if (!randomTask) {
    throw new Error("No tasks found");
  }

  // Get all tutorial steps for this task
  const tutorialSteps = await db
    .select()
    .from(tutorialSteps)
    .where(eq(tutorialSteps.taskId, randomTask.id))
    .orderBy(tutorialSteps.order);

  // Get all example steps for this task
  const exampleSteps = await db
    .select()
    .from(exampleSteps)
    .where(eq(exampleSteps.taskId, randomTask.id))
    .orderBy(exampleSteps.order);

  // Get all question steps for this task
  const questionSteps = await db
    .select()
    .from(questionSteps)
    .where(eq(questionSteps.taskId, randomTask.id))
    .orderBy(questionSteps.order);

  // Combine all steps
  // order them by order
  const combinedSteps = [
    ...tutorialSteps,
    ...exampleSteps,
    ...questionSteps,
  ].sort((a, b) => a.order - b.order);

  return combinedSteps;
}
