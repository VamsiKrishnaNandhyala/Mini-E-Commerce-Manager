const { forwardRequest } = require("../services/proxyService");
const { successResponse } = require("../utils/response");

const createProxyController = (baseUrl, resourcePath) => ({
  getAll: async (req, res, next) => {
    try {
      const data = await forwardRequest({ method: "get", baseUrl, path: resourcePath });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const data = await forwardRequest({
        method: "get",
        baseUrl,
        path: `${resourcePath}/${req.params.id}`
      });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const data = await forwardRequest({
        method: "post",
        baseUrl,
        path: resourcePath,
        data: req.body
      });
      successResponse(res, data, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const data = await forwardRequest({
        method: "put",
        baseUrl,
        path: `${resourcePath}/${req.params.id}`,
        data: req.body
      });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  },

  remove: async (req, res, next) => {
    try {
      const data = await forwardRequest({
        method: "delete",
        baseUrl,
        path: `${resourcePath}/${req.params.id}`
      });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
});

module.exports = createProxyController;
