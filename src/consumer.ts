import { parentPort, workerData } from 'worker_threads';
import { getKafkaInstance } from './helpers/kafka';
import { Commands } from './helpers/commands';

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
      logInParent(message.value?.toString());
    },
  });
}

function logInParent(message: string | undefined) {
  parentPort?.postMessage(message?.toString());
}

async function gracefulShutdown() {
  logInParent('Disconnecting from kafka...');
  await consumer.disconnect();

  logInParent('Disconnected');
  process.exit();
}

parentPort?.on('message', async (message) => {
  if (message.type === Commands.Terminate) {
    await gracefulShutdown();
  }
});

start();
