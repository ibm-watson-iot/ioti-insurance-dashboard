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

var express = require('express');
var auth = require('basic-auth');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var csurf = require('csurf');
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var helmet = require('helmet');

var app = express();
var api = express();
var db = require("./util/db.js");
var util = require('./util/util.js');

var models = require("./models.js");
var userResources = require("./resources/user.js");
var aggregatedResources = require("./resources/aggregated.js");
var snapshotResources = require("./resources/snapshot.js");

var messages = require('./messages.js');
var nodeuuid = require('node-uuid');

if (global.v8debug) {
	global.v8debug.Debug.setBreakOnException();
}

process.on('uncaughtException', function (err) {
    var errid = nodeuuid.v4();
    console.error(messages.uncaught_error, errid, err.stack);
    console.error("Error %s %j", errid, err);
});

app.disable('x-powered-by');

var workingOnLocalDeveloperLaptop = (process && process.env && process.env.VCAP_SERVICES) === undefined;
if (workingOnLocalDeveloperLaptop) {
	app.use(helmet({ hsts: false }));
}
else {
	app.use(helmet());
	app.use(helmet.hsts({
		maxAge: 10886400000,     // Must be at least 18 weeks to be approved by Google
	  includeSubdomains: true, // Must be enabled to be approved by Google
	  preload: true
	}));
}
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    objectSrc: ["'self'"]
  }
}));

var hour = 3600000;
// add session to store the api-key and auth token in the session
app.use(session({
	secret: 'iotfCloud123456789',
	saveUninitialized: false,
	resave: true,
	rolling: true,
	cookie: {
		httpOnly: true,
		secure: true,
		maxAge: hour
	}
}));

app.enable('trust proxy');

// First - auth check
// add session to store the api-key and auth token in the session
app.use(function(req, res, next) {

	if (req.secure) {
        // request was via https, so do no special handling
		authUser(req, res, next);
	} else {
        // request was via http, so redirect to https
		// Details: http://www.tonyerwin.com/2014/09/redirecting-http-to-https-with-nodejs.html
        res.redirect('https://' + req.headers.host + req.url);
	}
});

var authUser = function(req, res, next) {
	if ( req.path == "/login" || req.path == "/dashboard/login.html" || req.path.indexOf( "/dashboard/directives/login") == 0 || req.path.indexOf("node_modules") >= 0 || req.path.indexOf("languages") >= 0 || req.path.indexOf( "/icons") == 0 ) {
		next();
		return;
	}

	if (!req.session.user || req.session.loggedStatus!=0) {
		req.session.loggedStatus = 2;

		if ( req.session.originalPath == undefined) {
			req.session.originalPath = req.path;
		}

		res.redirect( "/login");
	}
	else {
		next();
	}
};

var credentialsRegExp = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9\-\._~\+\/]+=*) *$/;

// cookie-based CSRF protection
app.use(cookieParser("123456789iotfCloud", {secure: true, httpOnly: true}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(csurf({cookie: {secure: true, httpOnly: true}}));

app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {secure: true});
	if (req.session.loggedStatus != 0) {
	  res.setHeader( "X-iot4i-web-auth-msg", "authrequired");
	  res.setHeader( "X-iot4i-web-auth", "/login");
  }

  next();
});

app.use(function(err, req, res, next) {
	if (err.code !== 'EBADCSRFTOKEN')
		return next(err);

		// handle CSRF token errors here
	res.status(403);
	res.send('Forbidden: form tampered with!');
});

var logout = {
    'spec': {
        description: "Operations about Authentication",
        path: "/logout",
        method: "GET",
        summary: "Logs out the user",
        notes: "Logs out the user from the current session",
        nickname: "logout",
        parameters: [],
    },
    'action': function(req, res) {
		req.session.user = null;
		req.session.password = null;
		req.session.loggedStatus = 1; // 0 loggedIN 1 loggededOUT 2 logging

		req.session.destroy();

		res.redirect( "/login");
    }
};

app.use("/dashboard", express.static('.'));
app.use( "/data", api);
app.use( "/icons", express.static("./assets/icons"));

