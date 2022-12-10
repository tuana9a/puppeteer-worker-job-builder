// eslint-disable-next-line import/no-extraneous-dependencies
import { Page } from "puppeteer-core";
import ActionLog from "./ActionLog";
import Action from "./Action";
import DoingInfo from "./DoingInfo";
import RunContextFunction from "./types/RunContextFunction";

export default class Context {
  job: string;

  page: Page;

  libs: any;

  params: any;

  currentStepIdx: number;

  currentNestingLevel: number;

  isBreak: boolean;

  isReturn: boolean;

  stacks: Action[];

  logs: ActionLog[];

  runContext: RunContextFunction;

  // eslint-disable-next-line no-unused-vars
  doing: (info: DoingInfo) => Promise<any>;

  constructor({
    job,
    page,
    libs,
    params,
    currentStepIdx,
    currentNestingLevel,
    isBreak,
    isReturn,
    stacks,
    logs,
    runContext,
  }: {
    job: string;

    page: Page;

    libs: any;

    params: any;

    currentStepIdx: number;

    currentNestingLevel: number;

    isBreak: boolean;

    isReturn?: boolean;

    stacks: Action[];

    logs: ActionLog[];

    runContext: RunContextFunction;
  }) {
    this.job = job;
    this.page = page;
    this.libs = libs;
    this.params = params;
    this.currentStepIdx = currentStepIdx;
    this.currentNestingLevel = currentNestingLevel;
    this.isBreak = isBreak;
    this.isReturn = isReturn;
    this.stacks = stacks;
    this.logs = logs;
    this.runContext = runContext;
    this.doing = () => null;
  }

  // eslint-disable-next-line no-unused-vars
  onDoing(listener: (info: DoingInfo) => Promise<any>) {
    this.doing = listener;
    return this;
  }

  destroy() {
    let action = this.stacks.pop();

    while (action) {
      action = this.stacks.pop();
    }
  }
}
