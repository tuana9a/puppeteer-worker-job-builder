import { GetValueFromParamsFunction } from "../types";
import Action from "./Action";

export default class GetValueFromParamsAction extends Action {
  getter: GetValueFromParamsFunction;

  constructor(getter: GetValueFromParamsFunction) {
    super(GetValueFromParamsAction.name);
    this.getter = getter;
  }

  async run() {
    const output = await this.getter(this.params);
    return output;
  }
}
