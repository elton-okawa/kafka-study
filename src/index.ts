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

async function start() {
  fastify.get('/', async function handler(request, reply) {
    return { hello: 'world' };
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
    reply.status(200).send();
  });

  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
