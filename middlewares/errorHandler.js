const errorHandler = (err, req, res, next) => {
    // Log error di server (production bisa pake winston/pino)
    console.error("[ERROR]", err.stack || err);

    const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;

    const message = err.message || "Terjadi kesalahan pada server.";

    res.status(statusCode).json({
        success: false,
        code: statusCode,
        message,
        // stack cuma muncul kalau dev
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

export default errorHandler;
