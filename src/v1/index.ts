import Action from "./Action";
import ActionLog from "./ActionLog";
import BreakPointAction from "./actions/BreakPointAction";
import BringToFrontAction from "./actions/BringToFrontAction";
import ClickAction from "./actions/ClickAction";
import CurrentUrlAction from "./actions/CurrentUrlAction";
import ForAction from "./actions/ForAction";
import GetValueFromOutputAction from "./actions/GetActionOutputAction";
import GetTextContentAction from "./actions/GetTextContentAction";
import GetValueFromParamsAction from "./actions/GetValueFromParamsAction";
import GoToAction from "./actions/GoToAction";
import IfAction from "./actions/IfAction";
import IsEqualAction from "./actions/IsEqualAction";
import IsStrictEqualAction from "./actions/IsStrictEqualAction";
import PageEvalAction from "./actions/PageEvalAction";
import ReloadAction from "./actions/ReloadAction";
import ScreenShotAction from "./actions/ScreenShotAction";
import TypeInAction from "./actions/TypeInAction";
import WaitForNavigationAction from "./actions/WaitForNavigationAction";
import WaitForTimeoutAction from "./actions/WaitForTimeoutAction";
import Context from "./Context";
import DoingInfo from "./DoingInfo";
import InvalidGetActionOutputOptsError from "./errors/InvalidGetActionOutputOptsError";
import InvalidJobError from "./errors/InvalidJobError";
import JobBuilderError from "./errors/JobBuilderError";
import NotAnActionError from "./errors/NotAnActionError";
import NotAnArrayOfActionError from "./errors/NotAnArrayOfActionError";
import NotInSupportedValuesError from "./errors/NotInSupportedValuesError";
import RequiredParamError from "./errors/RequiredParamError";
import Job from "./Job";
import ArrayGeneratorFunction from "./types/ArrayGeneratorFunction";
import ClickOpts from "./types/ClickOpts";
import CreateActionFunction from "./types/CreateActionFunction";
import GetActionOutputOpts from "./types/GetActionOutputOpts";
import GetValueFromOutputsFunction from "./types/GetValueFromOutputsFunction";
import GetValueFromParamsFunction from "./types/GetValueFromParamsFunction";
import PuppeteerLifeCycleEvent from "./types/PuppeteerLifeCycleEvent";
import isValidAction from "./utils/isValidAction";
import isValidArrayOfActions from "./utils/isValidArrayOfActions";
import isValidJob from "./utils/isValidJob";
import toPrettyErr from "./utils/toPrettyErr";

export {
  // actions
  Action,
  ActionLog,
  Context,
  DoingInfo,
  Job,
  BreakPointAction,
  BringToFrontAction,
  ClickAction,
  CurrentUrlAction,
  ForAction,
  GetValueFromOutputAction,
  GetTextContentAction,
  GetValueFromParamsAction,
  GoToAction,
  IfAction,
  IsEqualAction,
  IsStrictEqualAction,
  PageEvalAction,
  ReloadAction,
  ScreenShotAction,
  TypeInAction,
  WaitForNavigationAction,
  WaitForTimeoutAction,
  // errors
  InvalidJobError,
  InvalidGetActionOutputOptsError,
  JobBuilderError,
  NotAnActionError,
  NotAnArrayOfActionError,
  NotInSupportedValuesError,
  RequiredParamError,
  // types
  ArrayGeneratorFunction,
  ClickOpts,
  CreateActionFunction,
  GetActionOutputOpts,
  GetValueFromOutputsFunction,
  GetValueFromParamsFunction,
  PuppeteerLifeCycleEvent,
  // utils
  isValidJob,
  isValidAction,
  isValidArrayOfActions,
  toPrettyErr,
};

export function Click(selector: string, opts: ClickOpts = { clickCount: 1 }) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(Click.name);
  return new ClickAction(selector, opts).withName(`${Click.name}: ${selector}`);
}

export function GoTo(url: string) {
  if (!url) throw new RequiredParamError("url").withBuilderName(GoTo.name);
  return new GoToAction(url).withName(`${GoTo.name}: ${url}`);
}

export function CurrentUrl() {
  return new CurrentUrlAction().withName(`${CurrentUrlAction.name}`);
}

export function Reload() {
  return new ReloadAction().withName(Reload.name);
}

export function F5() {
  return new ReloadAction().withName(F5.name);
}

export function WaitForTimeout(timeout: number) {
  if (!timeout) throw new RequiredParamError("timeout").withBuilderName(WaitForTimeout.name);
  return new WaitForTimeoutAction(timeout).withName(`${WaitForTimeout.name}: ${timeout}`);
}

export function BringToFront() {
  return new BringToFrontAction().withName(`${BringToFront.name}`);
}

export function ScreenShot(selector: string, saveTo = "./tmp/temp.png", type = "png") {
  return new ScreenShotAction(selector, saveTo, type).withName(`${ScreenShot.name}: ${selector} > ${saveTo}`);
}

export function WaitForNavigation(waitUntil: PuppeteerLifeCycleEvent = "networkidle0") {
  return new WaitForNavigationAction(waitUntil).withName(`${WaitForNavigation.name}: ${waitUntil}`);
}

export function GetValueFromParams(getter: GetValueFromParamsFunction) {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(GetValueFromParams.name);
  return new GetValueFromParamsAction(getter).withName(`${GetValueFromParams.name}: ${String(getter)}`);
}

export function GetValueFromOutput(opts: GetActionOutputOpts) {
  if (!opts) throw new RequiredParamError("opts").withBuilderName(GetValueFromParams.name);
  return new GetValueFromOutputAction(opts).withName(`${GetValueFromOutput.name}: ${JSON.stringify(opts)}`);
}

export function GetOutputFromPreviousAction() {
  return GetValueFromOutput({ fromCurrent: -1 });
}

export function GetTextContent(selector: string) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(GetTextContent.name);
  return new GetTextContentAction(selector).withName(`${GetTextContent.name}: ${selector}`);
}

/**
 * Ex: TypeIn("#input-username", "123412341234")
 * Ex: TypeIn("#input-password", GetTextContent("#hidden-password"))
 */
export function TypeIn(selector: string, value: string | Action) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(TypeIn.name);
  if (!value) throw new RequiredParamError("value").withBuilderName(TypeIn.name);
  return new TypeInAction(selector, value).withName(`${TypeIn.name}: ${selector}`);
}

export function BreakPoint() {
  return new BreakPointAction().withName(BreakPoint.name);
}

export function If(IF: Action) {
  return new IfAction(IF).withName(`${If.name}: ${IF.name}`);
}

export function For(action: any[] | ArrayGeneratorFunction | Action) {
  return new ForAction(action).withName(For.name);
}

export function IsEqual(getter: Action, value: any) {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(IsEqual.name);
  return new IsEqualAction(getter, value).withName(`${IsEqual.name}: ${getter.name} == ${value}`);
}

export function IsStrictEqual(getter: Action, value: any) {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(IsEqual.name);
  return new IsStrictEqualAction(getter, value).withName(`${IsEqual.name}: ${getter.name} === ${value}`);
}

export function PageEval(handler: () => Promise<any>) {
  if (!handler) throw new RequiredParamError("handler").withBuilderName(PageEval.name);
  return new PageEvalAction(handler).withName(`${PageEval.name}: ${handler.name}`);
}
