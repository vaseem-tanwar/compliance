'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
//======================MODELS============================
var HazardousModels = require('../models/hazardous');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var hazardousService = {
    //Hazardous related data list
    hazardousDataList: (data, callback) => {
        HazardousModels.hazardousDataList(data, function (result) {
            callback(result);
        });
    },
    //Hazardous add
    addHazardous: (data, dataFile, callback) => {
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
                                var folderpath = config.uploadHazardousPath + 'photo/';
                            } else if (attach_ == true) {
                                var folderpath = config.uploadPlantPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (images_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.hazardousPath + 'photo/' + fileName,
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
                    HazardousModels.addHazardous(data, function (result) {
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
    //list Hazardous
    listHazardous: (data, callback) => {
        HazardousModels.listHazardous(data, function (result) {
            callback(result);
        });
    },
    //Hazardous status change
    hazardousStatusChange: (data, callback) => {
        HazardousModels.hazardousStatusChange(data, function (result) {
            callback(result);
        });
    },
    //Delete Hazardous
    deleteHazardous: (data, callback) => {
        HazardousModels.deleteHazardous(data, function (result) {
            callback(result);
        });
    },
    //Get Hazardous
    getHazardousDetails: function (data, callback) {
        HazardousModels.getHazardousDetails(data, function (content) {
            callback(content);
        });
    },
    //Edit Hazardous
    editHazardous: (data, dataFile, callback) => {
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
                            let images_ = itemKey.includes("images");let attach_ = itemKey.includes("attach");
                            if (images_ == true) {
                                var folderpath = config.uploadHazardousPath + 'photo/';
                            } else if (attach_ == true) {
                                var folderpath = config.uploadPlantPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (images_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.hazardousPath + 'photo/' + fileName,
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
                    HazardousModels.editHazardous(data, function (content) {
                        callback(content);
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
    //Delete files of Hazardous
    deleteFileHazardous: (data, callback) => {
        HazardousModels.deleteFileHazardous(data, function (result) {
            callback(result);
        });
    },
    

}
module.exports = hazardousService;