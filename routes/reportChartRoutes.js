'use strict';
var express = require("express");
var reportChartService = require('../services/reportChartService');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var secretKey = config.secretKey;
var UserModels = require('../models/user');

module.exports = function (app, express) {
    var api = express.Router();
    /******************************  Middleware to check token *****************************/
    api.use(function (req, res, next) {
        var token = req.body.authtoken || req.params.authtoken || req.headers['authtoken'];
        if (token) {
            jwt.verify(token, secretKey, function (err, decoded) {
                if (err) {
                    //res.status(401);
                    res.send({
                        response_code: 401,
                        response_message: "Session timeout! Please try again."
                    });
                }
                else {
                    var data = {
                        user_id: decoded.id,
                        token: token
                    };
                    UserModels.tokenVerification(data, function (result) {
                        if (result.authCount == 0) {
                            res.send({
                                response_code: 401,
                                response_message: "Session timeout! Please try again."
                            });
                        } else {
                            req.decoded = decoded;
                            next();
                        }
                    });

                }
            });
        }
        else {
            res.send({
                "response_code": 401,
                "response_message": "Please provide required information"
            });
        }
    });
    /******************************   Middleware to check token ******************************/

    /************************** START REPORT AND CHART SECTION *******************************/
    //List realted data
    api.post('/listRelatedData', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        reportChartService.listRelatedData(req.body, function (result) {
            res.send(result);
        })
    });
    //Get data for repost generate
    api.post('/getDataforReportGenerate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        reportChartService.getDataforReportGenerate(req.body, function (result) {
            res.send(result);
        })
    });
    //Report Data Add
    api.post('/addReportData', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        reportChartService.addReportData(req.body, function (result) {
            res.send(result);
        })
    });
    //Report List
    api.post('/listReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        reportChartService.listReport(req.body, function (result) {
            res.send(result);
        })
    });
    //Report Delete
    api.post('/deleteReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        reportChartService.deleteReport(req.body, function (result) {
            res.send(result);
        })
    });
    //Report View
    api.post('/viewReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        reportChartService.viewReport(req.body, function (result) {
            res.send(result);
        })
    });
    /************************** END REPORT AND CHART SECTION *********************************/
    return api;
}