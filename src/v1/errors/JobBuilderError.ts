export default class JobBuilderError extends Error {
  builderName: any;

  withBuilderName(builderName: string) {
    this.builderName = builderName;
    return this;
  }
}
