var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
    _id: { type: String, required: true },
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' },
    userId: { type: String, required: false, default: "" },
    companyId: { type: String, required: false, default: "" },
    profileImage: { type: String, required: false, default: "" },
    employeeNumber: { type: String, required: false, default: "" },
    firstName: { type: String, required: false, default: "" },
    lastName: { type: String, required: false, default: "" },
    branch: { type: String, required: false, default: "" },
    workplace: { type: String, required: false, default: "" },
    phone: { type: String, required: false, default: "" },
    mobile: { type: String, required: false, default: "" },
    email: { type: String, required: false, default: "" },
    position: { type: String, required: false, default: "" },
    reportTo: { type: String, required: false, default: 0 },
    startDate: { type: Date, required: false, default: "" },
    dob: { type: Date, required: false, default: "" },
    attachment: [{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }],
    privateInfo: { type: String, required: false, default: "" },
    isActive: { type: String, enum: ['yes', 'no'], default: 'yes' },
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' },
}, {
    timestamps: true
});
module.exports = mongoose.model('Employee', EmployeeSchema);