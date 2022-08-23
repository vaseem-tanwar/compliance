var CompanySchema = require('../schema/company');
var UserSchema = require('../schema/user');
var SupplierSchema = require('../schema/supplier');
var EmployeeSchema = require('../schema/employee');
var employeeAccessRestrictionSchema = require('../schema/employeeAccessRestriction');
//var CustomerSchema = require('../schema/customer');
var config = require('../config.js');
var _async = require("async");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
var moment = require('moment');

var UserModels = {
    tokenVerification: function (data, callback) {
        UserSchema.countDocuments(
            {
                _id: data.user_id,
                authToken: data.token
            }, function (err, result) {

                if (err) {
                    callback({ authCount: 0 });
                } else {
                    callback({ authCount: result });
                }
            });
    },

    login: async function (data, callback) {
        if (data) {
            var accessList = config.accessList;
            UserSchema.findOne(
                { userName: data.userName },
                {
                    _id: 1,
                    userName: 1,
                    password: 1,
                    isActive: 1,
                    userType: 1,
                    companyId: 1,
                    employeeId: 1
                },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 502,
                                "response_message": "Wrong credentials. Please provide registered details.",
                                "response_data": {}
                            });
                        } else {
                            var comparePass = bcrypt.compareSync(data.password, result.password);
                            if (comparePass == true) {
                                if (result.isActive == 'yes') {
                                    var token = jwt.sign({
                                        id: result._id,
                                        companyId: result.companyId,
                                        userType: result.userType
                                    }, config.secretKey, {
                                        expiresIn: '365 days'
                                    });
                                    UserSchema.updateOne({
                                        _id: result._id
                                    }, {
                                        $set: {
                                            authToken: token,
                                            deviceToken: data.deviceToken ? data.deviceToken : '',
                                            deviceType: data.deviceType
                                        }
                                    }, async function (err, resUpdate) {
                                        if (err) {
                                            callback({
                                                "response_code": 505,
                                                "response_message": "INTERNAL DB ERROR",
                                                "response_data": {}
                                            });
                                        } else {
                                            if (result.userType == 'company') {
                                                var companyDetails = await CompanySchema.findOne(
                                                    { userId: result._id },
                                                    { logo: 1, compayName: 1 }
                                                );
                                                result.profileImage = config.apiUrl + companyDetails.logo;
                                            } else {
                                                var restrictionDetails = await employeeAccessRestrictionSchema.findOne(
                                                    { employeeId: result.employeeId }, { accessRestriction: 1 });
                                                if (restrictionDetails != null) {
                                                    var accessRestriction = restrictionDetails.accessRestriction;
                                                    for (var i = 0; i < accessList.length; i++) {
                                                        if (accessRestriction[i] != null && accessRestriction[i] != '' && accessRestriction[i] != undefined) {
                                                            accessList[i].isAccess = accessRestriction[i].isAccess;
                                                        }
                                                    }
                                                }
                                            }
                                            callback({
                                                "response_code": 200,
                                                "response_message": "Logged in to your account successfully",
                                                "response_data": {
                                                    authToken: token,
                                                    _id: result._id,
                                                    userName: result.userName,
                                                    profileImage: result.profileImage,
                                                    userType: result.userType,
                                                    accessRestriction: accessList
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    callback({
                                        "response_code": 502,
                                        "response_message": "Your account is suspended.Please contact with admin.",
                                        "response_data": {}
                                    });
                                }
                            } else {
                                callback({
                                    "response_code": 502,
                                    "response_message": "Wrong credentials. Please provide registered details.",
                                    "response_data": {}
                                });
                            }
                        }
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

    changePassword: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { _id: data._id },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 502,
                                "response_message": "User does not exist.",
                                "response_data": {}
                            });
                        } else {
                            var comparePass = bcrypt.compareSync(data.currentPassword, result.password);
                            if (comparePass == true) {
                                const saltRounds = 10;
                                bcrypt.hash(data.password, saltRounds, function (err, hash) {
                                    if (err) {
                                        callback({
                                            "response_code": 505,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        bcrypt.compare(data.password, result.password, function (err, res) {
                                            if (err) {
                                                callback({
                                                    "response_code": 505,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                if (res == false) {
                                                    UserSchema.updateOne(
                                                        { _id: data._id },
                                                        {
                                                            $set: { password: hash }
                                                        },
                                                        function (err, resUpdate) {
                                                            if (err) {
                                                                callback({
                                                                    "response_code": 505,
                                                                    "response_message": "INTERNAL DB ERROR",
                                                                    "response_data": {}
                                                                });
                                                            } else {
                                                                callback({
                                                                    "response_code": 200,
                                                                    "response_message": "Password changed.",
                                                                    "response_data": {}
                                                                });
                                                            }
                                                        });
                                                } else {
                                                    callback({
                                                        "response_code": 502,
                                                        "response_message": "Current password and new password are same.",
                                                        "response_data": {}
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            } else {
                                callback({
                                    "response_code": 502,
                                    "response_message": "Please provide valid current password.",
                                    "response_data": {}
                                });
                            }
                        }
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

    forgotPassword: function (data, callback) {
        if (data) {
            UserSchema.findOne(
                { userName: data.userName }, {
                _id: 1, userName: 1, email: 1
            },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 501,
                                "response_message": "Please provide valid username.",
                                "response_data": {}
                            });
                        } else {
                            var token = jwt.sign({
                                id: result._id
                            }, config.secretKey, {
                                expiresIn: '24h'
                            });
                            UserSchema.updateOne(
                                {
                                    _id: result._id
                                },
                                {
                                    $set: {
                                        authToken: token
                                    }
                                }, function (err, resultUp) {
                                    callback({
                                        "response_code": 200,
                                        "response_message": "Token details",
                                        "response_data": {
                                            name: result.userName,
                                            email: result.email,
                                            authToken: token
                                        }
                                    });
                                })

                        }
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

    resetPassword: function (data, callback) {
        if (data) {
            UserSchema.findOne({
                _id: data._id
            }, { _id: 1 }, function (err, resDetails) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (resDetails == null) {
                        callback({
                            "response_code": 502,
                            "response_message": "User does not exist.",
                            "response_data": {}
                        });
                    } else {
                        const saltRounds = 10;
                        bcrypt.hash(data.password, saltRounds, function (err, hash) {
                            if (err) {
                                callback({
                                    "response_code": 505,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                UserSchema.updateOne({
                                    _id: data._id
                                }, {
                                    $set: {
                                        password: hash
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
                                            "response_message": "Password changed.",
                                            "response_data": {}
                                        });
                                    }
                                });
                            }
                        });

                    }
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

    userStatusChange: function (data, callback) {
        if (data) {
            UserSchema.countDocuments(
                { _id: data._id },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        })
                    } else {
                        if (result == 0) {
                            callback({
                                "response_code": 502,
                                "response_message": "No found data.",
                                "response_data": {}
                            })
                        } else {
                            UserSchema.updateOne(
                                { _id: data._id },
                                {
                                    $set: {
                                        isActive: data.isActive
                                    }
                                },
                                function (err, updateRes) {
                                    if (err) {
                                        callback({
                                            "response_code": 505,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        })
                                    } else {
                                        callback({
                                            "response_code": 200,
                                            "response_message": "Status changed."
                                        });
                                    }
                                })
                        }
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

    listAllUser: function (data, callback) {
        if (data) {
            _async.parallel({
                employee: function (CallBack) {
                    EmployeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
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
                supplier: function (CallBack) {
                    SupplierSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
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
                            $sort: { firstName: 1 }
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
    }
}

module.exports = UserModels;