import Action from "../Action";
import ActionLog from "../ActionLog";

export default class BringToFrontAction extends Action {
  constructor() {
    super(BringToFrontAction.name);
  }

  async run() {
    this.__context.logs.push(new ActionLog({ action: this.getName() }).now());

    await this.__context.page.bringToFront();
  }
}
