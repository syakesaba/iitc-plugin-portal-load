// ==UserScript==
// @name           IITC plugin: Debug: Intel Link Load
// @id             iitc-intel-link-load
// @category       Debug
// @version        0.0.1
// @namespace      intelload
// @updateURL      https://raw.githubusercontent.com/syakesaba/iitc-plugin-portal-load/main/intel-link-load.js
// @downloadURL    https://raw.githubusercontent.com/syakesaba/iitc-plugin-portal-load/main/intel-link-load.js
// @description    Open Intel Load Link
// @include https://www.ingress.com/intel*
// @match https://www.ingress.com/intel*
// @include https://intel.ingress.com/*
// @match https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// use own namespace for plugin
window.plugin.intelload = function() {};
window.plugin.intelload.url = "https://link.ingress.com/?link="
window.plugin.intelload.apn = "com.nianticproject.ingress";
window.plugin.intelload.isi = "576505181";
window.plugin.intelload.ibi = "com.google.ingress";
window.plugin.intelload.ifl = "https://apps.apple.com/app/ingress/id576505181";

// Nickname Load
window.plugin.intelload.addNicknameLink = function(d) {
  var nickname = d.nickname;
  var ofl = "https://www.ingress.com/"
  var linkURL = window.plugin.intelload.url + "https://intel.ingress.com/agent/" + nickname + "&apn=" + window.plugin.intelload.apn + "&isi=" + window.plugin.intelload.isi + "&ibi=" + window.plugin.intelload.ibi + "&ifl=" + encodeURIComponent(window.plugin.intelload.ifl) + "&ofl=" + encodeURIComponent(ofl);
  window.alert('<aside><a href="' + linkURL + '" target="_blank" title="Open URL of the agent">' + nickname + '</a></aside>');
}

// Portal Load
window.plugin.intelload.addPortalLink = function(d) {
  var guid = window.selectedPortal;
  if (!window.portals[guid]) {
    console.warn('Error: failed to find portal details for guid '+guid+' - failed to show debug data');
    return;
  }
  var data = window.portals[guid].options.data;
  var lat = data.latE6/1E6;//bigfloat -> float
  var lng = data.lngE6/1E6;//bigfloat -> float
  var ofl = "https://intel.ingress.com/intel?pll=" + lat.toString() + "," + lng.toString();
  var linkURL = window.plugin.intelload.url + "https://intel.ingress.com/portal/" + guid + "&apn=" + window.plugin.intelload.apn + "&isi=" + window.plugin.intelload.isi + "&ibi=" + window.plugin.intelload.ibi + "&ifl=" + encodeURIComponent(window.plugin.intelload.ifl) + "&ofl=" + encodeURIComponent(ofl);
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
