var express = require("express");
var bcrypt = require('bcrypt');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var config = require('../config');
var jwt = require('jsonwebtoken');
var randomize = require('randomatic');
var fs = require('fs');
var secretKey = config.secretKey;
//======================MODELS============================
var AdminModel = require('../models/admin');
var CompanyModel = require('../models/company');
var UserModel = require('../models/user');
var HrModels = require('../models/hr');
var SetupModels = require('../models/setup');
var PlantModels = require('../models/asset');
var ObservationModels = require('../models/observation');
var SetupModels = require('../models/setup');
//======================Schema============================
var Admin = require('../schema/admin');
//======================Module============================
var mailProperty = require('../modules/sendMail');
const e = require("express");



var adminService = {
    jwtAuthVerification: (token, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (token == null || token == undefined || token == '') {
                    nextCb(null, { response_code: 502, response_message: "No token provided." });
                } else {
                    nextCb(null, { response_code: 200 })
                }
            },
            function (arg1, nextCb) {
                if (arg1.response_code == 200) {
                    jwt.verify(token, secretKey, function (err, decoded) {
                        if (err) {
                            nextCb(null, {
                                response_code: 402,
                                response_message: "Session timeout! Please login again.",
                                response_data: null
                            });
                        }
                        if (!err) {
                            nextCb(null, {
                                response_code: 200,
                                response_message: "Authenticate successfully.",
                                response_data: decoded
                            });
                        }
                    });
                } else {
                    nextCb(null, arg1);
                }
            }
        ], function (err, content) {
            if (err) {
                callback({
                    "response_code": 5005,
                    "response_message": "INTERNAL DB ERROR",
                    "response_data": {}
                })
            } else {
                callback(content);
            }
        });
    },
    adminSignup: function (adminData, callback) {
        _async.waterfall([
            function (nextcb) {       //checking email existance
                var cError1 = "";
                Admin.findOne({ email: adminData.email }, function (err, admindet) {
                    if (err)
                        nextcb(err);
                    else {
                        if (admindet) {
                            cError1 = "email already taken";
                        }
                        nextcb(null, cError1);
                    }
                });
            },
            function (cError1, nextcb) {    //updating admin's data
                if (cError1) {
                    nextcb(null, cError1);
                } else {
                    var admin = new Admin(adminData);
                    admin.save(function (err) {
                        if (err) {
                            nextcb(err);
                        } else {
                            nextcb(null, cError1);
                        }
                    });
                }
            }

        ], function (err, cError) {
            if (err) {
                callback({ response_message: "some internal error has occurred" });
            } else if (cError != "") {
                callback({ response_message: cError });
            } else {
                callback({ response_message: "Admin saved successfully" })
            }
        });
    },
    adminLogin: function (adminData, callback) {
        if (adminData.email && adminData.password) {
            AdminModel.adminLogin(adminData, function (content) {
                callback(content)
            })
        } else {
            callback(content);
        }
    },
    forgotpassLinksend: (adminData, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (!adminData.email || typeof adminData.email === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "please provide user email", "response_data": {} });
                }
                else {
                    nextCb(null, { "response_code": 200, });
                }
            },
            function (arg2, nextCb) {
                if (arg2.response_code === 502) {
                    nextCb(null, arg2);
                }
                if (arg2.response_code === 5005) {
                    nextCb(null, arg2);
                }
                if (arg2.response_code === 200) {
                    var random = randomize('A0', 6);
                    const saltRounds = 10;
                    bcrypt.hash(random, saltRounds, function (err, hash) {
                        if (err) {
                            nextCb(null, {
                                response_code: 5005,
                                response_message: "Internal server error",
                                response_data: err
                            });
                        } else {
                            Admin.findOne({ email: adminData.email }, function (err, admindet) {
                                if (err) {
                                    nextCb(null, {
                                        response_code: 400,
                                        response_message: "Invalid Email",
                                        response_data: err
                                    });
                                } else {
                                    if (admindet != null) {
                                        var new_password = hash;
                                        var conditions = { _id: admindet._id },
                                            fields = { password: new_password },
                                            options = { upsert: false };
                                        Admin.updateOne(conditions, fields, options, function (err, affected) {
                                            if (err) {
                                                nextCb(null, {
                                                    response_code: 5005,
                                                    response_message: "Internal server error",
                                                    response_data: err
                                                });
                                            } else {
                                                mailProperty('forgotPasswordMail')(adminData.email, {
                                                    password: random,
                                                    date: new Date(),
                                                    logo: config.apiUrl + '' + config.siteConfig.LOGO,
                                                    header_color: config.siteConfig.HEADERCOLOR,
                                                    footer_color: config.siteConfig.FOOTERCOLOR,
                                                    site_name: config.siteConfig.SITENAME
                                                }).send();
                                                nextCb(null, {
                                                    response_code: 200,
                                                    response_message: "New password will be sent to your mail.",
                                                })
                                            }
                                        });
                                    } else {
                                        nextCb(null, {
                                            response_code: 400,
                                            response_message: "Invalid Email"
                                        })
                                    }
                                }
                            });
                        }
                    });
                }
            }
        ], function (err, content) {
            if (err) {
                callback({
                    "response_code": 5005,
                    "response_message": "INTERNAL DB ERROR",
                    "response_data": {}
                })
            } else {
                callback(content)
            }
        })
    },
    adminChangePassword: function (adminData, callback) {
        if (adminData.password && adminData.repassword) {
            if (adminData.password != adminData.repassword) {
                callback({
                    response_code: 500,
                    response_message: "Password and repassword must be same",
                    response_data: {}
                });
            } else {
                Admin.findOne({ email: adminData.useremail })
                    .select('_id email password')
                    .exec(function (err, loginRes) {
                        if (loginRes === null) {
                            callback({
                                response_code: 400,
                                response_message: "User doesn't exist",
                                response_data: {}
                            });
                        } else {
                            const saltRounds = 10;
                            bcrypt.hash(adminData.repassword, saltRounds, function (e, hash) {
                                if (e) {
                                    callback({
                                        response_code: 400,
                                        response_message: "Internal server error"
                                    });

                                } else {
                                    var new_password = hash;
                                    var conditions = { _id: loginRes._id },
                                        fields = { password: new_password },
                                        options = { upsert: false };
                                    Admin.updateOne(conditions, fields, options, function (err, affected) {
                                        if (err) {
                                            callback({
                                                response_code: 400,
                                                response_message: "Internal server error"
                                            });

                                        } else {
                                            callback({
                                                response_code: 200,
                                                response_message: "Password Update successfully",
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
            }
        } else {
            callback({
                response_code: 5000,
                response_message: "Insufficient information provided for user login",
                response_data: {}
            });
        }
    },
    getCompanyList: function (data, callback) {
        CompanyModel.getCompanyList(data, function (content) {
            callback(content);
        });
    },
    addCompany: function (data, fileData, callback) {
        _async.waterfall([
            function (nextCb) {
                data._id = new ObjectID;
                data.logo = 'images/no-img.png';
                var random = randomize('A0', 6);
                data.password = random;
                if (fileData != undefined && fileData != null && fileData != '') {
                    var pic = fileData.filename;
                    var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                    var fileName = Date.now() + ext;
                    var folderpath = config.uploadProfilePath;
                    pic.mv(folderpath + fileName, function (err) {
                        if (!err) {
                            data.logo = config.profilePath + fileName;
                            nextCb(null, data);
                        } else {
                            nextCb(null, data);
                        }
                    });
                } else {
                    nextCb(null, data);
                }

            }, function (arg, nextCb) {
                CompanyModel.addCompany(data, function (result) {
                    if(result.response_code==200){
                        mailProperty('CompanyRegistrationMail')(data.email, {
                            userName: data.userName,
                            password: data.password,
                            weblink: config.webUrl,
                            date: new Date(),
                            year: new Date().getFullYear(),
                            logo: config.apiUrl + '' + config.siteConfig.LOGO,
                            header_color: config.siteConfig.HEADERCOLOR,
                            footer_color: config.siteConfig.FOOTERCOLOR,
                            site_name: config.siteConfig.SITENAME
                        }).send();
                    }
                    nextCb(null, result);
                })
            },
        ], function (err, content) {
            if (err) {
                callback({
                    response_code: 5005,
                    response_message: "Internal server error",
                    response_data: err
                });
            } else {
                callback(content)
            }
        })



    },
    userStatusChange: function (data, callback) {
        UserModel.userStatusChange(data, function (content) {
            callback(content);
        });
    },
    getCompanyDetails: function (data, callback) {
        CompanyModel.getCompanyDetails(data, function (content) {
            callback(content);
        });
    },
    editCompany: function (data, fileData, callback) {
        _async.waterfall([
            function (nextCb) {
                data.logo = '';
                if (fileData != undefined && fileData != null && fileData != '') {
                    var pic = fileData.filename;
                    var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                    var fileName = Date.now() + ext;
                    var folderpath = config.uploadProfilePath;
                    pic.mv(folderpath + fileName, function (err) {
                        if (!err) {
                            data.logo = config.profilePath + fileName;
                            nextCb(null, data);
                        } else {
                            nextCb(null, data);
                        }
                    });
                } else {
                    nextCb(null, data);
                }

            }, function (arg, nextCb) {
                CompanyModel.editCompany(data, function (result) {
                    nextCb(null, result);
                })
            },
        ], function (err, content) {
            if (err) {
                callback({
                    response_code: 5005,
                    response_message: "Internal server error",
                    response_data: err
                });
            } else {
                callback(content)
            }
        })
    },

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

    //list accesssection
    listAccessSection: (callback) => {
        SetupModels.listAccessSection(function (result) {
            callback(result);
        });
    },

    //Employee access right details
    employeeAccessDetails: (data, callback) => {
        HrModels.employeeAccessDetails(data, function (result) {
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
    //List Employee SKill
    employeeSkillList: (data, callback) => {
        HrModels.employeeSkillList(data, function (result) {
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
    //Details Employee skill
    editEmployeeSkill: (data, callback) => {
        HrModels.editEmployeeSkill(data, function (result) {
            callback(result);
        });
    },
    //Plant related data list
    plantDataList: (data, callback) => {
        PlantModels.plantDataList(data, function (result) {
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
                    PlantModels.addPlant(data, function (result) {
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
        PlantModels.listPlant(data, function (result) {
            callback(result);
        });
    },
    //Plant status change
    plantStatusChange: (data, callback) => {
        PlantModels.plantStatusChange(data, function (result) {
            callback(result);
        });
    },
    //Delete Plant
    deletePlant: (data, callback) => {
        PlantModels.deletePlant(data, function (result) {
            callback(result);
        });
    },
    // Plant Details
    getPlantDetails: (data, callback) => {
        PlantModels.getPlantDetails(data, function (result) {
            callback(result);
        });
    },
    //Delete files of Plants
    deleteFilePlant: (data, callback) => {
        PlantModels.deleteFilePlant(data, function (result) {
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
                    PlantModels.editPlant(data, function (result) {
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
    // Data Entry related data list
    dataEntryDataList: (data, callback) => {
        PlantModels.dataEntryDataList(data, function (result) {
            callback(result);
        });
    },
    //add plant Data Entry
    addPlantDataEntry: (data, dataFile, callback) => {
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
                            var folderpath = config.uploadPlantPath + 'attachment/';
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
                    PlantModels.addPlantDataEntry(data, function (result) {
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
    //Plant data entry list
    listPlantDataEntry: (data, callback) => {
        PlantModels.listPlantDataEntry(data, function (result) {
            callback(result);
        });
    },
    //edit plant data entry
    editPlantDataEntry: (data, dataFile, callback) => {
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
                            var folderpath = config.uploadPlantPath + 'attachment/';
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
                    PlantModels.editPlantDataEntry(data, function (result) {
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
    // Plant data entry Details
    getPlantDataEntryDetails: (data, callback) => {
        PlantModels.getPlantDataEntryDetails(data, function (result) {
            callback(result);
        });
    },
    //Delete files of Plant data
    deletefileDataEntry: (data, callback) => {
        PlantModels.deletefileDataEntry(data, function (result) {
            callback(result);
        });
    },

    //List my investigation accident
    listAccidentRegistered: (data, callback) => {
        ObservationModels.listAccidentRegistered(data, function (result) {
            callback(result);
        });
    },

    // Accident Action stage details
    accidentStageDetails: (data, callback) => {
        ObservationModels.accidentStageDetails(data, function (result) {
            callback(result);
        });
    },

    //get accident generate related data list
    accidentRelatedDataList: (data, callback) => {
        ObservationModels.accidentRelatedDataList(data, function (result) {
            callback(result);
        });
    },

    //Accident report Details
    accidentReportDetails: (data, callback) => {
        ObservationModels.accidentReportDetails(data, function (result) {
            callback(result);
        });
    },

    //list Code
    listCode: (data, callback) => {
        SetupModels.listCode(data, function (result) {
            callback(result);
        });
    },

    //List my investigation accident
    listEnvironmentalRegistered: (data, callback) => {
        ObservationModels.listEnvironmentalRegistered(data, function (result) {
            callback(result);
        });
    },

    // Accident Action stage details
    environmentalStageDetails: (data, callback) => {
        ObservationModels.environmentalStageDetails(data, function (result) {
            callback(result);
        });
    },

    //get Environmental generate related data list
    environmentalRelatedDataList: (data, callback) => {
        ObservationModels.environmentalRelatedDataList(data, function (result) {
            callback(result);
        });
    },

    //Environmental report Details
    environmentalReportDetails: (data, callback) => {
        ObservationModels.environmentalReportDetails(data, function (result) {
            callback(result);
        });
    },
};
module.exports = adminService;