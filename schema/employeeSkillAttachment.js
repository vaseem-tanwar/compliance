var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSkillAttachmentSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    employeeId: { type: String, required: false, default: ""  },
    attachment:[{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }],
    note: { type: String, required: false, default: ""  },
    isActive: { type: String, enum: ['yes', 'no'], default: 'yes' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Employeeskillattachment', EmployeeSkillAttachmentSchema);