import { FastifyInstance } from 'fastify';

export async function setupHealthCheck(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    reply.status(200).send('Up and running!');
  });
}
