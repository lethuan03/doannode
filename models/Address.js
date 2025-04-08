const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Address", AddressSchema);
