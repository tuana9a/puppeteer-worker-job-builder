import ActionPayload from "./ActionPayload";
import { ActionPayloadHandler } from "../types";
import ActionLog from "./ActionLog";

export default class Action {
  __isMeAction: boolean;

  type: string;

  name: string;

  handler: ActionPayloadHandler;

  payload: ActionPayload;

  constructor(type = Action.name) {
    this.__isMeAction = true;
    this.type = type;
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  withPayload(payload: ActionPayload) {
    this.payload = payload;
    return this;
  }

  withHandler(handler: ActionPayloadHandler) {
    this.handler = handler;
    return this;
  }

  getPayload(): ActionPayload {
    return this.payload;
  }

  async _run() {
    const output = await this.handler(this.payload);
    return output;
  }

  async run() {
    const payload = this.getPayload();
    const output = await this._run();
    payload.logs.push(new ActionLog({ action: this.name, output: output }));
    return output;
  }
}
