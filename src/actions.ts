/* eslint-disable max-classes-per-file */
import { Action, ActionLog } from "./core";
import { InvalidGetActionOutputOptsError, NotAnArrayOfActionsError } from "./errors";
import { PuppeteerLifeCycleEvent, ClickOpts, ArrayGeneratorFunction, CreateActionFunction, GetActionOutputOpts, GetValueFromParamsFunction, SetVarsFunction } from "./types";
import { isValidArrayOfActions } from "./utils";

export class _Break extends Action {
  constructor() {
    super(_Break.name);
  }

  async run() {
    this.__context.isBreak = true;
    this.__context.stacks = []; // pop all actions left in this context
    this.__context.logs.push(new ActionLog().fromAction(this));
  }
}

export class _BringToFront extends Action {
  constructor() {
    super(_BringToFront.name);
  }

  async run() {
    this.__context.logs.push(new ActionLog().fromAction(this));

    await this.__context.page.bringToFront();
  }
}

export class _Click extends Action {
  selector: string;

  opts?: ClickOpts;

  constructor(selector: string, opts: ClickOpts) {
    super(_Click.name);
    this.selector = selector;
    this.opts = opts;
  }

  async run() {
    await this.__context.page.click(this.selector, this.opts);
    this.__context.logs.push(new ActionLog().fromAction(this));
  }
}

export class _CurrentUrl extends Action {
  constructor() {
    super(_CurrentUrl.name);
  }

  async run() {
    const url = this.__context.page.url(); // page.url not return promise
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(url));
    return url;
  }
}

/**
 * @deprecated use _ForV2 instead
 */
export class _For extends Action {
  private generator: any[] | ArrayGeneratorFunction | Action;

  private eachRun: (CreateActionFunction | Action)[];

  constructor(generator: any[] | ArrayGeneratorFunction | Action) {
    super(_For.name);
    this.generator = generator;
    this.eachRun = []; // IMPORTANT
  }

  Each(actions: (CreateActionFunction | Action)[]) {
    // each can be function or action mixed so can not check it
    this.eachRun = actions;
    return this;
  }

