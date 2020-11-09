// ==UserScript==
// @name         Rule34.xxx Improved
// @namespace    UserScript
// @version      3.1
// @description  A lot of improvements for rule34.xxx
// @author       Hentiedup, 0xC0LD, usnkw
// @match        https://rule34.xxx/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @icon         data:image/ico;base64,AAABAAEAEBAAAAEAIABeAQAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAAlwSFlzAAALEwAACxMBAJqcGAAAARBJREFUOMudkjFOw0AQRd86mxugNCTyRaxIkZyCii5FOm5gi3NY5gacgcqFKX0R5NBE3CDgT7XW2llsYCTLO//P35n9u0aSedq8dvwjsjaNrBNnbdoTxhgAynUdEvU8m7qLfNB9kgDIT/srsR/d4pPI7zgzbrDO+kkRV38Su3OqXNfyAxDQ4y4v4mqQA7Jj4wAkYYwhP+3JUO+JzzuNnTv7eHS3+cCDrE3JTdgDH3t8uwub6F/d1K2MGxRxhZ0ShSZydY6z7sWNH00RV7y8Pw+w+9uHa65c19pFR300XwJ0bi4CtLWHfj2FRW73m2TBubmwSpZs7QGAVbKcx9wEv+kWwpBkdtGxL3B/f/0TJsl8A8Ga1pJm8pdUAAAAAElFTkSuQmCC
// ==/UserScript==

// ===[ Settings ]===
var autoplayVideos            = false; // (true/false) Automatically play the video
var defaultVideoVolume        = 1;     // (0-1)        0 = mute, 0.5=50%, 1=100%, etc.
var useViewportDependentSize  = true;  // (true/false) Makes the max-height of all images and videos X% of the viewport (inner window of the browser) width/height.  
var viewportDependentHeight   = 70;    // (1-100)      the size used by above. (in %)
var stretchImgVid             = true;  // (true/false) Makes image and video height follow the viewportDependentHeight regardless of true size. i.e. will stretch if needed.
var trueVideoSize             = false; // (true/false) Resizes videos to their true size (unless overriden by stretchImgVid)
var enableFavOnEnter          = true;  // (true/false) Use the "ENTER" key on your keyboard to add a post to your favorites
var hideBlacklistedThumbnails = true;  // (true/false) Hide blacklisted thumbnails on the front page (https://rule34.xxx/index.php?page=post&s=list&tags=all)
var forceDarkTheme            = true;  // (true/false) Force rule34's dark theme on every page, even if light theme is set in options
var betterDarkTheme           = true;  // (true/false) Use a custom CSS dark theme with the rule34's dark theme (must enable forceDarkTheme)
var removeHentaiClickerGame   = true;  // (true/false) Remove the hentai clicker game ad
var endlessScrolling          = true;  // (true/false) When you get to the bottom of the current page it will automatically append the content from the next page on the current page
var favFilter                 = true;  // (true/false) Adds a searchbox for tag(s) in favorites
var showFavPosts              = true;  // (true/false) Shows you which posts are in your favorites while browsing
// - Don't touch anything else unless you know what you're doing

endlessScrolling = GM_getValue("endlessScrolling", endlessScrolling);

