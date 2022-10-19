import { nullify } from "../utils";
import Action from "./Action";

export default class TypeInAction extends Action {
  selector: string;

  value: string | Action;

  constructor(selector: string, value: string | Action) {
    super(TypeInAction.name);
    this.selector = selector;
    this.value = value;
  }

  async run() {
    if ((this.value as Action).__isMeAction) {
      const output = await (this.value as Action)
        .withParams(this.params)
        .withStacks(this.stacks)
        .withLibs(this.libs)
        .withOutputs(this.outputs)
        .withPage(this.page)
        .run();
      nullify(this.value);
      const valueToType = String(output);
      await this.page.type(this.selector, valueToType);
      return valueToType;
    }

    const valueToType = String(this.value);
    await this.page.type(this.selector, valueToType);
    return valueToType;
  }
}
