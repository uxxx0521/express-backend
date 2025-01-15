const jwt = require("jsonwebtoken");
const db = require("../db"); //Database

const handleFetch = (req, res) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }

    const username = decoded.username; // Extract username from the token

    // Queries
    const generalDataQuery = `
      SELECT 
        users.nickname, 
        trackerData.currentBalance, 
        trackerData.totalIncome,
        trackerData.totalExpenses
      FROM 
        users
      JOIN 
        trackerData 
      ON 
        users.username = trackerData.username
      WHERE 
        users.username = ?;
    `;
    const historyQuery = `
      SELECT 
        type, balance, category, DATE(date) as date 
      FROM 
        trackerHistory
      WHERE 
        username = ?;
    `;

    // Fetch general data
    db.query(generalDataQuery, [username], (err, generalDataResults) => {
      if (err) {
        console.error("Error fetching general data:", err);
        return res.status(500).json({ error: "Failed to fetch general data" });
      }
      if (generalDataResults.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const generalData = generalDataResults[0]; // Extract user data

      // Fetch transaction history
      db.query(historyQuery, [username], (err, historyResults) => {
        if (err) {
          console.error("Error fetching tracker history:", err);
          return res.status(500).json({ error: "Failed to fetch tracker history" });
        }

        // Format the date field to remove time information
        const formattedHistory = historyResults.map((entry) => ({
          ...entry,
          date: entry.date.toISOString().slice(0, 10), // Keep only the YYYY-MM-DD part
        }));

        // Combine user data and transaction history into a single response
        res.json({
          generalData: generalData,
          history: formattedHistory,
        });
      });
    });
  });
};

module.exports = {
  handleFetch,
};
