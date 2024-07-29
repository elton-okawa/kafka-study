import { Consumer } from './consumer';

export class Consumers {
  private _refs: Map<string, Consumer>;

  get ids() {
    return Array.from(this._refs.keys());
  }

  get status() {
    return {
      status: Array.from(this._refs.values()).map(
        (consumer) => consumer.status,
      ),
      logs: Array.from(this._refs.values())
        .flatMap((consumer) => consumer.logs)
        .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)),
    };
  }

  constructor() {
    this._refs = new Map();
  }

  has(name: string) {
    return this._refs.has(name);
  }

  set(name: string, consumer: Consumer) {
    return this._refs.set(name, consumer);
  }

  stop(name: string) {
    const consumer = this._refs.get(name);

    consumer?.close();
  }

  stopAll() {
    for (const consumer of this._refs.values()) {
      if (consumer.status.active) {
        consumer?.close();
      }
    }
  }

  clearAll() {
    this.stopAll();
    this._refs.clear();
  }
}
