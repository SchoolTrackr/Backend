var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var countySchema = mongoose.Schema({
    name: { type: String, required: true },
    shortName: { type: String },
    modified: { type: Date, default: Date.now },
    schools: [{ type: Schema.Types.ObjectId, ref: 'School' }]
}, { id: false });

countySchema.set('toJSON', {
    virtuals: true
});
countySchema.set('toObject', {
    virtuals: true
});

module.exports = mongoose.model('County', countySchema);