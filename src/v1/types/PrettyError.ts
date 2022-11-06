interface PrettyError {
  name: string,
  message: string,
  stack: string[],
}

export default PrettyError;
