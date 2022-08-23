'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
var baseUrl = config.baseUrl;

//======================MODELS============================
var UserModels = require('../models/user');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================
var AccessSectionSchema = require('../schema/accessSection');

var apiService = {
    // Add accesssection
    addAccessSection: (data, callback) => {
        data._id = new ObjectID;
        new AccessSectionSchema(data).save(function (err, res) {
            if (err) {
                callback({
                    "response_code": 505,
                    "response_message": "INTERNAL DB ERROR",
                    "response_data": {}
                });
            } else {
                callback({
                    "response_code": 200,
                    "response_message": "Data Addedd",
                    "response_data": {}
                });
            }
        })
    },
    // login
    login: (data, callback) => {
        if (!data.userName || typeof data.userName === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide username", "response_data": {} });
        } else if (!data.password || typeof data.password === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide password", "response_data": {} });
        } else if (!data.deviceToken || typeof data.deviceToken === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide device token", "response_data": {} });
        } else if (!data.appType || typeof data.appType === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide app type", "response_data": {} });
        } else {
            UserModels.login(data, function (result) {
                callback(result);
            });
        }
    },
    //User forgotpassword
    forgotPassword: (data, callback) => {
        if (!data.userName || typeof data.userName === undefined) {
            callback({ "response_code": 502, "response_message": "Please provid username", "response_data": {} });
        } else {
            UserModels.forgotPassword(data, function (result) {
                if (result.response_code == 200) {
                    result = result.response_data;
                    mailProperty('ResetPasswordLinkMail')(result.email, {
                        name: result.name,
                        date: new Date(),
                        year: new Date().getFullYear(),
                        logo: config.apiUrl + '' + config.siteConfig.LOGO,
                        header_color: config.siteConfig.HEADERCOLOR,
                        footer_color: config.siteConfig.FOOTERCOLOR,
                        site_name: config.siteConfig.SITENAME,
                        reset_password_url: `${config.webUrl}#/resetpassword/${result.authToken}`
                    }).send();
                    let dataResult = {
                        "response_code": 200,
                        "response_message": "We sent reset password link in your registered email address."
                    };
                    callback(dataResult);
                } else {
                    callback(result);
                }
            });
        }
    },
    //User Reset password
    resetPassword: (data, callback) => {
        if (!data._id || typeof data._id === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide user id", "response_data": {} });
        } else if (!data.password || typeof data.password === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide new password", "response_data": {} });
        } else {
            UserModels.resetPassword(data, function (result) {
                callback(result);
            });
        }
    },
    //User change password
    changePassword: (data, callback) => {
        if (!data._id || typeof data._id === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide user id", "response_data": {} });
        } else if (!data.currentPassword || typeof data.currentPassword === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide current password", "response_data": {} });
        } else if (!data.password || typeof data.password === undefined) {
            callback({ "response_code": 502, "response_message": "Please provide new password", "response_data": {} });
        } else {
            UserModels.changePassword(data, function (result) {
                callback(result);
            });
        }
    },
}
module.exports = apiService;