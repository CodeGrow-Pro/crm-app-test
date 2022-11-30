const User = require("../models/user.model");
const objectConvertor = require('../utils/objectConvertor')

exports.findById = async (req, res) => {
    try {
        const userIdReq = req.params.userId;

        const user = await User.find({
            userId: userIdReq
        }).exec();
        if (user) {
            res.status(200).send(objectConvertor.userResponse(user));
        } else {
            res.status(200).send({
                message: `User with this id [${userIdReq}] is not present`
            })
        }
    } catch (error) {
        console.error("Error while finding the record", error.message);
        res.status(500).send({
            message: "Some internal error occured"
        })
    }
}