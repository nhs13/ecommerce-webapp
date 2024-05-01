export const errorMiddleware = (err, req, res, next) => {
    // i += 1
    // err.message = err.message || "Something went wrong"
    err.message || (err.message = "Something went wrong");
    return res.status(400).json({
        success: false,
        message: err.message,
    });
};
