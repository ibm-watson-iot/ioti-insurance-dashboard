/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

module.exports = csrf = {
		XSRF_TOKEN_COOKIE: 'XSRF-TOKEN',
		XSRF_TOKEN_HEADER: 'X-CSRF-Token',
		getCSRFCookie : function(session) {
			var csrfToken = "";
			
			session.cookies.forEach(function(cookie) {
				if (cookie.name === csrf.XSRF_TOKEN_COOKIE) {
					csrfToken = cookie.value;
				}
			});
			
			return csrfToken;
		}
};

/*
function getCookie(cookies, cookieName) {

	var result = "";
	if (cookies) {
		cookies.forEach(function(cookie) {
			var parts = cookie.split("=");
			var cookieName = parts.shift();
			if (cookieName === cookieName) {
				result = parts.shift().split(";").shift();
			}
		});
	}

	return result;
}
*/