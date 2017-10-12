'use strict';

angular.module('BlurAdmin.configs', []);

angular.module('BlurAdmin.configs').constant('apiProtocol', 'https');
angular.module('BlurAdmin.configs').constant('apiHost', 'ioti.us-south.containers.mybluemix.net/docs');
angular.module('BlurAdmin.configs').constant('apiPath', '/api/v1');
angular.module('BlurAdmin.configs').constant('tenantId', 'ff12827fc4e309a44da3086cbb39a355');

angular.module('BlurAdmin.configs').constant('backendProtocol', 'https');
angular.module('BlurAdmin.configs').constant('backendHost', 'prod-starter-backend-ff12827fc4e309a44da3086cbb39a355.mybluemix.net');
angular.module('BlurAdmin.configs').constant('backendPath', '/api/v1');
angular.module('BlurAdmin.configs').constant('backendWebSocketPath', '/notifications');
//angular.module('BlurAdmin.configs').constant('authCallbackPath', '/auth/sso/callback');
angular.module('BlurAdmin.configs').constant('authCallbackPath', '/docs/o2c.html');
angular.module('BlurAdmin.configs').constant('customerICN', '999999');

