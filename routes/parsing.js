var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');
var async = require('async');

async.each(url, getHTML, function (err) {
    if (err) {
        console.log("hows is this possible");
    }
    console.log("parallel processing done");
});
var url = ['https://www.flipkart.com/',
    'https://www.flipkart.com/mobiles',
    'https://www.flipkart.com/mens-clothing?otracker=nmenu_sub_Men_0_Clothing'];
for (var i = 0; i < 6; i++) {
    var item = url[i];
}

function getHTML(item, callback) {
    url = item;
    var headers = {};
    headers['user-agent'] = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7';
    var options = {
        url: url,
        headers: headers
    };
    var req = request.get(options);
    req.on('response', function (res) {
        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('end', function () {
            var buffer = Buffer.concat(chunks);
            var encoding = res.headers['content-encoding'];
            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function (err, decoded) {
                    callback(err, decoded && decoded.toString());
                });
            } else if (encoding == 'deflate') {
                zlib.inflate(buffer, function (err, decoded) {
                    callback(err, decoded && decoded.toString());
                })
            } else {
                callback(null, buffer.toString());
                console.log(buffer.toString());
            }
        });
    });
    req.on('error', function (err) {
        callback(err);
    });
}

module.exports = router;