var User = require('../models/user.js');
var Tardy = require('../models/tardy.js');
var authLib = require('../libs/authLib.js');

function getMe(req, res, next) {
    var query = Tardy.find({ teacher: req.user._id }).populate('student sweeper teacher', '-password');
    query.sort('-time').limit(20);
    query.exec(function(err, success) {
        var response = {
            user: req.user,
            tardies: success
        };
        if (success) {
            res.send(200, response)
        } else {
            res.send(404, err)
        }
    });
}


PATH = '/api/auth';

module.exports = function(server) {
    server.post({path: PATH + '/authenticate', version: '0.0.1'}, authLib.authenticate);
    server.get({path: '/api/me', version: '0.0.1'}, getMe)
};
