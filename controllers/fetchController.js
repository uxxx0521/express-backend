const db = require("../server"); //Database

const handleFetch = (req, res) => {
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
      type, balance, category, date
    FROM 
      trackerHistory
    WHERE 
      username = ?;
    `;

  // First query execution
  db.query(generalDataQuery, [username], (err, generalDataResults) => {
    if (err) {
      console.error("Error fetching general data:", err);
      return res.status(500).json({ error: "Failed to fetch general data" });
    }
    if (generalDataResults.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const generalData = generalDataResults[0]; // Extract user data

    // Second query to fetch transaction history

    db.query(historyQuery, [username], (err, historyResults) => {
      if (err) {
        console.error("Error fetching tracker history:", err);
        return res.status(500).json({ error: "Failed to fetch tracker history" });
      }

      // Combine user data and transaction history into a single response
      res.json({
        generalData: generalData,
        history: historyResults
      });
    });
  });
};



module.exports = {
  handleFetch,
};
