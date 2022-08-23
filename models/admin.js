var AdminSchema = require('../schema/admin');
var bcrypt = require('bcrypt');
var config = require('../config');
var async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var jwt = require('jsonwebtoken');
var secretKey = config.secretKey;

var AdminModels = {
    adminLogin: function (adminData, callback) {
        if (adminData.email && adminData.password) {
            AdminSchema.findOne({ email: adminData.email })
                .select('_id email password authtoken name status')
                .exec(function (err, loginRes) {
                    if (loginRes === null) {
                        callback({
                            response_code: 400,
                            response_message: "Wrong password or email",
                            response_data: {}
                        });
                    } else {
                        if (!loginRes.comparePassword(adminData.password)) {
                            callback({
                                response_code: 400,
                                response_message: "Wrong password or email",
                                response_data: {}
                            });
                        } else {
                            if (loginRes.status == 'yes') {
                                var token = jwt.sign({
                                    id: loginRes._id,
                                    email: adminData.email
                                }, secretKey, { expiresIn: '24h' });
                                AdminSchema.updateOne(
                                    { _id: loginRes._id },
                                    { $set: { authtoken: token } }
                                ).exec(err, function (err, result) {
                                    if (!err) {
                                        callback({
                                            success: true,
                                            response_code: 200,
                                            response_message: "Login success",
                                            response_data: {
                                                email: loginRes.email,
                                                token: token,
                                                name:loginRes.name
                                            }
                                        })
                                    }
                                })
                            } else {
                                callback({
                                    response_code: 400,
                                    response_message: "Your account is inactive. Please contact to admin.",
                                    response_data: {}
                                });
                            }
                        }
                    }
                });
        } else {
            callback({
                response_code: 500,
                response_message: "Insufficient information provided for user login",
                response_data: {}
            });
        }
    },
    getAdmin: function (data, callback) {
        if (data) {
            if (data._id != null && data._id != '' && data._id != undefined) {
                var match = {
                    $match: {
                        _id: String(data._id)
                    }
                };
            } else {
                var match = { $match: { adminType: 'admin' } }
            }
            AdminSchema.aggregate([
                match,
                {
                    $project: {
                        _id: 1,
                        email: 1,
                        name: 1,
                        contactNo: 1,
                        createdAt: 1,
                        adminType: 1,
                        status: 1
                    }
                },
                {
                    $sort: {
                        name: 1
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
    addAdmin: function (data, callback) {
        if (data) {
            AdminSchema.findOne(
                { email: data.email },
                function (err, resCount) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (resCount == null) {
                            new AdminSchema(data).save(function (err, result) {
                                if (err) {
                                    callback({
                                        "response_code": 505,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    AdminModels.getAdmin(data, function (FindRes) {
                                        callback({
                                            "response_code": 200,
                                            "response_message": "Data saved.",
                                            "response_data": FindRes.response_data.length > 0 ? FindRes.response_data[0] : ''
                                        });
                                    })
                                }
                            });
                        } else {
                            callback({
                                "response_code": 502,
                                "response_message": "This email address is exits ",
                                "response_data": {}
                            });
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
    editAdmin: function (data, callback) {
        if (data) {
            AdminSchema.countDocuments(
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
                            AdminSchema.update(
                                { _id: data._id },
                                {
                                    $set: {
                                        name: data.name,
                                        contactNo: data.contactNo
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
                                        AdminModels.getAdmin(data, function (FindRes) {
                                            callback({
                                                "response_code": 200,
                                                "response_message": "Data saved.",
                                                "response_data": FindRes.response_data.length > 0 ? FindRes.response_data[0] : ''
                                            });
                                        })
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
    statusChange: function (data, callback) {
        if (data) {
            AdminSchema.countDocuments(
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
                            AdminSchema.update(
                                { _id: data._id },
                                {
                                    $set: {
                                        status: data.status
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
    }
}

module.exports = AdminModels;