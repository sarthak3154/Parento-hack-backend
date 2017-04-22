const express = require('express');
const router = express.Router();
var User = require('../models/user');


router.get("/:email/getNearbyUsers", (req, res, next) => {
  var coords = [];
  coords[0] = req.query.lon;
  coords[1] = req.query.lat;
  var limit = 50;
  var maxDistance = 20;

  // We need to convert the distance to radians
  // the raduis of Earth is approximately 6371 kilometers
  maxDistance /= 112;

  console.log('User ' + req.params.email + ' requested for nearby Users.')
  User.find({
    loc: {
      $near: coords,
      $maxDistance: maxDistance
    }
  }).limit(limit).exec(function(err, users) {
    if(err) {
      return next(err);
    }
    var data = []
    for (var index = 0; index < users.length; index++) {
        var element = users[index];
        if(element.email != req.params.email) {
            data.push({
                _id: element._id,
                loc: element.loc,
                name: element.name,
                email:  element.email,
                gender: element.gender,
                public_host: element.photo.public_host,
                version: element.photo.version,
                public_id: element.photo.public_id
            })
        }
        
    }
    return res.json(data);
   
  })
})

module.exports = router;