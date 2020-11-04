// ==UserScript==
// @name         Rule34.xxx Improved
// @namespace    UserScript
// @version      3.1
// @description  A lot of improvements for rule34.xxx
// @author       Hentiedup, 0xC0LD, usnkw
// @match        https://rule34.xxx/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_addStyle
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
var endlessScrolling          = true;  // (true/false) Enable endless scrolling - when you get to the bottom of the current page it will automatically append the content from the next page on the current page
var endlessScrollingInFav     = true;  // (true/false) Enables endless scrolling in favorites, must enable endlessScrolling first, must disable when searching through favorites with favFilter, otherwise content will conflict
var favFilter                 = true;  // (true/false) Adds a tag searchbox in favorites
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
//		- opt betterDarkTheme
//		- opt removeHentaiClickerGame
//		- opt endlessScrollingInFav
//	* usnkw
//		- opt endlessScrolling
//		- opt favFilter


var customCSS = `
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
.awesomplete .visually-hidden { position: absolute; clip: rect(0,0,0,0) }
.awesomplete { display: inline-block; position: relative }
.awesomplete>input { display: block }
.awesomplete>ul {
    position:absolute;
    left:0;
    right:0;
    z-index:1;
    min-width:100%;
    box-sizing: border-box;
    list-style: none;
    padding:0;
    margin:0;
    background: black;
}
.awesomplete>ul:empty { display:none }
.awesomplete>ul {
    margin: 0;
    color: hotpink;
    background: linear-gradient(to top left, #002404, black);
    border-color: lime;
    border-width: 1px;
    text-shadow:none
}
@supports(transform:scale(0)) {
    .awesomplete>ul { transition:.3s cubic-bezier(.95,.05,.8,.04); transform-origin:1.43em -.43em; }
    .awesomplete>ul[hidden],
    .awesomplete>ul:empty { opacity:0; transform:scale(0); display:block; ransition-timing-function:ease; }
}
.awesomplete>ul:before { display: none }
.awesomplete>ul>li                       { color: hotpink; position:relative; padding:.2em .5em; cursor:pointer }
.awesomplete>ul>li:hover                 { color: hotpink; background: indigo; }
.awesomplete>ul>li[aria-selected=true]   { color: hotpink; background: indigo; border-style: solid; border-color: lime; border-width: 1px; }
.awesomplete mark                        { color: lime; background: transparent; }
.awesomplete li:hover mark               { color: lime; background: transparent; }
.awesomplete li[aria-selected=true] mark { color: lime; background: transparent; }
`;

function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }

var originalTitle = document.title;

if (hideBlacklistedThumbnails) {
    $(window).on('DOMContentLoaded load', async function() {
        var elements = document.getElementsByClassName("thumb blacklisted-image");
        //var i = 0;
        while (elements[0]) { /* i++; */ elements[0].parentNode.removeChild(elements[0]); }
        //if (i > 0) { console.log("removed content: " + i); }
    });
}

if (endlessScrolling && (document.location.href.includes("s=list") || (endlessScrollingInFav && document.location.href.includes("index.php?page=favorites&s=view")))) {
    // scroll checkbox
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "scroll_cb";
    checkbox.id = "endlessScroll_cb";
    checkbox.style = "position: fixed; display: block; top: 5px; right: 5px; bottom: 0; z-index: 2; cursor: pointer;";
    checkbox.checked = endlessScrolling;
    checkbox.title = "Enable endless scrolling"
    // append checkbox to bar
    //document.getElementById("subnavbar").append(checkbox);
  
    var infoScroll = document.createElement("p");
    infoScroll.id = "curpage";
    infoScroll.style = "position: fixed; display: block; top: 30px; right: 5px; bottom: 0; z-index: 2; cursor: pointer;";
    infoScroll.innerHTML = "";
    
    var div = document.createElement("div");
    div.style = "position: fixed; display: block; width: auto; height: auto; top: 5px; right: 10px; bottom: 0; z-index: 2";
    div.append(checkbox);
    div.append(infoScroll);
  
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
            if (!checkbox.checked) { return; }
          
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
            //console.log("images: " + g + "/" + t + " (-" + (t - g) + ")");
            ifr.parentNode.removeChild(ifr);
            document.title = originalTitle;
          
            if (t == 0) { reachedTheEnd = true; return; } // no images added, this is the end
            infoScroll.innerHTML = cur + " (" + ((cur+step)/step) + ")";
        }
        
        document.title = "Loading...";
        document.body.appendChild(ifr);
    }

    $(document).ready(function() { main_scroll(); });
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
            txt_curmax.innerHTML = cur + "/" + max + " (" + cur / step + "/" + max / step + ")";
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
        btn_filter = document.getElementById("filterButton");
        txt_curmax = document.getElementById("curmax");
        txt_status = document.getElementById("status");
        txt_imageCount = document.getElementById("imageCount");
    };
}

if (removeHentaiClickerGame) {
    //$(".content > div:nth-child(10)").remove(); // unsafe version of the same thing
    var items = document.getElementsByTagName("a");
    for (i = items.length - 1; i >= 0; i--) {
        if (items[i].href.includes("clicker")) {
            //console.log("removed: ")
            //console.log(items[i])
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
    if (betterDarkTheme) { GM_addStyle(customCSS) }
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
                if (event.keyCode == 13) $("#stats + div > ul > li > a:contains('Add to favorites')").click();
                break;
        }
    }
}

if (document.location.href.includes("view")) {
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
            button.custom-button {
                background-color: transparent;
                cursor: pointer;
                width: auto;
                padding: 3px;
                margin: 0;
                border-radius: 20px;
            }
            .custom-button:hover  { background-color: rgba(255,255,255,.2); }
            .custom-button:active { background-color: rgba(255,255,255,1);  }
            ` + viewPDepenCSS + ``);
    
        $("#gelcomVideoPlayer").prop("volume", defaultVideoVolume);
        if (autoplayVideos) { $("#gelcomVideoPlayer").prop("autoplay", true); }
        
        if (!stretchImgVid && trueVideoSize) {
            $("#gelcomVideoContainer").prop("style", "width: " + ($("#stats > ul > li:contains('Size: ')").text().split(": ")[1].split("x")[0]) + 
                                            "px; max-width: 100%; height: " + ($("#stats > ul > li:contains('Size: ')").text().split("x")[1]) + "px;");
        }
        
        $("#subnavbar").append('<div id="postbar" style="margin: 0; padding 30px; border: solid 1px var(--c-link-soft); display: inline-block; width: auto; background-color: var(--c-bg-highlight);">');
        
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
        $("#btn-like")    .click(function() { $("#stats > ul > li:contains('(vote up)') > a:contains('up')")        .click(); });
        $("#btn-fav")     .click(function() { $("#stats + div > ul > li > a:contains('Add to favorites')")          .click(); });
        $("#btn-close")   .click(function() { window.close();                                                                 });
        $("#btn-favclose").click(function() {
            $("#stats + div > ul > li > a:contains('Add to favorites')").click();
            setInterval(function(){
                var selectElement = document.getElementById("notice");
                if (selectElement.innerHTML == "Post added to favorites" || selectElement.innerHTML == "Post already in your favorites") {
                  window.close();
                }
            }, 500);
        });
        $("#btn-prev")    .click(function() { $("#stats + div + div + div + div > ul > li > a:contains('Previous')").click(); });
        $("#btn-next")    .click(function() { $("#stats + div + div + div + div > ul > li > a:contains('Next')")    .click(); });
    
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
}