var betterDarkThemeCss = `
* {
	--c-bg: #101010;
	--c-bg-alt: #101010;
	--c-bg-highlight: #202020;
}

body { background-image: none; color: white; background-color: #101010 }

table.highlightable td { border-color: #023C00; }

input[type="text"], input[type="password"], input[type="email"], textarea, select {
	color: lime;
	background-color: black;
	border-color: green;
	border-style:solid;
	margin: 1px;
}

input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus, textarea:focus, select:focus {
	background-color: #101010 !important;
}

.awesomplete [hidden] { display: none }
.awesomplete .visually-hidden { position: absolute; }
.awesomplete { display: inline-block; position: relative }
.awesomplete>input { display: block }
.awesomplete>ul:empty { display:none }
.awesomplete>ul {
	position: absolute;
	z-index: 1;
	min-width: 100%;
	box-sizing: border-box;
	list-style: none;
	padding: 0;
	margin: 0;
	background: black;
	padding: 3px;
	margin: 0;
	color: hotpink;
	background: linear-gradient(to top left, #002404, black);
	border-color: lime;
	border-width: 1px;
	text-shadow: none;
}
@supports(transform:scale(0)) {
	.awesomplete>ul { transition:.1s cubic-bezier(1,1,1,1); transform-origin:1.43em -.43em; }
	.awesomplete>ul[hidden],
	.awesomplete>ul:empty { opacity: 0; transform: scale(0); display: block; ransition-timing-function: ease; }
}
.awesomplete>ul:before { display: none }
.awesomplete>ul>li                       { cursor:pointer; color: hotpink; background: transparent; border: 1px solid transparent; position: relative; padding: 1px; }
.awesomplete>ul>li:hover                 { cursor:pointer; color: hotpink; background: indigo;      border: 1px solid transparent; }
.awesomplete>ul>li[aria-selected=true]   { cursor:pointer; color: hotpink; background: indigo;      border: 1px solid lime; }
.awesomplete mark                        { cursor:pointer; color: lime; background: transparent; }
.awesomplete li:hover mark               { cursor:pointer; color: lime; background: transparent; }
.awesomplete li[aria-selected=true] mark { cursor:pointer; color: lime; background: transparent; }
`;

var sliderCss = `
.slider {
	margin: 0 5px 0 5px;
	padding: 0;
	display: inline-block;
	-webkit-appearance: none;
	width: 25%;
	height: 10px;
	border-radius: 5px;
	border: solid 1px green;
	background: #101010;
	opacity: 0.8;
	-webkit-transition: .1s;
	transition: opacity .1s;
}

.slider:hover { opacity: 1; }

.slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #4CAF50;
	cursor: pointer;
}

.slider::-moz-range-thumb {
	width: 15px;
	height: 15px;
	border-radius: 50%;
	background: #4CAF50;
	cursor: pointer;
}
`;

var customButtonCss = `
#postbar { 
	margin: 0;
	padding 30px;
	border: solid 1px var(--c-link-soft);
	display: inline-block;
	width: auto;
	background-color: var(--c-bg-highlight);
}

.custom-button {
	background-color: transparent;
	cursor: pointer;
	width: auto;
	padding: 3px;
	margin: 1px;
	border-radius: 20px;
}
.custom-button:hover  { background-color: rgba(100,255,100,.2); }
.custom-button:active { background-color: rgba(255,255,255,1);  }
`;

var viewPDepenCSS = useViewportDependentSize ?
((stretchImgVid ? `
#gelcomVideoContainer {
	width: auto !important;
	max-width: 100% !important;
	height: ` + viewportDependentHeight + `vh !important;
}` : "") + `
#image {
	width: auto !important;
	max-width: 100% !important;
	` + (stretchImgVid ? "" : "max-") + `height: ` + viewportDependentHeight + `vh !important;
}`) : "";


var favedPostCss = `
opacity: 0.25;
background-image:
	linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black), 
	linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black),
	linear-gradient(lime, transparent);
background-size: 4px 4px, 4px 4px, 100% 100%;    
background-position: 0px 0px, 2px 2px, 0px 0px;
`;

function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }

var originalTitle = document.title;

/// TODO: move all the options in options and save the values
if (document.location.href.includes("index.php?page=account&s=options")) {
	
}

// add fav controls container
if (document.location.href.includes("index.php?page=favorites&s=view")) {
	// container for all the controls in favorites
	var cont = document.createElement("div");
	cont.id = "favcontrols";
	cont.style = "margin: 2px 5px 10px 5px;"
	document.getElementById("header").parentNode.insertBefore(cont, document.getElementById("header").nextSibling);
}

