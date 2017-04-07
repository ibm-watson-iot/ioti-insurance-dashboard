/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var request = require("request");
var execSync = require('child_process').execSync;
var isWin = /^win/.test(process.platform);
var testUtils = module.exports = {
		copyFile: function(fileSrc, folderDest) {
		  var cmd;
		  if (isWin) {
		    cmd = "copy " + process.cwd() + fileSrc + " " + process.cwd() + folderDest;
		    cmd = cmd.replace(/\//g, '\\');
		  }
		  else {
		    cmd = "cp " + process.cwd() + fileSrc + " " + process.cwd() + folderDest;
		  }

		  console.log("Running command: " + cmd);
		  execSync(cmd);
		},
		deleteFile: function(file) {
		  var cmd;
		  if (isWin) {
		    cmd = "del " + process.cwd() + file;
		    cmd = cmd.replace(/\//g, '\\');
		  }
		  else {
		    cmd = "rm " + process.cwd() + file;
		  }

		  console.log("Running command: " + cmd);
		  execSync(cmd);
		}
};
