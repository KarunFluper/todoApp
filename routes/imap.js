var express = require('express');
var router = express.Router();
var inspect = require('util').inspect;
var path = require('path');
var fs = require('fs');
var base64 = require('base64-stream');
var Imap = require('imap');

router.post('/', function (req, res) {
    var Imap = require('imap'),
            inspect = require('util').inspect;
    var user = req.body.user;
    var password = req.body.password
    var imap = new Imap({
        user: user,
        password: password,
        host: 'imap.gmail.com',
        port: 993,
        tls: true
    });

    function toUpper(thing) {
        return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
    }

    function findAttachmentParts(struct, attachments) {
        attachments = attachments || [];
        for (var i = 0, len = struct.length, r; i < len; ++i) {
            if (Array.isArray(struct[i])) {
                findAttachmentParts(struct[i], attachments);
            } else {
                if (struct[i].disposition && ['INLINE', 'ATTACHMENT'].indexOf(toUpper(struct[i].disposition.type)) > -1) {
                    attachments.push(struct[i]);
                }
            }
        }
        return attachments;
    }

    function buildAttMessageFunction(attachment) {
        var filename = attachment.params.name;
        var encoding = attachment.encoding;
        return function (msg, seqno) {
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function (stream, info) {
                console.log(prefix + 'Streaming this attachment to file', filename, info);
                var writeStream = fs.createWriteStream(filename);
                writeStream.on('finish', function () {
                    console.log(prefix + 'Done writing to file %s', filename);
                    fs.readFile(filename, {encoding: "utf8"}, function (error, data) {
                        res.json(data);
                    })
                });
                if (toUpper(encoding) === 'BASE64') {
                    stream.pipe(base64.decode()).pipe(writeStream);
                } else {
                    stream.pipe(writeStream);
                }
            });
            msg.once('end', function () {
                console.log(prefix + 'Finished attachment %s', filename);
            });
        };
    }
    imap.once('ready', function () {
        imap.openBox('INBOX', true, function (err, box) {
            if (err)
                throw err;
            var f = imap.seq.fetch('6', {
                bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
                struct: true
            });
            f.on('message', function (msg, seqno) {
                console.log('Message #%d', seqno);
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream, info) {
                    var buffer = '';
                    stream.on('data', function (chunk) {
                        buffer += chunk.toString('utf8');
                    });
                    stream.once('end', function () {
                        console.log(Imap.parseHeader(buffer));
                    });
                });
                msg.once('attributes', function (attrs) {
                    var attachments = findAttachmentParts(attrs.struct);
                    console.log(prefix + 'Has attachments: %d', attachments.length);
                    for (var i = 0, len = attachments.length; i < len; ++i) {
                        var attachment = attachments[i];
                        console.log(attachment);
                        console.log(prefix + 'Fetching attachment %s', attachment.params.name);
                        var f = imap.fetch(attrs.uid, {
                            bodies: [attachment.partID],
                            struct: true
                        });
                        f.on('message', buildAttMessageFunction(attachment));
                        console.log(buildAttMessageFunction(attachment));
                    }
                });
                msg.once('end', function () {
                    console.log(prefix + 'Finished email');
                });
            });
            f.once('error', function (err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function (seqno) {
                console.log('Done fetching all messages!');
                imap.end();
            });
        });
    });
    imap.once('error', function (err) {
        console.log(err);
    });
    imap.once('end', function () {
        console.log('Connection ended');
    });
    imap.connect();
});

module.exports = router;