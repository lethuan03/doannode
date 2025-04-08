const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true, // Chuyển mã thành chữ in hoa để đồng bộ
        trim: true // Loại bỏ khoảng trắng thừa
    },
    discountType: { 
        type: String, 
        enum: ['percentage', 'fixed'], // Loại giảm giá: phần trăm hoặc số tiền cố định
        required: true 
    },
    discount: { 
        type: Number, 
        required: true, 
        min: 0 // Giá trị giảm giá không được âm
    },
    expiresAt: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

// Index để tìm kiếm nhanh theo mã coupon
CouponSchema.index({ code: 1 });

module.exports = mongoose.model("Coupon", CouponSchema);