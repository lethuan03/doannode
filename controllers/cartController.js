const Cart = require("../models/Cart");

exports.getCartByUser = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { user, product, quantity } = req.body;
        let cart = await Cart.findOne({ user });

        if (!cart) {
            cart = new Cart({ user, items: [{ product, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === product);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product, quantity });
            }
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { user, product } = req.body;
        const cart = await Cart.findOne({ user });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.product.toString() !== product);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.params.userId });
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
