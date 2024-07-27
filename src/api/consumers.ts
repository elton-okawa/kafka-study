import { FastifyInstance } from 'fastify';
import { Worker } from 'worker_threads';

const consumers = new Map<string, Worker>();
let counter = 0;

export function setupConsumersApi(fastify: FastifyInstance) {
  fastify.get('/consumers', async (request, reply) => {
    reply.status(200).send(
      Array.from(consumers.keys()).map((name) => ({
        name,
      })),
    );
  });

  fastify.post('/consumers', async (request, reply) => {
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

    reply.status(201).send({ name });
  });

  fastify.delete('/consumers', async (request, reply) => {
    const result = await Promise.all(
      Array.from(consumers.entries()).map(async ([name, worker]) => {
        const statusCode = await worker.terminate();
        return { name, statusCode };
      }),
    );
    consumers.clear();

    reply.status(200).send(result);
  });
}
