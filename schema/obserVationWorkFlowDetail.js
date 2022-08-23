var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var observationWorkFlowDetailSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    title: { type: String, required: false, default: ""  },
    abbreviation: { type: String, required: false, default: ""  },
    setToInvestigator: { type: Boolean, enum: [true, false], default:false },
    category: { type: String, enum: ['accident','environmental','ncr'], default: 'accident' }, 
    repeatEveryNumber: { type: Number, required: false, default: 0  }, 
    repeatEveryUnit: { type: String, required: false, default: ""  },
    coordinator:[]
}, {
    timestamps: true
});
module.exports = mongoose.model('observationWorkFlowDetail', observationWorkFlowDetailSchema);