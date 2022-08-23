var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var auditFormSectionScoreSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    templateId: { type: String, required: false, default: ""  },
    sectionId: { type: String, required: false, default: ""  },
    option: { type: String, required: false, default: ""  },
    score: { type: Number, required: false, default: 0  },
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Auditformsectionscore', auditFormSectionScoreSchema);