var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var auditScoreSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    auditId: { type: String, required: false, default: ""  },
    sectionId: { type: String, required: false, default: ""  },
    question: [],
    score: { type: Number, required: false, default: 0  },
    totalScore: { type: Number, required: false, default: 0  },
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Auditscore', auditScoreSchema);