// ==UserScript==
// @name         Youtube Thumbnail
// @namespace    UserScript
// @version      0.1
// @description  Adds a thumbnail href button for the current video
// @author       0xC0LD
// @match        https://www.youtube.com/*
// @grant        none
// @icon         https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico
// ==/UserScript==

function polymerInject(){
	var buttonDiv = document.createElement("a");
	buttonDiv.style.width = "100%";
	buttonDiv.id = "parentButton";
	var url = window.document.location.toString();
	var id = url.replace("https://www.youtube.com/watch?v=", "");
	var thumbUrl = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';
	buttonDiv.href = thumbUrl;
	var addButton = document.createElement("button");
	addButton.appendChild(document.createTextNode("Thumbnail"));
	if(typeof(document.getElementById("iframeDownloadButton")) != 'undefined' && document.getElementById("iframeDownloadButton") !== null){
		document.getElementById("iframeDownloadButton").remove();
	}
	addButton.style.width = "10%";
	addButton.style.backgroundColor = "#181717";
	addButton.style.color = "white";
	addButton.style.textAlign = "center";
	addButton.style.padding = "10px 0";
	addButton.style.marginTop = "5px";
	addButton.style.fontSize = "14px";
	addButton.style.border = "0";
	addButton.style.cursor = "pointer";
	addButton.style.borderRadius = "2px";
	addButton.style.fontFamily = "Roboto, Arial, sans-serif";
	buttonDiv.appendChild(addButton);
	
	var targetElement = document.querySelectorAll("[id='container']");
	for(var i = 0; i < targetElement.length; i++){
		if(targetElement[i].className.indexOf("ytd-video-secondary-info-renderer") > -1){
			targetElement[i].appendChild(buttonDiv);
		}
	}
	
	var descriptionBox = document.querySelectorAll("ytd-video-secondary-info-renderer");
	if(descriptionBox[0].className.indexOf("loading") > -1){
		descriptionBox[0].classList.remove("loading");
	}
}

function standardInject() {
	var pagecontainer=document.getElementById('page-container');
	if (!pagecontainer) return;
	if (/^https?:\/\/www\.youtube.com\/watch\?/.test(window.location.href)) run();
	var isAjax=/class[\w\s"'-=]+spf\-link/.test(pagecontainer.innerHTML);
	var logocontainer=document.getElementById('logo-container');
	if (logocontainer && !isAjax) { // fix for blocked videos
		isAjax=(' '+logocontainer.className+' ').indexOf(' spf-link ')>=0;
	}
	var content=document.getElementById('content');
	if (isAjax && content) { // Ajax UI
		var mo=window.MutationObserver||window.WebKitMutationObserver;
		if(typeof mo!=='undefined') {
			var observer=new mo(function(mutations) {
				mutations.forEach(function(mutation) {
					if(mutation.addedNodes!==null) {
						for (var i=0; i<mutation.addedNodes.length; i++) {
								mutation.addedNodes[i].id=='watch7-container' ||
								mutation.addedNodes[i].id=='watch7-main-container') { // old value: movie_player
								run();
								break;
							}
						}
					}
				});
			});
			observer.observe(content, {childList: true, subtree: true}); // old value: pagecontainer
		} else { // MutationObserver fallback for old browsers
			pagecontainer.addEventListener('DOMNodeInserted', onNodeInserted, false);
		}
	}
}

function onNodeInserted(e) {
	if (e && e.target && (e.target.id=='watch7-container' || e.target.id=='watch7-main-container')) { run(); }
}

function finalButton(){
	var buttonIframeDownload = document.createElement("iframe");
	buttonIframeDownload.src = '//www.convertmp3.io/widget/button/?color=ba1717&amp;video=' + window.location.href;
	buttonIframeDownload.id = "buttonIframe";
	buttonIframeDownload.style.width = "100%";
	buttonIframeDownload.style.height = "60px";
	buttonIframeDownload.style.paddingTop = "20px";
	buttonIframeDownload.style.paddingBottom = "20px";
	buttonIframeDownload.style.overflow = "hidden";
	buttonIframeDownload.scrolling = "no";
	document.getElementById("watch-header").appendChild(buttonIframeDownload);
}

function run(){
	if(!document.getElementById("parentButton") && window.location.href.substring(0, 25).indexOf("youtube.com") > -1 && window.location.href.indexOf("watch?") > -1){
		var parentButton = document.createElement("div");
		parentButton.className = "yt-uix-button yt-uix-button-default";
		parentButton.id = "parentButton";
		parentButton.style.height = "23px";
		parentButton.style.marginLeft = "28px";
		parentButton.style.paddingBottom = "1px";
		parentButton.onclick = function () {
			this.remove();
			finalButton();
		};
		document.getElementById("watch7-user-header").appendChild(parentButton);
		var childButton = document.createElement("span");
		childButton.appendChild(document.createTextNode("Download MP3"));
		childButton.className = "yt-uix-button-content";
		childButton.style.lineHeight = "25px";
		childButton.style.fontSize = "12px";
		parentButton.appendChild(childButton);
	}
}

if(document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer){
	setInterval(function(){
		if(window.location.href.indexOf("watch?v=") < 0){ return false; }
		if(document.getElementById("count") && document.getElementById("parentButton") === null){
			polymerInject();
		}
	}, 100);
}
else{
	standardInject();
}