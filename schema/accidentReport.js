var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accidentReportSchema = new Schema({
    _id: { type: String, required: true },  
    number: { type: Number, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    description: { type: String, required: false, default: ""  },
    typeObservation: { type: String, required: false, default: ""  },
    locationWork: { type: String, required: false, default: ""  },
    additionalInfo: [],
    attachment:[{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }],
    source:  { type: String, enum: ['other', 'employee','supplier','customer'], default: 'employee' },
    sourceOtherName: { type: String, required: false, default: ""  },
    sourceId: { type: String, required: false, default: ""  },
    dateOccurence: { type: Date, required: false, default: ""  },
    branch:"",
    workplace:"",
    plant:[],
    whatHappend: { type: String, required: false, default: ""  },
    coordinator:{ type: String, required: false, default: ""  },
    bccEmail:[{
        _id: { type: String, required: false, default: '' },
        userId:{ type: String, required: false, default: '' },
        userType:{ type: String, required: false, default: '' },
    }], 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
    stage: { type: Number, enum: [1, 2,3,4], default: 1 }, 
    stageDetails:{ type: String, required: false, default: ""  },
    perticularEmployer: { type: String, required: false, default: ""  },
    reportingPerson: { type: String, required: false, default: ""  },
    potentialSeverity: { type: String, required: false, default: ""  },
    correctiveAction: { type: String, required: false, default: ""  },
    summary: { type: String, required: false, default: ""  },
    causeA:[],
    completedDate: { type: Date, required: false, default: ""  },   
    type: { type: String, required: false, default: ""  },   
    code: { type: String, required: false, default: ""  },   
    injuryCategory: { type: String, required: false, default: ""  }, 
    workDayLost: { type: Number, required: false, default: 0  }, 
    restrictedWorkDay: { type: Number, required: false, default: 0  },
    investigator:[{
        _id: { type: String, required: false, default: '' },
        userId:{ type: String, required: false, default: '' },
        userType:{ type: String, required: false, default: '' },
    }], 
}, {
    timestamps: true
});
module.exports = mongoose.model('Accidentreport', accidentReportSchema);