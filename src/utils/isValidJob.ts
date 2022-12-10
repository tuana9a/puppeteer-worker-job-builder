import Job from "../Job";

export default function isValidJob(action: Job) {
  if (!action.__isJob) {
    return false;
  }
  return true;
}
