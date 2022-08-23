'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
var baseUrl = config.baseUrl;

//======================MODELS============================
var AuditModels = require('../models/audit');
var TaskModels = require('../models/task');
//======================Module============================

var auditService = {
    //Audit related data list
    auditRelatedDataList: (data, callback) => {
        AuditModels.auditRelatedDataList(data, function (result) {
            callback(result);
        });
    },
    //Audit form template details
    auditFormTemplateDetails: (data, callback) => {
        AuditModels.auditFormTemplateDetails(data, function (result) {
            callback(result);
        });
    },
    //Audit Register
    auditRegister: (data, callback) => {
        data._id = new ObjectID;
        data.parentAuditId= data._id;
        data.dueDate = '';
        if(data.enableTask==true){
            if(data.task.dueDate!=null && data.task.dueDate!='' && data.task.dueDate!=null){
                data.dueDate = data.task.dueDate;
            }
        }
        AuditModels.auditRegister(data, function (result) {
            if (result.response_code == 200) {
                if(data.enableTask==true){
                    var taskData = {};
                    taskData = data.task;
                    taskData.assignFor = 'audit';
                    taskData.assignId = data.parentAuditId;
                    taskData._id = data._id;
                    taskData.userId = data.userId;
                    taskData.companyId = data.companyId;
                    TaskModels.addTask(taskData, function (result) {
                        callback(result);
                    });
                } else {
                    callback(result);
                }
            } else {
                callback(result);
            }
        });
    },
    //Audit List
    listAudit: (data, callback) => {
        data._id = new ObjectID;
        AuditModels.listAudit(data, function (result) {
            callback(result);
        });
    },
    //Audit Delete
    deleteAudit: (data, callback) => {
        AuditModels.deleteAudit(data, function (result) {
            callback(result);
        });
    },
    //Audit Details
    getAuditDetails: (data, callback) => {
        AuditModels.getAuditDetails(data, function (result) {
            callback(result);
        });
    },
    //Audit Edit
    editAudit: (data, callback) => {
        data.dueDate = '';
        if(data.enableTask==true){
            if(data.task.dueDate!=null && data.task.dueDate!='' && data.task.dueDate!=null){
                data.dueDate = data.task.dueDate;
            }
        }
        AuditModels.editAudit(data, function (result) {
            if (result.response_code == 200) {
                if(data.enableTask==true){
                    if(result.response_data.taskCount>0){
                        var taskData = {};
                        taskData = data.task;
                        TaskModels.editTask(taskData, function (result) {
                            callback(result);
                        });
                    } else {
                        var taskData = {};
                        taskData = data.task;
                        taskData.assignFor = 'audit';
                        taskData.assignId = result.response_data.parentAuditId;
                        taskData._id = data._id;
                        taskData.userId = data.userId;
                        taskData.companyId = data.companyId;
                        TaskModels.addTask(taskData, function (result) {
                            callback(result);
                        });
                    }
                } else {
                    callback(result);
                }
            } else {
                callback(result);
            }
        });
    },
    //My Audit List
    listMyAudit: (data, callback) => {
        AuditModels.listMyAudit(data, function (result) {
            callback(result);
        });
    },
    //Set AUdit Score
    setAuditScore: (data, callback) => {
        data._id = new ObjectID;
        AuditModels.setAuditScore(data, function (result) {
            callback(result);
        });
    },
    //Add qudit question comment
    addAuditQuestionComment: (data, callback) => {
        data._id = new ObjectID;
        AuditModels.addAuditQuestionComment(data, function (result) {
            callback(result);
        });
    },
    //Edit qudit question comment
    editAuditQuestionComment: (data, callback) => {
        AuditModels.editAuditQuestionComment(data, function (result) {
            callback(result);
        });
    },
    //Upload question attach file
    uploadQuestionAttach: (data, dataFile, callback) => {
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
                                var folderpath = config.uploadPlantPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (attach_ == true) {
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
                    AuditModels.uploadQuestionAttach(data, function (result) {
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
    //Delete question attach file
    deleteQuestionAttach: (data, callback) => {
        AuditModels.deleteQuestionAttach(data, function (result) {
            callback(result);
        });
    },
    //Audit cloase off
    closeOffAudit: (data, callback) => {
        AuditModels.closeOffAudit(data, function (result) {
            callback(result);
        });
    },
}
module.exports = auditService;