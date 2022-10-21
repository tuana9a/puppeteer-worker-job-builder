import { ClickOpts } from "../types";
import Action from "./Action";

export default class ClickAction extends Action {
  selector: string;

  opts?: ClickOpts;

  constructor(selector: string, opts: ClickOpts) {
    super(ClickAction.name);
    this.selector = selector;
    this.opts = opts;
  }

  async run() {
    await this.page.click(this.selector, this.opts);
  }
}
