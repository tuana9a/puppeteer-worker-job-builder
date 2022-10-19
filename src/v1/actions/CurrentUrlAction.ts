import Action from "./Action";

export default class CurrentUrlAction extends Action {
  constructor() {
    super(CurrentUrlAction.name);
  }

  async run() {
    const url = this.page.url(); // page.url not return promise
    return url;
  }
}
