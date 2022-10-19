import { nullify } from "../utils";
import Action from "./Action";

export default class IsStrictEqualAction extends Action {
  getter: Action;

  value: any;

  constructor(getter: Action, value: any) {
    super(IsStrictEqualAction.name);
    this.getter = getter;
    this.value = value;
  }

  async run() {
    const got = await this.getter
      .withLibs(this.libs)
      .withOutputs(this.outputs)
      .withPage(this.page)
      .withParams(this.params)
      .withStacks(this.stacks)
      .run();
    nullify(this.getter);
    if (got === this.value) {
      return true;
    }
    return false;
  }
}
