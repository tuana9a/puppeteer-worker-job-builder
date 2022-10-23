/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */

interface ClickOpts { clickCount?: number; }

interface GetActionOutputOpts { fromCurrent?: number; direct?: number }

interface JobConstructor { name: string; params: any; page: any; libs: any; actions: Action[]; }

interface JobOpts { doing?: (doing: any) => any }

type IsBreakFunction = (...params: any[]) => boolean;

type CreateActionFunction = (...params: any[]) => Promise<Action>;

type PuppeteerLifeCycleEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

type ArrayGeneratorFunction = (...params: any[]) => Promise<any[]>;

type GetValueFromParamsFunction = (params: any) => any;

type GetValueFromOutputsFunction = (outputs: any[]) => any;

type ImageType = "png"

export class JobBuilderError extends Error {
  builderName: string;

  withBuilderName(builderName: string): this;
}

export class RequiredParamError extends JobBuilderError {
  paramName: string;

  constructor(paramName: string);
}

export class InvalidGetActionOutputOptsError extends JobBuilderError {
  value: any;

  constructor(value: any);
}

export class InvalidJobError extends JobBuilderError {
  constructor(jobName: string);
}

export class NotAnActionError extends JobBuilderError {
  ilegalValue: any;

  constructor(ilegalValue: any);
}

export class NotAnArrayOfActionsError extends JobBuilderError {
  ilegalValue: any;

  constructor(ilegalValue: any);
}

export class NotInSupportedValuesError extends JobBuilderError {
  input: any;

  supportedValues: any[];

  constructor(supportedValues: any[], input: any);
}

export class ActionLog {
  action: string;

  output: any;

  error: any;

  at: number;
}

export class Action {
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

export class BreakPointAction extends Action {
  constructor();
}

export class IfAction extends Action {
  _if: Action;

  _then: Action[];

  _else: Action[];

  constructor(action: Action);

  Then(actions: Action[]): IfAction;

  Else(actions: Action[]): IfAction;
}

export class Job {
  name: string;

  params: any;

  page: any;

  libs: any;

  actions: Action[];

  stacks: Action[];

  outputs: Action[];

  opts: JobOpts;

  constructor(obj: JobConstructor);

  withOpts(opts: JobOpts): Job;
}

export class ForAction extends Action {
  _generator: any[] | ArrayGeneratorFunction | Action;

  _each: CreateActionFunction[] | Action[];

  Each(actions: CreateActionFunction[] | Action[]): ForAction;
}

export function Click(selector: string, opts?: ClickOpts): Action;

export function GoTo(url: string): Action;

export function CurrentUrl(): Action;

export function Reload(): Action;

export function F5(): Action;

export function WaitForTimeout(timeout: number): Action;

export function BringToFront(): Action;

export function ScreenShot(selector?: string, saveTo?: string, type?: ImageType): Action;

export function WaitForNavigation(waitUntil: PuppeteerLifeCycleEvent): Action;

export function GetValueFromParams(getter: (params: any) => any): Action;

export function GetActionOutput(which: GetActionOutputOpts): Action;

export function GetOutputFromPreviousAction(): Action;

export function GetTextContent(selector: string): Action;

export function TypeIn(selector: string, value: string | Action): Action;

export function BreakPoint(): BreakPointAction;

export function If(IF: Action): IfAction;

export function For(action: any[] | ArrayGeneratorFunction | Action): ForAction;

// eslint-disable-next-line @typescript-eslint/ban-types
export function PageEval(handler?: Function): Action;

export function IsEqual(getter: Action, value: any): Action;

export function IsStrictEqual(getter: Action, value: any): Action;
