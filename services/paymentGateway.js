class BasePaymentGateway {
    async createPayment(paymentData) {
        throw new Error('Chưa triển khai phương thức tạo thanh toán');
    }
    
    async verifyCallback(callbackData) {
        throw new Error('Chưa triển khai phương thức xác minh callback');
    }
    
    async refundPayment(refundData) {
        throw new Error('Chưa triển khai phương thức hoàn tiền');
    }
}

class VNPayGateway extends BasePaymentGateway {
    async createPayment(paymentData) {
        // Triển khai xử lý tạo thanh toán với VNPay
        // Thực tế sẽ sử dụng thư viện hoặc API của VNPay
        
        const redirectUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...`; // URL thanh toán thực tế
        
        return {
            reference: `VNP_${Date.now()}`, // Tham chiếu duy nhất
            redirectUrl,
            details: { provider: 'vnpay' }
        };
    }
    
    async verifyCallback(callbackData) {
        // Xác minh callback từ VNPay
        
        // Giả định xác minh thành công
        return {
            isValid: true,
            reference: callbackData.vnp_TxnRef,
            status: callbackData.vnp_ResponseCode === '00' ? 'completed' : 'failed',
            transactionId: callbackData.vnp_TransactionNo,
            details: callbackData
        };
    }
    
    async refundPayment(refundData) {
        // Triển khai hoàn tiền với VNPay
        
        // Giả định hoàn tiền thành công
        return {
            success: true,
            refundId: `VNP_REFUND_${Date.now()}`,
            details: {
                originalTransaction: refundData.transactionId,
                refundAmount: refundData.amount,
                timestamp: new Date().toISOString()
            }
        };
    }
}

class MomoGateway extends BasePaymentGateway {
    // Tương tự như VNPay, triển khai các phương thức cho MoMo
    async createPayment(paymentData) {
        return {
            reference: `MOMO_${Date.now()}`,
            redirectUrl: `https://payment.momo.vn/...`,
            details: { provider: 'momo' }
        };
    }
    
    async verifyCallback(callbackData) {
        return {
            isValid: true,
            reference: callbackData.requestId,
            status: callbackData.resultCode === 0 ? 'completed' : 'failed',
            transactionId: callbackData.transId,
            details: callbackData
        };
    }
    
    async refundPayment(refundData) {
        return {
            success: true,
            refundId: `MOMO_REFUND_${Date.now()}`,
            details: {
                originalTransaction: refundData.transactionId,
                refundAmount: refundData.amount
            }
        };
    }
}

class ZaloPayGateway extends BasePaymentGateway {
    // Triển khai các phương thức cho ZaloPay
    async createPayment(paymentData) {
        return {
            reference: `ZALO_${Date.now()}`,
            redirectUrl: `https://zalopay.vn/...`,
            details: { provider: 'zalopay' }
        };
    }
    
    async verifyCallback(callbackData) {
        return {
            isValid: true,
            reference: callbackData.app_trans_id,
            status: callbackData.status === 1 ? 'completed' : 'failed',
            transactionId: callbackData.zp_trans_id,
            details: callbackData
        };
    }
    
    async refundPayment(refundData) {
        return {
            success: true,
            refundId: `ZALO_REFUND_${Date.now()}`,
            details: {
                originalTransaction: refundData.transactionId,
                refundAmount: refundData.amount
            }
        };
    }
}

class BankTransferGateway extends BasePaymentGateway {
    // Xử lý thanh toán chuyển khoản ngân hàng
    async createPayment(paymentData) {
        return {
            reference: `BANK_${Date.now()}`,
            paymentInfo: {
                bankAccount: '1234567890',
                accountName: 'CONG TY XYZ',
                bankName: 'Vietcombank',
                content: `Thanh toan ${paymentData.orderId}`
            },
            details: { provider: 'bank_transfer' }
        };
    }
    
    async verifyCallback(callbackData) {
        // Chuyển khoản thường được xác nhận thủ công
        return {
            isValid: true,
            reference: callbackData.reference,
            status: 'completed',
            transactionId: callbackData.transactionId,
            details: callbackData
        };
    }
    
    async refundPayment(refundData) {
        // Hoàn tiền thủ công
        return {
            success: true,
            refundId: `BANK_REFUND_${Date.now()}`,
            details: {
                note: 'Hoàn tiền thủ công qua chuyển khoản ngân hàng',
                refundAmount: refundData.amount
            }
        };
    }
}

class CODGateway extends BasePaymentGateway {
    // Xử lý thanh toán khi nhận hàng
    async createPayment(paymentData) {
        return {
            reference: `COD_${Date.now()}`,
            paymentInfo: {
                message: 'Khách hàng sẽ thanh toán khi nhận hàng'
            },
            details: { provider: 'cod' }
        };
    }
    
    async verifyCallback(callbackData) {
        // COD thường được xác nhận thủ công sau khi giao hàng
        return {
            isValid: true,
            reference: callbackData.reference,
            status: callbackData.status || 'pending',
            details: callbackData
        };
    }
    
    async refundPayment(refundData) {
        // COD không có hoàn tiền thông thường
        return {
            success: true,
            refundId: `COD_REFUND_${Date.now()}`,
            details: {
                note: 'Hủy yêu cầu thanh toán COD',
                refundAmount: refundData.amount
            }
        };
    }
}

// Factory để tạo ra instance của cổng thanh toán phù hợp
exports.createPaymentGateway = (paymentMethod) => {
    switch (paymentMethod) {
        case 'vnpay':
            return new VNPayGateway();
        case 'momo':
            return new MomoGateway();
        case 'zalopay':
            return new ZaloPayGateway();
        case 'bank_transfer':
            return new BankTransferGateway();
        case 'cod':
            return new CODGateway();
        default:
            throw new Error(`Phương thức thanh toán không được hỗ trợ: ${paymentMethod}`);
    }
};