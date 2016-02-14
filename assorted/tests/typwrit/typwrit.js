(function (console) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
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
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
};
var StringTools = function() { };
StringTools.__name__ = true;
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
	this.convo = { id : "first", prompt : "\r\n\t\t*cough*\r\n\r\n\t\t*ahem*\r\n\r\n\t\tIs this thing on?\r\n\r\n\t\t*tap* *tap*\r\n\t\t", responses : [{ response : "Seems like it.", prompt : "Oh, uh, ok.", responses : [{ response : "Uh, ok, and?", id : "interviewstart", prompt : "\r\n\t\t\t\tNormally we would conduct this in person,\r\n\t\t\t\tbut you understand.\r\n\r\n\t\t\t\tIn these circumstances.\r\n\t\t\t\t", responses : [{ response : "...", prompt : "\r\n\t\t\t\t\tI'm equally out of my element here,\r\n\t\t\t\t\tsorry,\r\n\r\n\t\t\t\t\tgive me a minute to find my notes.\r\n\t\t\t\t\t", responses : [{ response : "Uh, ok.", prompt : "\r\n\t\t\t\t\t\t...\r\n\t\t\t\t\t\t.....\r\n\r\n\t\t\t\t\t\tSorry I mixed up my files,\r\n\r\n\t\t\t\t\t\tWhat was your name?\r\n\t\t\t\t\t\t", responses : [{ response : "John Doe", setVal : [{ k : "firstname", v : "John"},{ k : "lastname", v : "Doe"}], id : "gotname", prompt : "Ok *(firstname)*."},{ response : "Jack Turner", setVal : [{ k : "firstname", v : "Jack"},{ k : "lastname", v : "Turner"}], switchTo : "gotname"}]}]}]},{ response : "Yeah continue.", switchTo : "interviewstart"}]}]};
	this.typeIndex = 0;
	this.values = new haxe_ds_StringMap();
	this.convoIDs = new haxe_ds_StringMap();
	this.options = [];
	window.onload = $bind(this,this.ready);
};
Typwrit.__name__ = true;
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
	,playConvo: function(convo,ignoreVals) {
		if(ignoreVals == null) ignoreVals = false;
		var _g2 = this;
		this.resetTypewriter();
		var curnode = convo;
		if(!ignoreVals) {
			if(curnode.setVal != null) {
				var _g = 0;
				var _g1 = curnode.setVal;
				while(_g < _g1.length) {
					var s = _g1[_g];
					++_g;
					var v = s.v;
					this.values.set(s.k,v);
					v;
				}
				console.log(this.values.toString());
			}
		}
		if(curnode.switchTo != null) {
			if(this.convoIDs.get(curnode.switchTo) != null) {
				this.playConvo(this.convoIDs.get(curnode.switchTo),ignoreVals);
				return;
			} else throw new js__$Boot_HaxeError("convoid: " + "'" + curnode.switchTo + "'" + " not defined.");
		}
		if(curnode.responses != null) {
			var _g11 = 0;
			var _g3 = curnode.responses.length;
			while(_g11 < _g3) {
				var i = [_g11++];
				this.options[i[0]].onclick = (function(i) {
					return function() {
						_g2.playConvo(curnode.responses[i[0]]);
						return;
					};
				})(i);
				this.options[i[0]].onkeypress = (function(i) {
					return function(code) {
						if(code.which == 13 || code.keyCode == 13) {
							_g2.playConvo(curnode.responses[i[0]]);
							return;
						}
					};
				})(i);
				this.options[i[0]].style.display = null;
			}
			if(this.options.length > curnode.responses.length) {
				var _g12 = curnode.responses.length;
				var _g4 = this.options.length;
				while(_g12 < _g4) {
					var i1 = _g12++;
					this.options[i1].style.display = "none";
				}
			}
		}
		if(curnode.prompt != null) this.typeLetters(this.replaceText(curnode.prompt),this.page,function() {
			_g2.playResponses(curnode);
		},++this.typeIndex);
	}
	,playResponses: function(convo,index) {
		if(index == null) index = 0;
		if(convo.responses == null || index >= convo.responses.length) return;
		this.typeLetters(convo.responses[index].response,this.options[index],(function(f,a1,a2) {
			return function() {
				f(a1,a2);
			};
		})($bind(this,this.playResponses),convo,++index),++this.typeIndex);
	}
	,typeLetters: function(message,element,onComplete,curIndex) {
		if(curIndex != null) {
			if(curIndex != this.typeIndex) return;
		}
		if(message.length == 0) {
			onComplete();
			return;
		}
		element.innerHTML += message.charAt(0);
		message = HxOverrides.substr(message,1,null);
		haxe_Timer.delay((function(f,a1,a2,a3,a4) {
			return function() {
				f(a1,a2,a3,a4);
			};
		})($bind(this,this.typeLetters),message,element,onComplete,curIndex),Std["int"](50 + Math.random() * 20));
	}
	,replaceText: function(text) {
		text = StringTools.trim(text);
		var replaceEReg = new EReg("\\*\\((.*?)\\)\\*","");
		if(replaceEReg.match(text)) {
			console.log(replaceEReg.matched(0));
			text = replaceEReg.replace(text,(function($this) {
				var $r;
				var key = replaceEReg.matched(1);
				$r = $this.values.get(key);
				return $r;
			}(this)));
		}
		return text;
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
haxe_IMap.__name__ = true;
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
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
haxe_ds_StringMap.__name__ = true;
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
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,toString: function() {
		var s = new StringBuf();
		s.b += "{";
		var keys = this.arrayKeys();
		var _g1 = 0;
		var _g = keys.length;
		while(_g1 < _g) {
			var i = _g1++;
			var k = keys[i];
			if(k == null) s.b += "null"; else s.b += "" + k;
			s.b += " => ";
			s.add(Std.string(__map_reserved[k] != null?this.getReserved(k):this.h[k]));
			if(i < keys.length) s.b += ", ";
		}
		s.b += "}";
		return s.b;
	}
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
var __map_reserved = {}
Typwrit.main();
})(typeof console != "undefined" ? console : {log:function(){}});
