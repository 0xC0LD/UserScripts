// ==UserScript==
// @name         Rule34.xxx Improved
// @namespace    UserScript
// @version      3.1
// @description  A lot of improvements for rule34.xxx
// @author       Hentiedup, 0xC0LD, usnkw, kekxd
// @match        https://rule34.xxx/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @icon         data:image/ico;base64,AAABAAEAEBAAAAEAIABeAQAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAAlwSFlzAAALEwAACxMBAJqcGAAAARBJREFUOMudkjFOw0AQRd86mxugNCTyRaxIkZyCii5FOm5gi3NY5gacgcqFKX0R5NBE3CDgT7XW2llsYCTLO//P35n9u0aSedq8dvwjsjaNrBNnbdoTxhgAynUdEvU8m7qLfNB9kgDIT/srsR/d4pPI7zgzbrDO+kkRV38Su3OqXNfyAxDQ4y4v4mqQA7Jj4wAkYYwhP+3JUO+JzzuNnTv7eHS3+cCDrE3JTdgDH3t8uwub6F/d1K2MGxRxhZ0ShSZydY6z7sWNH00RV7y8Pw+w+9uHa65c19pFR300XwJ0bi4CtLWHfj2FRW73m2TBubmwSpZs7QGAVbKcx9wEv+kWwpBkdtGxL3B/f/0TJsl8A8Ga1pJm8pdUAAAAAElFTkSuQmCC
// ==/UserScript==

//|
//|  If you want to edit settings, go to the options page of your account...
//|


/// TODO:
//    - when you remove a post from favs it should be removed from 'favlist' as well
//    - 'show fav posts' option ---> thumb->img:border:20px 
//    - custom checkbox css
//    - show if post is in the fav on the post page (next to the buttons)
//    - remove jQuery
//    - add fav button while browsing in thumb div

function recheckS(s_, s) { if (GM_getValue(s_, null) == null) { GM_setValue(s_, s); } }

var autoplayVideos_            = "autoplayVideos";            var autoplayVideos            = GM_getValue(autoplayVideos_           , false ); recheckS(autoplayVideos_            , autoplayVideos           );
var defaultVideoVolume_        = "defaultVideoVolume";        var defaultVideoVolume        = GM_getValue(defaultVideoVolume_       , 1     ); recheckS(defaultVideoVolume_        , defaultVideoVolume       );
var useViewportDependentSize_  = "useViewportDependentSize";  var useViewportDependentSize  = GM_getValue(useViewportDependentSize_ , true  ); recheckS(useViewportDependentSize_  , useViewportDependentSize );
var viewportDependentHeight_   = "viewportDependentHeight";   var viewportDependentHeight   = GM_getValue(viewportDependentHeight_  , 70    ); recheckS(viewportDependentHeight_   , viewportDependentHeight  );
var stretchImgVid_             = "stretchImgVid";             var stretchImgVid             = GM_getValue(stretchImgVid_            , true  ); recheckS(stretchImgVid_             , stretchImgVid            );
var trueVideoSize_             = "trueVideoSize";             var trueVideoSize             = GM_getValue(trueVideoSize_            , false ); recheckS(trueVideoSize_             , trueVideoSize            );
var enableFavOnEnter_          = "enableFavOnEnter";          var enableFavOnEnter          = GM_getValue(enableFavOnEnter_         , true  ); recheckS(enableFavOnEnter_          , enableFavOnEnter         );
var hideBlacklistedThumbnails_ = "hideBlacklistedThumbnails"; var hideBlacklistedThumbnails = GM_getValue(hideBlacklistedThumbnails_, true  ); recheckS(hideBlacklistedThumbnails_ , hideBlacklistedThumbnails);
var forceDarkTheme_            = "forceDarkTheme";            var forceDarkTheme            = GM_getValue(forceDarkTheme_           , true  ); recheckS(forceDarkTheme_            , forceDarkTheme           );
var betterDarkTheme_           = "betterDarkTheme";           var betterDarkTheme           = GM_getValue(betterDarkTheme_          , true  ); recheckS(betterDarkTheme_           , betterDarkTheme          );
var removeHentaiClickerGame_   = "removeHentaiClickerGame";   var removeHentaiClickerGame   = GM_getValue(removeHentaiClickerGame_  , true  ); recheckS(removeHentaiClickerGame_   , removeHentaiClickerGame  );
var endlessScrolling_          = "endlessScrolling";          var endlessScrolling          = GM_getValue(endlessScrolling_         , true  ); recheckS(endlessScrolling_          , endlessScrolling         );
var favFilter_                 = "favFilter";                 var favFilter                 = GM_getValue(favFilter_                , true  ); recheckS(favFilter_                 , favFilter                );
var showFavPosts_              = "showFavPosts";              var showFavPosts              = GM_getValue(showFavPosts_             , true  ); recheckS(showFavPosts_              , showFavPosts             );


