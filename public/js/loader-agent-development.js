var env = 'development';

head.load(
    // Common
    "/js/libs/jquery/jquery.js",
    "/js/libs/underscore/underscore.js",
    "/js/libs/bootstrap/js/bootstrap.js",
    "/js/libs/moment/moment-with-langs.js",
    //"/js/libs/moment/moment-timezone.min.js",
    "/js/libs/es5-shim/es5-shim.min.js",
    "/js/libs/ua-parser/ua-parser.min.js",
    "/js/libs/bootstrap-filestyle/bootstrap-filestyle.min.js",
    "/js/libs/angular/angular.js",
    "/js/libs/angular/angular-route/angular-route.min.js",
    "/js/libs/angular/angular-resource/angular-resource.min.js",
    "/js/libs/angular/angular-cookies/angular-cookies.min.js",
    "/js/libs/angular/angular-moment/angular-moment.js",
    "/js/libs/angular/angular-ui-bootstrap/ui-bootstrap.min.js",
    "/js/libs/angular/angular-ui-bootstrap/ui-bootstrap-tpls.min.js",
    "/js/libs/angular/angular-translate/angular-translate.min.js",
    "/js/libs/angular/angular-translate/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.min.js",
    "/js/libs/angular/angular-translate/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js",
    "/js/libs/angular/angular-translate/angular-translate-storage-local/angular-translate-storage-local.min.js",
    "/js/libs/angular/angular-translate/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
    "/js/libs/angular/angular-translate/angular-translate-handler-log/angular-translate-handler-log.min.js",
    "/js/libs/angular/angular-loading-bar/loading-bar.min.js",
    "/js/libs/angular/angular-flash/angular-flash.min.js",
    "/js/libs/angular/angular-underscore/angular-underscore.js",
    "/js/libs/angular/angular-block-ui/angular-block-ui.min.js",
    "/js/libs/angular/angular-file-upload/angular-file-upload.min.js",
    // Agent
    "/js/app/agent/app.js",
    // Controllers
    "/js/app/agent/controllers/agents.js",
    "/js/app/agent/controllers/balance.js",
    "/js/app/agent/controllers/chats.js",
    "/js/app/agent/controllers/main.js",
    "/js/app/agent/controllers/report.js",
    "/js/app/agent/controllers/visitors.js",
    "/js/app/agent/controllers/settings/triggers.js",
    "/js/app/agent/controllers/settings/widget.js",

    "/js/app/common/config/config.js",
    "/js/app/common/services.js",
    "/js/app/common/directives.js",
    "/js/app/common/filters.js",
    function() {
        console.log("Done loading agent JS. Environment: "+env);
        angular.bootstrap(document, ['regidiumApp']);

        // 3-х уровневое меню
        $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
            event.preventDefault(); 
            event.stopPropagation(); 
            $(this).parent().addClass('open');

            var menu = $(this).parent().find("ul");
            var menupos = menu.offset();
          
            if ((menupos.left + menu.width()) + 30 > $(window).width()) {
                var newpos = - menu.width();      
            } else {
                var newpos = $(this).parent().width();
            }
            menu.css({ left:newpos });

        });
    }
);