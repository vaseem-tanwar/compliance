'use strict';
var express = require("express");
var hrService = require('../services/hrService');
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

    /************************** START HR SECTION *******************************/
    api.post('/listAllUser', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.listAllUser(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Employee
    api.post('/addEmployee', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.addEmployee(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    // Employee related data list
    api.post('/employeeDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.employeeDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //List Employee
    api.post('/listEmployee', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.listEmployee(req.body, function (result) {
            res.send(result);
        })
    });

    //List Active Employee
    api.post('/listActiveEmployee', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.listActiveEmployee(req.body, function (result) {
            res.send(result);
        })
    });

    //Employee status change
    api.post('/employeeStatusChange', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.employeeStatusChange(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Employee
    api.post('/deleteEmployee', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.deleteEmployee(req.body, function (result) {
            res.send(result);
        })
    });

    //Details of Employee
    api.post('/getEmployeeDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.getEmployeeDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete files of employee
    api.post('/deleteFileEmployee', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.deleteFileEmployee(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Employee
    api.post('/editEmployee', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.editEmployee(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Set skill attachtment
    api.post('/setSkillAttachment', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.setSkillAttachment(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Skill Related data list
    api.post('/skillRelatedDataList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.skillRelatedDataList(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Employee Skill
    api.post('/addEmployeeSkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.addEmployeeSkill(req.body, function (result) {
            res.send(result);
        })
    });

    //List Employee Skill and Qualification
    api.post('/employeeSkillQualificationList', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.employeeSkillQualificationList(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete files of employee skill attachement
    api.post('/deletefileSkillAttachment', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.deletefileSkillAttachment(req.body, function (result) {
            res.send(result);
        })
    });

    ///Delete Employee skill
    api.post('/deleteEmployeeSkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.deleteEmployeeSkill(req.body, function (result) {
            res.send(result);
        })
    });

    //Details Employee skill
    api.post('/detailsEmployeeSkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.detailsEmployeeSkill(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Employee skill
    api.post('/editEmployeeSkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.editEmployeeSkill(req.body, function (result) {
            res.send(result);
        })
    });

    //add Employee qualification
    api.post('/addEmployeeQualification', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.addEmployeeQualification(req.body, function (result) {
            res.send(result);
        })
    });

    //edit Employee qualification
    api.post('/editEmployeeQualification', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.editEmployeeQualification(req.body, function (result) {
            res.send(result);
        })
    });

    //edit Employee qualification
    api.post('/deleteEmployeeQualification', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.deleteEmployeeQualification(req.body, function (result) {
            res.send(result);
        })
    });

    //Employee access right details
    api.post('/employeeAccessDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.employeeAccessDetails(req.body, function (result) {
            res.send(result);
        })
    });
    //Employee access login details edit
    api.post('/editEmployeeLoginDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.editEmployeeLoginDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Employee access right edit
    api.post('/editEmployeeAccessRight', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        hrService.editEmployeeAccessRight(req.body, function (result) {
            res.send(result);
        })
    });

    /************************** END HR SECTION *******************************/


    return api;
}

