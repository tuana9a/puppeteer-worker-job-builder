import Action from "../Action";
import ActionLog from "../ActionLog";

export default class WaitForTimeoutAction extends Action {
  timeout: number;

  constructor(timeout: number) {
    super(WaitForTimeoutAction.name);
    this.timeout = timeout;
  }

  async run() {
    this.__context.logs.push(new ActionLog({ action: this.getName(), output: this.timeout }).now());
    await this.__context.page.waitForTimeout(this.timeout);
  }
}
