const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const participate = new mongoose.Schema({
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
    participation: {
        type: [{ref:participate}]
    }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)

// {"_id":{"$oid":"63bcc27f43462147040cbea9"},"name":"Rohith","email":"rohith@gmail.com","password":"Password","participation":[{"eventname":"AAAA","teamid":{"$oid":"63bcc2e743462147040cbeaa"},"teamname":""},{"eventname":"BBBB","teamid":{"$oid":"63bcc36b43462147040cbeab"},"teamname":"SADASD"}]}