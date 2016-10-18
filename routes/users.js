var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

// request('https://affiliate-api.flipkart.net/affiliate/api/shekharty1.json', function (error, response, body) {
//   if (!error && response.statusCode == 200) {

//       console.log(body);

//   }
// }); 
var url = 'https://affiliate-api.flipkart.net/affiliate/deltaFeeds/shekharty1/category/computer_storage.json';
var headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
    'Content-Type': 'application/x-www-form-urlencoded',
    'expiry': '1473154006000',
    'sig': '1c734db8c083448586d9430f4279a08b'
};

request.get({url: url, headers: headers}, function (err, resp, body) {
    console.log(err);
    console.log(body);
});

// request({
//     headers: {
//       'Content-Length': "contentLength",
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'expiry': '1473154006000',
// 	 		'sig': '1c734db8c083448586d9430f4279a08b'
//     },
//     uri: 'https://affiliate-api.flipkart.net/affiliate/deltaFeeds/shekharty1/category/Furniture.json',
//     method: 'get'
//   }, function (err, res, body) {
//     //it works!
//     console.log(body);
//   });

module.exports = router;