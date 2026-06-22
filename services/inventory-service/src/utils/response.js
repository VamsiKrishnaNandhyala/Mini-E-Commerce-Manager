const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

const successResponseWithMessage = (res, statusCode = 200, message) => {
  return res.status(statusCode).json({ success: true, message });
}

module.exports = { successResponse, successResponseWithMessage };
