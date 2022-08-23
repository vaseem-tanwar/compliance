var hzardousSchema = require('../schema/hazardous');
var workplaceSchema = require('../schema/workplace');
var hazardousTypeSchema = require('../schema/hazardousType');

var _async = require("async");
var config = require('../config.js');
var fs = require('fs');

var HazardousModels = {
    hazardousDataList: function (data, callback) {
        if (data) {
            _async.parallel({
                type: function (CallBack) {
                    hazardousTypeSchema.aggregate([
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
                location: function (CallBack) {
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
    addHazardous: function (data, callback) {
        if (data) {
            if(data.sdsExpiry==undefined || data.sdsExpiry=='null'){
                data.sdsExpiry =null;
            }
            new hzardousSchema(data).save(function (err, result) {
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
    listHazardous: function (data, callback) {
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
            hzardousSchema.aggregate([
                {
                    $match: match
                },
                {
                    $lookup:
                    {
                        from: "hazardoustypes",
                        localField: "type",
                        foreignField: "_id",
                        as: "HazardousType"
                    }
                },
                {
                    $lookup:
                    {
                        from: "workplaces",
                        localField: "location",
                        foreignField: "_id",
                        as: "Location"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        unNo:1,
                        type: '$HazardousType',
                        location: '$Location',
                        photo:1,
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
                                if (item.location.length > 0) {
                                    result[i].location = item.location[0].name;
                                } else {
                                    result[i].location = '';
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
    hazardousStatusChange: function (data, callback) {
        if (data) {
            hzardousSchema.updateOne(
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
    deleteHazardous: function (data, callback) {
        if (data) {
            hzardousSchema.updateOne(
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
    getHazardousDetails: function (data, callback) {
        if (data) {
            hzardousSchema.aggregate([
                {
                    $match: {
                        _id: data.hazardousId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        type: 1,
                        harm: 1,
                        location: 1,
                        typicalQty: 1,
                        maxAllow:1,
                        unNo:1,
                        classification:1,
                        sds:1,
                        sdsExpiry:1,
                        photo: 1,
                        attachment:1
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
    editHazardous: function (data, callback) {
        if (data) {
            if(data.sdsExpiry==undefined || data.sdsExpiry=='null'){
                data.sdsExpiry =null;
            }
            hzardousSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        type:data.type,
                        harm:data.harm,
                        location:data.location,
                        typicalQty:data.typicalQty,
                        maxAllow:data.maxAllow,
                        unNo:data.unNo,
                        classification:data.classification,
                        sds:data.sds,
                        sdsExpiry:data.sdsExpiry
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
                                await hzardousSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { photo: data.photo[p] } })
                            }
                        }
                        if (data.attachment.length > 0) {
                            for (var a = 0; a < data.attachment.length; a++) {
                                await hzardousSchema.updateOne(
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
    },    
    deleteFileHazardous: function (data, callback) {
        if (data) {
            if (data.fileType == 'image') {
                hzardousSchema.findOne(
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
                            hzardousSchema.updateOne(
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
                hzardousSchema.findOne(
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
                            hzardousSchema.updateOne(
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
}
module.exports = HazardousModels;