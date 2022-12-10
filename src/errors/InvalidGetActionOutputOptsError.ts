import JobBuilderError from "./JobBuilderError";

export default class InvalidGetActionOutputOptsError extends JobBuilderError {
  value: any;

  constructor(value: any) {
    super(`Ivalid GetActionOutputOpts value: ${value}`);
    this.value = value;
  }
}
