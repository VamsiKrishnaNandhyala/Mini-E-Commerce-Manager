const express = require("express");
const createProxyController = require("../controllers/proxyController");

const router = express.Router();
const controller = createProxyController(
  process.env.ORDER_SERVICE_URL || "http://localhost:3002",
  "/orders"
);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
