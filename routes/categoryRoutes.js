const express = require("express");
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;
