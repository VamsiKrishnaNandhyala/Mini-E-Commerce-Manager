const orderService = require("../services/orderService");
const { successResponse } = require("../utils/response");

const getOrders = (req, res, next) => {
  try {
    successResponse(res, orderService.getOrders());
  } catch (error) {
    next(error);
  }
};

const getOrderById = (req, res, next) => {
  try {
    successResponse(res, orderService.getOrderById(req.params.id));
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    successResponse(res, order, 201);
  } catch (error) {
    next(error);
  }
};

const updateOrder = (req, res, next) => {
  try {
    successResponse(res, orderService.updateOrder(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

const deleteOrder = (req, res, next) => {
  try {
    successResponse(res, orderService.deleteOrder(req.params.id));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
