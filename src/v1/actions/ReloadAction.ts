import Action from "./Action";

export default class ReloadAction extends Action {
  constructor() {
    super(ReloadAction.name);
  }

  async run() {
    await this.page.reload();
  }
}
