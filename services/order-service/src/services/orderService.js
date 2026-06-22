const { v4: uuidv4 } = require("uuid");
const AppError = require("../utils/AppError");
const { checkProductStock, deductStock } = require("../clients/inventoryClient");
const { processPayment } = require("../clients/paymentClient");

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
    throw new AppError("Order not found!", 404);
  }
  return order;
};

const createOrder = async (payload) => {
  validateOrder(payload);
  
  // Step 1: Check product exists and has stock in inventory service
  const product = await checkProductStock(payload.productId);
  
  // Step 2: Create order with PENDING status
  const order = {
    id: uuidv4(),
    productId: payload.productId.trim(),
    quantity: payload.quantity,
    totalAmount: payload.totalAmount,
    status: "PENDING",
    paymentId: null,
    createdAt: new Date().toISOString()
  };
  orders.push(order);

  try {
    // Step 3: Process payment with payment service
    const payment = await processPayment(order.id, payload.totalAmount);
    
    // Step 4: Deduct stock from inventory service
    await deductStock(payload.productId, payload.quantity);
    
    // Step 5: Update order status to CONFIRMED
    order.status = "CONFIRMED";
    order.paymentId = payment.id;
    
    return order;
  } catch (error) {
    // Rollback: Remove order if payment or inventory operation fails
    orders = orders.filter((item) => item.id !== order.id);
    throw error;
  }
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
