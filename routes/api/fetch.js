const express = require("express");
const router = express.Router();
const fetchController = require("../../controllers/fetchController");

router.get("/", fetchController.handleFetch);

module.exports = router;
