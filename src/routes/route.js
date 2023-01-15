const express   = require('express');
const mongoose  = require('mongoose');
const router    = express.Router();

const users     = require("../models/userModel");
const teams     = require("../models/teamModel");
const events    = require("../models/eventModel");
const fetchuser = require("../middleware/FetchUser");

const {isValidObjectId , mailRegex, isValid, teamnameRegex } = require("../validators/validations");

router.get("/userdashboard", fetchuser ,async (req,res)=>{
    const userid=req.user.id;

    try{
        const user= await users.findOne({_id:userid});

        var participation=user.participation;
        var indpart=[];
        var teampart=[];

        for(var i=0;i<participation.length;i++){
            var part={};
            var participate=participation[i];
            const event=await events.findOne({_id:participate.eventid});
            var status;
            
            var evedt = event.eventdate;
            var eveenddt = event.eventenddate;
            var nowdt = new Date();
            var ed=new Date(evedt);
            var eed=new Date(eveenddt);
            var nd=new Date(nowdt);
            if(ed.setHours(0,0,0,0)>nd.setHours(0,0,0,0)){
                status="Upcoming";
            }
            ed=new Date(evedt);
            nd=new Date(nowdt);
            if(ed.setHours(0,0,0,0)==nd.setHours(0,0,0,0)){
                ed=new Date(evedt);
                nd=new Date(nowdt);
                if(ed>nd){
                    status="Today";
                }
            }
            nd=new Date(nowdt);
            if(eed<nd){
                status="Completed";
            }
            status=!status?"Ongoing":status;

            delete evedt,eveenddt,nowdt,ed,eed,nd;
            
            part["eventname"]=event.eventname;
            part["eventstatus"]=status;
            part["description"]=event.eventdescription;
            
            if(participate.teamname!=""){
                const team=await teams.findOne({_id:participate.teamid});
                part["teamname"]=team.teamname;
                part["leader"]=team.leader.name;
                part["members"]=[];
                for(let j=0;j<team.emails.length;j++){
                    if(team.emails[j].name!=user.name) part.members.push(team.emails[j].name);
                }
                teampart.push(part);
            }
            else indpart.push(part);
        }
        
        return res.status(200).send({name:user.name,indpart,teampart,});
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
})


router.post("/eventregister/:eventid" , fetchuser ,  async (req,res)=>{
    const userid=req.user.id;
    const eventid=req.params.eventid;

    if(!isValidObjectId(eventid)){
        return res.status(400).send({ status: false, message: "Please provide a valid event id" });
    }

    try{
        const event= await events.findOne({_id:eventid});
        const user= await users.findOne({_id:userid});

        if(!event){
            return res.status(400).send({ status: false, message: "Please provide a valid event id" });
        }

        let us=await users.findOne({_id: mongoose.Types.ObjectId(userid),"participation.eventid": mongoose.Types.ObjectId(eventid)});
        if(us){
            return res.status(400).send({ status: false, message: "You are Already Registered in this event" });
        }

        var teamname="";
        var teamid;
        var emails=[];
        var team;

        if(event.eventtype=="team"){
            let body=req.body;

            if(!isValid(body.teamname)){
                return res.status(400).send({ status: false, message: "Team Name cannot be Empty" });
            }
            if(!teamnameRegex(body.teamname)){
                return res.status(400).send({ status: false, message: "Not a valid Team Name" });
            }

            teamname=body.teamname;
            delete body["teamname"];
            delete body["leaderemail"];
            var usrarr=[];
            for( var key in body){
                
                if(!isValid(body[key])){
                    return res.status(400).send({ status: false, message: "Email Field cannot be empty" });
                }
                if(!mailRegex(body[key])){
                    return res.status(400).send({ status: false, message: "Enter a valid Email" });
                }

                let usr= await users.findOne({email:body[key]});

                if(!usr) return res.status(400).send({ status: false, message: `${key} is not Registered` });

                let us=await users.findOne({_id: mongoose.Types.ObjectId(usr.id),"participation.eventid": mongoose.Types.ObjectId(eventid)});
                if(us){
                    return res.status(400).send({ status: false, message: `${usr.name} is Already Registered in this event` });
                }
                usrarr.push(usr);
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
            for(var i=0;i<usrarr.length;i++){
                let usr= usrarr[i];
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
                
                emails.push({email:usr.email,name:usr.name});
                delete body["email"+(i+1)];
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
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).send("Check the details you have entered or it may be caused due to Internal Server Error");
    }
})

module.exports = router;