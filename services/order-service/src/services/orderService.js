const { v4: uuidv4 } = require("uuid");
const AppError = require("../utils/AppError");

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"];

let orders = [
  {
    id: uuidv4(),
    productId: "sample-product-1",
    quantity: 2,
    totalAmount: 99.98,
    status: "PENDING",
    createdAt: new Date().toISOString()
  }
];

const validateOrder = (payload, partial = false) => {
  const { productId, quantity, totalAmount, status } = payload;

  if (!partial || productId !== undefined) {
    if (typeof productId !== "string" || productId.trim().length === 0) {
      throw new AppError("Product ID is required", 400);
    }
  }

  if (!partial || quantity !== undefined) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new AppError("Order quantity must be a positive integer", 400);
    }
  }

  if (!partial || totalAmount !== undefined) {
    if (typeof totalAmount !== "number" || Number.isNaN(totalAmount) || totalAmount < 0) {
      throw new AppError("Total amount must be a non-negative number", 400);
    }
  }

  if (!partial || status !== undefined) {
    if (!ORDER_STATUSES.includes(status)) {
      throw new AppError(`Order status must be one of: ${ORDER_STATUSES.join(", ")}`, 400);
    }
  }
};

const getOrders = () => orders;

const getOrderById = (id) => {
  const order = orders.find((item) => item.id === id);
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  return order;
};

const createOrder = (payload) => {
  validateOrder(payload);
  const order = {
    id: uuidv4(),
    productId: payload.productId.trim(),
    quantity: payload.quantity,
    totalAmount: payload.totalAmount,
    status: payload.status,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  return order;
};

const updateOrder = (id, payload) => {
  validateOrder(payload, true);
  const order = getOrderById(id);
  order.productId = payload.productId !== undefined ? payload.productId.trim() : order.productId;
  order.quantity = payload.quantity !== undefined ? payload.quantity : order.quantity;
  order.totalAmount = payload.totalAmount !== undefined ? payload.totalAmount : order.totalAmount;
  order.status = payload.status !== undefined ? payload.status : order.status;
  return order;
};

const deleteOrder = (id) => {
  const order = getOrderById(id);
  orders = orders.filter((item) => item.id !== id);
  return order;
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
