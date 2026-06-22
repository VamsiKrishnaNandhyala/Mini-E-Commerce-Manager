const axios = require("axios");

const serviceClient = axios.create({
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

module.exports = serviceClient;
