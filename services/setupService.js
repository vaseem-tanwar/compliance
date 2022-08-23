'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
var baseUrl = config.baseUrl;
//======================MODELS============================
var SetupModels = require('../models/setup');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var setupService = {
    //Dashboard
    dashboard: (data, callback) => {
        SetupModels.dashboard(data, function (result) {
            callback(result);
        });
    },
    //add Supplier Category
    addSupplierCategory: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addSupplierCategory(data, function (result) {
            callback(result);
        });
    },
    //edit Supplier Category
    editSupplierCategory: (data, callback) => {
        SetupModels.editSupplierCategory(data, function (result) {
            callback(result);
        });
    },
    //list Supplier Category
    listSupplierCategory: (data, callback) => {
        SetupModels.listSupplierCategory(data, function (result) {
            callback(result);
        });
    },
    //Delete Supplier Category
    deleteSupplierCategory: (data, callback) => {
        SetupModels.deleteSupplierCategory(data, function (result) {
            callback(result);
        });
    },
    //add Workplace
    addWorkplace: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addWorkplace(data, function (result) {
            callback(result);
        });
    },
    //edit Workplace
    editWorkplace: (data, callback) => {
        SetupModels.editWorkplace(data, function (result) {
            callback(result);
        });
    },
    //list Workplace
    listWorkplace: (data, callback) => {
        SetupModels.listWorkplace(data, function (result) {
            callback(result);
        });
    },
    //Delete Workplace
    deleteWorkplace: (data, callback) => {
        SetupModels.deleteWorkplace(data, function (result) {
            callback(result);
        });
    },
    //add Branch
    addBranch: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addBranch(data, function (result) {
            callback(result);
        });
    },
    //view Branch
    viewBranch: (data, callback) => {
        SetupModels.viewBranch(data, function (result) {
            callback(result);
        });
    },
    //edit Branch
    editBranch: (data, callback) => {
        SetupModels.editBranch(data, function (result) {
            callback(result);
        });
    },
    //list Branch
    listBranch: (data, callback) => {
        SetupModels.listBranch(data, function (result) {
            callback(result);
        });
    },
    //Delete Branch
    deleteBranch: (data, callback) => {
        SetupModels.deleteBranch(data, function (result) {
            callback(result);
        });
    },
    //list Workplace and branch mapping
    listBranchByWorkplace: (data, callback) => {
        SetupModels.listBranchByWorkplace(data, function (result) {
            callback(result);
        });
    },
    //get Workplace and branch mapping
    getBranchByWorkplace: (data, callback) => {
        SetupModels.getBranchByWorkplace(data, function (result) {
            callback(result);
        });
    },
    //add task type
    addTaskType: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addTaskType(data, function (result) {
            callback(result);
        });
    },
    //edit task type
    editTaskType: (data, callback) => {
        SetupModels.editTaskType(data, function (result) {
            callback(result);
        });
    },
    //list task type
    listTaskType: (data, callback) => {
        SetupModels.listTaskType(data, function (result) {
            callback(result);
        });
    },
    //Delete task type
    deleteTaskType: (data, callback) => {
        SetupModels.deleteTaskType(data, function (result) {
            callback(result);
        });
    },
    //add Plant Category
    addPlantCategory: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addPlantCategory(data, function (result) {
            callback(result);
        });
    },
    //edit Plant Category
    editPlantCategory: (data, callback) => {
        SetupModels.editPlantCategory(data, function (result) {
            callback(result);
        });
    },
    //list Plant Category
    listPlantCategory: (data, callback) => {
        SetupModels.listPlantCategory(data, function (result) {
            callback(result);
        });
    },
    //Delete Plant Category
    deletePlantCategory: (data, callback) => {
        SetupModels.deletePlantCategory(data, function (result) {
            callback(result);
        });
    },
    //add Plant Unit
    addPlantUnit: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addPlantUnit(data, function (result) {
            callback(result);
        });
    },
    //edit Plant Unit
    editPlantUnit: (data, callback) => {
        SetupModels.editPlantUnit(data, function (result) {
            callback(result);
        });
    },
    //list Plant Unit
    listPlantUnit: (data, callback) => {
        SetupModels.listPlantUnit(data, function (result) {
            callback(result);
        });
    },
    //Delete Plant Unit
    deletePlantUnit: (data, callback) => {
        SetupModels.deletePlantUnit(data, function (result) {
            callback(result);
        });
    },
    //add Skill
    addSkill: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addSkill(data, function (result) {
            callback(result);
        });
    },
    //edit Skill
    editSkill: (data, callback) => {
        SetupModels.editSkill(data, function (result) {
            callback(result);
        });
    },
    //list Skill
    listSkill: (data, callback) => {
        SetupModels.listSkill(data, function (result) {
            callback(result);
        });
    },
    //Delete Skill
    deleteSkill: (data, callback) => {
        SetupModels.deleteSkill(data, function (result) {
            callback(result);
        });
    },
    //add Position
    addPosition: (data, dataFile, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (!data.userId || typeof data.userId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company user id", "response_data": {} });
                } else {
                    nextCb(null, { "response_code": 200, "response_message": "Success", "response_data": {} });
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    data.attachment = [];
                    if (dataFile != null && dataFile != '' && dataFile != undefined) {
                        var i = 0;
                        _async.forEach(Object.keys(dataFile), function (itemKey, callBack) {
                            i++;
                            var pic = dataFile[itemKey];
                            var size = pic.size;
                            var originalName = pic.name;
                            var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                            var fileName = i + '-' + Date.now() + ext;
                            var folderpath = config.uploaHRPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.hrtPath + 'attachment/' + fileName,
                                        size: size,
                                        createdAt: new Date()
                                    }
                                    data.attachment.push(dataPush)
                                    callBack()

                                } else {
                                    callBack()
                                }
                            });
                        }, function (err, con) {
                            nextCb(null, arg);
                        })
                    } else {
                        nextCb(null, arg);
                    }
                } else {
                    nextCb(null, arg);
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    data._id = new ObjectID;
                    SetupModels.addPosition(data, function (result) {
                        nextCb(null, result);
                    })
                } else {
                    nextCb(null, arg);
                }
            }], function (err, content) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback(content)
                }
            })
    },
    //edit Position
    editPosition: (data, dataFile, callback) => {
        _async.waterfall([
            function (nextCb) {
                if (!data.userId || typeof data.userId === undefined) {
                    nextCb(null, { "response_code": 502, "response_message": "Please provide company user id", "response_data": {} });
                } else {
                    nextCb(null, { "response_code": 200, "response_message": "Success", "response_data": {} });
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    data.photo = [];
                    data.attachment = [];
                    if (dataFile != null && dataFile != '' && dataFile != undefined) {
                        var i = 0;
                        _async.forEach(Object.keys(dataFile), function (itemKey, callBack) {
                            i++;
                            var pic = dataFile[itemKey];
                            var size = pic.size;
                            var originalName = pic.name;
                            var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                            var fileName = i + '-' + Date.now() + ext;
                            var folderpath = config.uploaHRPath + 'attachment/';
                            pic.mv(folderpath + fileName, function (err) {
                                if (!err) {
                                    var dataPush = {
                                        _id: new ObjectID,
                                        name: originalName,
                                        path: config.hrtPath + 'attachment/' + fileName,
                                        size: size,
                                        createdAt: new Date()
                                    }
                                    data.attachment.push(dataPush)
                                    callBack()

                                } else {
                                    callBack()
                                }
                            });
                        }, function (err, con) {
                            nextCb(null, arg);
                        })
                    } else {
                        nextCb(null, arg);
                    }
                } else {
                    nextCb(null, arg);
                }
            }, function (arg, nextCb) {
                if (arg.response_code == 200) {
                    SetupModels.editPosition(data, function (result) {
                        nextCb(null, result);
                    })
                } else {
                    nextCb(null, arg);
                }
            }], function (err, content) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback(content)
                }
            })
    },
    //edit Position
    deletePosition: (data, callback) => {
        SetupModels.deletePosition(data, function (result) {
            callback(result);
        });
    },
    //list Position
    listPosition: (data, callback) => {
        SetupModels.listPosition(data, function (result) {
            callback(result);
        });
    },
    //Get Position Details
    getPositionDetails: (data, callback) => {
        SetupModels.getPositionDetails(data, function (result) {
            callback(result);
        });
    },
    //Delete files of Plants
    deleteFilePosition: (data, callback) => {
        SetupModels.deleteFilePosition(data, function (result) {
            callback(result);
        });
    },
    //list accesssection
    listAccessSection: (callback) => {
        SetupModels.listAccessSection(function (result) {
            callback(result);
        });
    },
    //Add Access Profile
    addAccessProfile: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addAccessProfile(data, function (result) {
            callback(result);
        });
    },
    //list Access Profile
    listAccessProfile: (data, callback) => {
        SetupModels.listAccessProfile(data, function (result) {
            callback(result);
        });
    },
    //Details of Access Profile
    accessProfileDetails: (data, callback) => {
        SetupModels.accessProfileDetails(data, function (result) {
            callback(result);
        });
    },
    //Edit Access Profile
    editAccessProfile: (data, callback) => {
        SetupModels.editAccessProfile(data, function (result) {
            callback(result);
        });
    },
    //add Competency Level
    addCompetencyLevel: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addCompetencyLevel(data, function (result) {
            callback(result);
        });
    },
    //edit Competency Level
    editCompetencyLevel: (data, callback) => {
        SetupModels.editCompetencyLevel(data, function (result) {
            callback(result);
        });
    },
    //list Competency Level
    listCompetencyLevel: (data, callback) => {
        SetupModels.listCompetencyLevel(data, function (result) {
            callback(result);
        });
    },
    //Delete Competency Level
    deleteCompetencyLevel: (data, callback) => {
        SetupModels.deleteCompetencyLevel(data, function (result) {
            callback(result);
        });
    },
    //Add accessor
    addAccessor: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addAccessor(data, function (result) {
            callback(result);
        });
    },
    //list Accessor
    listAccessor: (data, callback) => {
        SetupModels.listAccessor(data, function (result) {
            callback(result);
        });
    },
    //Accessor Details
    accessorDetails: (data, callback) => {
        SetupModels.accessorDetails(data, function (result) {
            callback(result);
        });
    },
    //edit accessor
    editAccessor: (data, callback) => {
        SetupModels.editAccessor(data, function (result) {
            callback(result);
        });
    },
    //delete accessor
    deleteAccessor: (data, callback) => {
        SetupModels.deleteAccessor(data, function (result) {
            callback(result);
        });
    },
    //add Cause
    addCause: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addCause(data, function (result) {
            callback(result);
        });
    },
    //edit Cause
    editCause: (data, callback) => {
        SetupModels.editCause(data, function (result) {
            callback(result);
        });
    },
    //list Cause
    listCause: (data, callback) => {
        SetupModels.listCause(data, function (result) {
            callback(result);
        });
    },
    //delete Cause
    deleteCause: (data, callback) => {
        SetupModels.deleteCause(data, function (result) {
            callback(result);
        });
    },
    //add Additional Information
    addAdditionalInformation: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addAdditionalInformation(data, function (result) {
            callback(result);
        });
    },
    //edit Additional Information
    editAdditionalInformation: (data, callback) => {
        SetupModels.editAdditionalInformation(data, function (result) {
            callback(result);
        });
    },
    //delete Additional Information
    deleteAdditionalInformation: (data, callback) => {
        SetupModels.deleteAdditionalInformation(data, function (result) {
            callback(result);
        });
    },
    //list Additional Information
    listAdditionalInformation: (data, callback) => {
        SetupModels.listAdditionalInformation(data, function (result) {
            callback(result);
        });
    },
    //add Work Shift
    addWorkShift: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addWorkShift(data, function (result) {
            callback(result);
        });
    },
    //edit Work Shift
    editWorkShift: (data, callback) => {
        SetupModels.editWorkShift(data, function (result) {
            callback(result);
        });
    },
    //list Work Shift
    listWorkShift: (data, callback) => {
        SetupModels.listWorkShift(data, function (result) {
            callback(result);
        });
    },
    //Delete Work Shift
    deleteWorkShift: (data, callback) => {
        SetupModels.deleteWorkShift(data, function (result) {
            callback(result);
        });
    },
    //add Type
    addType: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addType(data, function (result) {
            callback(result);
        });
    },
    //edit Type
    editType: (data, callback) => {
        SetupModels.editType(data, function (result) {
            callback(result);
        });
    },
    //delete Type
    deleteType: (data, callback) => {
        SetupModels.deleteType(data, function (result) {
            callback(result);
        });
    },
    //list Type
    listType: (data, callback) => {
        SetupModels.listType(data, function (result) {
            callback(result);
        });
    },
    //add Code
    addCode: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addCode(data, function (result) {
            callback(result);
        });
    },
    //edit Code
    editCode: (data, callback) => {
        SetupModels.editCode(data, function (result) {
            callback(result);
        });
    },
    //delete Code
    deleteCode: (data, callback) => {
        SetupModels.deleteCode(data, function (result) {
            callback(result);
        });
    },
    //list Code
    listCode: (data, callback) => {
        SetupModels.listCode(data, function (result) {
            callback(result);
        });
    },

    //add Person Reporting
    addPersonReporting: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addPersonReporting(data, function (result) {
            callback(result);
        });
    },

    //edit Person Reporting
    editPersonReporting: (data, callback) => {
        SetupModels.editPersonReporting(data, function (result) {
            callback(result);
        });
    },

    //delete Person Reporting
    deletePersonReporting: (data, callback) => {
        SetupModels.deletePersonReporting(data, function (result) {
            callback(result);
        });
    },

    //list Person Reporting
    listPersonReporting: (data, callback) => {
        SetupModels.listPersonReporting(data, function (result) {
            callback(result);
        });
    },

    //add Potential Severity
    addPotentialSeverity: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addPotentialSeverity(data, function (result) {
            callback(result);
        });
    },

    //edit Potential Severity
    editPotentialSeverity: (data, callback) => {
        SetupModels.editPotentialSeverity(data, function (result) {
            callback(result);
        });
    },

    //delete Potential Severity
    deletePotentialSeverity: (data, callback) => {
        SetupModels.deletePotentialSeverity(data, function (result) {
            callback(result);
        });
    },

    //list Potential Severity
    listPotentialSeverity: (data, callback) => {
        SetupModels.listPotentialSeverity(data, function (result) {
            callback(result);
        });
    },

    //add Observation Category
    addObservationCategory: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addObservationCategory(data, function (result) {
            callback(result);
        });
    },

    //edit Observation Category
    editObservationCategory: (data, callback) => {
        SetupModels.editObservationCategory(data, function (result) {
            callback(result);
        });
    },

    //delete Observation Category
    deleteObservationCategory: (data, callback) => {
        SetupModels.deleteObservationCategory(data, function (result) {
            callback(result);
        });
    },

    //list Observation Category
    listObservationCategory: (data, callback) => {
        SetupModels.listObservationCategory(data, function (result) {
            callback(result);
        });
    },

    //add Observation Type
    addObservationType: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addObservationType(data, function (result) {
            callback(result);
        });
    },

    //edit Observation Type
    editObservationType: (data, callback) => {
        SetupModels.editObservationType(data, function (result) {
            callback(result);
        });
    },

    //delete Observation Type
    deleteObservationType: (data, callback) => {
        SetupModels.deleteObservationType(data, function (result) {
            callback(result);
        });
    },

    //list Observation Type
    listObservationType: (data, callback) => {
        SetupModels.listObservationType(data, function (result) {
            callback(result);
        });
    },

    //add injury category
    addInjuryCategory: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addInjuryCategory(data, function (result) {
            callback(result);
        });
    },

    //edit injury category
    editInjuryCategory: (data, callback) => {
        SetupModels.editInjuryCategory(data, function (result) {
            callback(result);
        });
    },

    //delete injury category
    deleteInjuryCategory: (data, callback) => {
        SetupModels.deleteInjuryCategory(data, function (result) {
            callback(result);
        });
    },

    //list injury category
    listInjuryCategory: (data, callback) => {
        SetupModels.listInjuryCategory(data, function (result) {
            callback(result);
        });
    },

    //Observation Type Details
    getObservationTypeDetails: (data, callback) => {
        SetupModels.getObservationTypeDetails(data, function (result) {
            callback(result);
        });
    },

    //Set Observation Work FLow Details
    setObservationWorkFlowDetails: (data, callback) => {
        data._id = new ObjectID;
        data.createdBy = 'company';
        if (data.investigator.length > 0) {
            for (var i = 0; i < data.investigator.length; i++) {
                data.investigator[i] = {
                    userId: data.investigator[i].userId,
                    userType: data.investigator[i].userType,
                    _id: new ObjectID
                }
            }
        }
        SetupModels.setObservationWorkFlowDetails(data, function (result) {
            callback(result);
        });
    },

    //Set Observation Work FLow stage
    setObservationWorkFlowStage: (data, callback) => {
        data._id = new ObjectID;
        data.createdBy = 'company';
        SetupModels.setObservationWorkFlowStage(data, function (result) {
            callback(result);
        });
    },

    //Get Observation Work flow
    getObservationWorkFlow: (data, callback) => {
        SetupModels.getObservationWorkFlow(data, function (result) {
            callback(result);
        });
    },

    //add Initial Likelihood
    addInitialLikelihood: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addInitialLikelihood(data, function (result) {
            callback(result);
        });
    },
    //edit Initial Likelihood
    editInitialLikelihood: (data, callback) => {
        SetupModels.editInitialLikelihood(data, function (result) {
            callback(result);
        });
    },
    //list Initial Likelihood
    listInitialLikelihood: (data, callback) => {
        SetupModels.listInitialLikelihood(data, function (result) {
            callback(result);
        });
    },
    //Delete Initial Likelihood
    deleteInitialLikelihood: (data, callback) => {
        SetupModels.deleteInitialLikelihood(data, function (result) {
            callback(result);
        });
    },

    //add Risk Type
    addRiskType: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addRiskType(data, function (result) {
            callback(result);
        });
    },
    //edit Risk Type
    editRiskType: (data, callback) => {
        SetupModels.editRiskType(data, function (result) {
            callback(result);
        });
    },
    //list Risk Type
    listRiskType: (data, callback) => {
        SetupModels.listRiskType(data, function (result) {
            callback(result);
        });
    },
    //Delete Risk Type
    deleteRiskType: (data, callback) => {
        SetupModels.deleteRiskType(data, function (result) {
            callback(result);
        });
    },

    //add Initial Consequence
    addInitialConsequence: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addInitialConsequence(data, function (result) {
            callback(result);
        });
    },
    //edit Initial Consequence
    editInitialConsequence: (data, callback) => {
        SetupModels.editInitialConsequence(data, function (result) {
            callback(result);
        });
    },
    //list Initial Consequence
    listInitialConsequence: (data, callback) => {
        SetupModels.listInitialConsequence(data, function (result) {
            callback(result);
        });
    },
    //Delete Initial Consequence
    deleteInitialConsequence: (data, callback) => {
        SetupModels.deleteInitialConsequence(data, function (result) {
            callback(result);
        });
    },

    //add Initial Rating
    addInitialRating: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addInitialRating(data, function (result) {
            callback(result);
        });
    },
    //edit Initial Rating
    editInitialRating: (data, callback) => {
        SetupModels.editInitialRating(data, function (result) {
            callback(result);
        });
    },
    //list Initial Rating
    listInitialRating: (data, callback) => {
        SetupModels.listInitialRating(data, function (result) {
            callback(result);
        });
    },
    //Delete Initial Rating
    deleteInitialRating: (data, callback) => {
        SetupModels.deleteInitialRating(data, function (result) {
            callback(result);
        });
    },

    //add Residual Likelihood
    addResidualLikelihood: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addResidualLikelihood(data, function (result) {
            callback(result);
        });
    },
    //edit Residual Likelihood
    editResidualLikelihood: (data, callback) => {
        SetupModels.editResidualLikelihood(data, function (result) {
            callback(result);
        });
    },
    //list Residual Likelihood
    listResidualLikelihood: (data, callback) => {
        SetupModels.listResidualLikelihood(data, function (result) {
            callback(result);
        });
    },
    //Delete Residual Likelihood
    deleteResidualLikelihood: (data, callback) => {
        SetupModels.deleteResidualLikelihood(data, function (result) {
            callback(result);
        });
    },

    //add Residual Consequence
    addResidualConsequence: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addResidualConsequence(data, function (result) {
            callback(result);
        });
    },
    //edit Residual Consequence
    editResidualConsequence: (data, callback) => {
        SetupModels.editResidualConsequence(data, function (result) {
            callback(result);
        });
    },
    //list Residual Consequence
    listResidualConsequence: (data, callback) => {
        SetupModels.listResidualConsequence(data, function (result) {
            callback(result);
        });
    },
    //Delete Residual Consequence
    deleteResidualConsequence: (data, callback) => {
        SetupModels.deleteResidualConsequence(data, function (result) {
            callback(result);
        });
    },

    //add Final Rating
    addFinalRating: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addFinalRating(data, function (result) {
            callback(result);
        });
    },
    //edit Final Rating
    editFinalRating: (data, callback) => {
        SetupModels.editFinalRating(data, function (result) {
            callback(result);
        });
    },
    //list Final Rating
    listFinalRating: (data, callback) => {
        SetupModels.listFinalRating(data, function (result) {
            callback(result);
        });
    },
    //Delete Final Rating
    deleteFinalRating: (data, callback) => {
        SetupModels.deleteFinalRating(data, function (result) {
            callback(result);
        });
    },
    //Add Audit form template
    addAuditFormTemplate: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addAuditFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //List Audit form template
    listAuditFormTemplate: (data, callback) => {
        SetupModels.listAuditFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //Edit Audit form template
    editAuditFormTemplate: (data, callback) => {
        SetupModels.editAuditFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //Delete Audit form template
    deleteAuditFormTemplate: (data, callback) => {
        SetupModels.deleteAuditFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //Status change Audit form template
    auditFormTemplateStatusChange: (data, callback) => {
        SetupModels.auditFormTemplateStatusChange(data, function (result) {
            callback(result);
        });
    },
    //Details Audit form template
    getAuditFormTemplateDetails: (data, callback) => {
        SetupModels.getAuditFormTemplateDetails(data, function (result) {
            callback(result);
        });
    },
    //Add Audit form template section
    addAuditFormTemplateSection: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addAuditFormTemplateSection(data, function (result) {
            callback(result);
        });
    },
    //List Audit form template section
    listAuditFormTemplateSection: (data, callback) => {
        SetupModels.listAuditFormTemplateSection(data, function (result) {
            callback(result);
        });
    },
    //Edit Audit form template section
    editAuditFormTemplateSection: (data, callback) => {
        SetupModels.editAuditFormTemplateSection(data, function (result) {
            callback(result);
        });
    },
    //Delete Audit form template section
    deleteAuditFormTemplateSection: (data, callback) => {
        SetupModels.deleteAuditFormTemplateSection(data, function (result) {
            callback(result);
        });
    },
    //Add Audit form template question
    addAuditFormTemplateQuestion: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addAuditFormTemplateQuestion(data, function (result) {
            callback(result);
        });
    },
    //List Audit form template question
    listAuditFormTemplateQuestion: (data, callback) => {
        SetupModels.listAuditFormTemplateQuestion(data, function (result) {
            callback(result);
        });
    },
    //Edit Audit form template question
    editAuditFormTemplateQuestion: (data, callback) => {
        SetupModels.editAuditFormTemplateQuestion(data, function (result) {
            callback(result);
        });
    },
    //Delete Audit form template question
    deleteAuditFormTemplateQuestion: (data, callback) => {
        SetupModels.deleteAuditFormTemplateQuestion(data, function (result) {
            callback(result);
        });
    },
    //Add Audit form template score
    addAuditFormTemplateScore: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addAuditFormTemplateScore(data, function (result) {
            callback(result);
        });
    },
    //List Audit form template score
    listAuditFormTemplateScore: (data, callback) => {
        SetupModels.listAuditFormTemplateScore(data, function (result) {
            callback(result);
        });
    },
    //Edit Audit form template score
    editAuditFormTemplateScore: (data, callback) => {
        SetupModels.editAuditFormTemplateScore(data, function (result) {
            callback(result);
        });
    },
    //add Hazardous Type
    addHazardousType: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addHazardousType(data, function (result) {
            callback(result);
        });
    },
    //edit Hazardous Type
    editHazardousType: (data, callback) => {
        SetupModels.editHazardousType(data, function (result) {
            callback(result);
        });
    },
    //list Hazardous Type
    listHazardousType: (data, callback) => {
        SetupModels.listHazardousType(data, function (result) {
            callback(result);
        });
    },
    //Delete Hazardous Type
    deleteHazardousType: (data, callback) => {
        SetupModels.deleteHazardousType(data, function (result) {
            callback(result);
        });
    },
    //add Competency Group
    addCompetencyGroup: (data, callback) => {
        data._id = new ObjectID;
        SetupModels.addCompetencyGroup(data, function (result) {
            callback(result);
        });
    },
    //edit Competency Group
    editCompetencyGroup: (data, callback) => {
        SetupModels.editCompetencyGroup(data, function (result) {
            callback(result);
        });
    },
    //list Competency Group
    listCompetencyGroup: (data, callback) => {
        SetupModels.listCompetencyGroup(data, function (result) {
            callback(result);
        });
    },
    //Delete Competency Group
    deleteCompetencyGroup: (data, callback) => {
        SetupModels.deleteCompetencyGroup(data, function (result) {
            callback(result);
        });
    },
    //Get competency group by skill
    getCompetencyGroupBySkill: (data, callback) => {
        SetupModels.getCompetencyGroupBySkill(data, function (result) {
            callback(result);
        });
    },
    //Add form template
    addFormTemplate: (data, callback) => {
        data._id = new ObjectID;
        var fieldSaveData = [];
        if (data.fieldList.length > 0) {
            for (var i = 0; i < data.fieldList.length; i++) {
                var item = data.fieldList[i];
                var itemOption = [];
                if (item.optionVal != '' && item.optionVal != null && item.optionVal != undefined) {
                    if (item.optionVal.length > 0) {
                        for (var x = 0; x < item.optionVal.length; x++) {
                            itemOption[x] = {
                                _id: new ObjectID,
                                value: item.optionVal[x].value
                            }
                        }
                    }
                }
                fieldSaveData[i] = {
                    _id: new ObjectID,
                    companyId: data.companyId,
                    userId: data.userId,
                    formId: data._id,
                    level: item.level,
                    type: item.type,
                    optionVal: itemOption
                }
            }
            data.fieldList = fieldSaveData;
        }
        SetupModels.addFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //List Form template
    listFormTemplate: (data, callback) => {
        SetupModels.listFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //Delete Form template
    deleteFormTemplate: (data, callback) => {
        SetupModels.deleteFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //Detail Form template
    detailFormTemplate: (data, callback) => {
        SetupModels.detailFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //Edit Form template
    editFormTemplate: (data, callback) => {
        var fieldSaveData = [];
        if (data.fieldList.length > 0) {
            for (var i = 0; i < data.fieldList.length; i++) {
                var item = data.fieldList[i];
                var itemOption = [];
                if (item.optionVal != '' && item.optionVal != null && item.optionVal != undefined) {
                    if (item.optionVal.length > 0) {
                        for (var x = 0; x < item.optionVal.length; x++) {
                            if (item.optionVal[x]._id == '' || item.optionVal[x]._id == null || item.optionVal[x]._id == undefined) {
                                item.optionVal[x]._id = new ObjectID;
                            }
                            itemOption[x] = {
                                _id: item.optionVal[x]._id,
                                value: item.optionVal[x].value
                            }
                        }
                    }
                }
                if (item._id == '' || item._id == null || item._id == undefined) {
                    item._id = new ObjectID;
                }
                fieldSaveData[i] = {
                    _id: item._id,
                    companyId: data.companyId,
                    userId: data.userId,
                    formId: data._id,
                    level: item.level,
                    type: item.type,
                    optionVal: itemOption
                }
            }
            data.fieldList = fieldSaveData;
        }
        SetupModels.editFormTemplate(data, function (result) {
            callback(result);
        });
    },
    //Form templete module list
    formTemplateModuleList: (callback) => {
        var listArr = [
            { value: 'plant', level: 'Assets' },
            { value: 'supplier', level: 'Conductors/Suppliers' },
            { value: 'hr', level: 'Human Resource' },
            { value: 'formSubmission', level: 'Form Submission' },
            { value: 'meeting', level: 'Meeting' },
        ];
        callback({
            "response_code": 200,
            "response_message": "List.",
            "response_data": listArr
        });
    },
    // Set module for form template
    moduleMappingFormTemplate: (data, callback) => {
        if(data.type!='' && data.type!=null && data.type!=undefined){
            data.type= data.type.split(",");
        }
        SetupModels.moduleMappingFormTemplate(data, function (result) {
            callback(result);
        });
    },
    // Module details for form template
    moduleDetailsFormTemplate: (data, callback) => {
        SetupModels.moduleDetailsFormTemplate(data, function (result) {
            callback(result);
        });
    },


}
module.exports = setupService;