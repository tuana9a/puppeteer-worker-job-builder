/* eslint-disable max-classes-per-file */

export class JobBuilderError extends Error {
  builderName: string;

  withBuilderName(builderName: string) {
    this.builderName = builderName;
    return this;
  }
}

export class InvalidGetActionOutputOptsError extends JobBuilderError {
  value: any;

  constructor(value: any) {
    super(`Ivalid GetActionOutputOpts value: ${value}`);
    this.value = value;
  }
}

export class InvalidJobError extends JobBuilderError {
  constructor(jobName: string) {
    super(`Invalid job "${jobName}"`);
  }
}

export class NotAnActionError extends JobBuilderError {
  ilegalValue: any;

  constructor(ilegalValue: any) {
    super(`${ilegalValue} is not a Action`);
    this.ilegalValue = ilegalValue;
  }
}

export class NotAnArrayOfActionsError extends JobBuilderError {
  ilegalValue: any;

  constructor(ilegalValue: any) {
    super(`${ilegalValue} is not an array of Actions`);
    this.ilegalValue = ilegalValue;
  }
}

// TODO: input and supported values in opts constructor
export class NotInSupportedValuesError extends JobBuilderError {
  input: any;

  supportedValues: any[];

  constructor(supportedValues: any[], input: any) {
    super(`${input} not in ${supportedValues}`);
    this.supportedValues = supportedValues;
    this.input = input;
  }
}

export class RequiredParamError extends JobBuilderError {
  paramName: string;

  constructor(paramName: string) {
    super(`${paramName} is undefined`);
    this.paramName = paramName;
  }
}
