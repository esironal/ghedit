/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: undefined
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
(function(){var t=["exports","require","vs/languages/html/common/htmlEmptyTagsShared","vs/languages/html/common/htmlTokenTypes","vs/platform/workspace/common/workspace","vs/base/common/strings","vs/languages/html/common/html","vs/editor/common/modes","vs/base/common/arrays","vs/editor/common/modes/abstractState","vs/editor/common/services/modeService","vs/platform/instantiation/common/instantiation","vs/editor/common/modes/languageConfigurationRegistry","vs/editor/common/modes/supports/tokenizationSupport","vs/base/common/async","vs/editor/common/services/compatWorkerService","vs/editor/common/modes/abstractMode"],e=function(e){for(var n=[],i=0,r=e.length;i<r;i++)n[i]=t[e[i]];return n};define(t[2],e([1,0,8]),function(t,e,n){"use strict";function i(t){return n.binarySearch(e.EMPTY_ELEMENTS,t,function(t,e){return t.localeCompare(e)})>=0}e.EMPTY_ELEMENTS=["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"],e.isEmptyElement=i}),define(t[3],e([1,0,5]),function(t,e,n){"use strict";function i(t){return n.startsWith(t,o)}function r(t){return o+t}e.DELIM_END="punctuation.definition.meta.tag.end.html",e.DELIM_START="punctuation.definition.meta.tag.begin.html",e.DELIM_ASSIGN="meta.tag.assign.html",e.ATTRIB_NAME="entity.other.attribute-name.html",e.ATTRIB_VALUE="string.html",e.COMMENT="comment.html.content",e.DELIM_COMMENT="comment.html",e.DOCTYPE="entity.other.attribute-name.html",e.DELIM_DOCTYPE="entity.name.tag.html";var o="entity.name.tag.tag-";e.isTag=i,e.getTag=r});var n=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},i=this&&this.__decorate||function(t,e,n,i){var r,o=arguments.length,a=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,i);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(o<3?r(a):o>3?r(e,n,a):r(e,n))||a);return o>3&&a&&Object.defineProperty(e,n,a),a},r=this&&this.__param||function(t,e){return function(n,i){e(n,i,t)}};define(t[6],e([1,0,7,16,9,10,11,3,2,12,13,14,15,4]),function(t,e,o,a,s,u,d,h,c,p,m,g,l,f){"use strict";e.htmlTokenTypes=h,e.EMPTY_ELEMENTS=c.EMPTY_ELEMENTS,function(t){t[t.Content=0]="Content",t[t.OpeningStartTag=1]="OpeningStartTag",t[t.OpeningEndTag=2]="OpeningEndTag",t[t.WithinDoctype=3]="WithinDoctype",t[t.WithinTag=4]="WithinTag",t[t.WithinComment=5]="WithinComment",t[t.WithinEmbeddedContent=6]="WithinEmbeddedContent",t[t.AttributeName=7]="AttributeName",t[t.AttributeValue=8]="AttributeValue"}(e.States||(e.States={}));var v=e.States,T=["script","style"],y=function(t){function e(e,n,i,r,o,a,s){t.call(this,e),this.kind=n,this.lastTagName=i,this.lastAttributeName=r,this.embeddedContentType=o,this.attributeValueQuote=a,this.attributeValueLength=s}return n(e,t),e.escapeTagName=function(t){return h.getTag(t.replace(/[:_.]/g,"-"))},e.prototype.makeClone=function(){return new e(this.getMode(),this.kind,this.lastTagName,this.lastAttributeName,this.embeddedContentType,this.attributeValueQuote,this.attributeValueLength)},e.prototype.equals=function(n){return n instanceof e&&(t.prototype.equals.call(this,n)&&this.kind===n.kind&&this.lastTagName===n.lastTagName&&this.lastAttributeName===n.lastAttributeName&&this.embeddedContentType===n.embeddedContentType&&this.attributeValueQuote===n.attributeValueQuote&&this.attributeValueLength===n.attributeValueLength)},e.prototype.nextElementName=function(t){return t.advanceIfRegExp(/^[_:\w][_:\w-.\d]*/).toLowerCase()},e.prototype.nextAttributeName=function(t){return t.advanceIfRegExp(/^[^\s"'>\/=\x00-\x0F\x7F\x80-\x9F]*/).toLowerCase()},e.prototype.tokenize=function(t){switch(this.kind){case v.WithinComment:if(t.advanceUntilString2("-->",!1))return{type:h.COMMENT};if(t.advanceIfString2("-->"))return this.kind=v.Content,{type:h.DELIM_COMMENT,dontMergeWithPrev:!0};break;case v.WithinDoctype:if(t.advanceUntilString2(">",!1))return{type:h.DOCTYPE};if(t.advanceIfString2(">"))return this.kind=v.Content,{type:h.DELIM_DOCTYPE,dontMergeWithPrev:!0};break;case v.Content:if(t.advanceIfCharCode2("<".charCodeAt(0))){if(!t.eos()&&"!"===t.peek()){if(t.advanceIfString2("!--"))return this.kind=v.WithinComment,{type:h.DELIM_COMMENT,dontMergeWithPrev:!0};if(t.advanceIfStringCaseInsensitive2("!DOCTYPE"))return this.kind=v.WithinDoctype,{type:h.DELIM_DOCTYPE,dontMergeWithPrev:!0}}return t.advanceIfCharCode2("/".charCodeAt(0))?(this.kind=v.OpeningEndTag,{type:h.DELIM_END,dontMergeWithPrev:!0}):(this.kind=v.OpeningStartTag,{type:h.DELIM_START,dontMergeWithPrev:!0})}break;case v.OpeningEndTag:var n=this.nextElementName(t);return n.length>0?{type:e.escapeTagName(n)}:t.advanceIfString2(">")?(this.kind=v.Content,{type:h.DELIM_END,dontMergeWithPrev:!0}):(t.advanceUntilString2(">",!1),{type:""});case v.OpeningStartTag:if(this.lastTagName=this.nextElementName(t),this.lastTagName.length>0)return this.lastAttributeName=null,"script"!==this.lastTagName&&"style"!==this.lastTagName||(this.lastAttributeName=null,this.embeddedContentType=null),this.kind=v.WithinTag,{type:e.escapeTagName(this.lastTagName)};break;case v.WithinTag:if(t.skipWhitespace2()||t.eos())return this.lastAttributeName="",{type:""};if(""===this.lastAttributeName){var i=this.nextAttributeName(t);if(i.length>0)return this.lastAttributeName=i,this.kind=v.AttributeName,{type:h.ATTRIB_NAME}}return t.advanceIfString2("/>")?(this.kind=v.Content,{type:h.DELIM_START,dontMergeWithPrev:!0}):t.advanceIfCharCode2(">".charCodeAt(0))?T.indexOf(this.lastTagName)!==-1?(this.kind=v.WithinEmbeddedContent,{type:h.DELIM_START,dontMergeWithPrev:!0}):(this.kind=v.Content,{type:h.DELIM_START,dontMergeWithPrev:!0}):(t.next2(),{type:""});case v.AttributeName:return t.skipWhitespace2()||t.eos()?{type:""}:t.advanceIfCharCode2("=".charCodeAt(0))?(this.kind=v.AttributeValue,{type:h.DELIM_ASSIGN}):(this.kind=v.WithinTag,this.lastAttributeName="",this.tokenize(t));case v.AttributeValue:if(t.eos())return{type:""};if(t.skipWhitespace2())return'"'===this.attributeValueQuote||"'"===this.attributeValueQuote?{type:h.ATTRIB_VALUE}:{type:""};if('"'!==this.attributeValueQuote&&"'"!==this.attributeValueQuote){var r=t.advanceIfRegExp(/^[^\s"'`=<>]+/);if(r.length>0)return this.kind=v.WithinTag,this.lastAttributeName=null,{type:h.ATTRIB_VALUE};var o=t.peek();return"'"===o||'"'===o?(this.attributeValueQuote=o,this.attributeValueLength=1,t.next2(),{type:h.ATTRIB_VALUE}):(this.kind=v.WithinTag,this.lastAttributeName=null,this.tokenize(t))}if(1!==this.attributeValueLength||"script"!==this.lastTagName&&"style"!==this.lastTagName||"type"!==this.lastAttributeName)return t.advanceIfCharCode2(this.attributeValueQuote.charCodeAt(0))?(this.kind=v.WithinTag,this.attributeValueLength=0,this.attributeValueQuote="",this.lastAttributeName=null):(t.next(),this.attributeValueLength++),{type:h.ATTRIB_VALUE};var r=t.advanceUntilString(this.attributeValueQuote,!0);if(r.length>0)return this.embeddedContentType=this.unquote(r),this.kind=v.WithinTag,this.attributeValueLength=0,this.attributeValueQuote="",{type:h.ATTRIB_VALUE}}return t.next2(),this.kind=v.Content,{type:""}},e.prototype.unquote=function(t){var e=0,n=t.length;return'"'===t[0]&&e++,'"'===t[n-1]&&n--,t.substring(e,n)},e}(s.AbstractState);e.State=y;var k=function(t){function e(e,n,i,r,o){t.call(this,e.id,r),this.workspaceContextService=o,this._modeWorkerManager=this._createModeWorkerManager(e,n),this.modeService=i,this.tokenizationSupport=new m.TokenizationSupport(this,this,(!0)),this.configSupport=this,this._registerSupports()}return n(e,t),e.prototype._registerSupports=function(){var t=this;if("html"!==this.getId())throw new Error("This method must be overwritten!");o.SuggestRegistry.register(this.getId(),{triggerCharacters:[".",":","<",'"',"=","/"],provideCompletionItems:function(e,n,i){return g.wireCancellationToken(i,t._provideCompletionItems(e.uri,n))}},!0),o.DocumentHighlightProviderRegistry.register(this.getId(),{provideDocumentHighlights:function(e,n,i){return g.wireCancellationToken(i,t._provideDocumentHighlights(e.uri,n))}},!0),o.DocumentRangeFormattingEditProviderRegistry.register(this.getId(),{provideDocumentRangeFormattingEdits:function(e,n,i,r){return g.wireCancellationToken(r,t._provideDocumentRangeFormattingEdits(e.uri,n,i))}},!0),o.LinkProviderRegistry.register(this.getId(),{provideLinks:function(e,n){return g.wireCancellationToken(n,t.provideLinks(e.uri))}},!0),p.LanguageConfigurationRegistry.register(this.getId(),e.LANG_CONFIG)},e.prototype._createModeWorkerManager=function(t,e){return new a.ModeWorkerManager(t,"vs/languages/html/common/htmlWorker","HTMLWorker",null,e)},e.prototype._worker=function(t){return this._modeWorkerManager.worker(t)},e.prototype.getInitialState=function(){return new y(this,v.Content,"","","","",0)},e.prototype.enterNestedMode=function(t){return t instanceof y&&t.kind===v.WithinEmbeddedContent},e.prototype.getNestedMode=function(t){var e=null,n=t,i=null;if(null!==n.embeddedContentType)this.modeService.isRegisteredMode(n.embeddedContentType)&&(e=this.modeService.getMode(n.embeddedContentType),e||(i=this.modeService.getOrCreateMode(n.embeddedContentType)));else{var r=null;r="script"===n.lastTagName?"text/javascript":"style"===n.lastTagName?"text/css":"text/plain",e=this.modeService.getMode(r)}return null===e&&(e=this.modeService.getMode("text/plain")),{mode:e,missingModePromise:i}},e.prototype.getLeavingNestedModeData=function(t,e){var n=e.lastTagName,i=new RegExp("<\\/"+n+"\\s*>","i"),r=i.exec(t);return null!==r?{nestedModeBuffer:t.substring(0,r.index),bufferAfterNestedMode:t.substring(r.index),stateAfterNestedMode:new y(this,v.Content,"","","","",0)}:null},e.prototype.configure=function(t){if(this.compatWorkerService)return this.compatWorkerService.isInMainThread?this._configureWorker(t):this._worker(function(e){return e._doConfigure(t)})},e.prototype._configureWorker=function(t){return this._worker(function(e){return e._doConfigure(t)})},e.prototype.provideLinks=function(t){var e=this.workspaceContextService.getWorkspace(),n=e?e.resource:null;return this._provideLinks(t,n)},e.prototype._provideLinks=function(t,e){return this._worker(function(n){return n.provideLinks(t,e)})},e.prototype._provideDocumentRangeFormattingEdits=function(t,e,n){return this._worker(function(i){return i.provideDocumentRangeFormattingEdits(t,e,n)})},e.prototype._provideDocumentHighlights=function(t,e,n){return void 0===n&&(n=!1),this._worker(function(i){return i.provideDocumentHighlights(t,e,n)})},e.prototype._provideCompletionItems=function(t,e){return this._worker(function(n){return n.provideCompletionItems(t,e)})},e.LANG_CONFIG={wordPattern:a.createWordRegExp("#-?%"),comments:{blockComment:["<!--","-->"]},brackets:[["<!--","-->"],["<",">"]],__electricCharacterSupport:{embeddedElectricCharacters:["*","}","]",")"]},autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}],surroundingPairs:[{open:'"',close:'"'},{open:"'",close:"'"}],onEnterRules:[{beforeText:new RegExp("<(?!(?:"+c.EMPTY_ELEMENTS.join("|")+"))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$","i"),afterText:/^<\/([_:\w][_:\w-.\d]*)\s*>$/i,action:{indentAction:o.IndentAction.IndentOutdent}},{beforeText:new RegExp("<(?!(?:"+c.EMPTY_ELEMENTS.join("|")+"))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$","i"),action:{indentAction:o.IndentAction.Indent}}]},e.$_configureWorker=l.CompatWorkerAttr(e,e.prototype._configureWorker),e.$_provideLinks=l.CompatWorkerAttr(e,e.prototype._provideLinks),e.$_provideDocumentRangeFormattingEdits=l.CompatWorkerAttr(e,e.prototype._provideDocumentRangeFormattingEdits),e.$_provideDocumentHighlights=l.CompatWorkerAttr(e,e.prototype._provideDocumentHighlights),e.$_provideCompletionItems=l.CompatWorkerAttr(e,e.prototype._provideCompletionItems),e=i([r(1,d.IInstantiationService),r(2,u.IModeService),r(3,l.ICompatWorkerService),r(4,f.IWorkspaceContextService)],e)}(a.CompatMode);e.HTMLMode=k})}).call(this);