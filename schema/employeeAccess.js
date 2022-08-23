var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeAccessSchema = new Schema({
    _id: { type: String, required: true },    
    employeeId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    accessId: { type: String, required: false, default: ""  },
    accessProfile:[]
}, {
    timestamps: true
});
module.exports = mongoose.model('Employeeaccess', EmployeeAccessSchema);