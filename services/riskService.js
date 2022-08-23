'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
//======================MODELS============================
var RiskModels = require('../models/risk');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var RiskService = {
    //Risk related data list
    riskDataList: (data, callback) => {
        RiskModels.riskDataList(data, function (result) {
            callback(result);
        });
    },
    //Risk related data list
    addRisk: (data, callback) => {
        data._id = new ObjectID;
        RiskModels.addRisk(data, function (result) {
            callback(result);
        });
    },
    addRisk: (data, dataFile, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (!data.userId || typeof data.userId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company user id", "response_data": {} });
                } else {
                    nextCb(null, { "response_code": 200, "response_message": "Success", "response_data": {} });
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    data.photo = [];
                    if (dataFile != null && dataFile != '' && dataFile != undefined) {
                        var i = 0;
                        _async.forEach(Object.keys(dataFile), function (itemKey, callBack) {
                            i++;
                            var pic = dataFile[itemKey];
                            var size = pic.size;
                            var originalName = pic.name;
                            var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                            var fileName = i + '-' + Date.now() + ext;
                            let images_ = itemKey.includes("images");
                            if (images_ == true) {
                                var folderpath = config.uploadRiskPath + 'photo/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (images_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.riskPath + 'photo/' + fileName,
                                            size: size,
                                            createdAt: new Date()
                                        }
                                        data.photo.push(dataPush)
                                    }
                                    callBack()

                                } else {
                                    callBack()
                                }
                            });
                        }, function (err, con) {
                            nextCb(null, arg);
                        })
                    } else {
                        nextCb(null, arg);
                    }
                } else {
                    nextCb(null, arg);
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    data._id = new ObjectID;
                    RiskModels.addRisk(data, function (result) {
                        nextCb(null, result);
                    });
                } else {
                    nextCb(null, arg);
                }
            }], function (err, content) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback(content)
                }
            })
    },
    //list Risk
    listRisk: (data, callback) => {
        RiskModels.listRisk(data, function (result) {
            callback(result);
        });
    },
    //Risk status change
    riskStatusChange: (data, callback) => {
        RiskModels.riskStatusChange(data, function (result) {
            callback(result);
        });
    },
    //Delete Risk
    deleteRisk: (data, callback) => {
        RiskModels.deleteRisk(data, function (result) {
            callback(result);
        });
    },
    //Get Risk
    getRiskDetails: function (data, callback) {
        RiskModels.getRiskDetails(data, function (content) {
            callback(content);
        });
    },
    //Edit Risk
    editRisk: (data, dataFile, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (!data.userId || typeof data.userId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company user id", "response_data": {} });
                } else {
                    nextCb(null, { "response_code": 200, "response_message": "Success", "response_data": {} });
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    data.photo = [];
                    data.attachment = [];
                    if (dataFile != null && dataFile != '' && dataFile != undefined) {
                        var i = 0;
                        _async.forEach(Object.keys(dataFile), function (itemKey, callBack) {
                            i++;
                            var pic = dataFile[itemKey];
                            var size = pic.size;
                            var originalName = pic.name;
                            var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                            var fileName = i + '-' + Date.now() + ext;
                            let images_ = itemKey.includes("images");
                            if (images_ == true) {
                                var folderpath = config.uploadRiskPath + 'photo/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (images_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.riskPath + 'photo/' + fileName,
                                            size: size,
                                            createdAt: new Date()
                                        }
                                        data.photo.push(dataPush)
                                    }
                                    callBack()

                                } else {
                                    callBack()
                                }
                            });
                        }, function (err, con) {
                            nextCb(null, arg);
                        })
                    } else {
                        nextCb(null, arg);
                    }
                } else {
                    nextCb(null, arg);
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    RiskModels.editRisk(data, function (content) {
                        nextCb(null, content);
                    });
                } else {
                    nextCb(null, arg);
                }
            }], function (err, content) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback(content)
                }
            })
    },
    //Delete files of Risk
    deleteFileRisk: (data, callback) => {
        RiskModels.deleteFileRisk(data, function (result) {
            callback(result);
        });
    },
    

}
module.exports = RiskService;