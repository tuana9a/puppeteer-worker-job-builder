/* eslint-disable no-unused-vars */

import { Action, Context, DoingInfo } from "./core";

export type ArrayGeneratorFunction = (...params: any[]) => Promise<any[]>;
export type CreateActionFunction = (...params: any[]) => Promise<Action>;
export type GetValueFromOutputsFunction = (outputs: any[]) => any;
export type GetValueFromParamsFunction = (params: any) => any;
export type SetVarsFunction = (vars: any) => Promise<any>;
export type PuppeteerLifeCycleEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

export type RunContextFunction = (context: Context) => Promise<any>;
export type OnDoing = (info: DoingInfo) => Promise<any>;

export interface ClickOpts { clickCount?: number; }
export interface GetActionOutputOpts { fromCurrent?: number; direct?: number }
export interface PrettyError {
  name: string,
  message: string,
  stack: string[],
}
