const { Action } = require("./core");

class Job {
  constructor({ name, actions }) {
    this.name = name;
    this.actions = actions;
  }

  /**
   *
   * @param {Job} job
   * @returns {boolean}
   */
  static isValidJob(job) {
    if (!job) {
      return false;
    }
    if (!Array.isArray(job.actions)) {
      return false;
    }
    if (job.actions.length === 0) {
      return false;
    }
    if (!job.actions.every((x) => Action.isValidAction(x))) {
      return false;
    }
    return true;
  }
}

module.exports = Job;
