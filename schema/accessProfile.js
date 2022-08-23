var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AccessProfileSchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    accessProfile:[]
}, {
    timestamps: true
});
module.exports = mongoose.model('Accessprofile', AccessProfileSchema);