export default class ActionLog {
  public action: string;

  public output: any;

  public error: any;

  public at: number;

  constructor({ action, output, error, at }: { action: string; output: any, error?: any, at?: number }) {
    this.action = action;
    this.output = output;
    this.error = error;
    this.at = at || Date.now();
  }
}
