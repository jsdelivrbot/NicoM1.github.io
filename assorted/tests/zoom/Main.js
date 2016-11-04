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
var zoomeffects_ImgZoomBase = function(element,zoom) {
	var _g = this;
	this.mainElement = element;
	this.zoomFactor = zoom;
	this.mainElement.onmouseleave = $bind(this,this.zoomOut);
	this.mainElement.onmousemove = $bind(this,this.handleMove);
	this.mainElement.ontouchmove = $bind(this,this.handleTouchMove);
	window.document.addEventListener("touchstart",function(event) {
		if(event.target != _g.mainElement) _g.zoomOut();
	});
	this.mainElement.ontouchstart = function(touch) {
		if(_g.touchID == null) {
			_g.touchID = touch.identifier;
			_g.doMove(touch.pageX,touch.pageY);
		}
	};
	this.mainElement.ontouchend = function(touch1) {
		if(_g.touchID == touch1.identifier) _g.touchID = null;
	};
};
zoomeffects_ImgZoomBase.prototype = {
	mouseLeave: function(event) {
	}
	,handleMove: function(event) {
		this.doMove(event.pageX,event.pageY);
	}
	,handleTouchMove: function(event) {
		this.doMove(event.changedTouches.item(this.touchID).pageX,event.changedTouches.item(this.touchID).pageY);
		event.preventDefault();
	}
	,doMove: function(pageX,pageY) {
		if(pageX == null || pageY == null) return;
		this.zoomIn();
		var offsetX = this.getOffset(this.mainElement).x;
		var offsetY = this.getOffset(this.mainElement).y;
		var posX = pageX - offsetX;
		var posY = pageY - offsetY;
		this.renderZoom(-posX * this.zoomFactor,-posY * this.zoomFactor,posX,posY);
		if(posX < 0 || posX > this.mainElement.clientWidth || posY < 0 || posY > this.mainElement.clientHeight) this.zoomOut();
	}
	,renderZoom: function(backgroundX,backgroundY,mouseX,mouseY) {
	}
	,getOffset: function(element) {
		var x = 0;
		var y = 0;
		while(element != null && element.offsetLeft != null && element.offsetTop != null) {
			x += element.offsetLeft;
			y += element.offsetTop;
			element = element.offsetParent;
		}
		return { x : x, y : y};
	}
	,zoomIn: function() {
	}
	,zoomOut: function() {
		this.touchID = null;
	}
};
var zoomeffects_ImgZoomFull = function(id) {
	var containerElement = window.document.getElementById(id);
	if(containerElement == null) throw new js__$Boot_HaxeError("could not find imgzoom with ID: " + id);
	this.imgElement = containerElement.querySelector(".imgzoomfull");
	zoomeffects_ImgZoomBase.call(this,this.imgElement,0);
	this.imagePath = this.imgElement.getAttribute("data-image");
	this.getImageSize();
};
zoomeffects_ImgZoomFull.__super__ = zoomeffects_ImgZoomBase;
zoomeffects_ImgZoomFull.prototype = $extend(zoomeffects_ImgZoomBase.prototype,{
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
		this.zoomFactor = this.imageWidth / this.imgElement.clientWidth;
		this.imgElement.style.backgroundImage = "url(" + this.imagePath + ")";
		this.imgElement.style.height = "" + this.imageHeight / this.zoomFactor + "px";
	}
	,renderZoom: function(backgroundX,backgroundY,mouseX,mouseY) {
		var halfWidth = this.imgElement.clientWidth / 2;
		var halfHeight = this.imgElement.clientHeight / 2;
		var distFromCenterX = (mouseX - halfWidth) / halfWidth + 1;
		var distFromCenterY = (mouseY - halfHeight) / halfHeight + 1;
		if(distFromCenterX < 0) distFromCenterX = 0;
		if(distFromCenterX > 2) distFromCenterX = 2;
		if(distFromCenterY < 0) distFromCenterY = 0;
		if(distFromCenterY > 2) distFromCenterY = 2;
		backgroundX += distFromCenterX * halfWidth;
		backgroundY += distFromCenterY * halfHeight;
		this.imgElement.style.backgroundPosition = "" + backgroundX + "px " + backgroundY + "px";
	}
	,zoomIn: function() {
		this.imgElement.classList.add("imgzoomfullin");
	}
	,zoomOut: function() {
		this.imgElement.classList.remove("imgzoomfullin");
		this.imgElement.style.backgroundPosition = "0px 0px";
		zoomeffects_ImgZoomBase.prototype.zoomOut.call(this);
	}
});
var zoomeffects_ImgZoomOverlay = function(mainElement,overlayElement,width) {
	this.overlayElement = overlayElement;
	this.overlayWidth = width;
	zoomeffects_ImgZoomBase.call(this,mainElement,mainElement.naturalWidth / mainElement.clientWidth);
	overlayElement.onmousemove = $bind(this,this.handleMove);
};
zoomeffects_ImgZoomOverlay.__super__ = zoomeffects_ImgZoomBase;
zoomeffects_ImgZoomOverlay.prototype = $extend(zoomeffects_ImgZoomBase.prototype,{
	mouseLeave: function(event) {
		if(event.relatedTarget == this.overlayElement) return;
		this.zoomOut();
	}
	,zoomIn: function() {
		this.overlayElement.style.display = "inline-block";
	}
	,zoomOut: function() {
		this.overlayElement.style.display = "none";
		zoomeffects_ImgZoomBase.prototype.zoomOut.call(this);
	}
});
var zoomeffects_ImgZoomGlass = function(id) {
	var containerElement = window.document.getElementById(id);
	if(containerElement == null) throw new js__$Boot_HaxeError("could not find slider with ID: " + id);
	var overlayElement = containerElement.querySelector(".zoomoverlayglass");
	var imgElement = containerElement.querySelector("img");
	zoomeffects_ImgZoomOverlay.call(this,imgElement,overlayElement,200);
	overlayElement.style.backgroundImage = "url(" + imgElement.src + ")";
	overlayElement.style.width = "" + this.overlayWidth + "px";
	overlayElement.style.height = "" + this.overlayWidth + "px";
};
zoomeffects_ImgZoomGlass.__super__ = zoomeffects_ImgZoomOverlay;
zoomeffects_ImgZoomGlass.prototype = $extend(zoomeffects_ImgZoomOverlay.prototype,{
	renderZoom: function(backgroundX,backgroundY,mouseX,mouseY) {
		this.overlayElement.style.backgroundPosition = "" + (backgroundX + this.overlayWidth / 2) + "px " + (backgroundY + this.overlayWidth / 2) + "px";
		var offset = this.getOffset(this.mainElement);
		this.overlayElement.style.left = "" + (mouseX - this.overlayWidth / 2) + "px";
		this.overlayElement.style.top = "" + (mouseY - this.overlayWidth / 2) + "px";
	}
});
var zoomeffects_ImgZoomPane = function(id) {
	var containerElement = window.document.getElementById(id);
	if(containerElement == null) throw new js__$Boot_HaxeError("could not find slider with ID: " + id);
	var overlayElement = containerElement.querySelector(".zoomoverlaypane");
	this.windowElement = containerElement.querySelector(".zoomoverlaywindow");
	var imgElement = containerElement.querySelector("img");
	zoomeffects_ImgZoomOverlay.call(this,imgElement,overlayElement,400);
	this.windowElement.onmousemove = $bind(this,this.handleMove);
	overlayElement.style.backgroundImage = "url(" + imgElement.src + ")";
	overlayElement.style.width = "" + this.overlayWidth + "px";
	overlayElement.style.height = "" + this.overlayWidth + "px";
	this.windowElement.style.width = "" + this.overlayWidth / this.zoomFactor + "px";
	this.windowElement.style.height = "" + this.overlayWidth / this.zoomFactor + "px";
};
zoomeffects_ImgZoomPane.__super__ = zoomeffects_ImgZoomOverlay;
zoomeffects_ImgZoomPane.prototype = $extend(zoomeffects_ImgZoomOverlay.prototype,{
	renderZoom: function(backgroundX,backgroundY,mouseX,mouseY) {
		this.overlayElement.style.backgroundPosition = "" + (backgroundX + this.overlayWidth / 2) + "px " + (backgroundY + this.overlayWidth / 2) + "px";
		this.windowElement.style.left = "" + (mouseX - this.windowElement.clientWidth / 2) + "px";
		this.windowElement.style.top = "" + (mouseY - this.windowElement.clientHeight / 2) + "px";
	}
	,zoomIn: function() {
		this.windowElement.style.display = "inline-block";
		zoomeffects_ImgZoomOverlay.prototype.zoomIn.call(this);
	}
	,zoomOut: function() {
		this.windowElement.style.display = "none";
		zoomeffects_ImgZoomOverlay.prototype.zoomOut.call(this);
	}
});
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
