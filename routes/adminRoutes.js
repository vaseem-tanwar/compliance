var express = require("express");
var Admin = require('../schema/admin');
var adminService = require('../services/adminService');
var bodyParser = require('body-parser');
var config = require('../config');
var jwt = require('jsonwebtoken');

module.exports = function (app, express) {

  var admin = express.Router();
  admin.use(bodyParser.json());
  admin.use(bodyParser.urlencoded({
    extended: false
  }));
  express.json();
  express.urlencoded({ extended: false });
  admin.post('/adminSignup', function (req, res) {
    var adminData = req.body;
    adminService.adminSignup(adminData, function (response) {
      res.send(response);
    });
  });
  admin.post('/adminLogin', function (req, res) {
    var adminData = req.body;
    adminService.adminLogin(adminData, function (response) {
      res.send(response);
    });
  });
  admin.post('/forgotpassLinksend', function (req, res) {
    var adminData = req.body;
    adminService.forgotpassLinksend(adminData, function (response) {
      res.send(response);
    });
  });
  admin.post('/adminChangePassword', function (req, res) {
    var token = req.headers['x-access-token'];
    adminService.jwtAuthVerification(token, function (authRes) {
      if (authRes.response_code === 200) {
        adminService.adminChangePassword(req.body, function (response) {
          res.send(response);
        });
      } else {
        res.send(authRes);
      }
    })
  });
  admin.post('/adminForgotPassword', function (req, res) {
    var adminData = req.body;
    adminService.adminForgotPassword(adminData, function (response) {
      res.send(response);
    });
  });
  /******************************
  *  Middleware to check token
  ******************************/
  admin.use(function (req, res, next) {
    var token = req.headers['authtoken'];
    if (token) {
      adminService.jwtAuthVerification(token, function (authRes) {
        if (authRes.response_code === 200) {
          req.decoded = authRes.response_data;
          next();
        } else {
          res.send(authRes);
        }
      });
    }
    else {
      res.send({
        response_code: 502,
        response_message: "Please provide required information.",
        response_data: null
      });
    }
  });
  /******************************
  *  Middleware to check token
  ******************************/
  admin.post('/getCompanyList', function (req, res) {
    adminService.getCompanyList(req.body, function (response) {
      res.send(response);
    });
  });
  admin.post('/addCompany', function (req, res) {
    adminService.addCompany(req.body, req.files, function (response) {
      res.send(response);
    });
  });
  admin.post('/userStatusChange', function (req, res) {
    adminService.userStatusChange(req.body, function (response) {
      res.send(response);
    });
  });
  admin.post('/getCompanyDetails', function (req, res) {
    adminService.getCompanyDetails(req.body, function (response) {
      res.send(response);
    });
  });
  admin.post('/editCompany', function (req, res) {
    adminService.editCompany(req.body, req.files, function (response) {
      res.send(response);
    });
  });

  //Add Employee
  admin.post('/addEmployee', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.addEmployee(req.body, req.files, function (result) {
      res.send(result);
    })
  });

  // Employee related data list
  admin.post('/employeeDataList', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.employeeDataList(req.body, function (result) {
      res.send(result);
    })
  });

  //List Employee
  admin.post('/listEmployee', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.listEmployee(req.body, function (result) {
      res.send(result);
    })
  });

  //Employee status change
  admin.post('/employeeStatusChange', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.employeeStatusChange(req.body, function (result) {
      res.send(result);
    })
  });

  //Delete Employee
  admin.post('/deleteEmployee', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.deleteEmployee(req.body, function (result) {
      res.send(result);
    })
  });

  //Details of Employee
  admin.post('/getEmployeeDetails', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.getEmployeeDetails(req.body, function (result) {
      res.send(result);
    })
  });

  //Delete files of employee
  admin.post('/deleteFileEmployee', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.deleteFileEmployee(req.body, function (result) {
      res.send(result);
    })
  });

  //Edit Employee
  admin.post('/editEmployee', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.editEmployee(req.body, req.files, function (result) {
      res.send(result);
    })
  });

  //List Access section
  admin.post('/listAccessSection', function (req, res) {
    adminService.listAccessSection(function (result) {
      res.send(result);
    });
  });

  //Employee access right details
  admin.post('/employeeAccessDetails', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.employeeAccessDetails(req.body, function (result) {
      res.send(result);
    })
  });

  //Employee access right edit
  admin.post('/editEmployeeAccessRight', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.editEmployeeAccessRight(req.body, function (result) {
      res.send(result);
    })
  });

  //Set skill attachtment
  admin.post('/setSkillAttachment', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.setSkillAttachment(req.body, req.files, function (result) {
      res.send(result);
    })
  });

  //Skill Related data list
  admin.post('/skillRelatedDataList', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.skillRelatedDataList(req.body, function (result) {
      res.send(result);
    })
  });

  //Add Employee Skill
  admin.post('/addEmployeeSkill', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.addEmployeeSkill(req.body, function (result) {
      res.send(result);
    })
  });

  //Add Employee Skill
  admin.post('/employeeSkillList', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.employeeSkillList(req.body, function (result) {
      res.send(result);
    })
  });

  //Delete files of employee skill attachement
  admin.post('/deletefileSkillAttachment', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.deletefileSkillAttachment(req.body, function (result) {
      res.send(result);
    })
  });

  ///Delete Employee skill
  admin.post('/deleteEmployeeSkill', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.deleteEmployeeSkill(req.body, function (result) {
      res.send(result);
    })
  });

  //Details Employee skill
  admin.post('/detailsEmployeeSkill', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.detailsEmployeeSkill(req.body, function (result) {
      res.send(result);
    })
  });

  //Details Employee skill
  admin.post('/editEmployeeSkill', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.editEmployeeSkill(req.body, function (result) {
      res.send(result);
    })
  });

  //Plant data related list
  admin.post('/plantDataList', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.plantDataList(req.body, function (result) {
      res.send(result);
    })
  });

  //Add Plant
  admin.post('/addPlant', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.addPlant(req.body, req.files, function (result) {
      res.send(result);
    })
  });

  //List Plant
  admin.post('/listPlant', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.listPlant(req.body, function (result) {
      res.send(result);
    })
  });

  //Plant status change
  admin.post('/plantStatusChange', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.plantStatusChange(req.body, function (result) {
      res.send(result);
    })
  });

  //Delete Plant
  admin.post('/deletePlant', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.deletePlant(req.body, function (result) {
      res.send(result);
    })
  });

  //Get Plant details
  admin.post('/getPlantDetails', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.getPlantDetails(req.body, function (result) {
      res.send(result);
    })
  });

  //Delete files of Plants
  admin.post('/deleteFilePlant', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.deleteFilePlant(req.body, function (result) {
      res.send(result);
    })
  });

  //Edit Plant
  admin.post('/editPlant', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.editPlant(req.body, req.files, function (result) {
      res.send(result);
    })
  });

  // Data Entry related data list
  admin.post('/dataEntryDataList', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.dataEntryDataList(req.body, function (result) {
      res.send(result);
    })
  });

  //Plant Data Entry
  admin.post('/addPlantDataEntry', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.addPlantDataEntry(req.body, req.files, function (result) {
      res.send(result);
    })
  });

  //List Plant Data Entry
  admin.post('/listPlantDataEntry', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.listPlantDataEntry(req.body, function (result) {
      res.send(result);
    })
  });

  //Edit Plant Data Entry
  admin.post('/editPlantDataEntry', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.editPlantDataEntry(req.body, req.files, function (result) {
      res.send(result);
    })
  });

  //Get Plant Data details
  admin.post('/getPlantDataEntryDetails', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.getPlantDataEntryDetails(req.body, function (result) {
      res.send(result);
    })
  });

  //Delete files of Plant Data
  admin.post('/deletefileDataEntry', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.deletefileDataEntry(req.body, function (result) {
      res.send(result);
    })
  });

  //List registered accident report
  admin.post('/listAccidentRegistered', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.listAccidentRegistered(req.body, function (result) {
      res.send(result);
    })
  });

  // Accident Action stage details
  admin.post('/accidentStageDetails', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.accidentStageDetails(req.body, function (result) {
      res.send(result);
    })
  });

  //get Accident generate related data list
  admin.post('/accidentRelatedDataList', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.accidentRelatedDataList(req.body, function (result) {
      res.send(result);
    })
  });

  //Accident report Details
  admin.post('/accidentReportDetails', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.accidentReportDetails(req.body, function (result) {
      res.send(result);
    })
  });

  //list Code
  admin.post('/listCode', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.listCode(req.body, function (result) {
      res.send(result);
    })
  });

  //List registered Environmental report
  admin.post('/listEnvironmentalRegistered', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.listEnvironmentalRegistered(req.body, function (result) {
      res.send(result);
    })
  });

  // Environmental Action stage details
  admin.post('/environmentalStageDetails', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.environmentalStageDetails(req.body, function (result) {
      res.send(result);
    })
  });

  //get Environmental generate related data list
  admin.post('/environmentalRelatedDataList', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.environmentalRelatedDataList(req.body, function (result) {
      res.send(result);
    })
  });

  //Environmental report Details
  admin.post('/environmentalReportDetails', function (req, res) {
    req.body.userId = req.decoded.id;
    req.body.createdBy = 'admin';
    adminService.environmentalReportDetails(req.body, function (result) {
      res.send(result);
    })
  });


  return admin;
}
