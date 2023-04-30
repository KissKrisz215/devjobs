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
    console.log(req.body)
    try{
        const searchTerm = req.body.general;
        const query = {
        }
        if(req.body.location){
            query.location = {$regex: req.body.location}
        }
        if(req.body.jobtype){
            query.contract = "Full Time";
        }else{
            query.contract = {$in: ['Full Time', 'Part Time', 'Freelance']};
        }

        if(req.body.general){
            query.$or = [
                { contract: { $regex: req.body.general, $options: 'i' } },
                { company: { $regex: req.body.general, $options: 'i' } },
                { location: { $regex: req.body.general, $options: 'i' } },
                { position: { $regex: req.body.general, $options: 'i' } },
                { description: { $regex: req.body.general, $options: 'i' } },
              ];
        }
  const data = await JobModel.find(query);
       res.render('index', {jobsData: data});
    }catch(err){
        console.error("There was an error", err)
    }
})



router.post("/apply-now/:JobId", isLoggedIn, upload.single('file'), async (req,res) => {
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
     })
     if(req.file){
        jobApply.resume = req.file.path;
        jobApply.fileType = req.file.mimetype;
        jobApply.fileName = req.file.originalname;
     }
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


module.exports = router;