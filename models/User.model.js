const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
    },
    company: {
        type: String,
    },
    designation: {
        type:String,
    },
    bio: {
        type:String,
    },
    activity: {
        type: [String],
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

const UserModel = model("User", UserSchema);
module.exports = UserModel;