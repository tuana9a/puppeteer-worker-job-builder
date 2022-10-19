export default class Action {
  __isMeAction: boolean;

  __type: string;

  name: string;

  page: any;

  libs: any;

  params: any;

  currentIdx: any;

  isBreak: boolean;

  // eslint-disable-next-line no-use-before-define
  stacks: Action[];

  outputs: any[];

  constructor(type: string) {
    this.__type = type;
    this.__isMeAction = true;
    this.isBreak = false;
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  withStacks(stacks: Action[]) {
    this.stacks = stacks;
    return this;
  }

  withOutputs(outputs: Action[]) {
    this.outputs = outputs;
    return this;
  }

  withPage(page: any) {
    this.page = page;
    return this;
  }

  withLibs(libs: any) {
    this.libs = libs;
    return this;
  }

  withParams(params: any) {
    this.params = params;
    return this;
  }

  breaked() {
    this.isBreak = true;
    return this;
  }

  notBreak() {
    this.isBreak = false;
    return this;
  }

  setCurrentIdx(currentIdx: number) {
    this.currentIdx = currentIdx;
  }

  async run() {
    return undefined;
  }
}
