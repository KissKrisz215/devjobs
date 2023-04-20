const express = require('express');
const router = express.Router();
const JobModel = require("../models/Link.model");
const UserModel = require("../models/User.model");
const bcryptjs = require('bcryptjs');

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
    console.log(jobData);
    }catch(err){
        console.error("There was an error", err);
    }
})

router.get('/login', (req,res) => {
    try{
        res.render("login");
    }catch(err){
        console.error("There was an error", err);
    }
})

router.get('/sign-up', (req,res) => {
    try{
        res.render("sign-up");
    }catch(err){
        console.error("There was an error", err);
    }
})

router.get('/apply-now', (req,res) => {
    try{
        res.render("apply-now");
    }catch(err){
        console.error("There was an error", err)
    }
})

router.post('/search', async (req,res) => {
    try{
        console.log(req.body);
        const {general,location} = req.body;
        const jobsData = await JobModel.find({"location":  {$regex : `${location}`}, "contract": `${req.body.jobtype}`})
        console.log(jobsData);
        res.render("index", {jobsData});
    }catch(err){
        console.error("There was an error", err)
    }
})

router.post('/sign-up', async (req,res) => {
    try{
      const {firstname, lastname, email, password} = req.body;
      const salt = bcryptjs.genSaltSync(12);
      const hash = await bcryptjs.hash(password, salt);
      UserModel.findOne({email: email}).then((user) => {
        if(user){
            console.log("User already Exists");
        }else{
            const newUser = new UserModel({
              firstName: firstname,
              lastName: lastname,
              email: email,
              password: hash,
            })
            newUser.save();
            console.log("User has been created");
            res.render("sign-up", {popup: true});
        }
      })
    }catch(err){
        console.error("There was an error", err);
    }
})

module.exports = router;