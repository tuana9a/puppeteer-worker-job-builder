import JobBuilderError from "./JobBuilderError";

export default class RequiredParamError extends JobBuilderError {
  public paramName: string;

  constructor(paramName: string) {
    super(`${paramName} is undefined`);
    this.paramName = paramName;
  }
}
