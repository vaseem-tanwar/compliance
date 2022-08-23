var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSkillSchema = new Schema({
    _id: { type: String, required: true },    
    employeeId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    userId: { type: String, required: false, default: ""  },
    skill: { type: String, required: false, default: ""  },
    accessBy: { type: String, required: false, default: ""  },
    certNo: { type: String, required: false, default: ""  },
    completedDate: { type: Date, required: false, default: ""  },
    expiryDate: { type: Date, required: false, default: ""  },
    competencyLevel: { type: String, required: false, default: ""  },
    isDeletePermission: { type: String, enum: ['yes', 'no'], default: 'no' }, 
    isActive: { type: String, enum: ['yes', 'no'], default: 'yes' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Employeeskill', EmployeeSkillSchema);