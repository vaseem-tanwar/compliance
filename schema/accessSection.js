var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AccessSectionSchema = new Schema({
    _id: { type: String, required: true },   
    title: { type: String, required: false, default: ""  },
    keyField: { type: String, required: false, default: ""  },
    serialNo: { type: Number, required: false, default: 0  },
    isAccess: { type: Boolean, enum: [true, false], default:true } ,
    isAdd: { type: Boolean, enum: [true, false], default:true } ,
    isEdit: { type: Boolean, enum: [true, false], default:true } , 
    isDelete: { type: Boolean, enum: [true, false], default:true } 
}, {
    timestamps: true
});
module.exports = mongoose.model('Accesssection', AccessSectionSchema);