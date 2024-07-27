import Fastify from 'fastify';
import { setupConsumersApi, startConsumer } from './api/consumers';
import { setupMessagesApi } from './api/messages';
import { setupAdminApis } from './api/admin';
import { FastifySSEPlugin } from 'fastify-sse-v2';
import { setupServerSideEventsApi } from './api/server-side-events';

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
fastify.register(FastifySSEPlugin);

async function start() {
  setupConsumersApi(fastify);
  await setupMessagesApi(fastify);
  await setupAdminApis(fastify);
  await setupServerSideEventsApi(fastify);

  try {
    await fastify.listen({ port: 3000 });
    startConsumer(fastify);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
