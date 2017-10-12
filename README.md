# IoT for Insurance - Insurance Starter Dashboard


The directory structure of the application is as follows:
```
├── .travis.yml              <- TravisCI configuration file.
├── bower.json               <- Front-end library dependencies.
├── brunch-config.coffee     <- Brunch configuration file.
├── package.json             <- Development environment dependencies.
├── docs/                    <- Documentation
├── app/                     <- Demo Application
│   ├── app.js               <- Angular application entry point. Used for managing dependencies
│   ├── assets/              <- Static files (images, fonts etc.)
│   |   ├── 404.html         <-
│   |   ├── index.html       <-
│   │   ├── fonts/           <- Fonts
│   │   ├── img/             <- Images
│   │   ├── pages/           <- UI router pages. Templates of the pages.
│   │   ├── theme/           <- Theme components. Contains various common widgets, panels which used across application
│   ├── scripts/             <-
│   │   ├── services/        <- angular services
│   │   ├── utils/           <- utilities
│   ├── styles/              <- sass styles
│   │   ├── app/             <- application styles. Used mostly for demonstration purposes. Put your app styles here.
│   │   ├── theme/           <- theme styles. Used to customize bootstrap and other common components used in tempate.
│   ├── vendor/              <- Non-bower dependencies
```




### Documentation
Installation, customization and other useful articles:


#### Configure
This app can be configured for `dev`, `staging` and `production`
1. edit manifest.yml file `host` and `name` as you wish for a bluemix app
2. Copy the `app/config-staging.js` to `app/config-production.js` or `app/config-dev.js` depending on the target environment and set the values
  * set tenantId to your own tenant ID
  * set backendHost value
  * note that `backendHost` and `apiHost` must **not** start with `http(s)://`
  * set authCallbackPath value - default is root path, for test purposes /auth/sso/callback is required (and supported by nginx redirect)
  * for production set customerICN to the correct value !


#### Build and deploy
Install if needed the build tools:
* `npm install -g bower`  
* `npm install -g brunch`

To build this app first install the requirements:
* `npm install`
* `bower install`

afterwards you can run
* for development: `brunch b`
* for production: `brunch b --env production`
* for staging: `brunch b --env staging`

then deploy the **public** folder
* `cd public`
* `cf push`

#### How to build the insurance dashboard for running tests locally

All that is required to run the dashboard for preconfigured sandbox tenant is to build the docker image with
 
    ./docker-build

then deploy and run the image with

    docker run -p 8080:443 -t iotidash

Point your browser to https://localhost:8080

The docker-build script generates self-signed certificates, checks for a proper configuration file and then proceeds with assembling the docker images.

**Note** that the port number *must* be 8080 for the internal test environment.


## How can I support developers?
- Star our GitHub repo
- Create pull requests, submit bugs, suggest new features or documentation updates


## Features
* Responsive layout
* High resolution
* Bootstrap CSS Framework
* Sass
* Gulp build
* AngularJS
* Jquery
* Charts (amChart, Chartist, Chart.js, Morris)
* Maps (Google, Leaflet, amMap)
* etc

License
-------------
<a href=/LICENSE target="_blank">MIT</a> license.


Enjoy!
We're always happy to hear your feedback.
