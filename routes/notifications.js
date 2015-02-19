var Notification = require('../models/notification.js');

function createNotification(req, res, next) {
    notification = new Notification({
        student: req.body.student,
        sweeper: req.notification._id,
        teacher: req.body.teacher
    });
    notification.save(function (err, success) {
        if (success) {
            res.send(201,success)
        } else {
            return next(err)
        }
    })
}

function readAllNotifications(req, res, next) {
    query = Notification.find();
    query.sort('-time').limit(20);
    query.exec(function(err, success) {
        if (success) {
            res.send(200, success)
        } else {
            return next(err)
        }
    })
}

function readOneNotification(req, res, next) {
    query = Notification.find();
    query.sort('-time').limit(100);
    query.exec(function(err, success) {
        if (success) {
            res.send(200,success)
        } else {
            return next(err)
        }
    })
}

function updateNotification(req, res, next) {

}

function deleteNotification(req, res, next) {
    Notification.findById(req.params.id, function(err, notification){
        return notification.remove(function(err, success) {
            if (success) {
                res.send(204);
                return next()
            } else {
                return next(err)
            }
        })
    })
}

PATH = '/api/notifications';

module.exports = function(server) {
    server.post({path: PATH, version: '0.0.1'}, createNotification);
    server.get({path: PATH, version: '0.0.1'}, readAllNotifications);
    server.get({path: PATH + '/:id', version: '0.0.1'}, readOneNotification);
    server.put({path: PATH + '/:id', version: '0.0.1'}, updateNotification);
    server.del({path: PATH + '/:id', version: '0.0.1'}, deleteNotification)
};
