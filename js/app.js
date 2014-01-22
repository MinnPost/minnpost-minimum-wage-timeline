/**
 * Main JS for: minnpost-minimum-wage-timeline
 */


/**
 * RequireJS config which maps out where files are and shims
 * any non-compliant libraries.
 */
require.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'Backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'handlebars': {
      exports: 'Handlebars'
    },
    'tabletop': {
      exports: 'Tabletop'
    },
    'isotope': {
      deps: ['jquery']
    },
    'jquery-resize': {
      deps: ['jquery']
    },
    'jquery-vertical-timeline': {
      deps: ['jquery', 'handlebars', 'tabletop', 'isotope', 'jquery-resize', 'imagesloaded']
    }
  },
  baseUrl: 'js',
  paths: {
    'requirejs': '../bower_components/requirejs/require',
    'text': '../bower_components/text/text',
    'jquery': '../bower_components/jquery/jquery.min',
    'underscore': '../bower_components/underscore/underscore-min',
    'handlebars': '../bower_components/handlebars/handlebars.min',
    'tabletop': '../bower_components/tabletop/src/tabletop',
    'isotope': '../bower_components/isotope/jquery.isotope.min',
    'jquery-resize': '../bower_components/jquery-resize/jquery.ba-resize.min',
    'eventEmitter/EventEmitter': '../bower_components/eventEmitter/EventEmitter.min',
    'eventie/eventie': '../bower_components/eventie/eventie',
    'imagesloaded': '../bower_components/imagesloaded/imagesloaded',
    'jquery-vertical-timeline': '../bower_components/jquery-vertical-timeline/dist/jquery-vertical-timeline.min',
    'minnpost-minimum-wage-timeline': 'app'
  }
});


/**
 * Create minnpost-minimum-wage-timeline application class.
 *
 * Update with any libraries that are needed.
 */
define('minnpost-minimum-wage-timeline', [
  'jquery', 'underscore', 'helpers', 'jquery-vertical-timeline',
  'text!templates/application.underscore', 'text!templates/loading.underscore'
],
function($, _, helpers, jVT, tApplication, tLoading) {

  // Main function for execution, proxied here so that
  // you do not have to scroll down all the way
  var startProxy = function() {
    var thisApp = this;
    this.$content = this.$el.find('.content-container');

    /************************************
     * Enter main application logic here.
     ************************************/

    // You can reference the main container with:
    //   this.$el
    // Or you probably want the content container,
    // assuming you are using the default template
    //   this.$content

    this.$content.find('.minimum-wage-timeline-container').verticalTimeline({
      key: '0AjYft7IGrHzNdFZTV0tHRGtEVWxrQXhRUGJ3emtoZmc',
      sheetName: 'timeline-data',
      groupFunction: 'groupSegmentByDecade'
      //tabletopOptions: {
      //  parameterize: 'http://gs-proxy.herokuapp.com/proxy?url='
      //}
    });




  };

  // Default options
  var defaultOptions = {
    el: '.minnpost-minimum-wage-timeline-inline-container',
    paths: {
      local: {
        css: '.tmp/css/main.css',
        ie: '.tmp/css/main.ie.css',
        images: 'images/',
        data: 'data/'
      },
      build: {
        css: 'dist/minnpost-minimum-wage-timeline.latest.css',
        ie: 'dist/minnpost-minimum-wage-timeline.latest.ie.css',
        images: 'dist/images/',
        data: 'dist/data/'
      },
      deploy: {
        css: 'https://s3.amazonaws.com/data.minnpost/projects-inline/minnpost-minimum-wage-timeline/minnpost-minimum-wage-timeline.latest.css',
        ie: 'https://s3.amazonaws.com/data.minnpost/projects-inline/minnpost-minimum-wage-timeline/minnpost-minimum-wage-timeline.latest.ie.css',
        images: 'https://s3.amazonaws.com/data.minnpost/projects-inline/minnpost-minimum-wage-timeline/minnpost-minimum-wage-timeline/images/',
        data: 'https://s3.amazonaws.com/data.minnpost/projects-inline/minnpost-minimum-wage-timeline/minnpost-minimum-wage-timeline/data/'
      }
    }
  };

  // Constructor for app
  var App = function(options) {
    this.options = _.extend(defaultOptions, options);
    this.el = this.options.el;
    if (this.el) {
      this.$el = $(this.el);
    }
    this.setup();
  };

  // Start function
  _.extend(App.prototype, {

    // General setup tasks
    setup: function() {
      var thisApp = this;

      // Determine path
      if (window.location.host.indexOf('localhost') !== -1) {
        this.paths = this.options.paths.local;
        this.options.isLocal = true;
        if (window.location.pathname.indexOf('index-build') !== -1) {
          this.paths = this.options.paths.build;
        }
      }
      else {
        this.paths = this.options.paths.deploy;
      }

      // If local read in the bower map and add css
      if (this.options.isLocal) {
        $.getJSON('bower_map.json', function(data) {
          _.each(data, function(c, ci) {
            if (c.css) {
              _.each(c.css, function(s, si) {
                $('head').append('<link rel="stylesheet" href="bower_components/' + s + '.css" type="text/css" />');
              });
            }
            if (c.ie && (helpers.isMSIE() && helpers.isMSIE() <= 8)) {
              _.each(c.ie, function(s, si) {
                $('head').append('<link rel="stylesheet" href="bower_components/' + s + '.css" type="text/css" />');
              });
            }
          });

          thisApp.render();
        });
      }
      else {
        thisApp.render();
      }
    },

    // Rendering tasks
    render: function() {
      // Get main CSS
      $('head').append('<link rel="stylesheet" href="' + this.paths.css + '" type="text/css" />');
      if (helpers.isMSIE() && helpers.isMSIE() <= 8) {
        $('head').append('<link rel="stylesheet" href="' + this.paths.ie + '" type="text/css" />');
      }

      // Add a processing class
      this.$el.addClass('inline-processed');

      // Render main template
      this.$el.html(_.template(tApplication, {
        loading: _.template(tLoading, {})
      }));

      this.start();
    },

    // Main execution
    start: startProxy
  });

  return App;
});

/**
 * Run application
 */
require(['jquery', 'minnpost-minimum-wage-timeline'], function($, App) {
  $(document).ready(function() {
    var app = new App();
  });
});
