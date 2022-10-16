import Action from "./Action";

export default class BreakPointAction extends Action {
  constructor() {
    super(BreakPointAction.name);
    this.withHandler((payload) => {
      // eslint-disable-next-line no-param-reassign
      payload.isBreak = () => true;
      return true;
    });
  }
}
