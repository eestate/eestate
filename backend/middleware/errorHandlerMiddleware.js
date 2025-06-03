const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack); // Log error for debugging
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export { errorHandler };