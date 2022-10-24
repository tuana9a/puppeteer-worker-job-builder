import Action from "./actions/Action";
import ActionLog from "./actions/ActionLog";
import { JobConstructor, JobOpts } from "./types";
import { nullify, toPrettyErr } from "./utils";

export default class Job {
  name: string;

  params: any;

  page: any;

  libs: any;

  actions: Action[];

  stacks: Action[];

  outputs: Action[];

  opts: JobOpts;

  constructor({ name, page, libs, params, actions }: JobConstructor) {
    this.name = name;
    this.page = page;
    this.params = params;
    this.libs = libs;
    this.actions = actions;
    this.outputs = [];
    this.stacks = Array.from<Action>(actions).reverse();
  }

  withOpts(opts: JobOpts) {
    this.opts = opts;
    return this;
  }

  async run() {
    const logs: ActionLog[] = [];
    let action = this.stacks.pop();
    let currentIdx = 0;
    action.currentIdx = currentIdx;
    while (!action.isBreak && Boolean(action)) {
      try {
        const doing = {
          job: this.name,
          action: action.name,
          stacks: this.stacks.map((x) => x.name),
          at: Date.now(),
        };

        if (this.opts?.doing) this.opts.doing(doing);

        action.withParams(this.params);
        action.withStacks(this.stacks);
        action.withOutputs(this.outputs);
        action.withLibs(this.libs);
        action.withPage(this.page);
        const output = await action.run();
        logs.push(new ActionLog({ action: action.name, output: output }));
        nullify(action); // clean action when done

        action = this.stacks.pop();
        currentIdx += 1;
        action.currentIdx = currentIdx;
      } catch (error) {
        logs.push(new ActionLog({
          action: action.name,
          error: toPrettyErr(error),
        }));
        break;
      }
    }
    while (action) {
      nullify(action);
      action = this.stacks.pop();
    }
    nullify(this);// self destroy
    return logs;
  }
}
