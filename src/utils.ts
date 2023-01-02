import { PrettyError } from "./types";
import { Action, Job } from "./core";

export function isValidAction(action: Action) {
  if (!action.__isAction) {
    return false;
  }
  return true;
}

export function isValidArrayOfActions(actions: Action[]) {
  if (!actions) return false;
  if (!Array.isArray(actions)) return false;
  if (actions.some((x) => !isValidAction(x))) return false;
  return true;
}

export function isValidJob(action: Job) {
  if (!action.__isJob) {
    return false;
  }
  return true;
}
export function nullify(object: any) {
  const keys = Object.keys(object);
  for (const key of keys) {
    // eslint-disable-next-line no-param-reassign
    object[key] = null;
  }
}

export function toPrettyErr(err: Error): PrettyError {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack.split("\n"),
  };
}
