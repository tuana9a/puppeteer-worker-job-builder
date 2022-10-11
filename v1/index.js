const { Action, ActionPayload, BreakPointAction, IfAction, ActionLog } = require("./core");
const { InvalidBreakPointError, InvalidJobError, JobBuilderError, NotActionError, NotAnArrayOfActionsError, NotHaveAtLeastOneBreakPointInRepeatUntilError, NotInSupportedValuesError, RequiredParamError } = require("./errors");
const Job = require("./job");

/**
 * @param {string} selector
 * @returns {Action}
 */
function Click(selector, opts = { clickCount: 1 }) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(Click.name);
  return new Action().withName(`${Click.name}: ${selector}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.click(selector, opts);
  });
}

/**
 *
 * @param {string} url
 * @returns {Action}
 */
function GoTo(url) {
  if (!url) throw new RequiredParamError("url").withBuilderName(GoTo.name);
  return new Action().withName(`${GoTo.name}: ${url}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.goto(url);
  });
}

/**
 *
 * @returns {Action}
 */
function CurrentUrl() {
  return new Action().withName(`${CurrentUrl.name}`).withHandler((payload) => {
    const { page } = payload;
    const output = page.url();
    return output;
  });
}

/**
 *
 * @returns {Action}
 */
function Reload() {
  return new Action().withName(Reload.name).withHandler(async (payload) => {
    const { page } = payload;
    await page.reload();
  });
}

/**
 *
 * @returns {Action}
 */
function F5() {
  return Reload();
}

/**
 *
 * @param {number} timeout
 * @returns {Action}
 */
function WaitForTimeout(timeout) {
  if (!timeout) throw new RequiredParamError("timeout").withBuilderName(WaitForTimeout.name);
  return new Action().withName(`${WaitForTimeout.name}: ${timeout}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.waitForTimeout(timeout);
  });
}

/**
 * @returns {Action}
 */
function BringToFront() {
  return new Action().withName(`${BringToFront.name}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.bringToFront();
  });
}

/**
 * @param {string} selector
 * @returns {Action}
 */
function ScreenShot(selector, saveTo = "./tmp/temp.png", type = "png") {
  return new Action().withName(`${ScreenShot.name}: ${selector}`).withHandler(async (payload) => {
    const { page } = payload;
    const _output = { saveTo: saveTo, type: type };
    if (!selector) {
      await page.screenshot({ path: saveTo, type: type });
      return _output;
    }
    const element = await page.$(selector);
    await element.screenshot({ path: saveTo, type: type });
    return _output;
  });
}

/**
 * @param {string} waitUntil
 * @returns {Action}
 */
