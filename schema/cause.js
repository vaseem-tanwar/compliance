var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CauseSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    type: { type: String, enum: ['A', 'B','C','D'], default: 'D' }, 
    category: { type: String, enum: ['accident','environmental'], default: 'accident' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Cause', CauseSchema);