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

function quantizeItems(maxCount) {
	return d3.scaleQuantize()
    	.domain([0, maxCount])
    	.range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
}

const ASPECT_RATIO = 0.6;
const ZOOM_LEVEL = 5;

var usMapCache;

/**
 * Returns the continent/region/area where the map should be focused.
 */
function getMapFocus($scope) {
	return localStorage.getItem('com.ibm.iot4i.dashboard.region') || 'US';
}

var stateCentroids = d3.map();
var countyCentroids = d3.map();

function isNumber(obj) {
	return !isNaN(parseInt(obj));
}

/**
 * Returns ID of the geo feature
 * @param value
 */
function getIdForGeo($q, regionData, input) {
	return $q(function(resolve, reject) {
		if (!input) {
			return;
		}

		if (isNumber( input)) {
			resolve(input);
			return;
		}

		var lowercase = input.toLowerCase();
		regionData.getUSStateByNameOrCodeMapPromise().then(function(stateMap) {
			var state = stateMap[lowercase];
			if (state) {
				resolve(state.id);
			} else {
				regionData.getUSCountyByNameMapPromise().then(function(countyMap) {
					var county = countyMap[lowercase];
					if (county) {
						resolve(county.id);
					} else {
						resolve(null);
					}
				}, function(err) {
					reject(err);
				});
			}
		}, function(err) {
			reject(err);
		});
	});
}

