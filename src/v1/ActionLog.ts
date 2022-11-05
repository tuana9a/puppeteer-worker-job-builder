export default class ActionLog {
  action: string;

  output: any;

  error: any;

  at: number;

  constructor({ action, output, error, at }: { action: string; output?: any, error?: any, at?: number }) {
    this.action = action;
    this.output = output;
    this.error = error;
    this.at = at;
  }

  now() {
    this.at = Date.now();
    return this;
  }
}
