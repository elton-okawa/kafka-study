import Fastify from 'fastify';
import { setupConsumersApi } from './api/consumers';
import { setupMessagesApi } from './api/messages';

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
  disableRequestLogging: true,
});

async function start() {
  setupConsumersApi(fastify);
  await setupMessagesApi(fastify);

  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
