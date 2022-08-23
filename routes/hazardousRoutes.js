'use strict';
var express = require("express");
var hazardousService = require('../services/hazardousService');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var secretKey = config.secretKey;
var UserModels = require('../models/user');

module.exports = function (app, express) {
    var api = express.Router();
    
    /*****************************   Middleware to check token ******************************/
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
    /******************************   Middleware to check token *****************************/
   

    /************************** START Hazardous SECTION *******************************/
    //Hazardous data related list
    api.post('/hazardousDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hazardousService.hazardousDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //Hazardous add
    api.post('/addHazardous', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hazardousService.addHazardous(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //list Hazardous 
    api.post('/listHazardous', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hazardousService.listHazardous(req.body, function (result) {
            res.send(result);
        })
    });

    //Hazardous status change
    api.post('/hazardousStatusChange', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hazardousService.hazardousStatusChange(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Hazardous
    api.post('/deleteHazardous', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hazardousService.deleteHazardous(req.body, function (result) {
            res.send(result);
        })
    });

    //Get Hazardous details
    api.post('/getHazardousDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hazardousService.getHazardousDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Hazardous
    api.post('/editHazardous', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hazardousService.editHazardous(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Delete files of Hazardous
    api.post('/deleteFileHazardous', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hazardousService.deleteFileHazardous(req.body, function (result) {
            res.send(result);
        })
    });
    /************************** END Hazardous SECTION *******************************/
    return api;
}

