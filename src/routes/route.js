//get
//  showevents
//  showevent

//post
//  event-register
//      body- {teamname,leaderemail,email1....}


const express = require('express');
const router = express.Router();
const users = require("../models/userModel");
const teams = require("../models/teamModel");
const events = require("../models/eventModel");
const mongoose= require('mongoose');

router.get("/",(req,res)=>{
    res.send("Hey");
})

router.get("/showevents",async (req,res)=>{
    const event= await events.find();
    res.send(event);
})

router.get("/showevent/:eventid",async (req,res)=>{
    const event= await events.findOne({_id:req.params.eventid});
    res.send(event);
})

router.post("/eventregister/:userid/:eventid"  ,  async (req,res)=>{ // middleware to authenticate and authorise user
    const userid=req.params.userid;
    const eventid=req.params.eventid;

    const event= await events.findOne({_id:eventid});
    const user= await users.findOne({_id:userid});

    if(!event){
        return res.status(400).send({ status: false, message: "Please provide a valid event id" });
    }

    for(var i=0;i<user.participation.length ;i++){

        if(user.participation[i].eventid==eventid){
            return res.status(400).send({ status: false, message: "You have Already Registered in this event" });
        }

    }

    var teamname="";
    var teamid;
    var emails=[];
    var team;
    // const teamid= new mongoose.Types.ObjectId();

    if(event.eventtype=="team"){// team participation
        let body=req.body;
        teamname=body.teamname;
        delete body["teamname"];
        delete body["leaderemail"];
        for( var key in body){
            var usr= await users.findOne({email:body[key]});

            if(!usr) return res.status(400).send({ status: false, message: `${key} is not Registered` });

            for(var i=0;i<usr.participation.length ;i++){

                if(usr.participation[i].eventid==eventid){
                    return res.status(400).send({ status: false, message: `${usr.name} has Already Registered in this event` });
                }

            }
        }
        team = await teams.create({
            eventid:eventid,
            teamname: teamname,
            emails: emails,
            leader:{
                email: user.email,
                name: user.name
            }
        });
        teamid=team._id;
        for(var i=1;i<event.teamsize;i++){
            var usr= await users.findOne({email:body["email"+i]});
            var participation = usr.participation;
            const participate = {
                _id: new mongoose.Types.ObjectId(),
                eventid: new mongoose.Types.ObjectId(eventid),
                eventname: event.eventname,
                teamid: teamid,
                teamname:teamname
            };
            participation=[...participation,participate];
            usr.set({participation:participation});
            await usr.save();
            emails.push({email:body["email"+i],name:usr.name});
            delete body["email"+i];
        }
        team.set({emails:emails});
        await team.save();
    }
    var participation = user.participation;
    const participate = {
        _id: new mongoose.Types.ObjectId(),
        eventid: new mongoose.Types.ObjectId(eventid),
        eventname: event.eventname,
        teamid: teamid,
        teamname:teamname
    };
    participation=[...participation,participate];
    
    user.set({participation:participation});
    await user.save();

    event.set({participants:event.participants+1});
    await event.save();

    return res.status(200).send({ status: true, message: "Registration Successfull"});
})

router.get("/aaa",async(req,res)=>{
    if(!req.body.teamname) console.log(req.body);
    const user= await users.find();
    const team= await teams.find();
    console.log(user)
    res.send(user);
})

module.exports = router;