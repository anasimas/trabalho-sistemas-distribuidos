const amqp = require('amqplib');

let channel = null;

async function connectRabbitMQ() {
  const conn = await amqp.connect('amqp://localhost');
  channel = await conn.createChannel();
}

function getChannel() {
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };
