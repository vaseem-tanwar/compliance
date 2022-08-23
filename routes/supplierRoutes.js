'use strict';
var supplierService = require('../services/supplierService');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var secretKey = config.secretKey;
var UserModels = require('../models/user');

module.exports = function (app, express) {
    var api = express.Router();
    
    /***************************** Middleware to check token *****************************/
    
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
    /****************************  Middleware to check token ******************************/

    /************************** START SUPPLIER SECTION *******************************/   

    //Supplier data related list
    api.post('/supplierDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        supplierService.supplierDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Supplier
    api.post('/addSupplier', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        supplierService.addSupplier(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //list Supplier
    api.post('/listSupplier', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        supplierService.listSupplier(req.body, function (result) {
            res.send(result);
        })
    });

    //Supplier status change
    api.post('/supplierStatusChange', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        supplierService.supplierStatusChange(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Supplier
    api.post('/deleteSupplier', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        supplierService.deleteSupplier(req.body, function (result) {
            res.send(result);
        })
    });

    //Get Supplier details
    api.post('/getSupplierDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        supplierService.getSupplierDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Supplier
    api.post('/editSupplier', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        supplierService.editSupplier(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Delete files of Supplier
    api.post('/deleteFileSupplier', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        supplierService.deleteFileSupplier(req.body, function (result) {
            res.send(result);
        })
    });
    /************************** END SUPPLIER SECTION *******************************/
    
    return api;
}

