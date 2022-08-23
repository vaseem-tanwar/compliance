var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reportChartSchema = new Schema({
    _id: { type: String, required: true },    
    createdBy: { type: String, enum: ['admin', 'company'], default: 'company' }, 
    userId: { type: String, required: false, default: ""  },
    companyId: { type: String, required: false, default: ""  },
    name: { type: String, required: false, default: ""  },
    module: { type: String, required: false, default: ""  },
    reportType: { type: String, required: false, default: ""  },
    chartType: { type: String, required: false, default: ""  },
    field: { type: String, required: false, default: ""  },
    reportData: [],
    isDelete: { type: String, enum: ['yes', 'no'], default: 'no' }, 
}, {
    timestamps: true
});
module.exports = mongoose.model('Reportchart', reportChartSchema);