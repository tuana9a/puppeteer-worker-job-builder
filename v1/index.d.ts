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

export class ActionLog {
  action: Action;
  output: any;
  error: any;
  at: number;
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
  isBreak: Function;
  constructor(obj: ActionPayload);
};

type ActionPayloadHandler = (_payload: ActionPayload) => Promise<any>;

export class Action {
  static DEFAULT_TYPE = "default";

  static BREAK_POINT_TYPE = "breakPoint";

  static IF_TYPE = "if";

  static DEFAULT_MAX_TIMES = 15;

  name: string;
  handler: ActionPayloadHandler;
  payload: ActionPayload;
  type: string;
  __isMeAction: boolean;

  constructor(type = Action.DEFAULT_TYPE);

  static isValidAction(action: Action): boolean;

  static throwIfNotAnArrayOfActions(actions: Action[], builderName: string): void;

  isBreakPoint(): boolean;

  isIf(): boolean;

  withPayload(payload: ActionPayload): Action;

  withName(name: string): Action;

  withHandler(handler: ActionPayloadHandler): Action;

  async run(): Promise<any>;
};

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

export function ScreenShot(selector?: string, saveTo?: string = "./tmp/temp.png", type?: ImageType = "png"): Action;

export function WaitForNavigation(waitUntil: PuppeteerLifeCycleEvent): Action;

export function GetValueFromParams(getter: Function): Action;

export function GetActionOutput(getter: Number | string | Function): Action;

export function GetOutputFromPreviousAction(): Action;

export function GetTextContent(selector: string): Action;

export function TypeIn(selector: string, getter: string | Action): Action;

export function BreakPoint(): BreakPointAction;

export function If(action: Action): IfAction;

export function PageEval(handler?: Function): Action;

export function IsEqual(getter: Function | Action, value: any): Action;

export function IsStrictEqual(getter: Function | Action, value: any): Action;