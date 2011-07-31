/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["sen.pages.items"]){dojo._hasResource["sen.pages.items"]=true;dojo.provide("sen.pages.items");dojo.require("dojo.fx");dojo.require("dojo.NodeList-fx");dojo.require("dojo.NodeList-traverse");dojo.require("dojo.NodeList-manipulate");dojo.declare("sen.pages.items",null,{connectedEvents:null,inFlight:null,init:function(){this.connectedEvents={"comments":[]};this.inFlight={"comments":[]};this.initUi();this.initEvents();},initUi:function(){dojo.query("form.new_comment input#comment_submit").forEach(function(_1){dojo.style(_1,"display","none");});},initEvents:function(){this.connectCommentEvents();},connectCommentEvents:function(){var _2=this;dojo.query("form.new_comment").forEach(function(_3){var _4=dojo.connect(_3,"onsubmit",_2,"addComment");_2.connectedEvents.comments.push(_4);var _4=dojo.connect(_3,"onkeypress",_2,"addComment");_2.connectedEvents.comments.push(_4);});dojo.query("a.comments-show-hide").forEach(function(_5){var _6=dojo.connect(_5,"onclick",_2,"toggleComments");_2.connectedEvents.comments.push(_6);});dojo.query("form.new_comment textarea").forEach(function(_7){if(dojo.attr(_7,"value")!="Write a comment..."){dojo.addClass(_7,"active-comment-box");}var _8=dojo.connect(_7,"onfocus",_2,"toggleCommentBoxHeight");_2.connectedEvents.comments.push(_8);});dojo.query("form.new_comment textarea").forEach(function(_9){var _a=dojo.connect(_9,"onblur",_2,"toggleCommentBoxHeight");_2.connectedEvents.comments.push(_a);});},disconnectCommentEvents:function(_b){dojo.forEach(this.connectedEvents.comments,dojo.disconnect);this.connectedEvents.comments=[];},toggleCommentBoxHeight:function(e){if(e.type=="blur"){this.commentBlur(e.target);}else{this.commentFocus(e.target);}},commentBlur:function(_c){dojo.animateProperty({node:_c,duration:200,properties:{height:{start:"30",end:"15"}}}).play();if(dojo.attr(_c,"value")==""){dojo.attr(_c,"value","Write a comment...");dojo.removeClass(_c,"active-comment-box");}},commentFocus:function(_d){dojo.animateProperty({node:_d,duration:200,properties:{height:{start:"15",end:"30"}}}).play();if(dojo.attr(_d,"value")=="Write a comment..."){dojo.attr(_d,"value","");}dojo.addClass(_d,"active-comment-box");},toggleComments:function(e){dojo.stopEvent(e);var _e=this,_f=new dojo.NodeList(e.target);if(_f.parents(".sidebar-box").query("ul.comment-list").length>0){_f.parents(".sidebar-box").query("ul.comment-list").forEach(function(_10){dojo.toggleClass(_10,"comment-list-hidden");});}else{_f.parents(".sidebar-box").next().query("ul.comment-list").forEach(function(_11){dojo.toggleClass(_11,"comment-list-hidden");});}},addComment:function(e){if(dojo.getNodeProp(e.target,"tagName").toLowerCase()!=="form"){if(e.keyCode==dojo.keys.ENTER&&e.shiftKey==false){dojo.stopEvent(e);var nl=new dojo.NodeList(e.target),_12=nl.parents("form").attr("action"),_13=nl.parents("form");}else{if(e.keyCode==dojo.keys.ESCAPE){dojo.attr(e.target,"value","");e.target.blur();this.commentBlur(e.target);return;}else{return;}}}else{dojo.stopEvent(e);var _12=dojo.attr(e.target,"action"),_13=new dojo.NodeList(e.target);}var _14=this,_15=_13.query(".new-comment-commentable-id").first().attr("value"),_16=_13.query(".new-comment-text").first().attr("value");if(this.inFlight.comments[_15]!==true&&_16!=""){dojo.style(e.target,"display","none");_13.before("<div class=\"loader\"></div>");this.inFlight.comments[_15]=true;dojo.xhrPost({url:_12,handleAs:"json",content:{"comment[commentable_id]":_15,"comment[commentable_type]":_13.query(".new-comment-commentable-type").first().attr("value"),"comment[comment]":_16,"authenticity_token":dojo.global.AUTH_TOKEN,"utf8":"✓"},load:function(_17){if(_17.success&&_17.success==false){}else{var _18=String(_17.comment_html).replace(/\"clearfix\"/,"\"clearfix new-comment\" style=\"opacity:0;\"");_13.parents(".comment-list").children("li.no-bg").before(_18);_13.parents(".comment-list").children("li.new-comment").fadeIn({auto:true,duration:800});var _19=_13.parents("div.inner-content").prev().query("a.comments-show-hide").first(),_1a=_19.attr("innerHTML");regExp=/([0-9]+)/g,currentCount=String(_1a).match(regExp);var _1b=String(_1a).replace(regExp,parseInt(currentCount)+1);_19.attr("innerHTML",_1b);_13.query("textarea").attr("value","");dojo.style(e.target,"display",null);_13.parent().query("div.loader").remove();_14.inFlight.comments[_15]=false;}},error:function(err,_1c){alert("Oops! Something went wrong.");dojo.style(e.target,"display",null);_13.parent().query("div.loader").remove();_14.inFlight.comments[_15]=false;}});}return;},unload:function(){this.disconnectCommentEvents();}});}