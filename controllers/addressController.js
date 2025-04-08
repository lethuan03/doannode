const Address = require("../models/Address");

exports.getAddressesByUser = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.params.userId });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const { user, address, city, postalCode, country } = req.body; // Sửa trường name cho đúng model
        const newAddress = new Address({ user, address, city, postalCode, country }); // Dùng đúng tên trường

        await newAddress.save();
        res.status(201).json(newAddress); // Trả về địa chỉ vừa tạo
    } catch (error) {
        console.error("Error adding address:", error); // Log lỗi chi tiết
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });

        res.json({ message: "Address deleted" });
    } catch (error) {
        console.error("Error deleting address:", error); // Log lỗi chi tiết
        res.status(500).json({ message: "Server error" });
    }
};
