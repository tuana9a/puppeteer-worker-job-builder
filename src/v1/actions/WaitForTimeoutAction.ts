import Action from "./Action";

export default class WaitForTimeoutAction extends Action {
  timeout: number;

  constructor(timeout: number) {
    super(WaitForTimeoutAction.name);
    this.timeout = timeout;
  }

  async run() {
    await this.page.waitForTimeout(this.timeout);
  }
}
