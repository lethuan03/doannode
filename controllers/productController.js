const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category").populate("images");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category")
            .populate("images");

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, images } = req.body;
        
        // `images` phải là danh sách ObjectId của `Upload`
        const newProduct = new Product({ name, description, price, stock, category, images });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, images } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, stock, category, images },
            { new: true }
        );

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
