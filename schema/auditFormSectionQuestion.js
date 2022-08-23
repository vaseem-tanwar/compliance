var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var auditFormSectionQuestionSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    templateId: { type: String, required: false, default: ""  },
    sectionId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    tooltip: { type: String, required: false, default: ""  },
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Auditformsectionquestion', auditFormSectionQuestionSchema);