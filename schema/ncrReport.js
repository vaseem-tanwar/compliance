var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ncrReportSchema = new Schema({
    _id: { type: String, required: true },   
    number: { type: Number, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    description: { type: String, required: false, default: ""  },
    typeObservation: { type: String, required: false, default: ""  },
    employee: { type: String, required: false, default: ""  },
    attachment:[{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }],
    dateOccurence: { type: Date, required: false, default: ""  },
    branch:"",
    workplace:"",
    suggestion: { type: String, required: false, default: ""  },
    coordinator:{ type: String, required: false, default: ""  },
    bccEmail:[{
        _id: { type: String, required: false, default: '' },
        userId:{ type: String, required: false, default: '' },
        userType:{ type: String, required: false, default: '' },
    }], 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' },  
    stage: { type: Number, enum: [1, 2,3,4], default: 1 }, 
    stageDetails:{ type: String, required: false, default: ""  },
    workShift:{ type: String, required: false, default: ""  }, 
    permitDetails:{ type: String, required: false, default: ""  },
    potentialSeverity:{ type: String, required: false, default: ""  },
    type:{ type: String, required: false, default: ""  },
    code:{ type: String, required: false, default: ""  },
    lostOperatingDay:{ type: Number, required: false, default: 0  },
    cost:{ type: Number, required: false, default: 0  },
    observationCategory:{ type: String, required: false, default: ""  },
    whatCost:{ type: String, required: false, default: ""  },
    whatEffect:{ type: String, required: false, default: ""  },
    effectManage:{ type: String, required: false, default: ""  },
    action: { type: String, required: false, default: ""  },    
    completedDate: { type: Date, required: false, default: ""  }, 
    investigator:[{
        _id: { type: String, required: false, default: '' },
        userId:{ type: String, required: false, default: '' },
        userType:{ type: String, required: false, default: '' },
    }] 
}, {
    timestamps: true
});
module.exports = mongoose.model('Ncrreport', ncrReportSchema);