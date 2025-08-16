// utils/response.js
exports.successResponse = (res, message, data = {}) => {
    return res.status(200).json({
        success: true,
        message,
        data,
    });
};

exports.errorResponse = (res, statusCode, message, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(details && { details }),
    });
};
