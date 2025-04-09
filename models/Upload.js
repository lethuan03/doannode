const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Liên kết với Product
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Upload", uploadSchema);
