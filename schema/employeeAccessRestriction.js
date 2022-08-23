var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeAccessRestrictionSchema = new Schema({
    _id: { type: String, required: true },    
    employeeId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    accessRestriction:[]
}, {
    timestamps: true
});
module.exports = mongoose.model('Employeeaccessrestriction', EmployeeAccessRestrictionSchema);