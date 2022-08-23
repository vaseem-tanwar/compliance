var accidentReportSchema = require('../schema/accidentReport');
var environmentalReportSchema = require('../schema/environmentalReport');
var ncrReportSchema = require('../schema/ncrReport');
var reportChartSchema = require('../schema/reportChart');
var _async = require("async");
var config = require('../config.js');
var fs = require('fs');

var ReportChartModels = {
    getDataforReportGenerate: async function (data, callback) {
        if (data) {
            var result = [];
            switch (data.module) {
                case "accident":
                    if (data.field == 'stageStatus') {
                        var openRes = await accidentReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: { $ne: 4 }
                        });
                        var closeRes = await accidentReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 4
                        });
                        result = [
                            { label: 'Open', value: openRes, color: '41B17B' },
                            { label: 'Close', value: closeRes, color: 'FA336F' }
                        ]
                    } else if (data.field == 'stage') {
                        var oneRes = await accidentReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 1
                        });
                        var twoRes = await accidentReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 2
                        });
                        var threeRes = await accidentReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 3
                        });
                        var fourRes = await accidentReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 4
                        });
                        result = [
                            { label: 'Stage 1', value: oneRes, color: '5DA3FA' },
                            { label: 'Stage 2', value: twoRes , color: '51E1ED'},
                            { label: 'Stage 3', value: threeRes, color: '2827CC' },
                            { label: 'Stage 4', value: fourRes, color: 'FF6666' }
                        ]
                    }
                    break;
                case "ncr":
                    if (data.field == 'stageStatus') {
                        var openRes = await ncrReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: { $ne: 4 }
                        });
                        var closeRes = await ncrReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 4
                        });
                        result = [
                            { label: 'Open', value: openRes, color: '41B17B' },
                            { label: 'Close', value: closeRes, color: 'FA336F' }
                        ]
                    } else if (data.field == 'stage') {
                        var oneRes = await ncrReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 1
                        });
                        var twoRes = await ncrReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 2
                        });
                        var threeRes = await ncrReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 3
                        });
                        var fourRes = await ncrReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 4
                        });
                        result = [
                            { label: 'Stage 1', value: oneRes, color: '5DA3FA' },
                            { label: 'Stage 2', value: twoRes , color: '51E1ED'},
                            { label: 'Stage 3', value: threeRes, color: '2827CC' },
                            { label: 'Stage 4', value: fourRes, color: 'FF6666' }
                        ]
                    }
                    break;
                case "improvement":
                    if (data.field == 'stageStatus') {
                        var openRes = await environmentalReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: { $ne: 4 }
                        });
                        var closeRes = await environmentalReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 4
                        });
                        result = [
                            { label: 'Open', value: openRes, color: '41B17B' },
                            { label: 'Close', value: closeRes, color: 'FA336F' }
                        ]
                    } else if (data.field == 'stage') {
                        var oneRes = await environmentalReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 1
                        });
                        var twoRes = await environmentalReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 2
                        });
                        var threeRes = await environmentalReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 3
                        });
                        var fourRes = await environmentalReportSchema.countDocuments({
                            companyId: data.companyId,
                            isDelete: 'no',
                            stage: 4
                        });
                        result = [
                            { label: 'Stage 1', value: oneRes, color: '5DA3FA' },
                            { label: 'Stage 2', value: twoRes , color: '51E1ED'},
                            { label: 'Stage 3', value: threeRes, color: '2827CC' },
                            { label: 'Stage 4', value: fourRes, color: 'FF6666' }
                        ]
                    }
                    break;
                default:
                    result = [];
            }
            callback({
                "response_code": 200,
                "response_message": "List.",
                "response_data": result
            });
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    addReportData: async function (data, callback) {
        if (data) {
            new reportChartSchema(data).save(function (err, result) {
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
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    listReport: function (data, callback) {
        if (data) {
            reportChartSchema.aggregate([
                {
                    $match: {
                        isDelete: 'no',
                        companyId: data.companyId
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        module: 1,
                        reportType: 1,
                        createdAt: 1
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
    deleteReport: async function (data, callback) {
        if (data) {
            reportChartSchema.updateOne(
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
                })
        } else {
            callback({
                "response_code": 502,
                "response_message": "Please provide required information.",
                "response_data": {}
            });
        }
    },
    viewReport: function (data, callback) {
        if (data) {
            reportChartSchema.aggregate([
                {
                    $match: {
                        _id: data._id
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        module: 1,
                        reportType: 1,
                        chartType: 1,
                        field: 1,
                        reportData: 1
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
                            "response_message": "Details",
                            "response_data": result[0]
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
}
module.exports = ReportChartModels;