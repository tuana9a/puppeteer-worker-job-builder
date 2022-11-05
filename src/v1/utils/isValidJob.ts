import Job from "../Job";

export default function isValidJob(action: Job) {
  if (!action.__isMeJob) {
    return false;
  }
  return true;
}
