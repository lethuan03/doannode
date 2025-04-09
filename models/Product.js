const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Upload" }], // Liên kết với Upload
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
