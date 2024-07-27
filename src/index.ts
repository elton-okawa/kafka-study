import Fastify from 'fastify';
import { setupConsumersApi, startConsumer } from './api/consumers';
import { setupMessagesApi } from './api/messages';
import { setupAdminApis } from './api/admin';

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
  await setupAdminApis(fastify);

  try {
    await fastify.listen({ port: 3000 });
    startConsumer(fastify);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
