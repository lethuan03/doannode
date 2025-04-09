const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const { createPaymentGateway } = require('../services/paymentGateway');


exports.initiatePayment = async (req, res) => {
    try {
        const { orderId, paymentMethod } = req.body;
        const userId = req.user._id; // Lấy từ middleware xác thực
        
        // Tìm thông tin đơn hàng
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập đơn hàng này' });
        }
        
        // Tạo bản ghi thanh toán
        const payment = new Payment({
            user: req.user._id,
            order: order._id,
            amount: order.total,
            paymentMethod,
            status: 'pending'
        });

        await payment.save();
        
        // Khởi tạo cổng thanh toán dựa trên phương thức
        const gateway = createPaymentGateway(paymentMethod);
        
        // Tạo URL thanh toán hoặc thông tin thanh toán
        const paymentData = await gateway.createPayment({
            amount: order.total,
            orderId: order._id,
            description: `Thanh toán đơn hàng #${order._id}`,
            user: req.user._id,
            paymentId: payment._id
        });
        
        
        // Cập nhật thông tin payment với dữ liệu từ cổng thanh toán
        payment.gatewayReference = paymentData.reference || '';
        payment.paymentDetails = paymentData.details || {};
        await payment.save();
        
        return res.status(200).json({ 
            success: true, 
            paymentId: payment._id,
            paymentUrl: paymentData.redirectUrl,
            paymentInfo: paymentData.paymentInfo
        });
    } catch (error) {
        console.error('Lỗi khởi tạo thanh toán:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khởi tạo thanh toán', error: error.message });
    }
};
  



exports.getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user._id;
        
        const payment = await Payment.findById(paymentId).populate('order');
        
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin thanh toán' });
        }
        
        if (payment.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Không có quyền truy cập thông tin thanh toán này' });
        }
        
        return res.status(200).json({
            success: true,
            payment: {
                id: payment._id,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                paymentMethod: payment.paymentMethod,
                createdAt: payment.createdAt,
                order: {
                    id: payment.order._id,
                    totalAmount: payment.order.totalAmount,
                    status: payment.order.status
                }
            }
        });
    } catch (error) {
        console.error('Lỗi lấy trạng thái thanh toán:', error);
        return res.status(500).json({ success: false, message: 'Lỗi lấy trạng thái thanh toán' });
    }
};

exports.refundPayment = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { reason } = req.body;

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin thanh toán' });
        }

        if (payment.status !== 'completed') {
            return res.status(400).json({ success: false, message: 'Chỉ có thể hoàn tiền cho giao dịch đã hoàn thành' });
        }

        // Khởi tạo cổng thanh toán
        const gateway = createPaymentGateway(payment.paymentMethod);

        // Gửi yêu cầu hoàn tiền
        const refundResult = await gateway.refundPayment({
            transactionId: payment.transactionId,
            amount: payment.amount,
            reason: reason || 'Hoàn tiền theo yêu cầu'
        });

        // Cập nhật trạng thái thanh toán
        payment.status = 'refunded';
        payment.refundReason = reason;
        payment.paymentDetails = { ...payment.paymentDetails, refund: refundResult };

        await payment.save();

        // Cập nhật đơn hàng
        const order = await Order.findById(payment.order);
        if (order) {
            order.paymentStatus = 'refunded';
            await order.save();
        }

        return res.status(200).json({ success: true, message: 'Hoàn tiền thành công', refundData: refundResult });
    } catch (error) {
        console.error('Lỗi hoàn tiền:', error);
        return res.status(500).json({ success: false, message: 'Lỗi hoàn tiền', error: error.message });
    }
};

