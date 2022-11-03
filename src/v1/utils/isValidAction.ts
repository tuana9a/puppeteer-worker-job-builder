import Action from "../Action";

export default function isValidAction(action: Action) {
  if (!action.__isMeAction) {
    return false;
  }
  return true;
}
