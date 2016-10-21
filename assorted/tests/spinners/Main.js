(function (console) { "use strict";
var Main = function() { };
Main.main = function() {
	window.onload = function() {
		new DemoApp();
	};
};
var DemoApp = function() {
	new Spinner(0,0,5);
	new Spinner(500,100,15);
	new Spinner(1000,0,50);
};
var Spinner = function(x,y,time) {
	this["namespace"] = "http://www.w3.org/2000/svg";
	var _g = this;
	this.element = this.createSVG();
	this.element.setAttribute("style","position: absolute; left:" + x + "; top:" + y + ";");
	this.element.setAttribute("width","250");
	this.element.setAttribute("height","250");
	var arc = this.createArc(65,65,40,0,"none","#00517a",30);
	this.element.appendChild(arc);
	this.element.appendChild(this.createCircle(65,65,42,"#00b1eb","#555555",1.5));
	this.element.appendChild(this.createCircle(65,65,55,"none","#555555",7));
	this.element.appendChild(this.createLine(65,45,40,null,"none","#FFFFFF",3.75,"round"));
	this.element.appendChild(this.createLine(45,65,40,false,"none","#FFFFFF",3.75,"round"));
	window.document.body.appendChild(this.element);
	var a = 0;
	var timer = new haxe_Timer(Math.floor(time * 1000 / 360));
	timer.run = function() {
		a++;
		a %= 360;
		arc.setAttribute("d",_g.createArcData(65,65,40,a).join(" "));
	};
};
Spinner.prototype = {
	createSVG: function() {
		var svg = window.document.createElementNS(this["namespace"],"svg");
		return svg;
	}
	,createCircle: function(cx,cy,r,fill,stroke,strokeWidth) {
		var circle = window.document.createElementNS(this["namespace"],"circle");
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
		var path = window.document.createElementNS(this["namespace"],"path");
		var data = ["M",startX,startY,vertical?"v":"h",length];
		path.setAttribute("d",data.join(" "));
		if(fill != null) path.setAttribute("fill",fill);
		if(stroke != null) path.setAttribute("stroke",stroke);
		if(strokeCap != null) path.setAttribute("stroke-linecap",strokeCap);
		if(strokeWidth != null) path.setAttribute("stroke-width",strokeWidth == null?"null":"" + strokeWidth);
		return path;
	}
	,createArc: function(cx,cy,radius,endAngle,fill,stroke,strokeWidth,strokeCap) {
		var path = window.document.createElementNS(this["namespace"],"path");
		var data = this.createArcData(cx,cy,radius,endAngle);
		path.setAttribute("d",data.join(" "));
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
		var data = ["M",start.x,start.y,"A",radius,radius,0,largeArc,1,end.x,end.y];
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
	run: function() {
	}
};
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
