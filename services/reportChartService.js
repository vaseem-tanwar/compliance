'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
//======================MODELS============================
var ReportChartModels = require('../models/reportChart');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var ReportChartService = {
    //Report related data list
    listRelatedData: (data, callback) => {
        var responseList ={
            module:[
                {
                    label:'Accident/Incident',
                    value:'accident',
                    reportType:[
                        {value:'table',label:'Table'},
                        {value:'chart',label:'Chart'}
                    ],
                    fieldList:[
                        {
                            value:'createdAt',
                            label:'Created Date',
                            chartList:[
                                {
                                    value:'timeline',
                                    label:'Timeline chart'
                                }
                            ]
                        },
                        {
                            value:'completedDate',
                            label:'Completion Date',
                            chartList:[
                                {
                                    value:'timeline',
                                    label:'Timeline chart'
                                }
                            ]
                        },
                        {
                            value:'stage',
                            label:'Stages',
                            chartList:[
                                {
                                    value:'pie',
                                    label:'Pie chart'
                                },
                                {
                                    value:'vertical',
                                    label:'vertical bar chart'
                                },
                                {
                                    value:'horizontal',
                                    label:'Horizontal bar chart'
                                }
                            ]
                        },
                        {
                            value:'stageStatus',
                            label:'Status',
                            chartList:[
                                {
                                    value:'pie',
                                    label:'Pie chart'
                                },
                                {
                                    value:'vertical',
                                    label:'Vertical bar chart'
                                },
                                {
                                    value:'horizontal',
                                    label:'Horizontal bar chart'
                                }
                            ]
                        }
                    ]
                },
                {
                    label:'NCR',
                    value:'ncr',
                    reportType:[
                        {value:'table',label:'Table'},
                        {value:'chart',label:'Chart'}
                    ],
                    fieldList:[
                        {
                            value:'createdAt',
                            label:'Created Date',
                            chartList:[
                                {
                                    value:'timeline',
                                    label:'Timeline chart'
                                }
                            ]
                        },
                        {
                            value:'completedDate',
                            label:'Completion Date',
                            chartList:[
                                {
                                    value:'timeline',
                                    label:'Timeline chart'
                                }
                            ]
                        },
                        {
                            value:'stage',
                            label:'Stages',
                            chartList:[
                                {
                                    value:'pie',
                                    label:'Pie chart'
                                },
                                {
                                    value:'vertical',
                                    label:'Vertical bar chart'
                                },
                                {
                                    value:'horizontal',
                                    label:'Horizontal bar chart'
                                }
                            ]
                        },
                        {
                            value:'stageStatus',
                            label:'Status',
                            chartList:[
                                {
                                    value:'pie',
                                    label:'Pie chart'
                                },
                                {
                                    value:'vertical',
                                    label:'Vertical bar chart'
                                },
                                {
                                    value:'horizontal',
                                    label:'Horizontal bar chart'
                                }
                            ]
                        }
                    ]
                },
                {
                    label:'Improvement',
                    value:'improvement',
                    reportType:[
                        {value:'table',label:'Table'},
                        {value:'chart',label:'Chart'}
                    ],
                    fieldList:[
                        {
                            value:'createdAt',
                            label:'Created Date',
                            chartList:[
                                {
                                    value:'timeline',
                                    label:'Timeline chart'
                                }
                            ]
                        },
                        {
                            value:'completedDate',
                            label:'Completion Date',
                            chartList:[
                                {
                                    value:'timeline',
                                    label:'Timeline chart'
                                }
                            ]
                        },
                        {
                            value:'stage',
                            label:'Stages',
                            chartList:[
                                {
                                    value:'pie',
                                    label:'Pie chart'
                                },
                                {
                                    value:'vertical',
                                    label:'vertical bar chart'
                                },
                                {
                                    value:'horizontal',
                                    label:'Horizontal bar chart'
                                }
                            ]
                        },
                        {
                            value:'stageStatus',
                            label:'Status',
                            chartList:[
                                {
                                    value:'pie',
                                    label:'Pie chart'
                                },
                                {
                                    value:'vertical',
                                    label:'vertical bar chart'
                                },
                                {
                                    value:'horizontal',
                                    label:'Horizontal bar chart'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        callback({
            "response_code": 200,
            "response_message": "List.",
            "response_data": responseList
        });
    },
    
    //Get data for report generate
    getDataforReportGenerate: (data, callback) => {
        ReportChartModels.getDataforReportGenerate(data, function (result) {
            callback(result);
        });
    },
    
    //Add report data
    addReportData: (data, callback) => {
        data._id = new ObjectID;
        ReportChartModels.addReportData(data, function (result) {
            callback(result);
        });
    },
    
    //list report data
    listReport: (data, callback) => {
        ReportChartModels.listReport(data, function (result) {
            callback(result);
        });
    },
    
    //delete report
    deleteReport: (data, callback) => {
        ReportChartModels.deleteReport(data, function (result) {
            callback(result);
        });
    },
    
    //view report
    viewReport: (data, callback) => {
        ReportChartModels.viewReport(data, function (result) {
            callback(result);
        });
    }
}
module.exports = ReportChartService;