function showMap($q, $scope, $element, aggregator, regionData, regionMap, subregionMap) {
	var id = "map-" + $scope.$id;
	$element.append( "<div id='" + id +"'></div>");

	var width = 500;//document.getElementById( id).offsetWidth;
	var height = width * ASPECT_RATIO;
	var projection;
	var topojsonFile;
	var mapFocus = getMapFocus($scope);

	$scope.mapWidth = width;
	var height = width * ASPECT_RATIO;

	if (mapFocus == "US") {
		topojsonFile = "/dashboard/assets/geomap/usMap.json";
		projection = d3.geoAlbersUsa()
	  		.scale(width)
	    		.translate([width / 2, height / 2]);
	}
	else if (mapFocus == "Europe") {
		topojsonFile = "/dashboard/assets/geomap/europeMap.json";
		projection = d3.geoEquirectangular()
			.scale(width / 1.5)
			.center([10, 50])
			.translate([width / 2, height / 2]);
	}


	var path = d3.geoPath()
	    .projection(projection);

	var svg = d3.select("#" + id)
		.append('div')
		.classed('svg-container', true) //container class to make it responsive
		.append('svg')
		.attr('id', "svg-element-" + id)
		.attr('preserveAspectRatio', 'xMinYMin meet')
		.attr('viewBox', '0 0 ' + width + ' ' + height)
		.classed('svg-content-responsive', true)
		.on('resize', function() { width = svg.style("width");} );

    var tooltip = d3.select("#" + id)
    	.append('div')
    	.attr('class', 'hidden tooltip')
    	.attr('id', "tooltip-" + id);

	svg.append('rect')
	    .attr('class', 'background')
	    .attr('width', width)
	    .attr('height', height)
	    .on('click', zoomOut);

	var g = svg.append('g')
		.attr('id', "gid-" + id)
		.attr('class', 'gid');

	var buttonZoomOut = svg.append('svg:foreignObject')
	    .attr('width', 30)
	    .attr('height', 30)
	    .attr('cursor', 'pointer')
	    .append('xhtml:span')
	    .attr('style', 'font-size: 16pt')
	    .attr('id', "buttonZoomOut-" + id)
	    .attr('class', 'glyphicon glyphicon-zoom-out hidden')
	    .on('click', zoomOut);

	var getAggregatorRegions = function(location, date, callback) {
		getIdForGeo($q, regionData, location).then(function(idForGeo) {
			if (!idForGeo) {
				aggregator.getRegions(location, date).then(function(result) {
					callback(null, result);
				}, function(err) {
					callback(err, null);
				});
			}
			else {
				aggregator.getRegions("US", date).then(function(result) {
					callback(null, result);
				}, function(err) {
					callback(err, null);
				});

				aggregator.getSubregions("US", {id:idForGeo}, date).then(function(result) {
					callback(null, result);
				}, function(err) {
					callback(err, null);
				});
			}
		});
	};

	d3.queue()
  		.defer(d3.json, topojsonFile)
		.defer(getAggregatorRegions, $scope.context.currentLocation, $scope.context.selectedDate.toISOString())
		.await(ready);

	function ready(error, usMap, restData) {
		if (error) return console.warn(error);
		usMapCache = usMap;

		var stateItems = d3.map();
		restData.forEach(function(d) {
			stateItems.set(d.id, d[$scope.attrToDisplay]);
		});

		g.append('g')
	    	.attr('id', 'counties')
	    	.selectAll('path')
	    	.data(topojson.feature(usMap, usMap.objects.counties).features)
	    	.enter().append('path')
	    	.attr('d', path)
	    	.attr('class', 'county')
	    	.attr('id', function(d) { return "county-" + id + "-" + d.id; })
	    	.on('click', function(county) { onClickCounty(county, $scope, true, regionMap, subregionMap); });

		var geodataStates = topojson.feature(usMap, usMap.objects.states).features;
		geodataStates.forEach( function( state) {
			if (state && state.properties && state.properties.NUTS_ID) {
				state.id = state.properties.NUTS_ID;
			}
			stateCentroids.set(state.id, path.centroid(state));
		});

		var geodataCounties = topojson.feature(usMap, usMap.objects.counties).features;
		geodataCounties.forEach(function(county) {
			if (county && county.properties && county.properties.NUTS_ID) {
				county.id = county.properties.NUTS_ID;
			}
			countyCentroids.set(county.id, path.centroid(county));
		});

		var maxItemsInCountry = Math.max.apply(Math, restData.map(function(o) { return o[$scope.attrToDisplay]; }));
		var quantizeStateItems = quantizeItems(maxItemsInCountry);

		g.append('g')
	    	.attr('id', "states-" + id)
				.attr('class', "states-map")
	    	.selectAll('path')
	    	.data(geodataStates)
	    	.enter().append('path')
	    	.attr('d', path)
	    	.attr('class', function(d) { return "state " + quantizeStateItems(stateItems.get(d.id)); })
	    	.attr('id', function(d) { return "state-" + id + "-" +  d.id; })
	    	.on('click', function(state) { onClickState(state, $scope, true, aggregator, regionData, regionMap); });

		g.append('path')
	    	.datum(topojson.mesh(usMap, usMap.objects.states, function(a, b) { return a !== b; }))
	    	.attr('id', 'state-borders')
	    	.attr('d', path);

	    g.selectAll('text')
	    	.data(geodataStates)
	    	.enter()
	    	.append('svg:text')
	    	.text(function(d) { return regionMap[d.id] ? regionMap[d.id].code : ""; })
	    	.attr('x', function(d) { var x = path.centroid(d)[0]; return isNaN(x) ? 0 : x; })
	    	.attr('y', function(d) { var y = path.centroid(d)[1]; return isNaN(y) ? 0 : y; })
	    	.attr('text-anchor', 'middle')
	    	.attr('class', "state-text-label state-text-label-" + id)
	    	.attr('id', function(d) { return "state-text-label-" + id + "-" +  d.id; })
	    	.on('click', function(state) { onClickState(state, $scope, true, aggregator, regionData, regionMap); });

	    stateTooltipEvents($scope, restData);
	}

	function zoomOut() {
		onClickState(null, $scope, true, aggregator, regionData, regionMap);
	}
}

