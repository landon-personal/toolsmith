export class ToolSmithError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToolSmithError";
  }
}
