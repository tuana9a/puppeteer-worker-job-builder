import JobBuilderError from "./JobBuilderError";

// TODO: input and supported values in opts constructor
export default class NotInSupportedValuesError extends JobBuilderError {
  public input: any;

  public supportedValues: any[];

  constructor(supportedValues: any[], input: any) {
    super(`${input} not in ${supportedValues}`);
    this.supportedValues = supportedValues;
    this.input = input;
  }
}
