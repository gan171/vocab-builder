// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

// This is our new "guard" function.
function auth(req, res, next) {
  // 1. Get the token from the request header
  // We'll tell React to send it in a header called 'x-auth-token'
  const token = req.header('x-auth-token');

  // 2. Check if token exists
  if (!token) {
    // If no token, send "Unauthorized" status
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Verify the token
    // This uses your JWT_SECRET to check if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your actual secret

    // 4. If valid, add the user's info (their ID) to the request object
    // 'decoded.id' comes from the "payload" we created during login
    req.user = { id: decoded.id };

    // 5. Call 'next()' to pass control to the *next* function
    // (which will be our API endpoint)
    next();
  } catch (err) {
    // If token is invalid (e.g., expired, wrong secret)
    res.status(400).json({ message: 'Token is not valid' });
  }
}

module.exports = auth; // Export the function