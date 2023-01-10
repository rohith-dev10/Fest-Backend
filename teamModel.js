const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    emails: {
        type: [{
            email: {
                type:String,
                required:true
            }
        }],
        required: true,
    },
    leader:{
        type:String,
        required:true
    }
}, { timestamps: true })

module.exports = mongoose.model('Team', TeamSchema)