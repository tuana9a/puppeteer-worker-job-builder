type PuppeteerLifeCycleEvent = "load" | "domcontentloaded" | "networkidle0" | "networkidle2";

type ImageType = "png" | "jpeg";

export class JobBuilderError extends Error {
  builderName: string;
  withBuilderName(builderName: string): JobBuilderError;
};

export class RequiredParamError extends JobBuilderError {
  paramName: string;
};

export class NotActionError extends JobBuilderError {
  ilegalValue: any;
};

export class NotInSupportedValuesError extends JobBuilderError {
  constructor(supportValues: [], input: any)
  supportedValues: [];
  input: any;
};

export class NotAnArrayOfActionsError extends JobBuilderError {
  ilegalValue: any;
};

export class NotHaveAtLeastOneBreakPointInRepeatUntilError extends JobBuilderError {
  actions: Action[];
}

export class InvalidBreakPointError extends JobBuilderError {
  action: Action;
}

export class InvalidJobError extends JobBuilderError {

}

export class ActionPayload {
  params: any;
  libs: any;
  ctx: any;
  page: any;
  outputs: any[];
  currentIdx: number;
  constructor(obj: ActionPayload);
  static from(obj: ActionPayload): ActionPayload;
};

type ActionPayloadHandler = (_payload: ActionPayload) => Promise<any>;

export class Action {
  static DEFAULT_TYPE = "default";

  static BREAK_POINT_TYPE = "breakPoint";

  static REPEAT_TYPE = "repeat";

  static DEFAULT_MAX_TIMES = 15;

  name: string;
  handler: ActionPayloadHandler;
  payload: ActionPayload;
  type: string;
  __isMeAction: boolean;

  constructor(name: string, handler: ActionPayloadHandler, type = Action.DEFAULT_TYPE);

  static isValidAction(action: Action): boolean;

  static throwIfNotAnArrayOfActions(actions: Action[], builderName: string): void;

  isBreakPoint(): boolean;

  isRepeat(): boolean;

  withPayload(payload: ActionPayload): Action;

  async run(): Promise<any>;
};

export class BreakPointAction extends Action {
  doWhenBreak?: Function | Action | Action[];
  constructor(name: string, handler: Function, doWhenBreak?: Function | Action | Action[]);
}

export class Job {
  name: string;
  actions: Action[];
  constructor(obj: Job);
  static isValidJob(job: Job): boolean;
};

export interface RunPayload {
  job: Job,
  page: any,
  libs: any,
  params: any,
}

export function Click(selector: string, opts?: { clickCount?: number; }): Action;

export function GoTo(url: string): Action;

export function CurrentUrl(): Action;

export function Reload(): Action;

export function F5(): Action;

export function WaitForTimeout(timeout: number): Action;

export function BringToFront(): Action;

export function ScreenShot(selector?: string, output?: string = "./tmp/temp.png", type?: ImageType = "png"): Action;

export function WaitForNavigation(waitUntil: PuppeteerLifeCycleEvent): Action;

export function GetValueFromParams(getter: Function): Action;

export function GetActionOutput(getter: Number | string | Function): Action;

export function GetOutputFromPreviousAction(): Action;

export function GetTextContent(selector: string): Action;

export function TypeIn(selector: string, getter: string | Action): Action;

export function BreakPoint(action: Action, handler: Function, doWhenBreak?: Function | Action | Action[]): Action;

export function BreakPointBaseOnPreviousOutput(handler: Function): Action;

export interface RepeatOpts {
  maxTimes?: number;
  breakAny?: boolean;
}

/**
 * @deprecated
 */
export function RepeatUntil(actions: Action[], handler?: Function, opts?: RepeatOpts): Action;

export function PageEval(handler?: Function): Action;
