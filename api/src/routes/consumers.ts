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

  fastify.put<{ Body: { active: boolean } }>(
    '/consumers',
    async (request, reply) => {
      if (!request.body.active) {
        consumers.stopAll();
      }
      // TODO handle active true

      reply.status(204).send();
    },
  );

  fastify.put<{ Params: { name: string }; Body: { active: boolean } }>(
    '/consumers/:name/active',
    async (request, reply) => {
      const name = request.params.name;
      if (!consumers.has(name)) {
        return reply
          .status(404)
          .send({ message: `Consumer '${name}' not found` });
      }

      if (!request.body.active) {
        consumers.stop(name);
      }
      // TODO handle active true

      reply.status(204).send();
    },
  );

  fastify.put<{ Params: { name: string }; Body: { simulate: boolean } }>(
    '/consumers/:name/simulate-error',
    async (request, reply) => {
      const name = request.params.name;
      if (!consumers.has(name)) {
        return reply
          .status(404)
          .send({ message: `Consumer '${name}' not found` });
      }

      consumers.get(name)?.simulateError(request.body.simulate);
      reply.status(204).send();
    },
  );

  fastify.delete('/consumers', async (request, reply) => {
    consumers.clearAll();
    sendToClient(consumers.status);
    reply.status(204).send();
  });
}
