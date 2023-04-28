const {Schema, model} = require("mongoose");
const mongoose = require('mongoose');


const applyJobSchema = new Schema({
    jobId: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    logo: {
        type: String,
    },
    logoBackground: {
        type: String,
    },
    jobCompany: {
        type: String,
    },
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
    },
    phone: {
        type: String,
    },
    company: {
        type: String,
    },
    occupation: {
        type: String,
    },
    bio: {
        type: String,
    },
    resume: {
        type: String,
    },
    fileType: {
        type: String,
    },
    fileName: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const ApplyJobModel = model("ApplyJob", applyJobSchema);
module.exports = ApplyJobModel;