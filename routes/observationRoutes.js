'use strict';
var express = require("express");
var observationService = require('../services/observationService');
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

    /************************** START SYSTEM SETUP SECTION *******************************/
    //get Environmental generate related data list
    api.post('/environmentalRelatedDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.environmentalRelatedDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //Generate Environmental Report
    api.post('/generateEnviromentalReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.generateEnviromentalReport(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //get Accident generate related data list
    api.post('/accidentRelatedDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.accidentRelatedDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //Generate Accident Report
    api.post('/generateAccidentReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.generateAccidentReport(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Set observation stage defination
    api.post('/setObservationDefination', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.setObservationDefination(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //List my investigation accident
    api.post('/listMyInvestigationAccident', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.listMyInvestigationAccident(req.body, function (result) {
            res.send(result);
        })
    });

    //List registered accident report
    api.post('/listAccidentRegistered', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.listAccidentRegistered(req.body, function (result) {
            res.send(result);
        })
    });

    //Accident report Details
    api.post('/accidentReportDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.accidentReportDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //List my investigation Environmental
    api.post('/listMyInvestigationEnvironmental', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.listMyInvestigationEnvironmental(req.body, function (result) {
            res.send(result);
        })
    });

    //List registered Environmental report
    api.post('/listEnvironmentalRegistered', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.listEnvironmentalRegistered(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete files of observation
    api.post('/deleteFileObservation', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.deleteFileObservation(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Accident Report Form
    api.post('/editAccidentReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.editAccidentReport(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Environmental report Details
    api.post('/environmentalReportDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.environmentalReportDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Accident Report Form
    api.post('/editEnvironmentalReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.editEnvironmentalReport(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    // Accident Action stage details
    api.post('/accidentStageDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.accidentStageDetails(req.body, function (result) {
            res.send(result);
        })
    });

    // Environmental Action stage details
    api.post('/environmentalStageDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.environmentalStageDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //get NCR generate related data list
    api.post('/ncrRelatedDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.ncrRelatedDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //Generate NCR Report
    api.post('/generateNcrReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.generateNcrReport(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //List registered ncr report
    api.post('/listNcrRegistered', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.listNcrRegistered(req.body, function (result) {
            res.send(result);
        })
    });

    // NCR Action stage details
    api.post('/ncrStageDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.ncrStageDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //List my investigation NCR
    api.post('/listMyInvestigationNcr', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.listMyInvestigationNcr(req.body, function (result) {
            res.send(result);
        })
    });

    //NCR report Details
    api.post('/ncrReportDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.ncrReportDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit NCR Report Form
    api.post('/editNcrReport', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        observationService.editNcrReport(req.body, req.files, function (result) {
            res.send(result);
        })
    });
    return api;
}

