const { v4: uuidv4 } = require("uuid");
const AppError = require("../utils/AppError");

let products = [
  {
    id: uuidv4(),
    name: "Wireless Keyboard",
    price: 49.99,
    quantity: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "USB-C Monitor",
    price: 249.99,
    quantity: 10,
    createdAt: new Date().toISOString()
  }
];

const validateProduct = (payload, partial = false) => {
  const { name, price, quantity } = payload;

  if (!partial || name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      throw new AppError("Product name must be at least 2 characters long", 400);
    }
  }

  if (!partial || price !== undefined) {
    if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
      throw new AppError("Product price must be a non-negative number", 400);
    }
  }

  if (!partial || quantity !== undefined) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new AppError("Product quantity must be a non-negative integer", 400);
    }
  }
};

const getProducts = () => products;

const getProductById = (id) => {
  const product = products.find((item) => item.id === id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
};

const createProduct = (payload) => {
  validateProduct(payload);
  const product = {
    id: uuidv4(),
    name: payload.name.trim(),
    price: payload.price,
    quantity: payload.quantity,
    createdAt: new Date().toISOString()
  };
  products.push(product);
  return product;
};

const updateProduct = (id, payload) => {
  validateProduct(payload, true);
  const product = getProductById(id);
  product.name = payload.name !== undefined ? payload.name.trim() : product.name;
  product.price = payload.price !== undefined ? payload.price : product.price;
  product.quantity = payload.quantity !== undefined ? payload.quantity : product.quantity;
  return product;
};

const deleteProduct = (id) => {
  const product = getProductById(id);
  products = products.filter((item) => item.id !== id);
  return product;
};

const getRawData = () => {
  return "Raw data from the inventory service";
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRawData
};