var betterDarkThemeCss = `
* { --c-bg: #101010; --c-bg-alt: #101010; --c-bg-highlight: #202020; }

body { background-image: none; color: white; background-color: #101010 }

table.highlightable td { border-color: #023C00; }

input[type="text"], input[type="password"], input[type="email"], textarea, select {
	color: lime;
	background-color: black;
	border-color: green;
	border-style:solid;
	margin: 1px;
}

input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus, textarea:focus, select:focus { background-color: #101010 !important; }

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
	width: 60%;
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

#delayRange { width: 25% !important; }
`;

var postCss = `
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

#isinfav {
	display: inline-block;
	margin-left: 10px;
	font-size: 18px;
	background-color: pink;
	border: 1px deeppink solid;
}

` + (useViewportDependentSize ?
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
}`) : "");

var favedPostStyle = `
opacity: 0.25;
background-image:
	linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black), 
	linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, black 75%, black),
	linear-gradient(lime, transparent);
background-size: 4px 4px, 4px 4px, 100% 100%;    
background-position: 0px 0px, 2px 2px, 0px 0px;
`;


function favPost(id, close = false) {
	post_vote(id, 'up'); // like
	addFav(id); // add to fav
	// add to favlist (+close)
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
			if (close) { window.close(); }
		}
	};
	setInterval(fun, 500);
}

function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }

var originalTitle = document.title;

if (document.location.href.includes("index.php?page=account&s=options")) {
	
	// if in options check dark theme
	if (forceDarkTheme) { Cookie.create('theme', 'dark'); }
	
	GM_addStyle(sliderCss);
	
	var vtbody = document.body.getElementsByTagName("tbody")[0];
	
	function createCheckBox(setv, setv_, name, desc) {
		var vtr = document.createElement("tr");
		var vth = document.createElement("th");
		vlabel = document.createElement("label");
		vlabel.className = "block";
		vlabel.innerHTML = name;
		vth.appendChild(vlabel);
		
		var vp = document.createElement("p");
		vp.innerHTML = desc;
		vth.appendChild(vp);
		vtr.appendChild(vth);
		
		var vtd = document.createElement("td");
		var vinput = document.createElement("input");
		vinput.type = "checkbox";
		vinput.checked = GM_getValue(setv_, setv);
		vinput.addEventListener("change", function() { GM_setValue(setv_, this.checked); });
		vtd.appendChild(vinput);
		vtr.appendChild(vtd);
		vtbody.appendChild(vtr);
	}
  	
	createCheckBox(autoplayVideos            , autoplayVideos_            , "AutoPlay",                    "Automatically play the video.");
	{
		var vtr = document.createElement("tr");
		var vth = document.createElement("th");
		var vlabel = document.createElement("label");
		vlabel.className = "block";
		vlabel.innerHTML = "Default Video Volume";
		vth.appendChild(vlabel);
		vtr.appendChild(vth);
		
		var vtd = document.createElement("td");
		var slider1 = document.createElement("input");
		slider1.type = "range";
		slider1.min = "0";
		slider1.max = "100";
		slider1.value = GM_getValue(defaultVideoVolume_, defaultVideoVolume) * 100;
		slider1.className = "slider";
		
		var vp1 = document.createElement("p");
		vp1.style = "display: inline-block;";
		vp1.innerHTML = "Volume: " + slider1.value + "%";
		slider1.oninput = function() { vp1.innerHTML = "Volume: " + slider1.value + "%"; GM_setValue(defaultVideoVolume_, slider1.value / 100);  }
		vtd.appendChild(slider1);
		vtd.appendChild(vp1);
		vtr.appendChild(vtd);
		vtbody.appendChild(vtr);
	}
	{
		var vtr = document.createElement("tr");
		var vth = document.createElement("th");
		var vlabel = document.createElement("label");
		vlabel.className = "block";
		vlabel.innerHTML = "Image/Video Height";
		vth.appendChild(vlabel);
		
		var vp = document.createElement("p");
		vp.innerHTML = "Viewport Dependent Height";
		vth.appendChild(vp);
		vtr.appendChild(vth);
		
		var vtd = document.createElement("td");
		var vinput = document.createElement("input");
		vinput.type = "checkbox";
		vinput.checked = GM_getValue(useViewportDependentSize_, useViewportDependentSize);
		vinput.addEventListener("change", function() { GM_setValue(useViewportDependentSize_, this.checked); });
    	
		var slider2 = document.createElement("input");
		slider2.type = "range";
		slider2.min = 0;
		slider2.max = 100;
		slider2.value = GM_getValue(viewportDependentHeight_, viewportDependentHeight);
		slider2.className = "slider";
			
		var vp2 = document.createElement("p");
		vp2.style = "display: inline-block;";
		vp2.innerHTML = slider2.value + "%";
		slider2.oninput = function() { vp2.innerHTML = slider2.value + "%"; GM_setValue(viewportDependentHeight_, slider2.value);  }
		
		vtd.appendChild(vinput);
		vtd.appendChild(slider2);
		vtd.appendChild(vp2);
		vtr.appendChild(vtd);
		vtbody.appendChild(vtr);
	}
	createCheckBox(stretchImgVid             , stretchImgVid_             , "Stretch Image/Video",         "This overrides 'True Video Size'" );
	createCheckBox(trueVideoSize             , trueVideoSize_             , "True Video Size",             "Resizes videos to their true size" );
	createCheckBox(enableFavOnEnter          , enableFavOnEnter_          , "Enable Fav On Enter",         "Use the ENTER key on your keyboard to add a post to your favorites" );
	createCheckBox(hideBlacklistedThumbnails , hideBlacklistedThumbnails_ , "Hide Blacklisted Thumbnails", "Hide blacklisted thumbnails on the front page." );
	createCheckBox(forceDarkTheme            , forceDarkTheme_            , "Force Dark Theme",            "Force rule34's dark theme on every page, even if light theme is set in the options" );
	createCheckBox(betterDarkTheme           , betterDarkTheme_           , "Better Dark Theme",           "Use a custom CSS dark theme with the rule34's dark theme (must enable 'Force Dark Theme')" );     
	createCheckBox(removeHentaiClickerGame   , removeHentaiClickerGame_   , "Remove Hentai Clicker Game",  "Remove the hentai clicker game AD" );
	createCheckBox(endlessScrolling          , endlessScrolling_          , "Endless Scrolling",           "When you get to the bottom of the current page it will automatically append the content from the next page on the current page" );
	createCheckBox(favFilter                 , favFilter_                 , "Favorites Filter",            "Adds a searchbox for tag(s) in favorites" );
	createCheckBox(showFavPosts              , showFavPosts_              , "Show Fav Posts",              "Shows you which posts are in your favorites while browsing" );
}

if (document.location.href.includes("index.php?page=favorites&s=view")) {
	
	// remove stupid <br>s on fav page wtf... why are they here
	var elements2 = document.getElementById("body").children;
	for (let i = 0; i < elements2.length; i++) { if (elements2[i].tagName === "BR") { elements2[i].remove(); } }
	
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
			if (favlist.includes(id)) { elements[i].style = favedPostStyle; }
		}
	}
	
	
	if (document.location.href.includes("index.php?page=favorites&s=view")) {
		
		// filtering in fav
		var elements = document.getElementsByClassName("thumb");
		for (let i = 0; i < elements.length; i++) {
			var id = elements[i].childNodes[0].id.replace('p', '');
			if (favlist.includes(id)) { elements[i].style = favedPostStyle; }
		}
		
		// stuff to update list
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
				await sleep(1000);
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
	function removeContent() {
		var elements = document.getElementsByClassName("thumb");
		while (elements[0]) { elements[0].remove(); }
	}
	
	var originalTitle = document.title;
	
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
		removeContent();

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
		input.addEventListener("keydown", function(event) { if (event.keyCode == 13) { event.preventDefault(); main_favFilter(); } });
		
		// filter/search button
		btn_filter = document.createElement("button");
		btn_filter.style = "display: inline-block;";
		btn_filter.id = "filterButton";
		btn_filter.title = "Start search"
		btn_filter.innerHTML = "Filter";
		btn_filter.onclick = function() { main_favFilter(); }
		
		// stop button
		var btn_stop = document.createElement("button");
		btn_stop.style = "display: inline-block;";
		btn_stop.title = "Stop search";
		btn_stop.innerHTML = "Stop";
		btn_stop.onclick = function() { shouldStop = true; }
		
		// help button
		var btn_help = document.createElement("button");
		btn_help.style = "display: inline-block;";
		btn_help.title = "Show help";
		btn_help.innerHTML = "Help";
		btn_help.onclick = function() {
			alert(
				"The slider sets the time between requests.\n" +
				"This is not an officially supported service.\n" +
				"If you make too many requests, you might get temporarily blocked.\n" +
				"The recommended time slider delay is 1000ms\n" +
				"If the search takes too long try decreasing the time between requests."
			);
		}
		
		// slider
		var slider = document.createElement("input");
		slider.type = "range";
		slider.min = "100";
		slider.max = "4000";
		slider.value = 1000;
		slider.className = "slider";
		slider.id = "delayRange";
		GM_addStyle(sliderCss);
		
		// slider speed label
		var txt_speed = document.createElement("p");
		txt_speed.style = "display: inline-block;";
		txt_speed.innerHTML = "Request Speed: " + slider.value + "ms";
		slider.oninput = function() { txt_speed.innerHTML = "Request Speed: " + slider.value + "ms"; }
		
		// current / max
		txt_curmax = document.createElement("p");
		txt_curmax.id = "curmax";
		txt_curmax.style = "margin: 0;";
		
		// url - status
		txt_status = document.createElement("p");
		txt_status.id = "status";
		txt_status.style = "margin: 0;";
		
		// loaded images count
		txt_imageCount = document.createElement("p");
		txt_imageCount.id = "imageCount"
		txt_imageCount.style = "margin: 0;";
		
		// clear images button
		var btn_clear = document.createElement("button");
		btn_clear.style = "display: inline-block;";
		btn_clear.title = "Hide all content";
		btn_clear.innerHTML = "Clear";
		btn_clear.onclick = function() {
			removeContent();
			imagesAdded = 0;
			document.title = originalTitle;
			txt_curmax.innerHTML = "";
			txt_status.innerHTML = "";
			txt_imageCount.innerHTML = "";
		}
		
		cont.appendChild(input);
		cont.appendChild(btn_filter);
		cont.appendChild(btn_stop);
		cont.appendChild(btn_clear);
		cont.appendChild(btn_help);
		cont.appendChild(slider);
		cont.appendChild(txt_speed);
		cont.appendChild(txt_curmax);
		cont.appendChild(txt_status);
		cont.appendChild(txt_imageCount);
	};
}

if (removeHentaiClickerGame) {
	var items = document.getElementsByTagName("a");
	for (i = items.length - 1; i >= 0; i--) {
		if (items[i].href.includes("clicker")) { items[i].remove(); }
	}
}

if (forceDarkTheme) {
	
	document.querySelectorAll('link[rel=stylesheet]').forEach(function(node) { if (node.href.includes("desktop.css")) { node.disabled = true; } });
	
	// append dark theme
	var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://rule34.xxx/css/desktop_bip.css?7';
    link.media = 'screen';
    head.appendChild(link);
	
	// nice
	if (betterDarkTheme) { GM_addStyle(betterDarkThemeCss) }
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
			case "comment": break;
			default: if (event.keyCode == 13) { favPost(); } break;
		}
	}
}

// post view (default vol, size the image/vid, add buttons)
if (document.location.href.includes("index.php?page=post&s=view")) {
	
	// set vars
	var postID = document.location.href.split("id=")[1];
	
	// add custom css
	GM_addStyle(postCss);
	
	// video settings
	var vid = document.querySelector("#gelcomVideoPlayer");
	if (vid) {
		vid.volume = defaultVideoVolume;
		if (autoplayVideos) { vid.autoplay = true; }
		
		if (!stretchImgVid && trueVideoSize) {
			let size = document.querySelector("#stats > ul:nth-child(2) > li:nth-child(3)").innerHTML.split(": ")[1];
			let wNh = size.split("x");
			let w = wNh[0];
			let h = wNh[1];
			vid.style = "width: " + w + "px; max-width: 100%; height: " + h + "px;";
		}
	}
	
	// buttons and stuff
	var navbar = document.getElementById("subnavbar");
	var cont = document.createElement("div");
	cont.id = "postbar";
	
	var btn_like = document.createElement("button");
	btn_like.className = "custom-button";
	btn_like.innerHTML = "👍like";
	btn_like.onclick = function() { post_vote(postID, 'up'); };
	cont.appendChild(btn_like);
	
	var btn_fav = document.createElement("button");
	btn_fav.className = "custom-button";
	btn_fav.innerHTML = "❤️fav";
	btn_fav.onclick = function() { favPost(postID); };
	cont.appendChild(btn_fav);
	
	var btn_close = document.createElement("button");
	btn_close.className = "custom-button";
	btn_close.innerHTML = "❌close";
	btn_close.onclick = function() { window.close(); };
	cont.appendChild(btn_close);
	
	var btn_favclose = document.createElement("button");
	btn_favclose.className = "custom-button";
	btn_favclose.innerHTML = "❤️+❌favclose";
	btn_favclose.onclick = function() { favPost(postID, true); };
	cont.appendChild(btn_favclose);
	
	var btn_prev = document.createElement("button");
	btn_prev.className = "custom-button";
	btn_prev.innerHTML = "⏮️prev";
	btn_prev.onclick = function() { document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)").click(); };
	cont.appendChild(btn_prev);
	
	var btn_next = document.createElement("button");
	btn_next.className = "custom-button";
	btn_next.innerHTML = "⏭️next";
	btn_next.onclick = function() { document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)").click(); };
	cont.appendChild(btn_next);
  
	navbar.appendChild(cont);
  
	// show if a post is in fav
	var favlist = GM_getValue("favlist", []);
	if (favlist.includes(postID)) {
		var div = document.createElement("div");
		div.id = "isinfav";
		div.title = "Post is in Favorites."
		div.innerHTML = "💟";
		navbar.appendChild(div);
	}
	
}
