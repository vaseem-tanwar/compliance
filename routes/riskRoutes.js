'use strict';
var express = require("express");
var riskService = require('../services/riskService');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var secretKey = config.secretKey;
var UserModels = require('../models/user');

module.exports = function (app, express) {
    var api = express.Router();
    
    /******************************  Middleware to check token ***************************/
    api.use(function (req, res, next) {
        var token = req.body.authtoken || req.params.authtoken || req.headers['authtoken'];
        if (token) {
            jwt.verify(token, secretKey, function (err, decoded) {
                if (err) {
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
    /***************************** Middleware to check token ****************************/

    /************************** START RISK SECTION *******************************/
    //Risk data related list
    api.post('/riskDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        riskService.riskDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //Risk add
    api.post('/addRisk', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        riskService.addRisk(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //list Risk 
    api.post('/listRisk', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        riskService.listRisk(req.body, function (result) {
            res.send(result);
        })
    });

    //Risk status change
    api.post('/riskStatusChange', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        riskService.riskStatusChange(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Risk
    api.post('/deleteRisk', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        riskService.deleteRisk(req.body, function (result) {
            res.send(result);
        })
    });

    //Get Risk details
    api.post('/getRiskDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        riskService.getRiskDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Risk
    api.post('/editRisk', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        riskService.editRisk(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Delete files of Risk
    api.post('/deleteFileRisk', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        riskService.deleteFileRisk(req.body, function (result) {
            res.send(result);
        })
    });
    /************************** END RISK SECTION *******************************/




    return api;
}