if (showFavPosts) {
	var favlist = GM_getValue("favlist", []);
	
	var shouldStop = false;
	var txt_status2;
	
	// filtering
	if (document.location.href.includes("index.php?page=post&s=list")) {
		var elements = document.getElementsByClassName("thumb");
		//console.log(elements);
		for (let i = 0; i < elements.length; i++) {
			var id = elements[i].id.replace('s', '');
			if (favlist.includes(id)) { elements[i].style = favedPostCss; }
		}
	}
	
	// filtering in fav
	if (document.location.href.includes("index.php?page=favorites&s=view")) {
		var elements = document.getElementsByClassName("thumb");
		for (let i = 0; i < elements.length; i++) {
			var id = elements[i].childNodes[0].id.replace('p', '');
			if (favlist.includes(id)) { elements[i].style = favedPostCss; }
		}
	}
	
	// the buttons for updating list
	if (document.location.href.includes("index.php?page=favorites&s=view")) {
		
		// update fav list
		var btn_updatefav = document.createElement("button");
		btn_updatefav.style = "display: inline-block;";
		btn_updatefav.title = favlist.length + " ID(s)";
		btn_updatefav.innerHTML = "Update favorites list [" + favlist.length + "]";
		async function getIds() {
			var reg = /pid=([0-9]*)/gm;
			var base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
			if (!base.includes("favorites")) { return console.log("not a favorites page"); };
	
			// vars
			var step = 50;
			var max;
			var el = document.getElementsByName("lastpage")[0];
			var maxMatch = reg.exec(el.attributes[1].nodeValue);
			var max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
			var curMatch = reg.exec(document.location);
			var cur = curMatch == null ? 0 : parseInt(curMatch[1]);
			
			var c = 0;
			var added = 0;
			
			// start search
			for (; cur <= max; cur += step) {
				var url = base + "&pid=" + cur;
				var ifr = document.createElement("iframe");
				ifr.style = "display: none";
				ifr.src = url;
				ifr.onload = function() {
					var elements = ifr.contentWindow.document.getElementsByClassName("thumb");
					for (let i = 0; i < elements.length; i++) {
						var id = elements[i].childNodes[0].id.replace('p', '');
						if (!favlist.includes(id)) { favlist.push(id); added++; }
						c++;
						txt_status2.innerHTML = "images[" + c + "], favlist[" + favlist.length + "], added[" + added + "]";
					}
					ifr.parentNode.removeChild(ifr);
				}
				document.body.appendChild(ifr);
				await sleep(slider.value);
				if (shouldStop) { shouldStop = false; return; }
				
				GM_setValue("favlist", favlist);
				btn_updatefav.title = favlist.length + " ID(s)";
				btn_updatefav.innerHTML = "Update favorites list [" + favlist.length + "]";
			}
		}
		btn_updatefav.onclick = function() { getIds(); };
		
		var cont = document.getElementById("favcontrols");
		
		var favlistCont = document.createElement("div");
		favlistCont.style = "display: block; float: right; border: 1px solid green; width: 20%;";
		
		var btn_stopUpdate = document.createElement("button");
		btn_stopUpdate.style = "display: inline-block;";
		btn_stopUpdate.title = "Stop the update";
		btn_stopUpdate.innerHTML = "Stop";
		btn_stopUpdate.onclick = function() { shouldStop = true; };
		
		// url - status
		txt_status2 = document.createElement("p");
		txt_status2.id = "favlistStatus";
		txt_status2.style = "display: block;";
		
		favlistCont.appendChild(btn_updatefav);
		favlistCont.appendChild(btn_stopUpdate);
		favlistCont.appendChild(txt_status2);
		
		cont.appendChild(favlistCont);
	}
}

if (hideBlacklistedThumbnails) {
	$(window).on('DOMContentLoaded load', async function() {
		var elements = document.getElementsByClassName("thumb blacklisted-image");
		//var i = 0;
		while (elements[0]) { /* i++; */ elements[0].parentNode.removeChild(elements[0]); }
		//if (i > 0) { console.log("removed content: " + i); }
	});
}

