import Action from "./Action";
import { isValidArrayOfActions, nullify } from "../utils";
import NotAnArrayOfActionsError from "../errors/NotAnArrayOfActionError";

export default class IfAction extends Action {
  private _if: Action;

  private _then: Action[];

  private _else: Action[];

  constructor(action: Action) {
    super(IfAction.name);
    this._if = action;
    this._then = []; // IMPORTANT
    this._else = []; // IMPORTANT
  }

  Then(actions: Action[]) {
    this._then = actions;
    if (!isValidArrayOfActions(actions)) {
      throw new NotAnArrayOfActionsError(actions).withBuilderName(this.name);
    }
    return this;
  }

  Else(actions: Action[]) {
    if (!isValidArrayOfActions(actions)) {
      throw new NotAnArrayOfActionsError(actions).withBuilderName(this.name);
    }
    this._else = actions;
    return this;
  }

  async run() {
    const output = await this._if
      .withLibs(this.libs)
      .withOutputs(this.outputs)
      .withPage(this.page)
      .withParams(this.params)
      .withStacks(this.stacks)
      .run();
    nullify(this._if);
    if (output) {
      this.stacks.push(...Array.from(this._then).reverse());
    } else {
      this.stacks.push(...Array.from(this._else).reverse());
    }
    return output;
  }
}
