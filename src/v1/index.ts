import Action from "./actions/Action";
import BreakPointAction from "./actions/BreakPointAction";
import ForAction from "./actions/ForAction";
import IfAction from "./actions/IfAction";
import NotInSupportedValuesError from "./errors/NotInSupportedValuesError";
import RequiredParamError from "./errors/RequiredParamError";
import { PuppeteerLifeCycleEvent, ActionPayloadHandler, GetValueFromOutputsFunction, ArrayGeneratorFunction } from "./types";

export * from "./utils";
export { default as ActionLog } from "./actions/ActionLog";
export { default as ActionPayload } from "./actions/ActionPayload";
export { default as Job } from "./Job";
export { default as Action } from "./actions/Action";
export { default as BreakPointAction } from "./actions/BreakPointAction";
export { default as ForAction } from "./actions/ForAction";
export { default as IfAction } from "./actions/IfAction";
export { default as NotInSupportedValuesError } from "./errors/NotInSupportedValuesError";
export { default as RequiredParamError } from "./errors/RequiredParamError";
export { default as InvalidJobError } from "./errors/InvalidJobError";
export { default as JobBuilderError } from "./errors/JobBuilderError";
export { default as NotAnActionError } from "./errors/NotAnActionError";
export { default as NotAnArrayOfActionsError } from "./errors/NotAnArrayOfActionError";

export function Click(selector: string, opts = { clickCount: 1 }): Action {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(Click.name);
  return new Action().withName(`${Click.name}: ${selector}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.click(selector, opts);
  });
}

export function GoTo(url: string): Action {
  if (!url) throw new RequiredParamError("url").withBuilderName(GoTo.name);
  return new Action().withName(`${GoTo.name}: ${url}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.goto(url);
  });
}

export function CurrentUrl(): Action {
  return new Action().withName(`${CurrentUrl.name}`).withHandler((payload) => {
    const { page } = payload;
    const output = page.url();
    return output;
  });
}

export function Reload(): Action {
  return new Action().withName(Reload.name).withHandler(async (payload) => {
    const { page } = payload;
    await page.reload();
  });
}

export function F5(): Action {
  return Reload();
}

export function WaitForTimeout(timeout: number): Action {
  if (!timeout) throw new RequiredParamError("timeout").withBuilderName(WaitForTimeout.name);
  return new Action().withName(`${WaitForTimeout.name}: ${timeout}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.waitForTimeout(timeout);
  });
}

export function BringToFront(): Action {
  return new Action().withName(`${BringToFront.name}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.bringToFront();
  });
}

export function ScreenShot(selector: string, saveTo = "./tmp/temp.png", type = "png"): Action {
  return new Action().withName(`${ScreenShot.name}: ${selector}`).withHandler(async (payload) => {
    const { page } = payload;
    const output = { saveTo: saveTo, type: type };
    if (!selector) {
      await page.screenshot({ path: saveTo, type: type });
      return output;
    }
    const element = await page.$(selector);
    await element.screenshot({ path: saveTo, type: type });
    return output;
  });
}

