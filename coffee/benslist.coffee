postTag = "p"
posts = $("body").find(postTag)
fixedElems = ".bchead, blockquote:first"
bodyElems = "blockquote:eq(1)"
searchFields = "#searchfieldset"

class Filters
	setDefaults: ->
		this.format()
		# this.attachBehaviors()

	defineFilters: ->
		#add custom filter div to the page
		$(searchFields).append("<div id='additional_search'>Custom Filters<div id='custom_form'></div></div>")

		#open all links in a new tab
		newTabFilter = new AttributeFilter("Links open in new tab", options =
			{
				element: $(posts).find("a:not(.hide_link)"),
				attribute: {
					name: 	"target"
					orig: 	"_self"
					custom: "_blank"
				}
			})

		#filter out crappy ol' vintage joints
		oldApartmentFilter = new PostFilter("No Vintage Listings", options = { phrase: ["Vintage"] })

		#filter out basements
		# basementFilter = new PostFilter("No Garden/Basement Apartments", options = )

		#crazy people write in all caps
		allCapsFilter = new PostFilter("NO ALL CAPS LISTINGS", options = { rule: (elem) -> 
			elem.toUpperCase() == elem
		})

	
	format: ->
		#wrap header elements in a fixed position div
		$(fixedElems).wrapAll("<div id='fixed_header'></div>")

		#move everything else down below the fixed header
		$(bodyElems).addClass("under_fixed")

		#style posts
		posts.addClass("styled_post")

		#add hide link to posts
		# posts.append("<a href='#' class='hide_link'>Hide All</a>")

		#add Filters div and initialize filters
		this.defineFilters()

	# attachBehaviors: ->
		# hideLinks = $("a.hide_link")
		# hideLinks.bind 'click', (event) ->
		# 	$(this).parent(postTag).hide()

class Filter
	constructor: (@label, @options) ->
		@name = @label.toLowerCase().replace /[ ]/g, ""
		@checkbox = $("<input type='checkbox' name='" + @name + "' id='" + @name + "' \/>")
		@elements = @options.element
		this.apply()

	apply: ->
		$("#custom_form").append("<label for='" + @name + "'>" + @label + "<\/label>").append($(@checkbox))

		$(@checkbox).bind 'click', (event) =>
			if $(event.target).is(':checked')
				this.toggleFilter(true)
			else
				this.toggleFilter(false)

	cleanHTML: (dirtyPost) ->
		dirtyString = $(dirtyPost).html()

		#remove all html tags from the post to match stuff against
		htmlRegex = /<\/?[^<>]*\/?>/gi
		cleaned = dirtyString.replace(htmlRegex,'')

		#oftentimes the actual posting comes after an initial '-' separating it from the number of bedrooms and price. we only want the part after that
		if cleaned.indexOf("-") > -1
			cleaned = cleaned.substring(cleaned.indexOf("-"))

		cleaned

	toggleFilter: (bool) =>
		for post in @offendingPosts
			if bool
				$(post).fadeOut()
			else
				$(post).fadeIn()

class AttributeFilter extends Filter
	toggleFilter: (bool) =>
		if bool
			value = @options.attribute.custom
		else
			value = @options.attribute.orig
		$(@elements).attr(@options.attribute.name, value)

class PostFilter extends Filter
	toggleFilter: (bool) =>
		@offendingPosts ||= []
		if @options.phrase
			this.scrubPhrase(bool)

		if @options.rule
			this.applyRule(bool)

		super

	scrubPhrase: (bool) ->
		matchingPhrases = []
		matchingPhrases.push phrase.toUpperCase() for phrase in @options.phrase
		if @offendingPosts.length < 1
			for post in posts
				for matchingPhrase in matchingPhrases
					@offendingPosts.push(post) if this.cleanHTML($(post).html()).toUpperCase().match(matchingPhrase)

	applyRule: (bool) ->
		if @offendingPosts.length < 1
			for post in posts
				cleanedPost = this.cleanHTML($(post).html())
				@offendingPosts.push(post) if @options.rule(cleanedPost) == true

setFilters = ->
	@initialized = true
	pageFilters = new Filters()
	pageFilters.setDefaults()

initialize = ->
	return if @initialized

	#add some sweet styles
	styles = document.createElement("link")
	styles.type = "text/css"
	styles.rel = "stylesheet"
	styles.href = "http://localhost/apartment_finder/css/benslist.css"
	document.getElementsByTagName("head")[0].appendChild(styles)

	# if jquery is not already defined on the page, insert it into the page
	if document.location.href.indexOf("localhost") < 0 && document.location.href.indexOf("craigslist.org") < 0
		alert("For use with Craigslist apartment search pages.")
		return
	if window.jQuery == undefined || window.jQuery.fn.jquery < @version
		script = document.createElement("script")
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + @version + "/jquery.min.js"
		document.getElementsByTagName("head")[0].appendChild(script)
		script.onload = =>
			setFilters()
	else
		setFilters()

#set global setup variables, initialize
@version = "1.7.1"
@initialized ||= false
initialize()