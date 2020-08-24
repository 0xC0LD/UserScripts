// ==UserScript==
// @name         Rule34.xxx Improved
// @namespace    UserScript
// @version      3.1
// @description  A lot of improvements for rule34.xxx
// @author       Hentiedup, 0xC0LD, usnkw
// @match        https://rule34.xxx/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @icon         data:image/ico;base64,AAABAAEAEBAAAAEAIABeAQAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAQAAAAEAgGAAAAH/P/YQAAAAlwSFlzAAALEwAACxMBAJqcGAAAARBJREFUOMudkjFOw0AQRd86mxugNCTyRaxIkZyCii5FOm5gi3NY5gacgcqFKX0R5NBE3CDgT7XW2llsYCTLO//P35n9u0aSedq8dvwjsjaNrBNnbdoTxhgAynUdEvU8m7qLfNB9kgDIT/srsR/d4pPI7zgzbrDO+kkRV38Su3OqXNfyAxDQ4y4v4mqQA7Jj4wAkYYwhP+3JUO+JzzuNnTv7eHS3+cCDrE3JTdgDH3t8uwub6F/d1K2MGxRxhZ0ShSZydY6z7sWNH00RV7y8Pw+w+9uHa65c19pFR300XwJ0bi4CtLWHfj2FRW73m2TBubmwSpZs7QGAVbKcx9wEv+kWwpBkdtGxL3B/f/0TJsl8A8Ga1pJm8pdUAAAAAElFTkSuQmCC
// ==/UserScript==

// ===[ Settings ]===
var autoplayVideos = false;           // (true/false) Automatically play the video
var defaultVideoVolume = 1;           // (0-1)        0 = mute, 0.5=50%, 1=100%, etc.
var useViewportDependentSize = true;  // (true/false) Makes the max-height of all images and videos X% of the viewport (inner window of the browser) width/height.  
var viewportDependentHeight = 70;     // (1-100)      the size used by above. (in %)
var stretchImgVid = true;             // (true/false) Makes image and video height follow the viewportDependentHeight regardless of true size. i.e. will stretch if needed.
var trueVideoSize = false;            // (true/false) Resizes videos to their true size (unless overriden by stretchImgVid)
var enableFavOnEnter = true;          // (true/false) Use the "ENTER" key on your keyboard to add a post to your favorites
var hideBlacklistedThumbnails = true; // (true/false) Hide blacklisted thumbnails on the front page (https://rule34.xxx/index.php?page=post&s=list&tags=all)
var forceDarkTheme = true;            // (true/false) Force rule34's dark theme on every page, even if light theme is set in options
var endlessScrolling = true;          // (true/false) endless scrolling
var endlessScrollingInFav = false;    // (true/false) (must enable endlessScrolling first) enables endless scrolling in favorites (must disable when searching through favorites with favFilter, otherwise content will conflict)
var favFilter = true;                 // (true/false) adds a tag searchbox in favorites
// - Don't touch anything else unless you know what you're doing

// credits:
// 	* Hentiedup
//		- original author
//		- opt autoplayVideos
//		- opt defaultVideoVolume
//		- opt useViewportDependentHeight
//		- opt viewportDependentHeight
//		- opt stretchImgVid
//		- opt trueVideoSize
//	* 0xC0LD
//		- code cleanup
//		- comments
//		- opt enableFavOnEnter
//		- opt hideBlacklistedThumbnails
//		- opt forceDarkTheme
//		- opt endlessScrollingInFav
//	* usnkw
//		- opt endlessScrolling
//		- opt favFilter

function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }

var originalTitle = document.title;

if (hideBlacklistedThumbnails) {
    $(window).on('DOMContentLoaded load', async function() {
        var elements = document.getElementsByClassName("thumb blacklisted-image");
        var i = 0;
        while (elements[0]) { i++; elements[0].parentNode.removeChild(elements[0]); }
        if (i > 0) { console.log("removed content: " + i); }
    });
}

