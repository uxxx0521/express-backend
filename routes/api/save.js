const express = require("express");
const router = express.Router();
const saveDataController = require("../../controllers/saveDataController");

router.post("/", saveDataController.handleSaveData);

module.exports = router;