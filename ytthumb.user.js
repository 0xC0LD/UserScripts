// ==UserScript==
// @name         Youtube Thumbnail
// @namespace    UserScript
// @version      1.0
// @description  Adds a Button to the Current Thumbnail of the Video.
// @author       0xC0LD
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @icon         https://www.youtube.com/favicon.ico
// ==/UserScript==

var page = "";
var index = 0;
function get() {
	// remove priv buttons
	let btns = document.getElementById("btn_thumbnail_url");
	if (btns != null) { btns.remove(); }
	
	// get id
	let split = window.location.search.split('v=');
	if (split.length != 2) { return; }
	let video_id = split[1];
	let ampersandPosition = video_id.indexOf('&');
	if (ampersandPosition != -1) { video_id = video_id.substring(0, ampersandPosition); }
	
	// make urls
	let imgD = `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`; // Maximum Resolution
	let imgH = `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`;     // High Quality
	let imgM = `https://img.youtube.com/vi/${video_id}/mqdefault.jpg`;     // Medium Quality
	let imgL = `https://img.youtube.com/vi/${video_id}/sddefault.jpg`;     // Low Quality
	let urls = [ imgD, imgH, imgM, imgL ];
	
	// make requests
	if (index > urls.length - 1) { index = 0; }
	httpGetAsync(urls[index]);
	index++;
}

function httpGetAsync(theUrl) {
	console.log("... : " + theUrl);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() { 
	if (xmlHttp.readyState != 4) { return; }
		switch(xmlHttp.status) {
			case 200: console.log("202 : " + theUrl); createButton(theUrl); break;
			case 404: console.log("404 : " + theUrl); get(); break;
		}
	}
	xmlHttp.open("GET", theUrl, true);
	
	try { xmlHttp.send(null); }
	catch (err) {
		console.log(err);
		get();
	}
}


var style = `
	float: right !important;
	color: rgba(255, 255, 255, 0.54) !important;
	background: transparent !important;
	font-size: 11px;
	border: solid rgba(255, 255, 255, 0.54) 1px !important;
	padding: 3px !important;
	text-decoration: none !important;
	text-transform: uppercase !important;
`;

function createButton(url) {
	let btn = document.createElement("a");
	btn.style = style;
	btn.id = "btn_thumbnail_url";
	btn.innerHTML = "Thumbnail";
	btn.href = url;
	btn.title = url.split('/').pop() + " (" + url + ")";
	
	let meta = document.getElementById("meta");
	meta.appendChild(btn);
	console.log("BTN : " + url);
	
	if (!document.getElementById(btn.id)) { setTimeout(function() { createButton(url) }, 100); }
}


function checker() {
	if (page != window.location.href) {
		page = window.location.href;
		index = 0;
		get();
	}
}

setInterval(checker, 500);

