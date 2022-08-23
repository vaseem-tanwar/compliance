var supplierCategorySchema = require('../schema/supplierCategory');
var workplaceSchema = require('../schema/workplace');
var branchSchema = require('../schema/branch');
var addressSchema = require('../schema/address');
var taskTypeSchema = require('../schema/taskType');
var plantCategorySchema = require('../schema/plantCategory');
var plantUnitSchema = require('../schema/plantUnit');
var skillSchema = require('../schema/skill');
var positionSchema = require('../schema/position');
var accessSectionSchema = require('../schema/accessSection');
var accessProfileSchema = require('../schema/accessProfile');
var competencyLevelSchema = require('../schema/competencyLevel');
var accessorSchema = require('../schema/accessor');
var supplierSchema = require('../schema/supplier');
var employeeSchema = require('../schema/employee');
var causeSchema = require('../schema/cause');
var additionalInformationSchema = require('../schema/additionalInformation');
var workShiftSchema = require('../schema/workShift');
var typeSchema = require('../schema/type');
var codeSchema = require('../schema/code');
var personReportingSchema = require('../schema/personReporting');
var potentialSeveritySchema = require('../schema/potentialSeverity');
var observationCategorySchema = require('../schema/observationCategory');
var observationTypeSchema = require('../schema/observationType');
var observationWorkFlowDetailSchema = require('../schema/obserVationWorkFlowDetail');
var observationStageDefinationSchema = require('../schema/observationStageDefination');
var injuryCategorySchema = require('../schema/injuryCategory');
var taskSchema = require('../schema/task');
var accidentReportSchema = require('../schema/accidentReport');
var riskTypeSchema = require('../schema/reskType');
var initialLikelihoodSchema = require('../schema/initialLikelihood');
var initialConsequenceSchema = require('../schema/initialConsequence');
var initialRatingSchema = require('../schema/initialRating');
var residualLikelihoodSchema = require('../schema/residualLikelihood');
var residualConsequenceSchema = require('../schema/residualConsequence');
var finalRatingSchema = require('../schema/finalRating');
var auditFormTemplateSchema = require('../schema/auditFormTemplate');
var auditFormSectionSchema = require('../schema/auditFormSection');
var auditFormSectionQuestionSchema = require('../schema/auditFormSectionQuestion');
var auditFormSectionScoreSchema = require('../schema/auditFormSectionScore');
var plantSchema = require('../schema/plant');
var auditSchema = require('../schema/audit');
var environmentalReportSchema = require('../schema/environmentalReport');
var accidentReportSchema = require('../schema/accidentReport');
var hazardousTypeSchema = require('../schema/hazardousType');
var competencyGroupSchema = require('../schema/competencyGroup');
var formTemplateSchema = require('../schema/formTemplate');
var formFieldSchema = require('../schema/formField');
var userSchema = require('../schema/user');
var _async = require("async");
var config = require('../config.js');
var fs = require('fs');
var mongo = require('mongodb');

