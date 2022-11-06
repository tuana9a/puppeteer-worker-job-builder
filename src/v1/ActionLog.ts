import Action from "./Action";

export default class ActionLog {
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
