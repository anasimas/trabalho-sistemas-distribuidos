const { Pool } = require('pg');
const amqp = require('amqplib');

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

async function publishMessage(channel, queue, message) {
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
}

exports.handlePayment = async (paymentData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query(
      'INSERT INTO transactions(amount, status) VALUES($1, $2) RETURNING id',
      [paymentData.amount, 'pending']
    );
    const transactionId = res.rows[0].id;

    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();

    await publishMessage(channel, 'notification', JSON.stringify({
      transactionId,
      status: 'pending',
      amount: paymentData.amount,
    }));

    await client.query('COMMIT');
    return { transactionId, status: 'pending' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
