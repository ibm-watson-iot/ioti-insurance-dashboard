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

var aggregatorClient = angular.module('aggregatorClient', ['regionDataClient']);

var cache = {};

function getCountries(date) {
  var dateField = cache[date];
  if (!dateField) {
    dateField = cache[date] = {
      countries: {}
    };
  }
  return dateField.countries;
}

function getCountry(date, country) {
  if (country === "USA") {
    country = "US";
  }
  var countries = getCountries(date);
  var objCountry = countries[country];
  if (!objCountry) {
    countries[country] = objCountry = {};
  }
  return objCountry;
}

function createSnapshotPromise($http, $q, country, region, subregion, date, subLevel) {

  if (country === "USA") {
    country = "US";
  }
  var uri = '/data/snapshot/'+country;
  if (region) {
    uri += '/' + region;
  }
  if (subregion) {
    uri += '/' + subregion;
  }
  uri += '?subLevel=' + subLevel;
  uri += '&beforeDate=' + encodeURIComponent(date);

  return $http.get(uri);
}

function getCountryPromise($http, $q, country, date) {
  var objCountry = getCountry(date, country);
  if (!objCountry.promise) {
    objCountry.promise = $q(function(resolve, reject) {
      createSnapshotPromise($http, $q, country, null, null, date, false).then(function(result) {
        resolve(result.data);
      }, function(err) {
        reject(err);
      });
    });
  }
  return objCountry.promise;
}

function getRegionsPromise($http, $q, regionData, country, date) {
  return $q(function(resolve, reject) {
    var objCountry = getCountry(date, country);
    var promise = objCountry.regionsPromise;
    if (!promise) {
      promise = objCountry.regionsPromise = createSnapshotPromise($http, $q, country, null, null, date, true);
    }
    promise.then(function(result) {
      var regions = result.data;
      regionData.getUSStateByIdMapPromise($q).then(function(statesMap) {
        if (!objCountry.regionsCache) {
          objCountry.regionsCache = {};
          regions.forEach(function(region) {
            objCountry.regionsCache[region.region] = {
              region: region
            };
          });
        }
        regions.forEach(function(region) {
          // Add name and id
          region.id = parseInt(region.region, 10);
          var state = statesMap[region.id];
          region.name = state ? state.name : "Unknown";
        });
        // Default sort by region name
        regions.sort(function(a, b) {
          return a.name == b.name ? 0 : (a.name < b.name ? -1 : 1);
        });
        resolve(regions);
      }, function(err) {
        reject(err);
      });
    }, function(err) {
      reject(err);
    });
  });
}

function getRegionPromise($http, $q, regionData, country, region, date) {
  return $q(function(resolve, reject) {
    getRegionsPromise($http, $q, regionData, country, date).then(function() {
      var objCountry = getCountry(date, country);
      var objRegion = objCountry.regionsCache[region];
      resolve(objRegion ? objRegion.region : null);
    }, function(err) {
      reject(err);
    });
  });
}

function getSubregionsPromise($http, $q, regionData, country, region, date) {
  return $q(function(resolve, reject) {
    // Just wait for the promise to make sure that the cache is populated
    getRegionsPromise($http, $q, regionData, country, date).then(function() {
      var objCountry = getCountry(date, country);
      var objRegion = objCountry.regionsCache[region];
      if (!objRegion) {
        resolve([]);
        return;
      }
      var promise = objRegion.subregionPromise;
      if (!promise) {
        promise = objRegion.subregionPromise = createSnapshotPromise($http, $q, country, region, null, date, true);
      }
      promise.then(function(result) {
        var subregions = result.data;
        regionData.getUSCountyByIdMapPromise($q).then(function(countiesMap) {
          if (!objRegion.subregionsCache) {
            objRegion.subregionsCache = {};
            subregions.forEach(function(subregion) {
              objRegion.subregionsCache[subregion.subregion] = {
                subregion: subregion
              };
            });
          }
          // Add name and id
          subregions.forEach(function(subregion) {
            subregion.id = parseInt(subregion.subregion, 10);
            var county = countiesMap[subregion.id];
            subregion.name = county ? county.name : "Unknown";
          });
          // Default sort by sub-region name
          subregions.sort(function(a, b) {
            return a.name == b.name ? 0 : (a.name < b.name ? -1 : 1);
          });
          resolve(subregions);
        }, function(err) {
          reject(err);
        });
      }, function(err) {
        reject(err);
      });
    });
  });
}

