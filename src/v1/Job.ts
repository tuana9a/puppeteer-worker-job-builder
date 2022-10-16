import Action from "./actions/Action";

export default class Job {
  public name: string;
  public actions: Action[];

  constructor({ name, actions }) {
    this.name = name;
    this.actions = actions;
  }
}