function stateTooltipEvents($scope, restData) {
	var id = "map-" + $scope.$id;

	restData.forEach(function(state) {
		var stateTextId = "#state-text-label-" + id + "-" + parseInt(state.id, 10);
		var stateId = "#state-" + id + "-" + parseInt(state.id, 10);

		d3.select(stateTextId)
            .on('mousemove', function(d, i) { tooltipImpl($scope, state, true); })
            .on('mouseout', function() { tooltipImpl($scope); });

		d3.select(stateId)
            .on('mousemove', function(d, i) { tooltipImpl($scope, state, true); })
            .on('mouseout', function() { tooltipImpl($scope); });
	});
}

function resetStateData($scope, stateIds) {
	var id = "map-" + $scope.$id;

	stateIds.forEach(function(state) {
		var stateId = "#state-" + id + "-" + parseInt(state, 10);
		$(stateId).attr('class', 'state');
		d3.select(stateId)
           	.on('mousemove', function() { tooltipImpl($scope); });
	});
}

function resetCountyData($scope, stateId, countyIds) {
	var id = "map-" + $scope.$id;

	countyIds.forEach(function(county) {
		if (stateId == getStateID(county)) {
			var countyId = "#county-" + id + "-" + parseInt(county, 10);
			var countyClass = $(countyId).attr('class');

			if (countyClass && countyClass.indexOf('county-active') != -1) {
				// jquery hasClass/addClass does not work on SVG elements :( https://github.com/jquery/jquery/issues/2199
				$(countyId).attr('class', 'county county-active');
			}
			else {
				$(countyId).attr('class', 'county');
			}

			d3.select(countyId)
            	.on('mousemove', function() { tooltipImpl($scope); });
		}
	});
}

function refreshStates($scope, aggregator, stateIds) {
	if (!usMapCache) {
		return;
	}

	var id = "map-" + $scope.$id;

	var g = d3.select("#gid-" + id);

	resetStateData($scope, stateIds);

	// TODO: is this just for states and not counties?
	aggregator.getRegions($scope.context.currentLocation, $scope.context.selectedDate.toISOString()).then(function(restData) {
		var geodataStates = topojson.feature(usMapCache, usMapCache.objects.states).features;
		var maxItemsInCountry = Math.max.apply(Math, restData.map(function(o) { return o[$scope.attrToDisplay]; }));
		var quantizeStateItems = quantizeItems(maxItemsInCountry);

		var stateItems = d3.map();
		restData.forEach(function(d) {
			stateItems.set(d.id, d[$scope.attrToDisplay]);
		});

		d3.select("#states-" + id)
				.selectAll('path')
				.data(geodataStates)
				.attr('class', function(d) { return "state " + quantizeStateItems(stateItems.get(d.id)); });

		stateTooltipEvents($scope, restData);
	}, function(error) {
		return console.warn(error);
	});
}

function tooltipImpl($scope, region, doShowTooltip) {
	if (!$scope) {
		console.log("scope is null");
		return;
	}

	if (!$scope.$id) {
		console.log("scope id is null");
		return;
	}

	var id = "map-" + $scope.$id;
	var tooltip = d3.select("#tooltip-" + id);

	var svg = d3.select("#svg-element-" + id);

	if (doShowTooltip) {
		var itemCount = region[$scope.attrToDisplay];
       	if (itemCount > 0) {
            var mouseCoord = d3.mouse(svg.node()).map(function(d) { return parseInt(d); });
            tooltip.classed('hidden', false)
                .attr('style', "left:" + (mouseCoord[0] + 30) + "px; top:" + (mouseCoord[1] - 5) + "px")
                .html(region.name +": " + itemCount + " " + $scope.mapDataLabel);
      	}
	}
	else {
		tooltip.classed('hidden', true);
	}
}

