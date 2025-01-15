const db = require("../db"); //Database
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
  //Match username
  // Fetch the user from the database
  const sqlQuery = "SELECT * FROM users WHERE username = ?";
  db.query(sqlQuery, [username], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error." });
    }

    // Check if the user exists
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const foundUser = results[0];

    // Compare the provided password with the stored hashed password
    try {
      const match = await bcrypt.compare(password, foundUser.pwd);
      if (!match) {
        return res.status(401).json({ message: "Invalid username or password." });
      }

      // Generate access and refresh tokens
      const accessToken = jwt.sign(
        { username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" } // Adjust the expiration as needed
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } // Adjust the expiration as needed
      );

      // Store the refresh token in the database
      const updateTokenQuery = "UPDATE users SET refreshToken = ? WHERE username = ?";
      db.query(updateTokenQuery, [refreshToken, username], (err) => {
        if (err) {
          console.error("Error updating refresh token:", err);
          return res.status(500).json({ error: "Failed to save refresh token." });
        }

        // Send tokens to the client
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true, // Set to true in production
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        res.status(201).json({ accessToken });
      });
    } catch (error) {
      console.error("Error during password comparison:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
};

module.exports = {
  handleLogin,
};
