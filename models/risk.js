var riskSchema = require('../schema/risk');
var riskTypeSchema = require('../schema/reskType');
var initialLikelihoodSchema = require('../schema/initialLikelihood');
var residualLikelihoodSchema = require('../schema/residualLikelihood');
var initialConsequenceSchema = require('../schema/initialConsequence');
var residualConsequenceSchema = require('../schema/residualConsequence');
var initialRatingSchema = require('../schema/initialRating');
var finalRatingSchema = require('../schema/finalRating');

var _async = require("async");
var config = require('../config.js');
var fs = require('fs');

var RiskModels = {
    riskDataList: function (data, callback) {
        if (data) {
            _async.parallel({
                type: function (CallBack) {
                    riskTypeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
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
                initialLikelihood: function (CallBack) {
                    initialLikelihoodSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
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
                residualLikelihood: function (CallBack) {
                    residualLikelihoodSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
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
                initialConsequence: function (CallBack) {
                    initialConsequenceSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
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
                residualConsequence: function (CallBack) {
                    residualConsequenceSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
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
                initialRating: function (CallBack) {
                    initialRatingSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
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
                finalRating: function (CallBack) {
                    finalRatingSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
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
    },
    addRisk: function (data, callback) {
        if (data) {
            new riskSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    listRisk: function (data, callback) {
        if (data) {
            if (data.statusType == 'all') {
                var match = {
                    isDelete: 'no',
                    createdBy: 'company',
                    companyId: data.companyId
                }
            } else if (data.statusType == 'yes') {
                var match = {
                    isDelete: 'no',
                    isActive: 'yes',
                    createdBy: 'company',
                    companyId: data.companyId
                }
            } else if (data.statusType == 'no') {
                var match = {
                    isDelete: 'no',
                    isActive: 'no',
                    createdBy: 'company',
                    companyId: data.companyId
                }
            }
            riskSchema.aggregate([
                {
                    $match: match
                },
                {
                    $lookup:
                    {
                        from: "risktypes",
                        localField: "type",
                        foreignField: "_id",
                        as: "Type"
                    }
                },
                {
                    $lookup:
                    {
                        from: "initiallikelihoods",
                        localField: "initialLikelihood",
                        foreignField: "_id",
                        as: "InitialLikelihood"
                    }
                },
                {
                    $lookup:
                    {
                        from: "initialconsequences",
                        localField: "initialConsequence",
                        foreignField: "_id",
                        as: "InitialConsequence"
                    }
                },
                {
                    $lookup:
                    {
                        from: "initialratings",
                        localField: "initialRating",
                        foreignField: "_id",
                        as: "InitialRating"
                    }
                },
                {
                    $lookup:
                    {
                        from: "residuallikelihoods",
                        localField: "residualLikelihood",
                        foreignField: "_id",
                        as: "ResidualLikelihood"
                    }
                },
                {
                    $lookup:
                    {
                        from: "residualconsequences",
                        localField: "residualConsequence",
                        foreignField: "_id",
                        as: "ResidualConsequence"
                    }
                },
                {
                    $lookup:
                    {
                        from: "finalratings",
                        localField: "finalRating",
                        foreignField: "_id",
                        as: "FInalRating"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        type: '$Type',
                        harm: 1,
                        photo:1,
                        initialLikelihood: '$InitialLikelihood',
                        initialConsequence: '$InitialConsequence',
                        initialRating: '$InitialRating',
                        control: 1,                        
                        residualLikelihood: '$ResidualLikelihood',
                        residualConsequence: '$ResidualConsequence',
                        finalRating: '$FInalRating',
                        isActive: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: {
                        name: 1

                    }
                }], async function (err, result) {

                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        })
                    } else {
                        if (result.length > 0) {
                            for (let i = 0; i < result.length; i++) {
                                let item = result[i];
                                if (item.photo!=undefined && item.photo.length > 0) {
                                    item.photo = config.apiUrl + '' + item.photo[0].path;
                                } else {
                                    item.photo = config.apiUrl + 'images/no-img.png';
                                }
                                if (item.type.length > 0) {
                                    result[i].type = item.type[0].name;
                                } else {
                                    result[i].type = '';
                                }
                                if (item.initialLikelihood.length > 0) {
                                    result[i].initialLikelihood = item.initialLikelihood[0].name;
                                } else {
                                    result[i].initialLikelihood = '';
                                }
                                if (item.initialConsequence.length > 0) {
                                    result[i].initialConsequence = item.initialConsequence[0].name;
                                } else {
                                    result[i].initialConsequence = '';
                                }
                                if (item.initialRating.length > 0) {
                                    result[i].initialRating = item.initialRating[0].name;
                                } else {
                                    result[i].initialRating = '';
                                }
                                if (item.residualLikelihood.length > 0) {
                                    result[i].residualLikelihood = item.residualLikelihood[0].name;
                                } else {
                                    result[i].residualLikelihood = '';
                                }
                                if (item.residualConsequence.length > 0) {
                                    result[i].residualConsequence = item.residualConsequence[0].name;
                                } else {
                                    result[i].residualConsequence = '';
                                }
                                if (item.finalRating.length > 0) {
                                    result[i].finalRating = item.finalRating[0].name;
                                } else {
                                    result[i].finalRating = '';
                                }
                            }
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "List",
                            "response_data": result
                        })
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    riskStatusChange: function (data, callback) {
        if (data) {
            riskSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        isActive: data.isActive
                    }
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
                            "response_message": "Status changed.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    deleteRisk: function (data, callback) {
        if (data) {
            riskSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        isDelete: 'yes'
                    }
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
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    getRiskDetails: function (data, callback) {
        if (data) {
            riskSchema.aggregate([
                {
                    $match: {
                        _id: data.riskId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        type: 1,
                        harm: 1,
                        initialLikelihood: 1,
                        residualLikelihood: 1,
                        initialConsequence:1,
                        residualConsequence:1,
                        control:1,
                        initialRating:1,
                        finalRating:1,
                        photo: 1,
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Details.",
                            "response_data": {
                                details: result[0],
                                filePath: config.apiUrl
                            }
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    editRisk: function (data, callback) {
        if (data) {
            riskSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        type:data.type,
                        harm:data.harm,
                        initialLikelihood:data.initialLikelihood,
                        residualLikelihood:data.residualLikelihood,
                        initialConsequence:data.initialConsequence,
                        residualConsequence:data.residualConsequence,
                        control:data.control,
                        initialRating:data.initialRating,
                        finalRating:data.finalRating
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (data.photo.length > 0) {
                            for (var p = 0; p < data.photo.length; p++) {
                                await riskSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { photo: data.photo[p] } })
                            }
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },   
    deleteFileRisk: function (data, callback) {
        if (data) {
            if (data.fileType == 'image') {
                riskSchema.findOne(
                    { photo: { $elemMatch: { _id: data.fileId } } },
                    { 'photo.$': 1 },
                    function (err, result) {
                        if (err) {
                            callback({
                                "response_code": 505,
                                "response_message": "INTERNAL DB ERROR",
                                "response_data": {}
                            });
                        } else {
                            riskSchema.updateOne(
                                {
                                    _id: data._id
                                },
                                {
                                    $pull: { photo: { _id: data.fileId } }
                                },
                                function (err, resDel) {
                                    if (err) {
                                        callback({
                                            "response_code": 505,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        fs.unlinkSync('public/' + result.photo[0].path)
                                        callback({
                                            "response_code": 200,
                                            "response_message": "File deleted.",
                                            "response_data": {}
                                        });
                                    }
                                });
                        }
                    })
            }
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
}
module.exports = RiskModels;