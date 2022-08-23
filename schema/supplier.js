var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SupplierSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    regNo: { type: String, required: false, default: ""  },
    branch: { type: String, required: false, default: ""  },
    workplace: { type: String, required: false, default: ""  },
    contactName: { type: String, required: false, default: ""  },
    email: { type: String, required: false, default: ""  },
    fax: { type: String, required: false, default: ""  },
    phone: { type: String, required: false, default: ""  },
    mobile: { type: String, required: false, default: ""  },
    webAddress: { type: String, required: false, default: ""  },
    accountNumber: { type: String, required: false, default: ""  },
    category: { type: String, required: false, default: ""  },
    description: { type: String, required: false, default: ""  },
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
module.exports = mongoose.model('Supplier', SupplierSchema);