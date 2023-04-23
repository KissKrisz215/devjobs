const express = require('express');
const router = express.Router();
const UserModel = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const isLoggedOut = require("../middlewares/isLoggedOut");

router.get('/login', isLoggedOut, (req,res) => {
    try{
        res.render("login");
    }catch(err){
        console.error("There was an error", err);
    }
})

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    try{
        const user = await UserModel.findOne({email: email});
        if(!user){
            return res.send("Invalid Email!");
        }

        const passwordMatch = await bcryptjs.compare(
            password,
            user.password
        )

        if(!passwordMatch){
            return res.send("Invalid Password!");
        }
        req.session.userId = user._id;
        req.session.user = {
            email: user.email
        }
        res.redirect('/profile');

    }catch(err){
        console.error("There was an error", err);
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

router.get('/sign-up', (req,res) => {
    try{
        res.render("sign-up");
    }catch(err){
        console.error("There was an error", err);
    }
})

router.post('/logout', (req,res,next) => {
    req.session.destroy((err) => {
        if(err){
            next(err);
            return
        }
        res.redirect("/")
    })
})

module.exports = router;