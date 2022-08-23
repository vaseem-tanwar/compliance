'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
//======================MODELS============================
var SupplierModels = require('../models/supplier');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var SupplierService = {
    
    //Supplier related data list
    supplierDataList: (data, callback) => {
        SupplierModels.supplierDataList(data, function (result) {
            callback(result);
        });
    },
    //Add Supplier
    addSupplier: (data, dataFile, callback) => {
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
                            let attach_ = itemKey.includes("attach");
                            if (attach_ == true) {
                                var folderpath = config.uploadSupplierPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (attach_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.supplierPath + 'attachment/' + fileName,
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
                    SupplierModels.addSupplier(data, function (result) {
                        callback(result);
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
    //list Supplier
    listSupplier: (data, callback) => {
        SupplierModels.listSupplier(data, function (result) {
            callback(result);
        });
    },
    //Supplier status change
    supplierStatusChange: (data, callback) => {
        SupplierModels.supplierStatusChange(data, function (result) {
            callback(result);
        });
    },
    //Delete Supplier
    deleteSupplier: (data, callback) => {
        SupplierModels.deleteSupplier(data, function (result) {
            callback(result);
        });
    },
    //Get Supplier
    getSupplierDetails: function (data, callback) {
        SupplierModels.getSupplierDetails(data, function (content) {
            callback(content);
        });
    },
    //Edit Supplier
    editSupplier: (data, dataFile, callback) => {
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
                            let attach_ = itemKey.includes("attach");
                            if (attach_ == true) {
                                var folderpath = config.uploadSupplierPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (attach_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.supplierPath + 'attachment/' + fileName,
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
                    SupplierModels.editSupplier(data, function (content) {
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
    //Delete files of Supplier
    deleteFileSupplier: (data, callback) => {
        SupplierModels.deleteFileSupplier(data, function (result) {
            callback(result);
        });
    },
}
module.exports = SupplierService;