// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Log the error for server-side tracking
    console.error(err.stack);
  
    // Send an appropriate error response to the client
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'An unexpected error occurred',
        status: err.status || 500
      }
    });
  };
  
  module.exports = errorHandler;