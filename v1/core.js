const { RequiredParamError, NotAnArrayOfActionsError, NotActionError } = require("./errors");

class ActionLog {
  constructor({ action, output, error, at }) {
    this.action = action;
    this.output = output;
    this.error = error;
    this.at = at || Date.now();
  }
}

class ActionPayload {
  constructor({ params, libs, ctx, page, logs, currentIdx, actions, stacks, isBreak }) {
    this.params = params;
    this.libs = libs;
    this.ctx = ctx;
    this.page = page;
    this.logs = logs;
    this.currentIdx = currentIdx;
    this.actions = actions;
    this.stacks = stacks;
    this.isBreak = isBreak || (() => false);
  }
}

class Action {
  static DEFAULT_TYPE = "DEFAULT";

  static BREAK_POINT_TYPE = "BREAK_POINT";

  static IF_TYPE = "IF";

  static DEFAULT_MAX_TIMES = 15;

  /**
   * @param {string} name
   * @param {Function} handler
   */
  constructor(type = Action.DEFAULT_TYPE) {
    this.__isMeAction = true;
    this.type = type;
  }

  isBreakPoint() {
    return this.type === Action.BREAK_POINT_TYPE;
  }

  isIf() {
    return this.type === Action.IF_TYPE;
  }

  /**
   *
   * @param {string} name
   * @returns {Action}
   */
  withName(name) {
    this.name = name;
    return this;
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

  /**
   *
   * @param {Function} handler
   * @returns {Action}
   */
  withHandler(handler) {
    this.handler = handler;
    return this;
  }

  async _run() {
    const output = await this.handler(this.payload);
    return output;
  }

  async run() {
    const { payload } = this;
    const output = await this._run();
    payload.logs.push(new ActionLog({ action: this.name, output: output }));
    return output;
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
    if (!action.withName) {
      return false;
    }
    if (!action.withHandler) {
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
   * @param {Action} action
   */
  static throwIfNotValidAction(action, builderName) {
    if (!Action.isValidAction(action)) {
      throw new NotActionError(action).withBuilderName(builderName);
    }
  }

  /**
   *
   * @param {Action[]} actions
   */
  static throwIfNotAnArrayOfActions(actions, builderName) {
    if (!actions) throw new RequiredParamError("actions").withBuilderName(builderName);
    if (!Array.isArray(actions)) throw new NotAnArrayOfActionsError(actions).withBuilderName(builderName);
    for (const action of actions) {
      if (!Action.isValidAction(action)) throw new NotAnArrayOfActionsError(actions).withBuilderName(builderName);
    }
  }
}

class BreakPointAction extends Action {
  constructor() {
    super(Action.BREAK_POINT_TYPE);
    this.withHandler((payload) => {
      // eslint-disable-next-line no-param-reassign
      payload.isBreak = () => true;
      return { isBreak: true };
    });
  }
}

class IfAction extends Action {
  /**
   *
   * @param {Action} action
   */
  constructor(action) {
    super(Action.IF_TYPE);
    Action.throwIfNotValidAction(action);
    this._if = action;
    this._then = []; // IMPORTANT
    this._else = []; // IMPORTANT
  }

  /**
   * @param {Action[]} actions
   */
  Then(actions) {
    Action.throwIfNotAnArrayOfActions(actions, this.name);
    this._then = actions;
    return this;
  }

  /**
   *
   * @param {Action[]} actions
   */
  Else(actions) {
    Action.throwIfNotAnArrayOfActions(actions, this.name);
    this._else = actions;
    return this;
  }

  async _run() {
    const { payload } = this;
    const output = await this._if.withPayload(payload).run();
    if (output) {
      if (this._then) { // IMPORTANT check falsy
        payload.stacks.push(...Array.from(this._then).reverse());
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this._else) { // IMPORTANT check falsy
        payload.stacks.push(...Array.from(this._else).reverse());
      }
    }
    return output;
  }
}

module.exports = {
  Action,
  ActionLog,
  ActionPayload,
  BreakPointAction,
  IfAction,
};
