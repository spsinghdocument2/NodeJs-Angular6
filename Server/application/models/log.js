var softDelete = require('mongoose-softdelete');
var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose')

var LogSchema = new mongooseSchema({
    accountNumber: {
        type: Number,
        default: '',
        required: false
    },
    action: {
        type: String,
        default: '',
        required: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: '',
        required: false
    },
    exception: {
        type: String,
        default: '',
        required: false
    },
});

LogSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

LogSchema.plugin(timestamps);
LogSchema.plugin(softDelete);



function stringNotNull(obj) {
    return obj.length
}

var Log = mongoose.model('Log', LogSchema);
module.exports = Log