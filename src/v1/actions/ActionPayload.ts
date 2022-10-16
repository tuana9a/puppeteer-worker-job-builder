import Action from "./Action";
import ActionLog from "./ActionLog";
import { IsBreakFunction } from "../types";

export default class ActionPayload {
  public params: any;

  public libs: any;

  public page: any;

  public logs: ActionLog[];

  public currentIdx: number;

  public actions: Action[];

  public stacks: Action[];

  public isBreak: IsBreakFunction;

  constructor({ params, libs, page, logs, currentIdx, actions, stacks, isBreak }) {
    this.params = params;
    this.libs = libs;
    this.page = page;
    this.logs = logs;
    this.currentIdx = currentIdx;
    this.actions = actions;
    this.stacks = stacks;
    this.isBreak = isBreak || (() => false);
  }
}
