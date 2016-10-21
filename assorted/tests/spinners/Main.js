(function (console) { "use strict";
var Main = function() { };
Main.main = function() {
	window.onload = function() {
		new DemoApp();
	};
};
var DemoApp = function() {
	var first = new Spinner(0,0,5);
	first.onclick = function() {
		if(first.running) first.stopTimer(); else first.startTimer();
	};
	var second = new Spinner(500,100,15);
	second.onclick = function() {
		second.reuse(500,500,30);
	};
	var third = new Spinner(1000,0,50);
	third.onfinished = function() {
		third.destroy();
	};
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
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