var SetupModels = {
    dashboard: async function (data, callback) {
        if (data) {
            var userDetails = await userSchema.findOne(
                { _id: data.userId },
                { employeeId: 1 });

            _async.parallel({
                observation: function (CallBack) {
                    accidentReportSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                stage: { $lt: 4 },
                                $or: [
                                    { investigator: { $elemMatch: { userId: userDetails.employeeId } } },
                                    { coordinator: userDetails.employeeId }
                                ]
                            }
                        },
                        {
                            $project: {
                                description: 1,
                                _id: 1,
                                createdAt: 1
                            }
                        },
                        {
                            $limit: 5
                        },
                        {
                            $sort: { createdAt: -1 }
                        }
                    ], async function (err, res) {
                        var dataRes = {
                            list: res,
                            total: res.length
                        }
                        CallBack(null, dataRes)
                    })
                },
                task: function (CallBack) {
                    taskSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                detail: 1,
                                dueDate: 1,
                                _id: 1,
                                createdAt: 1
                            }
                        },
                        {
                            $limit: 5
                        },
                        {
                            $sort: { createdAt: -1 }
                        }
                    ], async function (err, res) {
                        var totalCount = await taskSchema.countDocuments({ companyId: data.companyId, isDelete: 'no' });
                        var dataRes = {
                            list: res,
                            total: totalCount
                        }
                        CallBack(null, dataRes)
                    })
                }
            }, function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "List.",
                        "response_data": result
                    });
                }
            })
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addSupplierCategory: function (data, callback) {
        if (data) {
            new supplierCategorySchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Category added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editSupplierCategory: function (data, callback) {
        if (data) {
            supplierCategorySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listSupplierCategory: function (data, callback) {
        if (data) {
            supplierCategorySchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteSupplierCategory: function (data, callback) {
        if (data) {
            supplierCategorySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addWorkplace: function (data, callback) {
        if (data) {
            new workplaceSchema(data).save(async function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    data.workplace = result._id;
                    await supplierSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                    await plantSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                    await employeeSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                    await taskSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                    await auditSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                    await environmentalReportSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                    await accidentReportSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editWorkplace: function (data, callback) {
        if (data) {
            workplaceSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        branch: data.branch
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        data.workplace = data._id;
                        await supplierSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                        await plantSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                        await employeeSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                        await taskSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                        await auditSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                        await environmentalReportSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                        await accidentReportSchema.updateMany({ workplace: data.workplace }, { $set: { branch: data.branch } });
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listWorkplace: function (data, callback) {
        if (data) {
            workplaceSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $lookup:
                    {
                        from: "branches",
                        localField: "branch",
                        foreignField: "_id",
                        as: "Branch"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        branchDetails: '$Branch'
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result.length > 0) {
                            for (let i = 0; i < result.length; i++) {
                                let item = result[i];
                                if (item.branchDetails.length > 0) {
                                    result[i].branch = item.branchDetails[0]._id;
                                    result[i].branchName = item.branchDetails[0].name;
                                } else {
                                    result[i].branch = '';
                                    result[i].branchName = '';
                                }
                                delete result[i].branchDetails;
                            }
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteWorkplace: function (data, callback) {
        if (data) {
            workplaceSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addBranch: function (data, callback) {
        if (data) {
            new branchSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Branch added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    viewBranch: function (data, callback) {
        if (data) {
            branchSchema.aggregate([
                {
                    $match: {
                        _id: data._id
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        createdAt: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Branch Details.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editBranch: function (data, callback) {
        if (data) {
            branchSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Branch updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listBranch: function (data, callback) {
        if (data) {
            branchSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Branch List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteBranch: function (data, callback) {
        if (data) {
            branchSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, async function (err, result) {
                    if (err) {
                        nextCb(null, {
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        await addressSchema.deleteOne({ sourceId: data._id });
                        callback({
                            "response_code": 200,
                            "response_message": "Branch deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listBranchByWorkplace: function (data, callback) {
        if (data) {
            branchSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no',
                        workplace: data.workplace
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Branch List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    getBranchByWorkplace: function (data, callback) {
        if (data) {
            workplaceSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        _id: data.workplace
                    }
                },
                {
                    $lookup:
                    {
                        from: "branches",
                        localField: "branch",
                        foreignField: "_id",
                        as: "Branch"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        BranchDetails: '$Branch'
                    }
                }
            ], function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (result.length > 0) {
                        result = result[0];
                        if (result.BranchDetails.length > 0) {
                            result = {
                                branchName: result.BranchDetails[0].name,
                                branch: result.BranchDetails[0]._id
                            }
                        } else {
                            result = {
                                branchName: '',
                                branch: ''
                            }
                        }
                    } else {
                        result = {
                            branchName: '',
                            branch: ''
                        }
                    }
                    callback({
                        "response_code": 200,
                        "response_message": "Branch Details.",
                        "response_data": result
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addTaskType: function (data, callback) {
        if (data) {
            new taskTypeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Task type added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editTaskType: function (data, callback) {
        if (data) {
            taskTypeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Task type updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listTaskType: function (data, callback) {
        if (data) {
            taskTypeSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Task type List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteTaskType: function (data, callback) {
        if (data) {
            taskTypeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "data  deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addPlantCategory: function (data, callback) {
        if (data) {
            new plantCategorySchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Category added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editPlantCategory: function (data, callback) {
        if (data) {
            plantCategorySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listPlantCategory: function (data, callback) {
        if (data) {
            plantCategorySchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deletePlantCategory: function (data, callback) {
        if (data) {
            plantCategorySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addPlantUnit: function (data, callback) {
        if (data) {
            new plantUnitSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Unit added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editPlantUnit: function (data, callback) {
        if (data) {
            plantUnitSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Unit updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listPlantUnit: function (data, callback) {
        if (data) {
            plantUnitSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Unit List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deletePlantUnit: function (data, callback) {
        if (data) {
            plantUnitSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Unit deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addSkill: function (data, callback) {
        if (data) {
            new skillSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Skill added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editSkill: function (data, callback) {
        if (data) {
            skillSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        description: data.description,
                        competencyGroup: data.competencyGroup
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Skill updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listSkill: function (data, callback) {
        if (data) {
            skillSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        competencyGroup: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Skill List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteSkill: function (data, callback) {
        if (data) {
            skillSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Skill deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addPosition: function (data, callback) {
        if (data) {
            if (data.skill != '' && data.skill != null && data.skill != undefined) {
                data.skill = data.skill.split(",");
            }
            new positionSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Position added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editPosition: function (data, callback) {
        if (data) {
            if (data.skill != '' && data.skill != null && data.skill != undefined) {
                data.skill = data.skill.split(",");
            }
            positionSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        description: data.description,
                        skill: data.skill
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (data.attachment.length > 0) {
                            for (var a = 0; a < data.attachment.length; a++) {
                                await positionSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { attachment: data.attachment[a] } })
                            }
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "Skill updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deletePosition: function (data, callback) {
        if (data) {
            positionSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listPosition: function (data, callback) {
        if (data) {
            positionSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Skill List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    getPositionDetails: function (data, callback) {
        if (data) {
            positionSchema.aggregate([
                {
                    $match: {
                        _id: data.positionId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        attachment: 1,
                        description: 1,
                        skill: 1,
                        attachment: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Position Details.",
                            "response_data": {
                                details: result[0],
                                filePath: config.apiUrl
                            }
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteFilePosition: function (data, callback) {
        if (data) {
            positionSchema.findOne(
                { attachment: { $elemMatch: { _id: data.fileId } } },
                { 'attachment.$': 1 },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        positionSchema.updateOne(
                            {
                                _id: data._id
                            },
                            {
                                $pull: { attachment: { _id: data.fileId } }
                            },
                            function (err, resDel) {
                                if (err) {
                                    callback({
                                        "response_code": 505,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    fs.unlinkSync('public/' + result.attachment[0].path)
                                    callback({
                                        "response_code": 200,
                                        "response_message": "File deleted.",
                                        "response_data": {}
                                    });
                                }
                            });
                    }
                })
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listAccessSection: function (callback) {
        accessSectionSchema.aggregate([
            {
                $project: {
                    title: 1,
                    keyField: 1,
                    isAccess: 1,
                    isAdd: 1,
                    isEdit: 1,
                    isDelete: 1,
                    serialNo: 1,
                    createdAt: 1
                }
            },
            {
                $sort: {
                    serialNo: 1,
                    createdAt: 1
                }

            }
        ], function (err, result) {
            if (err) {
                callback({
                    "response_code": 505,
                    "response_message": "INTERNAL DB ERROR",
                    "response_data": {}
                });
            } else {
                callback({
                    "response_code": 200,
                    "response_message": "List.",
                    "response_data": result
                });
            }
        })
    },

    addAccessProfile: function (data, callback) {
        if (data) {
            new accessProfileSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listAccessProfile: function (data, callback) {
        accessProfileSchema.aggregate([
            {
                $match: {
                    companyId: data.companyId
                }
            },
            {
                $project: {
                    name: 1
                }
            },
            {
                $sort: {
                    name: 1
                }

            }
        ], function (err, result) {
            if (err) {
                callback({
                    "response_code": 505,
                    "response_message": "INTERNAL DB ERROR",
                    "response_data": {}
                });
            } else {
                callback({
                    "response_code": 200,
                    "response_message": "List.",
                    "response_data": result
                });
            }
        })
    },

    accessProfileDetails: function (data, callback) {
        accessProfileSchema.findOne(
            {
                _id: data.accessId,
                companyId: data.companyId
            },
            {
                name: 1,
                accessProfile: 1
            }, function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Details.",
                        "response_data": result
                    });
                }
            })
    },

    editAccessProfile: function (data, callback) {
        if (data) {
            accessProfileSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        accessProfile: data.accessProfile
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addCompetencyLevel: function (data, callback) {
        if (data) {
            new competencyLevelSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editCompetencyLevel: function (data, callback) {
        if (data) {
            competencyLevelSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listCompetencyLevel: function (data, callback) {
        if (data) {
            competencyLevelSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteCompetencyLevel: function (data, callback) {
        if (data) {
            competencyLevelSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addAccessor: function (data, callback) {
        if (data) {
            new accessorSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listAccessor: function (data, callback) {
        if (data) {
            accessorSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $lookup:
                    {
                        from: "employees",
                        localField: "approvedBy",
                        foreignField: "_id",
                        as: "ApprovedEmp"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        accessor: 1,
                        approvedBy: '$ApprovedEmp',
                        createdAt: 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1

                    }
                }], async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        })
                    } else {
                        if (result.length > 0) {
                            for (let i = 0; i < result.length; i++) {
                                let item = result[i];
                                if (item.approvedBy.length > 0) {
                                    result[i].approvedBy = item.approvedBy[0].firstName + ' ' + item.approvedBy[0].lastName;
                                } else {
                                    result[i].approvedBy = '';
                                }
                                if (item.type == 'employee') {
                                    var accessorRes = await employeeSchema.findOne({ _id: item.accessor }, { _id: 0, firstName: 1, lastName: 1 });
                                    result[i].accessor = accessorRes.firstName + ' ' + accessorRes.lastName;
                                } else if (item.type == 'supplier') {
                                    var accessorRes = await supplierSchema.findOne({ _id: item.accessor }, { _id: 0, name: 1 });
                                    result[i].accessor = accessorRes.name;
                                } else {
                                    result[i].accessor = '';
                                }
                            }
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "List",
                            "response_data": result
                        })
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    accessorDetails: function (data, callback) {
        if (data) {
            accessorSchema.aggregate([
                {
                    $match: {
                        _id: data.accessorId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        type: 1,
                        accessor: 1,
                        assesmentCat: 1,
                        approvedBy: 1,
                        createdAt: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Accessor Details.",
                            "response_data": result[0]
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editAccessor: function (data, callback) {
        if (data) {
            accessorSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        approvedBy: data.approvedBy
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteAccessor: function (data, callback) {
        if (data) {
            accessorSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addCause: function (data, callback) {
        if (data) {
            new causeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editCause: function (data, callback) {
        if (data) {
            causeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listCause: function (data, callback) {
        if (data) {
            causeSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no',
                        type: data.type,
                        category: data.category
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteCause: function (data, callback) {
        if (data) {
            causeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addAdditionalInformation: function (data, callback) {
        if (data) {
            new additionalInformationSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editAdditionalInformation: function (data, callback) {
        if (data) {
            additionalInformationSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteAdditionalInformation: function (data, callback) {
        if (data) {
            additionalInformationSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listAdditionalInformation: function (data, callback) {
        if (data) {
            additionalInformationSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no',
                        category: data.category
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addWorkShift: function (data, callback) {
        if (data) {
            new workShiftSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editWorkShift: function (data, callback) {
        if (data) {
            workShiftSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listWorkShift: function (data, callback) {
        if (data) {
            workShiftSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no',
                        category: data.category
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteWorkShift: function (data, callback) {
        if (data) {
            workShiftSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, async function (err, result) {
                    if (err) {
                        nextCb(null, {
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Branch deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addType: function (data, callback) {
        if (data) {
            new typeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editType: function (data, callback) {
        if (data) {
            typeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        description: data.description
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteType: function (data, callback) {
        if (data) {
            typeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listType: function (data, callback) {
        if (data) {
            typeSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no',
                        category: data.category
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addCode: function (data, callback) {
        if (data) {
            new codeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editCode: function (data, callback) {
        if (data) {
            codeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        description: data.description
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteCode: function (data, callback) {
        if (data) {
            codeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listCode: function (data, callback) {
        if (data) {
            codeSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no',
                        category: data.category,
                        typeId: data.typeId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addPersonReporting: function (data, callback) {
        if (data) {
            new personReportingSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editPersonReporting: function (data, callback) {
        if (data) {
            personReportingSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deletePersonReporting: function (data, callback) {
        if (data) {
            personReportingSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listPersonReporting: function (data, callback) {
        if (data) {
            personReportingSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        category: data.category,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addPotentialSeverity: function (data, callback) {
        if (data) {
            new potentialSeveritySchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editPotentialSeverity: function (data, callback) {
        if (data) {
            potentialSeveritySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deletePotentialSeverity: function (data, callback) {
        if (data) {
            potentialSeveritySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listPotentialSeverity: function (data, callback) {
        if (data) {
            potentialSeveritySchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        category: data.category,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addObservationCategory: function (data, callback) {
        if (data) {
            new observationCategorySchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editObservationCategory: function (data, callback) {
        if (data) {
            observationCategorySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listObservationCategory: function (data, callback) {
        if (data) {
            // observationCategorySchema.updateMany(
            //     {
            //         '__v':0
            //     },
            //     {
            //         $set:{
            //             category:'environmental'
            //         }
            //     },function(err,res){}
            // )
            observationCategorySchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        category: data.category,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteObservationCategory: function (data, callback) {
        if (data) {
            observationCategorySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addObservationType: function (data, callback) {
        if (data) {
            if (data.emailBcc != '' && data.emailBcc != null && data.emailBcc != undefined) {
                data.emailBcc = data.emailBcc.split(",");
            }
            new observationTypeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editObservationType: function (data, callback) {
        if (data) {
            observationTypeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        emailBcc: data.emailBcc
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteObservationType: function (data, callback) {
        if (data) {
            observationTypeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listObservationType: function (data, callback) {
        if (data) {
            observationTypeSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        category: data.category,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addInjuryCategory: function (data, callback) {
        if (data) {
            new injuryCategorySchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editInjuryCategory: function (data, callback) {
        if (data) {
            injuryCategorySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteInjuryCategory: function (data, callback) {
        if (data) {
            injuryCategorySchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listInjuryCategory: function (data, callback) {
        if (data) {
            injuryCategorySchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    getObservationTypeDetails: function (data, callback) {
        if (data) {
            observationTypeSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no',
                        _id: data.typeId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        emailBcc: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data Details.",
                            "response_data": result[0]
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    setObservationWorkFlowDetails: function (data, callback) {
        if (data) {
            observationWorkFlowDetailSchema.findOne(
                { category: data.category, companyId: data.companyId }, { _id: 1 }, (async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result != null) {
                            data._id = result._id;
                        }
                        observationWorkFlowDetailSchema.updateOne(
                            { category: data.category, companyId: data.companyId },
                            {
                                $set: {
                                    _id: data._id,
                                    createdBy: data.createdBy,
                                    userId: data.userId,
                                    companyId: data.companyId,
                                    title: data.title,
                                    abbreviation: data.abbreviation,
                                    setToInvestigator: data.setToInvestigator,
                                    category: data.category,
                                    repeatEveryNumber: data.repeatEveryNumber,
                                    repeatEveryUnit: data.repeatEveryUnit,
                                    coordinator: data.coordinator
                                }
                            }, {
                            upsert: true
                        }, async function (err, updateRes) {
                            if (err) {
                                callback({
                                    "response_code": 505,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                callback({
                                    "response_code": 200,
                                    "response_message": "Data updated",
                                    "response_data": {}
                                });
                            }
                        })
                    }
                }))
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    setObservationWorkFlowStage: function (data, callback) {
        if (data) {
            observationStageDefinationSchema.findOne(
                { category: data.category, companyId: data.companyId }, { _id: 1 }, (async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result != null) {
                            data._id = result._id;
                        }
                        observationStageDefinationSchema.updateOne(
                            { category: data.category, companyId: data.companyId },
                            {
                                $set: {
                                    _id: data._id,
                                    createdBy: data.createdBy,
                                    userId: data.userId,
                                    companyId: data.companyId,
                                    stage1: data.stage1,
                                    stage2: data.stage2,
                                    stage3: data.stage3,
                                    category: data.category,
                                    stage4: data.stage4
                                }
                            }, {
                            upsert: true
                        }, async function (err, updateRes) {
                            if (err) {
                                callback({
                                    "response_code": 505,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                callback({
                                    "response_code": 200,
                                    "response_message": "Data updated",
                                    "response_data": {}
                                });
                            }
                        })
                    }
                }))
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    getObservationWorkFlow: async function (data, callback) {
        if (data) {
            var details = await observationWorkFlowDetailSchema.findOne(
                { category: data.category, companyId: data.companyId },
                { title: 1, abbreviation: 1, category: 1, createdBy: 1, setToInvestigator: 1, repeatEveryNumber: 1, repeatEveryUnit: 1, coordinator: 1 });
            if (details == null) {
                details = {}
            }
            var stageDetails = await observationStageDefinationSchema.findOne(
                { category: data.category, companyId: data.companyId },
                { stage1: 1, stage2: 1, stage3: 1, stage4: 1 });
            if (stageDetails == null) {
                stageDetails = {}
            }
            callback({
                "response_code": 200,
                "response_message": "Details.",
                "response_data": {
                    details: details,
                    stageDetails: stageDetails
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addRiskType: function (data, callback) {
        if (data) {
            new riskTypeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editRiskType: function (data, callback) {
        if (data) {
            riskTypeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listRiskType: function (data, callback) {
        if (data) {
            riskTypeSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteRiskType: function (data, callback) {
        if (data) {
            riskTypeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addInitialLikelihood: function (data, callback) {
        if (data) {
            new initialLikelihoodSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editInitialLikelihood: function (data, callback) {
        if (data) {
            initialLikelihoodSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listInitialLikelihood: function (data, callback) {
        if (data) {
            initialLikelihoodSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteInitialLikelihood: function (data, callback) {
        if (data) {
            initialLikelihoodSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addInitialConsequence: function (data, callback) {
        if (data) {
            new initialConsequenceSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editInitialConsequence: function (data, callback) {
        if (data) {
            initialConsequenceSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listInitialConsequence: function (data, callback) {
        if (data) {
            initialConsequenceSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteInitialConsequence: function (data, callback) {
        if (data) {
            initialConsequenceSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addInitialRating: function (data, callback) {
        if (data) {
            new initialRatingSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editInitialRating: function (data, callback) {
        if (data) {
            initialRatingSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listInitialRating: function (data, callback) {
        if (data) {
            initialRatingSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteInitialRating: function (data, callback) {
        if (data) {
            initialRatingSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addResidualLikelihood: function (data, callback) {
        if (data) {
            new residualLikelihoodSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editResidualLikelihood: function (data, callback) {
        if (data) {
            residualLikelihoodSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listResidualLikelihood: function (data, callback) {
        if (data) {
            residualLikelihoodSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteResidualLikelihood: function (data, callback) {
        if (data) {
            residualLikelihoodSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addResidualConsequence: function (data, callback) {
        if (data) {
            new residualConsequenceSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editResidualConsequence: function (data, callback) {
        if (data) {
            residualConsequenceSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listResidualConsequence: function (data, callback) {
        if (data) {
            residualConsequenceSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteResidualConsequence: function (data, callback) {
        if (data) {
            residualConsequenceSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addFinalRating: function (data, callback) {
        if (data) {
            new finalRatingSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editFinalRating: function (data, callback) {
        if (data) {
            finalRatingSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listFinalRating: function (data, callback) {
        if (data) {
            finalRatingSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteFinalRating: function (data, callback) {
        if (data) {
            finalRatingSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addAuditFormTemplate: function (data, callback) {
        if (data) {
            if (data.auditor != '' && data.auditor != null && data.auditor != undefined) {
                data.auditor = data.auditor.split(",");
            } else {
                data.auditor = [];
            }
            if (data.reviewer != '' && data.reviewer != null && data.reviewer != undefined) {
                data.reviewer = data.reviewer.split(",");
            } else {
                data.reviewer = [];
            }
            new auditFormTemplateSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data Saved.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listAuditFormTemplate: function (data, callback) {
        if (data) {
            auditFormTemplateSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        isActive: 1
                    }
                },
                {
                    $sort: {
                        name: 1

                    }
                }], async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        })
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "List",
                            "response_data": result
                        })
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteAuditFormTemplate: function (data, callback) {
        if (data) {
            auditFormTemplateSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    auditFormTemplateStatusChange: function (data, callback) {
        if (data) {
            auditFormTemplateSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        isActive: data.isActive
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Status changed.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editAuditFormTemplate: function (data, callback) {
        if (data) {
            if (data.auditor != '' && data.auditor != null && data.auditor != undefined) {
                data.auditor = data.auditor.split(",");
            } else {
                data.auditor = [];
            }
            if (data.reviewer != '' && data.reviewer != null && data.reviewer != undefined) {
                data.reviewer = data.reviewer.split(",");
            } else {
                data.reviewer = [];
            }
            auditFormTemplateSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        tooltip: data.tooltip,
                        auditor: data.auditor,
                        reviewer: data.reviewer

                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    getAuditFormTemplateDetails: function (data, callback) {
        if (data) {
            auditFormTemplateSchema.aggregate([
                {
                    $match: {
                        _id: data.templateId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        tooltip: 1,
                        auditor: 1,
                        reviewer: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Details.",
                            "response_data": result[0]
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addAuditFormTemplateSection: function (data, callback) {
        if (data) {
            new auditFormSectionSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data Saved.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listAuditFormTemplateSection: function (data, callback) {
        if (data) {
            auditFormSectionSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        templateId: data.templateId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        tooltip: 1
                    }
                },
                {
                    $sort: {
                        name: 1

                    }
                }], async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        })
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "List",
                            "response_data": result
                        })
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteAuditFormTemplateSection: function (data, callback) {
        if (data) {
            auditFormSectionSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editAuditFormTemplateSection: function (data, callback) {
        if (data) {
            auditFormSectionSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        tooltip: data.tooltip

                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addAuditFormTemplateQuestion: function (data, callback) {
        if (data) {
            new auditFormSectionQuestionSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data Saved.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listAuditFormTemplateQuestion: function (data, callback) {
        if (data) {
            auditFormSectionQuestionSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        templateId: data.templateId,
                        sectionId: data.sectionId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        tooltip: 1
                    }
                },
                {
                    $sort: {
                        name: 1

                    }
                }], async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        })
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "List",
                            "response_data": result
                        })
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteAuditFormTemplateQuestion: function (data, callback) {
        if (data) {
            auditFormSectionQuestionSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editAuditFormTemplateQuestion: function (data, callback) {
        if (data) {
            auditFormSectionQuestionSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        tooltip: data.tooltip

                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addAuditFormTemplateScore: function (data, callback) {
        if (data) {
            new auditFormSectionScoreSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data Saved.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listAuditFormTemplateScore: function (data, callback) {
        if (data) {
            auditFormSectionScoreSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        templateId: data.templateId,
                        sectionId: data.sectionId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        option: 1,
                        score: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: {
                        createdAt: -1

                    }
                }], async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        })
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "List",
                            "response_data": result
                        })
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editAuditFormTemplateScore: function (data, callback) {
        if (data) {
            auditFormSectionScoreSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        option: data.option,
                        score: data.score

                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addHazardousType: function (data, callback) {
        if (data) {
            new hazardousTypeSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Category added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editHazardousType: function (data, callback) {
        if (data) {
            hazardousTypeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listHazardousType: function (data, callback) {
        if (data) {
            hazardousTypeSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteHazardousType: function (data, callback) {
        if (data) {
            hazardousTypeSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Category deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addCompetencyGroup: function (data, callback) {
        if (data) {
            new competencyGroupSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editCompetencyGroup: function (data, callback) {
        if (data) {
            competencyGroupSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listCompetencyGroup: function (data, callback) {
        if (data) {
            competencyGroupSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteCompetencyGroup: function (data, callback) {
        if (data) {
            competencyGroupSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    getCompetencyGroupBySkill: function (data, callback) {
        if (data) {
            skillSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        _id: data.skillId
                    }
                },
                {
                    $lookup:
                    {
                        from: "competencygroups",
                        localField: "competencyGroup",
                        foreignField: "_id",
                        as: "CompetencyGroup"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        GroupDetails: '$CompetencyGroup'
                    }
                }
            ], function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (result.length > 0) {
                        result = result[0];
                        if (result.GroupDetails.length > 0) {
                            result = {
                                groupName: result.GroupDetails[0].name,
                                competencyGroup: result.GroupDetails[0]._id
                            }
                        } else {
                            result = {
                                groupName: '',
                                competencyGroup: ''
                            }
                        }
                    } else {
                        result = {
                            groupName: '',
                            competencyGroup: ''
                        }
                    }
                    callback({
                        "response_code": 200,
                        "response_message": "Group Details.",
                        "response_data": result
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    addFormTemplate: function (data, callback) {
        if (data) {
            new formTemplateSchema(data).save(async function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    await formFieldSchema.insertMany(data.fieldList);
                    callback({
                        "response_code": 200,
                        "response_message": "Data added.",
                        "response_data": {}
                    });
                }
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listFormTemplate: function (data, callback) {
        if (data) {
            formTemplateSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1
                    }
                },
                {
                    $sort: {
                        name: 1
                    }
                }], function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data List.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    deleteFormTemplate: function (data, callback) {
        if (data) {
            formTemplateSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        isDelete: 'yes'
                    }
                }, async function (err, result) {
                    if (err) {
                        nextCb(null, {
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        await formFieldSchema.updateMany(
                            { formId: data._id },
                            {
                                $set: {
                                    isDelete: 'yes'
                                }
                            }
                        );
                        callback({
                            "response_code": 200,
                            "response_message": "Data deleted.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    detailFormTemplate: function (data, callback) {
        if (data) {
            formTemplateSchema.aggregate([
                {
                    $match: {
                        _id: data._id
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        fieldList: 1
                    }
                }], async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result.length > 0) {
                            result = result[0];
                            var fieldList = await formFieldSchema.find(
                                { formId: data._id, isDelete: 'no' },
                                {
                                    level: 1,
                                    type: 1,
                                    optionVal: 1,
                                }
                            );
                            result.fieldList = fieldList;
                            if (result.fieldList.length > 0) {
                                for (var i = 0; i < result.fieldList.length; i++) {
                                    var fieldItem = result.fieldList[i];
                                    if (fieldItem.type == 'submission') {
                                        if (fieldItem.optionVal.length > 0) {
                                            for (var c = 0; c < fieldItem.optionVal.length; c++) {
                                                var optionItem = fieldItem.optionVal[c];
                                                var empRes = await employeeSchema.findOne({ _id: optionItem.value }, { _id: 0, firstName: 1, lastName: 1 });
                                                if(empRes!=null){
                                                    var employeeName = empRes.firstName + ' ' + empRes.lastName;
                                                } else {
                                                    var employeeName = ''
                                                }
                                                result.fieldList[i].optionVal[c] = {
                                                    value: optionItem.value, 
                                                    _id:  optionItem._id, 
                                                    employeeName:employeeName
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "Details.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editFormTemplate: async function (data, callback) {
        if (data) {
            formTemplateSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        name: data.name
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        await formFieldSchema.deleteMany({ formId: data._id });
                        await formFieldSchema.insertMany(data.fieldList);
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    moduleMappingFormTemplate: async function (data, callback) {
        if (data) {
            formTemplateSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: {
                        type: data.type
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {}
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    moduleDetailsFormTemplate: async function (data, callback) {
        if (data) {
            formTemplateSchema.findOne(
                {
                    _id: data._id
                },
                { type: 1 }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        callback({
                            "response_code": 200,
                            "response_message": "type list.",
                            "response_data": result
                        });
                    }
                });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    }
}

module.exports = SetupModels;