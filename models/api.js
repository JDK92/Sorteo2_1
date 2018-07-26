'use strict';
var request = require('request')

var config = require("../config/config.json");

var apifunctions = {

    getData: function(url, callback) {

        const options = {
            json: true,
            url: url,
            auth: {
                username: config.api.usr,
                password: config.api.psw
            }
        }

        request.get(options, function(err, res, body) {
            if (err) {
                console.log(err)
            }
            console.log(body)
            callback(body)
        })

    },

    postData: function(url, objeto, callback) {
        console.log(objeto);
        const options = {
            method: 'POST',
            uri: url,
            auth: {
                username: config.api.usr,
                password: config.api.psw
            },
            body: objeto,
            json: true
        }

        request.post(options, function(err, res, body) {
            if (err) {
                console.log(err)
            }
            console.log(body)
            callback(body)
        })

    }
}

module.exports = apifunctions;