if (endlessScrolling) {
    $.fn.isInViewport = function() {
        var elementTop = $(this).offset().top;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    async function main_scroll() {
        var reg = /pid=([0-9]*)/gm;
        var add = document.location.href;
        if (!add.includes("s=list") && !(endlessScrollingInFav && add.includes("index.php?page=favorites&s=view"))) { return; }

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
            //if(cur >= max){return;}
            if ($('#paginator').isInViewport() && loadNext) {
                loadNext = false;
                cur += step;
                console.log("loading: " + cur);
                getImagesFromUrl(base + "&pid=" + cur);
                await sleep(1000);
                loadNext = true;
            }
        });
    };

    function getImagesFromUrl(url) {
        var ifr = document.createElement("iframe");
        ifr.style = "display:none; width:0; height:0; border:0; border:none";
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
            console.log("images: " + g + "/" + t + " (-" + (t - g) + ")");
            ifr.parentNode.removeChild(ifr);
            document.title = originalTitle;
        }
        document.title = "Loading...";
        document.body.appendChild(ifr);
    }

    $(document).ready(function() {
        main_scroll();
    });
}

// TODO: check order
// TODO: clean up the code (var names, etc.)
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
          	txt_curmax.innerHTML = cur + "/" + max + " (" + cur/step + "/" + max/step + ")";
            getImagesFromUrl(base + "&pid=" + cur, input.value.split(" "));
            await sleep(slider.value);
          	if (shouldStop) { shouldStop = false; return; }
        }
    };

  	// load images from url
    function getImagesFromUrl(url, match) {
        var ifr = document.createElement("iframe");
        ifr.style = "display:none; width:0; height:0; border:0; border:none";
        ifr.src = url;
        ifr.onload = function() {
            var toAdd = [];
            var images = ifr.contentWindow.document.getElementsByTagName("img");
            console.log(images);
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
            txt_status.innerHTML = url + " -- Done!";
        }
        document.title = "[" + imagesAdded + "] Loading...";
        txt_status.innerHTML = url + " -- Loading...";
        document.body.appendChild(ifr);
    }

    var base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
    if (base.includes("favorites")) {

        // textbox for tags
        input = document.createElement("input");
        input.style = "width: 20%";
        input.type = "text";
        input.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                main_favFilter();
            }
        });

        // filter/search button
        var btn1 = document.createElement("button");
        btn1.id = "filterButton";
        btn1.title = "Start search"
        btn1.innerHTML = "Filter";
        btn1.onclick = function() { main_favFilter(); }
        
        // stop button
        var btn2 = document.createElement("button");
        btn2.title = "Stop search";
        btn2.innerHTML = "Stop";
        btn2.onclick = function() { shouldStop = true; }
        
        // clear images button
        var btn3 = document.createElement("button");
        btn3.title = "Clear search history";
        btn3.innerHTML = "Clear";
        btn3.onclick = function() {
            var elements = document.getElementsByTagName("span");
            while (elements[0]) { elements[0].parentNode.removeChild(elements[0]); }
            var elements2 = document.getElementsByTagName("br");
            while (elements2[0]) { elements2[0].parentNode.removeChild(elements2[0]); }
            imagesAdded = 0;
            document.title = originalTitle;
        }
        
        // help button
        var btn4 = document.createElement("button");
        btn4.title = "Show help";
        btn4.innerHTML = "Help";
        btn4.onclick = function() {
        	alert(
                  "[TEXTBOX] - put tags you want to search for, in your favorites\n"
             	+ "[Filter] - find posts with tags specified in the textbox\n"
            	+ "[Stop] - stop searching\n"
            	+ "[Clear] - clear images that are displayed (it doesn't remove them from favorites)\n"
            	+ "[Help] - display this msg\n"
            	+ "* The slider sets the time between requests.\n"
                + "* This is not an officially supported service.\n"
                + "* If you make too many requests, you might get temporarily blocked.\n"
                + "* The recommended time slider delay is 1000ms\n"
                + "* If the search takes too long try decreasing the time between requests."
          );
        }
        
        // slider for speed
        var slider = document.createElement("input");
        slider.type = "range";
        slider.title = "Delay slider";
        slider.min = "100";
        slider.max = "4000";
        slider.value = 1000;

        // slider speed label
        var p1 = document.createElement("p");
        p1.style = "margin: 0px";
        p1.innerHTML = "Request Speed: " + slider.value + "ms";
        slider.oninput = function() { p1.innerHTML = "Request Speed: " + slider.value + "ms"; }
        
        // current / max
        var p2 = document.createElement("p");
        p2.id = "curmax";
        p2.style = "margin: 0px";

        // url - status
        var p3 = document.createElement("p");
        p3.id = "status";
        p3.style = "margin: 0px";

        // loaded images count
        var p4 = document.createElement("p");
        p4.id = "imageCount"
        p4.style = "margin: 0px";

        // container for all the controls
        var cont = document.createElement("div");
        cont.style.margin = "1em";
        cont.appendChild(input);
        cont.appendChild(btn1);
      	cont.appendChild(btn2);
      	cont.appendChild(btn3);
      	cont.appendChild(btn4);
        cont.appendChild(slider);
        cont.appendChild(p1);
        cont.appendChild(p2);
        cont.appendChild(p3);
      	cont.appendChild(p4);

        // insert controls
        document.getElementsByTagName("span")[0].parentNode.insertBefore(cont, document.getElementsByTagName("span")[0]);
        
        // set element*
      	btn_filter     = document.getElementById("filterButton");
      	txt_curmax     = document.getElementById("curmax");
      	txt_status     = document.getElementById("status");
      	txt_imageCount = document.getElementById("imageCount");
    };
}

