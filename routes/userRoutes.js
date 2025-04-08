const express = require("express");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
