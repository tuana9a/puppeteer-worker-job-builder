import { _Click, _GoTo, _CurrentUrl, _Reload, _WaitForTimeout, _BringToFront, _ScreenShot, _WaitForNavigation, _GetValueFromParams, _GetValueFromOutput, _GetTextContent, _TypeIn, _Break, _If, _IsEqual, _IsStrictEqual, _PageEval, _SetVars, _TypeInActionOutputValue, _ForV2, _IsEqualActionOutput, _IsStrictEqualActionOutput, _IfActionOutput } from "./actions";
import { Action } from "./core";
import { RequiredParamError } from "./errors";
import { PuppeteerLifeCycleEvent, ClickOpts, GetValueFromParamsFunction, GetActionOutputOpts, ArrayGeneratorFunction, SetVarsFunction } from "./types";

export function Click(selector: string, opts: ClickOpts = { clickCount: 1 }) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(Click.name);
  return new _Click(selector, opts).withName(`${Click.name}: ${selector}`);
}

export function GoTo(url: string) {
  if (!url) throw new RequiredParamError("url").withBuilderName(GoTo.name);
  return new _GoTo(url).withName(`${GoTo.name}: ${url}`);
}

export function CurrentUrl() {
  return new _CurrentUrl().withName(`${CurrentUrl.name}`);
}

export function Reload() {
  return new _Reload().withName(Reload.name);
}

export function F5() {
  return new _Reload().withName(F5.name);
}

export function WaitForTimeout(timeout: number) {
  if (!timeout) throw new RequiredParamError("timeout").withBuilderName(WaitForTimeout.name);
  return new _WaitForTimeout(timeout).withName(`${WaitForTimeout.name}: ${timeout}`);
}

export function BringToFront() {
  return new _BringToFront().withName(`${BringToFront.name}`);
}

export function ScreenShot(selector: string, saveTo = "./tmp/temp.png", type: "png" | "jpeg" | "webp" = "png") {
  return new _ScreenShot(selector, saveTo, type).withName(`${ScreenShot.name}: ${selector} > ${saveTo}`);
}

export function WaitForNavigation(waitUntil: PuppeteerLifeCycleEvent = "networkidle0") {
  return new _WaitForNavigation(waitUntil).withName(`${WaitForNavigation.name}: ${waitUntil}`);
}

export function GetValueFromParams(getter: GetValueFromParamsFunction) {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(GetValueFromParams.name);
  return new _GetValueFromParams(getter).withName(`${GetValueFromParams.name}: ${String(getter)}`);
}

export function GetValueFromOutput(opts: GetActionOutputOpts) {
  if (!opts) throw new RequiredParamError("opts").withBuilderName(GetValueFromParams.name);
  return new _GetValueFromOutput(opts).withName(`${GetValueFromOutput.name}: ${JSON.stringify(opts)}`);
}

export function GetOutputFromPreviousAction() {
  return GetValueFromOutput({ fromCurrent: -1 });
}

export function GetTextContent(selector: string) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(GetTextContent.name);
  return new _GetTextContent(selector).withName(`${GetTextContent.name}: ${selector}`);
}

/**
 * Ex: TypeIn("#input-username", "123412341234")
 * Ex: TypeIn("#input-password", GetTextContent("#hidden-password"))
 */
export function TypeIn(selector: string, value: string | Action) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(TypeIn.name);
  if (!value) throw new RequiredParamError("value").withBuilderName(TypeIn.name);
  if ((value as Action).__isAction) {
    return new _TypeInActionOutputValue(selector, value as Action).withName(`${TypeIn.name}: ${selector}`);
  }
  return new _TypeIn(selector, value as string).withName(`${TypeIn.name}: ${selector}`);
}

/**
 * @deprecated use Break() instead
 */
export function BreakPoint() {
  return new _Break().withName(BreakPoint.name);
}

export function Break() {
  return new _Break().withName(BreakPoint.name);
}

export function If(_if: Action | any) {
  if ((_if as Action).__isAction) {
    return new _IfActionOutput(_if).withName(`${If.name}: ${_if.name}`);
  }
  return new _If(_if).withName(`${If.name}: ${_if}`);
}

export function For(action: any[] | ArrayGeneratorFunction | Action) {
  return new _ForV2(action).withName(For.name);
}

export function IsEqual(value: Action | any, other: any) {
  if (!value) throw new RequiredParamError("getter").withBuilderName(IsEqual.name);
  if ((value as Action).__isAction) {
    return new _IsEqualActionOutput(value, other).withName(`${IsEqual.name}: ${value.name} == ${other}`);
  }
  return new _IsEqual(value, other).withName(`${IsEqual.name}: ${value} == ${other}`);
}

export function IsStrictEqual(value: Action | any, other: any) {
  if (!value) throw new RequiredParamError("getter").withBuilderName(IsEqual.name);
  if ((value as Action).__isAction) {
    return new _IsStrictEqualActionOutput(value, other).withName(`${IsStrictEqual.name}: ${value.name} === ${other}`);
  }
  return new _IsStrictEqual(value, other).withName(`${IsStrictEqual.name}: ${value} === ${other}`);
}

export function PageEval(handler: () => Promise<any>) {
  if (!handler) throw new RequiredParamError("handler").withBuilderName(PageEval.name);
  return new _PageEval(handler).withName(`${PageEval.name}: ${handler.name}`);
}

export function SetVars(handler: SetVarsFunction) {
  if (!handler) throw new RequiredParamError("handler").withBuilderName(SetVars.name);
  return new _SetVars(handler).withName(`${SetVars.name}: ${handler.name}`);
}
