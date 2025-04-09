const Coupon = require("../models/Coupon");

// Lấy tất cả coupon
exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        if (coupons.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy coupon nào" });
        }
        res.json(coupons);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách coupon:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Tạo coupon mới
exports.createCoupon = async (req, res) => {
    try {
        const { code, discountType, discount, expiresAt } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!code || !discountType || discount === undefined || !expiresAt) {
            return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin: code, discountType, discount, expiresAt" });
        }

        // Kiểm tra discountType hợp lệ
        if (!['percentage', 'fixed'].includes(discountType)) {
            return res.status(400).json({ message: "discountType phải là 'percentage' hoặc 'fixed'" });
        }

        // Kiểm tra discount không âm
        if (discount < 0) {
            return res.status(400).json({ message: "Giá trị giảm giá không được âm" });
        }

        // Kiểm tra expiresAt hợp lệ
        const expiresDate = new Date(expiresAt);
        if (isNaN(expiresDate.getTime()) || expiresDate <= new Date()) {
            return res.status(400).json({ message: "Ngày hết hạn không hợp lệ hoặc đã qua" });
        }

        // Kiểm tra mã coupon đã tồn tại
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: "Mã coupon đã tồn tại" });
        }

        // Tạo coupon mới
        const coupon = new Coupon({
            code,
            discountType,
            discount,
            expiresAt: expiresDate
        });

        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        console.error('Lỗi khi tạo coupon:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Cập nhật coupon
exports.updateCoupon = async (req, res) => {
    try {
        const { code, discountType, discount, expiresAt } = req.body;
        const couponId = req.params.id;

        // Tìm coupon theo ID
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.status(404).json({ message: "Không tìm thấy coupon" });
        }

        // Cập nhật các trường nếu được cung cấp
        if (code) {
            // Kiểm tra mã mới có trùng với coupon khác không
            const existingCoupon = await Coupon.findOne({ code: code.toUpperCase(), _id: { $ne: couponId } });
            if (existingCoupon) {
                return res.status(400).json({ message: "Mã coupon đã tồn tại" });
            }
            coupon.code = code;
        }

        if (discountType) {
            if (!['percentage', 'fixed'].includes(discountType)) {
                return res.status(400).json({ message: "discountType phải là 'percentage' hoặc 'fixed'" });
            }
            coupon.discountType = discountType;
        }

        if (discount !== undefined) {
            if (discount < 0) {
                return res.status(400).json({ message: "Giá trị giảm giá không được âm" });
            }
            coupon.discount = discount;
        }

        if (expiresAt) {
            const expiresDate = new Date(expiresAt);
            if (isNaN(expiresDate.getTime()) || expiresDate <= new Date()) {
                return res.status(400).json({ message: "Ngày hết hạn không hợp lệ hoặc đã qua" });
            }
            coupon.expiresAt = expiresDate;
        }

        await coupon.save();
        res.json(coupon);
    } catch (error) {
        console.error('Lỗi khi cập nhật coupon:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xóa coupon
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Không tìm thấy coupon" });
        }

        res.json({ message: "Đã xóa coupon thành công" });
    } catch (error) {
        console.error('Lỗi khi xóa coupon:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.applyCoupon = async (req, res) => {
    try {
        const { code, orderTotal } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!code || orderTotal === undefined) {
            return res.status(400).json({ message: "Vui lòng cung cấp code và orderTotal" });
        }

        // Kiểm tra orderTotal không âm
        if (orderTotal < 0) {
            return res.status(400).json({ message: "Giá trị đơn hàng không được âm" });
        }

        // Tìm coupon theo mã
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ message: "Mã coupon không tồn tại" });
        }

        // Kiểm tra thời gian hết hạn
        if (new Date() > coupon.expiresAt) {
            return res.status(400).json({ message: "Coupon đã hết hạn" });
        }

        // Tính giá trị giảm giá
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (coupon.discount / 100) * orderTotal;
        } else {
            discountAmount = coupon.discount;
        }

        // Đảm bảo số tiền giảm không lớn hơn giá trị đơn hàng
        if (discountAmount > orderTotal) {
            discountAmount = orderTotal;
        }

        // Trả về thông tin giảm giá
        res.json({
            success: true,
            discountAmount,
            couponId: coupon._id
        });
    } catch (error) {
        console.error('Lỗi khi áp dụng coupon:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.testRoute = async (req, res) => {
    res.json({ message: "This is a test route" });
};