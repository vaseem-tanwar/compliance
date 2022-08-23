var formTemplateSchema = require('../schema/formTemplate');
var fs = require('fs');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var _async = require("async");

var FormSubmissionModels = {
    formSubmissionRelatedList: function (data, callback) {
        if (data) {
            _async.parallel({
                formTemplate: function (CallBack) {
                    formTemplateSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no',
                                type:{$elemMatch:{$eq:'formSubmission'}}
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
            }, function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "List.",
                        "response_data": result
                    });
                }
            })
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    }
}
module.exports = FormSubmissionModels;