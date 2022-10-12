# puppeteer-worker-job-builder

# runner

```js
const fs = require("fs");
const _axios = require("axios");
const FormData = require("form-data");
const { Job, ActionPayload, InvalidJobError, ActionLog } = require("puppeteer-worker-job-builder/v1");

const axios = _axios.default.create();

class JobRunner {
  /**
   *
   * @param {Job} job
   * @param {puppeteer.Page} page
   * @param {*} params
   * @returns
   */
  async run(job, page, params) {
    const { actions } = job;
    const payload = new ActionPayload({
      currentIdx: 0,
      libs: {
        fs: fs,
        axios: axios,
        FormData: FormData,
      },
      page: page,
      params: params,
      logs: [],
      actions: actions,
      stacks: Array.from(actions).reverse(),
    });

    let action = payload.stacks.pop();
    while (!payload.isBreak() && Boolean(action)) {
      try {
        await action.withPayload(payload).run();
        action = payload.stacks.pop();
        payload.currentIdx += 1;
      } catch (error) {
        const err = {
          name: error.name,
          message: error.message,
          stack: error.stack.split("\n"),
        };
        payload.logs.push(new ActionLog({
          action: this.name,
          at: Date.now(),
          err: err,
        }));
        payload.isBreak = () => true;
        break;
      }
    }
    return payload.logs;
  }
}

module.exports = JobRunner;
```