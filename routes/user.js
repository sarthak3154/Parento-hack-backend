const express = require('express')
const router = express.Router();
const cloudinary = require('cloudinary')
const User = require('../models/user')


cloudinary.config({
    cloud_name: 'sarthak',
    api_key: '828879757539239',
    api_secret: 'DIK9fPMbBuc5yuyqjnCrusgo-cA'
});

/**
 * POST /login/facebook
 */
router.post("/login/facebook", (req, res, next) => {
    var fbData = req.body.data.facebook_auth_hash.info
    var fbCred = req.body.data.facebook_auth_hash.credentials
    User.findOne({ 'email': fbData.email }, (err, existingUser) => {
      if(err) { return next(err) }
      if(existingUser) {

        if(existingUser.uid == fbData.id) {
          return res.status(200).json({ msg: 'Facebook Account Already present. Please Login',
                            state: parseInt(process.env.STATE_SUCCESS),
                            uId: existingUser._id,
                            name: existingUser.name,
                            email: existingUser.email,
                            imageUrl: existingUser.fbPhotoUrl,
                            gender: existingUser.gender
                    })
        } 
      } else {
        const user = new User()
        user.email = fbData.email
        user.uid = fbData.id
        user.fbToken = fbCred.token
        user.name = fbData.name
        user.loc = [req.body.lon, req.body.lat]
        user.fbPhotoUrl = `https://graph.facebook.com/${fbData.id}/picture?type=large`
        user.gender = fbData.gender
         cloudinary.uploader.upload(`https://graph.facebook.com/${fbData.id}/picture?type=large`, (response) => {
              user.photo.public_host = 'https://res.cloudinary.com/sarthak/image/upload/'
              user.photo.version = 'v' + response.version
              user.photo.public_id = response.public_id
            
            user.save((err) => {
            if(err) { return done(err) }

            return res.status(201).json({msg: 'Facebook User Account Successfully Created',
                        state: parseInt(process.env.STATE_SUCCESS),
                        uId: user._id,
                        name: fbData.name,
                        email: fbData.email,
                        imageUrl: user.fbPhotoUrl,
                        gender: fbData.gender
            })
          })
        })
      }
    })

})

module.exports = router;