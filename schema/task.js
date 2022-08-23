var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TaskSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    detail: { type: String, required: false, default: ""  },
    type: { type: String, required: false, default: ""  },
    branch: { type: String, required: false, default: ""  },
    workplace: { type: String, required: false, default: ""  },
    dueDate: { type: Date, required: false, default: ""  },
    frequencyNumber: { type: Number, required: false, default: 0  },
    frequencyUnit: { type: String, required: false, default: ""  },
    reminderNumber: { type: Number, required: false, default: 0  },
    reminderUnit: { type: String, required: false, default: ""  },
    repeatNumber: { type: Number, required: false, default: 0  },
    repeatUnit: { type: String, required: false, default: ""  },
    note: { type: String, required: false, default: ""  },
    taskOwner: { type: String, required: false, default: ""  },
    escalationNumber: { type: Number, required: false, default: 0  },
    escalationUnit: { type: String, required: false, default: ""  },    
    notify: { type: String, required: false, default: ""  },
    assignFor: { type: String, enum: ['NONE', 'skill','plant','supplier','audit'], default: 'NONE' }, 
    assignId: { type: String, required: false, default: ""  },
    isActive: { type: String, enum: ['yes', 'no'], default: 'yes' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Task', TaskSchema);