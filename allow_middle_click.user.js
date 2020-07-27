// ==UserScript==
// @name         Allow Middle Click
// @namespace    UserScript
// @version      0.1
// @description  Allow middle click on websites that prevent it (e.g. Pinterest and Instagram)
// @author       0xC0LD
// @match *://*/*
// @grant none
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAEsSURBVDhPlZNNi4JQFIbnz7eIVgliIIIkGEpCWfiBS7fuFEMURdpIC3cWrc5wT2cmT0XTPCD3fS/eR7xev2BEkiRwPB6pfQYTBEEAURT9S8IEvu/jGIYhtG2L+S+YYLfbUQLwPO8jCRNsNhtKN/b7PTRNQ+01TOA4DqU72+0W6rqm9gwTWJZFiSPEVVVR4zCBaZqUnrFtG8qypHaHCZbLJaXXrFYrKIqC2g0m0DSN0o3L5QK6ruP8zyW+zhgmWCwWOPZ9j5snEIfrcDhgfgUTzOdzXKwoCqzXa8jzHM7nM+7N9XqluzhMMJvNQJIkfOLpdPp9JXE+0jTF/AgTGIYBWZZRA3BdFxcOwwCqqtIshwke6boOZFnGPJ1OcXzkrUAgfrDJZAJxHNPMGIBvHAPJlLxLDG4AAAAASUVORK5CYII=
// ==/UserScript==

window.addEventListener('click', function(e){
  if(e.button == 1 || (e.button == 0 && e.ctrlKey)){
      e.stopPropagation();
  }
}, true);
