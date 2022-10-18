import Action from "./Action";
import ActionLog from "./ActionLog";
import { IsBreakFunction } from "../types";

export default class ActionPayload {
  params: any;

  libs: any;

  page: any;

  logs: ActionLog[];

  currentIdx: number;

  actions: Action[];

  stacks: Action[];

  isBreak: IsBreakFunction;

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
