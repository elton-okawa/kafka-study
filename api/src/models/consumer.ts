import { Worker } from 'worker_threads';
import { Commands } from '../helpers/commands';
import { FastifyBaseLogger } from 'fastify';
import { EventEmitter } from 'stream';
import { Log } from './log';

let counter = 0;

export class Consumer {
  static UPDATED_EVENT = 'updated';

  private _worker: Worker;
  private _messages: Log[] = [];
  private _name: string;
  private _emitter: EventEmitter;

  get name() {
    return this._name;
  }

  get status() {
    return { name: this._name, messages: this._messages };
  }

  get messages() {
    return this._messages;
  }

  get emitter() {
    return this._emitter;
  }

  constructor(private _logger: FastifyBaseLogger) {
    this._emitter = new EventEmitter();
    this._worker = new Worker(process.cwd() + '/src/consumer.ts', {
      workerData: { topic: process.env.TOPIC_NAME },
    });
    this._name = `consumer-${counter++}`;

    this.listen();
  }

  private listen() {
    this._worker.on('message', (log: Log) => {
      (this._logger as any)[log.level](`[${this._name}]: ${log.message}`);
      this.addMessage({ ...log, origin: this._name });
    });
    this._worker.on('error', (err) => {
      this._logger.error(`[${this._name}]`, err);
      this.addErrorMessage(err?.message ?? err);
    });
    this._worker.on('exit', (code) => {
      const content = `Exited with code ${code}.`;
      this._logger.info(`[${this._name}] ${content}`);
      this.addInfoMessage(content);
    });
  }

  private addInfoMessage(content: string) {
    this.addMessage({
      message: content,
      timestamp: new Date().toISOString(),
      level: 'info',
      origin: this._name,
    });
  }

  private addErrorMessage(content: string) {
    this.addMessage({
      message: content,
      timestamp: new Date().toISOString(),
      level: 'error',
      origin: this._name,
    });
  }

  private addMessage(message: Log) {
    this._messages.push(message);
    this._emitter.emit(Consumer.UPDATED_EVENT);
  }

  close() {
    this._worker.postMessage({ type: Commands.Terminate });
    this._emitter.removeAllListeners();
  }
}