export function WaitForNavigation(waitUntil: PuppeteerLifeCycleEvent = "networkidle0"): Action {
  return new Action().withName(`${ScreenShot.name}: ${waitUntil}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.waitForNavigation({ waitUntil: waitUntil });
  });
}

export function GetValueFromParams(getter: (params: any) => any) {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(GetValueFromParams.name);
  return new Action().withName(`${GetValueFromParams.name}: ${getter.name}`).withHandler((payload) => {
    const { params } = payload;
    const output = getter(params);
    return output;
  });
}

/**
 * Ex: GetActionOutput(0)
 * Ex: GetActionOutput("prev")
 * Ex: GetActionOutput((outputs) => { your code })
 */
export function GetActionOutput(getter: number | string | GetValueFromOutputsFunction): Action {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(GetValueFromParams.name);

  // not "not a number" so it's a number
  const getterString = getter as string;
  if (!Number.isNaN(getter)) {
    const idx = parseInt(getterString);
    return new Action().withName(`${GetActionOutput.name}: ${idx}`).withHandler((payload) => {
      const { logs } = payload;
      const { output } = logs[idx];
      return output;
    });
  }

  // is "string" then check key words
  if (typeof getter === "string" || getter instanceof String) {
    const word = getter;
    let delta = 0;
    if (word === "prev" || word === "previous") {
      delta = -1;
    } else if (word === "next") {
      delta = 1;
    } else {
      throw new NotInSupportedValuesError(["prev", "previous", "next"], word);
    }
    return new Action().withName(`${GetActionOutput.name}: ${word}`).withHandler((payload) => {
      const { logs, currentIdx } = payload;
      const { output } = logs[currentIdx + delta];
      return output;
    });
  }

  // default action
  const getterFunction = getter as GetValueFromOutputsFunction;
  return new Action().withName(`${GetActionOutput.name}: ${(getterFunction).name}`).withHandler(async (payload) => {
    const { logs } = payload;
    const outputs = logs.map((x) => x.output);
    const output = await getterFunction(outputs);
    return output;
  });
}

export function GetOutputFromPreviousAction(): Action {
  return GetActionOutput("prev");
}

export function GetTextContent(selector: string): Action {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(GetValueFromParams.name);

  return new Action().withName(`${GetTextContent.name}: ${selector}`).withHandler(async (payload) => {
    const { page } = payload;
    const output = page.$eval(selector, (e: Element) => e.textContent);
    return output;
  });
}

/**
 * Ex: TypeIn("#input-username", "123412341234")
 * Ex: TypeIn("#input-password", GetTextContent("#hidden-password"))
 */
export function TypeIn(selector: string, getter: string | Action): Action {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(TypeIn.name);
  if (!getter) throw new RequiredParamError("getter").withBuilderName(TypeIn.name);

  if ((getter as Action).__isMeAction) {
    const action = getter as Action;
    return new Action().withName(`${TypeIn.name}: ${selector} ${action.name}`).withHandler(async (payload) => {
      const valueToType = await action.withPayload(payload).run();
      const { page } = payload;
      await page.type(selector, valueToType);
      return valueToType;
    });
  }

  const valueToType = String(getter); // default string input
  return new Action().withName(`${TypeIn.name}: ${selector} ${valueToType}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.type(selector, valueToType);
  });
}

export function BreakPoint(): BreakPointAction {
  return new BreakPointAction().withName(BreakPoint.name);
}

export function If(action: Action): IfAction {
  return new IfAction(action).withName(If.name);
}

export function For(action: any[] | ArrayGeneratorFunction | Action): ForAction {
  return new ForAction(action).withName(For.name);
}

export function IsEqual(getter: ActionPayloadHandler | Action, value: any): Action {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(IsEqual.name);
  const getterAction = getter as Action;
  if (getterAction.__isMeAction) {
    return new Action().withName(`${IsEqual.name}: ${getterAction.name} == ${value}`).withHandler(async (payload) => {
      const gotValue = await getterAction.withPayload(payload).run();
      // eslint-disable-next-line eqeqeq
      if (gotValue == value) {
        return true;
      }
      return false;
    });
  }

  const geterFunction: ActionPayloadHandler = getter as ActionPayloadHandler;
  return new Action().withName(IsEqual.name).withHandler(async (payload) => {
    const gotValue = await geterFunction(payload);
    // eslint-disable-next-line eqeqeq
    if (gotValue == value) {
      return true;
    }
    return false;
  });
}

export function IsStrictEqual(getter: ActionPayloadHandler | Action, value: any): Action {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(IsEqual.name);
  const getterAction = getter as Action;
  if (getterAction.__isMeAction) {
    return new Action().withName(`${IsEqual.name}: ${getterAction.name} == ${value}`).withHandler(async (payload) => {
      const gotValue = await getterAction.withPayload(payload).run();
      // eslint-disable-next-line eqeqeq
      if (gotValue == value) {
        return true;
      }
      return false;
    });
  }

  const geterFunction: ActionPayloadHandler = getter as ActionPayloadHandler;
  return new Action().withName(IsEqual.name).withHandler(async (payload) => {
    const gotValue = await geterFunction(payload);
    // eslint-disable-next-line eqeqeq
    if (gotValue == value) {
      return true;
    }
    return false;
  });
}

export function PageEval(handler: ActionPayloadHandler): Action {
  if (!handler) throw new RequiredParamError("handler").withBuilderName(PageEval.name);

  return new Action().withName(`${PageEval.name}: ${handler.name}`).withHandler(async (payload) => {
    const { page } = payload;
    const output = await page.evaluate(handler);
    return output;
  });
}
