var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose').Mongoose;
var async = require('async');

router.all('/', function (req, res) {
    var insertname = req.Collection;
    var name = ["shekhar", 'vishal', "param", "abhishek", 'amit', 'abhijeet'];
    for (var i = 0; i < 6; i++) {
        var item = name[i];
    }
    async.eachSeries(name, processData, function (err) {
        if (err) {
            res.json({status: 0, msg: "OOPS! How is this possible?"});
        }
        res.json({status: 1, msg: "Series Processing Done"});
    })
    function processData(item, callback) {
        var record = new insertname({
            item: item,
        });
        record.save(function (err, result) {
            if (err) {
                res.json({status: 0, message: err})
            } else {
                insertname.update({item: item, previousId: result._id}, {previousId: result._id}, {upsert: true}, function (err, user) {
                    res.json(result._id);
                });
                callback(null);
            }
        });
    }
});
module.exports = router;