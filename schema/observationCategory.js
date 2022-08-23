var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObservationCategorySchema = new Schema({
    _id: { type: String, required: true },   
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    category: { type: String, enum: ['accident','environmental','ncr'], default: 'accident' }, 
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('ObservationCategory', ObservationCategorySchema); 