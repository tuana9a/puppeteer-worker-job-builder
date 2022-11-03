import Context from "./Context";
import nullify from "./utils/nullify";

export default abstract class Action {
  __isMeAction: boolean;

  __type: string;

  __context: Context;

  name: string;

  stepIdx: number;

  nestingLevel: number;

  constructor(type: string) {
    this.__type = type;
    this.__isMeAction = true;
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  getName() {
    return this.name;
  }

  withContext(context: Context) {
    this.__context = context;
    this.__context.actionsToDestroy.push(this);
    return this;
  }

  setStepIdx(step: number) {
    this.stepIdx = step;
  }

  setNestingLevel(level: number) {
    this.nestingLevel = level;
  }

  destroy() {
    nullify(this);
  }

  abstract run(): Promise<any>;
}
