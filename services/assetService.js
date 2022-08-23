'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
//======================MODELS============================
var AssetModels = require('../models/asset');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var assetService = {

    //Plant related data list
    plantDataList: (data, callback) => {
        AssetModels.plantDataList(data, function (result) {
            callback(result);
        });
    },
    //add plant
    addPlant: (data, dataFile, callback) => {
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
                            let attach_ = itemKey.includes("attach");
                            if (images_ == true) {
                                var folderpath = config.uploadPlantPath + 'photo/';
                            } else if (attach_ == true) {
                                var folderpath = config.uploadPlantPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (images_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.plantPath + 'photo/' + fileName,
                                            size: size,
                                            createdAt: new Date()
                                        }
                                        data.photo.push(dataPush)
                                    } else if (attach_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.plantPath + 'attachment/' + fileName,
                                            size: size,
                                            createdAt: new Date()
                                        }
                                        data.attachment.push(dataPush)
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
                    AssetModels.addPlant(data, function (result) {
                        nextCb(null, result);
                    })
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
    //Plant list
    listPlant: (data, callback) => {
        AssetModels.listPlant(data, function (result) {
            callback(result);
        });
    },
    //Plant status change
    plantStatusChange: (data, callback) => {
        AssetModels.plantStatusChange(data, function (result) {
            callback(result);
        });
    },
    //Delete Plant
    deletePlant: (data, callback) => {
        AssetModels.deletePlant(data, function (result) {
            callback(result);
        });
    },
    // Plant Details
    getPlantDetails: (data, callback) => {
        AssetModels.getPlantDetails(data, function (result) {
            callback(result);
        });
    },
    //Delete files of Plants
    deleteFilePlant: (data, callback) => {
        AssetModels.deleteFilePlant(data, function (result) {
            callback(result);
        });
    },
    //edit plant
    editPlant: (data, dataFile, callback) => {
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
                            let attach_ = itemKey.includes("attach");
                            if (images_ == true) {
                                var folderpath = config.uploadPlantPath + 'photo/';
                            } else if (attach_ == true) {
                                var folderpath = config.uploadPlantPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (images_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.plantPath + 'photo/' + fileName,
                                            size: size,
                                            createdAt: new Date()
                                        }
                                        data.photo.push(dataPush)
                                    } else if (attach_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.plantPath + 'attachment/' + fileName,
                                            size: size,
                                            createdAt: new Date()
                                        }
                                        data.attachment.push(dataPush)
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
                    AssetModels.editPlant(data, function (result) {
                        nextCb(null, result);
                    })
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
}
module.exports = assetService;