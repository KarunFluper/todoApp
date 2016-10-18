var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose').Mongoose;
var html_dir = './public/';

router.all('/users/create', function (req, res) {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema();
    var conn = mongoose.connection;
    var userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            index: {unique: true}
        },
        password: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^[0-9]{10}$/.test(v);
                },
                message: '{VALUE} is not a valid phone number!'
            }
        },
        comments: [{type: Schema.Types.ObjectId, ref: 'users'}]
    });
    var Users = conn.model('Users', userSchema);
    var users = req.Collection_user;
    var name = req.body.name;
    var mobile = req.body.mobile;
    var email = req.body.email;
    var password = req.body.password;

    if (name.length > 0 && mobile.length > 0 && email.length > 0 && password.length > 0) {
        Test.find({email: email}).populate('comments').lean().exec(function (err, docs) {
        }, function (error, result) {
            if (error) {
                res.json({status: 0, msg: "invalid email is"});
            } else if (!result || result.length == '0') {
                var record = new users({
                    name: name,
                    mobile: mobile,
                    email: email,
                    password: password
                });
                record.save(function (err) {
                    if (err) {
                        res.json({status: 0, message: err})
                    } else {
                        users.findOne({email: email}, function (err, docs) {
                            res.json({status: 1, id: docs._id, message: "record insert success"});
                        });
                    }
                })
            } else {
                res.json({status: 0, msg: "user already registered"});
            }
        });
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

router.post('/users/login', function (req, res) {
    var users = req.Collection_user;
    var email = req.body.email;
    var password = req.body.password;
    if (email.length > 0 && password.length > 0) {
        users.findOne({email: email, password: password}, function (err, user) {
            if (err) {
                res.json({status: 0, message: err});
            }
            if (!user) {
                res.json({status: 0, msg: "not found"});
            }
            res.json({status: 1, id: user._id, message: " success"});
        })
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

router.all('/todo/create', function (req, res) {
    var taskcreate = req.Collection;
    var task = req.body.task;
    var date = req.body.date;
    var status1 = req.body.status1;
    var userid = req.body.userid;
    var users = req.Collection;
    var record = new taskcreate({
        task: task,
        date: date,
        status1: status1,
        userid: userid
    });
    if (task.length > 0) {
        record.save(function (err, result) {
            if (err) {
                res.json({status: 0, message: err})
            } else {
                res.json({status: 1, userid: userid, task: task, date: date, message: " success"});
            }
        })
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

router.get('/todo/fetch/:userid', function (req, res) {
    var users = req.Collection;
    var userid = req.params.userid;
    if (userid) {
        users.find({userid: userid}, function (err, user) {
            if (err) {
                res.json({status: 0, message: err});
            } else if (!user || user.length == '0') {
                res.json({status: 0, msg: "not found"});
            } else {
                var allInfo = [];
                for (var a = 0; a < user.length; a++) {
                    var row = user[a];
                    var task = row.get('task');
                    var status1 = row.get('status1');
                    var date = row.get('date');
                    var taskid = row.get('_id');
                    allInfo.push({task: task, status1: status1, date: date, taskid: taskid});
                }
                res.json({status: 1, allInfo: allInfo});
            }
        });
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

router.post('/users/todo/update', function (req, res) {
    var users = req.Collection;
    var task = req.body.task;
    var date = req.body.date;
    var status1 = req.body.status1;
    var taskid = req.body.taskid;
    var userid = req.body.userid;
    if (taskid.length > 0) {
        users.findOneAndUpdate({_id: taskid}, {$set: {task: task, date: date, status1: status1}}, function (err, user) {
            if (err) {
                res.json({status: 0, message: err});
            }
            if (!user) {
                res.json({status: 0, msg: "not found"});
            } else {
                res.json({status: 1, task: task, date: date, status1: status1, message: " update success"});
            }
        })
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

router.post('/users/todo/remove', function (req, res) {
    var users = req.Collection;
    var userid = req.body.userid;
    var taskid = req.body.taskid;
    if (taskid.length > 0) {
        users.findOne({_id: taskid}, function (err, user) {
            if (err) {
                res.json({status: 0, message: err});
            }
            if (!user) {
                res.json({status: 0, msg: "not found"});
            } else {
                user.remove();
                res.json({status: 1, message: " success"});
            }
        })
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

module.exports = router;