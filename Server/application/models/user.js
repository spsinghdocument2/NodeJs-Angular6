       var softDelete = require('mongoose-softdelete');
       var timestamps = require('mongoose-timestamp');
       var mongoose = require('mongoose')
       
       var UserSchema = new mongooseSchema({

           accountNumber: {
               type: Number,
               default: '',
               required: false,
               trim: true,
               unique: true
           },
           fullName: {
               type: String,
               default: 'Guest',
               required: false,
               ref: 'Events',
               trim: true,
               validate: [stringNotNull, "Full name is required."]
           },
           email: {
               type: String,
               default: '',
               required: false,
               trim: true,
               unique: true,
               match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

           },
           password: {
               type: String,
               default: '',
               required: false,
               trim: true,
               unique: true
           },
           mobile: {
               type: Number,
               requried: true,
               default: '',
               trim: true
           },
           salt: {
               type: String,
               default: '',
               trim: true
           },
           accountLocked: {
               type: Boolean,
               default: true,
               required: true,
               trim: true
           },
           isAccountActive: {
               type: Boolean,
               default: true,
               required: true,
               trim: true
           },
           isEmailVerify: {
               type: Boolean,
               default: false,
               required: true,
               trim: true
           },
           gender: {
               type: String,
               default: '',
               required: false,
               trim: true
           },
           lastActiveTime: {
               type: Date,
               default: Date.now
           },
           provider: {
               type: String,
               trim: true
           },
           platform: {
               type: String,
               trim: true
           },
           userImage: {
               type: String,
               default: "",
               requried: false,
               ref: 'Events',
               trim: true
           },
           deviceToken: {
               androidToken: {
                   type: String,
                   default: '',
                   trim: true
               },
               iosToken: {
                   type: String,
                   default: '',
                   trim: true
               }
           },
           city: {
               type: String,
               default: '',
               requried: false,
               trim: true
           },
           facebookId: {
               type: String,
               default: null,
               requried: false,
               trim: true
           },
           contryCode: {
               type: Number,
               default: 91 ,
               requried: false,
               trim: true
           },
           createDate: {
               type: Date,
               default: Date.now
           },
       });

       UserSchema.pre('findOneAndUpdate', function(next) {
           this.options.runValidators = true;
           next();
       });

       UserSchema.plugin(timestamps);
       UserSchema.plugin(softDelete);

     

       function stringNotNull(obj) {
           return obj.length
       }

       var User = mongoose.model('User', UserSchema);
       module.exports = User
