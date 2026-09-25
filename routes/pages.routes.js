const express = require("express");
const router = express.Router();

//requireLogin
router.get("/admin-users", (req, res) => {
    res.render("admin-users", { title: "Users | Admin" });
});

//requireLogin
router.get("/admin-managers", (req, res) => {
    res.render("admin-managers", { title: "Managers | Admin" });
});

module.exports = router;