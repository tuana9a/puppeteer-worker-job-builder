import Action from "./actions/Action";
import ActionPayload from "./actions/ActionPayload";

export type IsBreakFunction = (...params: any[]) => boolean;

export type ActionPayloadHandler = (payload: ActionPayload) => any;

export type CreateActionFunction = (...params: any[]) => Promise<Action>;

export type PuppeteerLifeCycleEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";