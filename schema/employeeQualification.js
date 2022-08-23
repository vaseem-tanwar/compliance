var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeQualificationSchema = new Schema({
    _id: { type: String, required: true },    
    employeeId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    userId: { type: String, required: false, default: ""  },
    qualification: { type: String, required: false, default: ""  },
    provider: { type: String, required: false, default: ""  },
    completedDate: { type: Date, required: false, default: ""  },
    isActive: { type: String, enum: ['yes', 'no'], default: 'yes' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Employeequalification', EmployeeQualificationSchema);