import { randomUUID } from 'crypto';
import { Kafka } from 'kafkajs';
import { Log } from '../models/log';

export function getKafkaInstance(logger: (message: Log) => void) {
  return new Kafka({
    clientId: `kafka-study-${randomUUID()}`,
    brokers: process.env.KAFKA_BROKERS?.split(',') ?? [],
    logCreator:
      (logLevel) =>
      ({ namespace, level, label, log }) => {
        logger({
          level: label.toLowerCase(),
          message: `[${namespace}] ${log.message}`,
          timestamp: log.timestamp,
        });
      },
  });
}
