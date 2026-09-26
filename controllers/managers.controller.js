const managersModel = require("../models/managers.model");

const handleGetManagers = async (req, res) => {
    try {
        const managers = await managersModel.getAll();
        res.status(200).json(managers);
    } catch (error) {
        console.log("ERROR:", error.message);
        res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};


module.exports = {
    handleGetManagers
};