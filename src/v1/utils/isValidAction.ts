import Action from "../Action";

export default function isValidAction(action: Action) {
  if (!action.__isAction) {
    return false;
  }
  return true;
}
