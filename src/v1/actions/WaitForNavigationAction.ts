import PuppeteerLifeCycleEvent from "../types/PuppeteerLifeCycleEvent";
import Action from "../Action";
import ActionLog from "../ActionLog";

export default class WaitForNavigationAction extends Action {
  waitUntil: PuppeteerLifeCycleEvent;

  constructor(waitUntil: PuppeteerLifeCycleEvent) {
    super(WaitForNavigationAction.name);

    this.waitUntil = waitUntil;
  }

  async run() {
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(this.waitUntil));
    await this.__context.page.waitForNavigation({ waitUntil: this.waitUntil });
  }
}
