export default class DoingInfo {
  job: string;

  action: string;

  stacks: string[];

  at: number;

  constructor({ job, action, stacks }: DoingInfo) {
    this.job = job;
    this.action = action;
    this.stacks = stacks;
    this.at = Date.now();
  }
}
