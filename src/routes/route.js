//Register
//body- {username,email,password}

//Login  
// body- {email,password}

//team-event-register
//body- {email,}

//individual-event-register
//

const express = require('express');
const router = express.Router();
const users = require("../models/userModel");
const teams = require("../models/teamModel");

router.get("/",(req,res)=>{
    res.send("Hey");
})

router.get("/aaa",async(req,res)=>{
    if(!req.body.teamname) console.log(req.body);
    const user= await users.find();
    const team= await teams.find();
    console.log(user)
    res.send(user);
})

module.exports = router;