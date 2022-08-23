var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accidentStageDetailSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company','employee'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    reportId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    stageStep :{ type: Number, enum: [1, 2,3,4], default: 1 },
    stageDetails: { type: String, required: false, default: ""  },
    comment: { type: String, required: false, default: ""  },
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' },
}, {
    timestamps: true
});
module.exports = mongoose.model('Accidentstagedetail', accidentStageDetailSchema);