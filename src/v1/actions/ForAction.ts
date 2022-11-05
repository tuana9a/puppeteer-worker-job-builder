import ArrayGeneratorFunction from "../types/ArrayGeneratorFunction";
import CreateActionFunction from "../types/CreateActionFunction";
import Action from "../Action";
import Context from "../Context";
import ActionLog from "../ActionLog";

export default class ForAction extends Action {
  _generator: any[] | ArrayGeneratorFunction | Action;

  _each: (CreateActionFunction | Action)[];

  constructor(generator: any[] | ArrayGeneratorFunction | Action) {
    super(ForAction.name);
    this._generator = generator;
    this._each = []; // IMPORTANT
  }

  Each(actions: (CreateActionFunction | Action)[]) {
    // _each can be function or action mixed so can not check it
    this._each = actions;
    return this;
  }

  async run() {
    let iterators: any[] = [];
    if ((this._generator as Action).__isMeAction) {
      iterators = await (this._generator as Action).withContext(this.__context).run();
      this.__context.logs.push(new ActionLog({ action: this.getName(), output: iterators }).now());
    } else if (Array.isArray(this._generator as any[])) {
      iterators = this._generator as any[];
      this.__context.logs.push(new ActionLog({ action: this.getName(), output: iterators }).now());
    } else {
      iterators = await (this._generator as ArrayGeneratorFunction)();
      this.__context.logs.push(new ActionLog({ action: this.getName(), output: (iterators as ArrayGeneratorFunction[]).map((x) => x.name) }).now());
    }
    const eachs: (CreateActionFunction | Action)[] = Array.from((this._each as (CreateActionFunction | Action)[]));
    for (const i of iterators) {
      // each loop create new context and run immediately
      const newContext = new Context({
        jobName: this.__context.jobName,
        page: this.__context.page,
        libs: this.__context.libs,
        params: this.__context.params,
        currentStepIdx: 0,
        currentNestingLevel: this.__context.currentNestingLevel + 1,
        isBreak: false,
        stacks: [],
        logs: [],
        outputs: [],
        runContext: this.__context.runContext,
        _onDoing: this.__context._onDoing,
        actionsToDestroy: [],
      });
      for (const each of eachs) {
        // use .unshift will make stacks works like normal
        if ((each as Action).__isMeAction) {
          newContext.stacks.unshift((each as Action).withContext(newContext));
        } else {
          const newAction = await (each as CreateActionFunction)(i);
          newContext.stacks.unshift(newAction.withContext(newContext));
        }
      }
      const logs = await this.__context.runContext(newContext);
      this.__context.logs.push(new ActionLog({ action: this.getName(), output: logs }).now());
    }
    return iterators;
  }
}
