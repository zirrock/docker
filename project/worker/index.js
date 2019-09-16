const redis = require('redis');
const fetch = require('node-fetch');

var subscriber = redis.createClient('redis://redis:6379');

subscriber.on("message", function(channel, message) {
    body = JSON.parse(message);
    fetch(body.address, 
        {
            method: 'POST', 
            body: JSON.stringify(body.body), 
            headers: {"Content-Type": "application/json"}
        }).then(function(response) {
            return;
        }).catch(function(err) {
            console.error(err);
            return;
        });
});

subscriber.subscribe("worker");
