const {Schema, model} = require("mongoose");
const mongoose = require('mongoose');
const ApplyJob = require('../models/ApplyJob.model')

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
        type: String,
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
    jobs: [{
            type: Schema.Types.ObjectId,
            ref: 'ApplyJob',
        }],
    date: {
        type: Date,
        default: Date.now,
    },
})

const UserModel = model("User", UserSchema);
module.exports = UserModel;