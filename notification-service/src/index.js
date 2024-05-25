const express = require('express');
const bodyParser = require('body-parser');
const notificationController = require('./notificationController');
const { connectRabbitMQ, consumeMessages } = require('./rabbitmq');

const app = express();
app.use(bodyParser.json());

app.post('/notify', notificationController.sendNotification);

connectRabbitMQ().then(() => {
  consumeMessages();
  app.listen(3001, () => {
    console.log('Notification service listening on port 3001');
  });
});
