var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    _id: { type: String, required: true },    
    companyId: { type: String, required: false, default: ""  },
    employeeId: { type: String, required: false, default: ""  },
    userName: { type: String, required: false, default: ""  },
    email: { type: String, required: false, default: "" },
    password : { type: String, required: false, default: "" }, 
    userType :{ type: String, enum: ['company','employee'], default: 'employee'},
    authToken : { type: String, required: false, default: "" }, 
    deviceToken : { type: String, required: false, default: "" }, 
    appType :{ type: String, enum: ['IOS','ANDROID','WEB'], default: 'WEB'},
    isActive :  { type: String, enum: ['yes','no'], default: 'yes'},
    isDelete :  { type: String, enum: ['yes','no'], default: 'no'},
}, {
    timestamps: true
});
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();

    const saltRounds = 10;
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) { return next(err); }
        user.password = hash;
        next();
    });
});
UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};
module.exports = mongoose.model('User', UserSchema);