var env = 'development';

head.load(
    // Common
    "/js/libs/jquery/jquery.js",
    "/js/libs/underscore/underscore.js",
    "/js/libs/bootstrap/js/bootstrap.js",
    "/js/libs/angular/angular.js",
    "/js/libs/angular/angular-route/angular-route.min.js",
    "/js/libs/angular/angular-resource/angular-resource.min.js",
    "/js/libs/angular/angular-cookies/angular-cookies.min.js",
    "/js/libs/angular/angular-translate/angular-translate.min.js",
    "/js/libs/angular/angular-translate/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.min.js",
    "/js/libs/angular/angular-translate/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
    "/js/libs/angular/angular-translate/angular-translate-storage-local/angular-translate-storage-local.min.js",
    "/js/libs/angular/angular-translate/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
    "/js/libs/angular/angular-translate/angular-translate-handler-log/angular-translate-handler-log.min.js",
    "/js/libs/ua-parser/ua-parser.min.js",
    "/js/libs/angular/angular-loading-bar/loading-bar.min.js",
    "/js/libs/angular/angular-flash/angular-flash.min.js",
    "/js/libs/angular/angular-underscore/angular-underscore.js",
    "/js/libs/angular/angular-block-ui/angular-block-ui.min.js",
    // Main
    "/js/app/main/app.js",
    "/js/app/main/controllers.js",
    "/js/app/main/directives.js",
    "/js/app/common/services.js",
    "/js/app/common/directives.js",
    function() {
        console.log("Done loading main JS");
    }
);