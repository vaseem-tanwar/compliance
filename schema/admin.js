var mongoose = require("mongoose");
var bcrypt = require('bcrypt');

//Create AdminSchema
var AdminSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, select: false },
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false },
    contactNo: { type: String, required: false, default: null },
    adminType: { type: String, enum: ['super', 'admin'], default: 'super' },
    status: { type: String, enum: ['yes', 'no'], default: 'yes' }
}, {
    timestamps: true
});
AdminSchema.pre('save', function (next) {
    var admin = this;
    if (!admin.isModified('password')) return next();

    const saltRounds = 10;
    bcrypt.hash(admin.password, saltRounds, function (err, hash) {
        if (err) { return next(err); }
        admin.password = hash;
        next();
    });
});
AdminSchema.methods.comparePassword = function (password) {
    var admin = this;
    return bcrypt.compareSync(password, admin.password);
};
// Export your module
module.exports = mongoose.model("Admin", AdminSchema);