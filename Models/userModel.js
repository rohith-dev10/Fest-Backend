const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const participate = new mongoose.Schema({
    eventid: {
        type:ObjectID,
        required:true
    },
    eventname:{
        type: String,
        required: true,
    },
    teamid: {
        type:ObjectID,
        required:true
    },
    teamname:{
        type: String
    }
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    institute: {
        type: String,
        required: true,
    },
    participation: {
        type: [{ref:participate}]
    }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)