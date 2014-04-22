var express        = require('express');
var staticFavicon  = require('static-favicon');
var compression    = require('compression');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var cookieSession  = require('cookie-session');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var async = require('async');
var backend = require('./backend/backend');
var authorizer = require('./authorizer/authorizer');

var self = module.exports = {};

self.init = function () {
    self.app = express();
    self.async = async;
    self.backend = backend;
    self.authorizer = authorizer;
    self.staticFavicon = staticFavicon;
    self.compression = compression;
    self.bodyParser = bodyParser;
    self.cookieParser = cookieParser;
    self.cookieSession = cookieSession;
    self.methodOverride = methodOverride;
    self.morgan = morgan;
    self.express = express;
    return self.app;
};
