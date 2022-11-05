import ClickOpts from "../types/ClickOpts";
import Action from "../Action";
import ActionLog from "../ActionLog";

export default class ClickAction extends Action {
  selector: string;

  opts?: ClickOpts;

  constructor(selector: string, opts: ClickOpts) {
    super(ClickAction.name);
    this.selector = selector;
    this.opts = opts;
  }

  async run() {
    await this.__context.page.click(this.selector, this.opts);
    this.__context.logs.push(new ActionLog({ action: this.getName() }).now());
  }
}
