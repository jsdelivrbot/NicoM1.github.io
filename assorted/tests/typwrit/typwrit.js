(function (console) { "use strict";
var HxOverrides = function() { };
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var Std = function() { };
Std["int"] = function(x) {
	return x | 0;
};
var Typwrit = function() {
	this.text = "\r\nTest.\r\n\r\nSo this appears to be working?\r\n\r\nDo you hear me now?\r\n\r\nBye.\r\n";
	window.onload = $bind(this,this.ready);
};
Typwrit.main = function() {
	Typwrit.instance = new Typwrit();
};
Typwrit.prototype = {
	ready: function() {
		this.page = window.document.getElementById("page");
		this.typeLetters(this.text);
	}
	,typeLetters: function(message) {
		if(message.length == 0) return;
		this.page.innerHTML += message.charAt(0);
		message = HxOverrides.substr(message,1,null);
		haxe_Timer.delay((function(f,a1) {
			return function() {
				f(a1);
			};
		})($bind(this,this.typeLetters),message),Std["int"](50 + Math.random() * 20));
	}
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
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
Typwrit.main();
})(typeof console != "undefined" ? console : {log:function(){}});
