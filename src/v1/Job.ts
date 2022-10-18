import Action from "./actions/Action";

export default class Job {
  name: string;

  actions: Action[];

  constructor({ name, actions }) {
    this.name = name;
    this.actions = actions;
  }
}
