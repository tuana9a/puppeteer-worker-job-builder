class JobBuilderError extends Error {
  /**
   *
   * @param {string} builderName
   * @returns {JobBuilderError}
   */
  withBuilderName(builderName) {
    this.builderName = builderName;
    return this;
  }
}

class RequiredParamError extends JobBuilderError {
  /**
   *
   * @param {string} paramName
   */
  constructor(paramName) {
    super(`${paramName} is undefined`);
    this.paramName = paramName;
  }
}

class NotInSupportedValuesError extends JobBuilderError {
  /**
   *
   * @param {[]} supportedValues
   * @param {*} input
   */
  constructor(supportedValues, input) {
    super(`${input} not in ${supportedValues}`);
    this.supportedValues = supportedValues;
    this.input = input;
  }
}

class NotActionError extends JobBuilderError {
  constructor(ilegalValue) {
    super(`${ilegalValue} is not a Action`);
    this.ilegalValue = ilegalValue;
  }
}

class NotAnArrayOfActionsError extends JobBuilderError {
  constructor(ilegalValue) {
    super(`${ilegalValue} is not an array of Actions`);
    this.ilegalValue = ilegalValue;
  }
}

class NotHaveAtLeastOneBreakPointInRepeatUntilError extends JobBuilderError {
  /**
   *
   * @param {Action[]} actions
   */
  constructor(actions) {
    super(`not have at least one BreakPoint in ${actions}`);
    this.actions = actions;
  }
}

class InvalidBreakPointError extends JobBuilderError {
  /**
   *
   * @param {Action} action
   */
  constructor(action) {
    super(`${action.name} is not a BreakPoint`);
    this.action = action;
  }
}

class InvalidJobError extends JobBuilderError {
  constructor(jobName) {
    super(`Invalid job "${jobName}"`);
  }
}

class ActionPayload {
  constructor({ params, libs, ctx, page, outputs, currentIdx }) {
    this.params = params;
    this.libs = libs;
    this.ctx = ctx;
    this.page = page;
    this.outputs = outputs;
    this.currentIdx = currentIdx;
  }

  static from(obj) {
    return new ActionPayload(obj);
  }
}

class Action {
  static DEFAULT_TYPE = "default";

  static BREAK_POINT_TYPE = "breakPoint";

  static REPEAT_TYPE = "repeat";

  static DEFAULT_MAX_TIMES = 15;

  /**
   * @param {string} name
   * @param {Function} handler
   */
  constructor(name, handler, type = Action.DEFAULT_TYPE) {
    this.__isMeAction = true;
    this.name = name;
    this.handler = handler;
    this.type = type;
  }

  isBreakPoint() {
    return this.type === Action.BREAK_POINT_TYPE;
  }

  isRepeat() {
    return this.type === Action.REPEAT_TYPE;
  }

  /**
   *
   * @param {ActionPayload} payload
   * @returns {Action}
   */
  withPayload(payload) {
    this.payload = payload;
    return this;
  }

  async run() {
    return this.handler(this.payload);
  }

  /**
   *
   * @param {Action} action
   * @returns {boolean}
   */
  static isValidAction(action) {
    if (!action) {
      return false;
    }
    if (!action.withPayload) {
      return false;
    }
    if (!action.run) {
      return false;
    }
    if (!action.__isMeAction) {
      return false;
    }
    return true;
  }

  /**
   *
   * @param {Action[]} actions
   */
  static throwIfNotAnArrayOfActions(actions, builderName) {
    if (!actions) throw new RequiredParamError("actions").withBuilderName(builderName);
    if (!Array.isArray(actions)) throw new NotAnArrayOfActionsError(actions).withBuilderName(builderName);
    for (const action of actions) {
      if (!action.__isMeAction) throw new NotAnArrayOfActionsError(actions).withBuilderName(builderName);
    }
  }
}

