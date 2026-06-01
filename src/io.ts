export interface CommandIO {
  stdout(message: string): void;
  stderr(message: string): void;
}

export const defaultIO: CommandIO = {
  stdout(message: string): void {
    console.log(message);
  },
  stderr(message: string): void {
    console.error(message);
  }
};
