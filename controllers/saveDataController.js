const jwt = require("jsonwebtoken");
const db = require("../db"); // Import your database connection

const handleSaveData = (req, res) => {
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
        const { currentBalance, totalIncome, totalExpenses, history } = req.body;
        console.log(req.body);
        if (currentBalance === undefined ||
            currentBalance === null ||
            totalIncome === undefined ||
            totalIncome === null ||
            totalExpenses === undefined ||
            totalExpenses === null ||
            !Array.isArray(history)) {
            return res.status(400).json({ error: "Invalid or incomplete data" });
        }

        // Update trackerData table
        const updateTrackerDataQuery = `
      UPDATE trackerData
      SET 
        currentBalance = ?, 
        totalIncome = ?, 
        totalExpenses = ?
      WHERE username = ?;
    `;

        db.query(updateTrackerDataQuery, [currentBalance, totalIncome, totalExpenses, username], (err) => {
            if (err) {
                console.error("Error updating trackerData:", err);
                return res.status(500).json({ error: "Failed to update tracker data" });
            }

            // Replace history data in trackerHistory table
            const deleteHistoryQuery = `
            DELETE FROM trackerHistory WHERE username = ?;
        `;
            db.query(deleteHistoryQuery, [username], (err) => {
                if (err) {
                    console.error("Error clearing tracker history:", err);
                    return res.status(500).json({ error: "Failed to clear tracker history" });
                }

                // Check if the history array is not empty before inserting new entries
                if (history.length > 0) {
                    const insertHistoryQuery = `
                    INSERT INTO trackerHistory (type, balance, category, date, username)
                    VALUES ${history.map(() => '(?, ?, ?, ?, ?)').join(', ')}
                `;

                    const historyEntries = history.flatMap(entry => [entry.type, entry.number, entry.category, entry.date, username]);
                    db.query(insertHistoryQuery, historyEntries, (err) => {
                        if (err) {
                            console.error("Error inserting tracker history:", err);
                            return res.status(500).json({ error: "Failed to update tracker history" });
                        }
                        res.status(200).json({ message: "Data saved successfully!" });
                    });
                } else {
                    // If history is empty, just respond with success
                    res.status(200).json({ message: "Data saved successfully! No history entries to update." });
                }
            });
        });

    });
};

module.exports = {
    handleSaveData,
};