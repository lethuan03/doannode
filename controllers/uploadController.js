const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Upload = require("../models/Upload");

// Cấu hình lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Tải file lên
const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Không có file nào được tải lên" });
    }

    try {
        const newUpload = new Upload({
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`
        });

        await newUpload.save();

        res.status(200).json({
            message: "Tải file thành công",
            file: newUpload
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Lấy tất cả ảnh
const getAllImages = async (req, res) => {
    try {
        const images = await Upload.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Xóa ảnh
const deleteImage = async (req, res) => {
    const { id } = req.params;

    try {
        const image = await Upload.findById(id);
        if (!image) return res.status(404).json({ message: "Ảnh không tồn tại" });

        const filePath = path.join(__dirname, "..", image.url);
        fs.unlink(filePath, (err) => {
            if (err) console.error("Không thể xóa file:", err);
        });

        await Upload.findByIdAndDelete(id);
        res.json({ message: "Đã xóa ảnh thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// Cập nhật ảnh
const updateImage = async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: "Không có file nào được tải lên" });
    }

    try {
        const image = await Upload.findById(id);
        if (!image) return res.status(404).json({ message: "Ảnh không tồn tại" });

        const oldPath = path.join(__dirname, "..", image.url);
        fs.unlink(oldPath, (err) => {
            if (err) console.error("Không thể xóa file cũ:", err);
        });

        image.filename = req.file.filename;
        image.url = `/uploads/${req.file.filename}`;
        await image.save();

        res.json({ message: "Đã cập nhật ảnh thành công", file: image });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = {
    upload,
    uploadFile,
    getAllImages,
    deleteImage,
    updateImage
};
