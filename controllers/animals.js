var express = require('express')
  , router = express.Router()


// Applying middleware to all routes in the router
router.use(function (req, res, next) {
  if (req.user === 'farmer') {
    next()
  } else {
    res.status(403).send('Forbidden')
  }
})


// Domestic animals page
router.get('/domestic', function(req, res) {
  res.send('Cow, Horse, Sheep')
})

// Wild animals page
router.get('/wild', function(req, res) {
  res.send('Wolf, Fox, Eagle')
})

module.exports = router