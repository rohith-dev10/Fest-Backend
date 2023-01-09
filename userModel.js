const { ObjectID } = require('bson');
const mongoose = require('mongoose');

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
    teams: {
        type: [{
            _id: {
                type:ObjectID,
                required:true
            },
            eventname:{
                type: String,
                required: true,
            },
            teamname:{
                type: String
            }
        }]
    }
}, { timestamps: true })

module.exports = mongoose.model('Admin', UserSchema)