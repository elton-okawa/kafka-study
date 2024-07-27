import { parentPort, workerData } from 'worker_threads';
import { getKafkaInstance } from './helpers/kafka';

async function start() {
  const { topic } = workerData;

  const kafka = getKafkaInstance(logInParent);
  const consumer = kafka.consumer({
    groupId: 'kafka-study-group',
  });

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

start();
