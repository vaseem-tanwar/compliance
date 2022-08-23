var CompanySchema = require('../schema/company');
var UserSchema = require('../schema/user');
var config = require('../config');
var _async = require("async");
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var moment = require('moment');


var CompanyModels = {
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

    login: function (data, callback) {
        if (data) {
            data.loginUser = data.loginUser.toLowerCase();
            UserSchema.findOne({
                $or: [
                    { email: data.loginUser },
                    { userName: data.loginUser }
                ]
            }, {
                _id: 1,
                userName: 1,
                email: 1,
                password: 1,
                dob: 1,
                imageOne: 1,
                imageTwo: 1,
                imageOne: 1,
                email: 1,
                userType: 1,
                isActive: 1,
                status: 1,
                isDelete: 1,
                isVerify: 1
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
                                "response_message": "Please provide registered email address.",
                                "response_data": {}
                            });
                        } else {
                            if (result.isDelete == 'yes') {
                                callback({
                                    "response_code": 501,
                                    "response_message": "Your account is deleted.Please contact with admin.",
                                    "response_data": {}
                                });
                            } else {
                                var comparePass = bcrypt.compareSync(data.password, result.password);
                                if (comparePass == true) {
                                    if (result.isActive == 'yes' && result.status == 'yes') {
                                        var token = jwt.sign({
                                            id: result._id
                                        }, config.secretKey, {
                                            expiresIn: '24h'
                                        });
                                        UserSchema.updateOne({
                                            _id: result._id
                                        }, {
                                            $set: {
                                                authToken: token,
                                                deviceToken: data.deviceToken ? data.deviceToken : '',
                                                deviceType: data.deviceType
                                            }
                                        }, function (err, resUpdate) {
                                            if (err) {
                                                callback({
                                                    "response_code": 505,
                                                    "response_message": "INTERNAL DB ERROR",
                                                    "response_data": {}
                                                });
                                            } else {
                                                if (result.imageOne != '' && result.imageOne != null && result.imageOne != undefined) {
                                                    result.image = config.apiUrl + result.imageOne;
                                                } else if (result.imageTwo != '' && result.imageTwo != null && result.imageTwo != undefined) {
                                                    result.image = config.apiUrl + result.imageTwo;
                                                } else if (result.imageThree != '' && result.imageThree != null && result.imageThree != undefined) {
                                                    result.image = config.apiUrl + result.imageThree;
                                                } else {
                                                    result.image = config.apiUrl + 'images/userNoImg.png';
                                                }
                                                callback({
                                                    "response_code": 200,
                                                    "response_message": "Logged in to your account successfully",
                                                    "response_data": {
                                                        authToken: token,
                                                        _id: result._id,
                                                        email: result.email,
                                                        userName: result.userName,
                                                        image: result.image,
                                                        userType: result.userType,
                                                        isVerify: result.isVerify
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        if (result.isActive == 'no') {
                                            callback({
                                                "response_code": 501,
                                                "response_message": "Your account is not activated.",
                                                "response_data": {}
                                            });
                                        } else if (result.status == 'no') {
                                            callback({
                                                "response_code": 501,
                                                "response_message": "Your account is deactivated.Please contact with admin.",
                                                "response_data": {}
                                            });
                                        } else {
                                            callback({
                                                "response_code": 501,
                                                "response_message": "Your account is deleted.Please contact with admin.",
                                                "response_data": {}
                                            });
                                        }
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

    getCompanyList: function (data, callback) {
        if (data) {
            UserSchema.aggregate([
                {
                    $match: {
                        isDelete: 'no',
                        userType: 'company'
                    }
                },
                {
                    $lookup:
                    {
                        from: "companies",
                        localField: "_id",
                        foreignField: "userId",
                        as: "Company"
                    }
                },
                {
                    $unwind: {
                        path: "$Company",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "companyLogo": {
                            "$cond": {
                                "if": { "$ne": ["$Company.logo", ""] },
                                "then": { $concat: [config.apiUrl, "", "$Company.logo"] },
                                "else": config.apiUrl + 'images/no-img.png'
                            }
                        },
                        userName: 1,
                        companyName: '$Company.companyName',
                        isActive: 1,
                        createdAt:1
                    }
                },
                {
                    $sort: {
                        createdAt: -1

                    }
                }],
                function (err, result) {
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

    addCompany: function (data, callback) {
        if (data) {
            _async.waterfall([
                function (nextCb) {
                    UserSchema.findOne(
                        { userName: data.userName }
                    ).exec(function (err, resCount) {
                        if (err) {
                            nextCb(null, {
                                "response_code": 505,
                                "response_message": "INTERNAL DB ERROR",
                                "response_data": {}
                            });
                        } else {
                            if (resCount == null) {
                                nextCb(null, {
                                    "response_code": 200,
                                    "response_message": "Success.",
                                    "response_data": {}
                                });
                            } else {
                                callback({
                                    "response_code": 502,
                                    "response_message": "Username already exists",
                                    "response_data": {}
                                });
                            }
                        }
                    });
                }, function (arg, nextCb) {
                    if (arg.response_code == 200) {
                        UserSchema.findOne(
                            {
                                email: data.email
                            }
                        ).exec(function (err, resCount) {
                            if (err) {
                                nextCb(null, {
                                    "response_code": 505,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                if (resCount == null) {
                                    nextCb(null, {
                                        "response_code": 200,
                                        "response_message": "Success.",
                                        "response_data": {}
                                    });
                                } else {
                                    nextCb(null, {
                                        "response_code": 502,
                                        "response_message": "Email address already exists ",
                                        "response_data": {}
                                    });
                                }
                            }
                        });
                    } else {
                        nextCb(null, arg)
                    }
                }, function (arg, nextCb) {
                    if (arg.response_code == 200) {
                        data.userType ='company';
                        new UserSchema(data).save(function (err, result) {
                            if (err) {
                                nextCb(null, {
                                    "response_code": 505,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                data.userId = result._id;
                                new CompanySchema(data).save( async function (err, companyRes) {
                                    if (err) {
                                        nextCb(null, {
                                            "response_code": 505,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        await UserSchema.updateOne({_id:result._id},{$set:{companyId:companyRes._id}})
                                        nextCb(null, {
                                            "response_code": 200,
                                            "response_message": "Company added successfully.We sent the login details in registerd mail address.",
                                            "response_data": {}
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        nextCb(null, arg);
                    }
                }
            ], function (err, content) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback(content);
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

    changeStatusCompany: function (data, callback) {
        if (data) {
            CompanySchema.countDocuments(
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
                            CompanySchema.updateOne(
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

    getCompanyDetails: function (data, callback) {
        if (data) {
            UserSchema.aggregate([
                {
                    $match: {
                        _id: data.userId
                    }
                },
                {
                    $lookup:
                    {
                        from: "companies",
                        localField: "_id",
                        foreignField: "userId",
                        as: "Company"
                    }
                },
                {
                    $unwind: {
                        path: "$Company",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        _id: 1,
                        "companyLogo": {
                            "$cond": {
                                "if": { "$ne": ["$Company.logo", ""] },
                                "then": { $concat: [config.apiUrl, "", "$Company.logo"] },
                                "else": config.apiUrl + 'images/no-img.png'
                            }
                        },
                        userName: 1,
                        email: 1,
                        companyId:'$Company._id',
                        phoneNumber: '$Company.phoneNumber',
                        companyName: '$Company.companyName',
                        ownerName: '$Company.ownerName',
                        location: '$Company.location',
                        isActive: 1,
                        createdAt:1
                    }
                },
                {
                    $sort: {
                        createdAt: -1

                    }
                }],
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        })
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Details",
                            "response_data": result.length > 0 ? result[0] : result
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

    editCompany: function (data, callback) {
        if (data) {
            if (data.logo != '') {
                var updateData = {
                    companyName: data.companyName,
                    ownerName: data.ownerName,
                    phoneNumber: data.phoneNumber,
                    logo: data.logo,
                    location: data.location
                }
            } else {
                var updateData = {
                    companyName: data.companyName,
                    ownerName: data.ownerName,
                    phoneNumber: data.phoneNumber,
                    location: data.location
                }
            }
            CompanySchema.updateOne(
                {
                    _id: data.companyId
                },
                {
                    $set: updateData
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
                            "response_message": "Company updated successfully.",
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
}

module.exports = CompanyModels;