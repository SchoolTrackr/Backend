var User = require('../models/user.js');
var Person = require('../models/person.js');

upgradeAllUsers = function() {
    var query = Student.find();
    var allStudents = [];
    console.log('Preparing upgrade...');
    query.exec(function(err, students) {
        console.log('Successfully ran query');
        if (err) console.log(err);
        allStudents = students;
        allStudents.forEach(function(elem, index, array) {
            console.log('Upgrading Student: '+elem._id);
            var password = passgen();
            var role = 4;
            if (elem.role == 'admin') {
                role = 2
            } else {
                role = 4
            }
            person = new Person({
                _id: elem._id,
                name: {
                    first: elem.name.first,
                    last: elem.name.last
                },
                email: elem.email,
                role: role,
                password: elem.password
            });
            person.save(function(err, success) {
                if (err) console.log(err); else console.log('Finished upgrading user')
            })
        });
        console.log('All done!');
    })
};
upgradeAllUsers();

//function makeUser() {
//    user = new User({
//        name: {
//            first: 'Victoria',
//            last: 'Hofmeister'
//        },
//        email: 'vhofmeister@wcpss.net',
//        password: 'password'
//    });
//    user.save(function (err, success) {
//        if (err) console.log(err);
//        console.log(success)
//    })
//}

function createUser(req, res, next) {
    user = new User({
        student: req.body.student,
        sweeper: req.user._id,
        teacher: req.body.teacher
    });
    user.save(function (err, success) {
        if (success) {
            res.send(201,success)
        } else {
            return next(err)
        }
    })
}

function readOneUser(req, res, next) {
    User.findById(req.params.id, function(err, user){
        if (err) {
            res.status(503, err)
        } else {
            res.send(user)
        }
    })
}

function readAllUsers(req, res, next) {
    var query = User.find();
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

function updateUser(req, res, next) {

}

function deleteUser(req, res, next) {
    User.findById(req.params.id, function(err, user){
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

PATH = '/api/users';

module.exports = function(server) {
    server.post({path: PATH, version: '0.0.1'}, createUser);
    server.get({path: PATH, version: '0.0.1'}, readAllUsers);
    server.get({path: PATH + '/:id', version: '0.0.1'}, readOneUser);
    server.put({path: PATH + '/:id', version: '0.0.1'}, updateUser);
    server.del({path: PATH + '/:id', version: '0.0.1'}, deleteUser)
};