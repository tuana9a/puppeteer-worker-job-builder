import Action from "./Action";
import { isValidArrayOfActions } from "../utils";
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

  async _run() {
    const payload = this.getPayload();
    const output = await this._if.withPayload(payload).run();
    if (output) {
      payload.stacks.push(...Array.from(this._then).reverse());
    } else {
      payload.stacks.push(...Array.from(this._else).reverse());
    }
    return output;
  }
}
