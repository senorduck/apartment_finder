(function() {
  var AttributeFilter, Filter, Filters, PostFilter, bodyElems, fixedElems, initialize, postTag, posts, searchFields, setFilters;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    if(typeof parent.extended == "function") parent.extended.call(parent, child);
    return child;
  };
  postTag = "p";
  posts = $("body").find(postTag);
  fixedElems = ".bchead, blockquote:first";
  bodyElems = "blockquote:eq(1)";
  searchFields = "#searchfieldset";
  Filters = (function() {
    function Filters() {}
    Filters.prototype.setDefaults = function() {
      return this.format();
    };
    Filters.prototype.defineFilters = function() {
      var allCapsFilter, newTabFilter, oldApartmentFilter, options;
      $(searchFields).append("<div id='additional_search'>Custom Filters<div id='custom_form'></div></div>");
      newTabFilter = new AttributeFilter("Links open in new tab", options = {
        element: $(posts).find("a:not(.hide_link)"),
        attribute: {
          name: "target",
          orig: "_self",
          custom: "_blank"
        }
      });
      oldApartmentFilter = new PostFilter("No Vintage Listings", options = {
        phrase: ["Vintage"]
      });
      return allCapsFilter = new PostFilter("NO ALL CAPS LISTINGS", options = {
        rule: function(elem) {
          return elem.toUpperCase() === elem;
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
      this.toggleFilter = __bind(this.toggleFilter, this);
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
    Filter.prototype.cleanHTML = function(dirtyPost) {
      var cleaned, dirtyString, htmlRegex;
      dirtyString = $(dirtyPost).html();
      htmlRegex = /<\/?[^<>]*\/?>/gi;
      cleaned = dirtyString.replace(htmlRegex, '');
      if (cleaned.indexOf("-") > -1) {
        cleaned = cleaned.substring(cleaned.indexOf("-"));
      }
      return cleaned;
    };
    Filter.prototype.toggleFilter = function(bool) {
      var post, _i, _len, _ref, _results;
      _ref = this.offendingPosts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        post = _ref[_i];
        _results.push(bool ? $(post).fadeOut() : $(post).fadeIn());
      }
      return _results;
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
      var value;
      if (bool) {
        value = this.options.attribute.custom;
      } else {
        value = this.options.attribute.orig;
      }
      return $(this.elements).attr(this.options.attribute.name, value);
    };
    return AttributeFilter;
  })();
  PostFilter = (function() {
    __extends(PostFilter, Filter);
    function PostFilter() {
      this.toggleFilter = __bind(this.toggleFilter, this);
      PostFilter.__super__.constructor.apply(this, arguments);
    }
    PostFilter.prototype.toggleFilter = function(bool) {
      this.offendingPosts || (this.offendingPosts = []);
      if (this.options.phrase) {
        this.scrubPhrase(bool);
      }
      if (this.options.rule) {
        this.applyRule(bool);
      }
      return PostFilter.__super__.toggleFilter.apply(this, arguments);
    };
    PostFilter.prototype.scrubPhrase = function(bool) {
      var matchingPhrase, matchingPhrases, phrase, post, _i, _j, _len, _len2, _ref, _results;
      matchingPhrases = [];
      _ref = this.options.phrase;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        phrase = _ref[_i];
        matchingPhrases.push(phrase.toUpperCase());
      }
      if (this.offendingPosts.length < 1) {
        _results = [];
        for (_j = 0, _len2 = posts.length; _j < _len2; _j++) {
          post = posts[_j];
          _results.push((function() {
            var _k, _len3, _results2;
            _results2 = [];
            for (_k = 0, _len3 = matchingPhrases.length; _k < _len3; _k++) {
              matchingPhrase = matchingPhrases[_k];
              _results2.push(this.cleanHTML($(post).html()).toUpperCase().match(matchingPhrase) ? this.offendingPosts.push(post) : void 0);
            }
            return _results2;
          }).call(this));
        }
        return _results;
      }
    };
    PostFilter.prototype.applyRule = function(bool) {
      var cleanedPost, post, _i, _len, _results;
      if (this.offendingPosts.length < 1) {
        _results = [];
        for (_i = 0, _len = posts.length; _i < _len; _i++) {
          post = posts[_i];
          cleanedPost = this.cleanHTML($(post).html());
          _results.push(this.options.rule(cleanedPost) === true ? this.offendingPosts.push(post) : void 0);
        }
        return _results;
      }
    };
    return PostFilter;
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
