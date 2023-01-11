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
const events = require("../models/eventModel");
const { default: mongoose } = require('mongoose');

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
    
    user.participation.map(obj=>{
        if(obj.eventid==eventid){
            return res.send({ status: false, message: "User Already Registered" });
        }
    })
    var teamname="";
    var emails=[];
    if(event.eventtype=="team"){// team participation
        let body=req.body;
        for( var key in body){
            if(typeof body[key] != "string" ) return res.status(400).send({ status: false, message: "Enter a valid input" });
            if(key != "teamname" && key != "leaderemail"){
                var usr= await users.findOne({email:body[key]});
                // console.log(usr);
                if(usr.participation!=null){
                    usr.participation.map((obj)=>{
                        if(obj.eventid==eventid) return res.status(400).send({ status: false, message: "Member "+i+" Already Registered" });
                    })
                }
            }
        }
        teamname=body.teamname;
        delete body["teamname"];
        delete body["leaderemail"];
        for(var i=1;i<event.teamsize;i++){
            var usr= await users.findOne({email:body["email"+i]});
            // const participation = usr.participation;
            // const participate = {
            //     eventid: new mongoose.Types.ObjectId(eventid),
            //     eventname: event.eventname,
            //     teamid: team._id,
            //     teamname:teamname
            // };
            // participation.push(participate);
            // usr.set({participation:participation});
            // await usr.save();
            emails.push({email:body["email"+i],name:usr.name});
            delete body["email"+i];
        }
    }
    const team = await teams.create({
        eventid:eventid,
        teamname: teamname,
        emails: emails,
        leader:{
            email: user.email,
            name: user.name
        }
    });
    var participatio = user.participation;
    console.log(event.eventname)

    const participate = {
        _id: new mongoose.Types.ObjectId(),
        eventid: new mongoose.Types.ObjectId(eventid),
        eventname: event.eventname,
        teamid: team._id,
        teamname:teamname
    };
    console.log(participatio);
    console.log(participate);
    // participatio[participatio.length]=participate;
    participatio=[...participatio,participate];
    console.log(participatio);
    
    user.set({participation:participatio});
    await user.save();

    event.set({participants:event.participants+1});
    await event.save();
    // const updatedUser = await users.findByIdAndUpdate(userid, {$set: {participation:participation}}, { new: true }); //
    // const updatedEvent = await events.findByIdAndUpdate(eventid, {participants:event.participants+1}, { new: true }); //
    var response={
        teamname:teamname,
        emails:emails,
        participation:participatio,
    };
    res.send(response);
})

router.get("/aaa",async(req,res)=>{
    if(!req.body.teamname) console.log(req.body);
    const user= await users.find();
    const team= await teams.find();
    console.log(user)
    res.send(user);
})

module.exports = router;