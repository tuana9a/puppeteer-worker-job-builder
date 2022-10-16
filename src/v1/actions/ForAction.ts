import { CreateActionFunction } from "../types";
import Action from "./Action";

export default class ForAction extends Action {
  private _generator: any[] | Function | Action;
  private _each: CreateActionFunction[] | Action[];

  constructor(generator: any[] | Function | Action) {
    super(ForAction.name);
    this._generator = generator;
    this._each = []; // IMPORTANT
  }


  Each(actions: CreateActionFunction[] | Action[]) {
    // _each can be function or action mixed so can not check it
    this._each = actions;
    return this;
  }

  async _run() {
    const payload = this.getPayload();
    let iterators: any[] = [];
    const action = this._generator as Action;
    const funktion = this._generator as Function;
    const arrayOfValues = this._generator as any[];
    if (action.__isMeAction) {
      iterators = await action.withPayload(payload).run();
    } else if (Array.isArray(arrayOfValues)) {
      iterators = arrayOfValues;
    } else {
      iterators = await funktion(payload);
    }
    const eachs: CreateActionFunction[] | Action[] = Array.from((this._each as any[])).reverse();
    for (const iterate of iterators) {
      for (const each of eachs) {
        const eachAction = each as Action;
        const eachCreateAction = each as CreateActionFunction;
        if (eachAction.__isMeAction) {
          payload.stacks.push(eachAction);
        } else {
          const newAction = await eachCreateAction(iterate);
          payload.stacks.push(newAction);
        }
      }
    }
    return iterators;
  }
}
