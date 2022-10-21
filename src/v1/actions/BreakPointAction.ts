import Action from "./Action";

export default class BreakPointAction extends Action {
  constructor() {
    super(BreakPointAction.name);
    this.withName(BreakPointAction.name);
    this.isBreak = true;
  }
}
