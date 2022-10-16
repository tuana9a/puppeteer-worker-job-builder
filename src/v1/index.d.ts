/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */

type PuppeteerLifeCycleEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

type ImageType = "png" | "jpeg";

type ActionPayloadHandler = (payload: ActionPayload) => Promise<any>;

type IsBreakFunction = (...params: any[]) => boolean;

type CreateActionFunction = (...params: any[]) => Promise<Action>;

type ActionDefaultType = "DEFAULT"

type ActionType = "DEFAULT" | "BREAK_POINT" | "IF";

type DefaultScreenshotSaveTo = "./tmp/temp.png";

type DefaultScreenshotType = "png";

type ArrayGeneratorFunction = (...params: any[]) => Promise<any[]>;

type GetValueFromParamsFunction = (params: any) => any;

type GetValueFromOutputsFunction = (outputs: any[]) => any;

type Funktsion = (params: any) => any;

export function isValidAction(action: Action): boolean;

export function isValidJob(job: Job): boolean;

export class JobBuilderError extends Error {
  builderName: string;

  withBuilderName(builderName: string): JobBuilderError;
}

export class RequiredParamError extends JobBuilderError {
  paramName: string;
}

export class NotActionError extends JobBuilderError {
  ilegalValue: any;
}

export class NotInSupportedValuesError extends JobBuilderError {
  constructor(supportValues: [], input: any)

  supportedValues: [];

  input: any;
}

export class NotAnArrayOfActionsError extends JobBuilderError {
  ilegalValue: any;
}

export class InvalidJobError extends JobBuilderError {
  constructor(jobName: string);
}

export class ActionLog {
  action: string;

  output: any;

  error: any;

  at: number;
}

export class Action {
  name: string;

  handler: ActionPayloadHandler;

  payload: ActionPayload;

  type: string;

  __isMeAction: boolean;

  constructor(type?: ActionType | ActionDefaultType);

  withPayload(payload: ActionPayload): Action;

  withName(name: string): Action;

  withHandler(handler: ActionPayloadHandler): Action;

  run(): Promise<any>;
}

export class ActionPayload {
  params: any;

  libs: any;

  ctx: any;

  page: any;

  logs: ActionLog[];

  currentIdx: number;

  actions: Action[];

  stacks: Action[];

  isBreak: IsBreakFunction;

  constructor(obj: ActionPayload);
}

export class BreakPointAction extends Action {
  constructor();
}

export class IfAction extends Action {
  _if: Action;

  _then: Action[];

  _else: Action[];

  constructor();

  Then(actions: Action[]): IfAction;

  Else(actions: Action[]): IfAction;
}

export class Job {
  name: string;

  actions: Action[];

  constructor(obj: Job);
}

export class ForAction extends Action {
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

export function ScreenShot(selector?: string, saveTo?: string | DefaultScreenshotSaveTo, type?: ImageType | DefaultScreenshotSaveTo): Action;

export function WaitForNavigation(waitUntil: PuppeteerLifeCycleEvent): Action;

export function GetValueFromParams(getter: (params: any) => any): Action;

export function GetActionOutput(getter: number | string | GetValueFromOutputsFunction): Action;

export function GetOutputFromPreviousAction(): Action;

export function GetTextContent(selector: string): Action;

export function TypeIn(selector: string, getter: string | Action): Action;

export function BreakPoint(): BreakPointAction;

export function If(action: Action): IfAction;

export function For(action: any[] | ArrayGeneratorFunction | Action): ForAction;

export function PageEval(handler?: Funktsion): Action;

export function IsEqual(getter: Funktsion | Action, value: any): Action;

export function IsStrictEqual(getter: Funktsion | Action, value: any): Action;
