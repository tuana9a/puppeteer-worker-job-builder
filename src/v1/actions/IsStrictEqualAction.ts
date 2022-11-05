import Action from "../Action";
import ActionLog from "../ActionLog";

export default class IsStrictEqualAction extends Action {
  getter: Action;

  value: any;

  constructor(getter: Action, value: any) {
    super(IsStrictEqualAction.name);
    this.getter = getter;
    this.value = value;
  }

  async run() {
    const got = await this.getter.withContext(this.__context).run();

    if (got === this.value) {
      this.__context.logs.push(new ActionLog({ action: this.getName(), output: true }).now());
      return true;
    }

    this.__context.logs.push(new ActionLog({ action: this.getName(), output: false }).now());
    return false;
  }
}
