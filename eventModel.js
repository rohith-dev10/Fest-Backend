const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required:true,
    },
    eventbanner: {
        type: String,
        required:true,
    },
    eventdate:{
        type:Date,
        required:true
    },
    eventdescription: {
        type: String,
        required:true,
    },
    eventrules: {
        type: String,
        required:true,
    },
    prize:{
        type:Number,
        required:true
    },
    teamsize:{
        type:Number,
        required:true
    },
    participants:{
        type:Number,
        default:0,
    },
}, {timestamps:true})

module.exports = mongoose.model("Events",EventSchema);