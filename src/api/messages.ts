import { FastifyInstance } from 'fastify';
import { getKafkaInstance } from '../helpers/kafka';

export async function setupMessagesApi(fastify: FastifyInstance) {
  const kafka = getKafkaInstance(fastify.log.info.bind(fastify.log));
  const producer = kafka.producer();
  await producer.connect();

  fastify.post<{ Body: { key?: string; value: string } }>(
    '/messages',
    async (request, reply) => {
      await producer.send({
        topic: process.env.TOPIC_NAME ?? '',
        messages: [request.body],
      });

      reply.status(200).send();
    },
  );
}
