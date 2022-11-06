import Action from "../Action";
import ActionLog from "../ActionLog";

export default class IsEqualAction extends Action {
  getter: Action;

  value: any;

  constructor(getter: Action, value: any) {
    super(IsEqualAction.name);
    this.getter = getter;
    this.value = value;
  }

  async run() {
    const got = await this.getter.withContext(this.__context).run();

    // eslint-disable-next-line eqeqeq
    if (got == this.value) {
      this.__context.logs.push(new ActionLog().fromAction(this).withOutput(true));
      return true;
    }

    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(false));
    return false;
  }
}
