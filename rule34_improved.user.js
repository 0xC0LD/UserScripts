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
var autoplayVideos            = false; // (true/false) Automatically play the video
var defaultVideoVolume        = 1;     // (0-1) 0 = mute, 0.5=50%, 1=100%, etc.
var useViewportDependentSize  = true;  // (true/false) Makes the max-height of all images and videos X% of the viewport (inner window of the browser) width/height.  
var viewportDependentHeight   = 70;    // (1-100)      the size used by above. (in %)
var stretchImgVid             = true;  // (true/false) Makes image and video height follow the viewportDependentHeight regardless of true size. i.e. will stretch if needed.
var trueVideoSize             = false; // (true/false) Resizes videos to their true size (unless overriden by stretchImgVid)
var enableFavOnEnter          = true;  // (true/false) Use the "ENTER" key on your keyboard to add a post to your favorites
var hideBlacklistedThumbnails = true;  // (true/false) Hide blacklisted thumbnails on the front page (https://rule34.xxx/index.php?page=post&s=list&tags=all)
var forceDarkTheme            = true;  // (true/false) Force rule34's dark theme on every page, even if light theme is set in options
var endlessScrolling          = true;  // (true/false) endless scrolling
var endlessScrollingInFav     = false; // (true/false) (must enable endlessScrolling first) enable endless scrolling in favorites (must disable when searching through favorites with favFilter, otherwise content will conflict)
var favFilter                 = true;  // (true/false) adds a tag searchbox in favorites
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

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

