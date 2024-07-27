import { Worker } from 'worker_threads';
import { Commands } from '../helpers/commands';
import { FastifyBaseLogger } from 'fastify';
import { EventEmitter } from 'stream';

let counter = 0;

export class Consumer {
  static UPDATED_EVENT = 'updated';

  private _worker: Worker;
  private _messages: string[] = [];
  private _name: string;
  private _emitter: EventEmitter;

  get name() {
    return this._name;
  }

  get status() {
    return { name: this._name, messages: this._messages };
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
    this._worker.on('message', (msg) => {
      const fullMessage = `[${this._name}]: ${msg}`;
      this._logger.info(fullMessage);
      this.addMessage(fullMessage);
    });
    this._worker.on('error', (err) =>
      this._logger.error(`[${this._name}]`, err),
    );
    this._worker.on('exit', (code) =>
      this._logger.info(`[${this._name}] Exited with code ${code}.`),
    );
  }

  addMessage(message: string) {
    this._messages.push(message);
    this._emitter.emit(Consumer.UPDATED_EVENT);
  }

  close() {
    this._worker.postMessage({ type: Commands.Terminate });
    this._emitter.removeAllListeners();
  }
}