var port = process.env.VCAP_APPLICATION ? process.env.PORT || 8080 : 3000;
var host = process.env.VCAP_APPLICATION ? '0.0.0.0' : 'localhost';

// swagger
var swagger = require("swagger-node-express").createNew(api);
// use HTTPS by default
var swaggerport = process.env.VCAP_APPLICATION ? 443 : port;
var host2 = host;
if(process.env.APIDOMAIN)//process.env.application_uris && process.env.application_uris[0])
	host2 = process.env.APIDOMAIN;//process.env.application_uris[0];

if(process.env.APIPORT)
	swaggerport = process.env.APIPORT;

swagger.addModels(models)
	.addGet(logout)
	.addGet( userResources.getUserByUserName)
	.addGet( userResources.getIoTDataForUser)
	.addGet( userResources.getUserAssets)
	.addGet( userResources.getMyUser)
	.addPost(userResources.postUserSearch)
	.addGet(userResources.getUserSearchHistory)
	.addPost(userResources.postClearUserSearchHistory)
	.addPost(userResources.postUserFavorite)
	.addGet(userResources.getUserFavorites)

	.addGet( aggregatedResources.getUserAlerts)

	.addGet(snapshotResources.getSnapshotSubregion)
	.addGet(snapshotResources.getSnapshotRegion)
	.addGet(snapshotResources.getSnapshotCountry);

swagger.configureDeclaration("user", {
	  description : "Operations about Users",
	  authorizations : ["oauth2"],
	  consumes: ['application/json','multipart/form-data'],
	  produces: ["application/json"]
});

swagger.configureDeclaration("logout", {
	  description : "Operations about Users",
	  authorizations : ["none"],
	  consumes: ['application/json','multipart/form-data'],
	  produces: ["application/json"]
});

swagger.configureDeclaration("aggregated", {
	  description : "Aggregated data",
	  authorizations : ["oauth2"],
	  consumes: ['application/json','multipart/form-data'],
	  produces: ["application/json"]
});

//Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "");
swagger.configure("https://" + host2 + ":" + swaggerport+"/data", "1.0.0");

//Serve ootb swagger ui
app.use('/swaggerui/', express.static('./node_modules/swagger-node-express/swagger-ui'));
// Redirect to swagger ui with url param to our api docs
app.get('/dist', function(req, res) {
  res.writeHead(302, { 'Location' : '/swaggerui?url=/data/api-docs' });
  res.end();
});

app.get("/login", function (req, res) {
    res.redirect("/dashboard/login.html");
});

var parseForm = bodyParser.urlencoded({ extended: false });

app.post("/login", parseForm, function (req, res) {

	util.validateUser( req, res, 13, function(err, isUserValid) {

			if (err) {
				req.session.error = 'Authentication failed, please check the username and password.';
				console.log( 'Authentication failed: ' + req.body.username);
	            res.redirect('/login');
			} else if ( !isUserValid) {
				req.session.error = 'Insufficient privileges.';
				console.log( 'Insufficient privileges: ' + req.body.username);
	            res.send('Insufficient privileges to access the dashboard.');
	            res.end();
			} else {

				req.session.regenerate(function(err) {
					req.session.user = req.body.username;
					req.session.loggedStatus = 0;
					req.session.pass = req.body.password;

					console.log( "Redirecting to dashboard " + req.session.originalPath);

					if ( req.session.originalPath) {
						res.redirect(req.session.originalPath);
					} else {
						res.redirect("/dashboard");
					}
				});
			}
		});
});

console.log( messages.server_starting);

if (workingOnLocalDeveloperLaptop) {
	// use self-signed cert for dev env
	var server = https.createServer({
    key: fs.readFileSync('./dev_ssl/server.key'),
    cert: fs.readFileSync('./dev_ssl/server.crt'),
    ca: fs.readFileSync('./dev_ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
	}, app);
	server.listen(port, host, function() {
		console.log( messages.server_started, server.address().address, server.address().port);
	});
} else {
	// Start the server on port 80
	var server = app.listen(port, host, function() {
	  console.log( messages.server_started, server.address().address, server.address().port);
	});
}
