import { FastifyInstance } from 'fastify';
import { Consumer } from '../models/consumer';
import { sendToClient } from './server-side-events';
import { consumers } from '../data/consumers';

export function startConsumer(fastify: FastifyInstance) {
  const consumer = new Consumer(fastify.log);
  consumer.emitter.on(Consumer.UPDATED_EVENT, () => {
    sendToClient(consumers.status);
  });
  consumers.set(consumer.name, consumer);

  return consumer;
}

export function setupConsumersApi(fastify: FastifyInstance) {
  fastify.get('/consumers', async (request, reply) => {
    reply.status(200).send(consumers.ids);
  });

  fastify.post('/consumers', async (request, reply) => {
    const { name } = startConsumer(fastify);

    reply.status(201).send({ name });
  });

  fastify.delete('/consumers', async (request, reply) => {
    const result = await consumers.clear();

    reply.status(200).send(result);
  });

  fastify.delete<{ Params: { name: string } }>(
    '/consumers/:name',
    async (request, reply) => {
      const name = request.params.name;
      if (!consumers.has(name)) {
        return reply
          .status(404)
          .send({ message: `Consumer '${name}' not found` });
      }

      consumers.delete(name);
      reply.status(204).send();
    },
  );
}
