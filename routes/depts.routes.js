const express = require("express");
const router = express.Router();
const { getPool } = require("../config/database");

router.get("/depts", async (req, res) => {
    try {
        const pool = await getPool();

        const result = await pool.request()
            .query(`
                SELECT *
                FROM Booking.departmentsT
            `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.log("SQL ERROR:", error.message);

        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
});

module.exports = router;