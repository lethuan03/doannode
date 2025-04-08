const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user").populate("products.product");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user").populate("products.product");
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { user, products, status } = req.body;

        // Lấy tất cả product ID từ order
        const productIds = products.map(p => p.product);

        // Truy vấn tất cả sản phẩm
        const productDocs = await Product.find({ _id: { $in: productIds } });

        // Tính tổng tiền
        let total = 0;
        products.forEach(item => {
            const foundProduct = productDocs.find(p => p._id.toString() === item.product);
            if (foundProduct) {
                total += foundProduct.price * item.quantity;
            }
        });

        const newOrder = new Order({ user, products, total, status });
        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
