var Student = require('../models/student.js');
var Person = require('../models/person.js');

upgradeAllStudents = function() {
    var query = Student.find();
    var allStudents = [];
    console.log('Preparing upgrade...');
    query.exec(function(err, students) {
        console.log('Successfully ran query');
        console.log(students);
        if (err) console.log(err);
        allStudents = students;
        allStudents.forEach(function(elem, index, array) {
            console.log(elem)
        })
    })
};
upgradeAllStudents();

//Legacy code to update ALL student profiles at once
//updateAllStudents = function() {
//    var query = Student.find();
//    var allStudents = [];
//    query.exec(function(err, students) {
//        if (err) return err;
//        allStudents = students;
//        allStudents.forEach(function(elem, index, array) {
//            console.log("Loading element"+index);
//            elem.save();
//        })
//    });
//};

function createStudent(req, res, next) {
    student = new Student({
        name: {
            first: req.body.first,
            last: req.body.last
        },
        grade: req.body.grade
    });
    student.save(function (err, success) {
        if (success) {
            res.send(201,success)
        } else {
            return next(err)
        }
    })
}

function readOneStudent(req, res, next) {
    Student.findById(req.params.id, function(err, student){
        if (err) {
            res.status(500, err)
        } else {
            res.send(student)
        }
    })
}

function readAllStudents(req, res, next) {
    var query = Student.find();
    if (req.query.first) query.where({ 'name.first': req.query.first});
    if (req.query.last) query.where({ 'name.last': req.query.last});
    if (req.query.name) {
        if (req.query.name.indexOf(' ') > -1) {
            var fullName = req.query.name.split(' ');
            query.where({'name.first': new RegExp(fullName[0], 'i'), 'name.last': new RegExp(fullName[1], 'i')})
        } else {
            query.where().or([{ 'name.first': new RegExp(req.query.name, "i")}, { 'name.last': new RegExp(req.query.name, "i")}])
        }
    }
    if (req.query.grade) query.where({ grade: req.query.grade});
    if (req.query.tardyCount) query.where({ tardies: {$size: req.query.tardyCount}});
    if (req.query.tardyRangeUpper) query.where({ tardyCount: {$lt: req.query.tardyRangeUpper}});
    if (req.query.tardyRangeLower) query.where({ tardyCount: {$gt: req.query.tardyRangeLower}});
    if (req.query.sort) {
        query.sort(req.query.sort)
    }
    if (req.query.limit) {
        query.limit(req.query.limit)
    } else {
        query.limit(20)
    }
    if (req.query.count) {
        query.limit(1000000);
        query.exec(function(err, students) {
            if (err) return next(err);
            var resultCount = students.length;
            res.send(200, resultCount);
        });
    } else {
        query.exec(function(err, students) {
            if (err) return next(err);
            res.send(students)
        });
    }
}

function updateStudent(req, res, next) {

}

function deleteStudent(req, res, next) {
    Student.findById(req.params.id, function(err, student){
        return student.remove(function(err, success) {
            if (success) {
                res.send(204);
                return next()
            } else {
                return next(err)
            }
        })
    })
}

PATH = '/api/students';

module.exports = function(server) {
    server.post({path: PATH, version: '0.0.1'}, createStudent);
    server.get({path: PATH, version: '0.0.1'}, readAllStudents);
    server.get({path: PATH + '/:id', version: '0.0.1'}, readOneStudent);
    server.put({path: PATH + '/:id', version: '0.0.1'}, updateStudent);
    server.del({path: PATH + '/:id', version: '0.0.1'}, deleteStudent)
};
