import { parentPort, workerData } from 'worker_threads';
import { Kafka } from 'kafkajs';

async function start() {
  const { topic } = workerData;

  const kafka = new Kafka({
    clientId: 'kafka-study',
    brokers: ['localhost:9094'],
  });
  const consumer = kafka.consumer({
    groupId: 'kafka-study-group',
    allowAutoTopicCreation: true,
  });

  await consumer.connect();
  await consumer.subscribe({ topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      parentPort?.postMessage(message.value?.toString());
    },
  });
}

start();
