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
    let output = [];
    const nestingLogs: ActionLog[] = [];
    if ((this._generator as Action).__isAction) {
      iterators = await (this._generator as Action).withContext(this.__context).run();
      output = iterators;
    } else if (Array.isArray(this._generator as any[])) {
      iterators = this._generator as any[];
      output = iterators;
    } else {
      iterators = await (this._generator as ArrayGeneratorFunction)();
      output = (iterators as ArrayGeneratorFunction[]).map((x) => String(x));
    }
    const eachs: (CreateActionFunction | Action)[] = Array.from((this._each as (CreateActionFunction | Action)[]));
    let contextStepIdx = 0;
    for (const i of iterators) {
      // each loop create new context and run immediately
      const newContext = new Context({
        job: this.__context.job,
        page: this.__context.page,
        libs: this.__context.libs,
        params: this.__context.params,
        currentStepIdx: contextStepIdx,
        currentNestingLevel: this.__context.currentNestingLevel + 1,
        isBreak: false,
        stacks: [],
        logs: [],
        runContext: this.__context.runContext,
      }).onDoing(this.__context.doing);
      for (const each of eachs) {
        // use .unshift will make stacks works like normal
        if ((each as Action).__isAction) {
          newContext.stacks.unshift((each as Action));
        } else {
          const newAction = await (each as CreateActionFunction)(i);
          newContext.stacks.unshift(newAction);
        }
      }
      const logs = await this.__context.runContext(newContext);
      contextStepIdx = newContext.currentStepIdx;
      nestingLogs.push(...logs);
      if (newContext.isBreak) {
        break;
      }
    }
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output).nesting(nestingLogs));
    return iterators;
  }
}