function WaitForNavigation(waitUntil = "networkidle0") {
  return new Action().withName(`${ScreenShot.name}: ${waitUntil}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.waitForNavigation({ waitUntil: waitUntil });
  });
}

/**
 * @param {Function} getter (params) => { your code }
 * @returns {Action}
 */
function GetValueFromParams(getter) {
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
 * @param {Number | string | Function} getter
 * @returns {Action}
 */
function GetActionOutput(getter) {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(GetValueFromParams.name);

  // not "not a number" so it's a number
  if (!Number.isNaN(getter)) {
    const idx = parseInt(getter);
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
  return new Action().withName(`${GetActionOutput.name}: ${getter.name}`).withHandler(async (payload) => {
    const { logs } = payload;
    const outputs = logs.map((x) => x.output);
    const output = await getter(outputs);
    return output;
  });
}

/**
 * @returns {Action}
 */
function GetOutputFromPreviousAction() {
  return GetActionOutput("prev");
}

/**
 * @param {string} selector
 * @returns {Action}
 */
function GetTextContent(selector) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(GetValueFromParams.name);

  return new Action().withName(`${GetTextContent.name}: ${selector}`).withHandler(async (payload) => {
    const { page } = payload;
    const output = page.$eval(selector, (e) => e.textContent);
    return output;
  });
}

/**
 * Ex: TypeIn("#input-username", "123412341234")
 * Ex: TypeIn("#input-password", GetTextContent("#hidden-password"))
 * @param {string} selector
 * @param {string | Action} getter
 * @returns {Action}
 */
function TypeIn(selector, getter) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(TypeIn.name);
  if (!getter) throw new RequiredParamError("getter").withBuilderName(TypeIn.name);

  if (getter.__isMeAction) {
    return new Action().withName(`${TypeIn.name}: ${selector} by ${getter.name}`).withHandler(async (payload) => {
      const valueToType = await getter.withPayload(payload).run();
      const { page } = payload;
      await page.type(selector, valueToType);
      return valueToType;
    });
  }

  const valueToType = String(getter); // default string input
  return new Action().withName(`${TypeIn.name}: ${valueToType}`).withHandler(async (payload) => {
    const { page } = payload;
    await page.type(selector, valueToType);
  });
}

/**
 *
 * @returns {BreakPointAction}
 */
function BreakPoint() {
  return new BreakPointAction().withName(BreakPoint.name);
}

/**
 * @param {Action} action
 * @returns {IfAction}
 */
function If(action) {
  return new IfAction(action).withName(If.name);
}

/**
 *
 * @param {Function | Action} getter
 * @param {*} value
 */
function IsEqual(getter, value) {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(IsEqual.name);
  if (getter.__isMeAction) {
    Action.throwIfNotValidAction(getter);
    return new Action().withName(`${IsEqual.name}: ${getter.name} == ${value}`).withHandler(async (payload) => {
      const gotValue = await getter.withPayload(payload).run();
      // eslint-disable-next-line eqeqeq
      if (gotValue == value) {
        return true;
      }
      return false;
    });
  }

  return new Action().withName(IsEqual.name).withHandler(async (payload) => {
    const gotValue = await getter(payload);
    // eslint-disable-next-line eqeqeq
    if (gotValue == value) {
      return true;
    }
    return false;
  });
}

/**
 *
 * @param {Function | Action} getter
 * @param {*} value
 */
function IsStrictEqual(getter, value) {
  if (!getter) throw new RequiredParamError("getter").withBuilderName(IsEqual.name);
  if (getter.__isMeAction) {
    Action.throwIfNotValidAction(getter);
    return new Action().withName(`${IsEqual.name}: ${getter.name} == ${value}`).withHandler(async (payload) => {
      const gotValue = await getter.withPayload(payload).run();
      // eslint-disable-next-line eqeqeq
      if (gotValue == value) {
        return true;
      }
      return false;
    });
  }

  return new Action().withName(IsEqual.name).withHandler(async (payload) => {
    const gotValue = await getter(payload);
    // eslint-disable-next-line eqeqeq
    if (gotValue == value) {
      return true;
    }
    return false;
  });
}

/**
 *
 * @param {Function} handler
 * @returns {Action}
 */
function PageEval(handler) {
  if (!handler) throw new RequiredParamError("handler").withBuilderName(PageEval.name);

  return new Action().withName(`${PageEval.name}: ${handler.name}`).withHandler(async (payload) => {
    const { page } = payload;
    const output = await page.evaluate(handler);
    return output;
  });
}

module.exports = {
  JobBuilderError,
  RequiredParamError,
  NotActionError,
  NotInSupportedValuesError,
  NotAnArrayOfActionsError,
  NotHaveAtLeastOneBreakPointInRepeatUntilError,
  InvalidJobError,
  InvalidBreakPointError,
  Action,
  ActionLog,
  BreakPointAction,
  IfAction,
  ActionPayload,
  Job,
  Click,
  GoTo,
  CurrentUrl,
  Reload,
  F5,
  WaitForTimeout,
  WaitForNavigation,
  BringToFront,
  ScreenShot,
  GetValueFromParams,
  GetActionOutput,
  GetOutputFromPreviousAction,
  GetTextContent,
  TypeIn,
  BreakPoint,
  If,
  PageEval,
  IsEqual,
  IsStrictEqual,
};
