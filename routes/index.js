const express = require('express');
const router = express.Router();
const JobModel = require("../models/Link.model");
const UserModel = require("../models/User.model");
const ApplyJobModel = require("../models/ApplyJob.model");
const bcryptjs = require('bcryptjs');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const fs = require('fs');

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
           res.redirect("/profile")

        }else{
            res.send("There was an error");
        }
    }catch(err){
        console.error("There was an error", err);
    }
    console.log(req.body);
})

router.post("/apply-now/:JobId", upload.single('file'), async (req,res) => {
    const {JobId} = req.params;
    const {email} = req.session.user;
    const job = await JobModel.findById(JobId);
    const user = await UserModel.findOne({email: email})
    try{
     const jobApply = new ApplyJobModel({
        jobId: JobId,
        jobTitle: job.position,
        jobCompany: job.company,
        logoBackground: job.logoBackground,
        logo: job.logo,
        author: user._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        occupation: req.body.occupation,
        bio: req.body.bio,
        resume: req.file.path,
        fileType: req.file.mimetype,
        fileName: req.file.originalname,
     })
     const savedJob = await jobApply.save();
    const update = await UserModel.updateOne(
        { _id: user._id },
        { $push: { jobs: jobApply._id } }
     );
     console.log("The user has been saved");
     res.redirect(`/jobs/${JobId}`);
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
     res.redirect("/profile");
    }catch(err){
        console.error("There was an error", err);
    }
})

router.post("/jobs/edit/:jobId", async (req,res) => {
    const {jobId} = req.params;
    jobId.toString();
    try{
        const data = await ApplyJobModel.findOne({_id: jobId});
        const jobData = await JobModel.findOne({_id: data.jobId})
    console.log("The data ==>", data)
       res.render("edit", {data, jobData});
    }catch(err){
        console.error("There was an error", err);
    }
})

router.post("/jobs/update/:jobId", async (req,res) => {
    const data = req.body;
    console.log("JobId: => ", req.params.jobId)
    console.log(data);
    try{
       const updateJob = await ApplyJobModel.updateOne({jobId: req.params.jobId}, {$set: data});
       console.log("Job is updated");
       res.redirect("/profile")
    }catch(err){
        console.error("There was an error", err);
    }
})

router.post("/files/delete/:jobId", async (req,res) =>{
  try{
    const jobDetails = await ApplyJobModel.findById(req.params.jobId);
    const fileName = jobDetails.resume;
    fs.unlink(fileName, async (err) => {
        if(err){
            console.error("There was an error");
            res.send("There was an error deleting the file!");
            return
        }
        jobDetails.resume = undefined;
        jobDetails.fileType = undefined;
        jobDetails.fileName = undefined;
        const saved = await jobDetails.save();
        res.redirect( 307,`/jobs/edit/${req.params.jobId}`)
    })
  }catch(err){
    console.error("There was an error", err);
  }
})

module.exports = router;