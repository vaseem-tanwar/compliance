var supplierCategorySchema = require('../schema/supplierCategory');
var workplaceSchema = require('../schema/workplace');
var branchSchema = require('../schema/branch');
var addressSchema = require('../schema/address');
var supplierSchema = require('../schema/supplier');

var _async = require("async");
var fs = require('fs');
var config = require('../config.js');

var SupplierModels = {
    supplierDataList: function (data, callback) {
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
                category: function (CallBack) {
                    supplierCategorySchema.aggregate([
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
    addSupplier: function (data, callback) {
        if (data) {
            new supplierSchema(data).save(function (err, result) {
                if (err) {
                    callback({
                        "response_code": 505,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": {}
                    });
                } else {
                    if (data.address != null && data.address != '' && data.address != undefined) {
                        data.sourceId = result._id;
                        data.sourceType = 'supplier';
                        new addressSchema(data).save()
                    }
                    callback({
                        "response_code": 200,
                        "response_message": "Supplier added.",
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
    listSupplier: function (data, callback) {
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
            supplierSchema.aggregate([
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
                        from: "suppliercategories",
                        localField: "category",
                        foreignField: "_id",
                        as: "SupplierCategory"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        phone: 1,
                        email: 1,
                        branch: '$Branch',
                        workplace: '$Workplace',
                        category: '$SupplierCategory',
                        isActive: 1,
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
                                if (item.category.length > 0) {
                                    result[i].category = item.category[0].name;
                                } else {
                                    result[i].category = '';
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
    supplierStatusChange: function (data, callback) {
        if (data) {
            supplierSchema.updateOne(
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
    deleteSupplier: function (data, callback) {
        if (data) {
            supplierSchema.updateOne(
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
                            "response_message": "Supplier deleted.",
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
    getSupplierDetails: function (data, callback) {
        if (data) {
            supplierSchema.aggregate([
                {
                    $match: {
                        _id: data.supplierId
                    }
                },
                {
                    $lookup:
                    {
                        from: "addresses",
                        localField: "_id",
                        foreignField: "sourceId",
                        as: "AddressDetails"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        regNo: 1,
                        branch: 1,
                        workplace: 1,
                        contactName: 1,
                        email: 1,
                        fax: 1,
                        phone: 1,
                        mobile: 1,
                        webAddress: 1,
                        accountNumber: 1,
                        category: 1,
                        description: 1,
                        attachment: 1,
                        AddressDetails: '$AddressDetails',
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
                        result.addressType = '';
                        result.address = '';
                        if (result.length > 0) {
                            result = result[0];
                            if (result.AddressDetails != null && result.AddressDetails != undefined && result.AddressDetails != '') {
                                if (result.AddressDetails.length > 0) {
                                    result.addressType = result.AddressDetails[0].addressType;
                                    result.address = result.AddressDetails[0].address;
                                }
                            }
                        }
                        delete result.AddressDetails;
                        callback({
                            "response_code": 200,
                            "response_message": "Supplier Details.",
                            "response_data": {
                                details: result,
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
    editSupplier: function (data, callback) {
        if (data) {
            supplierSchema.updateOne(
                { _id: data._id },
                {
                    $set: {
                        name: data.name,
                        regNo: data.regNo,
                        branch: data.branch,
                        workplace: data.workplace,
                        contactName: data.contactName,
                        phone: data.phone,
                        fax: data.fax,
                        mobile: data.mobile,
                        webAddress: data.webAddress,
                        accountNumber: data.accountNumber,
                        category: data.category,
                        description: data.description
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
                                await supplierSchema.updateOne(
                                    { _id: data._id },
                                    { $push: { attachment: data.attachment[a] } })
                            }
                        }
                        await addressSchema.deleteOne({ sourceId: data._id });
                        if (data.address != null && data.address != '' && data.address != undefined) {
                            data.sourceId = data._id;
                            data.sourceType = 'supplier';
                            await new addressSchema(data).save()
                        }
                        callback({
                            "response_code": 200,
                            "response_message": "Supplier details updated.",
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
    deleteFileSupplier: function (data, callback) {
        if (data) {
            supplierSchema.findOne(
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
                        supplierSchema.updateOne(
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
                                    if (fs.existsSync('public/' + result.attachment[0].path)) {
                                        fs.unlinkSync('public/' + result.attachment[0].path)
                                    }
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
}
module.exports = SupplierModels;