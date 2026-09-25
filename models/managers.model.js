// // models/customers.model.js

// const { getPool } = require("../config/database");

// async function getAllCustomers() {

//     const pool = await getPool();

//     const result = await pool.request().query(`
//         SELECT *
//         FROM managersT
//     `);

//     return result.recordset;
// }

// module.exports = {
//     getAllCustomers
// };