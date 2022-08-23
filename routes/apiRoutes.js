'use strict';
var express = require("express");
var setupService = require('../services/setupService');
var apiService = require('../services/apiService');
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var secretKey = config.secretKey;
var UserModels = require('../models/user');

module.exports = function (app, express) {
    var api = express.Router();
    // Access Section data Entry
    api.post('/addAccessSection', function (req, res) {
        apiService.addAccessSection(req.body, function (result) {
            res.send(result);
        });
    });
    //Login
    api.post('/login', function (req, res) {
        apiService.login(req.body, function (result) {
            res.send(result);
        });
    });
    //Forgot password
    api.post('/forgotPassword', function (req, res) {
        apiService.forgotPassword(req.body, function (result) {
            res.send(result);
        });
    });
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
    //Dashboard
    api.post('/dashboard', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.dashboard(req.body, function (result) {
            res.send(result);
        })
    });

    //Add supplier category
    api.post('/addSupplierCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addSupplierCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit supplier category
    api.post('/editSupplierCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editSupplierCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //list supplier category
    api.post('/listSupplierCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listSupplierCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete supplier category
    api.post('/deleteSupplierCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteSupplierCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Workplace
    api.post('/addWorkplace', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addWorkplace(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Workplace
    api.post('/editWorkplace', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editWorkplace(req.body, function (result) {
            res.send(result);
        })
    });

    //list Workplace
    api.post('/listWorkplace', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listWorkplace(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Workplace
    api.post('/deleteWorkplace', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteWorkplace(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Branch
    api.post('/addBranch', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addBranch(req.body, function (result) {
            res.send(result);
        })
    });

    // Branch Details
    api.post('/viewBranch', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.viewBranch(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Branch
    api.post('/editBranch', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editBranch(req.body, function (result) {
            res.send(result);
        })
    });

    //list Branch
    api.post('/listBranch', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listBranch(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Branch
    api.post('/deleteBranch', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteBranch(req.body, function (result) {
            res.send(result);
        })
    });

    //list Branch By workplace
    api.post('/listBranchByWorkplace', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listBranchByWorkplace(req.body, function (result) {
            res.send(result);
        })
    });

    //get Branch By workplace
    api.post('/getBranchByWorkplace', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.getBranchByWorkplace(req.body, function (result) {
            res.send(result);
        })
    });

    //Add task type
    api.post('/addTaskType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addTaskType(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit task type
    api.post('/editTaskType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editTaskType(req.body, function (result) {
            res.send(result);
        })
    });

    //list task type
    api.post('/listTaskType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listTaskType(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete task type
    api.post('/deleteTaskType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteTaskType(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Plant category
    api.post('/addPlantCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addPlantCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Plant category
    api.post('/editPlantCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editPlantCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //list Plant category
    api.post('/listPlantCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listPlantCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Plant category
    api.post('/deletePlantCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deletePlantCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Plant unit
    api.post('/addPlantUnit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addPlantUnit(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Plant unit
    api.post('/editPlantUnit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editPlantUnit(req.body, function (result) {
            res.send(result);
        })
    });

    //list Plant unit
    api.post('/listPlantUnit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listPlantUnit(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Plant unit
    api.post('/deletePlantUnit', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deletePlantUnit(req.body, function (result) {
            res.send(result);
        })
    });



    //Add Skill
    api.post('/addSkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addSkill(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Skill
    api.post('/editSkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editSkill(req.body, function (result) {
            res.send(result);
        })
    });

    //list Skill
    api.post('/listSkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listSkill(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Skill
    api.post('/deleteSkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteSkill(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Position
    api.post('/addPosition', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addPosition(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Edit Position
    api.post('/editPosition', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editPosition(req.body, req.files, function (result) {
            res.send(result);
        })
    });

    //Delete Position
    api.post('/deletePosition', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deletePosition(req.body, function (result) {
            res.send(result);
        })
    });

    //list Position
    api.post('/listPosition', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listPosition(req.body, function (result) {
            res.send(result);
        })
    });

    //Get Position details
    api.post('/getPositionDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.getPositionDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete files of Position
    api.post('/deleteFilePosition', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteFilePosition(req.body, function (result) {
            res.send(result);
        })
    });

    //List Access section
    api.post('/listAccessSection', function (req, res) {
        setupService.listAccessSection(function (result) {
            res.send(result);
        });
    });

    //Add access profile
    api.post('/addAccessProfile', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addAccessProfile(req.body, function (result) {
            res.send(result);
        });
    });

    //list access profile
    api.post('/listAccessProfile', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listAccessProfile(req.body, function (result) {
            res.send(result);
        });
    });

    //details of access profile
    api.post('/accessProfileDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.accessProfileDetails(req.body, function (result) {
            res.send(result);
        });
    });

    //Edit access profile
    api.post('/editAccessProfile', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editAccessProfile(req.body, function (result) {
            res.send(result);
        });
    });

    //Add Competency Level
    api.post('/addCompetencyLevel', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addCompetencyLevel(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Competency Level
    api.post('/editCompetencyLevel', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editCompetencyLevel(req.body, function (result) {
            res.send(result);
        })
    });

    //list Competency Level
    api.post('/listCompetencyLevel', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listCompetencyLevel(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Competency Level
    api.post('/deleteCompetencyLevel', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteCompetencyLevel(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Accessor
    api.post('/addAccessor', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addAccessor(req.body, function (result) {
            res.send(result);
        })
    });

    //List Accessor
    api.post('/listAccessor', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listAccessor(req.body, function (result) {
            res.send(result);
        })
    });

    //Accessor Details
    api.post('/accessorDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.accessorDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Accessor
    api.post('/editAccessor', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editAccessor(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Accessor
    api.post('/deleteAccessor', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteAccessor(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Cause
    api.post('/addCause', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addCause(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Cause
    api.post('/editCause', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editCause(req.body, function (result) {
            res.send(result);
        })
    });

    //list Cause
    api.post('/listCause', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listCause(req.body, function (result) {
            res.send(result);
        })
    });

    //delete Cause
    api.post('/deleteCause', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteCause(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Additional Information
    api.post('/addAdditionalInformation', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addAdditionalInformation(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Additional Information
    api.post('/editAdditionalInformation', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editAdditionalInformation(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Additional Information
    api.post('/deleteAdditionalInformation', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteAdditionalInformation(req.body, function (result) {
            res.send(result);
        })
    });

    //list Additional Information
    api.post('/listAdditionalInformation', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listAdditionalInformation(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Work Shift
    api.post('/addWorkShift', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addWorkShift(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Work Shift
    api.post('/editWorkShift', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editWorkShift(req.body, function (result) {
            res.send(result);
        })
    });

    //list Work Shift
    api.post('/listWorkShift', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listWorkShift(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Work Shift
    api.post('/deleteWorkShift', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteWorkShift(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Type
    api.post('/addType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addType(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Type
    api.post('/editType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editType(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Type
    api.post('/deleteType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteType(req.body, function (result) {
            res.send(result);
        })
    });

    //list Type
    api.post('/listType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listType(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Code
    api.post('/addCode', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addCode(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Code
    api.post('/editCode', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editCode(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Code
    api.post('/deleteCode', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteCode(req.body, function (result) {
            res.send(result);
        })
    });


    //list Code
    api.post('/listCode', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listCode(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Person Reporting
    api.post('/addPersonReporting', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addPersonReporting(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Person Reporting
    api.post('/editPersonReporting', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editPersonReporting(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Person Reporting
    api.post('/deletePersonReporting', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deletePersonReporting(req.body, function (result) {
            res.send(result);
        })
    });

    //list Person Reporting
    api.post('/listPersonReporting', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listPersonReporting(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Potential Severity
    api.post('/addPotentialSeverity', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addPotentialSeverity(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Potential Severity
    api.post('/editPotentialSeverity', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editPotentialSeverity(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Potential Severity
    api.post('/deletePotentialSeverity', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deletePotentialSeverity(req.body, function (result) {
            res.send(result);
        })
    });

    //list Potential Severity
    api.post('/listPotentialSeverity', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listPotentialSeverity(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Observation Category
    api.post('/addObservationCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addObservationCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Observation Category
    api.post('/editObservationCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editObservationCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Observation Category
    api.post('/deleteObservationCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteObservationCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //list Observation Category
    api.post('/listObservationCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listObservationCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Observation Type
    api.post('/addObservationType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addObservationType(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Observation Type
    api.post('/editObservationType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editObservationType(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Observation Type
    api.post('/deleteObservationType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteObservationType(req.body, function (result) {
            res.send(result);
        })
    });

    //list Observation Type
    api.post('/listObservationType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listObservationType(req.body, function (result) {
            res.send(result);
        })
    });

    //Observation Type Details
    api.post('/getObservationTypeDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.getObservationTypeDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Add injury category
    api.post('/addInjuryCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addInjuryCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit injury category
    api.post('/editInjuryCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editInjuryCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete injury category
    api.post('/deleteInjuryCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteInjuryCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //list injury category
    api.post('/listInjuryCategory', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listInjuryCategory(req.body, function (result) {
            res.send(result);
        })
    });

    //Set Observation Work Flow Details
    api.post('/setObservationWorkFlowDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.setObservationWorkFlowDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Set Observation Work Flow stage
    api.post('/setObservationWorkFlowStage', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.setObservationWorkFlowStage(req.body, function (result) {
            res.send(result);
        })
    });

    //get Observation Work Flow
    api.post('/getObservationWorkFlow', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.getObservationWorkFlow(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Risk Type
    api.post('/addRiskType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addRiskType(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Risk Type
    api.post('/editRiskType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editRiskType(req.body, function (result) {
            res.send(result);
        })
    });

    //list Risk Type
    api.post('/listRiskType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listRiskType(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Risk Type
    api.post('/deleteRiskType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteRiskType(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Initial Likelihood
    api.post('/addInitialLikelihood', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addInitialLikelihood(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Initial Likelihood
    api.post('/editInitialLikelihood', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editInitialLikelihood(req.body, function (result) {
            res.send(result);
        })
    });

    //list Initial Likelihood
    api.post('/listInitialLikelihood', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listInitialLikelihood(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Initial Likelihood
    api.post('/deleteInitialLikelihood', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteInitialLikelihood(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Initial Consequence
    api.post('/addInitialConsequence', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addInitialConsequence(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Initial Consequence
    api.post('/editInitialConsequence', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editInitialConsequence(req.body, function (result) {
            res.send(result);
        })
    });

    //list Initial Consequence
    api.post('/listInitialConsequence', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listInitialConsequence(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Initial Consequence
    api.post('/deleteInitialConsequence', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteInitialConsequence(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Initial Rating
    api.post('/addInitialRating', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addInitialRating(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Initial Rating
    api.post('/editInitialRating', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editInitialRating(req.body, function (result) {
            res.send(result);
        })
    });

    //list Initial Rating
    api.post('/listInitialRating', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listInitialRating(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Initial Rating
    api.post('/deleteInitialRating', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteInitialRating(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Residual Likelihood
    api.post('/addResidualLikelihood', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addResidualLikelihood(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Residual Likelihood
    api.post('/editResidualLikelihood', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editResidualLikelihood(req.body, function (result) {
            res.send(result);
        })
    });

    //list Residual Likelihood
    api.post('/listResidualLikelihood', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listResidualLikelihood(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Residual Likelihood
    api.post('/deleteResidualLikelihood', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteResidualLikelihood(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Residual Consequence
    api.post('/addResidualConsequence', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addResidualConsequence(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Residual Consequence
    api.post('/editResidualConsequence', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editResidualConsequence(req.body, function (result) {
            res.send(result);
        })
    });

    //list Residual Consequence
    api.post('/listResidualConsequence', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listResidualConsequence(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Residual Consequence
    api.post('/deleteResidualConsequence', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteResidualConsequence(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Final Rating
    api.post('/addFinalRating', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addFinalRating(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Final Rating
    api.post('/editFinalRating', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editFinalRating(req.body, function (result) {
            res.send(result);
        })
    });

    //list Final Rating
    api.post('/listFinalRating', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listFinalRating(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Final Rating
    api.post('/deleteFinalRating', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteFinalRating(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Audit form template
    api.post('/addAuditFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addAuditFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    //list Audit form template
    api.post('/listAuditFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listAuditFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    //edit Audit form template
    api.post('/editAuditFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editAuditFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    //delete Audit form template
    api.post('/deleteAuditFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteAuditFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    //status change Audit form template
    api.post('/auditFormTemplateStatusChange', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.auditFormTemplateStatusChange(req.body, function (result) {
            res.send(result);
        })
    });

    //Details Audit form template
    api.post('/getAuditFormTemplateDetails', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.getAuditFormTemplateDetails(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Audit form template section
    api.post('/addAuditFormTemplateSection', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addAuditFormTemplateSection(req.body, function (result) {
            res.send(result);
        })
    });

    //list Audit form template section
    api.post('/listAuditFormTemplateSection', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listAuditFormTemplateSection(req.body, function (result) {
            res.send(result);
        })
    });

    //edit Audit form template section
    api.post('/editAuditFormTemplateSection', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editAuditFormTemplateSection(req.body, function (result) {
            res.send(result);
        })
    });

    //delete Audit form template section
    api.post('/deleteAuditFormTemplateSection', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteAuditFormTemplateSection(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Audit form template question
    api.post('/addAuditFormTemplateQuestion', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addAuditFormTemplateQuestion(req.body, function (result) {
            res.send(result);
        })
    });

    //list Audit form template question
    api.post('/listAuditFormTemplateQuestion', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listAuditFormTemplateQuestion(req.body, function (result) {
            res.send(result);
        })
    });

    //edit Audit form template question
    api.post('/editAuditFormTemplateQuestion', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editAuditFormTemplateQuestion(req.body, function (result) {
            res.send(result);
        })
    });

    //delete Audit form template question
    api.post('/deleteAuditFormTemplateQuestion', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteAuditFormTemplateQuestion(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Audit form template score
    api.post('/addAuditFormTemplateScore', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addAuditFormTemplateScore(req.body, function (result) {
            res.send(result);
        })
    });

    //list Audit form template score
    api.post('/listAuditFormTemplateScore', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listAuditFormTemplateScore(req.body, function (result) {
            res.send(result);
        })
    });

    //edit Audit form template score
    api.post('/editAuditFormTemplateScore', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editAuditFormTemplateScore(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Hazardous Type
    api.post('/addHazardousType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addHazardousType(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Hazardous Type
    api.post('/editHazardousType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editHazardousType(req.body, function (result) {
            res.send(result);
        })
    });

    //list Hazardous Type
    api.post('/listHazardousType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listHazardousType(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Hazardous Type
    api.post('/deleteHazardousType', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteHazardousType(req.body, function (result) {
            res.send(result);
        })
    });

    //Add Competency 
    api.post('/addCompetencyGroup', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addCompetencyGroup(req.body, function (result) {
            res.send(result);
        })
    });

    //Edit Competency Group
    api.post('/editCompetencyGroup', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editCompetencyGroup(req.body, function (result) {
            res.send(result);
        })
    });

    //list Competency Group
    api.post('/listCompetencyGroup', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listCompetencyGroup(req.body, function (result) {
            res.send(result);
        })
    });

    //Delete Competency Group
    api.post('/deleteCompetencyGroup', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteCompetencyGroup(req.body, function (result) {
            res.send(result);
        })
    });

    //Get competency group by skill
    api.post('/getCompetencyGroupBySkill', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.getCompetencyGroupBySkill(req.body, function (result) {
            res.send(result);
        })
    });

    // Add Form template
    api.post('/addFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.addFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    // List Form template
    api.post('/listFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.listFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    // Delete Form template
    api.post('/deleteFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.deleteFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    // Details Form template
    api.post('/detailFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.detailFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    // Edit Form template
    api.post('/editFormTemplate', function (req, res) {
        req.body.userId = req.decoded.id;
        req.body.companyId = req.decoded.companyId;
        setupService.editFormTemplate(req.body, function (result) {
            res.send(result);
        })
    });

    // Form templete module list
    api.post('/formTemplateModuleList', function (req, res) {
        setupService.formTemplateModuleList(function (result) {
            res.send(result);
        })
    });

    // Set module for form template
    api.post('/moduleMappingFormTemplate', function (req, res) {
        setupService.moduleMappingFormTemplate(req.body,function (result) {
            res.send(result);
        })
    });

    // Module details for form template
    api.post('/moduleDetailsFormTemplate', function (req, res) {
        setupService.moduleDetailsFormTemplate(req.body,function (result) {
            res.send(result);
        })
    });
    

    /************************** END SYSTEM SETUP SECTION *******************************/

    return api;
}

