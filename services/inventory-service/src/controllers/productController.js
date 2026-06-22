const productService = require("../services/productService");
const { successResponse, successResponseWithMessage } = require("../utils/response");

const getProducts = (req, res, next) => {
  try {
    successResponse(res, productService.getProducts());
  } catch (error) {
    next(error);
  }
};

const getProductById = (req, res, next) => {
  try {
    successResponse(res, productService.getProductById(req.params.id));
  } catch (error) {
    next(error);
  }
};

const createProduct = (req, res, next) => {
  try {
    successResponse(res, productService.createProduct(req.body), 201);
  } catch (error) {
    next(error);
  }
};

const updateProduct = (req, res, next) => {
  try {
    successResponse(res, productService.updateProduct(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

const deleteProduct = (req, res, next) => {
  try {
    successResponse(res, productService.deleteProduct(req.params.id));
  } catch (error) {
    next(error);
  }
};

const getRawData = (req, res, next) => {
  try {
    const rawData = productService.getRawData();
    successResponseWithMessage(res, 200, "raw data fetched successfully");
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRawData
};
