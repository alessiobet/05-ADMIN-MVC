// // models/managers.model.js
const { getPool } = require("../config/database");

const getAll = async () => {
    const pool = await getPool();
    const result = await pool.request()
        .query(`
            SELECT m.[idMng]
                ,m.[mng]
                ,d.[dept]
                ,m.[isActive]
            FROM [Booking].[managersT] m
            LEFT JOIN [Booking].[departmentsT] d
            ON m.deptId = d.idDept
            ORDER BY d.dept ASC
        `);
    return result.recordset;
};
const addNew = async (payload) => {
    const { deptId, mng, isActive } = payload;
    const pool = await getPool();
    const result = await pool.request()
        .input("deptId", sql.Int, Number(deptId))
        .input("mng", sql.NVarChar, mng?.trim().toUpperCase())
        .input("isActive", sql.Bit, isActive)
        .query(`
            INSERT INTO Booking.managersT (deptId, mng, isActive)

            OUTPUT
                inserted.idMng,
                inserted.deptId,
                inserted.mng,
                inserted.isActive

            VALUES (@deptId, @mng, @isActive)
        `);

    return result.recordset[0];
};
const modify = async (id, payload) => {
    const { deptId, mng, isActive } = payload;
    const pool = await getPool();
    const result = await pool.request()
        .input("id", sql.Int, Number(id))
        .input("deptId", sql.Int, Number(deptId))
        .input("mng", sql.NVarChar, mng?.trim().toUpperCase())
        .input("isActive", sql.Bit, isActive)
        .query(`
            UPDATE Booking.managersT

            SET
                deptId = @deptId,
                mng = @mng,
                isActive = @isActive

            OUTPUT
                inserted.idMng,
                inserted.deptId,
                inserted.mng,
                inserted.isActive

            WHERE idMng = @id
        `);
    return result.recordset[0];
};

module.exports = {
    getAll,
    addNew,
    modify
};

