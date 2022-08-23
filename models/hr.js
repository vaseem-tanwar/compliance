var workplaceSchema = require('../schema/workplace');
var positionSchema = require('../schema/position');
var employeeSchema = require('../schema/employee');
var addressSchema = require('../schema/address');
var userSchema = require('../schema/user');
var employeeAccessSchema = require('../schema/employeeAccess');
var accessProfileSchema = require('../schema/accessProfile');
var employeeSkillAttachmentSchema = require('../schema/employeeSkillAttachment');
var accessorSchema = require('../schema/accessor');
var supplierSchema = require('../schema/supplier');
var skillSchema = require('../schema/skill');
var competencyLevelSchema = require('../schema/competencyLevel');
var employeeSkillSchema = require('../schema/employeeSkill');
var employeeQualificationSchema = require('../schema/employeeQualification');
var employeeAccessRestrictionSchema = require('../schema/employeeAccessRestriction');

var fs = require('fs');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var _async = require("async");

var HrModels = {
    addEmployee: function (data, callback) {
        if (data) {
            new employeeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (data.address != null && data.address != '' && data.address != undefined) {
                        data.sourceId = result._id;
                        data.sourceType = 'employee';
                        new addressSchema(data).save()
                    }
                    callback({
                        "response_code": 200,
                        "response_message": "Employee added.",
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
    employeeDataList: function (data, callback) {
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
                position: function (CallBack) {
                    positionSchema.aggregate([
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
                user: function (CallBack) {
                    employeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
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
    listEmployee: function (data, callback) {
        if (data) {
            if (data.statusType == 'all') {
                var match = {
                    isDelete: 'no',
                    companyId: data.companyId
                }
            } else if (data.statusType == 'yes') {
                var match = {
                    isDelete: 'no',
                    isActive: 'yes',
                    companyId: data.companyId
                }
            } else if (data.statusType == 'no') {
                var match = {
                    isDelete: 'no',
                    isActive: 'no',
                    companyId: data.companyId
                }
            }
            employeeSchema.aggregate([
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
                        from: "positions",
                        localField: "position",
                        foreignField: "_id",
                        as: "Position"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        profileImage: 1,
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        profileImage: 1,
                        position: '$Position',
                        branch: '$Branch',
                        workplace: '$Workplace',
                        isActive: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: { firstName: 1 }
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
                                if (item.profileImage != '' && item.profileImage != null && item.profileImage != undefined) {
                                    item.profileImage = config.apiUrl + '' + item.profileImage;
                                } else {
                                    item.profileImage = config.apiUrl + 'images/no-img.png';
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
                                if (item.position.length > 0) {
                                    result[i].position = item.position[0].name;
                                } else {
                                    result[i].position = '';
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
    listActiveEmployee: function (data, callback) {
        if (data) {
            var match = {
                isDelete: 'no',
                isActive: 'yes',
                companyId: data.companyId
            }
            employeeSchema.aggregate([
                {
                    $match: match
                },
                {
                    $project: {
                        _id: 1,
                        name: { $concat: ["$firstName", " ", "$lastName"] }
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
    employeeStatusChange: function (data, callback) {
        if (data) {
            employeeSchema.updateOne(
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
    deleteEmployee: function (data, callback) {
        if (data) {
            employeeSchema.updateOne(
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
                            "response_message": "Employee deleted.",
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
    getEmployeeDetails: function (data, callback) {
        if (data) {
            employeeSchema.aggregate([
                {
                    $match: {
                        _id: data.employeeId
                    }
                },
                {
                    $lookup:
                    {
                        from: "addresses",
                        localField: "_id",
                        foreignField: "sourceId",
                        as: "AddressDetails"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        profileImage: 1,
                        employeeNumber: 1,
                        firstName: 1,
                        lastName: 1,
                        branch: 1,
                        workplace: 1,
                        phone: 1,
                        mobile: 1,
                        email: 1,
                        position: 1,
                        reportTo: 1,
                        startDate: 1,
                        dob: 1,
                        attachment: 1,
                        privateInfo: 1,
                        createdAt: 1,
                        AddressDetails: '$AddressDetails',
                    }
                }], function (err, result) {

                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        result.address = '';
                        if (result.length > 0) {
                            result = result[0];
                            if (result.AddressDetails != null && result.AddressDetails != undefined && result.AddressDetails != '') {
                                if (result.AddressDetails.length > 0) {
                                    result.address = result.AddressDetails[0].address;
                                }
                            }
                        }
                        delete result.AddressDetails;
                        callback({
                            "response_code": 200,
                            "response_message": "Employee Details.",
                            "response_data": {
                                details: result,
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
    deleteFileEmployee: function (data, callback) {
        if (data) {
            if (data.fileType == 'image') {
                employeeSchema.findOne(
                    { _id: data._id },
                    { profileImage: 1 },
                    function (err, result) {
                        if (err) {
                            callback({
                                "response_code": 505,
                                "response_message": "INTERNAL DB ERROR",
                                "response_data": {}
                            });
                        } else {
                            employeeSchema.updateOne(
                                {
                                    _id: data._id
                                },
                                {
                                    $set: { profileImage: '' }
                                },
                                function (err, resDel) {
                                    if (err) {
                                        callback({
                                            "response_code": 505,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        fs.unlinkSync('public/' + result.profileImage)
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
                employeeSchema.findOne(
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
                            employeeSchema.updateOne(
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
    editEmployee: function (data, callback) {
        if (data) {
            if (data.startDate == undefined || data.startDate == 'null') {
                data.startDate = null;
            }
            if (data.dob == undefined || data.dob == 'null') {
                data.dob = null;
            }
            employeeSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        employeeNumber: data.employeeNumber,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        branch: data.branch,
                        workplace: data.workplace,
                        phone: data.phone,
                        mobile: data.mobile,
                        email: data.email,
                        position: data.position,
                        reportTo: data.reportTo,
                        startDate: data.startDate,
                        dob: data.dob,
                        privateInfo: data.privateInfo
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (data.profileImage != '' && data.profileImage != null && data.profileImage != undefined) {
                            await employeeSchema.updateOne(
                                { _id: data._id },
                                { $set: { profileImage: data.profileImage } })
                        }
                        if (data.attachment.length > 0) {
                            for (var a = 0; a < data.attachment.length; a++) {
                                await employeeSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { attachment: data.attachment[a] } })
                            }
                        }
                        await addressSchema.deleteOne({ sourceId: data._id });
                        if (data.address != null && data.address != '' && data.address != undefined) {
                            data.sourceId = data._id;
                            data.sourceType = 'employee';
                            await new addressSchema(data).save()
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
    employeeAccessDetails: function (data, callback) {
        if (data) {
            var accessList = config.accessList;;
            userSchema.findOne(
                {
                    employeeId: data.employeeId
                },
                {
                    userName: 1,
                    isActive: 1
                }, async function (err, userRes) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        var loginUserName = '';
                        var loginIsActive = 'yes';
                        if (userRes != null) {
                            if (userRes.userName != '' && userRes.userName != null && userRes.userName != undefined) {
                                loginUserName = userRes.userName;
                            }
                            if (userRes.isActive != '' && userRes.isActive != null && userRes.isActive != undefined) {
                                loginIsActive = userRes.isActive;
                            }
                        }
                        var restrictionDetails = await employeeAccessRestrictionSchema.findOne(
                            { employeeId: data.employeeId }, { accessRestriction: 1 });
                        if (restrictionDetails != null) {
                            var accessRestriction = restrictionDetails.accessRestriction;
                            for (var i = 0; i < accessList.length; i++) {
                                if (accessRestriction[i] != null && accessRestriction[i] != '' && accessRestriction[i] != undefined) {
                                    accessList[i].isAccess = accessRestriction[i].isAccess;
                                }
                            }
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "Details.",
                            "response_data": {
                                username: loginUserName,
                                isActive: loginIsActive,
                                accessRestriction: accessList
                            }
                        });

                    }
                }
            )
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    // employeeAccessDetails: function (data, callback) {
    //     if (data) {
    //         userSchema.findOne(
    //             {
    //                 employeeId: data.employeeId
    //             },
    //             {
    //                 userName: 1,
    //                 isActive: 1
    //             }, async function (err, userRes) {
    //                 if (err) {
    //                     callback({
    //                         "response_code": 505,
    //                         "response_message": "INTERNAL DB ERROR",
    //                         "response_data": {}
    //                     });
    //                 } else {
    //                     var loginUserName = '';
    //                     var loginIsActive = 'yes';
    //                     if (userRes != null) {
    //                         if (userRes.userName != '' && userRes.userName != null && userRes.userName != undefined) {
    //                             loginUserName = userRes.userName;
    //                         }
    //                         if (userRes.isActive != '' && userRes.isActive != null && userRes.isActive != undefined) {
    //                             loginIsActive = userRes.isActive;
    //                         }
    //                     }
    //                     employeeAccessSchema.aggregate([
    //                         {
    //                             $match: {
    //                                 employeeId: data.employeeId
    //                             }
    //                         },
    //                         {
    //                             $lookup:
    //                             {
    //                                 from: "accessprofiles",
    //                                 localField: "accessId",
    //                                 foreignField: "_id",
    //                                 as: "AccessProfile"
    //                             }
    //                         },
    //                         {
    //                             $unwind: {
    //                                 path: "$AccessProfile",
    //                                 preserveNullAndEmptyArrays: false
    //                             }
    //                         },
    //                         {
    //                             $project: {
    //                                 _id: 0,
    //                                 accessId: 1,
    //                                 accessProfile: 1,
    //                                 accessName: '$AccessProfile.name'
    //                             }
    //                         }
    //                     ], function (err, accessRes) {
    //                         if (err) {
    //                             callback({
    //                                 "response_code": 505,
    //                                 "response_message": "INTERNAL DB ERROR",
    //                                 "response_data": {}
    //                             });
    //                         } else {
    //                             if (accessRes.length > 0) {
    //                                 callback({
    //                                     "response_code": 200,
    //                                     "response_message": "Details.",
    //                                     "response_data": {
    //                                         username: loginUserName,
    //                                         isActive: loginIsActive,
    //                                         accessDetails: accessRes[0],
    //                                         accessList: []
    //                                     }
    //                                 });
    //                             } else {
    //                                 accessProfileSchema.find(
    //                                     {
    //                                         companyId: data.companyId
    //                                     },
    //                                     {
    //                                         name: 1, accessProfile: 1
    //                                     }, function (err, accessRes) {
    //                                         if (err) {
    //                                             callback({
    //                                                 "response_code": 505,
    //                                                 "response_message": "INTERNAL DB ERROR",
    //                                                 "response_data": {}
    //                                             });
    //                                         } else {
    //                                             callback({
    //                                                 "response_code": 200,
    //                                                 "response_message": "Details.",
    //                                                 "response_data": {
    //                                                     username: loginUserName,
    //                                                     isActive: loginIsActive,
    //                                                     accessDetails: {},
    //                                                     accessList: accessRes
    //                                                 }
    //                                             });
    //                                         }
    //                                     })
    //                             }
    //                         }
    //                     })
    //                 }
    //             }
    //         )
    //     } else {
    //         callback({
    //             "response_code": 502,
    //             "response_message": "Please provide required information.",
    //             "response_data": {}
    //         });
    //     }
    // },

    editEmployeeLoginDetails: function (data, callback) {
        if (data) {
            userSchema.findOne(
                {
                    employeeId: data.employeeId,
                    companyId: data.companyId
                },
                {
                    _id: 1,
                    userName: 1,
                    isActive: 1,
                    password: 1
                }, async function (err, findRes) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (findRes != null) {
                            var userNameCount = await userSchema.countDocuments(
                                { _id: { $ne: findRes._id }, userName: data.userName })
                            if (userNameCount > 0) {
                                callback({
                                    "response_code": 502,
                                    "response_message": "Username already exists in our database.",
                                    "response_data": {}
                                });
                            }
                        } else {
                            var userNameCount = await userSchema.countDocuments(
                                { userName: data.userName })
                            if (userNameCount > 0) {
                                callback({
                                    "response_code": 502,
                                    "response_message": "Username already exists in our database.",
                                    "response_data": {}
                                });
                            }
                        }
                        if (findRes != null) {
                            data._id = findRes._id;

                        }
                        if (data.password != '' && data.password != null && data.password != undefined) {
                            const saltRounds = 10;
                            var hasPass = await bcrypt.hash(data.password, saltRounds);
                            data.password = hasPass;
                        } else {
                            if (findRes != null) {
                                data.password = findRes.password;
                            } else {
                                data.password = '';
                            }
                        }
                        var updateData = {
                            _id: data._id,
                            userName: data.userName,
                            password: data.password,
                            userType: 'employee',
                            isActive: data.isActive,
                            isDelete: 'no',
                            appType: data.appType,
                            deviceToken: '',
                            authToken: ''
                        }
                        userSchema.updateOne(
                            {
                                employeeId: data.employeeId,
                                companyId: data.companyId
                            },
                            {
                                $set: updateData
                            },
                            {
                                upsert: true
                            }, async function (err, updateRes) {
                                if (err) {
                                    callback({
                                        "response_code": 505,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    callback({
                                        "response_code": 200,
                                        "response_message": "Data updated.",
                                        "response_data": {}
                                    });
                                }
                            }
                        )

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

    editEmployeeAccessRight: async function (data, callback) {
        if (data) {
            console.log('data', data)
            var findRes = await employeeAccessRestrictionSchema.findOne(
                {
                    employeeId: data.employeeId,
                    companyId: data.companyId
                },
                {
                    _id: 1
                });
            if (findRes != null) {
                data._id = findRes._id;
            }
            employeeAccessRestrictionSchema.updateOne(
                {
                    employeeId: data.employeeId,
                    companyId: data.companyId
                },
                {
                    $set: {
                        _id: data._id,
                        accessRestriction: data.accessRestriction
                    }
                }, {
                upsert: true
            }, async function (err, res) {
                console.log('err', err)
                console.log('res', res)
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data updated.",
                        "response_data": {}
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

    // editEmployeeAccessRight: function (data, callback) {
    //     if (data) {
    //         userSchema.findOne(
    //             {
    //                 employeeId: data.employeeId,
    //                 companyId: data.companyId
    //             },
    //             {
    //                 _id: 1,
    //                 userName: 1,
    //                 isActive: 1,
    //                 password: 1
    //             }, async function (err, findRes) {
    //                 if (err) {
    //                     callback({
    //                         "response_code": 505,
    //                         "response_message": "INTERNAL DB ERROR",
    //                         "response_data": {}
    //                     });
    //                 } else {
    //                     if (findRes != null) {
    //                         var userNameCount = await userSchema.countDocuments(
    //                             { _id: { $ne: findRes._id }, userName: data.userName })
    //                         if (userNameCount > 0) {
    //                             callback({
    //                                 "response_code": 502,
    //                                 "response_message": "Username already exists in our database.",
    //                                 "response_data": {}
    //                             });
    //                         }
    //                     } else {
    //                         var userNameCount = await userSchema.countDocuments(
    //                             { userName: data.userName })
    //                         if (userNameCount > 0) {
    //                             callback({
    //                                 "response_code": 502,
    //                                 "response_message": "Username already exists in our database.",
    //                                 "response_data": {}
    //                             });
    //                         }
    //                     }
    //                     if (findRes != null) {
    //                         data._id = findRes._id;

    //                     }
    //                     if (data.password != '' && data.password != null && data.password != undefined) {
    //                         const saltRounds = 10;
    //                         var hasPass = await bcrypt.hash(data.password, saltRounds);
    //                         data.password = hasPass;
    //                     } else {
    //                         if (findRes != null) {
    //                             data.password = findRes.password;
    //                         } else {
    //                             data.password = '';
    //                         }
    //                     }
    //                     userSchema.updateOne(
    //                         {
    //                             employeeId: data.employeeId,
    //                             companyId: data.companyId
    //                         },
    //                         {
    //                             $set: {
    //                                 _id: data._id,
    //                                 userName: data.userName,
    //                                 password: data.password,
    //                                 userType: 'employee',
    //                                 isActive: data.isActive,
    //                                 isDelete: 'no',
    //                                 appType: data.appType,
    //                                 deviceToken: '',
    //                                 authToken: ''
    //                             }
    //                         },
    //                         {
    //                             upsert: true
    //                         }, async function (err, updateRes) {
    //                             if (err) {
    //                                 callback({
    //                                     "response_code": 505,
    //                                     "response_message": "INTERNAL DB ERROR",
    //                                     "response_data": {}
    //                                 });
    //                             } else {
    //                                 if (data.accessId != '' && data.accessId != null && data.accessId != undefined) {
    //                                     await employeeAccessSchema.updateOne(
    //                                         {
    //                                             employeeId: data.employeeId,
    //                                             companyId: data.companyId
    //                                         },
    //                                         {
    //                                             $set: {
    //                                                 _id: data._id,
    //                                                 accessId: data.accessId,
    //                                                 accessProfile: data.accessProfile
    //                                             }
    //                                         }, {
    //                                         upsert: true
    //                                     })
    //                                 }
    //                                 callback({
    //                                     "response_code": 200,
    //                                     "response_message": "Data updated.",
    //                                     "response_data": {}
    //                                 });
    //                             }
    //                         }
    //                     )

    //                 }
    //             })


    //     } else {
    //         callback({
    //             "response_code": 502,
    //             "response_message": "Please provide required information.",
    //             "response_data": {}
    //         });
    //     }
    // },
    setSkillAttachment: function (data, callback) {
        if (data) {
            employeeSkillAttachmentSchema.findOne(
                { employeeId: data.employeeId }, { _id: 1 },
                async function (err, findRes) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (findRes != null) {
                            data._id = findRes._id;
                        }
                        if (data.note != '' && data.note != null && data.note != undefined) {
                            await employeeSkillAttachmentSchema.updateOne(
                                {
                                    employeeId: data.employeeId,
                                    _id: data._id,
                                    companyId: data.companyId,
                                    createdBy: data.createdBy

                                },
                                {
                                    $set: {
                                        note: data.note
                                    }
                                },
                                {
                                    upsert: true
                                })
                        }
                        if (data.attachment.length > 0) {
                            for (var a = 0; a < data.attachment.length; a++) {
                                await employeeSkillAttachmentSchema.updateOne(
                                    {
                                        employeeId: data.employeeId,
                                        _id: data._id,
                                        companyId: data.companyId,
                                        createdBy: data.createdBy
                                    },
                                    { $push: { attachment: data.attachment[a] } },
                                    {
                                        upsert: true
                                    })
                            }
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                }
            )

        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    skillRelatedDataList: function (data, callback) {
        if (data) {
            _async.parallel({
                skill: function (CallBack) {
                    skillSchema.aggregate([
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
                accessor: function (CallBack) {
                    accessorSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                type: 1,
                                accessor: 1,
                                createdAt: 1
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1

                            }
                        }], async function (err, result) {
                            if (result.length > 0) {
                                for (let i = 0; i < result.length; i++) {
                                    let item = result[i];
                                    if (item.type == 'employee') {
                                        var accessorRes = await employeeSchema.findOne({ _id: item.accessor }, { _id: 0, firstName: 1, lastName: 1 });
                                        result[i].accessor = accessorRes.firstName + ' ' + accessorRes.lastName;
                                    } else if (item.type == 'supplier') {
                                        var accessorRes = await supplierSchema.findOne({ _id: item.accessor }, { _id: 0, name: 1 });
                                        result[i].accessor = accessorRes.name;
                                    } else {
                                        result[i].accessor = '';
                                    }
                                }
                            }
                            CallBack(null, result)
                        });
                },
                competencyLevel: function (CallBack) {
                    competencyLevelSchema.aggregate([
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
    addEmployeeSkill: function (data, callback) {
        if (data) {
            employeeSkillSchema.findOne(
                {
                    skill: data.skill,
                    employeeId: data.employeeId

                }, function (err, skillFind) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (skillFind == null) {
                            positionSchema.aggregate([
                                {
                                    $lookup:
                                    {
                                        from: "employees",
                                        localField: "_id",
                                        foreignField: "position",
                                        as: "Employee"
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$Employee",
                                        preserveNullAndEmptyArrays: false
                                    }
                                },
                                {
                                    $project: {
                                        skill: 1,
                                        EmployeeId: "$Employee._id"
                                    }
                                },
                                {
                                    $match: {
                                        EmployeeId: data.employeeId
                                    }
                                },
                            ], function (err, skillRes) {
                                if (err) {
                                    callback({
                                        "response_code": 505,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                }
                                data.isDeletePermission = 'yes';
                                if (skillRes.length > 0) {
                                    var findSkill = skillRes[0].skill.indexOf(data.skill);
                                    if (findSkill != -1) {
                                        data.isDeletePermission = 'no';
                                    }
                                }
                                new employeeSkillSchema(data).save(function (err, result) {
                                    if (err) {
                                        callback({
                                            "response_code": 505,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        callback({
                                            "response_code": 200,
                                            "response_message": "Skill data saved",
                                            "response_data": {}
                                        });
                                    }
                                })
                            })
                        } else {
                            callback({
                                "response_code": 409,
                                "response_message": "Skill already exist. ",
                                "response_data": {}
                            });
                        }
                    }
                }
            )
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    employeeSkillQualificationList: function (data, callback) {
        if (data) {
            _async.parallel({
                skill: function (CallBack) {
                    employeeSkillSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                employeeId: data.employeeId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "skills",
                                localField: "skill",
                                foreignField: "_id",
                                as: "Skill"
                            }
                        },
                        {
                            $unwind: {
                                path: "$Skill",
                                preserveNullAndEmptyArrays: false
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "competencygroups",
                                localField: "Skill.competencyGroup",
                                foreignField: "_id",
                                as: "CompetencyGroup"
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "competencylevels",
                                localField: "competencyLevel",
                                foreignField: "_id",
                                as: "CompetencyLevel"
                            }
                        },
                        {
                            $project: {
                                skill: '$Skill.name',
                                _id: 1,
                                certNo: 1,
                                competencyLevel: '$CompetencyLevel',
                                competencyGroup: '$CompetencyGroup',
                                completedDate: 1,
                                expiryDate: 1,
                                isDeletePermission: 1,
                                createdAt: 1
                            }
                        },
                        {
                            $sort: { skill: 1 }
                        }
                    ], function (err, res) {
                        if (res.length > 0) {
                            for (let i = 0; i < res.length; i++) {
                                let item = res[i];
                                if (item.competencyGroup.length > 0) {
                                    res[i].groupName = item.competencyGroup[0].name;
                                } else {
                                    res[i].groupName = '';
                                }
                                if (item.competencyLevel.length > 0) {
                                    res[i].competencyLevel = item.competencyLevel[0].name;
                                } else {
                                    res[i].competencyLevel = '';
                                }
                            }
                        }
                        CallBack(null, res)
                    })
                },
                qualification: function (CallBack) {
                    employeeQualificationSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                employeeId: data.employeeId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                qualification: 1,
                                provider: 1,
                                completedDate: 1,
                                createdAt: 1
                            }
                        },
                        {
                            $sort: { qualification: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                attachment: function (CallBack) {
                    employeeSkillAttachmentSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                employeeId: data.employeeId
                            }
                        },
                        {
                            $addFields: {
                                filePath: config.apiUrl
                            }
                        },
                        {
                            $project: {
                                attachment: 1,
                                note: 1,
                                _id: 1,
                                filePath: 1
                            }
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
    deletefileSkillAttachment: function (data, callback) {
        if (data) {
            employeeSkillAttachmentSchema.findOne(
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
                        employeeSkillAttachmentSchema.updateOne(
                            {
                                employeeId: data.employeeId
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
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    deleteEmployeeSkill: function (data, callback) {
        if (data) {
            employeeSkillSchema.deleteOne(
                { _id: data._id },
                function (err, result) {
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
                }
            )
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    detailsEmployeeSkill: function (data, callback) {
        if (data) {
            employeeSkillSchema.aggregate([
                {
                    $match: {
                        _id: data._id
                    }
                },
                {
                    $lookup:
                    {
                        from: "skills",
                        localField: "skill",
                        foreignField: "_id",
                        as: "Skill"
                    }
                },
                {
                    $unwind: {
                        path: "$Skill",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $lookup:
                    {
                        from: "competencygroups",
                        localField: "Skill.competencyGroup",
                        foreignField: "_id",
                        as: "CompetencyGroup"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        certNo: 1,
                        competencyLevel: 1,
                        skill: 1,
                        accessBy: 1,
                        groupName: '$CompetencyGroup',
                        completedDate: 1,
                        expiryDate: 1,
                        isDeletePermission: 1
                    }
                }
            ], function (err, res) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (res.length > 0) {
                        var res = res[0];
                        if (res.groupName.length > 0) {
                            res.groupName = res.groupName[0].name;
                        } else {
                            res.groupName = '';
                        }
                    }
                    callback({
                        "response_code": 200,
                        "response_message": "Employee skill details",
                        "response_data": res
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
    editEmployeeSkill: function (data, callback) {
        if (data) {
            employeeSkillSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        competencyGroup: data.competencyGroup,
                        skill: data.skill,
                        accessBy: data.accessBy,
                        certNo: data.certNo,
                        expiryDate: data.expiryDate,
                        completedDate: data.completedDate,
                        expiryDate: data.expiryDate,
                        competencyLevel: data.competencyLevel
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
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
    addEmployeeQualification: function (data, callback) {
        if (data) {
            new employeeQualificationSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Qualification data saved",
                        "response_data": {}
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
    editEmployeeQualification: function (data, callback) {
        if (data) {
            employeeQualificationSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        qualification: data.qualification,
                        provider: data.provider,
                        completedDate: data.completedDate
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
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
    deleteEmployeeQualification: function (data, callback) {
        if (data) {
            employeeQualificationSchema.deleteOne(
                { _id: data._id },
                function (err, result) {
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
                }
            )


        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

}
module.exports = HrModels;