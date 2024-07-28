import { parentPort, workerData } from 'worker_threads';
import { getKafkaInstance } from './helpers/kafka';
import { Commands } from './helpers/commands';
import { Log } from './models/log';

const kafka = getKafkaInstance(logInParent);
const consumer = kafka.consumer({
  groupId: 'kafka-study-group',
});

async function start() {
  const { topic } = workerData;

  await consumer.connect();
  await consumer.subscribe({ topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logInfoInParent(`[partition-${partition}] ${message.value?.toString()}`);
    },
  });
}

function logInfoInParent(message: string) {
  logInParent({
    level: 'info',
    message,
    timestamp: new Date().toISOString(),
  });
}

function logInParent(message: Log | undefined) {
  parentPort?.postMessage(message);
}

async function gracefulShutdown() {
  logInfoInParent('Disconnecting from kafka...');
  await consumer.disconnect();

  logInfoInParent('Disconnected');
  process.exit();
}

parentPort?.on('message', async (message) => {
  if (message.type === Commands.Terminate) {
    await gracefulShutdown();
  }
});

start();
