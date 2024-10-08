export enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warn',
}

export type ConsumerStatus = {
  name: string;
  active: boolean;
  simulateError: boolean;
};

export type ConsumersData = {
  status: ConsumerStatus[];
  logs: Log[];
};

export type Log = {
  level: LogLevel;
  timestamp: string;
  message: string;
  origin: string;
};

export type Message = {
  key?: string;
  value: string;
};
