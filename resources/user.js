/*****************************************************
Data Privacy Disclaimer

This Program has been developed for demonstration purposes only to illustrate the technical capabilities and potential business uses of the IBM IoT for Insurance

The components included in this Program may involve the processing of personal information (for example location tracking and behavior analytics). When implemented in practice such processing may be subject to specific legal and regulatory requirements imposed by country specific data protection and privacy laws.  Any such requirements are not addressed in this Program.

Licensee is responsible for the ensuring Licenseeís use of this Program and any deployed solution meets applicable legal and regulatory requirements.  This may require the implementation of additional features and functions not included in the Program. 


Apple License issue

This Program is intended solely for use with an Apple iOS product and intended to be used in conjunction with officially licensed Apple development tools and further customized and distributed under the terms and conditions of Licenseeís licensed Apple iOS Developer Program or Licenseeís licensed Apple iOS Enterprise Program.  

Licensee agrees to use the Program to customize and build the application for Licenseeís own purpose and distribute in accordance with the terms of Licenseeís Apple developer program 


Risk Mitigation / Product Liability Issues

The Program and any resulting application is not intended for design, construction, control, or maintenance of automotive control systems where failure of such sample code or resulting application could give rise to a material threat of death or serious personal injury.  The Program is not intended for use where bodily injury, tangible property damage, or environmental contamination might occur as a result of a failure of or problem with such Program.  

IBM shall have no responsibility regarding the Program's or resulting application's compliance with laws and regulations applicable to Licenseeís business and content. Licensee is responsible for use of the Program and any resulting application.

As with any development process, Licensee is responsible for developing, sufficiently testing and remediating Licenseeís products and applications and Licensee is solely responsible for any foreseen or unforeseen consequences or failures of Licenseeís products or applications.


REDISTRIBUTABLES

If the Program includes components that are Redistributable, they will be identified in the REDIST file that accompanies the Program. In addition to the license rights granted in the Agreement, Licensee may distribute the Redistributables subject to the following terms:

1) Redistribution must be in source code form only and must conform to all directions, instruction and specifications in the Program's accompanying REDIST or documentation;
2) If the Program's accompanying documentation expressly allows Licensee to modify the Redistributables, such modification must conform to all directions, instruction and specifications in that documentation and these modifications, if any, must be treated as Redistributables;
3) Redistributables may be distributed only as part of Licensee's application that was developed using the Program ("Licensee's Application") and only to support Licensee's customers in connection with their use of Licensee's Application. Licensee's application must constitute significant value add such that the Redistributables are not a substantial motivation for the acquisition by end users of Licensee's software product;
4) If the Redistributables include a Java Runtime Environment, Licensee must also include other non-Java Redistributables with Licensee's Application, unless the Application is designed to run only on general computer devices (e.g., laptops, desktops and servers) and not on handheld or other pervasive devices (i.e., devices that contain a microprocessor but do not have computing as their primary purpose);
5) Licensee may not remove any copyright or notice files contained in the Redistributables;
6) Licensee must hold IBM, its suppliers or distributors harmless from and against any claim arising out of the use or distribution of Licensee's Application;
7) Licensee may not use the same path name as the original Redistributable files/modules;
8) Licensee may not use IBM's, its suppliers or distributors names or trademarks in connection with the marketing of Licensee's Application without IBM's or that supplier's or distributor's prior written consent;
9) IBM, its suppliers and distributors provide the Redistributables and related documentation without obligation of support and "AS IS", WITH NO WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING THE WARRANTY OF TITLE, NON-INFRINGEMENT OR NON-INTERFERENCE AND THE IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.;
10) Licensee is responsible for all technical assistance for Licensee's Application and any modifications to the Redistributables; and
11) Licensee's license agreement with the end user of Licensee's Application must notify the end user that the Redistributables or their modifications may not be i) used for any purpose other than to enable Licensee's Application, ii) copied (except for backup purposes), iii) further distributed or transferred without Licensee's Application or iv) reverse assembled, reverse compiled, or otherwise translated except as specifically permitted by law and without the possibility of a contractual waiver. Furthermore, Licensee's license agreement must be at least as protective of IBM as the terms of this Agreement.


Feedback License

In the event Licensee provides feedback to IBM regarding the Program, Licensee agrees to assign to IBM all right, title, and interest (including ownership of copyright) in any data, suggestions, or written materials that 1) are related to the Program and 2) that Licensee provides to IBM.
******************************************************/

