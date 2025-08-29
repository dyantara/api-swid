// utils/response.js
export const success = (res, data = {}, message = "OK", statusCode = 200) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        data,
    });
};

export const fail = (res, message = "Bad request", statusCode = 400) => {
    return res.status(statusCode).json({
        status: "fail",
        message,
    });
};

export const error = (res, message = "Internal server error", statusCode = 500) => {
    return res.status(statusCode).json({
        status: "error",
        message,
    });
};

