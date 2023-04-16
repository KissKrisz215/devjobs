const express = require('express');
const router = express.Router();
const JobModel = require("../models/Link.model");

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
      const {general,location} = req.body;
      console.log(general)
    const data = await JobModel.find({$where: function() { 
        for (var key in this) { 
            if (this[key] === "Software Engineer") { 
                return true; 
            } 
        } 
        return false; 
    }})
    console.log(data);
    }catch(err){
        console.error("There was an error", err)
    }
    res.render("index");
})

module.exports = router;