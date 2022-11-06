import Action from "../Action";
import isValidArrayOfActions from "../utils/isValidArrayOfActions";
import NotAnArrayOfActionsError from "../errors/NotAnArrayOfActionError";
import ActionLog from "../ActionLog";

export default class IfAction extends Action {
  _if: Action;

  _then: Action[];

  _else: Action[];

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
    const output = await this._if.withContext(this.__context).run();
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output));
    if (output) {
      this.__context.stacks.push(...Array.from(this._then).reverse());
    } else {
      this.__context.stacks.push(...Array.from(this._else).reverse());
    }
    return output;
  }
}
