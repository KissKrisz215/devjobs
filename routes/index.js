const express = require('express');
const router = express.Router();
const JobModel = require("../models/Link.model");
const UserModel = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const isLoggedIn = require('../middlewares/isLoggedIn');

/* GET home page */
router.get('/', async (req, res, next) => {
    try{
        const jobsData = await JobModel.find();
        res.render('index', {jobsData});
    }catch(err){
        console.error("There was an error", err);
    }
});

router.get('/jobs/:JobId', async (req,res) => {
    try{
    const {JobId} = req.params;
    const jobData = await JobModel.findById(JobId);
    res.render("job-details", {jobData});
    }catch(err){
        console.error("There was an error", err);
    }
})


router.get('/apply-now/:jobId', async (req,res) => {
    console.log(req.params);
    const {jobId} = req.params;
    try{
        const jobData = await JobModel.findById(jobId);
        res.render("apply-now", {jobData});
    }catch(err){
        console.error("There was an error", err)
    }
})

router.post('/search', async (req,res) => {
    try{
        const {general,location} = req.body;
        const jobsData = await JobModel.find({"location":  {$regex : `${location}`}, "contract": `${req.body.jobtype}`})
        res.render("index", {jobsData});
    }catch(err){
        console.error("There was an error", err)
    }
})

router.get('/profile', isLoggedIn, async (req,res) => {
    try{
        const user = await UserModel.findOne({"email": req.session.user.email})
        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            company: user.company,
            designation: user.designation,
            bio: user.bio
        }
        res.render("profile", {userData});
    }catch(err){
        console.error("There was an error", err);
    }
})

router.post('/profile/update', isLoggedIn, async (req,res) => {
    try{
        const userId = req.session.userId;
        const updateData = {};
        Object.keys(req.body).forEach((key) => {
            if(req.body[key]){
                updateData[key] = req.body[key];
            }
        })
          const user = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
              $set: updateData,
            },
            {
              new: true,
            }
          )
          res.redirect("/profile")
    }catch(err){
        console.error("There was an error", err);
    }
})

router.post("/profile/update/password", async (req,res) => {
    const {newPassword, oldPassword} = req.body;
    try{
        const user = await UserModel.findOne({_id: req.session.userId});
        const passwordMatch = await bcryptjs.compare(
            oldPassword,
            user.password
        )
        console.log(user.password);
        if(passwordMatch){
            const salt = bcryptjs.genSaltSync(12);
            const hash = await bcryptjs.hash(newPassword, salt);
           const updatePassword = await UserModel.findOneAndUpdate({_id: req.session.userId}, {"password": hash});
        console.log(user)
           res.redirect("/profile")

        }else{
            res.send("There was an error");
        }
    }catch(err){
        console.error("There was an error", err);
    }
    console.log(req.body);
})

module.exports = router;