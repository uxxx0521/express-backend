const db = require("../db"); //Database
const bcrypt = require("bcrypt");


const handleNewUser = async (req, res) => {
  const { nickname, email, username, password } = req.body;
  console.log("Request Body:", req.body);
  if (!username || !password || !nickname || !email) {
    return res
      .status(400)
      .json({ message: "All fields are required." });
  }

  try {
    // Check if the username already exists in the database
    const checkDuplicateSql = "SELECT COUNT(*) AS count FROM users WHERE username = ?";
    db.query(checkDuplicateSql, [username], async (err, results) => {
      if (err) {
        console.error("Error checking duplicate user:", err);
        return res.status(500).json({ error: "Database error." });
      }

      if (results[0].count > 0) {
        return res.status(409).json({ message: "Username already exists." });
      }

      // Hash the password.
      const pwd = await bcrypt.hash(password, 10);

      // Insert new user into the database
      const insertUserSql = `
            INSERT INTO users (username, pwd, email, nickname) 
            VALUES (?, ?, ?, ?)
          `;
      db.query(insertUserSql, [username, pwd, email, nickname], (err, results) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ error: "Failed to store user data." });
        }
        res.status(201).json({ message: `New user ${nickname} created successfully!` });
      });
    });
  } catch (err) {
    console.error("Error in signup process:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { handleNewUser };
