const amqp = require('amqplib');
const notificationService = require('./notificationService');

let channel = null;

async function connectRabbitMQ() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
}

function getChannel() {
  return channel;
}

async function consumeMessages() {
  await channel.assertQueue('notification', { durable: true });
  channel.consume('notification', async (msg) => {
    if (msg !== null) {
      const message = JSON.parse(msg.content.toString());
      await notificationService.notify(message);
      channel.ack(msg);
    }
  });
}

module.exports = { connectRabbitMQ, getChannel, consumeMessages };
