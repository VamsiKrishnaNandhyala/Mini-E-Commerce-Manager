const { v4: uuidv4 } = require("uuid");
const AppError = require("../utils/AppError");

const PAYMENT_STATUSES = ["SUCCESS", "FAILED", "PENDING"];

let payments = [
  {
    id: uuidv4(),
    orderId: "sample-order-1",
    amount: 99.98,
    status: "PENDING",
    transactionId: `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString()
  }
];

const validatePayment = (payload, partial = false) => {
  const { orderId, amount, status, transactionId } = payload;

  if (!partial || orderId !== undefined) {
    if (typeof orderId !== "string" || orderId.trim().length === 0) {
      throw new AppError("Order ID is required", 400);
    }
  }

  if (!partial || amount !== undefined) {
    if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
      throw new AppError("Payment amount must be a non-negative number", 400);
    }
  }

  if (!partial || status !== undefined) {
    if (!PAYMENT_STATUSES.includes(status)) {
      throw new AppError(`Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`, 400);
    }
  }

  if (transactionId !== undefined && (typeof transactionId !== "string" || transactionId.trim().length === 0)) {
    throw new AppError("Transaction ID must be a non-empty string", 400);
  }
};

const getPayments = () => payments;

const getPaymentById = (id) => {
  const payment = payments.find((item) => item.id === id);
  if (!payment) {
    throw new AppError("Payment not found", 404);
  }
  return payment;
};

const createPayment = (payload) => {
  validatePayment(payload);
  const payment = {
    id: uuidv4(),
    orderId: payload.orderId.trim(),
    amount: payload.amount,
    status: payload.status,
    transactionId: payload.transactionId?.trim() || `TXN-${uuidv4().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString()
  };
  payments.push(payment);
  return payment;
};

const updatePayment = (id, payload) => {
  validatePayment(payload, true);
  const payment = getPaymentById(id);
  payment.orderId = payload.orderId !== undefined ? payload.orderId.trim() : payment.orderId;
  payment.amount = payload.amount !== undefined ? payload.amount : payment.amount;
  payment.status = payload.status !== undefined ? payload.status : payment.status;
  payment.transactionId =
    payload.transactionId !== undefined ? payload.transactionId.trim() : payment.transactionId;
  return payment;
};

const deletePayment = (id) => {
  const payment = getPaymentById(id);
  payments = payments.filter((item) => item.id !== id);
  return payment;
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
};
