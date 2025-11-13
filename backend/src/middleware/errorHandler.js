export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: "Route not found",
    },
  });
};
