const serviceClient = require("./serviceClient");
const AppError = require("../utils/AppError");

const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || "http://localhost:3003";

const processPayment = async (orderId, amount) => {
  try {
    const response = await serviceClient.post(`${PAYMENT_SERVICE_URL}/payments`, {
      orderId,
      amount,
      status: "SUCCESS"
    });

    return response.data.data;
  } catch (error) {
    throw new AppError(
      `Failed to process payment: ${error.response?.data?.message || error.message}`,
      error.response?.status || 500
    );
  }
};

const getPaymentStatus = async (paymentId) => {
  try {
    const response = await serviceClient.get(`${PAYMENT_SERVICE_URL}/payments/${paymentId}`);
    return response.data.data;
  } catch (error) {
    throw new AppError(
      `Failed to fetch payment status: ${error.response?.data?.message || error.message}`,
      error.response?.status || 500
    );
  }
};

module.exports = {
  processPayment,
  getPaymentStatus
};
