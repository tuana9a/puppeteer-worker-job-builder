import Action from "./actions/Action";
import Job from "./Job";

export function isValidAction(action: Action) {
  if (!action) {
    return false;
  }
  if (!action.withPayload) {
    return false;
  }
  if (!action.withName) {
    return false;
  }
  if (!action.withHandler) {
    return false;
  }
  if (!action.run) {
    return false;
  }
  if (!action._run) {
    return false;
  }
  // IfAction not use handler so not check handler
  if (!action.__isMeAction) {
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

export function isValidJob(job: Job) {
  if (!job) {
    return false;
  }
  if (!Array.isArray(job.actions)) {
    return false;
  }
  if (job.actions.length === 0) {
    return false;
  }
  if (!job.actions.every((x) => isValidAction(x))) {
    return false;
  }
  return true;
}
