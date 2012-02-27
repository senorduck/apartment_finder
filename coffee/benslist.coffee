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
		basementFilter = new PostFilter("No Garden/Basement Apartments", options = { phrase: ["Garden","Basement"] })

		#filter out first floor
		firstFloorFilter = new PostFilter("No first floor apartments", options = { phrase: ["First Floor", "1st Floor"] })

		#crazy people write in all caps
		allCapsFilter = new PostFilter("NO ALL CAPS LISTINGS", options = { rule: (elem) -> 
			elem.toUpperCase() == elem
		})

		#move-in fees don't make any sense. at all. they don't send people to help you move or anything. it's like a deposit, only instead of getting your money back, you don't
		moveInFeeFilter = new PostFilter("No Move-in Fees, &quot;$0 Security Deposit&quot; crap",
			options = { phrase: [ "0 security deposit", "move-in fee", "move in fee", "no security deposit" ] })

		#oneBed
		oneBedroomFilter = new PostFilter("1 Bedroom", options = { phrase: ["1br"], match: true, checked: 'checked', trimPrice: 'none' })

		#twoBed
		twoBedroomFilter = new PostFilter("2 Bedroom", options = { phrase: ["2br"], match: true, checked: 'checked', trimPrice: 'none' })

		#threeBed
		threeBedroomFilter = new PostFilter("3 Bedroom", options = { phrase: ["3br"], match: true, checked: 'checked', trimPrice: 'none' })

	
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
		checked = @options.checked || false
		@checkbox = $("<input type='checkbox' name='" + @name + "' id='" + @name + "' \/>")
		@checkbox.attr("checked","checked") if checked
		@elements = @options.element
		@trimPrice = @options.trimPrice || false
		@match = @options.match || false
		this.apply()

	apply: ->
		$("#custom_form").append($(@checkbox)).append("<label for='" + @name + "'>" + @label + "<\/label>")

		#toggle the filter on init
		this.toggleFilter(true) if $(@checkbox).is(':checked')

		#bind to the click event of the checkbox
		$(@checkbox).bind 'click', (event) =>
			if $(event.target).is(':checked')
				this.toggleFilter(true)
			else
				this.toggleFilter(false)

	cleanHTML: (dirtyPost, trimPrice) ->
		dirtyString = $(dirtyPost).html()

		#remove all html tags from the post to match stuff against
		htmlRegex = /<\/?[^<>]*\/?>/gi
		cleaned = dirtyString.replace(htmlRegex,'')

		#oftentimes the actual posting comes after an initial '-' separating it from the number of bedrooms and price. we only want the part after that
		if trimPrice != "none" && cleaned.indexOf("-") > -1
			cleaned = cleaned.substring(cleaned.indexOf("-"))

		cleaned

	toggleFilter: (bool) =>
		for post in @offendingPosts
			if (bool && @match) || (!bool && !@match)
					$(post).fadeIn()
			else
				$(post).fadeOut()

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
					@offendingPosts.push(post) if this.cleanHTML($(post).html(), @trimPrice).toUpperCase().match(matchingPhrase)

	applyRule: (bool) ->
		if @offendingPosts.length < 1
			for post in posts
				cleanedPost = this.cleanHTML($(post).html(), @trimPrice)
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
	styles.href = "http://localhost/css/benslist.css"
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