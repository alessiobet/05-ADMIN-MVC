// // models/managers.model.js

const { getPool } = require("../config/database");

const getAll = async () => {

    const pool = await getPool();

    const result = await pool.request()
        .query(`
            SELECT *
            FROM Booking.departmentsT
        `);

    return result.recordset;
};

module.exports = {
    getAll
};