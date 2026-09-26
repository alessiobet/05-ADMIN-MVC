const deptsModel = require("../models/depts.model");

const handleGetDept = async (req, res) => {
    try {
        const depts = await deptsModel.getAll();
        res.status(200).json(depts);
    } catch (error) {
        console.log("ERROR:", error.message);
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};


module.exports = {
    handleGetDept
};