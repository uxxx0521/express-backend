const db = require("../db"); // Database connection
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ error: "No refresh token provided" });
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // Check if the refresh token exists in the database
  const findUserQuery = `
  SELECT username, refreshToken FROM users WHERE refreshToken = ?
`;
  db.query(findUserQuery, [refreshToken], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    // If no user is found with the provided refresh token
    if (results.length === 0) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const foundUser = results[0];

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser.username !== decoded.username) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      // Generate a new access token
      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" } // Adjust the expiration time as needed
      );

      // Send the new access token to the client
      res.status(200).json({ accessToken });
    });
  });
};

module.exports = {
  handleRefreshToken,
};
