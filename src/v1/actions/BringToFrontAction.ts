import Action from "../Action";
import ActionLog from "../ActionLog";

export default class BringToFrontAction extends Action {
  constructor() {
    super(BringToFrontAction.name);
  }

  async run() {
    this.__context.logs.push(new ActionLog().fromAction(this));

    await this.__context.page.bringToFront();
  }
}
