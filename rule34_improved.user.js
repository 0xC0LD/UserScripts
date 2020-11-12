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


.button-remove {
	background-color: transparent;
	border: none;
	color: gray;
	cursor: pointer;
}

.button-remove:active {
    filter: none !important;
	color: black;
	background-color: gray;
	border-radius: 5px;
}
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
	background: linear-gradient(to bottom, hotpink, purple);
	padding: 3px;
	opacity: 0.4;
`;

var heartStyle = `
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	font-size: 30px;
	opacity: 0.8;
`

/// TODO:
//    - recode endless scrolling/favfilter use 'thumb' class instead of 'img' tag
//    - remove sleep() ... instead wait for the server to respond then continue
//    - custom checkbox css
//    - remove jQuery
//    - add fav button while browsing in thumb div

function favPost(id, close = false) {
	post_vote(id, 'up'); // like
	addFav(id); // add to fav
	// add to favlist (+close)
	var timer = setInterval(function() {
		console.log(1);
		var selectElement = document.getElementById("notice");
		if (selectElement.innerHTML == "Post added to favorites" || selectElement.innerHTML == "Post already in your favorites") {
			clearInterval(timer);
			if (showFavPosts) {
				let favlist = GM_getValue("favlist", []);
				let id = document.location.href.split("id=")[1];
				if (!favlist.includes(id)) { favlist.push(id); GM_setValue("favlist", favlist); }
			}
			if (close) { window.close(); }
		}
	}, 500);
}
function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
var originalTitle = document.title;
var isPage_post = document.location.href.includes("index.php?page=post&s=view");
var isPage_posts = document.location.href.includes("index.php?page=post&s=list");
var isPage_fav = document.location.href.includes("index.php?page=favorites&s=view");
var isPage_opt = document.location.href.includes("index.php?page=account&s=options");

$(window).on('load', async function() {
	
	if (hideBlacklistedThumbnails) {
		let elements = document.getElementsByClassName("thumb blacklisted-image");
		while (elements[0]) { elements[0].remove(); }
	}
});

if (removeHentaiClickerGame) {
	let items = document.getElementsByTagName("a");
	for (i = items.length - 1; i >= 0; i--) {
		if (items[i].href.includes("clicker")) { items[i].remove(); break; }
	}
}

if (forceDarkTheme) {
	// disable default css
	document.querySelectorAll('link[rel=stylesheet]').forEach(function(node) { if (node.href.includes("desktop.css")) { node.disabled = true; } });
	
	// append dark theme
	let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://rule34.xxx/css/desktop_bip.css?7';
    link.media = 'screen';
    head.appendChild(link);
	
	// append even better dark theme css
	if (betterDarkTheme) { GM_addStyle(betterDarkThemeCss) }
}

if (isPage_opt) {
	
	// if in options check dark theme
	if (forceDarkTheme) { Cookie.create('theme', 'dark'); }
	
	let vtbody = document.body.getElementsByTagName("tbody")[0];
	
	function createCheckBox(setv, setv_, name, desc) {
		let vtr = document.createElement("tr");
		let vth = document.createElement("th");
		vlabel = document.createElement("label");
		vlabel.className = "block";
		vlabel.innerHTML = name;
		vth.appendChild(vlabel);
		
		let vp = document.createElement("p");
		vp.innerHTML = desc;
		vth.appendChild(vp);
		vtr.appendChild(vth);
		
		let vtd = document.createElement("td");
		let vinput = document.createElement("input");
		vinput.type = "checkbox";
		vinput.checked = GM_getValue(setv_, setv);
		vinput.addEventListener("change", function() { GM_setValue(setv_, this.checked); });
		vtd.appendChild(vinput);
		vtr.appendChild(vtd);
		vtbody.appendChild(vtr);
	}
  	
	createCheckBox(autoplayVideos            , autoplayVideos_            , "AutoPlay",                    "Automatically play the video.");
	{
		let vtr = document.createElement("tr");
		let vth = document.createElement("th");
		let vlabel = document.createElement("label");
		vlabel.className = "block";
		vlabel.innerHTML = "Default Video Volume";
		vth.appendChild(vlabel);
		vtr.appendChild(vth);
		
		let vtd = document.createElement("td");
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = "0";
		slider.max = "100";
		slider.value = GM_getValue(defaultVideoVolume_, defaultVideoVolume) * 100;
		slider.className = "slider";
		
		let vp1 = document.createElement("p");
		vp1.style = "display: inline-block;";
		vp1.innerHTML = "Volume: " + slider.value + "%";
		slider.oninput = function() { vp1.innerHTML = "Volume: " + slider.value + "%"; GM_setValue(defaultVideoVolume_, slider.value / 100);  }
		vtd.appendChild(slider);
		vtd.appendChild(vp1);
		vtr.appendChild(vtd);
		vtbody.appendChild(vtr);
	}
	{
		let vtr = document.createElement("tr");
		let vth = document.createElement("th");
		let vlabel = document.createElement("label");
		vlabel.className = "block";
		vlabel.innerHTML = "Image/Video Height";
		vth.appendChild(vlabel);
		
		let vp = document.createElement("p");
		vp.innerHTML = "Viewport Dependent Height";
		vth.appendChild(vp);
		vtr.appendChild(vth);
		
		let vtd = document.createElement("td");
		let vinput = document.createElement("input");
		vinput.type = "checkbox";
		vinput.checked = GM_getValue(useViewportDependentSize_, useViewportDependentSize);
		vinput.addEventListener("change", function() { GM_setValue(useViewportDependentSize_, this.checked); });
    	
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = 0;
		slider.max = 100;
		slider.value = GM_getValue(viewportDependentHeight_, viewportDependentHeight);
		slider.className = "slider";
			
		let vp2 = document.createElement("p");
		vp2.style = "display: inline-block;";
		vp2.innerHTML = slider.value + "%";
		slider.oninput = function() { vp2.innerHTML = slider.value + "%"; GM_setValue(viewportDependentHeight_, slider.value);  }
		
		vtd.appendChild(vinput);
		vtd.appendChild(slider);
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

if (isPage_fav) {
	
	// remove stupid <br>s on fav page wtf... why are they here
	let bodyc = document.getElementById("body").children;
	for (let i = 0; i < bodyc.length; i++) { if (bodyc[i].tagName === "BR") { bodyc[i].remove(); } }
	
	// container for all the controls in favorites
	let cont = document.createElement("div");
	cont.id = "favcontrols";
	cont.style = "margin: 2px 5px 10px 5px;"
	document.getElementById("header").parentNode.insertBefore(cont, document.getElementById("header").nextSibling);
	
	if (favFilter) {
		function removeContent() {
			let elements = document.getElementsByClassName("thumb");
			while (elements[0]) { elements[0].remove(); }
		}

		let imagesAdded = 0;
		let shouldStop = false;

		// start search
		let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
		let reg = /pid=([0-9]*)/gm;

		let cont = document.getElementById("favcontrols");

		// textbox for tags
		let input = document.createElement("input");
		input.style = "width: 20%; display: inline-block;";
		input.type = "text";
		input.addEventListener("keydown", function(event) { if (event.keyCode == 13) { event.preventDefault(); main_favFilter(); } });

		// filter/search button
		let btn_filter = document.createElement("button");
		btn_filter.style = "display: inline-block;";
		btn_filter.id = "filterButton";
		btn_filter.title = "Start search"
		btn_filter.innerHTML = "Filter";
		btn_filter.onclick = function() { main_favFilter(); }

		// stop button
		let btn_stop = document.createElement("button");
		btn_stop.style = "display: inline-block;";
		btn_stop.title = "Stop search";
		btn_stop.innerHTML = "Stop";
		btn_stop.onclick = function() { shouldStop = true; }

		// help button
		let btn_help = document.createElement("button");
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
		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = "100";
		slider.max = "4000";
		slider.value = 1000;
		slider.className = "slider";
		slider.id = "delayRange";

		// slider speed label
		let txt_speed = document.createElement("p");
		txt_speed.style = "display: inline-block;";
		txt_speed.innerHTML = "Request Speed: " + slider.value + "ms";
		slider.oninput = function() { txt_speed.innerHTML = "Request Speed: " + slider.value + "ms"; }

		// current / max
		let txt_curmax = document.createElement("p");
		txt_curmax.id = "curmax";
		txt_curmax.style = "margin: 0;";

		// url - status
		let txt_status = document.createElement("p");
		txt_status.id = "status";
		txt_status.style = "margin: 0;";

		// loaded images count
		let txt_imageCount = document.createElement("p");
		txt_imageCount.id = "imageCount"
		txt_imageCount.style = "margin: 0;";

		// clear images button
		let btn_clear = document.createElement("button");
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

		async function main_favFilter() {
			// vars
			let step = 50;
			let el = document.getElementsByName("lastpage")[0];
			let maxMatch = reg.exec(el.attributes[1].nodeValue);
			let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
			let curMatch = reg.exec(document.location);
			let cur = curMatch == null ? 0 : parseInt(curMatch[1]);

			// remove all spans
			removeContent();

			// start search
			for (; cur <= max; cur += step) {
				let url = base + "&pid=" + cur;
				txt_curmax.innerHTML = url  + " -- " + cur + "/" + max + " (" + ((cur/step)+1) + "/" + ((max/step)+1) + ")";
				getImagesFromUrl(url, input.value.split(" "));
				await sleep(slider.value);
				if (shouldStop) { shouldStop = false; return; }
			}
		};

		// load images from url
		function getImagesFromUrl(url, match) {
			let ifr = document.createElement("iframe");
			ifr.style = "display: none";
			ifr.src = url;
			ifr.onload = function() {
				let toAdd = [];
				let images = ifr.contentWindow.document.getElementsByTagName("img");
				//console.log(images);
				for (i = images.length - 1; i >= 0; i--) {
					let addImage = true;
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
	}
}

if (showFavPosts) {
	
	let favlist = GM_getValue("favlist", []);
	
	// filtering
	if (isPage_posts) {
		let elements = document.getElementsByClassName("thumb");
		for (let i = 0; i < elements.length; i++) {
			let id = elements[i].id.replace('s', '');
			if (favlist.includes(id)) {
				let heart = document.createElement("div");
				heart.style = heartStyle;
				heart.innerHTML = "❤️";
				elements[i].childNodes[0].style = "position: relative; width: auto; height: auto;"
				elements[i].childNodes[0].appendChild(heart);
				elements[i].childNodes[0].childNodes[0].style = favedPostStyle;
			}
		}
	}
	
	if (isPage_fav) {
		
		// show fav posts
		let elements = document.getElementsByClassName("thumb");
		for (let i = 0; i < elements.length; i++) {
			let id = elements[i].childNodes[0].id.replace('p', '');
			if (favlist.includes(id)) {
				let heart = document.createElement("div");
				heart.style = heartStyle;
				heart.innerHTML = "❤️";
				elements[i].childNodes[0].style = "position: relative; width: auto; height: auto;"
				elements[i].childNodes[0].appendChild(heart);
				elements[i].childNodes[0].childNodes[0].style = favedPostStyle;
			}
		}
		
		for (let i = 0; i < elements.length; i++) {
			let id = elements[i].childNodes[0].id.replace('p', '');
			let rm = elements[i].childNodes[2].remove();
			
			let btn = document.createElement("button");
			btn.className = "button-remove";
			btn.title = "remove: " + id;
			btn.innerHTML = "❌REMOVE❌";
			btn.onclick = function() {
				let favlist = GM_getValue("favlist", []);
				GM_setValue("favlist", favlist.filter(e => e !== id));
				document.location = 'index.php?page=favorites&s=delete&id=' + id;
			};
			elements[i].appendChild(btn);
		}
		
		// stuff to update list
		let shouldStop = false;
		let status;
		let btn_stopUpdate = document.createElement("button");
		btn_stopUpdate.style = "display: block;";
		btn_stopUpdate.title = "Stop the update";
		btn_stopUpdate.innerHTML = "Stop";
		btn_stopUpdate.onclick = function() { shouldStop = true; };
		// status
		status = document.createElement("div");
		status.id = "favlistStatus";
		status.style = "display: block;";
		status.title = "processed\nfavlist count\nadded";
		// update button
		let btn_updatefav = document.createElement("button");
		btn_updatefav.style = "display: block;";
		btn_updatefav.title = "Updates favorites list (" + favlist.length + " ID(s))";
		btn_updatefav.innerHTML = "Update";
		async function getIds() {
			let reg = /pid=([0-9]*)/gm;
			let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
			if (!base.includes("favorites")) { return console.log("not a favorites page"); };
	
			// vars
			let step = 50;
			let el = document.getElementsByName("lastpage")[0];
			let maxMatch = reg.exec(el.attributes[1].nodeValue);
			let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
			let curMatch = reg.exec(document.location);
			let cur = curMatch == null ? 0 : parseInt(curMatch[1]);
			
			let c = 0;
			let added = 0;
			
			// start search
			for (; cur <= max; cur += step) {
				let url = base + "&pid=" + cur;
				let ifr = document.createElement("iframe");
				ifr.style = "display: none";
				ifr.src = url;
				ifr.onload = function() {
					let elements = ifr.contentWindow.document.getElementsByClassName("thumb");
					for (let i = 0; i < elements.length; i++) {
						let id = elements[i].childNodes[0].id.replace('p', '');
						if (!favlist.includes(id)) { favlist.push(id); added++; }
						c++;
						status.innerHTML = c + "<br>" + favlist.length + "<br>" + added;
					}
					ifr.parentNode.removeChild(ifr);
				}
				document.body.appendChild(ifr);
				
				await sleep(1000);
				GM_setValue("favlist", favlist);
				
				if (shouldStop) { shouldStop = false; return; }
			}
		}
		btn_updatefav.onclick = function() { getIds(); };
		// container for controls
		let favlistCont = document.createElement("div");
		favlistCont.style = "position: fixed; top: 30px; right: 5px;";
		favlistCont.appendChild(btn_updatefav);
		favlistCont.appendChild(btn_stopUpdate);
		favlistCont.appendChild(status);
		document.body.appendChild(favlistCont);
	}
}

if (isPage_posts || isPage_fav) {
	
	let cb = document.createElement('input');
	cb.type = "checkbox";
	cb.id = "endlessScrolling_cb";
	cb.style = "display: block; cursor: pointer; float: right;";
	cb.checked = endlessScrolling;
	cb.title = "Enable endless scrolling"
	cb.addEventListener('change', (event) => { GM_setValue("endlessScrolling", event.target.checked); });
	
	let p = document.createElement("p");
	p.id = "endlessScrolling_p";
	p.style = "display: block; float: left;";
	p.innerHTML = "";
	
	let div = document.createElement("div");
	div.id = "endlessScrolling_cont";
	div.style = "position: fixed; top: 5px; right: 5px;";
	div.append(cb);
	div.append(p);
	
	document.body.appendChild(div);
	
	$.fn.isInViewport = function() {
		let elementTop = $(this).offset().top;
		let elementBottom = elementTop + $(this).outerHeight();
		let viewportTop = $(window).scrollTop();
		let viewportBottom = viewportTop + $(window).height();
		return elementBottom > viewportTop && elementTop < viewportBottom;
	};
	
	let reachedTheEnd = false;
	async function main_scroll() {
		let reg = /pid=([0-9]*)/gm;
		let add = document.location.href;
		let base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
		let step = base.includes("favorites") ? 50 : 42;
		let el;
		let text;
		switch (step) {
			case 42: {
				el = document.getElementsByTagName("a")[document.getElementsByTagName("a").length - 2];
				text = el.href;
				break;
			}
			case 50: {
				let els = document.getElementsByName("lastpage");
				if (els.length == 0) { return; }
				el = els[0];
				text = el.attributes[1].nodeValue;
				break;
			}
			default: return;
		}
		
		let maxMatch = reg.exec(text);
		let max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
		let curMatch = /pid=([0-9]*)/gm.exec(add);
		let cur = curMatch == null ? 0 : parseInt(curMatch[1]);

		let loadNext = true;
		$(window).on('DOMContentLoaded load resize scroll', async function() {
			if (reachedTheEnd) { return; }
			if (!cb.checked) { return; }
		  	
			if ($('#paginator').isInViewport() && loadNext) {
				loadNext = false;
				cur += step;
				
				let url = base + "&pid=" + cur;
				let ifr = document.createElement("iframe");
				ifr.style = "display: none;";
				ifr.src = url;
				ifr.onload = function() {
					document.title = originalTitle;
					var elements = Array.prototype.slice.call(ifr.contentWindow.document.getElementsByClassName("thumb"), 0);
					if (elements.length == 0) { reachedTheEnd = true; return; }
					for (let i = 0; i < elements.length; i++) {
						let p = document.getElementById("paginator");
						p.parentNode.insertBefore(elements[i], p);
					}
					ifr.parentNode.removeChild(ifr);
					p.innerHTML = cur + " (" + ((cur+step)/step) + ")";
				}

				document.title = "Loading...";
				document.body.appendChild(ifr);
				
				await sleep(1000);
				loadNext = true;
			}
		});
	};
	
	$(document).ready(function() { main_scroll(); });
}

// post view (default vol, size the image/vid, add buttons)
if (isPage_post) {
	
	if (enableFavOnEnter) {
		document.onkeydown = function(e) {
			let postID = document.location.href.split("id=")[1];

			var event = document.all ? window.event : e;
			switch (e.target.tagName.toLowerCase()) {
				case "input":
				case "textarea":
				case "select":
				case "button":
				case "tags":
				case "comment": break;
				default: if (event.keyCode == 13) { favPost(postID); } break;
			}
		}
	}
	
	// set vars
	let postID = document.location.href.split("id=")[1];
	
	// add custom css
	GM_addStyle(postCss);
	
	// video settings
	let vid = document.querySelector("#gelcomVideoPlayer");
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
	let navbar = document.getElementById("subnavbar");
	let cont = document.createElement("div");
	cont.id = "postbar";
	
	let btn_like = document.createElement("button");
	btn_like.className = "custom-button";
	btn_like.innerHTML = "👍like";
	btn_like.onclick = function() { post_vote(postID, 'up'); };
	cont.appendChild(btn_like);
	
	let btn_fav = document.createElement("button");
	btn_fav.className = "custom-button";
	btn_fav.innerHTML = "❤️fav";
	btn_fav.onclick = function() { favPost(postID); };
	cont.appendChild(btn_fav);
	
	let btn_close = document.createElement("button");
	btn_close.className = "custom-button";
	btn_close.innerHTML = "❌close";
	btn_close.onclick = function() { window.close(); };
	cont.appendChild(btn_close);
	
	let btn_favclose = document.createElement("button");
	btn_favclose.className = "custom-button";
	btn_favclose.innerHTML = "❤️+❌favclose";
	btn_favclose.onclick = function() { favPost(postID, true); };
	cont.appendChild(btn_favclose);
	
	let btn_prev = document.createElement("button");
	btn_prev.className = "custom-button";
	btn_prev.innerHTML = "⏮️prev";
	btn_prev.onclick = function() { document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)").click(); };
	cont.appendChild(btn_prev);
	
	let btn_next = document.createElement("button");
	btn_next.className = "custom-button";
	btn_next.innerHTML = "⏭️next";
	btn_next.onclick = function() { document.querySelector(".sidebar > div:nth-child(12) > ul:nth-child(2) > li:nth-child(2) > a:nth-child(1)").click(); };
	cont.appendChild(btn_next);
  
	navbar.appendChild(cont);
  
	// show if a post is in fav
	if (showFavPosts) {
		let favlist = GM_getValue("favlist", []);
		if (favlist.includes(postID)) {
			let div = document.createElement("div");
			div.id = "isinfav";
			div.title = "Post is in Favorites."
			div.innerHTML = "💟";
			navbar.appendChild(div);
		}
	}
}
