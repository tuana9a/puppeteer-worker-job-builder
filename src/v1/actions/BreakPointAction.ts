import Action from "./Action";

export default class BreakPointAction extends Action {
  constructor() {
    super(BreakPointAction.name);
    this.withHandler((payload) => {
      payload.isBreak = () => true;
      return true;
    });
  }
}
