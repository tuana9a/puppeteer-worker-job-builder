import Action from "../Action";

export default class ReturnAction extends Action {
  constructor() {
    super(ReturnAction.name);
    this.withName(ReturnAction.name);
  }

  async run(): Promise<any> {
    // TODO:
    return null;
  }
}
