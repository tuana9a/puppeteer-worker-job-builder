import Action from "../Action";
import ActionLog from "../ActionLog";

export default class ReturnAction extends Action {
  constructor() {
    super(ReturnAction.name);
    this.withName(ReturnAction.name);
  }

  async run() {
    this.__context.isReturn = true;
    this.__context.logs.push(new ActionLog().fromAction(this));
  }
}
