'use strict';

angular.module('BlurAdmin.configs', []);

angular.module('BlurAdmin.configs').constant('apiProtocol', 'https');
angular.module('BlurAdmin.configs').constant('apiHost', 'ioti.us-south.containers.mybluemix.net/docs');
angular.module('BlurAdmin.configs').constant('apiPath', '/api/v1');
angular.module('BlurAdmin.configs').constant('tenantId', '<tenantid>');

angular.module('BlurAdmin.configs').constant('backendProtocol', 'https');
angular.module('BlurAdmin.configs').constant('backendHost', '<iot4i-starter-backend hostname>');
angular.module('BlurAdmin.configs').constant('backendPath', '/api/v1');
angular.module('BlurAdmin.configs').constant('backendWebSocketPath', '/notifications');
