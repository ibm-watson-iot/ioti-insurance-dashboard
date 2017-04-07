/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var utils = require( "./sysUtils.js");

describe('Initialization', function() {
	if ( process.env.IOT4I_SERVER && process.env.IOT4I_SERVER.length >0) {
		console.log( "Running on external server %s", process.env.IOT4I_SERVER);
		return;
	}

	// point WF to the wf-config.json file
	if ( !process.env.WF_CONFIG_FILE_PATH) {
		process.env.WF_CONFIG_FILE_PATH='wf-config.json';
	}
	
	// copy the credentials file in the test bin file
	utils.copyFile( '/credentials.json', '/node_modules/mocha/bin');
	
	var app = require( "../app.js");
	console.log( "Running embedded server.");
});