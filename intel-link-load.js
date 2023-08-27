// ==UserScript==
// @id             iitc-intel-link-load
// @name           IITC plugin: Debug: Intel Link Load
// @category       Debug
// @version        0.0.0
// @namespace      intelload
// @updateURL      https://raw.githubusercontent.com/syakesaba/iitc-plugin-portal-load/main/intel-link-load.js
// @downloadURL    https://raw.githubusercontent.com/syakesaba/iitc-plugin-portal-load/main/intel-link-load.js
// @description    Open Intel Load Link
// @include https://intel.ingress.com/intel*
// @match https://intel.ingress.com/intel*
// @include https://intel.ingress.com/mission/*
// @match https://intel.ingress.com/mission/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// use own namespace for plugin
window.plugin.intelload = function() {};

// Nickname Load
window.plugin.intelload.addNicknameLink = function(d) {
  console.log(d);
}

// Portal Load
window.plugin.intelload.addPortalLink = function(d) {
  var guid = window.selectedPortal;
  if (!window.portals[guid]) {
    console.warn('Error: failed to find portal details for guid '+guid+' - failed to show debug data');
    return;
  }
  var linkURL = undefined;
  var data = window.portals[guid].options.data;
  var lat = data.latE6/1E6;
  var lng = data.lngE6/1E6;
  var apn = "com.nianticproject.ingress";
  var isi = "576505181";
  var ibi = "com.google.ingress";
  var ifl = "https://apps.apple.com/app/ingress/id576505181";
  var ofl = "https://intel.ingress.com/intel?pll=" + lat + "," + lng;
  linkURL = "https://link.ingress.com/?link=https://intel.ingress.com/portal/" + guid + "&apn=" + apn + "&isi=" + isi + "&ibi=" + ibi + "&ifl=" + encodeURIComponent(ifl) + "&ofl=" + encodeURIComponent(ofl);
  $('.linkdetails').append('<aside><a href="' + linkURL + '" target="_blank" title="Display URL Load of the portal">Portal Load</a></aside>');
}

// setupCallback calls addHook()

window.plugin.intelload.setupCallback = function() {
  addHook('portalDetailsUpdated', window.plugin.intelload.addPortalLink);
  addHook('nicknameClicked', window.plugin.intelload.addNicknameLink);
}

// setup() will be loaded after IITC loaded

var setup = function () {
  window.plugin.intelload.setupCallback();
}

// DO NOT TOUCH BELOW //////////////////////////////////////////////////////////

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
