// ==UserScript==
// @name         Rule34.xxx Improved
// @namespace    UserScript
// @version      0.2
// @description  Bunch of improvements for rule34.xxx
// @author       Hentiedup, 0xC0LD
// @match        https://rule34.xxx/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @icon         data:image/ico;base64,AAABAAEAEBAAAAAAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAD///8BADMA/wAAAP8AMwD/AAAA/wAzAP8AMwD/AAAA/wAzAP8AAAD/ADMA/wAzAP8AAAD/ADMA/wAAAP////8BM2Yz/wAzAP+Z/5n/AAAA/5n/mf8AAAD/ADMA/5n/mf8AAAD/mf+Z/wAAAP8AMwD/mf+Z/wAAAP+Z/5n/AAAA/zNmM/8AMwD/AAAA/5n/mf8AAAD/ADMA/wAzAP8AAAD/mf+Z/wAAAP8AMwD/ADMA/wAAAP+Z/5n/AAAA/wAzAP8zZjP/ADMA/5n/mf8AAAD/mf+Z/wAAAP8AMwD/mf+Z/wAAAP+Z/5n/AAAA/wAzAP+Z/5n/AAAA/5n/mf8AAAD/M2Yz/zNmM/8AAAD/AAAA/wAAAP8AAAD/M2Yz/wAzAP8AMwD/ADMA/wAzAP8zZjP/AAAA/zNmM/8AMwD/ADMA/zNmM/8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8zZjP/M2Yz/zNmM/8zZjP/M2Yz/wAAAP8AAAD/M2Yz/zNmM/8zZjP/AAAA/////////////////wAAAP8AAAD/AAAA/zNmM/8zZjP/M2Yz/zNmM///////AAAA/wAAAP8zZjP/M2Yz//////8AAAD/M2Yz/zNmM///////AAAA/wAAAP8zZjP/M2Yz/zNmM/8AAAD//////wAAAP8AAAD/AAAA/zNmM/8zZjP/AAAA/wAAAP8AAAD//////wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA//////8AAAD/AAAA/wAAAP8zZjP/M2Yz/wAAAP8AAAD/AAAA//////8AAAD/AAAA//////////////////////////////////////8AAAD/M2Yz/zNmM/////////////////8AAAD/AAAA/zNmM///////AAAA/wAAAP8zZjP//////wAAAP8AAAD/AAAA/zNmM/8AAAD/AAAA/zNmM/8zZjP//////wAAAP8AAAD/M2Yz//////8AAAD/AAAA//////8AAAD/AAAA/zNmM/8zZjP/AAAA/wAAAP8AAAD/AAAA//////8AAAD/AAAA/zNmM/8zZjP//////wAAAP//////AAAA/wAAAP8zZjP/M2Yz//////8AAAD/AAAA/wAAAP//////AAAA/wAAAP8zZjP/M2Yz/zNmM////////////wAAAP8AAAD/M2Yz/zNmM/8zZjP/////////////////AAAA/wAAAP8zZjP/M2Yz/zNmM/8zZjP/M2Yz//////8AAAD/AAAA/zNmM/////8BM2Yz/zNmM/8zZjP/M2Yz/zNmM/8zZjP/M2Yz/zNmM/8zZjP/M2Yz/zNmM/8zZjP/M2Yz/zNmM/////8BAAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//w==
// ==/UserScript==

