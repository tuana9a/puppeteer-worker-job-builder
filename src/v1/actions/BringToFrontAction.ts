import Action from "./Action";

export default class BringToFrontAction extends Action {
  constructor() {
    super(BringToFrontAction.name);
  }

  async run() {
    await this.page.bringToFront();
  }
}
