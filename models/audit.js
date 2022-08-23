var workplaceSchema = require('../schema/workplace');
var supplierSchema = require('../schema/supplier');
var employeeSchema = require('../schema/employee');
var plantSchema = require('../schema/plant');
var auditFormTemplateSchema = require('../schema/auditFormTemplate');
var auditFormSectionSchema = require('../schema/auditFormSection');
var auditFormSectionQuestionSchema = require('../schema/auditFormSectionQuestion');
var auditFormSectionScoreSchema = require('../schema/auditFormSectionScore');
var auditSchema = require('../schema/audit');
var userSchema = require('../schema/user');
var auditScoreSchema = require('../schema/auditScore');
var auditQuestionCommentSchema = require('../schema/auditQuestionComment');
var taskSchema = require('../schema/task');

var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var fs = require('fs');
var moment = require('moment');


var AuditModels = {
    auditRelatedDataList: function (data, callback) {
        if (data) {
            _async.parallel({
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
                employee: function (CallBack) {
                    employeeSchema.aggregate([
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
                supplier: function (CallBack) {
                    supplierSchema.aggregate([
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
                template: function (CallBack) {
                    auditFormTemplateSchema.aggregate([
                        {
                            $match: {
                                companyId: data.companyId,
                                isDelete: 'no',
                                isActive: 'yes'
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
    auditFormTemplateDetails: function (data, callback) {
        if (data) {
            _async.parallel({
                auditorAndReviwer: function (CallBack) {
                    var auditorList = [];
                    var reviewerList = [];
                    auditFormTemplateSchema.findOne(
                        { _id: data.template },
                        {
                            auditor: 1,
                            reviewer: 1,
                            _id: 1
                        }, async function (err, res) {
                            if (res != null) {
                                if (!err) {
                                    if (res.auditor.length > 0) {
                                        for (var a = 0; a < res.auditor.length; a++) {
                                            var empId = res.auditor[a];
                                            var auditorRes = await employeeSchema.aggregate([
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
                                                }
                                            ]);
                                            if (auditorRes.length > 0) {
                                                auditorRes = auditorRes[0];
                                                auditorList[a] = {
                                                    _id: empId,
                                                    name: auditorRes.name
                                                }
                                            }
                                        }
                                    }
                                    if (res.reviewer.length > 0) {
                                        for (var r = 0; r < res.reviewer.length; r++) {
                                            var empId = res.reviewer[r];
                                            var reviewRes = await employeeSchema.aggregate([
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
                                                }
                                            ]);
                                            if (reviewRes.length > 0) {
                                                reviewRes = reviewRes[0];
                                                reviewerList[r] = {
                                                    _id: empId,
                                                    name: reviewRes.name
                                                }
                                            }
                                        }
                                    }
                                    CallBack(null, { auditorList: auditorList, reviewerList: reviewerList })
                                } else {
                                    CallBack(null, { auditorList: auditorList, reviewerList: reviewerList })
                                }
                            } else {
                                CallBack(null, { auditorList: auditorList, reviewerList: reviewerList })
                            }
                        })
                },
                sectionList: function (CallBack) {
                    auditFormSectionSchema.aggregate([
                        {
                            $match: {
                                templateId: data.template,
                                isDelete: 'no'
                            }
                        },
                        {
                            $project: {
                                _id: 1, name: 1, tooltip: 1
                            }
                        }], async function (err, result) {
                            if (!err) {
                                if (result.length > 0) {
                                    for (var i = 0; i < result.length; i++) {
                                        var sectionId = result[i]._id;
                                        var auditSectionDetails = await auditScoreSchema.findOne({ sectionId: sectionId, auditId: data.auditId });
                                        var questionRes = await auditFormSectionQuestionSchema.aggregate([
                                            {
                                                $match: {
                                                    templateId: data.template,
                                                    sectionId: sectionId,
                                                    isDelete: 'no'
                                                }
                                            },
                                            {
                                                $addFields: {
                                                    commentList: [],
                                                    attachList: []
                                                }
                                            },
                                            {
                                                $project: {
                                                    _id: 1, name: 1, tooltip: 1, scoreId: 1, commentList: 1, attachList: 1
                                                }
                                            }])
                                        if (auditSectionDetails != null && auditSectionDetails.question.length > 0) {
                                            if (questionRes.length > 0) {
                                                for (var q = 0; q < questionRes.length; q++) {
                                                    var quesId = questionRes[q]._id;
                                                    questionRes[q].commentList = []
                                                    questionRes[q].attachList = []
                                                    var commentListRes = await auditQuestionCommentSchema.findOne({ sectionId: sectionId, auditId: data.auditId, questionId: quesId }, { commentList: 1, attachment: 1 });
                                                    if (commentListRes != null) {
                                                        questionRes[q].commentList = commentListRes.commentList;
                                                        questionRes[q].attachList = commentListRes.attachment;
                                                    }

                                                    var index = auditSectionDetails.question.map(function (e) { return e.questionId; }).indexOf(quesId);
                                                    if (index > -1) {
                                                        questionRes[q].scoreId = auditSectionDetails.question[index].scoreId
                                                    }
                                                }
                                            }
                                            result[i].score = auditSectionDetails.score;
                                            result[i].totalScore = auditSectionDetails.totalScore;
                                        } else {
                                            result[i].score = 0;
                                            result[i].totalScore = 0;
                                        }
                                        result[i].questionList = questionRes;
                                        var scoreRes = await auditFormSectionScoreSchema.find(
                                            {
                                                templateId: data.template,
                                                sectionId: sectionId,
                                                isDelete: 'no'
                                            },
                                            {
                                                _id: 1, option: 1, score: 1
                                            })
                                        result[i].scoreList = scoreRes;
                                        scoreRes.sort((v1, v2) => v2.score - v1.score).map((v) => v.score);
                                        result[i].maxScore = scoreRes[0].score;
                                    }
                                }
                                CallBack(null, result)
                            } else {
                                CallBack(null, [])
                            }
                        })
                },
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
                        "response_data": {
                            filePath: config.apiUrl,
                            sectionList: result.sectionList,
                            auditorList: result.auditorAndReviwer.auditorList,
                            reviewerList: result.auditorAndReviwer.reviewerList
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
    auditRegister: function (data, callback) {
        if (data) {
            new auditSchema(data).save(function (err, result) {
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
    listAudit: async function (data, callback) {
        if (data) {
            if (data.statusType == 'all') {
                var match = {
                    isDelete: 'no',
                    createdBy: 'company',
                    companyId: data.companyId
                }
            } else if (data.statusType == 'yes') {
                var match = {
                    isDelete: 'no',
                    isClose: 'yes',
                    createdBy: 'company',
                    companyId: data.companyId
                }
            } else if (data.statusType == 'no') {
                var match = {
                    isDelete: 'no',
                    isClose: 'no',
                    createdBy: 'company',
                    companyId: data.companyId
                }
            }
            auditSchema.aggregate([
                {
                    $match: match
                },
                {
                    $lookup:
                    {
                        from: "auditforms",
                        localField: "template",
                        foreignField: "_id",
                        as: "AuditForm"
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
                        from: "employees",
                        localField: "auditor",
                        foreignField: "_id",
                        as: "Employee"
                    }
                },
                {
                    $unwind: {
                        path: "$Employee",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        _id: 1,
                        template: '$AuditForm',
                        name: 1,
                        branch: '$Branch',
                        workplace: '$Workplace',
                        auditor: { $concat: ["$Employee.firstName", " ", "$Employee.lastName"] },
                        score: 1,
                        totalScore: 1,
                        dueDate: 1
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
                    if (result.length > 0) {
                        for (let i = 0; i < result.length; i++) {
                            let item = result[i];
                            if (item.template.length > 0) {
                                result[i].template = item.template[0].name;
                            } else {
                                result[i].template = '';
                            }
                            if (item.branch.length > 0) {
                                result[i].branch = item.branch[0].name;
                            } else {
                                result[i].branch = '';
                            }
                            if (item.workplace.length > 0) {
                                result[i].workplace = item.workplace[0].name;
                            } else {
                                result[i].workplace = '';
                            }
                        }
                    }
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
    deleteAudit: function (data, callback) {
        if (data) {
            auditSchema.updateOne(
                {
                    _id: data._id
                },
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
    getAuditDetails: function (data, callback) {
        if (data) {
            auditSchema.aggregate([
                {
                    $match: {
                        _id: data.auditId
                    }
                },
                {
                    $lookup:
                    {
                        from: "employees",
                        localField: "signOffBy",
                        foreignField: "_id",
                        as: "SignOffBy"
                    }
                },
                {
                    $lookup:
                    {
                        from: "employees",
                        localField: "closeBy",
                        foreignField: "_id",
                        as: "CloseBy"
                    }
                },
                {
                    $lookup:
                    {
                        from: "tasks",
                        localField: "parentAuditId",
                        foreignField: "assignId",
                        as: "Task"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        template: 1,
                        name: 1,
                        branch: 1,
                        workplace: 1,
                        supplier: 1,
                        employee: 1,
                        plant: 1,
                        note: 1,
                        auditor: 1,
                        reviewer: 1,
                        score: 1,
                        totalScore: 1,
                        isSignOff: 1,
                        signOffBy: '$SignOffBy',
                        signOffDate: 1,
                        isClose: 1,
                        closeBy: '$CloseBy',
                        closeDate: 1,
                        enableTask: 1,
                        task: '$Task'
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
                            result = result[0];
                            if (result.task.length > 0) {
                                result.task = {
                                    _id: result.task[0]._id,
                                    detail: result.task[0].detail,
                                    type: result.task[0].type,
                                    branch: result.task[0].branch,
                                    workplace: result.task[0].workplace,
                                    taskOwner: result.task[0].taskOwner,
                                    dueDate: result.task[0].dueDate,
                                    frequencyNumber: result.task[0].frequencyNumber,
                                    frequencyUnit: result.task[0].frequencyUnit,
                                    reminderNumber: result.task[0].reminderNumber,
                                    reminderUnit: result.task[0].reminderUnit,
                                    repeatNumber: result.task[0].repeatNumber,
                                    repeatUnit: result.task[0].repeatUnit,
                                    note: result.task[0].note,
                                    escalationNumber: result.task[0].escalationNumber,
                                    escalationUnit: result.task[0].escalationUnit,
                                    notify: result.task[0].notify,
                                    createdAt: result.task[0].createdAt
                                };
                            } else {
                                result.task = {};
                            }

                            if (result.isSignOff == 'no') {
                                result.signOffBy = '';
                                result.signOffDate = '';
                            } else {
                                if (result.signOffBy.length > 0) {
                                    result.signOffBy = result.signOffBy[0].firstName + ' ' + result.signOffBy[0].lastName;
                                    if (result.signOffDate == null || result.signOffDate == undefined) {
                                        result.signOffDate = '';
                                    }
                                } else {
                                    result.signOffBy = '';
                                    result.signOffDate = '';
                                }
                            }
                            if (result.isClose == 'no') {
                                result.closeBy = '';
                                result.closeDate = '';
                            } else {
                                if (result.closeBy.length > 0) {
                                    result.closeBy = result.closeBy[0].firstName + ' ' + result.closeBy[0].lastName;
                                    if (result.closeDate == null || result.closeDate == undefined) {
                                        result.closeDate = '';
                                    }
                                } else {
                                    result.closeBy = '';
                                    result.closeDate = '';
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
    editAudit: function (data, callback) {
        if (data) {
            auditSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        auditor: data.auditor,
                        reviewer: data.reviewer,
                        enableTask: data.enableTask,
                        dueDate:data.dueDate
                    }
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (data.note != '' && data.note != undefined && data.note != null) {
                            await auditSchema.updateOne(
                                { _id: data._id },
                                { $push: { note: data.note } })
                        }
                        var auditDetails = await auditSchema.findOne({_id:data._id},{parentAuditId:1});
                        var taskCount = await taskSchema.countDocuments({assignId:auditDetails.parentAuditId});
                        callback({
                            "response_code": 200,
                            "response_message": "Data updated.",
                            "response_data": {
                                taskCount:taskCount,
                                parentAuditId:auditDetails.parentAuditId
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
    listMyAudit: async function (data, callback) {
        if (data) {
            var userDetails = await userSchema.findOne(
                { _id: data.userId },
                { employeeId: 1 })
            auditSchema.aggregate([
                {
                    $match: {
                        companyId: data.companyId,
                        isDelete: 'no',
                        auditor: userDetails.employeeId,
                        isClose: 'no'
                    }
                },
                {
                    $lookup:
                    {
                        from: "auditforms",
                        localField: "template",
                        foreignField: "_id",
                        as: "AuditForm"
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
                        from: "employees",
                        localField: "auditor",
                        foreignField: "_id",
                        as: "Employee"
                    }
                },
                {
                    $unwind: {
                        path: "$Employee",
                        preserveNullAndEmptyArrays: false
                    }
                },
                {
                    $project: {
                        _id: 1,
                        template: '$AuditForm',
                        name: 1,
                        branch: '$Branch',
                        workplace: '$Workplace',
                        auditor: { $concat: ["$Employee.firstName", " ", "$Employee.lastName"] },
                        score: 1,
                        totalScore: 1,
                        dueDate: 1
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
                    if (result.length > 0) {
                        for (let i = 0; i < result.length; i++) {
                            let item = result[i];
                            if (item.template.length > 0) {
                                result[i].template = item.template[0].name;
                            } else {
                                result[i].template = '';
                            }
                            if (item.branch.length > 0) {
                                result[i].branch = item.branch[0].name;
                            } else {
                                result[i].branch = '';
                            }
                            if (item.workplace.length > 0) {
                                result[i].workplace = item.workplace[0].name;
                            } else {
                                result[i].workplace = '';
                            }
                        }
                    }
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
    setAuditScore: async function (data, callback) {
        if (data) {
            var allScroeData = [];
            auditScoreSchema.countDocuments(
                { auditId: data.auditId },
                async function (err, countRes) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (countRes > 0) {
                            await auditScoreSchema.deleteMany({ auditId: data.auditId });
                        }
                        if (data.section.length > 0) {
                            for (var s = 0; s < data.section.length; s++) {
                                allScroeData[s] = {
                                    _id: new ObjectID,
                                    createdBy: 'company',
                                    userId: data.userId,
                                    companyId: data.companyId,
                                    auditId: data.auditId,
                                    sectionId: data.section[s].sectionId,
                                    question: data.section[s].question,
                                    score: data.section[s].score,
                                    totalScore: data.section[s].totalScore,
                                }
                            }
                        }
                        auditScoreSchema.insertMany(allScroeData, async function (err, result) {
                            if (err) {
                                callback({
                                    "response_code": 505,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": {}
                                });
                            } else {
                                if (data.note != '' && data.note != undefined && data.note != null) {
                                    await auditSchema.updateOne(
                                        { _id: data.auditId },
                                        { $push: { note: data.note } })
                                }
                                if (data.isSignOff != '' && data.isSignOff != null && data.isSignOff != undefined && data.isSignOff == 'yes') {
                                    var empIdRes = await userSchema.findOne({ _id: data.userId }, { employeeId: 1 });
                                    if (empIdRes != null) {
                                        data.signOffBy = empIdRes.employeeId;
                                    } else {
                                        data.signOffBy = ''
                                    }
                                    var uodateData = {
                                        score: data.score,
                                        totalScore: data.totalScore,
                                        isSignOff: 'yes',
                                        signOffBy: data.signOffBy,
                                        signOffDate: new Date()
                                    }
                                } else {
                                    var uodateData = {
                                        score: data.score,
                                        totalScore: data.totalScore
                                    }
                                }
                                await auditSchema.updateOne(
                                    { _id: data.auditId },
                                    {
                                        $set: uodateData
                                    })
                                callback({
                                    "response_code": 200,
                                    "response_message": "Data updated.",
                                    "response_data": {}
                                });
                            }
                        })
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
    addAuditQuestionComment: function (data, callback) {
        if (data) {
            auditQuestionCommentSchema.findOne(
                {
                    companyId: data.companyId,
                    auditId: data.auditId,
                    sectionId: data.sectionId,
                    questionId: data.questionId
                },
                {
                    _id: 1
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result != null) {
                            data._id = result._id
                        }
                        var pushData = {
                            _id: new ObjectID,
                            comment: data.comment
                        }
                        auditQuestionCommentSchema.updateOne(
                            {
                                _id: data._id,
                                userId: data.userId,
                                companyId: data.companyId,
                                auditId: data.auditId,
                                sectionId: data.sectionId,
                                questionId: data.questionId
                            },
                            {
                                $push: {
                                    commentList: pushData
                                }
                            },
                            {
                                upsert: true
                            },
                            function (err, res) {
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
                                        "response_data": pushData
                                    });
                                }
                            }
                        )
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
    editAuditQuestionComment: function (data, callback) {
        if (data) {
            auditQuestionCommentSchema.updateOne(
                {
                    'commentList._id': data.commentId,
                    userId: data.userId,
                    companyId: data.companyId,
                    auditId: data.auditId,
                    sectionId: data.sectionId,
                    questionId: data.questionId
                },
                {
                    $set: {
                        'commentList.$.comment': data.comment
                    }
                },
                function (err, res) {
                    console.log('err', err)
                    console.log('res', res)
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
                })
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    uploadQuestionAttach: function (data, callback) {
        if (data) {
            auditQuestionCommentSchema.findOne(
                {
                    companyId: data.companyId,
                    auditId: data.auditId,
                    sectionId: data.sectionId,
                    questionId: data.questionId
                },
                {
                    _id: 1
                }, function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        if (result != null) {
                            data._id = result._id
                        }
                        auditQuestionCommentSchema.updateOne(
                            {
                                _id: data._id,
                                userId: data.userId,
                                companyId: data.companyId,
                                auditId: data.auditId,
                                sectionId: data.sectionId,
                                questionId: data.questionId
                            },
                            {
                                $push: {
                                    attachment: data.attachment
                                }
                            },
                            {
                                upsert: true
                            },
                            function (err, res) {
                                if (err) {
                                    callback({
                                        "response_code": 505,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    callback({
                                        "response_code": 200,
                                        "response_message": "File upload.",
                                        "response_data": {
                                            filePath: config.apiUrl,
                                            attachment: data.attachment
                                        }
                                    });
                                }
                            }
                        )
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
    deleteQuestionAttach: function (data, callback) {
        if (data) {
            if (data.fileType == 'attachment') {
                auditQuestionCommentSchema.findOne(
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
                            auditQuestionCommentSchema.updateOne(
                                {
                                    _id: result._id
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
                                        //fs.unlinkSync('public/' + result.attachment[0].path)
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
    closeOffAudit: function (data, callback) {
        if (data) {
            auditSchema.findOne(
                {
                    _id: data._id
                }, async function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 505,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": {}
                        });
                    } else {
                        var empIdRes = await userSchema.findOne({ _id: data.userId }, { employeeId: 1 });
                        if (empIdRes != null) {
                            data.closeBy = empIdRes.employeeId;
                        } else {
                            data.closeBy = ''
                        }
                        var updateData = {
                            isClose: 'yes',
                            closeBy: data.closeBy,
                            closeDate: new Date()
                        }
                        auditSchema.updateOne(
                            { _id: data._id },
                            {
                                $set: updateData
                            }, async function (err, updateRes) {
                                if (err) {
                                    callback({
                                        "response_code": 505,
                                        "response_message": "INTERNAL DB ERROR",
                                        "response_data": {}
                                    });
                                } else {
                                    if (result.enableTask == true) {
                                        var taskDetails = await taskSchema.findOne({ assignId: result.parentAuditId });
                                        console.log('taskDetails',taskDetails)
                                        if (taskDetails != null) {
                                            var unitDays = 1;
                                            if (taskDetails.frequencyUnit == 'days') {
                                                unitDays = 1;
                                            } else if (taskDetails.frequencyUnit == 'weeks') {
                                                unitDays = 7;
                                            } else if (taskDetails.frequencyUnit == 'months') {
                                                unitDays = 30;
                                            } else if (taskDetails.frequencyUnit == 'years') {
                                                unitDays = 365;
                                            }
                                            var totalDays = parseInt((taskDetails.frequencyNumber) * unitDays);
                                            console.log('totalDays',totalDays)
                                            var newDueDate = moment(taskDetails.dueDate).add(totalDays, 'days');
                                            console.log('newDueDate',newDueDate)
                                            newDueDate = moment(newDueDate).format();
                                            console.log('newDueDate',newDueDate)
                                            // deu date update in  task
                                            await taskSchema.updateOne(
                                                { assignId: result.parentAuditId },
                                                {
                                                    $set: {
                                                        dueDate: newDueDate
                                                    }
                                                }
                                            )
                                            //copy audit
                                            var newAuditId = new ObjectID;
                                            newAduitData = {
                                                _id: newAuditId,
                                                parentAuditId: result.parentAuditId,
                                                copyAuditId: result._id,
                                                createdBy: result.createdBy,
                                                userId: result.userId,
                                                companyId: result.companyId,
                                                template: result.template,
                                                name: result.name,
                                                branch: result.branch,
                                                workplace: result.workplace,
                                                supplier: result.supplier,
                                                employee: result.employee,
                                                plant: result.plant,
                                                note: result.note,
                                                auditor: result.auditor,
                                                reviewer: result.reviewer,
                                                score: result.score,
                                                totalScore: result.totalScore,
                                                isDelete: result.isDelete,
                                                isSignOff: result.isSignOff,
                                                signOffBy: result.signOffBy,
                                                signOffDate: result.signOffDate,
                                                isClose: 'no',
                                                closeBy: '',
                                                closeDate: '',
                                                enableTask: true,
                                                dueDate: newDueDate
                                            }
                                            await new auditSchema(newAduitData).save();
                                            //copy audit score
                                            var scoreRes = await auditScoreSchema.find({ auditId: result._id });
                                            if (scoreRes.length > 0) {
                                                var newScoreData = [];
                                                for (var s = 0; s < scoreRes.length; s++) {
                                                    var scoreItem = scoreRes[s];
                                                    newScoreData[s] = {
                                                        createdBy: scoreItem.createdBy,
                                                        userId: scoreItem.userId,
                                                        companyId: scoreItem.companyId,
                                                        auditId: newAuditId,
                                                        sectionId: scoreItem.sectionId,
                                                        question: scoreItem.question,
                                                        score: scoreItem.score,
                                                        totalScore: scoreItem.totalScore,
                                                        isDelete: scoreItem.isDelete,
                                                        _id: new ObjectID
                                                    }
                                                }
                                                await auditScoreSchema.insertMany(newScoreData);
                                            }
                                            //copy question comment and attchment
                                            var questionRes = await auditQuestionCommentSchema.find({ auditId: result._id });
                                            if (questionRes.length > 0) {
                                                var newQuestionData = [];
                                                for (var q = 0; q < questionRes.length; q++) {
                                                    var questionItem = questionRes[q];
                                                    newQuestionData[q] = {
                                                        createdBy: questionItem.createdBy,
                                                        userId: questionItem.userId,
                                                        companyId: questionItem.companyId,
                                                        auditId: newAuditId,
                                                        sectionId: questionItem.sectionId,
                                                        questionId: questionItem.questionId,
                                                        _id: new ObjectID,
                                                        commentList: questionItem.commentList,
                                                        attachment: questionItem.attachment,

                                                    }
                                                }
                                                await auditQuestionCommentSchema.insertMany(newQuestionData);
                                            }
                                        }
                                    }
                                    callback({
                                        "response_code": 200,
                                        "response_message": "Data updated.",
                                        "response_data": {}
                                    });
                                }
                            })
                    }
                })
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    }
}
module.exports = AuditModels;