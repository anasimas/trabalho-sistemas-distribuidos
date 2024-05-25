const express = require('express');
const bodyParser = require('body-parser');
const paymentController = require('./paymentController');
const { connectRabbitMQ } = require('./rabbitmq');

const app = express();
app.use(bodyParser.json());

app.post('/payment', paymentController.processPayment);

connectRabbitMQ().then(() => {
  app.listen(3000, () => {
    console.log('Payment service listening on port 3000');
  });
});
