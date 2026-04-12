const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.originalUrl}`,
      details: null,
    },
  });
};

module.exports = notFound;
