class Filters
	setDefaults: ->
		this.formatPosts()
		this.attachBehaviors()
	
	formatPosts: ->
		@posts = $("body").find("p")
		@posts.css 
			"padding": "15px"
			"background": "#eee"
		@posts.append("<a href='#' class='hideLink' style='margin-left: 30px; color: #ccc;'>Hide All</a>")

	attachBehaviors: ->
		@hideLinks = $("a.hideLink")
		@hideLinks.bind 'click', (event) ->
			$(this).parent("p").hide()

setFilters = ->
	pageFilters = new Filters()
	pageFilters.setDefaults()

v = "1.7.1"
# if jquery is not already defined on the page, insert it into the page
if window.jQuery == undefined || window.jQuery.fn.jquery < v
	done = false
	script = document.createElement("script")
	script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js"
	document.getElementsByTagName("head")[0].appendChild(script)
	script.onload = =>
		setFilters()
else
	setFilters()
