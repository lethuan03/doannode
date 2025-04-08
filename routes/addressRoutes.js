const express = require("express");
const { getAddressesByUser, addAddress, deleteAddress } = require("../controllers/addressController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/:userId", authMiddleware, getAddressesByUser);
router.post("/", authMiddleware, addAddress);
router.delete("/:id", authMiddleware, deleteAddress);

module.exports = router;