  async run() {
    let iterators: any[] = [];
    let output = [];
    const nestingLogs: ActionLog[] = [];
    if ((this.generator as Action).__isAction) {
      iterators = await (this.generator as Action).withContext(this.__context).run();
      output = iterators;
    } else if (Array.isArray(this.generator as any[])) {
      iterators = this.generator as any[];
      output = iterators;
    } else {
      iterators = await (this.generator as ArrayGeneratorFunction)();
      output = (iterators as ArrayGeneratorFunction[]).map((x) => String(x));
    }
    const eachRun: (CreateActionFunction | Action)[] = Array.from((this.eachRun as (CreateActionFunction | Action)[]));
    let contextStepIdx = 0;
    // current implemetation of loop is simple
    // each loop create new context and run immediately
    // no previous stack is used
    for (const i of iterators) {
      const newContext = this.__context.newNested(contextStepIdx);
      for (const run of eachRun) {
        // use .unshift will make stacks works like normal
        if ((run as Action).__isAction) {
          newContext.stacks.unshift((run as Action));
        } else {
          const newAction = await (run as CreateActionFunction)(i);
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

export class _ForRunner extends Action {
  private eachRun: (CreateActionFunction | Action)[];

  private iterators: any[];

  private currentIteratorIndex: number;

  private currentContextStepIdx: number;

  constructor({ iterators, eachRun, currentContextStepIdx, currentIteratorIndex }: {
    eachRun: (CreateActionFunction | Action)[];

    iterators: any[];

    currentIteratorIndex: number;

    currentContextStepIdx: number;
  }) {
    super(_ForRunner.name);
    this.eachRun = eachRun;
    this.iterators = iterators;
    this.currentContextStepIdx = currentContextStepIdx;
    this.currentIteratorIndex = currentIteratorIndex;
  }

  async run() {
    const nestingLogs: ActionLog[] = [];
    const eachRun: (CreateActionFunction | Action)[] = Array.from(this.eachRun as (CreateActionFunction | Action)[]);
    // this implemetation is push a new ForRunner (like a loop)
    const i = this.iterators[this.currentIteratorIndex];
    const newContext = this.__context.newNested(this.currentContextStepIdx);
    for (const run of eachRun) {
      // use .unshift will make stacks works like normal
      if ((run as Action).__isAction) {
        newContext.stacks.unshift((run as Action));
      } else {
        const newAction = await (run as CreateActionFunction)(i);
        newContext.stacks.unshift(newAction);
      }
    }
    const logs = await this.__context.runContext(newContext);
    nestingLogs.push(...logs);
    if (!newContext.isBreak && this.currentIteratorIndex < this.iterators.length - 1) {
      // push new ForRunner (loop simulation)
      this.__context.stacks.push(new _ForRunner({
        eachRun: this.eachRun,
        iterators: this.iterators,
        currentContextStepIdx: newContext.currentStepIdx,
        currentIteratorIndex: this.currentIteratorIndex + 1
      }));
    }
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput({
      iterators: this.iterators,
      currentContextStepIdx: this.currentContextStepIdx,
      currentIteratorIndex: this.currentIteratorIndex
    }).nesting(nestingLogs));
  }
}

// TODO: 3 types of For
export class _ForV2 extends Action {
  private generator: any[] | ArrayGeneratorFunction | Action;

  private eachRun: (CreateActionFunction | Action)[];

  constructor(generator: any[] | ArrayGeneratorFunction | Action) {
    super(_ForV2.name);
    this.generator = generator;
    this.eachRun = []; // IMPORTANT
  }

  Each(actions: (CreateActionFunction | Action)[]) {
    // each can be function or action mixed so can not check it
    this.eachRun = actions;
    return this;
  }

  async run() {
    let iterators: any[] = [];
    let output = [];
    const nestingLogs: ActionLog[] = [];
    if ((this.generator as Action).__isAction) {
      iterators = await (this.generator as Action).withContext(this.__context).run();
      output = iterators;
    } else if (Array.isArray(this.generator as any[])) {
      iterators = this.generator as any[];
      output = iterators;
    } else {
      iterators = await (this.generator as ArrayGeneratorFunction)();
      output = (iterators as ArrayGeneratorFunction[]).map((x) => String(x));
    }
    const eachRun: (CreateActionFunction | Action)[] = Array.from((this.eachRun as (CreateActionFunction | Action)[]));
    this.__context.stacks.push(new _ForRunner({ eachRun: eachRun, iterators: iterators, currentContextStepIdx: 0, currentIteratorIndex: 0 }));
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output).nesting(nestingLogs));
    return iterators;
  }
}

export class _GetValueFromOutput extends Action {
  opts: GetActionOutputOpts;

  constructor(opts: GetActionOutputOpts) {
    super(_GetValueFromOutput.name);
    this.opts = opts;
  }

  async run() {
    if (Number.isSafeInteger(this.opts.direct)) {
      const value = this.__context.logs[this.opts.direct].output;
      this.__context.logs.push(new ActionLog().fromAction(this).withOutput(value));
      return value;
    }
    if (Number.isSafeInteger(this.opts.fromCurrent)) {
      const value = this.__context.logs[this.__context.currentStepIdx + this.opts.fromCurrent].output;
      this.__context.logs.push(new ActionLog().fromAction(this).withOutput(value));
      return value;
    }
    throw new InvalidGetActionOutputOptsError(this.opts);
  }
}

export class _GetTextContent extends Action {
  selector: string;

  constructor(selector: string) {
    super(_GetTextContent.name);
    this.selector = selector;
  }

  async run() {
    const content = await this.__context.page.$eval(this.selector, (e: Element) => e.textContent);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(content));
    return content;
  }
}

export class _GetValueFromParams extends Action {
  getter: GetValueFromParamsFunction;

  constructor(getter: GetValueFromParamsFunction) {
    super(_GetValueFromParams.name);
    this.getter = getter;
  }

  async run() {
    const value = await this.getter(this.__context.params);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(value));
    return value;
  }
}

export class _GoTo extends Action {
  url: string;

  constructor(url: string) {
    super(_GoTo.name);
    this.url = url;
  }

  async run() {
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(this.url));
    await this.__context.page.goto(this.url);
  }
}

export class _If extends Action {
  _if: any;

  _then: Action[];

  _else: Action[];

  constructor(_if: any) {
    super(_If.name);
    this._if = _if;
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
    const output = Boolean(this._if);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output));
    if (output) {
      this.__context.stacks.push(...Array.from(this._then).reverse());
    } else {
      this.__context.stacks.push(...Array.from(this._else).reverse());
    }
    return output;
  }
}

export class _IfActionOutput extends Action {
  _if: Action;

  _then: Action[];

  _else: Action[];

