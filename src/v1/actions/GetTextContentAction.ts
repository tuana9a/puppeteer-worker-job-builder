import Action from "./Action";

export default class GetTextContentAction extends Action {
  selector: string;

  constructor(selector: string) {
    super(GetTextContentAction.name);
    this.selector = selector;
  }

  async run() {
    const output = await this.page.$eval(this.selector, (e: Element) => e.textContent);
    return output;
  }
}
