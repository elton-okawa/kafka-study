import { randomUUID } from 'crypto';
import { Kafka } from 'kafkajs';

export function getKafkaInstance(logger: (message: string) => void) {
  return new Kafka({
    clientId: `kafka-study-${randomUUID()}`,
    brokers: ['localhost:9094'],
    logCreator:
      (logLevel) =>
      ({ namespace, level, label, log }) => {
        logger(`[${label}] [${namespace}] ${log.message}`);
      },
  });
}