// endless scrolling
if (document.location.href.includes("index.php?page=post&s=list") || document.location.href.includes("index.php?page=favorites&s=view")) {
	
	var cb = document.createElement('input');
	cb.type = "checkbox";
	cb.id = "endlessScrolling_cb";
	cb.style = "display: block; cursor: pointer; float: right;";
	cb.checked = endlessScrolling;
	cb.title = "Enable endless scrolling"
	cb.addEventListener('change', (event) => { GM_setValue("endlessScrolling", event.target.checked); });
	
	var p = document.createElement("p");
	p.id = "endlessScrolling_p";
	p.style = "display: block; float: left;";
	p.innerHTML = "";
	
	var div = document.createElement("div");
	div.id = "endlessScrolling_cont";
	div.style = "position: fixed; top: 5px; right: 5px;";
	div.append(cb);
	div.append(p);
	
	document.body.appendChild(div);
	
	$.fn.isInViewport = function() {
		var elementTop = $(this).offset().top;
		var elementBottom = elementTop + $(this).outerHeight();
		var viewportTop = $(window).scrollTop();
		var viewportBottom = viewportTop + $(window).height();
		return elementBottom > viewportTop && elementTop < viewportBottom;
	};
	
	var reachedTheEnd = false;
	
	async function main_scroll() {
		var reg = /pid=([0-9]*)/gm;
		var add = document.location.href;

		var base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
		var step = base.includes("favorites") ? 50 : 42;

		var el = step == 50 ? document.getElementsByName("lastpage")[0] : document.getElementsByTagName("a")[document.getElementsByTagName("a").length - 2];
		var text = step == 50 ? el.attributes[1].nodeValue : el.href;
		var maxMatch = reg.exec(text);
		var max = maxMatch == null ? 0 : max = parseInt(maxMatch[1]);

		var curMatch = /pid=([0-9]*)/gm.exec(add);
		var cur = curMatch == null ? 0 : parseInt(curMatch[1]);

		var loadNext = true;
		$(window).on('DOMContentLoaded load resize scroll', async function() {
			if (reachedTheEnd) { return; }
			if (!cb.checked) { return; }
		  
			//if(cur >= max){return;}
			if ($('#paginator').isInViewport() && loadNext) {
				loadNext = false;
				cur += step;
				getImagesFromUrl(base, step, cur);
				await sleep(1000);
				loadNext = true;
			}
		});
	};

	function getImagesFromUrl(base, step, cur) {
		var url = base + "&pid=" + cur;
		
		var ifr = document.createElement("iframe");
		ifr.style = "display: none;";
		ifr.src = url;
		ifr.onload = function() {
			var images = Array.prototype.slice.call(ifr.contentWindow.document.getElementsByTagName("img"), 0);
			images.reverse();
			//console.log(images);
			var t = 0;
			var g = 0;
			for (i = images.length - 1; i >= 0; i--) {
				if (images[i].parentNode.parentNode.tagName == "SPAN") {
					t++;
					if (hideBlacklistedThumbnails && images[i].parentNode.parentNode.className == "thumb blacklisted-image") { continue; }
					document.getElementById("paginator").parentNode.insertBefore(images[i].parentNode.parentNode, document.getElementById("paginator"));
					g++;
				}
			}
			//console.log("images: " + g + "/" + t + " (-" + (t - g) + ")");
			ifr.parentNode.removeChild(ifr);
			document.title = originalTitle;
		  
			if (t == 0) { reachedTheEnd = true; return; } // no images added, this is the end
			p.innerHTML = cur + " (" + ((cur+step)/step) + ")";
		}
		
		document.title = "Loading...";
		document.body.appendChild(ifr);
	}

	$(document).ready(function() { main_scroll(); });
}

