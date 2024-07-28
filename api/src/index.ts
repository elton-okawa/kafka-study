import Fastify from 'fastify';
import { setupConsumersApi, startConsumer } from './routes/consumers';
import { setupMessagesApi } from './routes/messages';
import { setupAdminApis } from './routes/admin';
import { FastifySSEPlugin } from 'fastify-sse-v2';
import { setupServerSideEventsApi } from './routes/server-side-events';
import cors from '@fastify/cors';

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
  fastify.register(FastifySSEPlugin);
  await fastify.register(cors);

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