class BreakPointAction extends Action {
  /**
   * @param {string} name
   * @param {Function} handler
   * @param {Function | Action | Action[]} doWhenBreak
   */
  constructor(name, handler, doWhenBreak) {
    super(name, handler, Action.BREAK_POINT_TYPE);
    this.doWhenBreak = doWhenBreak;
  }
}

class Job {
  constructor({ name, actions }) {
    this.name = name;
    this.actions = actions;
  }

  /**
   *
   * @param {Job} job
   * @returns {boolean}
   */
  static isValidJob(job) {
    if (!job) {
      return false;
    }
    if (!Array.isArray(job.actions)) {
      return false;
    }
    if (job.actions.length === 0) {
      return false;
    }
    if (!job.actions.every((x) => Action.isValidAction(x))) {
      return false;
    }
    return true;
  }
}

/**
 * @param {string} selector
 * @returns {Action}
 */
function Click(selector, opts = { clickCount: 1 }) {
  if (!selector) throw new RequiredParamError("selector").withBuilderName(Click.name);
  return new Action(`${Click.name}: ${selector}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
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
  return new Action(`${GoTo.name}: ${url}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
    const { page } = payload;
    await page.goto(url);
    return url;
  });
}

/**
 *
 * @returns {Action}
 */
function CurrentUrl() {
  return new Action(`${CurrentUrl.name}`, (_payload) => {
    const payload = ActionPayload.from(_payload);
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
  return new Action(Reload.name, async (_payload) => {
    const payload = ActionPayload.from(_payload);
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
  return new Action(`${WaitForTimeout.name}: ${timeout}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
    const { page } = payload;
    await page.waitForTimeout(timeout);
  });
}

/**
 * @returns {Action}
 */
function BringToFront() {
  return new Action(`${BringToFront.name}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
    const { page } = payload;
    await page.bringToFront();
  });
}

/**
 * @param {string} selector
 * @returns {Action}
 */
function ScreenShot(selector, output = "./tmp/temp.png", type = "png") {
  return new Action(`${ScreenShot.name}: ${selector} output: ${output} type: ${type}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
    const { page } = payload;
    if (!selector) {
      await page.screenshot({ path: output, type: type });
      return;
    }
    const element = await page.$(selector);
    await element.screenshot({ path: output, type: type });
  });
}

/**
 * @param {string} waitUntil
 * @returns {Action}
 */
function WaitForNavigation(waitUntil = "networkidle0") {
  return new Action(`${ScreenShot.name}: ${waitUntil}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
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
  return new Action(`${GetValueFromParams.name}: ${getter.name}`, (_payload) => {
    const payload = ActionPayload.from(_payload);
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
    return new Action(`${GetActionOutput.name}: ${idx}`, (_payload) => {
      const payload = ActionPayload.from(_payload);
      const { outputs } = payload;
      const output = outputs[idx];
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
    return new Action(`${GetActionOutput.name}: ${word}`, (_payload) => {
      const payload = ActionPayload.from(_payload);
      const { outputs, currentIdx } = payload;
      const output = outputs[currentIdx + delta];
      return output;
    });
  }

  // default action
  return new Action(`${GetActionOutput.name}: ${getter.name}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
    const { outputs } = payload;
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

  return new Action(
    `${GetTextContent.name}: ${selector}`,
    async (_payload) => {
      const payload = ActionPayload.from(_payload);
      const { page } = payload;
      const output = page.$eval(selector, (e) => e.textContent);
      return output;
    },
  );
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
    return new Action(`${TypeIn.name}: ${getter.name}`, async (_payload) => {
      const payload = ActionPayload.from(_payload);
      const valueToType = await getter.withPayload(payload).run();
      const { page } = payload;
      await page.type(selector, valueToType);
    });
  }

  const valueToType = String(getter); // default string input
  return new Action(`${TypeIn.name}: ${valueToType}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
    const { page } = payload;
    await page.type(selector, valueToType);
  });
}

/**
 *
 * @param {Action} action
 * @param {Function} handler must return true if breaked or false if not
 * @param {Function | Action | Action[]} doWhenBreak
 * @returns {Action}
 */
function BreakPoint(action, handler, doWhenBreak = undefined) {
  if (!action) throw new RequiredParamError("action").withBuilderName(BreakPoint.name);
  if (!handler) throw new RequiredParamError("handler").withBuilderName(BreakPoint.name);
  if (!action.__isMeAction) throw new NotActionError(action);

  return new BreakPointAction(
    `${BreakPoint.name}: ${action.name} handler: ${handler.name}`,
    async (_payload) => {
      const payload = ActionPayload.from(_payload);
      let paramActionOutput = false;
      try {
        paramActionOutput = await action.withPayload(payload).run();
      } catch (err) {
        // ignored
      }
      const output = await handler(paramActionOutput);
      return output;
    },
    doWhenBreak,
  );
}

/**
 *
 * @param {Function} handler must return true if breaked or false if not
 * @returns {Action}
 */
function BreakPointBaseOnPreviousOutput(handler) {
  if (!handler) throw new RequiredParamError("handler").withBuilderName(BreakPoint.name);
  const getActionOutput = GetOutputFromPreviousAction();

  return new BreakPointAction(`${BreakPoint.name}: ${handler.name}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
    const previousOutput = await getActionOutput.withPayload(payload).run();
    const output = await handler(previousOutput);
    return output;
  });
}

/**
 * @deprecated
 * @param {Action[]} actions list of actions
 * @param {Function} handler must return true if breaked or false if not
 * @param {Number} maxTimes
 * @returns {Action}
 */
function RepeatUntil(actions, handler = (x) => Boolean(x), opts = { maxTimes: false, breakAny: false }) {
  Action.throwIfNotAnArrayOfActions(actions, RepeatUntil.name);
  if (!handler) throw new RequiredParamError("handler").withBuilderName(RepeatUntil.name);
  const maxTimes = opts?.maxTimes || Action.DEFAULT_MAX_TIMES;
  const isBreakAtAny = !opts?.breakAny;
  const actionLength = actions.length;
  if (isBreakAtAny) {
    // default break at the end of actions
    const lastAction = actions[actions.length - 1];
    if (!lastAction.isBreakPoint()) {
      throw new InvalidBreakPointError(lastAction);
    }
  } else if (!actions.some((x) => x.isBreakPoint())) {
    // else break at any place
    throw new NotHaveAtLeastOneBreakPointInRepeatUntilError(actions).withBuilderName(RepeatUntil.name);
  }

  return new Action(`${RepeatUntil.name}: ${handler.name}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
    let timeTh = 0;
    let isBreaked;
    const { outputs, currentIdx } = payload;

    while (!isBreaked && timeTh < maxTimes) {
      const nestedCurrentIdx = timeTh % actionLength;
      const currentAction = actions[nestedCurrentIdx];
      const output = await currentAction.withPayload(payload).run();
      // FIXME: override previous loop output: but for identity we must do this
      outputs[`${currentIdx}-${nestedCurrentIdx}`] = output;
      if (isBreakAtAny) {
        if (currentAction.isBreakPoint()) {
          isBreaked = await handler(output);
        }
      } else if (nestedCurrentIdx === actionLength - 1) {
        isBreaked = await handler(output);
      }
      timeTh += 1;
    }
  });
}

/**
 *
 * @param {Function} handler
 * @returns {Action}
 */
function PageEval(handler) {
  if (!handler) throw new RequiredParamError("handler").withBuilderName(PageEval.name);

  return new Action(`${PageEval.name}: ${handler.name}`, async (_payload) => {
    const payload = ActionPayload.from(_payload);
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
  BreakPointBaseOnPreviousOutput,
  RepeatUntil,
  PageEval,
};
