export enum LogLevel {
  INFO = 'info',
  ERROR = 'error',
}

export type ConsumerStatus = {
  name: string;
  active: boolean;
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
