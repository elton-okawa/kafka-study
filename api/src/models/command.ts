export enum Commands {
  Terminate = 'Terminate',
  SimulateError = 'SimulateError',
}

export type CommandTerminate = {
  type: Commands.Terminate;
};

export type CommandSimulateError = {
  type: Commands.SimulateError;
  payload: boolean;
};

export type Command = CommandTerminate | CommandSimulateError;