if (favFilter) {
	var btn_filter;
	var txt_curmax;
	var txt_status;
	var txt_imageCount;

	var imagesAdded = 0;
	var shouldStop = false;

	// start search
	async function main_favFilter() {
		var reg = /pid=([0-9]*)/gm;
		var base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
		if (!base.includes("favorites")) { return console.log("not a favorites page"); };

		// vars
		var step = 50;
		var max;
		var el = document.getElementsByName("lastpage")[0];
		var maxMatch = reg.exec(el.attributes[1].nodeValue);
		var max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
		var curMatch = reg.exec(document.location);
		var cur = curMatch == null ? 0 : parseInt(curMatch[1]);

		// remove all spans
		var elements = document.getElementsByTagName("span");
		while (elements[0]) { elements[0].parentNode.removeChild(elements[0]); }
		var elements2 = document.getElementsByTagName("br");
		while (elements2[0]) { elements2[0].parentNode.removeChild(elements2[0]); }

		// start search
		for (; cur <= max; cur += step) {
			var url = base + "&pid=" + cur;
			txt_curmax.innerHTML = url  + " -- " + cur + "/" + max + " (" + ((cur/step)+1) + "/" + ((max/step)+1) + ")";
			getImagesFromUrl(url, input.value.split(" "));
			await sleep(slider.value);
			if (shouldStop) { shouldStop = false; return; }
		}
	};

	// load images from url
	function getImagesFromUrl(url, match) {
		var ifr = document.createElement("iframe");
		ifr.style = "display: none";
		ifr.src = url;
		ifr.onload = function() {
			var toAdd = [];
			var images = ifr.contentWindow.document.getElementsByTagName("img");
			//console.log(images);
			for (i = images.length - 1; i >= 0; i--) {
				var addImage = true;
				for (j = 0; j < match.length; j++) { if (!images[i].title.includes(match[j])) { addImage = false; } }
				if (addImage) { toAdd.push(images[i].parentNode.parentNode); }
			}
			for (i = toAdd.length - 1; i >= 0; i--) {
				document.getElementById("paginator").parentNode.insertBefore(toAdd[i], document.getElementById("paginator"));
				imagesAdded++;
			}
			ifr.parentNode.removeChild(ifr);
			document.title = "[" + imagesAdded + "] Done!";
			txt_imageCount.innerHTML = "Images Loaded: " + imagesAdded;
			txt_status.innerHTML = "Done!";
		}
		document.title = "[" + imagesAdded + "] Loading...";
		txt_status.innerHTML = "Loading...";
		document.body.appendChild(ifr);
	}

	var base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
	if (base.includes("favorites")) {
		
		var cont = document.getElementById("favcontrols");
		
		// textbox for tags
		input = document.createElement("input");
		input.style = "width: 20%; display: inline-block;";
		input.type = "text";
		input.addEventListener("keydown", function(event) {
			if (event.key === "Enter") {
				event.preventDefault();
				main_favFilter();
			}
		});
		cont.appendChild(input);
		
		// filter/search button
		btn_filter = document.createElement("button");
		btn_filter.style = "display: inline-block;";
		btn_filter.id = "filterButton";
		btn_filter.title = "Start search"
		btn_filter.innerHTML = "Filter";
		btn_filter.onclick = function() { main_favFilter(); }
		cont.appendChild(btn_filter);
		
		// stop button
		var btn_stop = document.createElement("button");
		btn_stop.style = "display: inline-block;";
		btn_stop.title = "Stop search";
		btn_stop.innerHTML = "Stop";
		btn_stop.onclick = function() { shouldStop = true; }
		cont.appendChild(btn_stop);

		// clear images button
		var btn_clear = document.createElement("button");
		btn_clear.style = "display: inline-block;";
		btn_clear.title = "Hide all content";
		btn_clear.innerHTML = "Clear";
		btn_clear.onclick = function() {
			var elements = document.getElementsByTagName("span");
			while (elements[0]) { elements[0].parentNode.removeChild(elements[0]); }
			var elements2 = document.getElementsByTagName("br");
			while (elements2[0]) { elements2[0].parentNode.removeChild(elements2[0]); }
			imagesAdded = 0;
			document.title = originalTitle;
		}
		cont.appendChild(btn_clear);

		// help button
		var btn_help = document.createElement("button");
		btn_help.style = "display: inline-block;";
		btn_help.title = "Show help";
		btn_help.innerHTML = "Help";
		btn_help.onclick = function() {
			alert(
				"[TEXTBOX] - put tags you want to search for, in your favorites\n" +
				"[Filter] - find posts with tags specified in the textbox\n" +
				"[Stop] - stop searching\n" +
				"[Clear] - clear images that are displayed (it doesn't remove them from favorites)\n" +
				"[Help] - display this msg\n" +
				"* The slider sets the time between requests.\n" +
				"* This is not an officially supported service.\n" +
				"* If you make too many requests, you might get temporarily blocked.\n" +
				"* The recommended time slider delay is 1000ms\n" +
				"* If the search takes too long try decreasing the time between requests."
			);
		}
		cont.appendChild(btn_help);
		
		
		var slider = document.createElement("input");
		slider.type = "range";
		slider.min = "100";
		slider.max = "4000";
		slider.value = 1000;
		slider.className = "slider";
		slider.id = "delayRange";
		cont.appendChild(slider);
		
		GM_addStyle(sliderCss);
		
		// slider speed label
		var txt_speed = document.createElement("p");
		txt_speed.style = "display: inline-block;";
		txt_speed.innerHTML = "Request Speed: " + slider.value + "ms";
		slider.oninput = function() { txt_speed.innerHTML = "Request Speed: " + slider.value + "ms"; }
		cont.appendChild(txt_speed);
		
		// current / max
		txt_curmax = document.createElement("p");
		txt_curmax.id = "curmax";
		txt_curmax.style = "margin: 0;";
		cont.appendChild(txt_curmax);
		
		// url - status
		txt_status = document.createElement("p");
		txt_status.id = "status";
		txt_status.style = "margin: 0;";
		cont.appendChild(txt_status);
		
		// loaded images count
		txt_imageCount = document.createElement("p");
		txt_imageCount.id = "imageCount"
		txt_imageCount.style = "margin: 0;";
		cont.appendChild(txt_imageCount);
	};
}

