const kafka = require('./kafkaClient');
const consumer = kafka.consumer({ groupId: 'post-consumers' });

const runConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'post-events', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        console.log(`[KAFKA CONSUMER RECEIVED EVENT] Topic: ${topic}`);
        console.log('Payload:', payload);
      },
    });
  } catch (error) {
    console.error('[KAFKA CONSUMER ERROR]', error.message);
  }
};

module.exports = runConsumer;