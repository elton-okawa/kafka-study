import { FastifyInstance } from 'fastify';
import { getKafkaInstance } from '../helpers/kafka';

export async function setupAdminApis(fastify: FastifyInstance) {
  const kafka = getKafkaInstance(fastify.log.info.bind(fastify.log));
  const admin = kafka.admin();
  await admin.connect();

  fastify.get('/admin/topics/metadata', async (request, reply) => {
    const metadata = await admin.fetchTopicMetadata({
      topics: [process.env.TOPIC_NAME ?? ''],
    });
    reply.status(200).send(metadata);
  });
}
