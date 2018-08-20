var redis = require('redis');

var redisClient = redis.createClient({
    host: "localhost"
}); // replace with your config

redisClient.on('error', function(err) {
     console.log('Redis error: ' + err);
}); 

module.exports = redisClient;