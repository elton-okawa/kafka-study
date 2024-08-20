import { parentPort, workerData } from 'worker_threads';
import { getKafkaInstance } from './helpers/kafka';
import { Log } from './models/log';
import { Command, Commands } from './models/command';

const kafka = getKafkaInstance(logInParent);
const consumer = kafka.consumer({
  groupId: 'kafka-study-group',
});

let simulateError = false;

async function start() {
  const { topic } = workerData;

  await consumer.connect();
  await consumer.subscribe({ topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logInfoInParent(
        `[partition-${partition}] [offset-${message.offset}-start] ${message.value?.toString()}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (simulateError) {
        throw new Error('Simulated error');
      }

      logInfoInParent(
        `[partition-${partition}] [offset-${message.offset}-end] ${message.value?.toString()}`,
      );
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

parentPort?.on('message', async (command: Command) => {
  switch (command.type) {
    case Commands.Terminate:
      await gracefulShutdown();
      break;
    case Commands.SimulateError:
      simulateError = command.payload;
      break;
    default:
      throw new Error(`Missing command handler`);
  }
});

start();
