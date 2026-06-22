const axios = require("axios");

const serviceClient = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

const forwardRequest = async ({ method, baseUrl, path = "", data }) => {
  const response = await serviceClient.request({
    method,
    url: `${baseUrl}${path}`,
    data
  });

  return response.data.data;
};

module.exports = { forwardRequest };
