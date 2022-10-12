class JobBuilderError extends Error {
  /**
   *
   * @param {string} builderName
   * @returns {JobBuilderError}
   */
  withBuilderName(builderName) {
    this.builderName = builderName;
    return this;
  }
}

class RequiredParamError extends JobBuilderError {
  /**
   *
   * @param {string} paramName
   */
  constructor(paramName) {
    super(`${paramName} is undefined`);
    this.paramName = paramName;
  }
}

class NotInSupportedValuesError extends JobBuilderError {
  /**
   *
   * @param {[]} supportedValues
   * @param {*} input
   */
  constructor(supportedValues, input) {
    super(`${input} not in ${supportedValues}`);
    this.supportedValues = supportedValues;
    this.input = input;
  }
}

class NotActionError extends JobBuilderError {
  constructor(ilegalValue) {
    super(`${ilegalValue} is not a Action`);
    this.ilegalValue = ilegalValue;
  }
}

class NotAnArrayOfActionsError extends JobBuilderError {
  constructor(ilegalValue) {
    super(`${ilegalValue} is not an array of Actions`);
    this.ilegalValue = ilegalValue;
  }
}

class NotHaveAtLeastOneBreakPointInRepeatUntilError extends JobBuilderError {
  /**
   *
   * @param {[]} actions
   */
  constructor(actions) {
    super(`not have at least one BreakPoint in ${actions}`);
    this.actions = actions;
  }
}

class InvalidBreakPointError extends JobBuilderError {
  constructor(action) {
    super(`${action.name} is not a BreakPoint`);
    this.action = action;
  }
}

class InvalidJobError extends JobBuilderError {
  constructor(jobName) {
    super(`Invalid job "${jobName}"`);
  }
}

module.exports = {
  JobBuilderError,
  RequiredParamError,
  NotActionError,
  NotInSupportedValuesError,
  NotAnArrayOfActionsError,
  NotHaveAtLeastOneBreakPointInRepeatUntilError,
  InvalidJobError,
  InvalidBreakPointError,
};
