import JobBuilderError from "./JobBuilderError";

export default class InvalidJobError extends JobBuilderError {
  constructor(jobName: string) {
    super(`Invalid job "${jobName}"`);
  }
}
