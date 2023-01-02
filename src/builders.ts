import { PuppeteerLifeCycleEvent } from "puppeteer-core";
import { ClickAction, GoToAction, CurrentUrlAction, ReloadAction, WaitForTimeoutAction, BringToFrontAction, ScreenShotAction, WaitForNavigationAction, GetValueFromParamsAction, GetValueFromOutputAction, GetTextContentAction, TypeInAction, BreakPointAction, IfAction, ForAction, IsEqualAction, IsStrictEqualAction, PageEvalAction, SetVarsAction } from "./actions";
import { Action } from "./core";
import { RequiredParamError } from "./errors";
import { ClickOpts, GetValueFromParamsFunction, GetActionOutputOpts, ArrayGeneratorFunction, SetVarsFunction } from "./types";

export function Click(selector: string, opts: ClickOpts = { clickCount: 1 }) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(Click.name);
  return new ClickAction(selector, opts).withName(`${Click.name}: ${selector}`);
}

export function GoTo(url: string) {
  if (!url) throw new RequiredParamError("url").withBuilderName(GoTo.name);
  return new GoToAction(url).withName(`${GoTo.name}: ${url}`);
}

export function CurrentUrl() {
  return new CurrentUrlAction().withName(`${CurrentUrl.name}`);
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

export function ScreenShot(selector: string, saveTo = "./tmp/temp.png", type: "png" | "jpeg" | "webp" = "png") {
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

export function SetVars(handler: SetVarsFunction) {
  if (!handler) throw new RequiredParamError("handler").withBuilderName(SetVars.name);
  return new SetVarsAction(handler).withName(`${SetVars.name}: ${handler.name}`);
}
