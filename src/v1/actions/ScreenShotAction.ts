import Action from "./Action";

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
    const output = { saveTo: this.saveTo, type: this.imgType };
    if (!this.selector) {
      await this.page.screenshot({ path: this.saveTo, type: this.imgType });
      return output;
    }
    const element = await this.page.$(this.selector);
    await element.screenshot({ path: this.saveTo, type: this.imgType });
    return output;
  }
}
