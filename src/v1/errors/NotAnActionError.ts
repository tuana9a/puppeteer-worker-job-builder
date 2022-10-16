import JobBuilderError from "./JobBuilderError";

export default class NotAnActionError extends JobBuilderError {
  ilegalValue: any;

  constructor(ilegalValue: any) {
    super(`${ilegalValue} is not a Action`);
    this.ilegalValue = ilegalValue;
  }
}
