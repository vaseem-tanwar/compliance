'use strict';
var taskService = require('../services/taskService');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var secretKey = config.secretKey;
var UserModels = require('../models/user');

module.exports = function (app, express) {
    var api = express.Router();
    
    /*****************************  Middleware to check token ***************************/
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
    /*****************************  Middleware to check token  ******************************/

    /************************** START TASK SECTION *******************************/

    //Task data related list
    api.post('/taskDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.taskDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //Task add
    api.post('/addTask', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.addTask(req.body, function (result) {
            res.send(result);
        })
    });

    //list Task
    api.post('/listTask', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.listTask(req.body, function (result) {
            res.send(result);
        })
    });

    //Task status change
    api.post('/taskStatusChange', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.taskStatusChange(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Tak
    api.post('/deleteTask', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.deleteTask(req.body, function (result) {
            res.send(result);
        })
    });

    //Get Tak details
    api.post('/getTaskDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.getTaskDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Tak
    api.post('/editTask', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.editTask(req.body, function (result) {
            res.send(result);
        })
    });

    //list Task
    api.post('/listAssignTask', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.listAssignTask(req.body, function (result) {
            res.send(result);
        })
    });

    //Task sing off
    api.post('/signOffTask', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        taskService.signOffTask(req.body, function (result) {
            res.send(result);
        })
    });
    /************************** END TASK SECTION *******************************/
    return api;
}

