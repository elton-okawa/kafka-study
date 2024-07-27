import Fastify from 'fastify';
import { Worker } from 'worker_threads';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

const consumers = new Map<number, Worker>();

async function start() {
  fastify.get('/consumers', async (request, reply) => {
    reply.status(200).send(
      Array.from(consumers.keys()).map((id) => ({
        id,
      })),
    );
  });

  fastify.post('/consumers', async (request, reply) => {
    const worker = new Worker(__dirname + '/consumer.ts');
    worker.on('message', (msg) =>
      fastify.log.info(`Worker message received: ${msg}`),
    );
    worker.on('error', (err) => fastify.log.error(err));
    worker.on('exit', (code) =>
      fastify.log.info(`Worker exited with code ${code}.`),
    );
    consumers.set(worker.threadId, worker);

    reply.status(201).send({ id: worker.threadId });
  });

  fastify.delete('/consumers', async (request, reply) => {
    const result = await Promise.all(
      Array.from(consumers.entries()).map(async ([id, worker]) => {
        const statusCode = await worker.terminate();
        return { id, statusCode };
      }),
    );
    consumers.clear();

    reply.status(200).send(result);
  });

  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
