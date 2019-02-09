var softDelete = require('mongoose-softdelete');
var timestamps = require('mongoose-timestamp');
var mongoose = require('mongoose');
var AccountsSchema = new mongooseSchema({
    AccountNumber: {
        type: Number,
        default: '',
        required: false
    },
    DateDue: {
        type: String,
        default: '',
        required: false
    },
    AutoPay : {
        type: String,
        default: '',
        required: false
    },
    Frequency: {
        type: String,
        default: '',
        required: false
    },
    PaymentMethod: {
        type: String,
        default: '',
        required: false
    },
    CurrentBalance: {
        type: Number,
        default: '',
        required: false
    },
    AmountPastDue: {
        type: Number,
        default: '',
        required: false
    },
    RegularAmountDue: {
        type: Number,
        default: '',
        required: false
    },
    LoanPaymentMode: {
        type: Number,
        default: '',
        required: false
    },
    LastPaymentMade: {
        type: Number,
        default: '',
        required: false
    },
    });

AccountsSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

AccountsSchema.plugin(timestamps);
AccountsSchema.plugin(softDelete);



function stringNotNull(obj) {
    return obj.length
}

var Accounts = mongoose.model('Accounts', AccountsSchema);
module.exports = Accounts