function getSubregionPromise($http, $q, regionData, country, region, subregion, date) {
  return $q(function(resolve, reject) {
    // Just wait for the promise to make sure that the cache is populated
    getSubregionsPromise($http, $q, regionData, country, region, date).then(function() {
      var objCountry = getCountry(date, country);
      var objRegion = objCountry.regionsCache[region];
      if (!objRegion) {
        resolve([]);
        return;
      }
      if (!objRegion.subregionsCache) {
        reject(Error("Unexpectedly failed to find subregion cache for " + region));
        return;
      }
      var objSubregion = objRegion.subregionsCache[subregion];
      if (!objSubregion) {
        resolve([]);
        return;
      }
      resolve(objSubregion.subregion);
    }, function(err) {
      reject(err);
    });
  });
}

function calculateClaimsData(stats) {
  var COST_AVOIDED_PER_SHIELD = 20000;
  var dist = [0,0,0,0,1,1,1,2,2,3,3,4];

  var label = "Location";
  var statsData = [];
  var detailsData = [
      ["Water leakage", 0, 0],
      ["Smoke", 0, 0],
      ["Thermostat", 0, 0],
      ["Motion", 0, 0],
      ["Roof", 0, 0]
  ];

  for ( i = 0; i < stats.length; ++i) {
    statsData.push( [ stats[i].name, stats[i].totalShields, stats[i].totalShields*COST_AVOIDED_PER_SHIELD]);

    var pos = dist[i%dist.length];
    detailsData[ pos][1] = detailsData[ pos][1] + 1;
    detailsData[ pos][2] = detailsData[ pos][1] * COST_AVOIDED_PER_SHIELD;
  }

  var claimsAvoidedStats = {
      title : "Claim avoidance value ($)",
      icon : "/icons/shield.png",
      headers : [ label, "Shields", "Value ($)" ],
      data : statsData
  };

  var claimsAvoidedDetails = {
        title : "Claim avoidance value per Shield ($)",
        icon : "/icons/shield.png",
        table : {
            headers: [
            "Shield",
            "Count",
            "Value"
          ],
          data: detailsData
        },
        bar : {
          headers: {
          type1 : "Total avoided value ($)"
        },
        data: detailsData.map(function(item) {
          return [item[0], item[2]];
        })
        }
    };

    return {
        claimsstats: claimsAvoidedStats,
        claimsdetails: claimsAvoidedDetails
    };
}

function getRegionsClaimsDataPromise($http, $q, regionData, country, date) {
  return $q(function(resolve, reject) {
    getRegionsPromise($http, $q, regionData, country, date).then(function(regions) {
      resolve(calculateClaimsData(regions));
    }, function(err) {
      reject(err);
    });
  });
}

function getSubregionsClaimsDataPromise($http, $q, regionData, country, region, date) {
  return $q(function(resolve, reject) {
    getSubregionsPromise($http, $q, regionData, country, region, date).then(function(subregions) {
      resolve(calculateClaimsData(subregions));
    }, function(err) {
      reject(err);
    });
  });
}

aggregatorClient.provider('aggregator', function() {
  this.$get = function($http, $q, regionData) {
    return {
      getCountry: function(country, date) {
        return getCountryPromise($http, $q, country, date);
      },
      getRegions: function(country, date) {
        return getRegionsPromise($http, $q, regionData, country, date);
      },
      getRegion: function(country, region, date) {
        return getRegionPromise($http, $q, regionData, country, region, date);
      },
      getSubregions: function(country, region, date) {
        return getSubregionsPromise($http, $q, regionData, country, region, date);
      },
      getSubregion: function(country, region, subregion, date) {
        return getSubregionPromise($http, $q, regionData, country, region, subregion, date);
      },
      getRegionsClaimsData: function(country, date) {
        return getRegionsClaimsDataPromise($http, $q, regionData, country, date);
      },
      getSubregionsClaimsData: function(country, region, date) {
        return getSubregionsClaimsDataPromise($http, $q, regionData, country, region, date);
      }
    };
  };
});
