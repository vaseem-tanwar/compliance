var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var auditSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    parentAuditId:{ type: String, required: false, default: ""  }, // Main audit id
    copyAuditId: { type: String, required: false, default: ""  }, //copy from audit id
    template: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    branch: { type: String, required: false, default: ""  },
    workplace: { type: String, required: false, default: ""  },
    supplier: { type: String, required: false, default: ""  },
    employee: { type: String, required: false, default: ""  },
    plant: { type: String, required: false, default: ""  },
    note: [],
    auditor: { type: String, required: false, default: ""  },
    reviewer: { type: String, required: false, default: ""  },
    score: { type: Number, required: false, default: 0  },
    totalScore: { type: Number, required: false, default: 0  },
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
    isSignOff: { type: String, enum: ['yes', 'no'], default: 'no' }, 
    signOffBy: { type: String, required: false, default: "" },
    signOffDate: { type: Date, required: false, default: ""  },   
    isClose: { type: String, enum: ['yes', 'no'], default: 'no' }, 
    closeBy: { type: String, required: false, default: "" },
    closeDate: { type: Date, required: false, default: ""  }, 
    enableTask: { type: Boolean, enum: [false, true], default: false }, 
    dueDate: { type: Date, required: false, default: ""  },  
}, {
    timestamps: true
});
module.exports = mongoose.model('Audit', auditSchema);