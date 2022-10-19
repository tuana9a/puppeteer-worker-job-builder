import { PuppeteerLifeCycleEvent } from "../types";
import Action from "./Action";

export default class WaitForNavigationAction extends Action {
  waitUntil: PuppeteerLifeCycleEvent;

  constructor(waitUntil: PuppeteerLifeCycleEvent) {
    super(WaitForNavigationAction.name);

    this.waitUntil = waitUntil;
  }

  async run() {
    await this.page.waitForNavigation({ waitUntil: this.waitUntil });
  }
}
