import EventEmitter from 'events';
import { FastifyInstance } from 'fastify';
import { consumers } from '../data/consumers';

const events = new EventEmitter();

export function sendToClient(data: any) {
  events.emit('data', data);
}

export function setupServerSideEventsApi(fastify: FastifyInstance) {
  fastify.get('/listen', {}, (request, reply) => {
    events.on('data', (data) =>
      reply.sse({ event: 'consumers', data: JSON.stringify(data) }),
    );
    request.socket.on('close', () => events.removeAllListeners());

    reply.sse({ event: 'consumers', data: JSON.stringify(consumers.messages) });
  });
}
