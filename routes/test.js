var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var a = 2;
    var b = 3;
    var c = a + b;
    res.json({"sum": c});
});
router.get('/contact', function (req, res) {
    res.render('hello', {title: 'this is contact'});
});

module.exports = router;