import Action from "../Action";
import isValidAction from "./isValidAction";

export default function isValidArrayOfActions(actions: Action[]) {
  if (!actions) return false;
  if (!Array.isArray(actions)) return false;
  if (actions.some((x) => !isValidAction(x))) return false;
  return true;
}
