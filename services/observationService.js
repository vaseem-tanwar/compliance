'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
var baseUrl = config.baseUrl;

//======================MODELS============================
var ObservationModels = require('../models/observation');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================
var AccessSectionSchema = require('../schema/accessSection');

var apiService = {
    
    //get Environmental generate related data list
    environmentalRelatedDataList: (data, callback) => {
        ObservationModels.environmentalRelatedDataList(data, function (result) {
            callback(result);
        });
    },

    //environmental report generate
    generateEnviromentalReport: (data, dataFile, callback) => {
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
                            var folderpath = config.uploadObservationPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.plantPath + 'attachment/' + fileName,
                                        size: size,
                                        createdAt: new Date()
                                    }
                                    data.attachment.push(dataPush)
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
                    if (data.bccEmail != '') {
                        data.bccEmail = data.bccEmail.split(",");
                        var elist = [];
                        if (data.bccEmail.length > 0) {
                            for (var i = 0; i < data.bccEmail.length; i++) {
                                var resList = data.bccEmail[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.bccEmail = elist;
                        }
                    } else {
                        data.bccEmail = [];
                    }
                    ObservationModels.generateEnviromentalReport(data, function (result) {
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

    //get accident generate related data list
    accidentRelatedDataList: (data, callback) => {
        ObservationModels.accidentRelatedDataList(data, function (result) {
            callback(result);
        });
    },

    //Accident report generate
    generateAccidentReport: (data, dataFile, callback) => {
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
                            var folderpath = config.uploadObservationPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.observationPath + 'attachment/' + fileName,
                                        size: size,
                                        createdAt: new Date()
                                    }
                                    data.attachment.push(dataPush)
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
                    if (data.additionalInfo != '') {
                        data.additionalInfo=data.additionalInfo.split(",");
                    } else {
                        data.additionalInfo = [];
                    }
                    if (data.plant != '') {
                        data.plant = data.plant.split(",");
                    } else {
                        data.plant = [];
                    }
                    if (data.bccEmail != '') {
                        data.bccEmail = data.bccEmail.split(",");
                        var elist = [];
                        if (data.bccEmail.length > 0) {
                            for (var i = 0; i < data.bccEmail.length; i++) {
                                var resList = data.bccEmail[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.bccEmail = elist;
                        }
                    } else {
                        data.bccEmail = [];
                    }
                    ObservationModels.generateAccidentReport(data, function (result) {
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

    //get accident generate related data list
    setObservationDefination: (data, callback) => {
        data._id = new ObjectID;
        data.createdBy = 'company';
        ObservationModels.setObservationDefination(data, function (result) {
            callback(result);
        });
    },

    //get accident generate related data list
    listMyInvestigationAccident: (data, callback) => {
        ObservationModels.listMyInvestigationAccident(data, function (result) {
            callback(result);
        });
    },

    //List my investigation accident
    listAccidentRegistered: (data, callback) => {
        ObservationModels.listAccidentRegistered(data, function (result) {
            callback(result);
        });
    },

    //Accident report Details
    accidentReportDetails: (data, callback) => {
        ObservationModels.accidentReportDetails(data, function (result) {
            callback(result);
        });
    },
    
    //get accident generate related data list
    listMyInvestigationEnvironmental: (data, callback) => {
        ObservationModels.listMyInvestigationEnvironmental(data, function (result) {
            callback(result);
        });
    },

    //List my investigation accident
    listEnvironmentalRegistered: (data, callback) => {
        ObservationModels.listEnvironmentalRegistered(data, function (result) {
            callback(result);
        });
    },

    //Delete files of Observation
    deleteFileObservation: (data, callback) => {
        ObservationModels.deleteFileObservation(data, function (result) {
            callback(result);
        });
    },

    //Accident report form update
    editAccidentReport: (data, dataFile, callback) => {
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
                            var folderpath = config.uploadObservationPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.observationPath + 'attachment/' + fileName,
                                        size: size,
                                        createdAt: new Date()
                                    }
                                    data.attachment.push(dataPush)
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
                    if (data.additionalInfo != '') {
                        data.additionalInfo=data.additionalInfo.split(",");
                    } else {
                        data.additionalInfo = [];
                    }
                    if (data.plant != '') {
                        data.plant = data.plant.split(",");
                    } else {
                        data.plant = [];
                    }
                    if (data.causeA != '') {
                        data.causeA = data.causeA.split(",");
                    } else {
                        data.causeA = [];
                    }
                    if (data.investigator != '') {
                        data.investigator = data.investigator.split(",");
                        var elist = [];
                        if (data.investigator.length > 0) {
                            for (var i = 0; i < data.investigator.length; i++) {
                                var resList = data.investigator[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.investigator = elist;
                        }
                    } else {
                        data.investigator = [];
                    }
                    if (data.bccEmail != '') {
                        data.bccEmail = data.bccEmail.split(",");
                        var elist = [];
                        if (data.bccEmail.length > 0) {
                            for (var i = 0; i < data.bccEmail.length; i++) {
                                var resList = data.bccEmail[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.bccEmail = elist;
                        }
                    } else {
                        data.bccEmail = [];
                    }
                    ObservationModels.editAccidentReport(data, function (result) {
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

    //Environmental report Details
    environmentalReportDetails: (data, callback) => {
        ObservationModels.environmentalReportDetails(data, function (result) {
            callback(result);
        });
    },

    //environmental report update
    editEnvironmentalReport: (data, dataFile, callback) => {
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
                            var folderpath = config.uploadObservationPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.plantPath + 'attachment/' + fileName,
                                        size: size,
                                        createdAt: new Date()
                                    }
                                    data.attachment.push(dataPush)
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
                    if (data.investigator != '') {
                        data.investigator = data.investigator.split(",");
                        var elist = [];
                        if (data.investigator.length > 0) {
                            for (var i = 0; i < data.investigator.length; i++) {
                                var resList = data.investigator[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.investigator = elist;
                        }
                    } else {
                        data.investigator = [];
                    }
                    if (data.bccEmail != '') {
                        data.bccEmail = data.bccEmail.split(",");
                        var elist = [];
                        if (data.bccEmail.length > 0) {
                            for (var i = 0; i < data.bccEmail.length; i++) {
                                var resList = data.bccEmail[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.bccEmail = elist;
                        }
                    } else {
                        data.bccEmail = [];
                    }
                    ObservationModels.editEnvironmentalReport(data, function (result) {
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

    // Accident Action stage details
    accidentStageDetails: (data, callback) => {
        ObservationModels.accidentStageDetails(data, function (result) {
            callback(result);
        });
    },

    // Enviromental Action stage details
    environmentalStageDetails: (data, callback) => {
        ObservationModels.environmentalStageDetails(data, function (result) {
            callback(result);
        });
    },

    //get NCR generate related data list
    ncrRelatedDataList: (data, callback) => {
        ObservationModels.ncrRelatedDataList(data, function (result) {
            callback(result);
        });
    },

    //environmental report generate
    generateNcrReport: (data, dataFile, callback) => {
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
                            var folderpath = config.uploadObservationPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.plantPath + 'attachment/' + fileName,
                                        size: size,
                                        createdAt: new Date()
                                    }
                                    data.attachment.push(dataPush)
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
                    if (data.bccEmail != '') {
                        data.bccEmail = data.bccEmail.split(",");
                        var elist = [];
                        if (data.bccEmail.length > 0) {
                            for (var i = 0; i < data.bccEmail.length; i++) {
                                var resList = data.bccEmail[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.bccEmail = elist;
                        }
                    } else {
                        data.bccEmail = [];
                    }
                    ObservationModels.generateNcrReport(data, function (result) {
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

    //List  registered ncr
    listNcrRegistered: (data, callback) => {
        ObservationModels.listNcrRegistered(data, function (result) {
            callback(result);
        });
    },

    // NCR Action stage details
    ncrStageDetails: (data, callback) => {
        ObservationModels.ncrStageDetails(data, function (result) {
            callback(result);
        });
    },
    
    //get ncr generate related data list
    listMyInvestigationNcr: (data, callback) => {
        ObservationModels.listMyInvestigationNcr(data, function (result) {
            callback(result);
        });
    },

    //NCR report Details
    ncrReportDetails: (data, callback) => {
        ObservationModels.ncrReportDetails(data, function (result) {
            callback(result);
        });
    },

    //NCR report update
    editNcrReport: (data, dataFile, callback) => {
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
                            var folderpath = config.uploadObservationPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.plantPath + 'attachment/' + fileName,
                                        size: size,
                                        createdAt: new Date()
                                    }
                                    data.attachment.push(dataPush)
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
                    if (data.investigator != '') {
                        data.investigator = data.investigator.split(",");
                        var elist = [];
                        if (data.investigator.length > 0) {
                            for (var i = 0; i < data.investigator.length; i++) {
                                var resList = data.investigator[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.investigator = elist;
                        }
                    } else {
                        data.investigator = [];
                    }
                    if (data.bccEmail != '') {
                        data.bccEmail = data.bccEmail.split(",");
                        var elist = [];
                        if (data.bccEmail.length > 0) {
                            for (var i = 0; i < data.bccEmail.length; i++) {
                                var resList = data.bccEmail[i];
                                resList = resList.split("-");
                                elist[i] = {
                                    userId: resList[0],
                                    userType: resList[1],
                                    _id: new ObjectID
                                }
                            }
                            data.bccEmail = elist;
                        }
                    } else {
                        data.bccEmail = [];
                    }
                    ObservationModels.editNcrReport(data, function (result) {
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
module.exports = apiService;