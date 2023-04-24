const express = require('express');
const router = express.Router();
const JobModel = require("../models/Link.model");
const UserModel = require("../models/User.model");
const ApplyJobModel = require("../models/ApplyJob.model");
const bcryptjs = require('bcryptjs');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { ObjectId } = require('mongodb');

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

router.get('/profile', isLoggedIn, async (req, res) => {
    try {
      const user = await UserModel.findOne({ email: req.session.user.email })
      .populate("jobs")
        console.log(user);

      const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        designation: user.designation,
        bio: user.bio,
        activity: user.activity,
        jobs: user.jobs,
      };
  
      res.render('profile', { userData });
    } catch (err) {
      console.error('There was an error', err);
    }
  });

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

router.post("/apply-now/:JobId", async (req,res) => {
    const {JobId} = req.params;
    const {email} = req.session.user;
    const job = await JobModel.findById(JobId);
    const user = await UserModel.findOne({email: email})
    try{
     const jobApply = new ApplyJobModel({
        jobId: JobId,
        jobTitle: job.position,
        jobCompany: job.company,
        author: user._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        occupation: req.body.occupation,
        bio: req.body.bio,
        resume: req.body.file,
     })
     jobApply.save();

    const update = await UserModel.updateOne(
        { _id: user._id },
        { $push: { jobs: jobApply._id } }
     );
     console.log(update);
     console.log("The user has been saved");
    }catch(err){
        console.error("There was an error", err);
    }
})

router.post("/jobs/delete/:jobId", async (req, res)=> {
     const {jobId} = req.params;
     const {userId} = req.session;
     const _id = new ObjectId(jobId);
    try{
        await UserModel.updateOne(
            { _id: userId },
            { $pull: { jobs: _id } }
          );
     const deleteJob = await ApplyJobModel.findByIdAndDelete(jobId);
     const user = await UserModel.findOne({email: req.session.user.email});
     console.log(user.jobs);
     res.redirect("/profile");
    }catch(err){
        console.error("There was an error", err);
    }
})

module.exports = router;