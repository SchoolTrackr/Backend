var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var notificationSchema = mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    type: { type: String, default: 'fa-envelope'},
    sender: { type: ObjectId, ref: 'User', required: true },
    time: { type: Date, default: Date.now }
}, { id: false });

module.exports = mongoose.model('Notification', notificationSchema);