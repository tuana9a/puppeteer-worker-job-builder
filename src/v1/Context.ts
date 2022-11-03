import ActionLog from "./ActionLog";
import Action from "./Action";
import DoingInfo from "./DoingInfo";
import RunContextFunction from "./types/RunContextFunction";
import nullify from "./utils/nullify";

export default class Context {
  jobName: string;

  page: any;

  libs: any;

  params: any;

  currentStepIdx: number;

  currentNestingLevel: number;

  isBreak: boolean;

  stacks: Action[];

  outputs: any[];

  logs: ActionLog[];

  actionsToDestroy: Action[]; // ran-ed actions

  runContext: RunContextFunction;

  // eslint-disable-next-line no-unused-vars
  _onDoing: (info: DoingInfo) => Promise<any>;

  constructor({
    jobName,
    page,
    libs,
    params,
    currentStepIdx,
    currentNestingLevel,
    isBreak,
    stacks,
    logs,
    outputs,
    runContext,
    actionsToDestroy,
    _onDoing,
  }: {
    jobName: string;

    page: any;

    libs: any;

    params: any;

    currentStepIdx: number;

    currentNestingLevel: number;

    isBreak: boolean;

    stacks: Action[];

    outputs: any[];

    logs: ActionLog[];

    actionsToDestroy: Action[];

    runContext: RunContextFunction;

    // eslint-disable-next-line no-unused-vars
    _onDoing?: (info: DoingInfo) => Promise<any>;
  }) {
    this.jobName = jobName;
    this.page = page;
    this.libs = libs;
    this.params = params;
    this.currentStepIdx = currentStepIdx;
    this.currentNestingLevel = currentNestingLevel;
    this.isBreak = isBreak;
    this.stacks = stacks;
    this.logs = logs;
    this.outputs = outputs;
    this.runContext = runContext;
    this._onDoing = _onDoing;
    this.actionsToDestroy = actionsToDestroy;
  }

  // eslint-disable-next-line no-unused-vars
  onDoing(listener: (info: DoingInfo) => Promise<any>) {
    this._onDoing = listener;
  }

  destroy() {
    let action = this.stacks.pop();

    while (action) {
      action.destroy();
      action = this.stacks.pop();
    }

    action = this.actionsToDestroy.shift();

    while (action) {
      action.destroy();
      action = this.actionsToDestroy.shift();
    }
  }
}
