import { ArrayGeneratorFunction, CreateActionFunction } from "../types";
import { nullify } from "../utils";
import Action from "./Action";

export default class ForAction extends Action {
  private _generator: any[] | ArrayGeneratorFunction | Action;

  private _each: CreateActionFunction[] | Action[];

  constructor(generator: any[] | ArrayGeneratorFunction | Action) {
    super(ForAction.name);
    this._generator = generator;
    this._each = []; // IMPORTANT
  }

  Each(actions: CreateActionFunction[] | Action[]) {
    // _each can be function or action mixed so can not check it
    this._each = actions;
    return this;
  }

  async run() {
    let iterators: any[] = [];
    if ((this._generator as Action).__isMeAction) {
      iterators = await (this._generator as Action)
        .withLibs(this.libs)
        .withOutputs(this.outputs)
        .withPage(this.page)
        .withParams(this.params)
        .withStacks(this.stacks)
        .run();
      nullify(this._generator);
    } else if (Array.isArray(this._generator as any[])) {
      iterators = this._generator as any[];
    } else {
      iterators = await (this._generator as ArrayGeneratorFunction)();
    }
    const eachs: CreateActionFunction[] | Action[] = Array.from((this._each as any[])).reverse();
    iterators = Array.from(iterators).reverse();
    for (const iterate of iterators) {
      for (const each of eachs) {
        const eachAction = each as Action;
        const eachCreateAction = each as CreateActionFunction;
        if (eachAction.__isMeAction) {
          this.stacks.push(eachAction);
        } else {
          const newAction = await eachCreateAction(iterate);
          this.stacks.push(newAction);
        }
      }
    }
    return iterators;
  }
}
