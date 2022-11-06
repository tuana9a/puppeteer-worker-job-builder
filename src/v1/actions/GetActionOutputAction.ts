import Action from "../Action";
import ActionLog from "../ActionLog";
import InvalidGetActionOutputOptsError from "../errors/InvalidGetActionOutputOptsError";
import GetActionOutputOpts from "../types/GetActionOutputOpts";

export default class GetValueFromOutputAction extends Action {
  opts: GetActionOutputOpts;

  constructor(opts: GetActionOutputOpts) {
    super(GetValueFromOutputAction.name);
    this.opts = opts;
  }

  async run() {
    if (Number.isSafeInteger(this.opts.direct)) {
      const value = this.__context.logs[this.opts.direct].output;
      this.__context.logs.push(new ActionLog().fromAction(this).withOutput(value));
      return value;
    }
    if (Number.isSafeInteger(this.opts.fromCurrent)) {
      const value = this.__context.logs[this.__context.currentStepIdx + this.opts.fromCurrent].output;
      this.__context.logs.push(new ActionLog().fromAction(this).withOutput(value));
      return value;
    }
    throw new InvalidGetActionOutputOptsError(this.opts);
  }
}
