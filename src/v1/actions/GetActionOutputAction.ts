import Action from "../Action";
import ActionLog from "../ActionLog";
import InvalidGetActionOutputOptsError from "../errors/InvalidGetActionOutputOptsError";
import GetActionOutputOpts from "../types/GetActionOutputOpts";

export default class GetActionOutputAction extends Action {
  which: GetActionOutputOpts;

  constructor(which: GetActionOutputOpts) {
    super(GetActionOutputAction.name);
    this.which = which;
  }

  async run() {
    if (Number.isSafeInteger(this.which.direct)) {
      const value = this.__context.outputs[this.which.direct];
      this.__context.logs.push(new ActionLog({ action: this.getName(), output: value }).now());
      return value;
    }
    if (Number.isSafeInteger(this.which.fromCurrent)) {
      const value = this.__context.outputs[this.__context.currentStepIdx + this.which.fromCurrent];
      this.__context.logs.push(new ActionLog({ action: this.getName(), output: value }).now());
      return value;
    }
    throw new InvalidGetActionOutputOptsError(this.which);
  }
}
