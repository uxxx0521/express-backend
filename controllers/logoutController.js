const db = require("../db"); // Database connection

const handleLogout = async (req, res) => {
  try {
    // Get the refresh token from cookies
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(204); // No content, no action needed
    }
    const refreshToken = cookies.jwt;

    // Check if the refresh token exists in the database
    const sqlQuery = "SELECT username FROM users WHERE refreshToken = ?";
    db.query(sqlQuery, [refreshToken], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        // Token not found in DB
        res.clearCookie("jwt", { httpOnly: true, secure: true });
        return res.sendStatus(204); // Successfully logged out
      }

      const username = results[0].username;

      // Remove the refresh token from the database
      const updateQuery = "UPDATE users SET refreshToken = NULL WHERE username = ?";
      db.query(updateQuery, [username], (err) => {
        if (err) {
          console.error("Error removing refresh token:", err);
          return res.status(500).json({ error: "Failed to clear refresh token" });
        }

        // Clear the cookie on the client
        res.clearCookie("jwt", { httpOnly: true, secure: true }); // Adjust `secure: true` for production
        res.sendStatus(204); // Successfully logged out
      });
    });
  } catch (err) {
    console.error("Error in logout process:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogout };
