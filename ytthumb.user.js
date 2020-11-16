// ==UserScript==
// @name         Youtube Thumbnail
// @namespace    UserScript
// @version      1.0
// @description  Adds a button to the current thumbnail of a video
// @author       C0LD
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @icon         https://www.youtube.com/favicon.ico
// ==/UserScript==

var video_id = window.location.search.split('v=')[1];
var ampersandPosition = video_id.indexOf('&');
if(ampersandPosition != -1) { video_id = video_id.substring(0, ampersandPosition); }

var imgD = `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`; // Maximum Resolution
var imgH = `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`;     // High Quality
var imgM = `https://img.youtube.com/vi/${video_id}/mqdefault.jpg`;     // Medium Quality
var imgL = `https://img.youtube.com/vi/${video_id}/sddefault.jpg`;     // Low Quality

var urls = [ imgD, imgH, imgM, imgL ];

var index = 0;
function get() {
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
`

function createButton(url) {
  let btn = document.createElement("a");
  btn.style = style;
  btn.innerHTML = "Thumbnail";
  btn.href = url;
  btn.title = url;
  
  let added = false;
  let els = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer");
  for (let i = 0; i < els.length; i++) { els[i].appendChild(btn); added = true; console.log("BTN : " + url); }
  if (!added) { setTimeout(function() { createButton(url) }, 100); }
}

get();
