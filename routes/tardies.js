var Tardy = require('../models/tardy.js');

function createTardy(req, res, next) {
    tardy = new Tardy({
        student: req.body.student,
        sweeper: req.user._id,
        teacher: req.body.teacher
    });
    tardy.save(function (err, success) {
        if (success) {
            res.send(201,success)
        } else {
            return next(err)
        }
    })
}

function readOneTardy(req, res, next) {
    Tardy.findById(req.params.id, function(err, tardy){
        if (err) {
            res.status(503, err)
        } else {
            res.send(tardy)
        }
    })
}

function readAllTardies(req, res, next) {
    var query = Tardy.find();
    if (req.query.student) query.where({ student: req.query.student });
    if (req.query.sweeper) query.where({ sweeper: req.query.sweeper });
    if (req.query.teacher) query.where({ teacher: req.query.teacher });
    if (req.query.limit) {
        query.limit(req.query.limit)
    } else {
        query.limit(20)
    }
    query.sort('-time').populate('student sweeper teacher', '-password');
    query.exec(function(err, success) {
        if (success) {
            res.send(200,success)
        } else {
            return next(err)
        }
    })
}

function updateTardy(req, res, next) {

}

function deleteTardy(req, res, next) {
    Tardy.findById(req.params.id, function(err, tardy){
        return tardy.remove(function(err, success) {
            if (success) {
                res.send(204);
                return next()
            } else {
                return next(err)
            }
        })
    })
}

PATH = '/api/tardies';

module.exports = function(server) {
    server.post({path: PATH, version: '0.0.1'}, createTardy);
    server.get({path: PATH, version: '0.0.1'}, readAllTardies);
    server.get({path: PATH + '/:id', version: '0.0.1'}, readOneTardy);
    server.put({path: PATH + '/:id', version: '0.0.1'}, updateTardy);
    server.del({path: PATH + '/:id', version: '0.0.1'}, deleteTardy)
};
