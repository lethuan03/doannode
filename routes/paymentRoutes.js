const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require("../middleware/auth");
// Kiểm tra nhanh API thanh toán
router.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: 'API thanh toán hoạt động' });
});

// Khởi tạo thanh toán
router.post('/initiate', authMiddleware, paymentController.initiatePayment);


// Kiểm tra trạng thái thanh toán
router.get('/status/:paymentId', authMiddleware, paymentController.getPaymentStatus);

// Hoàn tiền (chỉ dành cho admin)
router.post('/refund/:paymentId',authMiddleware, paymentController.refundPayment);

module.exports = router;