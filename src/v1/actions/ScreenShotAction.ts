import Action from "../Action";
import ActionLog from "../ActionLog";

export default class ScreenShotAction extends Action {
  selector: string;

  saveTo: string;

  imgType: string;

  constructor(selector: string, saveTo: string, type: string) {
    super(ScreenShotAction.name);
    this.selector = selector;
    this.saveTo = saveTo;
    this.imgType = type;
  }

  async run() {
    const opts = { selector: this.selector, saveTo: this.saveTo, type: this.imgType };
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(opts));

    if (!opts.selector) {
      await this.__context.page.screenshot({ path: opts.saveTo, type: opts.type });
      return opts;
    }

    const element = await this.__context.page.$(opts.selector);
    await element.screenshot({ path: opts.saveTo, type: opts.type });
    return opts;
  }
}
