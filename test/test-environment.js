exports.credentials = {
	'user': process.env.IOT4I_USER || '<admin>',
	'password': process.env.IOT4I_ADMIN || '<admin_pwd>'
};

exports.port = process.env.VCAP_APPLICATION ? process.env.PORT || 8080 : 3000;
exports.host = process.env.HOST || 'localhost';
exports.server = process.env.IOT4I_SERVER || 'https://' + exports.host +':' + exports.port;

if ( exports.server.slice(-1) === '/') {
	exports.server = exports.server.slice(0, -1);
}

console.log( "Using server %s", exports.server);