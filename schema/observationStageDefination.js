var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObservationStageDefinationSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    stage1: { type: String, required: false, default: ""  },
    stage2: { type: String, required: false, default: ""  },
    stage3: { type: String, required: false, default: ""  },
    stage4: { type: String, required: false, default: ""  },
    category: { type: String, enum: ['accident','environmental','ncr'], default: 'accident' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' },
}, {
    timestamps: true
});
module.exports = mongoose.model('Observationstagedefination', ObservationStageDefinationSchema);