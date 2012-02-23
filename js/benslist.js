(function() {
  var Filters, done, script, setFilters, v,
    _this = this;

  Filters = (function() {

    function Filters() {}

    Filters.prototype.setDefaults = function() {
      this.formatPosts();
      return this.attachBehaviors();
    };

    Filters.prototype.formatPosts = function() {
      this.posts = $("body").find("p");
      this.posts.css({
        "padding": "15px",
        "background": "#eee"
      });
      return this.posts.append("<a href='#' class='hideLink' style='margin-left: 30px; color: #ccc;'>Hide All</a>");
    };

    Filters.prototype.attachBehaviors = function() {
      this.hideLinks = $("a.hideLink");
      return this.hideLinks.bind('click', function(event) {
        return $(this).parent("p").hide();
      });
    };

    return Filters;

  })();

  setFilters = function() {
    var pageFilters;
    pageFilters = new Filters();
    return pageFilters.setDefaults();
  };

  v = "1.7.1";

  if (window.jQuery === void 0 || window.jQuery.fn.jquery < v) {
    done = false;
    script = document.createElement("script");
    script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
    script.onload = function() {
      return setFilters();
    };
  } else {
    setFilters();
  }

}).call(this);
