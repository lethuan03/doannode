const Wishlist = require("../models/Wishlist");

exports.getWishlistByUser = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.params.userId }).populate("products");
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { user, product } = req.body;
        let wishlist = await Wishlist.findOne({ user });

        if (!wishlist) {
            wishlist = new Wishlist({ user, products: [product] });
        } else {
            if (!wishlist.products.includes(product)) {
                wishlist.products.push(product);
            }
        }

        await wishlist.save();
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const { user, product } = req.body;
        const wishlist = await Wishlist.findOne({ user });

        if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

        wishlist.products = wishlist.products.filter(p => p.toString() !== product);
        await wishlist.save();

        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
