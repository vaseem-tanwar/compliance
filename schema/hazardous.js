var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var HazardousSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    type: { type: String, required: false, default: ""  },
    location: { type: String, required: false, default: ""  },
    typicalQty: { type: String, required: false, default: ""  },
    maxAllow: { type: String, required: false, default: "" },
    unNo: { type: String, required: false, default: ""  },
    classification: { type: String, required: false, default: ""  },
    sds: { type: String, required: false, default: ""  },
    sdsExpiry: { type: Date, required: false, default: ""  },
    photo:[{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }],
    attachment:[{
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
module.exports = mongoose.model('Hazardous', HazardousSchema);