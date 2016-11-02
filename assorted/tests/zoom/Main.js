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
	new ImgZoom("imgzoom1");
};
var ImgZoom = function(id) {
	this.overlayWidth = 200;
	this.containerElement = window.document.getElementById(id);
	if(this.containerElement == null) throw new js__$Boot_HaxeError("could not find slider with ID: " + id);
	this.overlayElement = this.containerElement.querySelector(".zoomoverlay");
	this.imgElement = this.containerElement.querySelector("img");
	this.zoomfactor = this.imgElement.naturalWidth / this.imgElement.clientWidth;
	this.imgElement.onmouseenter = $bind(this,this.showOverlay);
	this.imgElement.onmouseleave = $bind(this,this.mouseLeave);
	this.imgElement.onmousemove = $bind(this,this.handleMove);
	this.overlayElement.onmousemove = $bind(this,this.handleMove);
	this.overlayElement.style.backgroundImage = "url(" + this.imgElement.src + ")";
	this.overlayElement.style.width = "" + this.overlayWidth + "px";
	this.overlayElement.style.height = "" + this.overlayWidth + "px";
};
ImgZoom.prototype = {
	mouseLeave: function(event) {
		if(event.relatedTarget == this.overlayElement) return;
		this.hideOverlay();
	}
	,handleMove: function(event) {
		var posX = event.pageX - this.imgElement.offsetLeft;
		var posY = event.pageY - this.imgElement.offsetTop;
		this.overlayElement.style.backgroundPosition = "" + (-posX * this.zoomfactor + this.overlayWidth / 2) + "px " + (-posY * this.zoomfactor + this.overlayWidth / 2) + "px";
		this.overlayElement.style.left = "" + event.pageX + "px";
		this.overlayElement.style.top = "" + event.pageY + "px";
	}
	,showOverlay: function() {
		this.overlayElement.style.display = "inline-block";
	}
	,hideOverlay: function() {
		this.overlayElement.style.display = "none";
	}
};
var Slider = function(id,vertical) {
	this.thumbWidth = 40;
	this.trackLength = 500;
	this.verticalSlider = vertical;
	this.shellElement = window.document.getElementById(id);
	if(this.shellElement == null) throw new js__$Boot_HaxeError("could not find slider with ID: " + id);
	this.sliderElement = this.shellElement.querySelector(".slider");
	this.thumbElement = this.shellElement.querySelector(".sliderthumb");
	this.trackElement = this.shellElement.querySelector(".slidertrack");
	this.sliderElement.oninput = $bind(this,this.valueChange);
	this.sliderElement.onchange = $bind(this,this.valueChange);
	this.setValue(0);
};
Slider.prototype = {
	valueChange: function() {
		var value = this.sliderElement.valueAsNumber;
		var max = parseFloat(this.sliderElement.max);
		var min = parseFloat(this.sliderElement.min);
		var borderWidth = 2;
		var trackSize = this.trackLength - this.thumbWidth;
		var trackWidth = 8;
		var offset = this.thumbWidth / 2 - trackWidth / 2 - borderWidth;
		var percent = value / (max - min);
		console.log(percent);
		var location;
		if(this.verticalSlider) location = (1 - percent) * trackSize; else location = percent * trackSize;
		this.thumbElement.style.top = (this.verticalSlider?location:0) + "px";
		this.thumbElement.style.left = (this.verticalSlider?0:location) + "px";
		this.thumbElement.style.width = this.thumbWidth + "px";
		this.thumbElement.style.height = this.thumbWidth + "px";
		this.shellElement.style.height = (this.verticalSlider?this.trackLength:this.thumbWidth) + "px";
		this.shellElement.style.width = (this.verticalSlider?this.thumbWidth:this.trackLength) + "px";
		this.trackElement.style.height = (this.verticalSlider?this.trackLength - borderWidth * 2:trackWidth) + "px";
		this.trackElement.style.width = (this.verticalSlider?trackWidth:this.trackLength - borderWidth * 2) + "px";
		this.trackElement.style.left = (this.verticalSlider?offset:0) + "px";
		this.trackElement.style.top = (this.verticalSlider?0:offset) + "px";
	}
	,setValue: function(value) {
		this.sliderElement.valueAsNumber = value;
		this.valueChange();
	}
	,getValue: function() {
		return this.sliderElement.valueAsNumber;
	}
};
var Spinner = function(x,y,time) {
	this.running = false;
	this.currentAngle = 0;
	this["namespace"] = "http://www.w3.org/2000/svg";
	this.buildTimerDOM(x,y);
	this.reuse(x,y,time);
};
Spinner.prototype = {
	reuse: function(x,y,time) {
		this.duration = time;
		this.currentAngle = 0;
		this.setPosition(x,y);
		this.onclick = null;
		this.onfinished = null;
		this.startTimer();
	}
	,buildTimerDOM: function(x,y) {
		var _g = this;
		var _this = window.document;
		this.container = _this.createElement("div");
		var element = this.createSVG();
		this.container.appendChild(element);
		element.setAttribute("width","130");
		element.setAttribute("height","130");
		this.arcElement = this.createArc(65,65,40,0,"none","#00517a",30);
		element.appendChild(this.arcElement);
		var button = this.createSVG();
		button.appendChild(this.createCircle(65,65,42,"#00b1eb","#555555",1.5));
		button.appendChild(this.createLine(65,45,40,null,"none","#FFFFFF",3.75,"round"));
		button.appendChild(this.createLine(45,65,40,false,"none","#FFFFFF",3.75,"round"));
		button.onclick = function() {
			if(_g.onclick != null) _g.onclick();
		};
		element.appendChild(button);
		element.appendChild(this.createCircle(65,65,55,"none","#555555",7));
		window.document.body.appendChild(this.container);
	}
	,resetTimer: function() {
		this.currentAngle = 0;
		this.startTimer();
	}
	,startTimer: function() {
		if(this.timer != null) this.timer.stop();
		this.timer = new haxe_Timer(Math.floor(this.duration * 1000 / 360));
		this.timer.run = $bind(this,this.tick);
		this.running = true;
	}
	,stopTimer: function() {
		this.timer.stop();
		this.running = false;
	}
	,tick: function() {
		this.currentAngle++;
		if(this.currentAngle >= 360) {
			if(this.onfinished != null) this.onfinished();
		}
		this.currentAngle %= 360;
		this.arcElement.setAttribute("d",this.createArcData(65,65,40,this.currentAngle));
	}
	,destroy: function() {
		this.timer.stop();
		this.container.remove();
	}
	,setPosition: function(x,y) {
		this.container.setAttribute("style","position: absolute; left:" + x + "px; top:" + y + "px;");
	}
	,hide: function() {
		this.container.style.display = "none";
	}
	,show: function() {
		this.container.style.display = "initial";
	}
	,createSVGElement: function(element) {
		return window.document.createElementNS(this["namespace"],element);
	}
	,createSVG: function() {
		var svg = this.createSVGElement("svg");
		return svg;
	}
	,createCircle: function(cx,cy,r,fill,stroke,strokeWidth) {
		var circle = this.createSVGElement("circle");
		circle.setAttribute("cx",cx == null?"null":"" + cx);
		circle.setAttribute("cy",cy == null?"null":"" + cy);
		circle.setAttribute("r",r == null?"null":"" + r);
		if(fill != null) circle.setAttribute("fill",fill);
		if(stroke != null) circle.setAttribute("stroke",stroke);
		if(strokeWidth != null) circle.setAttribute("stroke-width",strokeWidth == null?"null":"" + strokeWidth);
		return circle;
	}
	,createLine: function(startX,startY,length,vertical,fill,stroke,strokeWidth,strokeCap) {
		if(vertical == null) vertical = true;
		var path = this.createSVGElement("path");
		var data = ["M",startX,startY,vertical?"v":"h",length];
		path.setAttribute("d",data.join(" "));
		if(fill != null) path.setAttribute("fill",fill);
		if(stroke != null) path.setAttribute("stroke",stroke);
		if(strokeCap != null) path.setAttribute("stroke-linecap",strokeCap);
		if(strokeWidth != null) path.setAttribute("stroke-width",strokeWidth == null?"null":"" + strokeWidth);
		return path;
	}
	,createArc: function(cx,cy,radius,endAngle,fill,stroke,strokeWidth,strokeCap) {
		var path = this.createSVGElement("path");
		var data = this.createArcData(cx,cy,radius,endAngle);
		path.setAttribute("d",data);
		if(fill != null) path.setAttribute("fill",fill);
		if(stroke != null) path.setAttribute("stroke",stroke);
		if(strokeCap != null) path.setAttribute("stroke-linecap",strokeCap);
		if(strokeWidth != null) path.setAttribute("stroke-width",strokeWidth == null?"null":"" + strokeWidth);
		return path;
	}
	,createArcData: function(cx,cy,radius,endAngle) {
		var start = this.polarToCartesian(cx,cy,radius,0);
		var end = this.polarToCartesian(cx,cy,radius,endAngle);
		var largeArc;
		if(endAngle <= 180) largeArc = 0; else largeArc = 1;
		var data = "M " + start.x + " " + start.y + " A " + radius + " " + radius + " 0 " + largeArc + " 1 " + end.x + " " + end.y;
		return data;
	}
	,polarToCartesian: function(centerX,centerY,radius,degrees) {
		var radians = (degrees - 90) * Math.PI / 180.0;
		return { x : centerX + radius * Math.cos(radians), y : centerY + radius * Math.sin(radians)};
	}
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
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
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
