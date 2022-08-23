var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var auditFormSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    tooltip: { type: String, required: false, default: ""  },
    auditor: [],
    reviewer: [],
    isActive: { type: String, enum: ['yes', 'no'], default: 'no' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Auditform', auditFormSchema);