var sw = require("swagger-node-express");
var paramTypes = sw.paramTypes;
var url = require("url");
var swe = sw.errors;
var async = require("async");
var db = require("../util/db.js");
var util = require("../util/util.js");

function writeResponse(response, data) {
    response.header('Access-Control-Allow-Origin', "*");
    response.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    response.header("Access-Control-Allow-Headers", "Content-Type");
    response.header("Content-Type", "application/json; charset=utf-8");
    response.send(JSON.stringify(data));
}

function formatDate(date) {
    try {
        return new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    } catch (err) {
        return "";
    }
}

exports.getMyUser = {
    'spec': {
        description: "Operations about Users",
        path: "/myUser",
        method: "GET",
        summary: "Get my user",
        notes: "Returns a user based on the authenticated user.",
        type: "User",
        nickname: "getMyUser",
        produces: ["application/json"],
        parameters: [],
        responseMessages: [swe.notFound('user')]
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                var userName = req.session.user;
                db.getUserByUsername(userName, function(err, doc) {
                    console.log("Logged user: " + userName);
                    if (err) {
                        swe.notFound('user', res);
                    } else {
                        var data = {
                            username: userName,
                            firstname: doc.firstname,
                            lastname: doc.lastname,
                            fullname: doc.fullname
                        };

                        //console.dir(data);

                        res.send(data);
                    }
                });
            }
        });
    }
};

exports.getUserAssets = {
    'spec': {
        description: "Operations about Users",
        path: "/assets/{userName}",
        method: "GET",
        summary: "Get the assets for the insured user",
        notes: "Returns the user asstes by user name",
        type: "User",
        nickname: "getUserAssets",
        produces: ["application/json"],
        parameters: [paramTypes.path("userName", "Username of user that needs to be fetched", "string")],
        responseMessages: [swe.notFound('users')]
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                if (!req.params.userName) {
                    swe.invalid('userName');
                    return;
                }

                var userName = req.params.userName;

                var assets = [{
                    'name': 'My home',
                    'address': 'Cluj-Napoca, Deleanu 24'
                }, {
                    'name': 'My office',
                    'address': 'Cluj-Napoca, Maestro Business Center'
                }];

                res.send(assets);
            }
        });
    }
};

exports.getUserByUserName = {
    'spec': {
        description: "Operations about Users",
        path: "/user/{userName}",
        method: "GET",
        summary: "Get user by Username",
        notes: "Returns a user based on Username",
        type: "User",
        nickname: "getUserByUserName",
        produces: ["application/json"],
        parameters: [paramTypes.path("userName", "Username of user that needs to be fetched", "string")],
        responseMessages: [swe.notFound('users')]
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                if (!req.params.userName) {
                    swe.invalid('userName');
                    return;
                }

                var userName = req.params.userName;

                db.getUserByUsername(userName, function(err, user) {
                    if (err) {
                        console.log("User not found " + userName);
                        swe.notFound('user', res);
                        return;
                    } else {
                        var data = {
                            username: user.username,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            contact: {
                                address: user.address,
                                zipcode: user.zipcode,
                                email: user.email,
                                phone: user.phone
                            },
                            assets: []
                        };

                        if (user.assets) {
                            user.assets.forEach(function(asset) {
                                data.assets.push({
                                    name: asset.name,
                                    address: asset.address
                                });
                            });
                        }

                        res.send(data);
                    }
                });
            }
        });
    }
};

function getShield(uuid, shields) {
    for (var i = 0; i < shields.rows.length; ++i) {
        if (shields.rows[i].doc.UUID == uuid) {
            return shields.rows[i].doc;
        }
    }

    return null;
}

