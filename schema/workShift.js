var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var WorkshiftSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    category: { type: String, enum: ['accident','improvement','ncr'], default: 'accident' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Workshift', WorkshiftSchema);