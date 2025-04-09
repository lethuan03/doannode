const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging

    // If the error has a custom message, use it, otherwise default to a generic message
    const message = err.message || "Internal Server Error";

    // If the error has a specific status code, use it, otherwise default to 500
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

module.exports = errorHandler;
