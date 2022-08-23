'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
//======================MODELS============================
var FormSubmissionModels = require('../models/formSubmission');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var formSubmissionService = {
    //Form submission related data list
    formSubmissionRelatedList: (data, callback) => {
        FormSubmissionModels.formSubmissionRelatedList(data, function (result) {
            callback(result);
        });
    },
}
module.exports = formSubmissionService;