exports.getIoTDataForUser = {
    'spec': {
        description: "Operations about Users",
        path: "/aggregated/iotdata/{userName}",
        method: "GET",
        summary: "Get user data by Username",
        notes: "Returns the iot data for the user based on Username",
        type: "UserIoTData",
        nickname: "getIoTDataForUser",
        produces: ["application/json"],
        parameters: [paramTypes.path("userName", "User for which the aggregated data is to be fetched", "string")],
        responseMessages: [swe.notFound('iotdata')]
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                var user = req.params.userName;

                var tasks = [];

                var userShields = [];
                tasks.push(function(callback) {

                    db.getAllShields(function(err, shields) {

                        db.getUserShieldAssociations(user, function(err, associations) {
                            associations.rows.forEach(function(row) {
                                var shield = getShield(row.doc.shieldUUID, shields);
                                if (shield) {
                                    var shieldInfo = [shield.name, shield.type, shield.description];
                                    userShields.push(shieldInfo);
                                }
                            });
                        });

                        callback();
                    });
                });

                var activeAlert = false;
                var alerts = [];
                tasks.push(function(callback) {

                    db.getUserHazardEvents(user, true, function(err, data) {
                        if (err) {
                            console.log("Error getting alert data: " + err);
                        } else {
                            data.rows.forEach(function(row) {
                                //["Type","Location","Triggered","Reset","Reset By","Claim"];
                                var alert = [ row.doc.extra && row.doc.extra.deviceDesc || "Unknown",
                                    row.doc.extra && row.doc.extra.locationDesc || "Unspecified",
                                    formatDate(row.doc.timestamp),
                                    row.doc.isHandled ? formatDate(row.doc.handledAt) : "Now active! Since " + formatDate(row.doc.timestamp),
                                    row.doc.isHandled ? row.doc.handledBy : "",
                                    row.doc.isHandled ? row.doc.isHandled : ""
                                ];

                                if (!row.doc.isHandled) {
                                    activeAlert = true;
                                }

                                alerts.push(alert);
                            });
                        }

                        alerts.sort(function(a, b) {
                            return a[3] == b[3] ? 0 : (a[3] > b[3] ? -1 : 1);
                        });

                        callback();
                    });
                });

                var devices = [];
                tasks.push(function(callback) {

                    db.getUserDevices(user, true, function(err, userDevices) {
                        userDevices.rows.forEach(function(userDevice) {
                            var newDevice = [];
                            newDevice.push(userDevice.doc.model_name);
                            newDevice.push(userDevice.doc.location);
                            newDevice.push(userDevice.doc.device_manufacturer);
                            newDevice.push('icon-' + userDevice.doc.status);
                            devices.push(newDevice);
                        });

                        callback();
                    });
                });

                var messages = [];
                tasks.push(function(callback) {

                    db.getUserMessages(user, true, function(err, data) {
                        if (err) {
                            console.log("Error getting alert data: " + err);
                        } else {
                            data.rows.forEach(function(row) {
                                //["Type","Location","Triggered","Reset","Reset By","Claim"];
                                var message = [formatDate(row.doc.sentAt), row.doc.message, formatDate(row.doc.readAt)];
                                messages.push(message);
                            });
                        }

                        messages.sort(function(a, b) {
                            return a[0] == b[0] ? 0 : (a[0] > b[0] ? -1 : 1);
                        });

                        callback();
                    });
                });

                async.parallel(tasks, function() {

                    var data = {
                        "activeAlert": activeAlert,
                        tables: [{
                            title: "Devices",
                            headers: ["Type", "Location", "Manufacturer", "Status"],
                            data: devices
                        }, {
                            title: "Shields",
                            headers: ["Name", "Type", "Description"],
                            data: userShields
                        }, {
                            title: "Alerts",
                            headers: ["Type", "Location", "Triggered", "Reset", "Reset By", "Claim"],
                            data: alerts
                        }, {
                            title: "Messages",
                            headers: ["Date sent", "Message", "Read"],
                            data: messages
                        }, {
                            title: "VAS",
                            headers: [
                                "Name", "Services", "Contact", "Promo Code"
                            ],
                            data: [
                                ["John Waters", "Plumber", "+1-877-1753455", "Q9UZYR"],
                                ["Patrick Light", "Electrician", "+1-877-2713655", "A9ZY4U"],
                                ["George Goodhands", "General Contractor", "+1-877-6713355", "ZVYUR1"]
                            ]
                        }]
                    };

                    res.send(data);
                });
            }
        });
    }
};

