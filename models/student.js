var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var studentSchema = mongoose.Schema({
    name: {
        first: { type: String },
        last: { type: String }
    },
    grade: { type: Number, required: true},
    modified: { type: Date, default: Date.now },
    tardies: [{ type: Schema.Types.ObjectId, ref: 'Tardy' }],
    tardyCount: { type: Number, default: 0 }
}, { id: false });

studentSchema.pre('save', function(next, done) {
    tardylength = this.tardies.length;
    this.set('tardyCount', tardylength);
    next();

});

studentSchema
    .virtual('name.full')
    .get(function() {
        return this.name.first + ' ' + this.name.last;
    });

studentSchema
    .virtual('totalTardies')
    .get(function() {
        var tardies = this.tardies;
        var totalTardies = function() {
            if (!tardies) {
                return 0
            } else {
                return tardies.length
            }
        };
        return totalTardies();
    });

studentSchema
    .virtual('firstName')
    .set(function (firstName) {
        this.set('name.first', firstName)
    });
studentSchema
    .virtual('lastName')
    .set(function (lastName) {
        this.set('name.last', lastName)
    });

studentSchema.set('toJSON', {
    virtuals: true
});
studentSchema.set('toObject', {
    virtuals: true
});

module.exports = mongoose.model('Student', studentSchema);