/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: undefined
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
"use strict";var _nlsPluginGlobal=this,NLSLoaderPlugin;!function(n){function t(n,t){var e;return e=0===t.length?n:n.replace(/\{(\d+)\}/g,function(n,e){var r=e[0];return"undefined"!=typeof t[r]?t[r]:n}),s&&(e="［"+e.replace(/[aouei]/g,"$&$&")+"］"),e}function e(n,t){var e=n[t];return e?e:(e=n["*"],e?e:null)}function r(n,e){for(var r=[],i=0;i<arguments.length-2;i++)r[i]=arguments[i+2];return t(e,r)}function i(n){return function(e,r){var i=a.call(arguments,2);return t(n[e],i)}}var o=_nlsPluginGlobal,l=o.Plugin&&o.Plugin.Resources?o.Plugin.Resources:void 0,u="i-default",s=o&&o.document&&o.document.location&&o.document.location.hash.indexOf("pseudo=true")>=0,a=Array.prototype.slice,c=function(){function n(){this.localize=r}return n.prototype.setPseudoTranslation=function(n){s=n},n.prototype.create=function(n,t){return{localize:i(t[n])}},n.prototype.load=function(t,o,s,a){if(a=a||{},t&&0!==t.length){var c=void 0;if(l&&l.getString)c=".nls.keys",o([t+c],function(n){s({localize:function(t,e){if(!n[t])return"NLS error: unknown key "+t;var r=n[t].keys;if(e>=r.length)return"NLS error unknow index "+e;var i=r[e],o=[];o[0]=t+"_"+i;for(var u=0;u<arguments.length-2;u++)o[u+1]=arguments[u+2];return l.getString.apply(l,o)}})});else if(a.isBuild)o([t+".nls",t+".nls.keys"],function(e,r){n.BUILD_MAP[t]=e,n.BUILD_MAP_KEYS[t]=r,s(e)});else{var f=a["vs/nls"]||{},g=f.availableLanguages?e(f.availableLanguages,t):null;c=".nls",null!==g&&g!==u&&(c=c+"."+g),o([t+c],function(n){Array.isArray(n)?n.localize=i(n):n.localize=i(n[t]),s(n)})}}else s({localize:r})},n.prototype._getEntryPointsMap=function(){return o.nlsPluginEntryPoints=o.nlsPluginEntryPoints||{},o.nlsPluginEntryPoints},n.prototype.write=function(n,t,e){var r=e.getEntryPoint(),i=this._getEntryPointsMap();i[r]=i[r]||[],i[r].push(t),t!==r&&e.asModule(n+"!"+t,"define(['vs/nls', 'vs/nls!"+r+"'], function(nls, data) { return nls.create(\""+t+'", data); });')},n.prototype.writeFile=function(t,e,r,i,o){var l=this._getEntryPointsMap();if(l.hasOwnProperty(e)){for(var u=r.toUrl(e+".nls.js"),s=["/*---------------------------------------------------------"," * Copyright (c) Microsoft Corporation. All rights reserved."," *--------------------------------------------------------*/"],a=l[e],c={},f=0;f<a.length;f++)c[a[f]]=n.BUILD_MAP[a[f]];s.push('define("'+e+'.nls", '+JSON.stringify(c,null,"\t")+");"),i(u,s.join("\r\n"))}},n.prototype.finishBuild=function(t){t("nls.metadata.json",JSON.stringify({keys:n.BUILD_MAP_KEYS,messages:n.BUILD_MAP,bundles:this._getEntryPointsMap()},null,"\t"))},n.BUILD_MAP={},n.BUILD_MAP_KEYS={},n}();n.NLSPlugin=c,function(){define("vs/nls",new c)}()}(NLSLoaderPlugin||(NLSLoaderPlugin={}));