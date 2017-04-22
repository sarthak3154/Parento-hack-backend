const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    email: String,
    uid: String,
    fbToken: String,
    name: String,
    gender: String,
    fbPhotoUrl: String,
    photo: {
        public_host: String,
        public_id: String,
        version: String
    },
    loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    },
    profileType: {
        type: String,
        default: "Parent"
    },
    schoolName: String,
    teacherSub: String,
    
        sname: String,
        standard: String,
        class: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;
