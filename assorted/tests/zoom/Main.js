(function (console) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Main = function() { };
Main.main = function() {
	window.onload = function() {
		new DemoApp();
	};
};
var DemoApp = function() {
	new zoomeffects_ImgZoomGlass("imgzoom1");
	new zoomeffects_ImgZoomFull("imgzoom2");
	new zoomeffects_ImgZoomPane("imgzoom3");
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var zoomeffects_ImgZoomFull = function(id) {
	this.containerElement = window.document.getElementById(id);
	if(this.containerElement == null) throw new js__$Boot_HaxeError("could not find imgzoom with ID: " + id);
	this.imagePath = this.containerElement.getAttribute("data-image");
	this.getImageSize();
};
zoomeffects_ImgZoomFull.prototype = {
	getImageSize: function() {
		var _g = this;
		var img;
		var _this = window.document;
		img = _this.createElement("img");
		img.onload = function() {
			_g.imageWidth = img.width;
			_g.imageHeight = img.height;
			_g.createListeners();
		};
		img.src = this.imagePath;
	}
	,createListeners: function() {
		var _g = this;
		this.zoomfactor = this.imageWidth / this.containerElement.clientWidth;
		this.containerElement.onmouseenter = $bind(this,this.showOverlay);
		this.containerElement.onmouseleave = $bind(this,this.hideOverlay);
		this.containerElement.onmousemove = $bind(this,this.handleMove);
		this.containerElement.ontouchmove = $bind(this,this.handleTouchMove);
		this.containerElement.ontouchstart = function(touch) {
			if(_g.touchID == null) _g.touchID = touch.identifier;
		};
		this.containerElement.ontouchend = function(touch1) {
			if(_g.touchID == touch1.identifier) _g.touchID = null;
		};
		this.containerElement.style.backgroundImage = "url(" + this.imagePath + ")";
		this.containerElement.style.height = "" + this.imageHeight / this.zoomfactor + "px";
	}
	,handleTouchMove: function(event) {
		this.doMove(event.changedTouches.item(this.touchID).pageX,event.changedTouches.item(this.touchID).pageY);
		event.preventDefault();
	}
	,handleMove: function(event) {
		this.doMove(event.pageX,event.pageY);
	}
	,doMove: function(pageX,pageY) {
		var posX = pageX - this.containerElement.offsetLeft;
		var posY = pageY - this.containerElement.offsetTop;
		var halfWidth = this.containerElement.clientWidth / 2;
		var halfHeight = this.containerElement.clientHeight / 2;
		var distFromCenterX = (posX - halfWidth) / halfWidth + 1;
		var distFromCenterY = (posY - halfHeight) / halfHeight + 1;
		if(distFromCenterX < 0) distFromCenterX = 0;
		if(distFromCenterX > 2) distFromCenterX = 2;
		if(distFromCenterY < 0) distFromCenterY = 0;
		if(distFromCenterY > 2) distFromCenterY = 2;
		var offsetX = -posX * this.zoomfactor + distFromCenterX * halfWidth;
		var offsetY = -posY * this.zoomfactor + distFromCenterY * halfHeight;
		this.containerElement.style.backgroundPosition = "" + offsetX + "px " + offsetY + "px";
		this.containerElement.style.left = "" + pageX + "px";
		this.containerElement.style.top = "" + pageY + "px";
	}
	,showOverlay: function() {
		this.containerElement.classList.add("imgzoomfullin");
	}
	,hideOverlay: function() {
		this.containerElement.classList.remove("imgzoomfullin");
		this.containerElement.style.backgroundPosition = "0px 0px";
	}
};
var zoomeffects_ImgZoomGlass = function(id) {
	this.overlayWidth = 200;
	var _g = this;
	this.containerElement = window.document.getElementById(id);
	if(this.containerElement == null) throw new js__$Boot_HaxeError("could not find slider with ID: " + id);
	this.overlayElement = this.containerElement.querySelector(".zoomoverlayglass");
	this.imgElement = this.containerElement.querySelector("img");
	this.zoomfactor = this.imgElement.naturalWidth / this.imgElement.clientWidth;
	this.imgElement.onmouseenter = $bind(this,this.showOverlay);
	this.imgElement.onmousemove = $bind(this,this.handleMove);
	this.imgElement.ontouchmove = $bind(this,this.handleTouchMove);
	this.imgElement.onmouseleave = $bind(this,this.mouseLeave);
	this.overlayElement.onmousemove = $bind(this,this.handleMove);
	this.imgElement.ontouchstart = function(touch) {
		if(_g.touchID == null) _g.touchID = touch.identifier;
	};
	this.imgElement.ontouchend = function(touch1) {
		if(_g.touchID == touch1.identifier) _g.touchID = null;
	};
	this.overlayElement.style.backgroundImage = "url(" + this.imgElement.src + ")";
	this.overlayElement.style.width = "" + this.overlayWidth + "px";
	this.overlayElement.style.height = "" + this.overlayWidth + "px";
};
zoomeffects_ImgZoomGlass.prototype = {
	mouseLeave: function(event) {
		if(event.relatedTarget == this.overlayElement) return;
		this.hideOverlay();
	}
	,handleMove: function(event) {
		this.doMove(event.pageX,event.pageY);
	}
	,handleTouchMove: function(event) {
		this.doMove(event.changedTouches.item(this.touchID).pageX,event.changedTouches.item(this.touchID).pageY);
		event.preventDefault();
	}
	,doMove: function(pageX,pageY) {
		var posX = pageX - this.imgElement.offsetLeft;
		var posY = pageY - this.imgElement.offsetTop;
		this.overlayElement.style.backgroundPosition = "" + (-posX * this.zoomfactor + this.overlayWidth / 2) + "px " + (-posY * this.zoomfactor + this.overlayWidth / 2) + "px";
		this.overlayElement.style.left = "" + (pageX - this.overlayWidth / 2) + "px";
		this.overlayElement.style.top = "" + (pageY - this.overlayWidth / 2) + "px";
		if(posX < 0 || posX > this.imgElement.clientWidth || posY < 0 || posY > this.imgElement.clientHeight) this.hideOverlay();
	}
	,showOverlay: function() {
		this.overlayElement.style.display = "inline-block";
	}
	,hideOverlay: function() {
		this.overlayElement.style.display = "none";
	}
};
var zoomeffects_ImgZoomPane = function(id) {
	this.overlayWidth = 400;
	var _g = this;
	this.containerElement = window.document.getElementById(id);
	if(this.containerElement == null) throw new js__$Boot_HaxeError("could not find slider with ID: " + id);
	this.overlayElement = this.containerElement.querySelector(".zoomoverlaypane");
	this.windowElement = this.containerElement.querySelector(".zoomoverlaywindow");
	this.imgElement = this.containerElement.querySelector("img");
	this.zoomfactor = this.imgElement.naturalWidth / this.imgElement.clientWidth;
	this.imgElement.onmouseenter = $bind(this,this.showOverlay);
	this.imgElement.onmousemove = $bind(this,this.handleMove);
	this.imgElement.ontouchmove = $bind(this,this.handleTouchMove);
	this.imgElement.onmouseleave = $bind(this,this.mouseLeave);
	this.windowElement.onmousemove = $bind(this,this.handleMove);
	this.imgElement.ontouchstart = function(touch) {
		if(_g.touchID == null) _g.touchID = touch.identifier;
	};
	this.imgElement.ontouchend = function(touch1) {
		if(_g.touchID == touch1.identifier) _g.touchID = null;
	};
	this.overlayElement.style.backgroundImage = "url(" + this.imgElement.src + ")";
	this.overlayElement.style.width = "" + this.overlayWidth + "px";
	this.overlayElement.style.height = "" + this.overlayWidth + "px";
	this.windowElement.style.width = "" + this.overlayWidth / this.zoomfactor + "px";
	this.windowElement.style.height = "" + this.overlayWidth / this.zoomfactor + "px";
};
zoomeffects_ImgZoomPane.prototype = {
	mouseLeave: function(event) {
		if(event.relatedTarget == this.windowElement) return;
		this.hideOverlay();
	}
	,handleTouchMove: function(event) {
		this.doMove(event.changedTouches.item(this.touchID).pageX,event.changedTouches.item(this.touchID).pageY);
		event.preventDefault();
	}
	,handleMove: function(event) {
		this.doMove(event.pageX,event.pageY);
	}
	,doMove: function(pageX,pageY) {
		var posX = pageX - this.imgElement.offsetLeft;
		var posY = pageY - this.imgElement.offsetTop;
		this.overlayElement.style.backgroundPosition = "" + (-posX * this.zoomfactor + this.overlayWidth / 2) + "px " + (-posY * this.zoomfactor + this.overlayWidth / 2) + "px";
		this.windowElement.style.left = "" + (pageX - this.windowElement.clientWidth / 2) + "px";
		this.windowElement.style.top = "" + (pageY - this.windowElement.clientHeight / 2) + "px";
		if(posX < 0 || posX > this.imgElement.clientWidth || posY < 0 || posY > this.imgElement.clientHeight) this.hideOverlay();
	}
	,showOverlay: function() {
		this.overlayElement.style.display = "inline-block";
		this.windowElement.style.display = "inline-block";
	}
	,hideOverlay: function() {
		this.overlayElement.style.display = "none";
		this.windowElement.style.display = "none";
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
