'use strict';
var assetService = require('../services/assetService');
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

    /************************** START ASSET SECTION *******************************/
    //Plant data related list
    api.post('/plantDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        assetService.plantDataList(req.body, function (result) {
            res.send(result);
        })
    });
    //Add Plant
    api.post('/addPlant', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        assetService.addPlant(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //List Plant
    api.post('/listPlant', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        assetService.listPlant(req.body, function (result) {
            res.send(result);
        })
    });

    //Plant status change
    api.post('/plantStatusChange', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        assetService.plantStatusChange(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Plant
    api.post('/deletePlant', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        assetService.deletePlant(req.body, function (result) {
            res.send(result);
        })
    });

    //Get Plant details
    api.post('/getPlantDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        assetService.getPlantDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete files of Plants
    api.post('/deleteFilePlant', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        assetService.deleteFilePlant(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Plant
    api.post('/editPlant', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        assetService.editPlant(req.body, req.files, function (result) {
            res.send(result);
        })
    });
    /************************** END ASSET SECTION *******************************/
    
    return api;
}

