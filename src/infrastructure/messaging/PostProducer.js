const kafka = require('./kafkaclient');
const producer = kafka.producer();

const publishPostCreated = async (post) => {
  try {
    await producer.connect();
    await producer.send({
      topic: 'post-events', 
      messages: [
        {
          value: JSON.stringify({
            event: 'POST_CREATED',
            data: post,
            timestamp: new Date()
          })
        }
      ],
    });
    console.log(`[KAFKA PRODUCER] Event 'POST_CREATED' published for Post ID: ${post.id}`);
  } catch (error) {
    console.error('[KAFKA PRODUCER ERROR]', error.message);
  } finally {
    await producer.disconnect();
  }
};

module.exports = { publishPostCreated };