if (removeHentaiClickerGame) {
	var items = document.getElementsByTagName("a");
	for (i = items.length - 1; i >= 0; i--) {
		if (items[i].href.includes("clicker")) {
			items[i].remove();
		}
	}
}

if (forceDarkTheme) {
	// remove deafult css (desktop.css)
	document.querySelectorAll('link[rel=stylesheet]').forEach(function(node) { if (node.href.includes("desktop.css")) { node.disabled = true; } });

	// add the dark theme css
	$('head').append('<link rel="stylesheet" type="text/css" media="screen" href="https://rule34.xxx/css/desktop_bip.css" title="default"/>');

	// nice.
	if (betterDarkTheme) { GM_addStyle(betterDarkThemeCss) }
}

// fav + add to Values fav list
function favPost() {
	$("#stats + div > ul > li > a:contains('Add to favorites')").click();
	var fun;
	fun = function() {
		var selectElement = document.getElementById("notice");
		if (selectElement.innerHTML == "Post added to favorites" || selectElement.innerHTML == "Post already in your favorites") {
			clearInterval(fun);
			if (showFavPosts) {
				var favlist = GM_getValue("favlist", []);
				var id = document.location.href.split("id=")[1];
				if (!favlist.includes(id)) { favlist.push(id); GM_setValue("favlist", favlist); }
			}
		}
	};
	setInterval(fun, 500);
}

if (enableFavOnEnter) {
	document.onkeydown = function(e) {
		var event = document.all ? window.event : e;
		switch (e.target.tagName.toLowerCase()) {
			case "input":
			case "textarea":
			case "select":
			case "button":
			case "tags":
			case "comment":
				break;
			default:
				if (event.keyCode == 13) { favPost(); }
				break;
		}
	}
}

// post view, add buttons
if (document.location.href.includes("index.php?page=post&s=view")) {
	
	GM_addStyle(viewPDepenCSS);
	GM_addStyle(customButtonCss);

	$("#gelcomVideoPlayer").prop("volume", defaultVideoVolume);
	if (autoplayVideos) { $("#gelcomVideoPlayer").prop("autoplay", true); }

	if (!stretchImgVid && trueVideoSize) {
		$("#gelcomVideoContainer").prop("style",
		"width: " + ($("#stats > ul > li:contains('Size: ')").text().split(": ")[1].split("x")[0]) + 
		"px; max-width: 100%; height: " + ($("#stats > ul > li:contains('Size: ')").text().split("x")[1]) + "px;");
	}

	$("#subnavbar").append('<div id="postbar">');

	// buttons
	$("#postbar").append(
		'<button id="btn-like"     class="custom-button" alt="like">👍like</button>' +
		'<button id="btn-fav"      class="custom-button" alt="favorite">❤️fav</button>' +
		'<button id="btn-close"    class="custom-button" alt="close">❌close</button>' +
		'<button id="btn-favclose" class="custom-button" alt="favclose">❤️+❌favclose</button>' +
		'<button id="btn-prev"     class="custom-button" alt="previous">⏮️prev</button>' +
		'<button id="btn-next"     class="custom-button" alt="next">⏭️next</button>'
	);
	
	// button click events
	$("#btn-like").click(function() { $("#stats > ul > li:contains('(vote up)') > a:contains('up')").click(); });
	$("#btn-fav").click(function() { favPost(); });
	$("#btn-close").click(function() { window.close(); });
	$("#btn-favclose").click(function() { $('#btn-fav').click(); $('#btn-close').click(); });
	$("#btn-prev").click(function() { $("#stats + div + div + div + div > ul > li > a:contains('Previous')").click(); });
	$("#btn-next").click(function() { $("#stats + div + div + div + div > ul > li > a:contains('Next')").click(); });
}
