'use strict';
var auditService = require('../services/auditService');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var secretKey = config.secretKey;
var UserModels = require('../models/user');

module.exports = function (app, express) {
    var api = express.Router();
    
    /******************************
  *  Middleware to check token
  ******************************/
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
    /****************************** *  Middleware to check token ******************************/

    /************************** START AUDIT SECTION *******************************/
    //Audit  Related data list
    api.post('/auditRelatedDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.auditRelatedDataList(req.body, function (result) {
            res.send(result);
        })
    });
    //Audit form template details
    api.post('/auditFormTemplateDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.auditFormTemplateDetails(req.body, function (result) {
            res.send(result);
        })
    });
    //Audit Register
    api.post('/auditRegister', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.auditRegister(req.body, function (result) {
            res.send(result);
        })
    });
    //Audit list
    api.post('/listAudit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.listAudit(req.body, function (result) {
            res.send(result);
        })
    });
    //Audit Delete
    api.post('/deleteAudit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.deleteAudit(req.body, function (result) {
            res.send(result);
        })
    });
    //Audit Details
    api.post('/getAuditDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.getAuditDetails(req.body, function (result) {
            res.send(result);
        })
    });
    //Audit Edit
    api.post('/editAudit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.editAudit(req.body, function (result) {
            res.send(result);
        })
    });
    //My Audit list
    api.post('/listMyAudit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.listMyAudit(req.body, function (result) {
            res.send(result);
        })
    });
    //Set audit score
    api.post('/setAuditScore', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.setAuditScore(req.body, function (result) {
            res.send(result);
        })
    });
    //Add audit question comment
    api.post('/addAuditQuestionComment', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.addAuditQuestionComment(req.body, function (result) {
            res.send(result);
        })
    });
    //Edit audit question comment
    api.post('/editAuditQuestionComment', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.editAuditQuestionComment(req.body, function (result) {
            res.send(result);
        })
    });
    //Upload question attach file
    api.post('/uploadQuestionAttach', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.uploadQuestionAttach(req.body, req.files, function (result) {
            res.send(result);
        })
    });
    //Delete question attach file
    api.post('/deleteQuestionAttach', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.deleteQuestionAttach(req.body, function (result) {
            res.send(result);
        })
    });    
    //Audit cloase off
    api.post('/closeOffAudit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        auditService.closeOffAudit(req.body, function (result) {
            res.send(result);
        })
    });
    /************************** END AUDIT SECTION *******************************/

    return api;
}

