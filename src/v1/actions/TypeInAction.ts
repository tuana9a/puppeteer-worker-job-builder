import Action from "../Action";
import ActionLog from "../ActionLog";

export default class TypeInAction extends Action {
  selector: string;

  value: string | Action;

  constructor(selector: string, value: string | Action) {
    super(TypeInAction.name);
    this.selector = selector;
    this.value = value;
  }

  async run() {
    if ((this.value as Action).__isAction) {
      const output = await (this.value as Action).withContext(this.__context).withContext(this.__context).run();
      const text = String(output);
      await this.__context.page.type(this.selector, text);
      this.__context.logs.push(new ActionLog().fromAction(this).withOutput(text));
      return text;
    }

    const text = String(this.value);
    await this.__context.page.type(this.selector, text);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(text));
    return text;
  }
}