function onClickCounty(county, $scope, doUpdateLocation, regionMap, subregionMap) {
	if (county && county.properties && county.properties.NUTS_ID) {
		county.id = county.properties.NUTS_ID;
	}
	var id = "map-" + $scope.$id;
	var g = d3.select("#gid-" + id);
	var width = $scope.mapWidth;
	var height = width * ASPECT_RATIO;

	if (county) {
		if (doUpdateLocation) {
			var region = regionMap[getStateID(county.id)];
			if (region) {
				var stateName = region.name;
				$scope.updateCurrentLocation(county.id, subregionMap[county.id].name + ", " + stateName);
			}
		}

		var centroid = countyCentroids.get(county.id);

		g.transition()
			.duration(750)
			.attr('transform', "translate(" + width / 2 + "," + height / 2 + ")scale(" + ZOOM_LEVEL + ")translate(" + -centroid[0] + "," + -centroid[1] + ")");

		g.selectAll('path')
			.classed('county-active', function(d) { return d.id == county.id; });
	}
}

function onClickState(state, $scope, doUpdateLocation, aggregator, regionData, regionMap) {
	if (state && state.properties && state.properties.NUTS_ID) {
		state.id = state.properties.NUTS_ID;
	}
	var id = "map-" + $scope.$id;
	var g = d3.select("#gid-" + id);
	var width = $scope.mapWidth;
	var height = width * ASPECT_RATIO;

	// restore all state labels that may have been previously hidden
	$(".state-text-label-" + id).attr('display', 'block');

	// un-select any county that may have been previously selected
	g.selectAll('path').classed('county-active', false);

	if (state) {
		if (doUpdateLocation) {
			var region = regionMap[state.id];
			if (region) {
				$scope.updateCurrentLocation(state.id, region.name);
			}
		}

		var getAggregatorSubregions = function(country, region, date, callback) {
			aggregator.getSubregions(country, region, date).then(function(result) {
				callback(null, result);
			}, function(err) {
				callback(err, null);
			});
		};

		var getStateIds = function(callback) {
			regionData.getUSStateIdsPromise().then(function(stateIds) {
				callback(null, stateIds);
			}, function(err) {
				callback(err, null);
			});
		};

		var getCountiesIds = function(callback) {
			regionData.getUSCountiesIdsPromise().then(function(countyIds) {
				callback(null, countyIds);
			}, function(err) {
				callback(err, null);
			});
		};
		d3.queue()
			// TODO: keep track of country
			.defer(getAggregatorSubregions, "US", state.id, $scope.context.selectedDate.toISOString())
			.defer(getStateIds)
			.defer(getCountiesIds)
			.await(function(error, countyRestData, stateIds, countyIds) {
				if (error) return console.warn(error);
				var maxItemsInState = Math.max.apply(Math, countyRestData.map(function(state) { return state[$scope.attrToDisplay]; }));
				var quantizeCountyItems = quantizeItems(maxItemsInState);

				// iterate over all counties in state and reset their data
				resetCountyData($scope, state.id, countyIds);

				countyRestData.forEach(function(county) {
					var countyId = "#county-" + id + "-" + parseInt(county.id, 10);
					var countyClass = $(countyId).attr('class');

					if (countyClass && countyClass.indexOf('county-active') != -1) {
						$(countyId).attr('class', "county county-active " + quantizeCountyItems(county[$scope.attrToDisplay]));
					}
					else {
						$(countyId).attr('class', "county " + quantizeCountyItems(county[$scope.attrToDisplay]));
					}

					d3.select(countyId)
			    	.on('mousemove', function() { tooltipImpl($scope, county, true); })
			      .on('mouseout', function() { tooltipImpl($scope); });
				});
			});

		$("#state-text-label-" + id + "-" +  state.id).attr('display', 'none');
		$("#buttonZoomOut-" + id).removeClass('hidden');

		g.selectAll('path')
			.classed('active', function(d) { return d.id == state.id; });

		var centroid = stateCentroids.get(state.id);
		if (centroid) {
			g.transition()
				.duration(750)
				.attr('transform', "translate(" + width / 2 + "," + height / 2 + ")scale(" + ZOOM_LEVEL + ")translate(" + -centroid[0] + "," + -centroid[1] + ")");
		}
	}
	else {
		if (doUpdateLocation) {
			$scope.updateCurrentLocation("USA");
		}

		$("#buttonZoomOut-" + id).addClass('hidden');

		g.selectAll('path')
			.classed('active', false);

		g.transition()
			.duration(750)
			.attr('transform', "translate(" + width / 2 + "," + height / 2 + ")scale(1)translate(" + -(width / 2) + "," + -(height / 2) + ")");

		regionData.getUSStateIdsPromise().then(function(stateIds) {
			refreshStates($scope, aggregator, stateIds);
		});
	}
}

