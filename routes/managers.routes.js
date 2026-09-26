const express = require("express");
const router = express.Router();
const managersController = require("../controllers/managers.controller");

router.get("/api/managers", managersController.handleGetManagers );

module.exports = router;