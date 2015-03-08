var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt');

var personSchema = mongoose.Schema({
    name: {
        first: { type: String },
        middle: { type: String },
        last: { type: String }
    },
    email: { type: String },
    password: { type: String, required: true },
    role: { type: Number, required: true, default: 6 },
    created: { type: Date, default: Date.now },
    pilot: { type: Boolean, default: false },
    grade: { type: Number },
    tardies: [{ type: Schema.Types.ObjectId, ref: 'Tardy' }],
    tardyCount: { type: Number, default: 0 }
});

personSchema.pre('save', function(next, done) {
    var person = this;
    if (person.role == 6) {
        this.set('tardyCount', person.tardies.length);
        next();
    } else next();
});

personSchema
    .virtual('name.full')
    .get(function() {
        return this.name.first+' '+this.name.middle+' '+this.name.last;
    });


personSchema
    .virtual('firstName')
    .set(function (firstName) {
        this.set('name.first', firstName)
    });
personSchema
    .virtual('middleName')
    .set(function (middleName) {
        this.set('name.middle', middleName)
    });
personSchema
    .virtual('lastName')
    .set(function (lastName) {
        this.set('name.last', lastName)
    });

personSchema.pre('save', function(next) {
    var person = this;
    if (!this.isModified('password')) next();
    bcrypt.hash(person.password, null, null, function(err, hash) {
        if (err) console.log(err);
        person.password = hash;
        next();
    })
});
personSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};
personSchema.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    })
};

personSchema.set('toJSON', {
    virtuals: true
});
personSchema.set('toObject', {
    virtuals: true
});

module.exports = mongoose.model('Person', personSchema);