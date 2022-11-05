import Action from "../Action";
import ActionLog from "../ActionLog";

export default class ReloadAction extends Action {
  constructor() {
    super(ReloadAction.name);
  }

  async run() {
    this.__context.logs.push(new ActionLog({ action: this.getName() }).now());
    await this.__context.page.reload();
  }
}
