var softDelete = require('mongoose-softdelete');
var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose')

var AuditSchema = new mongooseSchema({

    accountNumber: {
        type: Number,
        default: '',
        required: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    action: {
        type: String,
        default: '',
        required: false
    },
    message: {
        type: String,
        default: '',
        required: false
    },
    ipAddress: {
        type: String,
        default: '',
        required: false
    },
    code: {
    type: String,
        default: '',
    required: false
}
});

AuditSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

AuditSchema.plugin(timestamps);
AuditSchema.plugin(softDelete);



function stringNotNull(obj) {
    return obj.length
}

var Audit = mongoose.model('Audit', AuditSchema);
module.exports = Audit
