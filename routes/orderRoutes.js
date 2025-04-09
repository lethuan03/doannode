const express = require("express");
const router = express.Router();

// Import controller cho order
const orderController = require("../controllers/orderController");

// Đảm bảo rằng bạn sử dụng hàm xử lý hợp lệ
router.post("/", orderController.createOrder); // Tạo đơn hàng
router.get("/", orderController.getAllOrders); // Lấy tất cả đơn hàng
router.get("/:id", orderController.getOrderById); // Lấy đơn hàng theo ID
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
module.exports = router;
