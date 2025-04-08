const express = require("express");
const router = express.Router();
const { upload, uploadFile, getAllImages,deleteImage,updateImage } = require("../controllers/uploadController");

// Tải ảnh lên
router.post("/", upload.single("image"), uploadFile);

router.get("/", (req, res, next) => {
    console.log("GET /api/upload được gọi");
    next();
}, getAllImages);
router.delete("/:id", deleteImage);

// Cập nhật ảnh mới theo id
router.put("/:id",  updateImage);


module.exports = router;