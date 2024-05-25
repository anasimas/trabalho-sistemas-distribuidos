const amqp = require('amqplib');

exports.notify = async (message) => {
  // Implementar lógica de envio de notificação
  console.log('Notificação enviada:', message);
  return { success: true };
};
