import InvalidGetActionOutputOptsError from "../errors/InvalidGetActionOutputOptsError";
import { GetActionOutputOpts } from "../types";
import Action from "./Action";

export default class GetActionOutputAction extends Action {
  which: GetActionOutputOpts;

  constructor(which: GetActionOutputOpts) {
    super(GetActionOutputAction.name);
    this.which = which;
  }

  async run() {
    if (Number.isSafeInteger(this.which.direct)) {
      return this.outputs[this.which.direct];
    }
    if (Number.isSafeInteger(this.which.fromCurrent)) {
      return this.outputs[this.currentIdx + this.which.fromCurrent];
    }
    throw new InvalidGetActionOutputOptsError(this.which);
  }
}
