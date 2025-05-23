const express = require("express");
const { getWishlistByUser, addToWishlist, removeFromWishlist } = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/:userId", authMiddleware, getWishlistByUser);
router.post("/", authMiddleware, addToWishlist);
router.delete("/remove", authMiddleware, removeFromWishlist);

module.exports = router;
