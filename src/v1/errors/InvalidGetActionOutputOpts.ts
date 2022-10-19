export default class InvalidGetActionOutputOpts extends Error {
  value: any;

  constructor(value) {
    super(`Ivalid GetActionOutputOpts value: ${value}`);
    this.value = value;
  }
}
