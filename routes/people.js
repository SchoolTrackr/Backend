var Person = require('../models/person.js');

function createPerson(req, res, next) {
    person = new Person({
        name: {
            first: req.body.first,
            middle: req.body.middle,
            last: req.body.last
        },
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        pilot: req.body.pilot,
        grade: req.body.grade
    });
    person.save(function (err, success) {
        if (success) {
            res.send(201,success)
        } else {
            res.send(500, err);
            return next(err)
        }
    })
}

function readOnePerson(req, res, next) {
    Person.findById(req.params.id, function(err, person){
        if (err) {
            res.status(500, err)
        } else {
            res.send(person)
        }
    })
}

function readAllPeople(req, res, next) {
    var query = Person.find();
    if (req.query.first) query.where({'name.first': req.query.first});
    if (req.query.last) query.where({'name.last': req.query.last});
    if (req.query.name) {
        if (req.query.name.indexOf(' ') > -1) {
            var fullName = req.query.name.split(' ');
            query.where({
                'name.first': new RegExp(fullName[0], 'i'),
                'name.last': new RegExp(fullName[1], 'i')
            })
        } else {
            query.where().or([{'name.first': new RegExp(req.query.name, "i")}, {'name.last': new RegExp(req.query.name, "i")}])
        }
    }
    if (req.query.email) query.where({email: req.query.email});
    if (req.query.limit) {
        query.limit(req.query.limit)
    } else {
        query.limit(20)
    }

    query.exec(function (err, student) {
        if (err) return next(err);
        res.send(student)
    });
}

function updatePerson(req, res, next) {

}

function deletePerson(req, res, next) {
    Person.findById(req.params.id, function(err, user){
        return user.remove(function(err, success) {
            if (success) {
                res.send(204);
                return next()
            } else {
                return next(err)
            }
        })
    })
}

PATH = '/api/people';

module.exports = function(server) {
    server.post({path: PATH, version: '0.0.1'}, createPerson);
    server.get({path: PATH, version: '0.0.1'}, readAllPeople);
    server.get({path: PATH + '/:id', version: '0.0.1'}, readOnePerson);
    server.put({path: PATH + '/:id', version: '0.0.1'}, updatePerson);
    server.del({path: PATH + '/:id', version: '0.0.1'}, deletePerson)
};