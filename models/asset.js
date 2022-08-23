var plantCategorySchema = require('../schema/plantCategory');
var workplaceSchema = require('../schema/workplace');
var supplierSchema = require('../schema/supplier');
var plantSchema = require('../schema/plant');
var employeeSchema = require('../schema/employee');

var config = require('../config.js');
var _async = require("async");
var fs = require('fs');

var PlantModels = {
    plantDataList: function (data, callback) {
        if (data) {
            _async.parallel({
                workplace: function (CallBack) {
                    workplaceSchema.aggregate([
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
                category: function (CallBack) {
                    plantCategorySchema.aggregate([
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
                supplier: function (CallBack) {
                    supplierSchema.aggregate([
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
                issuedTo: function (CallBack) {
                    employeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: { $concat: ["$firstName", " ", "$lastName",] },
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
    addPlant: function (data, callback) {
        if (data) {
            new plantSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Plant added.",
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
    listPlant: function (data, callback) {
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
            plantSchema.aggregate([
                {
                    $match: match
                },
                {
                    $lookup:
                    {
                        from: "branches",
                        localField: "branch",
                        foreignField: "_id",
                        as: "Branch"
                    }
                },
                {
                    $lookup:
                    {
                        from: "workplaces",
                        localField: "workplace",
                        foreignField: "_id",
                        as: "Workplace"
                    }
                },
                {
                    $lookup:
                    {
                        from: "plantcategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "PlantCategory"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        assetNumber: 1,
                        serialNumber: 1,
                        unitUsed: 1,
                        photo: 1,
                        branch: '$Branch',
                        workplace: '$Workplace',
                        category: '$PlantCategory',
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
                                if (item.branch.length > 0) {
                                    result[i].branch = item.branch[0].name;
                                } else {
                                    result[i].branch = '';
                                }
                                if (item.workplace.length > 0) {
                                    result[i].workplace = item.workplace[0].name;
                                } else {
                                    result[i].workplace = '';
                                }
                                if (item.category.length > 0) {
                                    result[i].category = item.category[0].name;
                                } else {
                                    result[i].category = '';
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
    plantStatusChange: function (data, callback) {
        if (data) {
            plantSchema.updateOne(
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
    deletePlant: function (data, callback) {
        if (data) {
            plantSchema.updateOne(
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
                            "response_message": "Plant / Equipment deleted.",
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
    getPlantDetails: function (data, callback) {
        if (data) {
            plantSchema.aggregate([
                {
                    $match: {
                        _id: data.plantId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        assetNumber: 1,
                        serialNumber: 1,
                        description: 1,
                        supplier: 1,
                        issuedTo: 1,
                        purchaseDate: 1,
                        manufactureYear: 1,
                        purchasePrice: 1,
                        warrantyLength: 1,
                        category: 1,
                        photo: 1,
                        branch: 1,
                        workplace: 1,
                        startPointValue: 1,
                        startPointUnit: 1,
                        unitUsed: 1,
                        attachment: 1,
                        note: 1,
                        createdAt: 1
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
                            "response_message": "Plant Details.",
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
    deleteFilePlant: function (data, callback) {
        if (data) {
            if (data.fileType == 'image') {
                plantSchema.findOne(
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
                            plantSchema.updateOne(
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
            } else {
                plantSchema.findOne(
                    { attachment: { $elemMatch: { _id: data.fileId } } },
                    { 'attachment.$': 1 },
                    function (err, result) {
                        if (err) {
                            callback({
                                "response_code": 505,
                                "response_message": "INTERNAL DB ERROR",
                                "response_data": {}
                            });
                        } else {
                            plantSchema.updateOne(
                                {
                                    _id: data._id
                                },
                                {
                                    $pull: { attachment: { _id: data.fileId } }
                                },
                                function (err, resDel) {
                                    if (err) {
                                        callback({
                                            "response_code": 505,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        fs.unlinkSync('public/' + result.attachment[0].path)
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
    editPlant: function (data, callback) {
        if (data) {
            if (data.purchaseDate == undefined || data.purchaseDate == 'null') {
                data.purchaseDate = null;
            }
            plantSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        name: data.name,
                        assetNumber: data.assetNumber,
                        serialNumber: data.serialNumber,
                        description: data.description,
                        supplier: data.supplier,
                        issuedTo: data.issuedTo,
                        purchaseDate: data.purchaseDate,
                        manufactureYear: data.manufactureYear,
                        purchasePrice: data.purchasePrice,
                        warrantyLength: data.warrantyLength,
                        category: data.category,
                        branch: data.branch,
                        workplace: data.workplace,
                        startPointValue: data.startPointValue,
                        startPointUnit: data.startPointUnit,
                        unitUsed: data.unitUsed,
                        note: data.note
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
                                await plantSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { photo: data.photo[p] } })
                            }
                        }
                        if (data.attachment.length > 0) {
                            for (var a = 0; a < data.attachment.length; a++) {
                                await plantSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { attachment: data.attachment[a] } })
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
    }
}
module.exports = PlantModels;