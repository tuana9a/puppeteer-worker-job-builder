import Action from "../Action";
import ActionLog from "../ActionLog";

export default class GetTextContentAction extends Action {
  selector: string;

  constructor(selector: string) {
    super(GetTextContentAction.name);
    this.selector = selector;
  }

  async run() {
    const content = await this.__context.page.$eval(this.selector, (e: Element) => e.textContent);
    this.__context.logs.push(new ActionLog({ action: this.getName(), output: content }).now());
    return content;
  }
}
