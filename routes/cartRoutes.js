const express = require("express");
const { getCartByUser, addToCart, removeFromCart, clearCart } = require("../controllers/cartController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/:userId", authMiddleware, getCartByUser);
router.post("/", authMiddleware, addToCart);
router.delete("/remove", authMiddleware, removeFromCart);
router.delete("/:userId", authMiddleware, clearCart);

module.exports = router;
