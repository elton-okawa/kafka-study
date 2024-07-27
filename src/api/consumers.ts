import { FastifyInstance } from 'fastify';
import { Worker } from 'worker_threads';
import { Commands } from '../helpers/commands';

const consumers = new Map<string, Worker>();
let counter = 0;

export function startConsumer(fastify: FastifyInstance) {
  const worker = new Worker(process.cwd() + '/src/consumer.ts', {
    workerData: { topic: process.env.TOPIC_NAME },
  });
  const id = counter++;
  const name = `worker-${id}`;
  worker.on('message', (msg) => fastify.log.info(`[${name}]: ${msg}`));
  worker.on('error', (err) => fastify.log.error(`[${name}]`, err));
  worker.on('exit', (code) =>
    fastify.log.info(`[${name}] Exited with code ${code}.`),
  );

  consumers.set(name, worker);

  return { worker, name };
}

export function setupConsumersApi(fastify: FastifyInstance) {
  fastify.get('/consumers', async (request, reply) => {
    reply.status(200).send(
      Array.from(consumers.keys()).map((name) => ({
        name,
      })),
    );
  });

  fastify.post('/consumers', async (request, reply) => {
    const { name } = startConsumer(fastify);

    reply.status(201).send({ name });
  });

  fastify.delete('/consumers', async (request, reply) => {
    const result = await Promise.all(
      Array.from(consumers.entries()).map(async ([name, consumer]) => {
        consumer?.postMessage({ type: Commands.Terminate });

        return { name };
      }),
    );
    consumers.clear();

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

      const consumer = consumers.get(name);
      consumers.delete(name);

      consumer?.postMessage({ type: Commands.Terminate });
      reply.status(204).send();
    },
  );
}
