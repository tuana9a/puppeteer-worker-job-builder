import JobBuilderError from "./JobBuilderError";

export default class NotAnArrayOfActionsError extends JobBuilderError {
  ilegalValue: any;
  constructor(ilegalValue: any) {
    super(`${ilegalValue} is not an array of Actions`);
    this.ilegalValue = ilegalValue;
  }
}

