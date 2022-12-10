import Action from "../Action";
import ActionLog from "../ActionLog";

export default class GoToAction extends Action {
  url: string;

  constructor(url: string) {
    super(GoToAction.name);
    this.url = url;
  }

  async run() {
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(this.url));
    await this.__context.page.goto(this.url);
  }
}
