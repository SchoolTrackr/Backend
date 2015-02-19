var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var Student  = require('./student.js');

var tardySchema = mongoose.Schema({
    student: { type: ObjectId, ref: 'Student', required: true },
    sweeper: { type: ObjectId, ref: 'User', required: true},
    teacher: { type: ObjectId, ref: 'User', default: null },
    time: {type: Date, default: Date.now}
});

tardySchema.pre('save', function(next, done) {
    var tardy = this;

    Student.findById(this.student, function (err, student) {
        student.tardies.push(tardy);
        student.save();
    });
    next();

});


module.exports = mongoose.model('Tardy', tardySchema);

