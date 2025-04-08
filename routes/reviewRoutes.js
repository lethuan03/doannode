const express = require("express");
const { getReviewsByProduct, createReview, deleteReview } = require("../controllers/reviewController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/:productId", getReviewsByProduct);
router.post("/", authMiddleware, createReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