exports.postUserSearch = {
    'spec': {
        description: "Operations about User Search",
        path: "/search/searchString/{searchString}",
        method: "POST",
        summary: "Post a new search to the user search history",
        notes: "Returns a the user search history",
        type: "User",
        nickname: "postUserSearch",
        produces: ["application/json"],
        parameters: [paramTypes.path("searchString", "Username of user that needs to be fetched", "string")],
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                var user = req.session.user;
                var searchString = req.params.searchString;

                db.addSearchHistoryByUsername(user, searchString, function(err, history) {
                    if (!err) {

                        // TO-DO: move in DB layer
                        var uniqueSearch = history.reverse().filter(function(item, pos, self) {
                            return self.indexOf(item) == pos;
                        });

                        res.send(uniqueSearch);
                    }
                });
            }
        });
    }
};


exports.getUserSearchHistory = {
    'spec': {
        description: "Operations about Users",
        path: "/search",
        method: "GET",
        summary: "Get the assets for the insured user",
        notes: "Returns the user asstes by user name",
        type: "User",
        nickname: "getUserSearchHistory",
        produces: ["application/json"],
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                var user = req.session.user;
                db.getSearchHistoryByUsername(user, function(err, history) {
                    if (!err) {

                        // TO-DO: move in DB layer
                        var uniqueSearch = history.reverse().filter(function(item, pos, self) {
                            return self.indexOf(item) == pos;
                        });

                        res.send(uniqueSearch);
                    } else {
                        res.send([]);
                    }
                });
            }
        });
    }
};

exports.postClearUserSearchHistory = {
    'spec': {
        description: "Operations about Users",
        path: "/search/clear",
        method: "POST",
        summary: "Get the assets for the insured user",
        notes: "Returns the user asstes by user name",
        type: "User",
        nickname: "postClearUserSearchHistory",
        produces: ["application/json"],
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                var user = req.session.user;
                db.clearSearchHistoryByUsername(user, function(err, history) {
                    if (!err) {
                        res.send(history);
                    }
                });
            }
        });
    }
};



exports.postUserFavorite = {
    'spec': {
        description: "Operations about Users",
        path: "/favorites/favorite/{favorite}",
        method: "POST",
        summary: "Get the assets for the insured user",
        notes: "Returns the user asstes by user name",
        type: "favorites",
        nickname: "postUserFavorite",
        produces: ["application/json"],
        parameters: [paramTypes.path("favorite", "Username of user that needs to be fetched", "string")],
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                var user = req.session.user;
                var favorite = req.params.favorite;

                db.addFavoritesByUsername(user, favorite, function(err, favorites) {
                    if (!err) {
                        res.send(favorites);
                        //console.log("addFavoritesByUsername " + favorites);
                    } else {
                    	swe.notFound('favourite', res);
                    }
                });
            }
        });
    }
};

exports.getUserFavorites = {
    'spec': {
        description: "Operations about Users",
        path: "/favorites",
        method: "GET",
        summary: "Get the assets for the insured user",
        notes: "Returns the user asstes by user name",
        type: "favorites",
        nickname: "getUserFavorites",
        produces: ["application/json"],
    },
    'action': function(req, res) {
    	// TODO: remove, this is redundant now as the verification is done at login time in app.js
        util.validateUser(req, res, 13, function(er, validated) {
            if (!validated)
                swe.forbidden(res);
            else {
                var user = req.session.user;

                db.getFavoritesByUsername(user, function(err, favorites) {
                    if (!err) {
                        //console.log("getFavoritesByUsername " + favorites);
                        res.send(favorites);
                    } else {
                        //console.log(err);
                        res.send([]);
                    }
                });
            }
        });
    }
};