  constructor(_if: Action) {
    super(_IfActionOutput.name);
    this._if = _if;
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

export class _IsEqual extends Action {
  value: any;

  target: any;

  constructor(value: any, other: any) {
    super(_IsEqual.name);
    this.value = value;
    this.target = other;
  }

  async run() {
    // eslint-disable-next-line eqeqeq
    const output = this.value == this.target;

    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output));
    return output;
  }
}

export class _IsEqualActionOutput extends Action {
  getter: Action;

  value: any;

  constructor(getter: Action, value: any) {
    super(_IsEqual.name);
    this.getter = getter;
    this.value = value;
  }

  async run() {
    const got = await this.getter.withContext(this.__context).run();

    // eslint-disable-next-line eqeqeq
    const output = got == this.value;

    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output));
    return output;
  }
}

export class _IsStrictEqual extends Action {
  value: any;

  other: any;

  constructor(value: any, other: any) {
    super(_IsStrictEqual.name);
    this.value = value;
    this.other = other;
  }

  async run() {

    const output = this.value === this.other;

    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output));
    return output;
  }
}

export class _IsStrictEqualActionOutput extends Action {
  getter: Action;

  value: any;

  constructor(getter: Action, value: any) {
    super(_IsStrictEqualActionOutput.name);
    this.getter = getter;
    this.value = value;
  }

  async run() {
    const got = await this.getter.withContext(this.__context).run();

    const output = got === this.value;

    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output));
    return output;
  }
}

export class _PageEval extends Action {
  handler: () => Promise<any>;

  constructor(handler: () => Promise<any>) {
    super(_PageEval.name);
    this.handler = handler;
  }

  async run() {
    const output = await this.__context.page.evaluate(this.handler);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(output));
    return output;
  }
}

export class _Reload extends Action {
  constructor() {
    super(_Reload.name);
  }

  async run() {
    this.__context.logs.push(new ActionLog().fromAction(this));
    await this.__context.page.reload();
  }
}

export class _Return extends Action {
  constructor() {
    super(_Return.name);
  }

  async run() {
    this.__context.isReturn = true;
    this.__context.logs.push(new ActionLog().fromAction(this));
  }
}

export class _ScreenShot extends Action {
  selector: string;

  saveTo: string;

  type: "png" | "jpeg" | "webp";

  constructor(selector: string, saveTo: string, type: "png" | "jpeg" | "webp") {
    super(_ScreenShot.name);
    this.selector = selector;
    this.saveTo = saveTo;
    this.type = type;
  }

  async run() {
    const opts = { selector: this.selector, saveTo: this.saveTo, type: this.type };
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(opts));

    if (!opts.selector) {
      await this.__context.page.screenshot({ path: opts.saveTo, type: opts.type });
      return opts;
    }

    const element = await this.__context.page.$(opts.selector);
    await element.screenshot({ path: opts.saveTo, type: opts.type });
    return opts;
  }
}

export class _TypeIn extends Action {
  selector: string;

  value: string;

  constructor(selector: string, value: string) {
    super(_TypeIn.name);
    this.selector = selector;
    this.value = value;
  }

  async run() {
    const text = String(this.value);
    await this.__context.page.type(this.selector, text);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(text));
    return text;
  }
}

export class _TypeInActionOutputValue extends Action {
  selector: string;

  value: Action;

  constructor(selector: string, value: Action) {
    super(_TypeIn.name);
    this.selector = selector;
    this.value = value;
  }

  async run() {
    const output = await this.value.withContext(this.__context).run();
    const text = String(output);
    await this.__context.page.type(this.selector, text);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(text));
    return text;
  }
}

export class _WaitForNavigation extends Action {
  waitUntil: PuppeteerLifeCycleEvent;

  constructor(waitUntil: PuppeteerLifeCycleEvent) {
    super(_WaitForNavigation.name);

    this.waitUntil = waitUntil;
  }

  async run() {
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(this.waitUntil));
    await this.__context.page.waitForNavigation({ waitUntil: this.waitUntil });
  }
}

export class _WaitForTimeout extends Action {
  timeout: number;

  constructor(timeout: number) {
    super(_WaitForTimeout.name);
    this.timeout = timeout;
  }

  async run() {
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(this.timeout));
    await this.__context.page.waitForTimeout(this.timeout);
  }
}

export class _SetVars extends Action {
  handler: SetVarsFunction;

  constructor(handler: SetVarsFunction) {
    super(_SetVars.name);
    this.handler = handler;
  }

  async run() {
    await this.handler(this.__context.vars);
    this.__context.logs.push(new ActionLog().fromAction(this).withOutput(this.__context.vars));
  }
}
