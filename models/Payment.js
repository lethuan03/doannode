const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "VND" },
    paymentMethod: { 
        type: String, 
        enum: ["credit_card", "bank_transfer", "momo", "zalopay", "vnpay", "cod", "other"], 
        required: true 
    },
    transactionId: { type: String },
    gatewayReference: { type: String },
    paymentDetails: { type: mongoose.Schema.Types.Mixed }, // Lưu thông tin bổ sung từ cổng thanh toán
    status: { 
        type: String, 
        enum: ["pending", "processing", "completed", "failed", "refunded", "cancelled"], 
        default: "pending" 
    },
    errorMessage: { type: String },
    refundReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);