import Action from "./Action";

export default class Job {
  name: string;

  actions: Action[];

  __isJob: boolean;

  constructor({ name, actions }: Job) {
    this.name = name;
    this.actions = actions;
    this.__isJob = true;
  }
}
