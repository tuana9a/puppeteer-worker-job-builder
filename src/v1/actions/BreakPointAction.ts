import Action from "../Action";
import ActionLog from "../ActionLog";

export default class BreakPointAction extends Action {
  constructor() {
    super(BreakPointAction.name);
    this.withName(BreakPointAction.name);
  }

  async run() {
    this.__context.isBreak = true;
    this.__context.logs.push(new ActionLog({ action: this.getName() }).now());
  }
}
