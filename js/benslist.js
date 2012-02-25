(function() {
  var AttributeFilter, Filter, Filters, initialize, setFilters;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    if(typeof parent.extended == "function") parent.extended.call(parent, child);
    return child;
  };
  Filters = (function() {
    var bodyElems, fixedElems, postTag, posts, searchFields;
    function Filters() {}
    postTag = "p";
    posts = $("body").find(postTag);
    fixedElems = ".bchead, blockquote:first";
    bodyElems = "blockquote:eq(1)";
    searchFields = "#searchfieldset";
    Filters.prototype.setDefaults = function() {
      return this.format();
    };
    Filters.prototype.defineFilters = function() {
      var newTabFilter, options;
      $(searchFields).append("<div id='additional_search'>Custom Filters<div id='custom_form'></div></div>");
      return newTabFilter = new AttributeFilter("Links open in new tab", options = {
        element: $(posts).find("a:not(.hide_link)"),
        attribute: {
          name: "target",
          orig: "_self",
          custom: "_blank"
        }
      });
    };
    Filters.prototype.format = function() {
      $(fixedElems).wrapAll("<div id='fixed_header'></div>");
      $(bodyElems).addClass("under_fixed");
      posts.addClass("styled_post");
      return this.defineFilters();
    };
    return Filters;
  })();
  Filter = (function() {
    function Filter(label, options) {
      this.label = label;
      this.options = options;
      this.name = this.label.toLowerCase().replace(/[ ]/g, "");
      this.checkbox = $("<input type='checkbox' name='" + this.name + "' id='" + this.name + "' \/>");
      this.elements = this.options.element;
      this.apply();
    }
    Filter.prototype.apply = function() {
      $("#custom_form").append("<label for='" + this.name + "'>" + this.label + "<\/label>").append($(this.checkbox));
      return $(this.checkbox).bind('click', __bind(function(event) {
        if ($(event.target).is(':checked')) {
          return this.toggleFilter(true);
        } else {
          return this.toggleFilter(false);
        }
      }, this));
    };
    return Filter;
  })();
  AttributeFilter = (function() {
    __extends(AttributeFilter, Filter);
    function AttributeFilter() {
      this.toggleFilter = __bind(this.toggleFilter, this);
      AttributeFilter.__super__.constructor.apply(this, arguments);
    }
    AttributeFilter.prototype.toggleFilter = function(bool) {
      var attributes, value;
      attributes = this.options.attribute;
      if (bool) {
        value = attributes.custom;
      } else {
        value = attributes.orig;
      }
      return $(this.elements).attr(attributes.name, value);
    };
    return AttributeFilter;
  })();
  setFilters = function() {
    var pageFilters;
    this.initialized = true;
    pageFilters = new Filters();
    return pageFilters.setDefaults();
  };
  initialize = function() {
    var script, styles;
    if (this.initialized) {
      return;
    }
    styles = document.createElement("link");
    styles.type = "text/css";
    styles.rel = "stylesheet";
    styles.href = "http://localhost/apartment_finder/css/benslist.css";
    document.getElementsByTagName("head")[0].appendChild(styles);
    if (document.location.href.indexOf("localhost") < 0 && document.location.href.indexOf("craigslist.org") < 0) {
      alert("For use with Craigslist apartment search pages.");
      return;
    }
    if (window.jQuery === void 0 || window.jQuery.fn.jquery < this.version) {
      script = document.createElement("script");
      script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + this.version + "/jquery.min.js";
      document.getElementsByTagName("head")[0].appendChild(script);
      return script.onload = __bind(function() {
        return setFilters();
      }, this);
    } else {
      return setFilters();
    }
  };
  this.version = "1.7.1";
  this.initialized || (this.initialized = false);
  initialize();
}).call(this);
