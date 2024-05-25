const notificationService = require('./notificationService');

exports.sendNotification = async (req, res) => {
  try {
    const notificationResult = await notificationService.notify(req.body);
    res.status(200).send(notificationResult);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
