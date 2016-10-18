var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');
var async = require('async');
var cheerio = require('cheerio');
var fs = require('fs');

router.all('/', function (req, res) {
    urls = [];
    imageSrc = [];
    image = [];
    record1 = [];
    items = [];
    item = [];
    var url = ['http://www.amazon.in/mobiles-accessories/b/ref=sd_allcat_sa_menu_mobile_all_mobiles?ie=UTF8&node=1389401031',
        'http://www.reddit.com',
        'http://www.amazon.in/mobiles-accessories/b/ref=sd_allcat_sa_menu_mobile_all_mobiles?ie=UTF8&node=1389401031'];
    var fetch = req.Collection_user;

    function saveProduct(product, cb) {
        fetch.findOneAndUpdate({"Name": product.Name}, {$set: {"LINK": product.LINK, "Name": product.Name, "Image": product.Image}}, function (err, user) {
            if (err) {
                res.json({status: 0, message: err});
            }
            if (!user) {
                var productSave = new fetch(product);
                productSave.save(function (err) {
                    if (err) {
                        res.json({status: 0, message: err})
                        cb();
                    } else {
                        res.json({status: 1, message: "record insert success"});
                        cb();
                    }
                })
            } else {
                res.json({status: 1, msg: "Updated successfully"});
                cb();
            }
        })
    }

    function scrapData(url, processData) {
        request(url, function (err, resp, body) {
            var $ = cheerio.load(body);
//fetching url here
            $('.s-result-item').each(function () {
                var href = $(this).find('.s-access-detail-page').attr('href');
                var name = $(this).find('.s-access-title').text();
                var src = $(this).find('.s-access-image').attr('src');
                var product = {LINK: href, Name: name, Image: src};
                record1.push(product);
            })
            $('a.title', '#siteTable').each(function () {
                var href = $(this).attr('href');
                var name = $(this).text();
                var src = $(this).attr('href');
                if (src.indexOf('i.imgur.com') != -1) {
                    var product = {LINK: href, Name: name, Image: src};
                    record1.push(product);
                }
            });
            async.eachSeries(record1, saveProduct, function (err) {
                res.json({status: 1, msg: "Series Processing Done"});
                processData(record1);
            })
        });
    }
    async.eachSeries(url, scrapData, function (err) {
        if (err) {
            res.json({status: 0, msg: "OOPS! How is this possible?"});
        }
        res.json({status: 1, msg: "Series Processing Done"});
    })
});
module.exports = router;