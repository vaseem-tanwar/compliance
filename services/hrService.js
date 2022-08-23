'use strict';
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;

//======================MODELS============================
var UserModels = require('../models/user');
var HrModels = require('../models/hr');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var hrService = {
    
    //add Employee
    addEmployee: (data, dataFile, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (!data.userId || typeof data.userId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company user id", "response_data": {} });
                } else if (!data.companyId || typeof data.companyId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company id", "response_data": {} });
                } else {
                    nextCb(null, { "response_code": 200, "response_message": "Success", "response_data": {} });
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    data.profileImage = '';
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
                                var folderpath = config.uploaHRPath + 'images/';
                            } else if (attach_ == true) {
                                var folderpath = config.uploaHRPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (images_ == true) {
                                        data.profileImage = config.hrtPath + 'images/' + fileName;
                                    } else if (attach_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.hrtPath + 'attachment/' + fileName,
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
                    HrModels.addEmployee(data, function (result) {
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

    //Employee related data list
    employeeDataList: (data, callback) => {
        HrModels.employeeDataList(data, function (result) {
            callback(result);
        });
    },

    //Employee list
    listEmployee: (data, callback) => {
        HrModels.listEmployee(data, function (result) {
            callback(result);
        });
    },

    //Employee Active list
    listActiveEmployee: (data, callback) => {
        HrModels.listActiveEmployee(data, function (result) {
            callback(result);
        });
    },

    //Employee status change
    employeeStatusChange: (data, callback) => {
        HrModels.employeeStatusChange(data, function (result) {
            callback(result);
        });
    },

    //Delete Employee
    deleteEmployee: (data, callback) => {
        HrModels.deleteEmployee(data, function (result) {
            callback(result);
        });
    },

    //Details Employee
    getEmployeeDetails: (data, callback) => {
        HrModels.getEmployeeDetails(data, function (result) {
            callback(result);
        });
    },

    //Delete files of employee
    deleteFileEmployee: (data, callback) => {
        HrModels.deleteFileEmployee(data, function (result) {
            callback(result);
        });
    },

    //Edit employee
    editEmployee: (data, dataFile, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (!data.userId || typeof data.userId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company user id", "response_data": {} });
                } else if (!data.companyId || typeof data.companyId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company id", "response_data": {} });
                } else {
                    nextCb(null, { "response_code": 200, "response_message": "Success", "response_data": {} });
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    data.profileImage = '';
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
                                var folderpath = config.uploaHRPath + 'images/';
                            } else if (attach_ == true) {
                                var folderpath = config.uploaHRPath + 'attachment/';
                            }
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    if (images_ == true) {
                                        data.profileImage = config.hrtPath + 'images/' + fileName;
                                    } else if (attach_ == true) {
                                        var dataPush = {
                                            _id: new ObjectID,
                                            name: originalName,
                                            path: config.hrtPath + 'attachment/' + fileName,
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
                    HrModels.editEmployee(data, function (result) {
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

    //Employee access right details
    employeeAccessDetails: (data, callback) => {
        HrModels.employeeAccessDetails(data, function (result) {
            callback(result);
        });
    },

    //Employee access right details
    editEmployeeLoginDetails: (data, callback) => {
        data._id = new ObjectID;
        HrModels.editEmployeeLoginDetails(data, function (result) {
            callback(result);
        });
    },

    //Employee access right details
    editEmployeeAccessRight: (data, callback) => {
        data._id = new ObjectID;
        HrModels.editEmployeeAccessRight(data, function (result) {
            callback(result);
        });
    },

    //All user type list
    listAllUser: (data, callback) => {
        UserModels.listAllUser(data, function (result) {
            callback(result);
        });
    },
    
    //set skill attachment
    setSkillAttachment: (data, dataFile, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (!data.userId || typeof data.userId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company user id", "response_data": {} });
                } else {
                    nextCb(null, { "response_code": 200, "response_message": "Success", "response_data": {} });
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
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
                            var folderpath = config.uploaHRPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.hrtPath + 'attachment/' + fileName,
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
                    data.createdBy = 'company';
                    HrModels.setSkillAttachment(data, function (result) {
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

    //Skill Related data list
    skillRelatedDataList: (data, callback) => {
        HrModels.skillRelatedDataList(data, function (result) {
            callback(result);
        });
    },

    //Add Employee SKill
    addEmployeeSkill: (data, callback) => {
        data._id = new ObjectID;
        HrModels.addEmployeeSkill(data, function (result) {
            callback(result);
        });
    },

    //List Employee SKill/Qualification
    employeeSkillQualificationList: (data, callback) => {
        HrModels.employeeSkillQualificationList(data, function (result) {
            callback(result);
        });
    },

    //Delete files of employee skill attachement
    deletefileSkillAttachment: (data, callback) => {
        HrModels.deletefileSkillAttachment(data, function (result) {
            callback(result);
        });
    },

    //Delete Employee skill
    deleteEmployeeSkill: (data, callback) => {
        HrModels.deleteEmployeeSkill(data, function (result) {
            callback(result);
        });
    },

    //Details Employee skill
    detailsEmployeeSkill: (data, callback) => {
        HrModels.detailsEmployeeSkill(data, function (result) {
            callback(result);
        });
    },

    //Edit Employee skill
    editEmployeeSkill: (data, callback) => {
        HrModels.editEmployeeSkill(data, function (result) {
            callback(result);
        });
    },

    //Add Employee Qualification
    addEmployeeQualification: (data, callback) => {
        data._id = new ObjectID;
        HrModels.addEmployeeQualification(data, function (result) {
            callback(result);
        });
    },

    //Edit Employee Qualification
    editEmployeeQualification: (data, callback) => {
        HrModels.editEmployeeQualification(data, function (result) {
            callback(result);
        });
    },

    //Delete Employee Qualification
    deleteEmployeeQualification: (data, callback) => {
        HrModels.deleteEmployeeQualification(data, function (result) {
            callback(result);
        });
    },
}
module.exports = hrService;