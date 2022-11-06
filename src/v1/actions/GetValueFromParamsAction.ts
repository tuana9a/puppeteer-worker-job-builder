import GetValueFromParamsFunction from "../types/GetValueFromOutputsFunction";
import Action from "../Action";
import ActionLog from "../ActionLog";

export default class GetValueFromParamsAction extends Action {
  getter: GetValueFromParamsFunction;

  constructor(getter: GetValueFromParamsFunction) {
    super(GetValueFromParamsAction.name);
    this.getter = getter;
  }

  async run() {
    const value = await this.getter(this.__context.params);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(value));
    return value;
  }
}
