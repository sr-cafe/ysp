// Generated by CoffeeScript 1.4.0
(function() {
  var App;

  App = (function() {
    var $, facebookManager, settings;

    settings = null;

    $ = null;

    facebookManager = null;

    function App(_settings, selectorEngine) {
      settings = _settings;
      $ = selectorEngine != null ? selectorEngine : jQuery;
    }

    App.prototype.start = function() {
      console.log('START', window.FacebookManager);
      return facebookManager = new window.FacebookManager().getLoginStatus();
    };

    window.App = App;

    return App;

  })();

}).call(this);