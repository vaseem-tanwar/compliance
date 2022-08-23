var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var auditQuestionCommentSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    auditId: { type: String, required: false, default: ""  },
    sectionId: { type: String, required: false, default: ""  },
    questionId: { type: String, required: false, default: ""  },
    commentList: [
        {
            _id: { type: String, required: false, default: ""  },
            comment: { type: String, required: false, default: ""  }
        }
    ],
    attachment:[{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }]
}, {
    timestamps: true
});
module.exports = mongoose.model('Auditquestioncomment', auditQuestionCommentSchema);