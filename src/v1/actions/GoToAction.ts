import Action from "./Action";

export default class GoToAction extends Action {
  url: string;

  constructor(url: string) {
    super(GoToAction.name);
    this.url = url;
  }

  async run() {
    await this.page.goto(this.url);
  }
}
