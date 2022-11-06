export default class DoingInfo {
  job: string;

  action: string;

  stepIdx: number;

  nestingLevel: number;

  stacks: string[];

  at: number;

  constructor({ job, action, stepIdx, nestingLevel, stacks }: DoingInfo) {
    this.job = job;
    this.action = action;
    this.stepIdx = stepIdx;
    this.nestingLevel = nestingLevel;
    this.stacks = stacks;
    this.at = Date.now();
  }
}
