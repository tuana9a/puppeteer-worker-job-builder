/* eslint-disable no-unused-vars */

import Action from "./actions/Action";

export interface ClickOpts { clickCount?: number; }

export interface GetActionOutputOpts { fromCurrent?: number; direct?: number }

export interface JobConstructor { name: string; params: any; page: any; libs: any; actions: Action[]; }

export interface JobOpts { doing?: (doing: any) => any }

export type IsBreakFunction = (...params: any[]) => boolean;

export type CreateActionFunction = (...params: any[]) => Promise<Action>;

export type PuppeteerLifeCycleEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

export type ArrayGeneratorFunction = (...params: any[]) => Promise<any[]>;

export type GetValueFromParamsFunction = (params: any) => any;

export type GetValueFromOutputsFunction = (outputs: any[]) => any;
