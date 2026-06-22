const serviceClient = require("./serviceClient");
const AppError = require("../utils/AppError");

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || "http://localhost:3001";

const checkProductStock = async (productId) => {
  try {
    const response = await serviceClient.get(`${INVENTORY_SERVICE_URL}/products/${productId}`);
    return response.data.data;
  } catch (error) {
    throw new AppError(
      `Failed to check product stock: ${error.response?.data?.message || error.message}`,
      error.response?.status || 500
    );
  }
};

const deductStock = async (productId, quantity) => {
  try {
    const product = await checkProductStock(productId);

    if (product.quantity < quantity) {
      throw new AppError(
        `Insufficient stock for product ${productId}. Available: ${product.quantity}, Required: ${quantity}`,
        400
      );
    }

    const response = await serviceClient.put(`${INVENTORY_SERVICE_URL}/products/${productId}`, {
      quantity: product.quantity - quantity
    });

    return response.data.data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Failed to deduct stock: ${error.response?.data?.message || error.message}`,
      error.response?.status || 500
    );
  }
};

module.exports = {
  checkProductStock,
  deductStock
};
