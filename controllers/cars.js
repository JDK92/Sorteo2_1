var express = require('express')
  , router = express.Router()

// Car brands page
router.get('/brands', function(req, res) {
var data = {
        "Data":""
    };
    
	data["Data"] = "Email or password is incorrect.";
	res.json(data);

  // res.send('Audi, BMW, Mercedes')
})

// Car models page
router.get('/models', function(req, res) {
  res.send('Audi Q7, BMW X5, Mercedes GL')
})

module.exports = router