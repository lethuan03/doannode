const express = require("express");
const { getAllCoupons, createCoupon, deleteCoupon , applyCoupon,testRoute } = require("../controllers/couponController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/", getAllCoupons);
router.post("/", authMiddleware, createCoupon);
router.delete("/:id", authMiddleware, deleteCoupon);
router.post('/apply', applyCoupon);
router.get('/test', testRoute);
module.exports = router;
