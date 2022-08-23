var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AccessorSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    type: { type: String, enum: ['employee', 'supplier','customer'], default: 'employee' },
    accessor: { type: String, required: false, default: ""  },
    approvedBy: { type: String, required: false, default: ""  },
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Accessor', AccessorSchema);