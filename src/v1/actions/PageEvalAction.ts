import Action from "../Action";
import ActionLog from "../ActionLog";

export default class PageEvalAction extends Action {
  handler: () => Promise<any>;

  constructor(handler: () => Promise<any>) {
    super(PageEvalAction.name);
    this.handler = handler;
  }

  async run() {
    const output = await this.__context.page.evaluate(this.handler);
    this.__context.logs.push(new ActionLog({ action: this.getName(), output: output }).now());
    return output;
  }
}