if (hideBlacklistedThumbnails) {
    $(window).on('DOMContentLoaded load', async function() {
        var elements = document.getElementsByClassName("thumb blacklisted-image");
        var i = 0;
        while (elements[0]) {
            i++;
            elements[0].parentNode.removeChild(elements[0]);
        }
        if (i > 0) {
            console.log("removed content: " + i);
        }
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

        if (!add.includes("s=list") && !(endlessScrollingInFav && add.includes("index.php?page=favorites&s=view"))) {
            return;
        }

        var base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
        var step = base.includes("favorites") ? 50 : 42;


        var el = step == 50 ? document.getElementsByName("lastpage")[0] : document.getElementsByTagName("a")[document.getElementsByTagName("a").length - 2];
        var text = step == 50 ? el.attributes[1].nodeValue : el.href;
        var maxMatch = reg.exec(text);
        var max = maxMatch == null ? 0 : max = parseInt(maxMatch[1]);


        var curMatch = /pid=([0-9]*)/gm.exec(add);
        var cur = curMatch == null ? 0 : parseInt(curMatch[1]);

        //console.log("DEBUG:");
        //console.log(base);
        //console.log("max: " + max);
        //console.log("cur: " + cur);
        //console.log("step: " + step);

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

    var originalTitle = document.title;

    function getImagesFromUrl(url) {
        var ifr = document.createElement("iframe");
        ifr.style = "width:0; height:0; border:0; border:none";
        ifr.src = url;
        ifr.onload = function() {
            var images = ifr.contentWindow.document.getElementsByTagName("img");
            //console.log(images);
            var t = 0;
            var g = 0;
            for(i = images.length-1; i >= 0; i--) {
            //for (i = 0; i < images.length; i++) { /// TODO: FIX THE ORDER
                if (images[i].parentNode.parentNode.tagName == "SPAN") {
                    t++;
                    if (hideBlacklistedThumbnails && images[i].parentNode.parentNode.className == "thumb blacklisted-image") {
                        continue;
                    }
                    document.getElementById("paginator").parentNode.insertBefore(images[i].parentNode.parentNode, document.getElementById("paginator"));
                    g++;
                }
            }
            console.log("images: " + g + "/" + t + " (-" + (t - g) + ")");
            document.title = originalTitle;
            ifr.parentNode.removeChild(ifr);
        }
        document.title = "Loading...";
        document.body.appendChild(ifr);
    }

    $(document).ready(function() {
        main_scroll();
    });
}

// TODO: CHECK IN WHICH ORDER IT GETS DISPLAYED, ...
if (favFilter) {
    async function main_favFilter() {
        var reg = /pid=([0-9]*)/gm;
        var base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
        if (!base.includes("favorites")) {
            return console.log("not a favorites page");
        };

        var step = 50;
        var max;
        var el = document.getElementsByName("lastpage")[0];
        var maxMatch = reg.exec(el.attributes[1].nodeValue);
        var max = maxMatch == null ? 0 : parseInt(maxMatch[1]);
        var curMatch = reg.exec(document.location);
        var cur = curMatch == null ? 0 : parseInt(curMatch[1]);

        //console.log("DEBUG:");
        //console.log(base);
        //console.log("max: " + max);
        //console.log("cur: " + cur);
        //console.log("step: " + step);
        //console.log("match: " + input.value);

        var span = document.getElementsByTagName("span");
        for (i = span.length - 1; i >= 0; i--) {
            span[i].parentNode.removeChild(span[i]);
        }
        for (; cur <= max; cur += step) {
            getImagesFromUrl(base + "&pid=" + cur, input.value.split(" "));
            await sleep(slider.value);
        }
    };

    function getImagesFromUrl(url, match) {
        var ifream = document.createElement("iframe");
        ifream.src = url;
        ifream.onload = function() {
            var toAdd = [];
            var images = ifream.contentWindow.document.getElementsByTagName("img");
            //console.log(images);
            //console.log(match);
            for (i = images.length - 1; i >= 0; i--) {
                var addImage = true;
                for (j = 0; j < match.length; j++) {
                    if (!images[i].title.includes(match[j])) {
                        addImage = false;
                    }
                }
                if (addImage) {
                    //console.log("found " + images[i].title);
                    toAdd.push(images[i].parentNode.parentNode);
                }
            }
            for (i = toAdd.length - 1; i >= 0; i--) {
                document.getElementById("paginator").parentNode.insertBefore(toAdd[i], document.getElementById("paginator"));
            }
            ifream.parentNode.removeChild(ifream);
        }
        document.body.appendChild(ifream);
    }

    var base = /(.*)&pid=/gm.exec(document.location.href) == null ? document.location.href : /(.*)&pid=/gm.exec(document.location.href)[1];
    if (base.includes("favorites")) {
        input = document.createElement("input");
        input.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                main_favFilter();
            }
        });
        input.type = "text";
        var button = document.createElement("button");
        button.style.margin = ".5em";
        button.title = "If the search takes to long try decreasing the time between requests"
        button.innerHTML = "Filter";

        var slider = document.createElement("input");
        slider.type = "range";
        slider.title = "This sets the time between requests since this is not an officialy supported service your might get temporarily blocked if you have make to many request recomended time is 1000ms";
        slider.min = "100";
        slider.max = "4000";
        slider.value = 1000;

        var lable = document.createElement("p");
        lable.innerHTML = "Request Speed: " + slider.value + "ms";
        slider.oninput = function() {
            lable.innerHTML = "Request Speed: " + slider.value + "ms";
        }

        var conatiner = document.createElement("div");
        conatiner.style.margin = "1em";
        conatiner.appendChild(input);
        conatiner.appendChild(button);
        conatiner.appendChild(slider);
        conatiner.appendChild(lable);

        document.getElementsByTagName("span")[0].parentNode.insertBefore(conatiner, document.getElementsByTagName("span")[0]);
        button.onclick = function() {
            main_favFilter();
        }
    };
}

if (forceDarkTheme) {
    $('head').append('<link rel="stylesheet" type="text/css" media="screen" href="https://rule34.xxx/css/desktop_bip.css" title="default"/>');
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
        .custom-button:hover {
            background-color: rgba(255,255,255,.2);
        }
        .custom-button:active {
            background-color: rgba(255,255,255,1);
        }
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
    $("#btn-like").click(function() {
        $("#stats > ul > li:contains('(vote up)') > a:contains('up')").click();
    });
    $("#btn-fav").click(function() {
        $("#stats + div > ul > li > a:contains('Add to favorites')").click();
    });
    $("#btn-prev").click(function() {
        $("#stats + div + div + div + div > ul > li > a:contains('Previous')").click();
    });
    $("#btn-next").click(function() {
        $("#stats + div + div + div + div > ul > li > a:contains('Next')").click();
    });

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
})();
