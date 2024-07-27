import { Consumer } from './consumer';

export class Consumers {
  private _refs: Map<string, Consumer>;

  get ids() {
    return Array.from(this._refs.keys());
  }

  get status() {
    return Array.from(this._refs.values()).map((consumer) => consumer.status);
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

  delete(name: string) {
    const consumer = this._refs.get(name);
    this._refs.delete(name);

    consumer?.close();
  }

  async clear() {
    return Array.from(this._refs.entries()).map(([id, consumer]) => {
      consumer?.close();

      return { id };
    });
  }
}
