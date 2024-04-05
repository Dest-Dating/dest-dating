const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = "Invalid input data: " + errors.join(". ");
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = (err) => {
    let erroredField = err.errmsg.match(/{([^:]+):/);
    if (erroredField) erroredField = erroredField[1];
    else erroredField = "--errored-field--";
    const message = `Duplicate field value: ${erroredField}. Please use another value.`;
    return new AppError(message, 400);
}

const handleJWTError = (err) => {
    return new AppError("Invalid token, please login again.", 401);
}

const handleJWTExpiredError = (err) => {
    return new AppError('Your token has expired, please login again!', 401);
}

module.exports = (err, req, res, next) => {

    console.log(err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (err.name === 'CastError') {
        err = handleCastErrorDB(err);
    } else if (err.code === 11000) {
        err = handleDuplicateFieldsDB(err);
    } else if (err.name === 'ValidationError') {
        err = handleValidationErrorDB(err);
    } else if (err.name === 'JsonWebTokenError') {
        err = handleJWTError(err);
    } else if (err.name === 'TokenExpiredError') {
        err = handleJWTExpiredError(err);
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err
    });
};