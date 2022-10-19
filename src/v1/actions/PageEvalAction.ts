/* eslint-disable @typescript-eslint/ban-types */
import Action from "./Action";

export default class PageEvalAction extends Action {
  handler: Function;

  constructor(handler: Function) {
    super(PageEvalAction.name);
    this.handler = handler;
  }

  async run() {
    const output = await this.page.evaluate(this.handler);
    return output;
  }
}