if (forceDarkTheme) { $('head').append('<link rel="stylesheet" type="text/css" media="screen" href="https://rule34.xxx/css/desktop_bip.css" title="default"/>'); }

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
                if (event.keyCode == 13) $("#stats + div > ul > li > a:contains('Add to favorites')").click();
                break;
        }
    }
}

(function() {
    'use strict';

    var viewPDepenCSS = "";
    if (useViewportDependentSize) {
        viewPDepenCSS = (stretchImgVid ? `
        #gelcomVideoContainer {
            width: auto !important;
            max-width: 100% !important;
            height: ` + viewportDependentHeight + `vh !important;
        }
        ` : "") + `
        #image {
            width: auto !important;
            max-width: 100% !important;
            ` + (stretchImgVid ? "" : "max-") + `height: ` + viewportDependentHeight + `vh !important;
        }
        `;
    }

    addGlobalStyle(`
        #content > #post-view > #right-col > div > img.custom-button {
            cursor: pointer;
            width: 50px;
            padding: 3px;
            margin: 0;
            border-radius: 20px;
        }
        .custom-button:hover  { background-color: rgba(255,255,255,.2); }
        .custom-button:active { background-color: rgba(255,255,255,1);  }
        ` + viewPDepenCSS + ``);

    $("#gelcomVideoPlayer").prop("volume", defaultVideoVolume);
    if (autoplayVideos) {
        $("#gelcomVideoPlayer").prop("autoplay", true);
    }

    if (!stretchImgVid && trueVideoSize) {
        $("#gelcomVideoContainer").prop("style", "width: " + ($("#stats > ul > li:contains('Size: ')").text().split(": ")[1].split("x")[0]) + "px; max-width: 100%; height: " + ($("#stats > ul > li:contains('Size: ')").text().split("x")[1]) + "px;");
    }

    // buttons
    $("#edit_form").prev().before(
        '<img id="btn-like" class="custom-button" alt="like"     src="https://i.imgur.com/TOQLRok.png">' +
        '<img id="btn-fav"  class="custom-button" alt="favorite" src="https://i.imgur.com/dTpBrIj.png">' +
        '<img id="btn-prev" class="custom-button" alt="previous" src="https://i.imgur.com/Qh5DWPR.png">' +
        '<img id="btn-next" class="custom-button" alt="next"     src="https://i.imgur.com/v6rmImf.png">'
    );

    // button click events
    $("#btn-like").click(function() { $("#stats > ul > li:contains('(vote up)') > a:contains('up')")        .click(); });
    $("#btn-fav") .click(function() { $("#stats + div > ul > li > a:contains('Add to favorites')")          .click(); });
    $("#btn-prev").click(function() { $("#stats + div + div + div + div > ul > li > a:contains('Previous')").click(); });
    $("#btn-next").click(function() { $("#stats + div + div + div + div > ul > li > a:contains('Next')")    .click(); });

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();
