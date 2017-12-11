/**
 * @author m.mueller
 * created on 27.11.2017
 */
'use strict';

function NPSinit(loggedInUser, customerICN, toastr) {

  var firstName = '', lastName = '', email = '', idType = 'w3id authenticated user';

  // customerICN and email are required
  if (customerICN != 'customerICN' && customerICN != '999999') {
    if (loggedInUser.sub) {
      email = loggedInUser.sub;

      // valid email ?
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
         email = '';
    }
    if (loggedInUser.firstName) firstName = decodeURIComponent(loggedInUser.firstName);
    if (loggedInUser.lastName) lastName = decodeURIComponent(loggedInUser.lastName);
  }

  window.IBM_Meta = {
    // info about offering
    offeringId:"5900A0O",
    offeringName:"IBM IoT for insurance",
    highLevelOfferingName:"Watson IoT",

    // end user specific stuff
    userFirstName:firstName,
    userLastName:lastName,
    userEmail:email,
    userId:email,
    userIdType:idType,
    country:"US",
    excludeUser:"no",
    daysSinceFirstLogin: window.Medallia.daysSinceFirstLogin,

    // customer specific
    iuid:"",
    customerName:"",
    icn:customerICN,
    customerSize:"large",
    usFederalAccount:"no",

    // session specific
    language:"en",
    testData:false,
    quarterlyIntercept:"heavy",
    noQuarantine:"no"
 };

 console.log('META is: ' + JSON.stringify(window.IBM_Meta));
 if (email != '')
   loadScript("https://nebula-cdn.kampyle.com/we/28600/onsite/embed.js", loadScriptCb);
 else
   toastr.warning('NPS not enabled ! Please see the ReadMe\'s NPS section how to do this');
}
