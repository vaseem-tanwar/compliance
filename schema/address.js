var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AddressSchema = new Schema({
    _id: { type: String, required: true },   
    userId: { type: String, required: false, default: ""  },
    sourceType: { type: String, enum: ['branch', 'supplier','company','employee','environmentalIncident','accidentIncident'], default: 'branch'  },
    sourceId: { type: String, required: false, default: ""  },
    addressType: { type: String, required: false, default: ""  },
    address: { type: String, required: false, default: ""  },
    isActive: { type: String, enum: ['yes', 'no'], default: 'yes' },
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Address', AddressSchema);