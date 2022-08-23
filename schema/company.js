var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var CompanySchema = new Schema({
    _id: { type: String, required: true }, 
    userId: { type: String, required: true }, 
    companyId: { type: String, required: false, default: ""  },
    companyName: { type: String, required: false, default: ""  },
    ownerName: { type: String, required: false, default: ""  },
    phoneNumber: { type: String, required: false, default: "" },
    logo: { type: String, required: false, default: "" },
    location: { type: String, required: false, default: "" },
}, {
    timestamps: true
});
module.exports = mongoose.model('Company', CompanySchema);