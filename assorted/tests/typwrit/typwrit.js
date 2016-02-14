(function (console) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
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
var StringTools = function() { };
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
var Typwrit = function() {
	this.convo = { id : "first", prompt : "\r\n\t\t*cough*\r\n\r\n\t\t*ahem*\r\n\r\n\t\tIs this thing on?\r\n\r\n\t\t*tap* *tap*\r\n\t\t", responses : [{ response : "Seems like it.", prompt : "Oh, uh, ok.", responses : [{ response : "uh, ok, and?", switchTo : "first"},{ response : "yeah continue.", switchTo : "first"}]}]};
	this.convoIDs = new haxe_ds_StringMap();
	this.options = [];
	window.onload = $bind(this,this.ready);
};
Typwrit.main = function() {
	Typwrit.instance = new Typwrit();
};
Typwrit.prototype = {
	ready: function() {
		this.page = window.document.getElementById("page");
		this.options[0] = window.document.getElementById("op1");
		this.options[1] = window.document.getElementById("op2");
		this.resetTypewriter();
		this.parseConvoIDs(this.convo);
		this.playConvo(this.convo);
	}
	,parseConvoIDs: function(convo) {
		if(convo.id != null) {
			this.convoIDs.set(convo.id,convo);
			convo;
		}
		if(convo.responses != null) {
			var _g = 0;
			var _g1 = convo.responses;
			while(_g < _g1.length) {
				var r = _g1[_g];
				++_g;
				this.parseConvoIDs(r);
			}
		}
	}
	,playConvo: function(convo) {
		var _g2 = this;
		this.resetTypewriter();
		var curnode = convo;
		if(curnode.switchTo != null) {
			if(this.convoIDs.get(curnode.switchTo) != null) {
				this.playConvo(this.convoIDs.get(curnode.switchTo));
				return;
			} else throw new js__$Boot_HaxeError("convoid: " + "'" + curnode.switchTo + "'" + " not defined.");
		}
		if(curnode.responses != null) {
			var _g1 = 0;
			var _g = curnode.responses.length;
			while(_g1 < _g) {
				var i = [_g1++];
				this.options[i[0]].onclick = (function(i) {
					return function() {
						_g2.playConvo(curnode.responses[i[0]]);
						return;
					};
				})(i);
				this.options[i[0]].onkeypress = (function(i) {
					return function(code) {
						console.log(code);
						if(code.which == 13 || code.keyCode == 13) {
							_g2.playConvo(curnode.responses[i[0]]);
							return;
						}
					};
				})(i);
				this.options[i[0]].style.display = null;
			}
			if(this.options.length > curnode.responses.length) {
				var _g11 = curnode.responses.length;
				var _g3 = this.options.length;
				while(_g11 < _g3) {
					var i1 = _g11++;
					this.options[i1].style.display = "none";
				}
			}
		}
		if(curnode.prompt != null) {
			console.log(curnode.prompt);
			this.typeLetters(StringTools.trim(curnode.prompt),this.page,function() {
				_g2.playResponses(curnode);
			});
		}
	}
	,playResponses: function(convo,index) {
		if(index == null) index = 0;
		if(index >= convo.responses.length) return;
		this.typeLetters(convo.responses[index].response,this.options[index],(function(f,a1,a2) {
			return function() {
				f(a1,a2);
			};
		})($bind(this,this.playResponses),convo,++index));
	}
	,typeLetters: function(message,element,onComplete) {
		if(message.length == 0) {
			onComplete();
			return;
		}
		element.innerHTML += message.charAt(0);
		message = HxOverrides.substr(message,1,null);
		haxe_Timer.delay((function(f,a1,a2,a3) {
			return function() {
				f(a1,a2,a3);
			};
		})($bind(this,this.typeLetters),message,element,onComplete),Std["int"](50 + Math.random() * 20));
	}
	,resetTypewriter: function() {
		this.page.innerHTML = "";
		var _g = 0;
		var _g1 = this.options;
		while(_g < _g1.length) {
			var o = _g1[_g];
			++_g;
			o.innerHTML = "";
			o.style.display = "none";
			o.blur();
		}
	}
};
var haxe_IMap = function() { };
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
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
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
var __map_reserved = {}
Typwrit.main();
})(typeof console != "undefined" ? console : {log:function(){}});
