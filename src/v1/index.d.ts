/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */

interface ClickOpts { clickCount?: number; }

interface GetActionOutputOpts { fromCurrent?: number; direct?: number }

interface JobConstructor { name: string; params: any; page: any; libs: any; actions: Action[]; }

type IsBreakFunction = (...params: any[]) => boolean;

type CreateActionFunction = (...params: any[]) => Promise<Action>;

type PuppeteerLifeCycleEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

type ArrayGeneratorFunction = (...params: any[]) => Promise<any[]>;

type GetValueFromParamsFunction = (params: any) => any;

type GetValueFromOutputsFunction = (outputs: any[]) => any;

type ImageType = "png"

declare class ActionLog {
  action: string;

  output: any;

  error: any;

  at: number;
}

declare class Action {
  __isMeAction: boolean;

  __type: string;

  name: string;

  page: any;

  libs: any;

  params: any;

  currentIdx: any;

  isBreak: boolean;

  constructor(type: string);

  withName(name: string): Action;

  run(): Promise<any>;
}

declare class BreakPointAction extends Action {
  constructor();
}

declare class IfAction extends Action {
  _if: Action;

  _then: Action[];

  _else: Action[];

  constructor(action: Action);

  Then(actions: Action[]): IfAction;

  Else(actions: Action[]): IfAction;
}

declare class Job {
  name: string;

  actions: Action[];

  constructor(obj: JobConstructor);
}

declare class ForAction extends Action {
  _generator: any[] | ArrayGeneratorFunction | Action;

  _each: CreateActionFunction[] | Action[];

  Each(actions: CreateActionFunction[] | Action[]): ForAction;
}

export function Click(selector: string, opts?: { clickCount?: number; }): Action;

export function GoTo(url: string): Action;

export function CurrentUrl(): Action;

export function Reload(): Action;

export function F5(): Action;

export function WaitForTimeout(timeout: number): Action;

export function BringToFront(): Action;

export function ScreenShot(selector?: string, saveTo?: string, type?: ImageType): Action;

export function WaitForNavigation(waitUntil: PuppeteerLifeCycleEvent): Action;

export function GetValueFromParams(getter: (params: any) => any): Action;

export function GetActionOutput(getter: number | string | GetValueFromOutputsFunction): Action;

export function GetOutputFromPreviousAction(): Action;

export function GetTextContent(selector: string): Action;

export function TypeIn(selector: string, getter: string | Action): Action;

export function BreakPoint(): BreakPointAction;

export function If(action: Action): IfAction;

export function For(action: any[] | ArrayGeneratorFunction | Action): ForAction;

// eslint-disable-next-line @typescript-eslint/ban-types
export function PageEval(handler?: Function): Action;

export function IsEqual(getter: Action, value: any): Action;

export function IsStrictEqual(getter: Action, value: any): Action;
