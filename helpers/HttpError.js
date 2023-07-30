const errorMessge = {
    400: "Bad Request",
    401:"Unauthorized",
    403:"Forbidden",
    404:"Not found",
    409:"Conflict",
}

const HttpError = (status, massage = errorMessge[status]) => {
    const error = new Error(massage);
    error.status = status;
    return error;
}

module.exports = HttpError;