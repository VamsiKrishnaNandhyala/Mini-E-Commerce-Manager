const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.response?.status || 500;
  const message =
    err.response?.data?.message ||
    err.message ||
    "Something went wrong in the API Gateway";

  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