(function() {
    'use strict';
    // ===[ Settings ]===
    var autoplayVideos            = false; // (true/false) Automatically play the video
    var defaultVideoVolume        = 1;     // (0-1)        0=mute, 0.5=50%, 1=100%, etc.
    var useViewportDependentSize  = true;  // (true/false) Makes the max-height of all images and videos X% of the viewport (inner window of the browser) width/height.  
    var ViewportDependentHeight   = 70;    // (1-100)      the size used by above. (in %)
    var stretchImgVid             = true;  // (true/false) Makes image and video height follow the ViewportDependentHeight regardless of true size. i.e. will stretch if needed.
    var trueVideoSize             = false; // (true/false) Resizes videos to their true size (unless overriden by stretchImgVid)
    var enableFavOnEnter          = true;  // (true/false) Use the "ENTER" key on your keyboard to add a post to your favorites
    var hideBlacklistedThumbnails = true;  // (true/false) Hide blacklisted thumbnails on the front page (https://rule34.xxx/index.php?page=post&s=list&tags=all)
    var forceDarkTheme            = true;  // (true/false) Force rule34's dark theme on every page, even if light theme is set in options
    // - Don't touch anything else unless you know what you're doing
    
    // fix search box size
    $("#stags").attr("size", "14");

    if (hideBlacklistedThumbnails) {
        var elements = document.getElementsByClassName("thumb blacklisted-image");
        while (elements[0]) {
            elements[0].parentNode.removeChild(elements[0]);
        }  
    }

    if (forceDarkTheme) {
      	// dark theme on main page
        if (window.location == "https://rule34.xxx/") {
            // force dark theme
            $('head').append('<link rel="stylesheet" type="text/css" media="screen" href="https://rule34.xxx/css/desktop_bip.css?6" title="default" />');
        }
      
      	// dark theme on other pages
      	$("link").each(function() {
            var url = this.href;
            if (url == "https://rule34.xxx/css/desktop.css?6") {
                // replace white theme with dark theme
                $(this).attr('href', "https://rule34.xxx/css/desktop_bip.css?6");
            }      
        });

        //$('div').css({'background-color': '#303a30'});
    }
  
    var viewPDepenCSS = "";
    if(useViewportDependentSize) {
        viewPDepenCSS = (stretchImgVid ? `
        #gelcomVideoContainer {
            width: auto !important;
            max-width: 100% !important;
            height: ` + ViewportDependentHeight + `vh !important;
        }
        ` : "") + `
        #image {
            width: auto !important;
            max-width: 100% !important;
            ` + (stretchImgVid ? "" : "max-") + `height: ` + ViewportDependentHeight + `vh !important;
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
        ` + viewPDepenCSS + ``
    );

    $("#gelcomVideoPlayer").prop("volume", defaultVideoVolume);
    if(autoplayVideos) { $("#gelcomVideoPlayer").prop("autoplay", true); }
	
    if(!stretchImgVid && trueVideoSize) {
        $("#gelcomVideoContainer").prop("style", "width: " + ($("#stats > ul > li:contains('Size: ')").text().split(": ")[1].split("x")[0]) + "px; max-width: 100%; height: " + ($("#stats > ul > li:contains('Size: ')").text().split("x")[1]) + "px;");
    }
	
    if (enableFavOnEnter) {
        document.onkeydown=nextpage; 
        function nextpage(e){
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
                    if (event.keyCode==13) $("#stats + div > ul > li > a:contains('Add to favorites')").click();
                    break;
            }
        }
    }

    // buttons
    $("#edit_form").prev().before(
        '<img id="btn-like" class="custom-button" alt="like"     src="https://i.imgur.com/TOQLRok.png">' +
        '<img id="btn-fav"  class="custom-button" alt="favorite" src="https://i.imgur.com/dTpBrIj.png">' +
        '<img id="btn-prev" class="custom-button" alt="previous" src="https://i.imgur.com/Qh5DWPR.png">' +
        '<img id="btn-next" class="custom-button" alt="next"     src="https://i.imgur.com/v6rmImf.png">'
    );

    // button click events
    $("#btn-like").click(function() { $("#stats > ul > li:contains('(vote up)') > a:contains('up')").click();         });
    $("#btn-fav").click(function()  { $("#stats + div > ul > li > a:contains('Add to favorites')").click();           });
    $("#btn-prev").click(function() { $("#stats + div + div + div + div > ul > li > a:contains('Previous')").click(); });
    $("#btn-next").click(function() { $("#stats + div + div + div + div > ul > li > a:contains('Next')").click();     });

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