function getStateID(countyID) {
	if ( countyID > 10000) {
		return countyID.toString().substring( 0, 2);
	}
	else {
		return countyID.toString().substring( 0, 1);
	}

	return countyID.slice(0, -3);
}

function iotGeoMapController($scope, $element, $http, $q, aggregator, regionData, $attrs) {
	if ($attrs.mapType == 'claims') {
		$scope.mapDataLabel = 'claims avoided';
		$scope.attrToDisplay = 'uncompliantShields';	// dummy, until we have the claimsAvoided attribute in the json response
	}
	else if ($attrs.mapType == 'devices') {
		$scope.mapDataLabel = 'devices';
		$scope.attrToDisplay = 'totalDevices';
	}
	else {
		console.warn('invalid map type');
		return;
	}

	$scope.map = {
    	layers : [ {name: "Devices"}, {name: "Weather"}, {name: "Other risks"}]
	};

	regionData.getUSStateByIdMapPromise().then(function(regionMap) {
		regionData.getUSCountyByIdMapPromise().then(function(subregionMap) {

			showMap($q, $scope, $element, aggregator, regionData, regionMap, subregionMap);

			$scope.$watchGroup(['context.selectedDate', 'context.currentLocation'], function(newValues, oldValues, scope) {
				if (newValues) {// && newValue != $scope.mapLocation) {

					console.log( "Refreshing geo map " + $scope.$id + " for new location: " + newValues + ". Old location: " + $scope.mapLocation);
					$scope.mapLocation = $scope.context.currentLocation;

					var mapFocus = function() {
						getIdForGeo($q, regionData, $scope.context.currentLocation).then(function(idForGeo) {
							if (!idForGeo) {
								// zoom out
								onClickState(null, $scope, false, aggregator, regionData, regionMap);
							}
							else if (idForGeo < 100) {
								// it is a state
								onClickState({id:idForGeo}, $scope, false, aggregator, regionData, regionMap);
							}
							else {
								var stateID = getStateID(idForGeo);
								onClickState({id:stateID}, $scope, false, aggregator, regionData, regionMap);
								onClickCounty({id:idForGeo}, $scope, false, regionMap, subregionMap);
							}
						}, function(err) {
							console.log(err);
						});
					};

					setTimeout(mapFocus, 2500);

					/*d3.queue().defer(mapFocus).await(function(err, res) {
						console.log("finished");
						if (err) { return console.warn(err); }
					});*/
				}
			});

			$scope.updateCurrentLocation = function( location, label) {

				console.log( "Map " + $scope.$id + " changing location to " + location);

				$scope.mapLocation = location;
				$scope.context.currentLocation = location;
				$scope.context.currentLabel = label;
				$scope.$digest();
			};
		});
	});
}

function iotGeoMapDirective(){
	return {
		restrict: 'E', // C: class, E: element, M: comments, A: attributes
	    replace: true, // replaces original content with template
	    templateUrl: "directives/dashboard-geo-map.html",
	    controller: iotGeoMapController
	};
}

// module
var app = angular.module('iot-dashboard');

// directives
app.directive('iotGeoMap', [iotGeoMapDirective]);
