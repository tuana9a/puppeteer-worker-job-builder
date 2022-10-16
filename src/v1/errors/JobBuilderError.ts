export default class JobBuilderError extends Error {
  builderName: string;

  withBuilderName(builderName: string) {
    this.builderName = builderName;
    return this;
  }
}
