import PrettyError from "../types/PrettyError";

export default function toPrettyErr(err: Error): PrettyError {
  return {
    name: err.name,
    message: err.message,
    stack: err.stack.split("\n"),
  };
}
