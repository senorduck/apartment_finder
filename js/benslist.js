(function() {
  var AttributeFilter, Filter, Filters, PostFilter, bodyElems, fixedElems, initialize, postTag, posts, searchFields, setFilters,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
      var allCapsFilter, basementFilter, firstFloorFilter, moveInFeeFilter, newTabFilter, oldApartmentFilter, oneBedroomFilter, options, threeBedroomFilter, twoBedroomFilter;
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
      basementFilter = new PostFilter("No Garden/Basement Apartments", options = {
        phrase: ["Garden", "Basement"]
      });
      firstFloorFilter = new PostFilter("No first floor apartments", options = {
        phrase: ["First Floor", "1st Floor"]
      });
      allCapsFilter = new PostFilter("NO ALL CAPS LISTINGS", options = {
        rule: function(elem) {
          return elem.toUpperCase() === elem;
        }
      });
      moveInFeeFilter = new PostFilter("No Move-in Fees, &quot;$0 Security Deposit&quot; crap", options = {
        phrase: ["0 security deposit", "move-in fee", "move in fee", "no security deposit"]
      });
      oneBedroomFilter = new PostFilter("1 Bedroom", options = {
        phrase: ["1br"],
        match: true,
        checked: 'checked',
        trimPrice: 'none'
      });
      twoBedroomFilter = new PostFilter("2 Bedroom", options = {
        phrase: ["2br"],
        match: true,
        checked: 'checked',
        trimPrice: 'none'
      });
      return threeBedroomFilter = new PostFilter("3 Bedroom", options = {
        phrase: ["3br"],
        match: true,
        checked: 'checked',
        trimPrice: 'none'
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
      var checked;
      this.label = label;
      this.options = options;
      this.toggleFilter = __bind(this.toggleFilter, this);
      this.name = this.label.toLowerCase().replace(/[ ]/g, "");
      checked = this.options.checked || false;
      this.checkbox = $("<input type='checkbox' name='" + this.name + "' id='" + this.name + "' \/>");
      if (checked) this.checkbox.attr("checked", "checked");
      this.elements = this.options.element;
      this.trimPrice = this.options.trimPrice || false;
      this.match = this.options.match || false;
      this.apply();
    }

    Filter.prototype.apply = function() {
      var _this = this;
      $("#custom_form").append($(this.checkbox)).append("<label for='" + this.name + "'>" + this.label + "<\/label>");
      if ($(this.checkbox).is(':checked')) this.toggleFilter(true);
      return $(this.checkbox).bind('click', function(event) {
        if ($(event.target).is(':checked')) {
          return _this.toggleFilter(true);
        } else {
          return _this.toggleFilter(false);
        }
      });
    };

    Filter.prototype.cleanHTML = function(dirtyPost, trimPrice) {
      var cleaned, dirtyString, htmlRegex;
      dirtyString = $(dirtyPost).html();
      htmlRegex = /<\/?[^<>]*\/?>/gi;
      cleaned = dirtyString.replace(htmlRegex, '');
      if (trimPrice !== "none" && cleaned.indexOf("-") > -1) {
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
        if ((bool && this.match) || (!bool && !this.match)) {
          _results.push($(post).fadeIn());
        } else {
          _results.push($(post).fadeOut());
        }
      }
      return _results;
    };

    return Filter;

  })();

  AttributeFilter = (function(_super) {

    __extends(AttributeFilter, _super);

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

  })(Filter);

  PostFilter = (function(_super) {

    __extends(PostFilter, _super);

    function PostFilter() {
      this.toggleFilter = __bind(this.toggleFilter, this);
      PostFilter.__super__.constructor.apply(this, arguments);
    }

    PostFilter.prototype.toggleFilter = function(bool) {
      this.offendingPosts || (this.offendingPosts = []);
      if (this.options.phrase) this.scrubPhrase(bool);
      if (this.options.rule) this.applyRule(bool);
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
              if (this.cleanHTML($(post).html(), this.trimPrice).toUpperCase().match(matchingPhrase)) {
                _results2.push(this.offendingPosts.push(post));
              } else {
                _results2.push(void 0);
              }
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
          cleanedPost = this.cleanHTML($(post).html(), this.trimPrice);
          if (this.options.rule(cleanedPost) === true) {
            _results.push(this.offendingPosts.push(post));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    return PostFilter;

  })(Filter);

  setFilters = function() {
    var pageFilters;
    this.initialized = true;
    pageFilters = new Filters();
    return pageFilters.setDefaults();
  };

  initialize = function() {
    var script, styles,
      _this = this;
    if (this.initialized) return;
    styles = document.createElement("link");
    styles.type = "text/css";
    styles.rel = "stylesheet";
    styles.href = "http://localhost/css/benslist.css";
    document.getElementsByTagName("head")[0].appendChild(styles);
    if (document.location.href.indexOf("localhost") < 0 && document.location.href.indexOf("craigslist.org") < 0) {
      alert("For use with Craigslist apartment search pages.");
      return;
    }
    if (window.jQuery === void 0 || window.jQuery.fn.jquery < this.version) {
      script = document.createElement("script");
      script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + this.version + "/jquery.min.js";
      document.getElementsByTagName("head")[0].appendChild(script);
      return script.onload = function() {
        return setFilters();
      };
    } else {
      return setFilters();
    }
  };

  this.version = "1.7.1";

  this.initialized || (this.initialized = false);

  initialize();

}).call(this);
