const Review = require("../models/Review");

exports.getReviewsByProduct = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate("user");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { user, product, rating, comment } = req.body;
        const review = new Review({ user, product, rating, comment });

        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });

        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
