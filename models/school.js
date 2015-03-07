var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var County   = require('./county.js');

var schoolSchema = mongoose.Schema({
    name: { type: String, required: true  },
    shortName: { type: String },
    identNumber: { type: Number, required: true },
    modified: { type: Date, default: Date.now },
    county: { type: Schema.Types.ObjectId, ref: 'County' },
    logo: { type: String },
    permissions: {

    }
}, { id: false });

schoolSchema.pre('save', function(next, done) {
    var school = this;
    County.findById(this.county, function (err, county) {
        county.schools.push(school);
        county.save();
    });
    next();
});

schoolSchema.set('toJSON', {
    virtuals: true
});
schoolSchema.set('toObject', {
    virtuals: true
});

module.exports = mongoose.model('School', schoolSchema);