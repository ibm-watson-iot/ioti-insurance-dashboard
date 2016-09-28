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

function devicesPageDirective(){
	return {
	    restrict: 'E', // C: class, E: element, M: comments, A: attributes
	    replace: true, // replaces original content with template
	    templateUrl: "directives/devices-page.html",
	    controller: devicesPageController
	  };
}

function devicesPageController($scope, $http, $q, aggregator, regionData) {

	$scope.$watch('context.selectedDate', function(newValue, oldValue) {
		if (newValue) {
		  getPageData($scope, $http, $q, aggregator, regionData, newValue.toISOString(), $scope.context.currentLocation);
		}
	});

	$scope.$watch('context.currentLocation', function(newValue, oldValue) {
		if (newValue) {
		  getPageData($scope, $http, $q, aggregator, regionData, $scope.context.selectedDate.toISOString(), newValue);
		}
	});
}

function getId(obj) {
	return obj.id ? obj.id : obj;
}

function getPageData($scope, $http, $q, aggregator, regionData, date, location) {

	$scope.progress.geodataLoading += 2;

	var shields = {
		title : "Shields",
		icon : "/icons/shield.png",
		table : {
				headers: [
				"Shield",
				"Uncompliant",
				"Total"
			],
			data: []
		},
		bar : {
			headers: {
			type1 : "Compliant",
			type2 : "Uncompliant"
		},
		data: []
		}
	};

	var devices = {
			title : "Device Status",
			icon : "/icons/device.png",
			table : {
					headers: [
					"Devices",
					"Disconnected",
					"Total"
				],
				data: []
			},
			bar : {
				headers: {
				type1 : "Connected",
				type2 : "Disconnected"
			},
			data: []
			}
		};

	var promise;
	var promiseStats;
	regionData.getGeoIDFromLocation(location).then(function(geo) {
		if (geo.subregion) {
			promise = aggregator.getSubregion(geo.country, geo.region, getId(geo.subregion), date);
			promiseStats = $q(function(resolve, reject) {
				promise.then(function(result) {
					resolve([result]);
				}, function(err) {
					reject(err);
				});
			});
		} else if (geo.region) {
			promise = aggregator.getRegion(geo.country, getId(geo.region), date);
			promiseStats = aggregator.getSubregions(geo.country, getId(geo.region), date);
		} else {
			promise = aggregator.getCountry(geo.country, date);
			promiseStats = aggregator.getRegions(geo.country, date);
		}
		promise.then(function(obj) {
			if (!obj) {
				$scope.chartshields = null;
				$scope.chartdevices = null;
				return;
			}
			var shieldsPerType = obj.shieldsPerType;
			var sTabledata = [];
			var sBardata = [];
			for ( var i in shieldsPerType) {
				var sTotal = shieldsPerType[i].total || 0;
				var uncompliant = shieldsPerType[i].uncompliant || 0;
				var sTableitem = [ i, uncompliant, sTotal ];
				sTabledata.push(sTableitem);
				var sBaritem = [ i, sTotal, uncompliant ];
				sBardata.push(sBaritem);
			}
			shields.table.data = sTabledata;
			shields.bar.data = sBardata;
			$scope.chartshields = shields;

			var devicesPerType = obj.devicesPerType;
			var tabledata = [];
			var bardata = [];
			for ( var j in devicesPerType) {
				var total = devicesPerType[j].total || 0;
				var connected = devicesPerType[j].connected || 0;
				var disconnected = total - connected;
				var tableitem = [ j, disconnected, total ];
				tabledata.push(tableitem);
				var baritem = [ j, connected, disconnected ];
				bardata.push(baritem);
			}
			devices.table.data = tabledata;
			devices.bar.data = bardata;
			$scope.chartdevices = devices;

		},
		function(err) {
			console.warn(err);
		}).finally(function() {
			$scope.progress.geodataLoading -= 1;
		});
		promiseStats.then(function(data) {
			$scope.statistics = data;

			var values = [];
			for ( i = 0; i < data.length; ++i) {
				// TODO: using shields instead of users for now
				values.push( [ data[i].name, data[i].totalDevices, data[i].totalShields ]);
			}
			$scope.statstable= {
					title : "Aggregated Statistics",
					headers: [ geo.region ? "County":"State", "Device Count", "User Count"],
					data: values
			};
		}).finally(function() {
			$scope.progress.geodataLoading -= 1;
		});
	}, function(err) {
		$scope.chartshields = null;
		$scope.chartdevices = null;
		$scope.progress.geodataLoading -= 2;

		console.warn(err);
	});
}

// module
var app = angular.module('iot-dashboard');

// directives
app.directive('devicesPage', [devicesPageDirective]);
