const express = require("express");
const router = express.Router();
const deptController = require("../controllers/dept.controller");

router.get("/api/depts", deptController.handleGetDept);

module.exports = router;