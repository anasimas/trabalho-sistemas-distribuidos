const paymentService = require('./paymentService');

exports.processPayment = async (req, res) => {
  try {
    const paymentResult = await paymentService.handlePayment(req.body);
    res.status(200).send(paymentResult);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
