var taskTypeSchema = require('../schema/taskType');
var taskSchema = require('../schema/task');
var workplaceSchema = require('../schema/workplace');
var EmployeeSchema = require('../schema/employee');
var skillSchema = require('../schema/skill');
var plantSchema = require('../schema/plant');
var supplierSchema = require('../schema/supplier');
var auditSchema = require('../schema/audit');

var _async = require("async");
var mongo = require('mongodb');
var moment = require('moment');

var TaskModels = {
    taskDataList: function (data, callback) {
        if (data) {
            _async.parallel({
                type: function (CallBack) {
                    taskTypeSchema.aggregate([
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
                notify: function (CallBack) {
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
                                name: { $concat: ["$firstName", " ", "$lastName"] },
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
                owner: function (CallBack) {
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
                                name: { $concat: ["$firstName", " ", "$lastName"] },
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
    addTask: function (data, callback) {
        if (data) {
            new taskSchema(data).save(function (err, result) {
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
    listTask: function (data, callback) {
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
                    isActive: 'yes',
                    createdBy: 'company',
                    companyId: data.companyId
                }
            } else if (data.statusType == 'no') {
                var match = {
                    isDelete: 'no',
                    isActive: 'no',
                    createdBy: 'company',
                    companyId: data.companyId
                }
            }
            taskSchema.aggregate([
                {
                    $match: match
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
                        from: "tasktypes",
                        localField: "type",
                        foreignField: "_id",
                        as: "TaskType"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        detail: 1,
                        dueDate: 1,
                        frequencyNumber: 1,
                        frequencyUnit: 1,
                        branch: '$Branch',
                        workplace: '$Workplace',
                        type: '$TaskType',
                        assignFor: 1,
                        assignId: 1,
                        isActive: 1,
                        createdAt: 1
                    }
                },
                {
                    $sort: {
                        type: 1

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
                                result[i].task = '';
                                if (item.assignId != '' && item.assignId != '' && item.assignId != undefined) {
                                    if (item.assignFor != '' && item.assignFor != '' && item.assignFor != undefined) {
                                        if (item.assignFor == 'skill') {
                                            var details = await skillSchema.findOne({ _id: item.assignId }, { name: 1 })
                                            if (details != null) {
                                                result[i].task = 'Skill <br/> (' + details.name + ')';
                                            }
                                        } else if (item.assignFor == 'plant') {
                                            var details = await plantSchema.findOne({ _id: item.assignId }, { name: 1 })
                                            if (details != null) {
                                                result[i].task = 'Asset <br/> (' + details.name + ')';
                                            }
                                        } else if (item.assignFor == 'supplier') {
                                            var details = await supplierSchema.findOne({ _id: item.assignId }, { name: 1 })
                                            if (details != null) {
                                                result[i].task = 'Contractors / Suppliers <br/> (' + details.name + ')';
                                            }
                                        } else if (item.assignFor == 'audit') {
                                            var details = await auditSchema.findOne({ _id: item.assignId }, { name: 1 })
                                            if (details != null) {
                                                result[i].task = 'Audit <br/> (' + details.name + ')';
                                            }
                                        }
                                    }
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
                                if (item.type.length > 0) {
                                    result[i].type = item.type[0].name;
                                } else {
                                    result[i].type = '';
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
    taskStatusChange: function (data, callback) {
        if (data) {
            taskSchema.updateOne(
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
    deleteTask: function (data, callback) {
        if (data) {
            taskSchema.updateOne(
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
                            "response_message": "Task deleted.",
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
    getTaskDetails: function (data, callback) {
        if (data) {
            taskSchema.aggregate([
                {
                    $match: {
                        _id: data.taskId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        detail: 1,
                        type: 1,
                        branch: 1,
                        workplace: 1,
                        taskOwner: 1,
                        dueDate: 1,
                        frequencyNumber: 1,
                        frequencyUnit: 1,
                        reminderNumber: 1,
                        reminderUnit: 1,
                        repeatNumber: 1,
                        repeatUnit: 1,
                        note: 1,
                        escalationNumber: 1,
                        escalationUnit: 1,
                        notify: 1,
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
                            "response_message": "Task Details.",
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
    editTask: function (data, callback) {
        if (data) {
            taskSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        detail: data.detail,
                        type: data.type,
                        branch: data.branch,
                        workplace: data.workplace,
                        dueDate: data.dueDate,
                        taskOwner: data.taskOwner,
                        frequencyNumber: data.frequencyNumber,
                        frequencyUnit: data.frequencyUnit,
                        reminderNumber: data.reminderNumber,
                        reminderUnit: data.reminderUnit,
                        repeatNumber: data.repeatNumber,
                        repeatUnit: data.repeatUnit,
                        note: data.note,
                        escalationNumber: data.escalationNumber,
                        escalationUnit: data.escalationUnit,
                        notify: data.notify
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
                            "response_message": "Task details updated.",
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
    listAssignTask: function (data, callback) {
        if (data) {
            if (data.statusType == 'all') {
                var match = {
                    isDelete: 'no',
                    createdBy: 'company',
                    companyId: data.companyId,
                    assignFor: data.assignFor,
                    assignId: data.assignId
                }
            } else if (data.statusType == 'yes') {
                var match = {
                    isDelete: 'no',
                    isActive: 'yes',
                    createdBy: 'company',
                    companyId: data.companyId,
                    assignFor: data.assignFor,
                    assignId: data.assignId
                }
            } else if (data.statusType == 'no') {
                var match = {
                    isDelete: 'no',
                    isActive: 'no',
                    createdBy: 'company',
                    companyId: data.companyId,
                    assignFor: data.assignFor,
                    assignId: data.assignId
                }
            }
            taskSchema.aggregate([
                {
                    $match: match
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
                        from: "tasktypes",
                        localField: "type",
                        foreignField: "_id",
                        as: "TaskType"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        detail: 1,
                        dueDate: 1,
                        frequencyNumber: 1,
                        frequencyUnit: 1,
                        branch: '$Branch',
                        workplace: '$Workplace',
                        type: '$TaskType',
                        isActive: 1,
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
                                if (item.type.length > 0) {
                                    result[i].type = item.type[0].name;
                                } else {
                                    result[i].type = '';
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
    signOffTask: async function (data, callback) {
        if (data) {
            var taskDetails = await taskSchema.findOne({ _id: data._id });
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

                var newDueDate = moment(taskDetails.dueDate).add(totalDays, 'days');
                newDueDate = moment(newDueDate).format();
                if (taskDetails.assignFor == 'audit') {
                    var auditDetails = await auditSchema.find({ parentAuditId: taskDetails.assignId }).sort({ 'createdAt': -1 }).limit(1);
                    if (auditDetails.length > 0) {
                        await auditSchema.updateOne(
                            {
                                _id: auditDetails[0]._id
                            },
                            {
                                $set: {
                                    dueDate: newDueDate
                                }
                            })
                    }

                }
            }
            taskSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        dueDate: newDueDate
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
}
module.exports = TaskModels;
