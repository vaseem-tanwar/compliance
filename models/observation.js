
var config = require('../config.js');
var _async = require("async");
var fs = require('fs');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;

var CompanySchema = require('../schema/company');
var EmployeeSchema = require('../schema/employee');
var UserSchema = require('../schema/user');
var observationTypeSchema = require('../schema/observationType');
var additionalInformationSchema = require('../schema/additionalInformation');
var SupplierSchema = require('../schema/supplier');
var workplaceSchema = require('../schema/workplace');
var plantSchema = require('../schema/plant');
var observationWorkFlowDetailSchema = require('../schema/obserVationWorkFlowDetail');
var environmentalReportSchema = require('../schema/environmentalReport');
var workShiftSchema = require('../schema/workShift');
var accidentReportSchema = require('../schema/accidentReport');
var observationStageDefinationSchema = require('../schema/observationStageDefination');
var personReportingSchema = require('../schema/personReporting');
var potentialSeveritySchema = require('../schema/potentialSeverity');
var typeSchema = require('../schema/type');
var injuryCategorySchema = require('../schema/injuryCategory');
var causeSchema = require('../schema/cause');
var observationCategorySchema = require('../schema/observationCategory');
var accidentStageDetailSchema = require('../schema/accidentStageDetail');
var environmentalStageDetailSchema = require('../schema/environmentalStageDetail');
var ncrReportSchema = require('../schema/ncrReport');
var ncrStageDetailSchema = require('../schema/ncrStageDetail');
var ObservationModels = {
    environmentalRelatedDataList: async function (data, callback) {
        if (data) {
            _async.parallel({
                typeObservation: function (CallBack) {
                    observationTypeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no',
                                category: 'environmental'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                employee: function (CallBack) {
                    EmployeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: { $concat: ["$firstName", " ", "$lastName",] },
                                _id: 1,
                                userId:'$_id',
                                userType:'employee'
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                workplace: function (CallBack) {
                    workplaceSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                coordinator: function (CallBack) {
                    observationWorkFlowDetailSchema.findOne(
                        { category: 'environmental', companyId: data.companyId },
                        { coordinator: 1 },
                        async function (err, res) {
                            if (err) {
                                CallBack(null, [])
                            } else {
                                if (res == null) {
                                    CallBack(null, [])
                                } else {
                                    if (res.coordinator.length) {
                                        var allList = [];
                                        for (var c = 0; c < res.coordinator.length; c++) {
                                            var empId = res.coordinator[c];
                                            var details = await EmployeeSchema.aggregate([
                                                {
                                                    $match: {
                                                        _id: empId
                                                    }
                                                },
                                                {
                                                    $project: {
                                                        name: { $concat: ["$firstName", " ", "$lastName",] },
                                                        _id: 1
                                                    }
                                                },
                                                {
                                                    $sort: { name: 1 }
                                                }
                                            ]);
                                            allList.push(details[0])
                                        }
                                        CallBack(null, allList)
                                    } else {
                                        CallBack(null, [])
                                    }
                                }
                            }
                        }
                    )
                },
                bccEmail: function (CallBack) {
                    EmployeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: { $concat: ["$firstName", " ", "$lastName", " ", "(E)"] },
                                userId: '$_id',
                                _id: 0,
                                userType: 'employee'
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                workShift: function (CallBack) {
                    workShiftSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no',
                                category: 'environmental'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                stage: function (CallBack) {
                    observationStageDefinationSchema.findOne(
                        { companyId: data.companyId, category: 'environmental' },
                        { stage1: 1, stage2: 1, stage3: 1, stage4: 1 }, function (err, res) {
                            CallBack(null, res)
                        });
                },
            }, function (err, resList) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data list.",
                        "response_data": resList
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

    generateEnviromentalReport: async function (data, callback) {
        if (data) {
            var count = await environmentalReportSchema.countDocuments();
            if (count == 0) {
                data.number = 1;
            } else {
                data.number = parseInt(count + 1);
            }
            var stageDetails = await observationStageDefinationSchema.findOne({ companyId: data.companyId, category: 'environmental' }, { stage1: 1 });
            data.stageDetails = stageDetails.stage1;
            new environmentalReportSchema(data).save(async function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    var userDetails = await UserSchema.findOne({ _id: data.userId }, { userType: 1 });
                    var stageData = {
                        _id: data._id,
                        createdBy: userDetails.userType,
                        userId: data.userId,
                        companyId: data.companyId,
                        reportId: result._id,
                        stageStep: 1,
                        stageDetails: stageDetails.stage1,
                        comment: 'created'
                    }
                    new environmentalStageDetailSchema(stageData).save();
                    callback({
                        "response_code": 200,
                        "response_message": "Report Generated.",
                        "response_data": result.number
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

    accidentRelatedDataList: async function (data, callback) {
        if (data) {
            _async.parallel({
                typeObservation: function (CallBack) {
                    observationTypeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no',
                                category: 'accident'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                additionalInfo: function (CallBack) {
                    additionalInformationSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no',
                                category: 'accident'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                employee: function (CallBack) {
                    EmployeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: { $concat: ["$firstName", " ", "$lastName",] },
                                _id: 1,
                                userId:'$_id',
                                userType:'employee'
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                supplier: function (CallBack) {
                    SupplierSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { firstName: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                workplace: function (CallBack) {
                    workplaceSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                plant: function (CallBack) {
                    plantSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                coordinator: function (CallBack) {
                    observationWorkFlowDetailSchema.findOne(
                        { category: 'accident', companyId: data.companyId },
                        { coordinator: 1 },
                        async function (err, res) {
                            if (err) {
                                CallBack(null, [])
                            } else {
                                if (res == null) {
                                    CallBack(null, [])
                                } else {
                                    if (res.coordinator.length) {
                                        var allList = [];
                                        for (var c = 0; c < res.coordinator.length; c++) {
                                            var empId = res.coordinator[c];
                                            var details = await EmployeeSchema.aggregate([
                                                {
                                                    $match: {
                                                        _id: empId
                                                    }
                                                },
                                                {
                                                    $project: {
                                                        name: { $concat: ["$firstName", " ", "$lastName",] },
                                                        _id: 1
                                                    }
                                                },
                                                {
                                                    $sort: { name: 1 }
                                                }
                                            ]);
                                            allList.push(details[0])
                                        }
                                        CallBack(null, allList)
                                    } else {
                                        CallBack(null, [])
                                    }
                                }
                            }
                        }
                    )
                },
                bccEmail: function (CallBack) {
                    EmployeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: { $concat: ["$firstName", " ", "$lastName", " ", "(E)"] },
                                userId: '$_id',
                                _id: 0,
                                userType: 'employee'
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                reportingPerson: function (CallBack) {
                    personReportingSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                category: 'accident',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                type: function (CallBack) {
                    typeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                category: 'accident',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                potentialSeverity: function (CallBack) {
                    potentialSeveritySchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                category: 'accident',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                injuryCategory: function (CallBack) {
                    injuryCategorySchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                causeA: function (CallBack) {
                    causeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                category: 'accident',
                                isDelete: 'no',
                                'type':'A'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                stage: function (CallBack) {
                    observationStageDefinationSchema.findOne(
                        { companyId: data.companyId, category: 'accident' },
                        { stage1: 1, stage2: 1, stage3: 1, stage4: 1 }, function (err, res) {
                            CallBack(null, res)
                        });
                },
            }, function (err, resList) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data list.",
                        "response_data": resList
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

    generateAccidentReport: async function (data, callback) {
        if (data) {
            var count = await accidentReportSchema.countDocuments();
            if (count == 0) {
                data.number = 1;
            } else {
                data.number = parseInt(count + 1);
            }
            var stageDetails = await observationStageDefinationSchema.findOne({ companyId: data.companyId, category: 'accident' }, { stage1: 1 });
            data.stageDetails = stageDetails.stage1;
            new accidentReportSchema(data).save(async function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    var userDetails = await UserSchema.findOne({ _id: data.userId }, { userType: 1 });
                    var stageData = {
                        _id: data._id,
                        createdBy: userDetails.userType,
                        userId: data.userId,
                        companyId: data.companyId,
                        reportId: result._id,
                        stageStep: 1,
                        stageDetails: stageDetails.stage1,
                        comment: 'created'
                    }
                    new accidentStageDetailSchema(stageData).save();
                    callback({
                        "response_code": 200,
                        "response_message": "Report Generated.",
                        "response_data": result.number
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

    setObservationDefination: async function (data, callback) {
        if (data) {
            observationStageDefinationSchema.findOne(
                { category: data.category, companyId: data.companyId },
                { _id: 1 }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result != null) {
                            data._id = result._id;
                            observationStageDefinationSchema.updateOne(
                                { category: data.category, companyId: data.companyId },
                                {
                                    $set: {
                                        _id: data._id,
                                        userId: data.userId,
                                        companyId: data.companyId,
                                        stage1: data.stage1,
                                        stage2: data.stage2,
                                        stage3: data.stage3,
                                        stage4: data.stage4,
                                        category: data.category
                                    }
                                },
                                {
                                    upsert: true
                                }, function (err, updateRes) {
                                    if (err) {
                                        callback({
                                            "response_code": 505,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": {}
                                        });
                                    } else {
                                        callback({
                                            "response_code": 200,
                                            "response_message": "Data saved.",
                                            "response_data": {}
                                        });
                                    }
                                })
                        }
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

    listMyInvestigationAccident: async function (data, callback) {
        if (data) {
            var userDetails = await UserSchema.findOne(
                { _id: data.userId },
                { employeeId: 1 });
            accidentReportSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        $or:[
                            {investigator: {$elemMatch: {userId:userDetails.employeeId}}},
                            {coordinator:userDetails.employeeId}
                        ]
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
                    $lookup:
                    {
                        from: "workplaces",
                        localField: "workplace",
                        foreignField: "_id",
                        as: "Workplace"
                    }
                },
                {
                    $lookup:
                    {
                        from: "observationtypes",
                        localField: "typeObservation",
                        foreignField: "_id",
                        as: "Type"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        number: 1,
                        stage: 1,
                        stageDetails: 1,
                        completedDate: 1,
                        type: '$Type.name',
                        branch: '$Branch.name',
                        workplace: '$Workplace.name',
                    }
                },
                {
                    $sort:{
                        number:1
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
                        "response_message": "List",
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

    listAccidentRegistered: async function (data, callback) {
        if (data) {
            accidentReportSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId
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
                    $lookup:
                    {
                        from: "workplaces",
                        localField: "workplace",
                        foreignField: "_id",
                        as: "Workplace"
                    }
                },
                {
                    $lookup:
                    {
                        from: "observationtypes",
                        localField: "typeObservation",
                        foreignField: "_id",
                        as: "Type"
                    }
                },
                {
                    $lookup:
                    {
                        from: "employees",
                        localField: "coordinator",
                        foreignField: "_id",
                        as: "Coordinator"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        number: 1,
                        stage: 1,
                        stageDetails: 1,
                        source: 1,
                        sourceOtherName: 1,
                        sourceId: 1,
                        completedDate: 1,
                        type: '$Type.name',
                        branch: '$Branch.name',
                        workplace: '$Workplace.name',
                        'coordinator.firstName': '$Coordinator.firstName',
                        'coordinator.lastName': '$Coordinator.lastName'
                    }
                },
                {
                    $sort:{
                        number:1
                    }
                }
            ], async function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (result.length > 0) {
                        for (var r = 0; r < result.length; r++) {
                            if (result[r].source == 'other' || result[r].source == 'supplier') {
                                result[r].sourceName = result[r].sourceOtherName;
                            } else if (result[r].source == 'employee') {
                                var details = await EmployeeSchema.findOne({ _id: result[r].sourceId }, { firstName: 1, lastName: 1, _id: 0 })
                                if(details!=null){
                                    result[r].sourceName = details.firstName + ' ' + details.lastName;
                                } else {
                                    result[r].sourceName='';
                                }
                            }
                        }
                    }
                    callback({
                        "response_code": 200,
                        "response_message": "List",
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

    accidentReportDetails: async function (data, callback) {
        if (data) {
            accidentReportSchema.findOne(
                {
                    _id: data.reportId
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
                            "response_message": "Details",
                            "response_data": {
                                details: result,
                                filePath: config.apiUrl
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

    listMyInvestigationEnvironmental: async function (data, callback) {
        if (data) {
            var userDetails = await UserSchema.findOne(
                { _id: data.userId },
                { employeeId: 1 });
            environmentalReportSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        $or:[
                            {investigator: {$elemMatch: {userId:userDetails.employeeId}}},
                            {coordinator:userDetails.employeeId}
                        ]
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
                    $lookup:
                    {
                        from: "workplaces",
                        localField: "workplace",
                        foreignField: "_id",
                        as: "Workplace"
                    }
                },
                {
                    $lookup:
                    {
                        from: "observationtypes",
                        localField: "typeObservation",
                        foreignField: "_id",
                        as: "Type"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        number: 1,
                        stage: 1,
                        stageDetails: 1,
                        completedDate: 1,
                        type: '$Type.name',
                        branch: '$Branch.name',
                        workplace: '$Workplace.name',
                    }
                },
                {
                    $sort:{
                        number:1
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
                        "response_message": "List",
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

    listEnvironmentalRegistered: async function (data, callback) {
        if (data) {
            environmentalReportSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId
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
                    $lookup:
                    {
                        from: "workplaces",
                        localField: "workplace",
                        foreignField: "_id",
                        as: "Workplace"
                    }
                },
                {
                    $lookup:
                    {
                        from: "observationtypes",
                        localField: "typeObservation",
                        foreignField: "_id",
                        as: "Type"
                    }
                },
                {
                    $lookup:
                    {
                        from: "employees",
                        localField: "coordinator",
                        foreignField: "_id",
                        as: "Coordinator"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        number: 1,
                        stage: 1,
                        stageDetails: 1,
                        completedDate: 1,
                        investigator: 1,
                        type: '$Type.name',
                        branch: '$Branch.name',
                        workplace: '$Workplace.name',
                        'coordinator.firstName': '$Coordinator.firstName',
                        'coordinator.lastName': '$Coordinator.lastName'
                    }
                },
                {
                    $sort:{
                        number:1
                    }
                }
            ], async function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (result.length > 0) {
                        for (var r = 0; r < result.length; r++) {

                            if (result[r].coordinator != null && result[r].coordinator != '' && result[r].coordinator != undefined) {
                                result[r].coordinator = result[r].coordinator.firstName[0] + ' ' + result[r].coordinator.lastName[0];
                            } else {
                                result[r].coordinator = '';
                            }
                        }
                    }
                    callback({
                        "response_code": 200,
                        "response_message": "List",
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

    deleteFileObservation: function (data, callback) {
        if (data) {
            if (data.category == 'accident') {
                accidentReportSchema.findOne(
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
                            accidentReportSchema.updateOne(
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
                accidentReportSchema.findOne(
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
                            environmentalReportSchema.updateOne(
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
            }

        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    editAccidentReport: async function (data, callback) {
        if (data) {
            if (data.dob == 'null') {
                data.dob = null;
            }
            data.stage = parseInt(data.stage);
            var reprtDetails = await accidentReportSchema.findOne({ _id: data._id }, { stage: 1 });
            var stageRes = await observationStageDefinationSchema.findOne(
                { companyId: data.companyId, category: 'accident' },
                { stage1: 1, stage2: 1, stage3: 1, stage4: 1 });
            if (data.stage == 1) {
                data.stageDetails = stageRes.stage1;
            } else if (data.stage == 2) {
                data.stageDetails = stageRes.stage2;
            } else if (data.stage == 3) {
                data.stageDetails = stageRes.stage3;
            } else if (data.stage == 4) {
                data.stageDetails = stageRes.stage4;
            }
            var updateData = {
                description: data.description,
                typeObservation: data.typeObservation,
                locationWork: data.locationWork,
                additionalInfo: data.additionalInfo,
                source: data.source,
                sourceOtherName: data.sourceOtherName,
                sourceId: data.sourceId,
                dateOccurence: data.dateOccurence,
                branch: data.branch,
                workplace: data.workplace,
                plant: data.plant,
                whatHappend: data.whatHappend,
                coordinator: data.coordinator,
                bccEmail: data.bccEmail,
                perticularEmployer: data.perticularEmployer,
                reportingPerson: data.reportingPerson,
                potentialSeverity: data.potentialSeverity,
                correctiveAction: data.correctiveAction,
                summary: data.summary,
                causeA: data.causeA,
                completedDate: data.completedDate,
                type: data.type,
                code: data.code,
                injuryCategory: data.injuryCategory,
                workDayLost: data.workDayLost,
                restrictedWorkDay: data.restrictedWorkDay,
                investigator: data.investigator,
                stage: data.stage,
                stageDetails: data.stageDetails
            }
            await accidentReportSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: updateData
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
                                await accidentReportSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { attachment: data.attachment[a] } })
                            }
                        }
                        var userDetails = await UserSchema.findOne({ _id: data.userId }, { userType: 1 });

                        if (reprtDetails.stage == 1) {
                            var stageDetails = stageRes.stage1;
                        } else if (reprtDetails.stage == 2) {
                            var stageDetails = stageRes.stage1;
                        } else if (reprtDetails.stage == 3) {
                            var stageDetails = stageRes.stage3;
                        } else if (reprtDetails.stage == 4) {
                            var stageDetails = stageRes.stage4;
                        }
                        if (data.comment != '' && data.comment != null && data.comment != undefined) {
                            var stageData = {
                                _id: new ObjectID,
                                createdBy: userDetails.userType,
                                userId: data.userId,
                                companyId: data.companyId,
                                reportId: data._id,
                                stageStep: reprtDetails.stage,
                                stageDetails: stageDetails,
                                comment: data.comment
                            }
                            await new accidentStageDetailSchema(stageData).save();
                        }
                        if (data.stage != reprtDetails.stage) {
                            if (data.stage == 2) {
                                var comment = stageRes.stage2;
                            } else if (data.stage == 3) {
                                var comment = stageRes.stage3;
                            } else if (data.stage == 4) {
                                var comment = stageRes.stage4;
                            }
                            var stageData = {
                                _id: new ObjectID,
                                createdBy: userDetails.userType,
                                userId: data.userId,
                                companyId: data.companyId,
                                reportId: data._id,
                                stageStep: reprtDetails.stage,
                                stageDetails: stageDetails,
                                comment: comment
                            }
                            await new accidentStageDetailSchema(stageData).save();
                        }

                        callback({
                            "response_code": 200,
                            "response_message": "Report updated.",
                            "response_data": {}
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

    environmentalReportDetails: async function (data, callback) {
        if (data) {
            environmentalReportSchema.findOne(
                {
                    _id: data.reportId
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
                            "response_message": "Details",
                            "response_data": {
                                details: result,
                                filePath: config.apiUrl
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

    editEnvironmentalReport: async function (data, callback) {
        if (data) {
            data.stage = parseInt(data.stage);
            var reprtDetails = await environmentalReportSchema.findOne({ _id: data._id }, { stage: 1 });
            var stageRes = await observationStageDefinationSchema.findOne(
                { companyId: data.companyId, category: 'environmental' },
                { stage1: 1, stage2: 1, stage3: 1, stage4: 1 });
            if (data.stage == 1) {
                data.stageDetails = stageRes.stage1;
            } else if (data.stage == 2) {
                data.stageDetails = stageRes.stage2;
            } else if (data.stage == 3) {
                data.stageDetails = stageRes.stage3;
            } else if (data.stage == 4) {
                data.stageDetails = stageRes.stage4;
            }
            var updateData = {
                description: data.description,
                typeObservation: data.typeObservation,
                employee: data.employee,
                dateOccurence: data.dateOccurence,
                branch: data.branch,
                workplace: data.workplace,
                suggestion: data.suggestion,
                coordinator: data.coordinator,
                bccEmail: data.bccEmail,
                workShift: data.workShift,
                action: data.action,
                completedDate: data.completedDate,
                investigator: data.investigator,
                stage: data.stage,
                stageDetails: data.stageDetails
            }
            environmentalReportSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: updateData
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
                                await accidentReportSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { attachment: data.attachment[a] } })
                            }
                        }
                        var userDetails = await UserSchema.findOne({ _id: data.userId }, { userType: 1 });

                        if (reprtDetails.stage == 1) {
                            var stageDetails = stageRes.stage1;
                        } else if (reprtDetails.stage == 2) {
                            var stageDetails = stageRes.stage1;
                        } else if (reprtDetails.stage == 3) {
                            var stageDetails = stageRes.stage3;
                        } else if (reprtDetails.stage == 4) {
                            var stageDetails = stageRes.stage4;
                        }
                        if (data.comment != '' && data.comment != null && data.comment != undefined) {
                            var stageData = {
                                _id: new ObjectID,
                                createdBy: userDetails.userType,
                                userId: data.userId,
                                companyId: data.companyId,
                                reportId: data._id,
                                stageStep: reprtDetails.stage,
                                stageDetails: stageDetails,
                                comment: data.comment
                            }
                            await new environmentalStageDetailSchema(stageData).save();
                        }
                        if (data.stage != reprtDetails.stage) {
                            if (data.stage == 2) {
                                var comment = stageRes.stage2;
                            } else if (data.stage == 3) {
                                var comment = stageRes.stage3;
                            } else if (data.stage == 4) {
                                var comment = stageRes.stage4;
                            }
                            var stageData = {
                                _id: new ObjectID,
                                createdBy: userDetails.userType,
                                userId: data.userId,
                                companyId: data.companyId,
                                reportId: data._id,
                                stageStep: reprtDetails.stage,
                                stageDetails: stageDetails,
                                comment: comment
                            }
                            await new environmentalStageDetailSchema(stageData).save();
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "Report updated.",
                            "response_data": {}
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

    accidentStageDetails: async function (data, callback) {
        if (data) {
            accidentStageDetailSchema.find(
                { reportId: data.reportId },
                { userId: 1, createdBy: 1, stageStep: 1, stageDetails: 1, comment: 1, createdAt: 1 },
                async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        var stageList = [];
                        var reportDetails = await accidentReportSchema.findOne({ _id: data.reportId }, { number: 1 });
                        var reportNumber = reportDetails.number;
                        if (result.length > 0) {
                            for (var i = 0; i < result.length; i++) {
                                var item = result[i];
                                if (item.createdBy == 'company') {
                                    var details = await CompanySchema.findOne({ userId: item.userId }, { ownerName: 1, logo: 1 });
                                    var userName = details.ownerName;
                                    if (details.logo == '' || details.logo == null || details.logo == undefined) {
                                        var profileImage = 'images/action-logo.png';
                                    } else {
                                        var profileImage = details.logo;
                                    }
                                } else if (item.createdBy == 'employee') {
                                    var userDetails = await UserSchema.findOne({ _id: item.userId }, { employeeId: 1 });
                                    var details = await EmployeeSchema.findOne({ _id: userDetails.employeeId }, { firstName: 1, lastName: 1, profileImage: 1 });
                                    if (details != '') {
                                        var userName = details.firstName + ' ' + details.lastName;
                                        if (details.logo == '' || details.logo == null || details.logo == undefined) {
                                            var profileImage = 'images/action-logo.png';
                                        } else {
                                            var profileImage = details.logo;
                                        }
                                    } else {
                                        var userName = '';
                                        var profileImage = '';
                                    }
                                }
                                if (i % 2 == 0) {
                                    var leftSide = true;
                                } else {
                                    var leftSide = false;
                                }
                                stageList[i] = {
                                    userName: userName,
                                    profileImage: profileImage,
                                    stage: item.stageStep,
                                    stageDetails: item.stageDetails,
                                    comment: item.comment,
                                    createdAt: item.createdAt,
                                    leftSide: leftSide
                                }
                            }
                            callback({
                                "response_code": 200,
                                "response_message": "List",
                                "response_data": {
                                    number: reportNumber,
                                    stageList: stageList,
                                    filePath: config.apiUrl
                                }
                            });
                        } else {
                            callback({
                                "response_code": 200,
                                "response_message": "List",
                                "response_data": {
                                    number: reportNumber,
                                    stageList: [],
                                    filePath: config.apiUrl
                                }
                            });
                        }
                    }
                }
            )
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    environmentalStageDetails: async function (data, callback) {
        if (data) {
            environmentalStageDetailSchema.find(
                { reportId: data.reportId },
                { userId: 1, createdBy: 1, stageStep: 1, stageDetails: 1, comment: 1, createdAt: 1 },
                async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        var stageList = [];
                        var reportDetails = await environmentalReportSchema.findOne({ _id: data.reportId }, { number: 1 });
                        var reportNumber = reportDetails.number;
                        if (result.length > 0) {
                            for (var i = 0; i < result.length; i++) {
                                var item = result[i];
                                if (item.createdBy == 'company') {
                                    var details = await CompanySchema.findOne({ userId: item.userId }, { ownerName: 1, logo: 1 });
                                    var userName = details.ownerName;
                                    if (details.logo == '' || details.logo == null || details.logo == undefined) {
                                        var profileImage = 'images/action-logo.png';
                                    } else {
                                        var profileImage = details.logo;
                                    }
                                } else if (item.createdBy == 'employee') {
                                    var userDetails = await UserSchema.findOne({ _id: item.userId }, { employeeId: 1 });
                                    var details = await EmployeeSchema.findOne({ _id: userDetails.employeeId }, { firstName: 1, lastName: 1, profileImage: 1 });
                                    var userName = details.firstName + ' ' + details.lastName;
                                    if (details.logo == '' || details.logo == null || details.logo == undefined) {
                                        var profileImage = 'images/action-logo.png';
                                    } else {
                                        var profileImage = details.logo;
                                    }
                                }
                                if (i % 2 == 0) {
                                    var leftSide = true;
                                } else {
                                    var leftSide = false;
                                }
                                stageList[i] = {
                                    userName: userName,
                                    profileImage: profileImage,
                                    stage: item.stageStep,
                                    stageDetails: item.stageDetails,
                                    comment: item.comment,
                                    createdAt: item.createdAt,
                                    leftSide: leftSide
                                }
                            }
                            callback({
                                "response_code": 200,
                                "response_message": "List",
                                "response_data": {
                                    number: reportNumber,
                                    stageList: stageList,
                                    filePath: config.apiUrl
                                }
                            });
                        } else {
                            callback({
                                "response_code": 200,
                                "response_message": "List",
                                "response_data": {
                                    number: reportNumber,
                                    stageList: [],
                                    filePath: config.apiUrl
                                }
                            });
                        }
                    }
                }
            )
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    
    ncrRelatedDataList: async function (data, callback) {
        if (data) {
            _async.parallel({
                typeObservation: function (CallBack) {
                    observationTypeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no',
                                category: 'ncr'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                employee: function (CallBack) {
                    EmployeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: { $concat: ["$firstName", " ", "$lastName",] },
                                _id: 1,
                                userId:'$_id',
                                userType:'employee'
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                workplace: function (CallBack) {
                    workplaceSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                coordinator: function (CallBack) {
                    observationWorkFlowDetailSchema.findOne(
                        { category: 'ncr', companyId: data.companyId },
                        { coordinator: 1 },
                        async function (err, res) {
                            if (err) {
                                CallBack(null, [])
                            } else {
                                if (res == null) {
                                    CallBack(null, [])
                                } else {
                                    if (res.coordinator.length) {
                                        var allList = [];
                                        for (var c = 0; c < res.coordinator.length; c++) {
                                            var empId = res.coordinator[c];
                                            var details = await EmployeeSchema.aggregate([
                                                {
                                                    $match: {
                                                        _id: empId
                                                    }
                                                },
                                                {
                                                    $project: {
                                                        name: { $concat: ["$firstName", " ", "$lastName",] },
                                                        _id: 1
                                                    }
                                                },
                                                {
                                                    $sort: { name: 1 }
                                                }
                                            ]);
                                            allList.push(details[0])
                                        }
                                        CallBack(null, allList)
                                    } else {
                                        CallBack(null, [])
                                    }
                                }
                            }
                        }
                    )
                },
                bccEmail: function (CallBack) {
                    EmployeeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isActive: 'yes',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: { $concat: ["$firstName", " ", "$lastName", " ", "(E)"] },
                                userId: '$_id',
                                _id: 0,
                                userType: 'employee'
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                workShift: function (CallBack) {
                    workShiftSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no',
                                category: 'ncr'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                potentialSeverity: function (CallBack) {
                    potentialSeveritySchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                category: 'ncr',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                type: function (CallBack) {
                    typeSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                category: 'ncr',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                observationCategory: function (CallBack) {
                    observationCategorySchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                category:'ncr',
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                _id: 1
                            }
                        },
                        {
                            $sort: { name: 1 }
                        }
                    ], function (err, res) {
                        CallBack(null, res)
                    })
                },
                stage: function (CallBack) {
                    observationStageDefinationSchema.findOne(
                        { companyId: data.companyId, category: 'ncr' },
                        { stage1: 1, stage2: 1, stage3: 1, stage4: 1 }, function (err, res) {
                            CallBack(null, res)
                        });
                },
            }, function (err, resList) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    callback({
                        "response_code": 200,
                        "response_message": "Data list.",
                        "response_data": resList
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

    generateNcrReport: async function (data, callback) {
        if (data) {
            var count = await ncrReportSchema.countDocuments();
            if (count == 0) {
                data.number = 1;
            } else {
                data.number = parseInt(count + 1);
            }
            var stageDetails = await observationStageDefinationSchema.findOne({ companyId: data.companyId, category: 'ncr' }, { stage1: 1 });
            data.stageDetails = stageDetails.stage1;
            new ncrReportSchema(data).save(async function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    var userDetails = await UserSchema.findOne({ _id: data.userId }, { userType: 1 });
                    var stageData = {
                        _id: data._id,
                        createdBy: userDetails.userType,
                        userId: data.userId,
                        companyId: data.companyId,
                        reportId: result._id,
                        stageStep: 1,
                        stageDetails: stageDetails.stage1,
                        comment: 'created'
                    }
                    new ncrStageDetailSchema(stageData).save();
                    callback({
                        "response_code": 200,
                        "response_message": "Report Generated.",
                        "response_data": result.number
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

    listNcrRegistered: async function (data, callback) {
        if (data) {
            ncrReportSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId
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
                    $lookup:
                    {
                        from: "workplaces",
                        localField: "workplace",
                        foreignField: "_id",
                        as: "Workplace"
                    }
                },
                {
                    $lookup:
                    {
                        from: "observationtypes",
                        localField: "typeObservation",
                        foreignField: "_id",
                        as: "Type"
                    }
                },
                {
                    $lookup:
                    {
                        from: "employees",
                        localField: "coordinator",
                        foreignField: "_id",
                        as: "Coordinator"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        number: 1,
                        stage: 1,
                        stageDetails: 1,
                        completedDate: 1,
                        investigator: 1,
                        type: '$Type.name',
                        branch: '$Branch.name',
                        workplace: '$Workplace.name',
                        'coordinator.firstName': '$Coordinator.firstName',
                        'coordinator.lastName': '$Coordinator.lastName'
                    }
                },
                {
                    $sort:{
                        number:1
                    }
                }
            ], async function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (result.length > 0) {
                        for (var r = 0; r < result.length; r++) {

                            if (result[r].coordinator != null && result[r].coordinator != '' && result[r].coordinator != undefined) {
                                result[r].coordinator = result[r].coordinator.firstName[0] + ' ' + result[r].coordinator.lastName[0];
                            } else {
                                result[r].coordinator = '';
                            }
                        }
                    }
                    callback({
                        "response_code": 200,
                        "response_message": "List",
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

    ncrStageDetails: async function (data, callback) {
        if (data) {
            ncrStageDetailSchema.find(
                { reportId: data.reportId },
                { userId: 1, createdBy: 1, stageStep: 1, stageDetails: 1, comment: 1, createdAt: 1 },
                async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        var stageList = [];
                        var reportDetails = await ncrReportSchema.findOne({ _id: data.reportId }, { number: 1 });
                        var reportNumber = reportDetails.number;
                        if (result.length > 0) {
                            for (var i = 0; i < result.length; i++) {
                                var item = result[i];
                                if (item.createdBy == 'company') {
                                    var details = await CompanySchema.findOne({ userId: item.userId }, { ownerName: 1, logo: 1 });
                                    var userName = details.ownerName;
                                    if (details.logo == '' || details.logo == null || details.logo == undefined) {
                                        var profileImage = 'images/action-logo.png';
                                    } else {
                                        var profileImage = details.logo;
                                    }
                                } else if (item.createdBy == 'employee') {
                                    var userDetails = await UserSchema.findOne({ _id: item.userId }, { employeeId: 1 });
                                    var details = await EmployeeSchema.findOne({ _id: userDetails.employeeId }, { firstName: 1, lastName: 1, profileImage: 1 });
                                    var userName = details.firstName + ' ' + details.lastName;
                                    if (details.logo == '' || details.logo == null || details.logo == undefined) {
                                        var profileImage = 'images/action-logo.png';
                                    } else {
                                        var profileImage = details.logo;
                                    }
                                }
                                if (i % 2 == 0) {
                                    var leftSide = true;
                                } else {
                                    var leftSide = false;
                                }
                                stageList[i] = {
                                    userName: userName,
                                    profileImage: profileImage,
                                    stage: item.stageStep,
                                    stageDetails: item.stageDetails,
                                    comment: item.comment,
                                    createdAt: item.createdAt,
                                    leftSide: leftSide
                                }
                            }
                            callback({
                                "response_code": 200,
                                "response_message": "List",
                                "response_data": {
                                    number: reportNumber,
                                    stageList: stageList,
                                    filePath: config.apiUrl
                                }
                            });
                        } else {
                            callback({
                                "response_code": 200,
                                "response_message": "List",
                                "response_data": {
                                    number: reportNumber,
                                    stageList: [],
                                    filePath: config.apiUrl
                                }
                            });
                        }
                    }
                }
            )
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },

    listMyInvestigationNcr: async function (data, callback) {
        if (data) {
            var userDetails = await UserSchema.findOne(
                { _id: data.userId },
                { employeeId: 1 });
            ncrReportSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        $or:[
                            {investigator: {$elemMatch: {userId:userDetails.employeeId}}},
                            {coordinator:userDetails.employeeId}
                        ]
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
                    $lookup:
                    {
                        from: "workplaces",
                        localField: "workplace",
                        foreignField: "_id",
                        as: "Workplace"
                    }
                },
                {
                    $lookup:
                    {
                        from: "observationtypes",
                        localField: "typeObservation",
                        foreignField: "_id",
                        as: "Type"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        description: 1,
                        number: 1,
                        stage: 1,
                        stageDetails: 1,
                        completedDate: 1,
                        type: '$Type.name',
                        branch: '$Branch.name',
                        workplace: '$Workplace.name',
                    }
                },
                {
                    $sort:{
                        number:1
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
                        "response_message": "List",
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

    ncrReportDetails: async function (data, callback) {
        if (data) {
            ncrReportSchema.findOne(
                {
                    _id: data.reportId
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
                            "response_message": "Details",
                            "response_data": {
                                details: result,
                                filePath: config.apiUrl
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

    editNcrReport: async function (data, callback) {
        if (data) {
            data.stage = parseInt(data.stage);
            var reprtDetails = await ncrReportSchema.findOne({ _id: data._id }, { stage: 1 });
            var stageRes = await observationStageDefinationSchema.findOne(
                { companyId: data.companyId, category: 'ncr' },
                { stage1: 1, stage2: 1, stage3: 1, stage4: 1 });
            if (data.stage == 1) {
                data.stageDetails = stageRes.stage1;
            } else if (data.stage == 2) {
                data.stageDetails = stageRes.stage2;
            } else if (data.stage == 3) {
                data.stageDetails = stageRes.stage3;
            } else if (data.stage == 4) {
                data.stageDetails = stageRes.stage4;
            }
            var updateData = {
                description: data.description,
                typeObservation: data.typeObservation,
                employee: data.employee,
                dateOccurence: data.dateOccurence,
                branch: data.branch,
                workplace: data.workplace,
                suggestion: data.suggestion,
                coordinator: data.coordinator,
                bccEmail: data.bccEmail,
                workShift: data.workShift,
                permitDetails: data.permitDetails,
                potentialSeverity: data.potentialSeverity,
                type: data.type,
                code: data.code,
                lostOperatingDay: data.lostOperatingDay,
                cost: data.cost,
                observationCategory: data.observationCategory,
                whatCost: data.whatCost,
                whatEffect: data.whatEffect,
                effectManage: data.effectManage,
                action: data.action,
                completedDate: data.completedDate,
                investigator: data.investigator,
                stage: data.stage,
                stageDetails: data.stageDetails
            }
            ncrReportSchema.updateOne(
                {
                    _id: data._id
                },
                {
                    $set: updateData
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
                                await accidentReportSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { attachment: data.attachment[a] } })
                            }
                        }
                        var userDetails = await UserSchema.findOne({ _id: data.userId }, { userType: 1 });

                        if (reprtDetails.stage == 1) {
                            var stageDetails = stageRes.stage1;
                        } else if (reprtDetails.stage == 2) {
                            var stageDetails = stageRes.stage1;
                        } else if (reprtDetails.stage == 3) {
                            var stageDetails = stageRes.stage3;
                        } else if (reprtDetails.stage == 4) {
                            var stageDetails = stageRes.stage4;
                        }
                        if (data.comment != '' && data.comment != null && data.comment != undefined) {
                            var stageData = {
                                _id: new ObjectID,
                                createdBy: userDetails.userType,
                                userId: data.userId,
                                companyId: data.companyId,
                                reportId: data._id,
                                stageStep: reprtDetails.stage,
                                stageDetails: stageDetails,
                                comment: data.comment
                            }
                            await new ncrStageDetailSchema(stageData).save();
                        }
                        if (data.stage != reprtDetails.stage) {
                            if (data.stage == 2) {
                                var comment = stageRes.stage2;
                            } else if (data.stage == 3) {
                                var comment = stageRes.stage3;
                            } else if (data.stage == 4) {
                                var comment = stageRes.stage4;
                            }
                            var stageData = {
                                _id: new ObjectID,
                                createdBy: userDetails.userType,
                                userId: data.userId,
                                companyId: data.companyId,
                                reportId: data._id,
                                stageStep: reprtDetails.stage,
                                stageDetails: stageDetails,
                                comment: comment
                            }
                            await new ncrStageDetailSchema(stageData).save();
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "Report updated.",
                            "response_data": {}
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

}
module.exports = ObservationModels;