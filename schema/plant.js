var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PlantSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    assetNumber: { type: String, required: false, default: ""  },
    serialNumber: { type: String, required: false, default: ""  },
    description: { type: String, required: false, default: ""  },
    supplier: { type: String, required: false, default: ""  },
    issuedTo: { type: String, required: false, default: ""  },
    purchaseDate: { type: Date, required: false, default: ""  },
    manufactureYear: { type: String, required: false, default: ""  },
    purchasePrice: { type: Number, required: false, default: 0  },
    warrantyLength: { type: String, required: false, default: ""  },
    category: { type: String, required: false, default: ""  },
    photo:[{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }],
    branch: { type: String, required: false, default: ""  },
    workplace: { type: String, required: false, default: ""  },
    startPointValue: { type: Number, required: false, default: ""  },
    startPointUnit: { type: String, required: false, default: ""  },
    unitUsed: { type: Number, required: false, default: 0  },
    attachment:[{
        _id: { type: String, required: false, default: '' },
        name: { type: String, required: false, default: '' },
        path: { type: String, default: '' },
        size: { type: String, default: '' },
        createdAt: { type: Date, default: '' }
    }],
    note: { type: String, required: false, default: ""  },
    isActive: { type: String, enum: ['yes', 'no'], default: 'yes' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Plant', PlantSchema);