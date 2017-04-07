/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2016. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
var request = require('supertest');
var session = require('supertest-session');
var agent = null;

var should = require('should');

var testEnv = require('./test-environment.js');
var credentials = testEnv.credentials;
var server = testEnv.server;

var csrf = require('./csrfUtils.js');
var nodeuuid = require('node-uuid');

var login = null;
var auth = {};

var username = null;
var searchTerm = null;
var favouriteTerm = null;

var snapshot = {};

describe('Authentication tests', function() {
	this.timeout(60000);

	before(function() {
		agent = session(server);
		auth = {
			'user' : credentials.user,
			'password' : credentials.password
		};
		
		searchTerm = nodeuuid.v4();
		favouriteTerm = nodeuuid.v4();
		username = 'admin';
		
		snapshot = {
			country: 'US',
			region: 42,
			subregion: 42100
		};
	});

	it('Authentication required.', function(done) {
		agent
			.get('/data/myUser')
			.redirects( 5)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				res.headers['x-iot4i-web-auth-msg'].should.be.a.String().and.equal("authrequired");
				res.headers['x-iot4i-web-auth'].should.be.a.String().and.equal("/login");
				
				login = res.headers['x-iot4i-web-auth'];
							
				done();
			});
	});
	
	it('Authenticate with incorrect credentials.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.post( login)
			.redirects( 0)
			.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.send( 'username='+credentials.user + '&password=' + nodeuuid.v4())
			.end(function(err, res) {
				if (err) throw err;
				
				res.status.should.equal(302);
				res.headers['location'].should.be.a.String().and.equal("/login");
				
				done();
			});
	});
	
	it('Get user data must fail.', function(done) {
		agent
			.get('/data/myUser')
			.redirects( 5)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal( 200);
								
				res.headers['x-iot4i-web-auth-msg'].should.be.a.String().and.equal("authrequired");
				res.headers['x-iot4i-web-auth'].should.be.a.String().and.equal("/login");
								
				done();
			});
	});

	it('Authenticate with correct credentials.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.post( login)
			.redirects( 0)
			.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.send( 'username='+credentials.user + '&password=' + credentials.password)
			.end(function(err, res) {
				if (err) throw err;
				
				res.status.should.equal(302);
				
				res.headers['location'].should.be.a.String().and.equal("/dashboard");
				
				done();
			});
	});
	
	it('Get user data must succeed.', function(done) {
		agent
			.get('/data/myUser')
			.redirects( 0)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.username.should.be.a.String().and.match(/admin/);
				res.body.fullname.should.be.a.String().and.match(/admin/);

				done();
			});
	});
	
	it('Get user assets.', function(done) {
		agent
			.get('/data/assets/user1')
			.redirects( 0)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.should.be.a.Array();
				if ( res.body.length > 0 ) {
					res.body[0].name.should.not.be.empty();
					res.body[0].address.should.not.be.empty();
				}

				done();
			});
	});
	
	it('Post a search request.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.post('/data/search/searchString/'+searchTerm)
			.redirects( 0)
			.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.indexOf( searchTerm).should.be.aboveOrEqual( 0);

				done();
			});
	});
	
	it('Get search should return the term searched before.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.get('/data/search')
			.redirects( 0)
			//.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.indexOf( searchTerm).should.be.aboveOrEqual( 0);

				done();
			});
	});
	
	it('Clear search.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.post('/data/search/clear')
			.redirects( 0)
			.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			//.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				done();
			});
	});
	
	it('Search should return an empty string now.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.get('/data/search')
			.redirects( 0)
			//.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.should.be.a.Array().and.be.empty();

				done();
			});
	});

	it('Add a favourite.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.post('/data/favorites/favorite/'+favouriteTerm)
			.redirects( 0)
			.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.indexOf( favouriteTerm).should.be.aboveOrEqual( 0);

				done();
			});
	});
	
	it('Get favourite should return the term added before.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.get('/data/favorites')
			.redirects( 0)
			//.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.indexOf( favouriteTerm).should.be.aboveOrEqual( 0);

				done();
			});
	});
	
	it('Get aggregated iotdata for user.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.get('/data/aggregated/iotdata/'+username)
			.redirects( 0)
			//.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.activeAlert.should.be.a.Boolean();
				res.body.tables.should.be.a.Array();
				res.body.tables.length.should.be.equal(5);

				done();
			});
	});
	
	it('Get aggregated alerts for user.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.get('/data/aggregated/alerts/'+username)
			.redirects( 0)
			//.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				res.body.should.be.a.Array();

				done();
			});
	});
	
	it('Get snapshot for country.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.get('/data/snapshot/'+snapshot.country)
			.redirects( 0)
			//.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				//res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				console.dir( res.body);

				done();
			});
	});
	
	it('Get snapshot for region.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.get('/data/snapshot/' + snapshot.country + "/" + snapshot.region)
			.redirects( 0)
			//.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
				
					
				//res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				console.dir( res.body);

				done();
			});
	});
	
	it('Get snapshot for subregion.', function(done) {
		var csrfToken = csrf.getCSRFCookie(agent);
		agent
			.get('/data/snapshot/' + snapshot.country + "/" + snapshot.region + "/" + snapshot.subregion)
			.redirects( 0)
			//.set( csrf.XSRF_TOKEN_HEADER, csrfToken)
			.expect('Content-type', /json/)
			.end(function(err, res) {
				if (err)
					throw err;
	
				//res.status.should.equal(200);
				
				should.not.exist( res.headers['x-iot4i-web-auth-msg']);
				should.not.exist( res.headers['x-iot4i-web-auth']);
				
				console.dir( res.body);

				done();
			});
	});


	/*
	it('Authentication required.', function(done) {
	  request(server)
	    .get('/user/all')
	    .expect(401, done);
	});

	it('Authenticate with incorrect credentials ', function(done) {
	  request(server)
	    .get('/user')
	    .auth( credentials.user, credentials.password + "123")
	    .expect(401, done);
	});
	 */

	after(function() {
	});

});
