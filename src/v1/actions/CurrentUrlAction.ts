import Action from "../Action";
import ActionLog from "../ActionLog";

export default class CurrentUrlAction extends Action {
  constructor() {
    super(CurrentUrlAction.name);
  }

  async run() {
    const url = this.__context.page.url(); // page.url not return promise
    this.__context.logs.push(new ActionLog({ action: this.getName(), output: url }).now());
    return url;
  }
}
