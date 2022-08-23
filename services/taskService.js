'use strict';
var express = require("express");
var config = require('../config.js');
var _async = require("async");
var mongo = require('mongodb');
var ObjectID = mongo.ObjectId;
//======================MODELS============================
var TaskModels = require('../models/task');
//======================Module============================
var mailProperty = require('../modules/sendMail');
//======================Schema============================

var taskService = {

    //Task related data list
    taskDataList: (data, callback) => {
        TaskModels.taskDataList(data, function (result) {
            callback(result);
        });
    },
    //Task related data list
    addTask: (data, callback) => {
        data._id = new ObjectID;
        TaskModels.addTask(data, function (result) {
            callback(result);
        });
    },
    //list Task
    listTask: (data, callback) => {
        TaskModels.listTask(data, function (result) {
            callback(result);
        });
    },
    //Task status change
    taskStatusChange: (data, callback) => {
        TaskModels.taskStatusChange(data, function (result) {
            callback(result);
        });
    },
    //Delete Task
    deleteTask: (data, callback) => {
        TaskModels.deleteTask(data, function (result) {
            callback(result);
        });
    },
    //Get Task
    getTaskDetails: function (data, callback) {
        TaskModels.getTaskDetails(data, function (content) {
            callback(content);
        });
    },
    //Edit Task
    editTask: function (data, callback) {
        TaskModels.editTask(data, function (content) {
            callback(content);
        });
    },
    //list Assign Task
    listAssignTask: (data, callback) => {
        TaskModels.listAssignTask(data, function (result) {
            callback(result);
        });
    },
    //Task sing off
    signOffTask: (data, callback) => {
        TaskModels.signOffTask(data, function (result) {
            callback(result);
        });
    },
}
module.exports = taskService;