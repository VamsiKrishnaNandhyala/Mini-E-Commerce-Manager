const paymentService = require("../services/paymentService");
const { successResponse } = require("../utils/response");

const getPayments = (req, res, next) => {
  try {
    successResponse(res, paymentService.getPayments());
  } catch (error) {
    next(error);
  }
};

const getPaymentById = (req, res, next) => {
  try {
    successResponse(res, paymentService.getPaymentById(req.params.id));
  } catch (error) {
    next(error);
  }
};

const createPayment = (req, res, next) => {
  try {
    successResponse(res, paymentService.createPayment(req.body), 201);
  } catch (error) {
    next(error);
  }
};

const updatePayment = (req, res, next) => {
  try {
    successResponse(res, paymentService.updatePayment(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

const deletePayment = (req, res, next) => {
  try {
    successResponse(res, paymentService.deletePayment(req.params.id));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
};
