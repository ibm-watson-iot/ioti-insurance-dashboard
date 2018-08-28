# This is a Brunch config file for the client application.

exports.config =
  npm:
    enabled: false

  modules:
    definition: false
    wrapper: false

  conventions:
    assets: (path) ->
      (not /\.js/.test path) and /assets(\/|\\)/.test path
    ignored: [
      /((.*(\/|\\))[_].*\.scss)/,
      'bower_components/requirejs/require.js',
      /^app\/config-staging.js/
    ]

  overrides:
    staging:
      conventions:
        ignored: [
          /((.*(\/|\\))[_].*\.scss)/,
          'bower_components/requirejs/require.js',
          'app/config-dev.js'
        ]
    production:
      conventions:
        ignored: [
          /((.*(\/|\\))[_].*\.scss)/,
          'bower_components/requirejs/require.js',
          'app/config-dev.js',
          'app/config-staging.js'
        ]

  files:
    javascripts:
      joinTo:
        'scripts/vendor.js': /^bower_components|^app\/vendor/
        'scripts/app.js': (path) ->
          /^app/.test(path) and not /config[-].*\.js$/.test(path)
        'configs/starter-dashboard-config.js': (path) ->
          /^app/.test(path) and /config[-].*\.js$/.test(path)
      order:
        before: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/jquery-ui/ui/jquery-ui.js',
          'bower_components/lodash/lodash.js',
          'bower_components/angular/angular.js',

          'bower_components/amcharts/dist/amcharts/amcharts.js',
          'bower_components/amcharts-stock/dist/amcharts/amstock.js',
          'bower_components/moment/min/moment-with-locales.js',
          'bower_components/ng-file-upload/ng-file-upload.js',
          'bower_components/js-data/dist/js-data.js',
          'bower_components/js-data-angular/dist/js-data-angular.js',

          'app/vendor/'

          'app/app.js',
          'app/scripts/utils/utils.module.js',
          'app/scripts/utils/BlurAdminHttpInterceptor.js',
          'app/*/*/*/*.module.js',
          'app/*/*/*.module.js',
          'app/scripts/services/'
        ]
        after: [

        ]
    stylesheets:
      joinTo:
        'styles/app.css': /^bower_components|^app\/styles\/theme|^app\/styles\/main.scss/
        'styles/auth.css': /^app\/styles\/auth.scss/
        'styles/404.css': /^app\/styles\/404.scss/

  plugins:
    minify: true

    autoReload:
      delay: 1000

    sass:
      mode: 'native' # 'ruby' / 'native'

    uglify:
      mangle: false
      compress:
        global_defs:
          DEBUG: false

    autoprefixer:
      browsers: ["last 1 version", "ie 9", "ie 10"]
      cascade: false

    postcss:
      processors: [
        require('autoprefixer')(['last 8 versions'])
      ]

    afterBrunch: [
      [
         'bash -c "cp manifest.yml public/',
         'cp .htaccess public/',
         'cp nginx.conf public/',
         'cp bower_components/Ionicons/fonts/* public/fonts',
         'cp bower_components/font-awesome/fonts/* public/fonts',
         'cp bower_components/bootstrap/fonts/* public/fonts',
         'mkdir -p public/img/theme/vendor/ionrangeslider/img',
         'cp bower_components/ionrangeslider/img/* public/img/theme/vendor/ionrangeslider/img',
         'mkdir -p public/img/theme/vendor/ammap/img',
         'cp bower_components/ammap/dist/ammap/images/* public/img/theme/vendor/ammap/img',
         'mkdir -p public/data',
         'cp app/assets/data/CityLocations.json public/data"'
      ].join(' && ')
    ]
