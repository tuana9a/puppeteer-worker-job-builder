/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */

import { OnDoing, RunContextFunction } from "./types";
import { nullify } from "./utils";

export class Context {
  job: string;

  page: any;

  libs: any;

  params: any;

  /**
   * custom vars at runtime
   * system vars will have double underscrore "__"
   */
  vars: any;

  currentStepIdx: number;

  currentNestingLevel: number;

  isBreak: boolean;

  isReturn: boolean;

  stacks: Action[];

  logs: ActionLog[];

  runContext: RunContextFunction;

  doing: OnDoing;

  constructor({
    job,
    page,
    libs,
    params,
    vars,
    currentStepIdx,
    currentNestingLevel,
    isBreak,
    isReturn,
    stacks,
    logs,
    runContext,
    doing,
  }: {
    job: string;

    page: any;

    libs: any;

    params: any;

    vars?: any;

    currentStepIdx: number;

    currentNestingLevel: number;

    isBreak: boolean;

    isReturn?: boolean;

    stacks: Action[];

    logs: ActionLog[];

    runContext: RunContextFunction;

    doing?: OnDoing;
  }) {
    this.job = job;
    this.page = page;
    this.libs = libs;
    this.params = params;
    this.vars = vars || {}; // create new vars if not have one
    this.currentStepIdx = currentStepIdx;
    this.currentNestingLevel = currentNestingLevel;
    this.isBreak = isBreak;
    this.isReturn = isReturn;
    this.stacks = stacks;
    this.logs = logs;
    this.runContext = runContext;
    this.doing = doing || (() => null);
  }

  destroy() {
    let action = this.stacks.pop();

    while (action) {
      action = this.stacks.pop();
    }
  }
}

export class Action {
  __isAction: boolean;

  __type: string;

  __context: Context;

  name: string;

  stepIdx: number;

  nestingLevel: number;

  constructor(type: string) {
    this.__type = type;
    this.__isAction = true;
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  getName() {
    return this.name;
  }

  withContext(context: Context) {
    this.__context = context;
    return this;
  }

  setStepIdx(step: number) {
    this.stepIdx = step;
  }

  setNestingLevel(level: number) {
    this.nestingLevel = level;
  }

  destroy() {
    nullify(this);
  }

  // eslint-disable-next-line class-methods-use-this
  run(): Promise<any> {
    return Promise.resolve(0);
  }
}

export class ActionLog {
  action: string;

  type: string;

  stepIdx: number;

  nestingLevel: number;

  // eslint-disable-next-line no-use-before-define
  nestingLogs: ActionLog[];

  output: any;

  error: any;

  at: number;

  constructor() {
    this.at = Date.now();
  }

  fromAction(action: Action) {
    this.action = action.getName();
    this.type = action.__type;
    this.stepIdx = action.stepIdx;
    this.nestingLevel = action.nestingLevel;
    return this;
  }

  withOutput(output: any) {
    this.output = output;
    return this;
  }

  withError(error: any) {
    this.error = error;
    return this;
  }

  nesting(logs: ActionLog[]) {
    this.nestingLogs = logs;
    return this;
  }

  createdAt(at: number) {
    this.at = at;
    return this;
  }

  now() {
    this.at = Date.now();
    return this;
  }
}

export class DoingInfo {
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

export class Job {
  name: string;

  params: any;

  libs: any;

  actions: Action[];

  __isJob: boolean;

  constructor({ name, actions }: Job) {
    this.name = name;
    this.actions = actions;
    this.__isJob = true;
  }
}
