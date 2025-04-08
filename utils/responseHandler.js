exports.successResponse = (res, data, message = "Request successful") => {
    res.status(200).json({ success: true, message, data });
};

exports.errorResponse = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ success: false, message: error.message || "Server error" });
};
