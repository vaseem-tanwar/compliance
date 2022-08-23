var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RiskSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    type: { type: String, required: false, default: ""  },
    harm: { type: String, required: false, default: ""  },
    initialLikelihood: { type: String, required: false, default: ""  },
    residualLikelihood: { type: String, required: false, default: ""  },
    initialConsequence: { type: String, required: false, default: ""  },
    residualConsequence: { type: String, required: false, default: ""  },
    control: { type: String, required: false, default: ""  },
    initialRating: { type: String, required: false, default: ""  },
    finalRating: { type: String, required: false, default: ""  },
    photo:[{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }],
    isActive: { type: String, enum: ['yes', 'no'], default: 'yes' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Risk', RiskSchema);