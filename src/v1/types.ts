/* eslint-disable no-unused-vars */

import Action from "./actions/Action";
import ActionPayload from "./actions/ActionPayload";

export type IsBreakFunction = (...params: any[]) => boolean;

export type ActionPayloadHandler = (payload: ActionPayload) => any;

export type CreateActionFunction = (...params: any[]) => Promise<Action>;

export type PuppeteerLifeCycleEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

export type ArrayGeneratorFunction = (...params: any[]) => Promise<any[]>;

export type GetValueFromParamsFunction = (params: any) => any;

export type GetValueFromOutputsFunction = (outputs: any[]) => any;
