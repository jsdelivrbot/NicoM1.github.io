(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
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
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,__class__: EReg
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
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var Luxe = function() { };
Luxe.__name__ = true;
Luxe.__properties__ = {set_alpha:"set_alpha",get_alpha:"get_alpha",set_cur_frame_start:"set_cur_frame_start",get_cur_frame_start:"get_cur_frame_start",set_current_time:"set_current_time",get_current_time:"get_current_time",set_last_frame_start:"set_last_frame_start",get_last_frame_start:"get_last_frame_start",set_delta_sim:"set_delta_sim",get_delta_sim:"get_delta_sim",set_dt:"set_dt",get_dt:"get_dt",set_max_frame_time:"set_max_frame_time",get_max_frame_time:"get_max_frame_time",set_update_rate:"set_update_rate",get_update_rate:"get_update_rate",set_fixed_delta:"set_fixed_delta",get_fixed_delta:"get_fixed_delta",set_timescale:"set_timescale",get_timescale:"get_timescale",get_screen:"get_screen",get_time:"get_time"}
Luxe.on = function(event,handler) {
	Luxe.core.emitter.on(event,handler,{ fileName : "Luxe.hx", lineNumber : 86, className : "Luxe", methodName : "on"});
};
Luxe.off = function(event,handler) {
	return Luxe.core.emitter.off(event,handler,{ fileName : "Luxe.hx", lineNumber : 91, className : "Luxe", methodName : "off"});
};
Luxe.get_screen = function() {
	return Luxe.core.screen;
};
Luxe.get_time = function() {
	return snow.Snow.core.timestamp();
};
Luxe.shutdown = function() {
	Luxe.core.shutdown();
};
Luxe.showConsole = function(_show) {
	Luxe.core.show_console(_show);
};
Luxe.loadJSON = function(_id,_onload,_async) {
	if(_async == null) _async = false;
	var res = new luxe.resource.JSONResource(_id,null,Luxe.resources);
	Luxe.core.app.assets.text(_id,{ async : _async, onload : function(_asset) {
		res.json = new luxe.utils.json.JSONDecoder(_asset.text,false).getValue();
		if(_onload != null) _onload(res);
		Luxe.resources.cache(res);
	}});
	return res;
};
Luxe.loadText = function(_id,_onload,_async) {
	if(_async == null) _async = false;
	var res = new luxe.resource.TextResource(_id,null,Luxe.resources);
	Luxe.core.app.assets.text(_id,{ async : _async, onload : function(_asset) {
		res.text = _asset.text;
		if(_onload != null) _onload(res);
		Luxe.resources.cache(res);
	}});
	return res;
};
Luxe.loadData = function(_id,_onload,_async) {
	if(_async == null) _async = false;
	var res = new luxe.resource.DataResource(_id,null,Luxe.resources);
	Luxe.core.app.assets.bytes(_id,{ async : _async, onload : function(_asset) {
		res.data = _asset.bytes;
		if(_onload != null) _onload(res);
		Luxe.resources.cache(res);
	}});
	return res;
};
Luxe.loadSound = function(_name,_id,_is_music,_onload) {
	if(_is_music == null) _is_music = false;
	var existing = Luxe.resources.find_sound(_id);
	if(existing != null) {
		haxe.Log.trace("     i / luxe / " + ("sound at " + _id + " was already a registered resource, returning existing instance"),{ fileName : "Luxe.hx", lineNumber : 197, className : "Luxe", methodName : "loadSound"});
		if(_onload != null) _onload(existing);
		return existing;
	}
	Luxe.audio.create(_id,_name,_is_music);
	var res = new luxe.resource.SoundResource(_id,_name,Luxe.resources);
	if(_onload != null) _onload(res);
	Luxe.resources.cache(res);
	return res;
};
Luxe.loadTexture = function(_id,_onload,_silent) {
	if(_silent == null) _silent = false;
	return phoenix.Texture.load(_id,_onload,_silent);
};
Luxe.loadTextures = function(_ids,_onload,_silent) {
	if(_silent == null) _silent = false;
	var total_count = _ids.length;
	var loaded_count = 0;
	var loaded = [];
	var on_single_texture_complete = function(texture) {
		loaded.push(texture);
		loaded_count++;
		if(loaded_count == total_count) _onload(loaded);
	};
	var _g = 0;
	while(_g < _ids.length) {
		var _id = _ids[_g];
		++_g;
		Luxe.loadTexture(_id,on_single_texture_complete,_silent);
	}
};
Luxe.loadFont = function(_id,_path,_onload) {
	return phoenix.BitmapFont.load(_id,_path,_onload);
};
Luxe.loadShader = function(_ps_id,_vs_id,_onload) {
	if(_vs_id == null) _vs_id = "default";
	if(_ps_id == null) _ps_id = "default";
	return phoenix.Shader.load(_ps_id,_vs_id,_onload);
};
Luxe.openURL = function(_url) {
	Luxe.core.app.io.url_open(_url);
};
Luxe.get_timescale = function() {
	return Luxe.core.timescale;
};
Luxe.get_fixed_delta = function() {
	return Luxe.core.fixed_delta;
};
Luxe.get_update_rate = function() {
	return Luxe.core.update_rate;
};
Luxe.get_max_frame_time = function() {
	return Luxe.core.max_frame_time;
};
Luxe.get_dt = function() {
	return Luxe.core.delta_time;
};
Luxe.get_delta_sim = function() {
	return Luxe.core.delta_sim;
};
Luxe.get_last_frame_start = function() {
	return Luxe.core.last_frame_start;
};
Luxe.get_current_time = function() {
	return Luxe.core.current_time;
};
Luxe.get_cur_frame_start = function() {
	return Luxe.core.cur_frame_start;
};
Luxe.get_alpha = function() {
	return Luxe.core.alpha;
};
Luxe.set_timescale = function(value) {
	return Luxe.core.timescale = value;
};
Luxe.set_fixed_delta = function(value) {
	return Luxe.core.fixed_delta = value;
};
Luxe.set_update_rate = function(value) {
	return Luxe.core.update_rate = value;
};
Luxe.set_max_frame_time = function(value) {
	return Luxe.core.max_frame_time = value;
};
Luxe.set_dt = function(value) {
	return Luxe.core.delta_time = value;
};
Luxe.set_delta_sim = function(value) {
	return Luxe.core.delta_sim = value;
};
Luxe.set_last_frame_start = function(value) {
	return Luxe.core.last_frame_start = value;
};
Luxe.set_current_time = function(value) {
	return Luxe.core.current_time = value;
};
Luxe.set_cur_frame_start = function(value) {
	return Luxe.core.cur_frame_start = value;
};
Luxe.set_alpha = function(value) {
	return Luxe.core.alpha = value;
};
var LuxeApp = function() { };
LuxeApp.__name__ = true;
LuxeApp.main = function() {
	LuxeApp._snow = new snow.Snow();
	LuxeApp._game = new Main();
	LuxeApp._core = new luxe.Core(LuxeApp._game);
	var _snow_config = { has_loop : true, config_custom_assets : false, config_custom_runtime : false, config_runtime_path : "config.json", config_assets_path : "manifest"};
	LuxeApp._snow.init(_snow_config,LuxeApp._core);
};
var luxe = {};
luxe.Emitter = function() {
	this._checking = false;
	this._to_remove = new List();
	this.connected = new List();
	this.bindings = new haxe.ds.StringMap();
};
luxe.Emitter.__name__ = true;
luxe.Emitter.prototype = {
	bindings: null
	,connected: null
	,_to_remove: null
	,emit: function(event,data,pos) {
		this._check();
		if(this.bindings.exists(event)) {
			var list = this.bindings.get(event);
			if(list.length > 0) {
				var _g = 0;
				while(_g < list.length) {
					var handler = list[_g];
					++_g;
					handler(data);
				}
			}
		}
		this._check();
	}
	,on: function(event,handler,pos) {
		this._check();
		if(!this.bindings.exists(event)) {
			this.bindings.set(event,[handler]);
			this.connected.push({ handler : handler, event : event, pos : pos});
		} else {
			var list = this.bindings.get(event);
			if(HxOverrides.indexOf(list,handler,0) == -1) {
				list.push(handler);
				this.connected.push({ handler : handler, event : event, pos : pos});
			}
		}
	}
	,off: function(event,handler,pos) {
		this._check();
		var success = false;
		if(this.bindings.exists(event)) {
			this._to_remove.push({ event : event, handler : handler});
			var $it0 = this.connected.iterator();
			while( $it0.hasNext() ) {
				var _info = $it0.next();
				if(_info.event == event && _info.handler == handler) this.connected.remove(_info);
			}
			success = true;
		}
		return success;
	}
	,connections: function(handler) {
		var list = [];
		var $it0 = this.connected.iterator();
		while( $it0.hasNext() ) {
			var _info = $it0.next();
			if(_info.handler == handler) list.push(_info);
		}
		return list;
	}
	,_checking: null
	,_check: function() {
		if(this._checking) return;
		this._checking = true;
		if(this._to_remove.length > 0) {
			var $it0 = this._to_remove.iterator();
			while( $it0.hasNext() ) {
				var _node = $it0.next();
				var list = this.bindings.get(_node.event);
				HxOverrides.remove(list,_node.handler);
				if(list.length == 0) this.bindings.remove(_node.event);
			}
			this._to_remove = null;
			this._to_remove = new List();
		}
		this._checking = false;
	}
	,__class__: luxe.Emitter
};
luxe.Game = function() {
	luxe.Emitter.call(this);
};
luxe.Game.__name__ = true;
luxe.Game.__super__ = luxe.Emitter;
luxe.Game.prototype = $extend(luxe.Emitter.prototype,{
	app: null
	,config: function(config) {
		return config;
	}
	,ready: function() {
	}
	,update: function(dt) {
	}
	,onevent: function(event) {
	}
	,ondestroy: function() {
	}
	,onprerender: function() {
	}
	,onrender: function() {
	}
	,onpostrender: function() {
	}
	,oninputdown: function(_name,e) {
	}
	,oninputup: function(_name,e) {
	}
	,onmousedown: function(event) {
	}
	,onmouseup: function(event) {
	}
	,onmousewheel: function(event) {
	}
	,onmousemove: function(event) {
	}
	,onkeydown: function(event) {
	}
	,onkeyup: function(event) {
	}
	,ontextinput: function(event) {
	}
	,ontouchdown: function(event) {
	}
	,ontouchup: function(event) {
	}
	,ontouchmove: function(event) {
	}
	,ongamepadaxis: function(event) {
	}
	,ongamepaddown: function(event) {
	}
	,ongamepadup: function(event) {
	}
	,ongamepaddevice: function(event) {
	}
	,__class__: luxe.Game
});
var Main = function() {
	this.id = 0;
	this.touched = false;
	this.rand = false;
	this.curp = 0;
	this.last = false;
	this.cur = 0;
	this.btnDwn = false;
	luxe.Game.call(this);
};
Main.__name__ = true;
Main.__super__ = luxe.Game;
Main.prototype = $extend(luxe.Game.prototype,{
	geo: null
	,verts: null
	,drawn: null
	,btnDwn: null
	,cur: null
	,last: null
	,mousePos: null
	,curp: null
	,rand: null
	,touched: null
	,id: null
	,ready: function() {
		this.mousePos = new phoenix.Vector();
		var wx = Luxe.get_screen().get_mid().x;
		var hy = Luxe.get_screen().get_mid().y;
		this.geo = new phoenix.geometry.Geometry({ batcher : Luxe.renderer.batcher, primitive_type : 5});
		this.verts = new Array();
		this.drawn = new Array();
		var _g = 0;
		var _g1 = this.verts;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			this.geo.add(v);
		}
	}
	,onkeyup: function(e) {
		if(e.keycode == snow.input.Keycodes.escape) Luxe.shutdown();
	}
	,onmouseup: function(event) {
		if(event.button == luxe.MouseButton.left) this.btnDwn = false;
	}
	,onmousemove: function(event) {
		this.mousePos = event.pos;
	}
	,onmousedown: function(event) {
		if(event.button == luxe.MouseButton.right) {
			var i = this.checkVert(this.mousePos.x,this.mousePos.y,10);
			if(i != -1) {
				this.geo.remove(this.verts[i]);
				HxOverrides.remove(this.verts,this.verts[i]);
				this.drawn[i].set_visible(false);
				this.drawn[i] = null;
				HxOverrides.remove(this.drawn,this.drawn[i]);
			}
		}
	}
	,ontouchdown: function(event) {
		this.touched = true;
		this.id = event.touch_id;
		this.mousePos.set_x(event.x * Luxe.get_screen().w);
		this.mousePos.set_y(event.y * Luxe.get_screen().h);
	}
	,ontouchmove: function(event) {
		if(event.touch_id == this.id) {
			this.mousePos.set_x(event.x * Luxe.get_screen().w);
			this.mousePos.set_y(event.y * Luxe.get_screen().h);
		}
	}
	,ontouchup: function(event) {
		if(event.touch_id == this.id) this.touched = false;
	}
	,update: function(dt) {
		var pressed = Luxe.input.mousedown(1) || this.touched;
		var radius = 10;
		var _g = 0;
		var _g1 = this.drawn;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			if(d != null) d.set_visible(false);
		}
		var i = this.checkVert(this.mousePos.x,this.mousePos.y,radius);
		var v = this.verts[i];
		if(i != -1) {
			if(pressed) {
				this.btnDwn = true;
				this.cur = i;
			}
			if(this.drawn[i] == null) this.drawn[i] = Luxe.draw.circle({ x : v.pos.x, y : v.pos.y, r : radius, depth : 3}); else {
				this.drawn[i].set_visible(true);
				this.drawn[i].transform.local.pos.set_x(v.pos.x);
				this.drawn[i].transform.local.pos.set_y(v.pos.y);
			}
		}
		if(this.btnDwn) {
			this.verts[this.cur].pos.set_x(this.mousePos.x);
			this.verts[this.cur].pos.set_y(this.mousePos.y);
		} else if(pressed && !this.last) this.addVertex(this.mousePos.x,this.mousePos.y);
		this.last = pressed;
		if(this.rand) {
			if(Math.random() > 0.9999) this.addVertex(Math.random() * Luxe.get_screen().w,Math.random() * Luxe.get_screen().h);
		}
	}
	,onkeydown: function(event) {
		var w = Luxe.get_screen().w | 0;
		var h = Luxe.get_screen().h | 0;
		if(event.keycode == snow.input.Keycodes.space) this.rand = !this.rand;
	}
	,addVertex: function(x,y) {
		var v1 = new phoenix.geometry.Vertex(new phoenix.Vector(x,y),phoenix.Color.random());
		this.verts.push(v1);
		this.geo.add(v1);
	}
	,checkVert: function(x,y,radius) {
		var _g1 = 0;
		var _g = this.verts.length;
		while(_g1 < _g) {
			var i = _g1++;
			var v = this.verts[i];
			if(Math.abs(v.pos.x - x) < radius && Math.abs(v.pos.y - y) < radius) return i;
		}
		return -1;
	}
	,__class__: Main
});
var IMap = function() { };
IMap.__name__ = true;
IMap.prototype = {
	set: null
	,remove: null
	,iterator: null
	,__class__: IMap
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.isEnumValue = function(v) {
	return v != null && v.__enum__ != null;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std["int"] = function(x) {
	return x | 0;
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	b: null
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,__class__: StringBuf
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
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = s + c;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
Type.__name__ = true;
Type.getClass = function(o) {
	if(o == null) return null;
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type.enumIndex = function(e) {
	return e[1];
};
var format = {};
format.png = {};
format.png.Color = { __ename__ : true, __constructs__ : ["ColGrey","ColTrue","ColIndexed"] };
format.png.Color.ColGrey = function(alpha) { var $x = ["ColGrey",0,alpha]; $x.__enum__ = format.png.Color; $x.toString = $estr; return $x; };
format.png.Color.ColTrue = function(alpha) { var $x = ["ColTrue",1,alpha]; $x.__enum__ = format.png.Color; $x.toString = $estr; return $x; };
format.png.Color.ColIndexed = ["ColIndexed",2];
format.png.Color.ColIndexed.toString = $estr;
format.png.Color.ColIndexed.__enum__ = format.png.Color;
format.png.Chunk = { __ename__ : true, __constructs__ : ["CEnd","CHeader","CData","CPalette","CUnknown"] };
format.png.Chunk.CEnd = ["CEnd",0];
format.png.Chunk.CEnd.toString = $estr;
format.png.Chunk.CEnd.__enum__ = format.png.Chunk;
format.png.Chunk.CHeader = function(h) { var $x = ["CHeader",1,h]; $x.__enum__ = format.png.Chunk; $x.toString = $estr; return $x; };
format.png.Chunk.CData = function(b) { var $x = ["CData",2,b]; $x.__enum__ = format.png.Chunk; $x.toString = $estr; return $x; };
format.png.Chunk.CPalette = function(b) { var $x = ["CPalette",3,b]; $x.__enum__ = format.png.Chunk; $x.toString = $estr; return $x; };
format.png.Chunk.CUnknown = function(id,data) { var $x = ["CUnknown",4,id,data]; $x.__enum__ = format.png.Chunk; $x.toString = $estr; return $x; };
format.png.Tools = function() { };
format.png.Tools.__name__ = true;
format.png.Tools.getHeader = function(d) {
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 1:
			var h = c[2];
			return h;
		default:
		}
	}
	throw "Header not found";
};
format.png.Tools.getPalette = function(d) {
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 3:
			var b = c[2];
			return b;
		default:
		}
	}
	return null;
};
format.png.Tools.filter = function(data,x,y,stride,prev,p,numChannels) {
	if(numChannels == null) numChannels = 4;
	var b;
	if(y == 0) b = 0; else b = data.b[p - stride];
	var c;
	if(x == 0 || y == 0) c = 0; else c = data.b[p - stride - numChannels];
	var k = prev + b - c;
	var pa = k - prev;
	if(pa < 0) pa = -pa;
	var pb = k - b;
	if(pb < 0) pb = -pb;
	var pc = k - c;
	if(pc < 0) pc = -pc;
	if(pa <= pb && pa <= pc) return prev; else if(pb <= pc) return b; else return c;
};
format.png.Tools.reverseBytes = function(b) {
	var p = 0;
	var _g1 = 0;
	var _g = b.length >> 2;
	while(_g1 < _g) {
		var i = _g1++;
		var b1 = b.b[p];
		var g = b.b[p + 1];
		var r = b.b[p + 2];
		var a = b.b[p + 3];
		var p1 = p++;
		b.b[p1] = a & 255;
		var p2 = p++;
		b.b[p2] = r & 255;
		var p3 = p++;
		b.b[p3] = g & 255;
		var p4 = p++;
		b.b[p4] = b1 & 255;
	}
};
format.png.Tools.extractGrey = function(d) {
	var h = format.png.Tools.getHeader(d);
	var grey = haxe.io.Bytes.alloc(h.width * h.height);
	var data = null;
	var fullData = null;
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 2:
			var b = c[2];
			if(fullData != null) fullData.add(b); else if(data == null) data = b; else {
				fullData = new haxe.io.BytesBuffer();
				fullData.add(data);
				fullData.add(b);
				data = null;
			}
			break;
		default:
		}
	}
	if(fullData != null) data = fullData.getBytes();
	if(data == null) throw "Data not found";
	data = format.tools.Inflate.run(data);
	var r = 0;
	var w = 0;
	{
		var _g = h.color;
		switch(_g[1]) {
		case 0:
			var alpha = _g[2];
			if(h.colbits != 8) throw "Unsupported color mode";
			var width = h.width;
			var stride;
			stride = (alpha?2:1) * width + 1;
			if(data.length < h.height * stride) throw "Not enough data";
			var rinc;
			if(alpha) rinc = 2; else rinc = 1;
			var _g2 = 0;
			var _g1 = h.height;
			while(_g2 < _g1) {
				var y = _g2++;
				var f = data.get(r++);
				switch(f) {
				case 0:
					var _g3 = 0;
					while(_g3 < width) {
						var x = _g3++;
						var v = data.b[r];
						r += rinc;
						grey.set(w++,v);
					}
					break;
				case 1:
					var cv = 0;
					var _g31 = 0;
					while(_g31 < width) {
						var x1 = _g31++;
						cv += data.b[r];
						r += rinc;
						grey.set(w++,cv);
					}
					break;
				case 2:
					var stride1;
					if(y == 0) stride1 = 0; else stride1 = width;
					var _g32 = 0;
					while(_g32 < width) {
						var x2 = _g32++;
						var v1 = data.b[r] + grey.b[w - stride1];
						r += rinc;
						grey.set(w++,v1);
					}
					break;
				case 3:
					var cv1 = 0;
					var stride2;
					if(y == 0) stride2 = 0; else stride2 = width;
					var _g33 = 0;
					while(_g33 < width) {
						var x3 = _g33++;
						cv1 = data.b[r] + (cv1 + grey.b[w - stride2] >> 1) & 255;
						r += rinc;
						grey.set(w++,cv1);
					}
					break;
				case 4:
					var stride3 = width;
					var cv2 = 0;
					var _g34 = 0;
					while(_g34 < width) {
						var x4 = _g34++;
						cv2 = format.png.Tools.filter(grey,x4,y,stride3,cv2,w,1) + data.b[r] & 255;
						r += rinc;
						grey.set(w++,cv2);
					}
					break;
				default:
					throw "Invalid filter " + f;
				}
			}
			break;
		default:
			throw "Unsupported color mode";
		}
	}
	return grey;
};
format.png.Tools.extract32 = function(d,bytes) {
	var h = format.png.Tools.getHeader(d);
	var bgra;
	if(bytes == null) bgra = haxe.io.Bytes.alloc(h.width * h.height * 4); else bgra = bytes;
	var data = null;
	var fullData = null;
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 2:
			var b = c[2];
			if(fullData != null) fullData.add(b); else if(data == null) data = b; else {
				fullData = new haxe.io.BytesBuffer();
				fullData.add(data);
				fullData.add(b);
				data = null;
			}
			break;
		default:
		}
	}
	if(fullData != null) data = fullData.getBytes();
	if(data == null) throw "Data not found";
	data = format.tools.Inflate.run(data);
	var r = 0;
	var w = 0;
	{
		var _g = h.color;
		switch(_g[1]) {
		case 2:
			var pal = format.png.Tools.getPalette(d);
			if(pal == null) throw "PNG Palette is missing";
			var alpha = null;
			try {
				var $it1 = d.iterator();
				while( $it1.hasNext() ) {
					var t = $it1.next();
					switch(t[1]) {
					case 4:
						switch(t[2]) {
						case "tRNS":
							var data1 = t[3];
							alpha = data1;
							throw "__break__";
							break;
						default:
						}
						break;
					default:
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			if(alpha != null && alpha.length < 1 << h.colbits) {
				var alpha2 = haxe.io.Bytes.alloc(1 << h.colbits);
				alpha2.blit(0,alpha,0,alpha.length);
				alpha2.fill(alpha.length,alpha2.length - alpha.length,255);
				alpha = alpha2;
			}
			var width = h.width;
			var stride = Math.ceil(width * h.colbits / 8) + 1;
			if(data.length < h.height * stride) throw "Not enough data";
			var vr;
			var vg;
			var vb;
			var va = 255;
			if(h.colbits == 8) {
				var _g2 = 0;
				var _g1 = h.height;
				while(_g2 < _g1) {
					var y = _g2++;
					var f = data.get(r++);
					switch(f) {
					case 0:
						var _g11 = 0;
						while(_g11 < width) {
							var x = _g11++;
							var c1 = data.get(r++);
							vr = pal.b[c1 * 3];
							vg = pal.b[c1 * 3 + 1];
							vb = pal.b[c1 * 3 + 2];
							if(alpha != null) va = alpha.b[c1];
							bgra.set(w++,vb);
							bgra.set(w++,vg);
							bgra.set(w++,vr);
							bgra.set(w++,va);
						}
						break;
					case 1:
						var cr = 0;
						var cg = 0;
						var cb = 0;
						var ca = 0;
						var _g12 = 0;
						while(_g12 < width) {
							var x1 = _g12++;
							var c2 = data.get(r++);
							vr = pal.b[c2 * 3];
							vg = pal.b[c2 * 3 + 1];
							vb = pal.b[c2 * 3 + 2];
							if(alpha != null) va = alpha.b[c2];
							cb += vb;
							bgra.set(w++,cb);
							cg += vg;
							bgra.set(w++,cg);
							cr += vr;
							bgra.set(w++,cr);
							ca += va;
							bgra.set(w++,ca);
							bgra.set(w++,va);
						}
						break;
					case 2:
						var stride1;
						if(y == 0) stride1 = 0; else stride1 = width * 4;
						var _g13 = 0;
						while(_g13 < width) {
							var x2 = _g13++;
							var c3 = data.get(r++);
							vr = pal.b[c3 * 3];
							vg = pal.b[c3 * 3 + 1];
							vb = pal.b[c3 * 3 + 2];
							if(alpha != null) va = alpha.b[c3];
							bgra.b[w] = vb + bgra.b[w - stride1] & 255;
							w++;
							bgra.b[w] = vg + bgra.b[w - stride1] & 255;
							w++;
							bgra.b[w] = vr + bgra.b[w - stride1] & 255;
							w++;
							bgra.b[w] = va + bgra.b[w - stride1] & 255;
							w++;
						}
						break;
					case 3:
						var cr1 = 0;
						var cg1 = 0;
						var cb1 = 0;
						var ca1 = 0;
						var stride2;
						if(y == 0) stride2 = 0; else stride2 = width * 4;
						var _g14 = 0;
						while(_g14 < width) {
							var x3 = _g14++;
							var c4 = data.get(r++);
							vr = pal.b[c4 * 3];
							vg = pal.b[c4 * 3 + 1];
							vb = pal.b[c4 * 3 + 2];
							if(alpha != null) va = alpha.b[c4];
							cb1 = vb + (cb1 + bgra.b[w - stride2] >> 1) & 255;
							bgra.set(w++,cb1);
							cg1 = vg + (cg1 + bgra.b[w - stride2] >> 1) & 255;
							bgra.set(w++,cg1);
							cr1 = vr + (cr1 + bgra.b[w - stride2] >> 1) & 255;
							bgra.set(w++,cr1);
							cr1 = va + (ca1 + bgra.b[w - stride2] >> 1) & 255;
							bgra.set(w++,ca1);
						}
						break;
					case 4:
						var stride3 = width * 4;
						var cr2 = 0;
						var cg2 = 0;
						var cb2 = 0;
						var ca2 = 0;
						var _g15 = 0;
						while(_g15 < width) {
							var x4 = _g15++;
							var c5 = data.get(r++);
							vr = pal.b[c5 * 3];
							vg = pal.b[c5 * 3 + 1];
							vb = pal.b[c5 * 3 + 2];
							if(alpha != null) va = alpha.b[c5];
							cb2 = format.png.Tools.filter(bgra,x4,y,stride3,cb2,w,null) + vb & 255;
							bgra.set(w++,cb2);
							cg2 = format.png.Tools.filter(bgra,x4,y,stride3,cg2,w,null) + vg & 255;
							bgra.set(w++,cg2);
							cr2 = format.png.Tools.filter(bgra,x4,y,stride3,cr2,w,null) + vr & 255;
							bgra.set(w++,cr2);
							ca2 = format.png.Tools.filter(bgra,x4,y,stride3,ca2,w,null) + va & 255;
							bgra.set(w++,ca2);
						}
						break;
					default:
						throw "Invalid filter " + f;
					}
				}
			} else if(h.colbits < 8) {
				var req = h.colbits;
				var mask = (1 << req) - 1;
				var _g21 = 0;
				var _g16 = h.height;
				while(_g21 < _g16) {
					var y1 = _g21++;
					var f1 = data.get(r++);
					var bits = 0;
					var nbits = 0;
					var v;
					switch(f1) {
					case 0:
						var _g17 = 0;
						while(_g17 < width) {
							var x5 = _g17++;
							var c6;
							if(nbits < req) {
								bits = bits << 8 | data.get(r++);
								nbits += 8;
							}
							v = bits >>> nbits - req & mask;
							nbits -= req;
							c6 = v;
							vr = pal.b[c6 * 3];
							vg = pal.b[c6 * 3 + 1];
							vb = pal.b[c6 * 3 + 2];
							if(alpha != null) va = alpha.b[c6];
							bgra.set(w++,vb);
							bgra.set(w++,vg);
							bgra.set(w++,vr);
							bgra.set(w++,va);
						}
						break;
					case 1:
						var cr3 = 0;
						var cg3 = 0;
						var cb3 = 0;
						var ca3 = 0;
						var _g18 = 0;
						while(_g18 < width) {
							var x6 = _g18++;
							var c7;
							if(nbits < req) {
								bits = bits << 8 | data.get(r++);
								nbits += 8;
							}
							v = bits >>> nbits - req & mask;
							nbits -= req;
							c7 = v;
							vr = pal.b[c7 * 3];
							vg = pal.b[c7 * 3 + 1];
							vb = pal.b[c7 * 3 + 2];
							if(alpha != null) va = alpha.b[c7];
							cb3 += vb;
							bgra.set(w++,cb3);
							cg3 += vg;
							bgra.set(w++,cg3);
							cr3 += vr;
							bgra.set(w++,cr3);
							ca3 += va;
							bgra.set(w++,ca3);
							bgra.set(w++,va);
						}
						break;
					case 2:
						var stride4;
						if(y1 == 0) stride4 = 0; else stride4 = width * 4;
						var _g19 = 0;
						while(_g19 < width) {
							var x7 = _g19++;
							var c8;
							if(nbits < req) {
								bits = bits << 8 | data.get(r++);
								nbits += 8;
							}
							v = bits >>> nbits - req & mask;
							nbits -= req;
							c8 = v;
							vr = pal.b[c8 * 3];
							vg = pal.b[c8 * 3 + 1];
							vb = pal.b[c8 * 3 + 2];
							if(alpha != null) va = alpha.b[c8];
							bgra.b[w] = vb + bgra.b[w - stride4] & 255;
							w++;
							bgra.b[w] = vg + bgra.b[w - stride4] & 255;
							w++;
							bgra.b[w] = vr + bgra.b[w - stride4] & 255;
							w++;
							bgra.b[w] = va + bgra.b[w - stride4] & 255;
							w++;
						}
						break;
					case 3:
						var cr4 = 0;
						var cg4 = 0;
						var cb4 = 0;
						var ca4 = 0;
						var stride5;
						if(y1 == 0) stride5 = 0; else stride5 = width * 4;
						var _g110 = 0;
						while(_g110 < width) {
							var x8 = _g110++;
							var c9;
							if(nbits < req) {
								bits = bits << 8 | data.get(r++);
								nbits += 8;
							}
							v = bits >>> nbits - req & mask;
							nbits -= req;
							c9 = v;
							vr = pal.b[c9 * 3];
							vg = pal.b[c9 * 3 + 1];
							vb = pal.b[c9 * 3 + 2];
							if(alpha != null) va = alpha.b[c9];
							cb4 = vb + (cb4 + bgra.b[w - stride5] >> 1) & 255;
							bgra.set(w++,cb4);
							cg4 = vg + (cg4 + bgra.b[w - stride5] >> 1) & 255;
							bgra.set(w++,cg4);
							cr4 = vr + (cr4 + bgra.b[w - stride5] >> 1) & 255;
							bgra.set(w++,cr4);
							cr4 = va + (ca4 + bgra.b[w - stride5] >> 1) & 255;
							bgra.set(w++,ca4);
						}
						break;
					case 4:
						var stride6 = width * 4;
						var cr5 = 0;
						var cg5 = 0;
						var cb5 = 0;
						var ca5 = 0;
						var _g111 = 0;
						while(_g111 < width) {
							var x9 = _g111++;
							var c10;
							if(nbits < req) {
								bits = bits << 8 | data.get(r++);
								nbits += 8;
							}
							v = bits >>> nbits - req & mask;
							nbits -= req;
							c10 = v;
							vr = pal.b[c10 * 3];
							vg = pal.b[c10 * 3 + 1];
							vb = pal.b[c10 * 3 + 2];
							if(alpha != null) va = alpha.b[c10];
							cb5 = format.png.Tools.filter(bgra,x9,y1,stride6,cb5,w,null) + vb & 255;
							bgra.set(w++,cb5);
							cg5 = format.png.Tools.filter(bgra,x9,y1,stride6,cg5,w,null) + vg & 255;
							bgra.set(w++,cg5);
							cr5 = format.png.Tools.filter(bgra,x9,y1,stride6,cr5,w,null) + vr & 255;
							bgra.set(w++,cr5);
							ca5 = format.png.Tools.filter(bgra,x9,y1,stride6,ca5,w,null) + va & 255;
							bgra.set(w++,ca5);
						}
						break;
					default:
						throw "Invalid filter " + f1;
					}
				}
			} else throw h.colbits + " indexed bits per pixel not supported";
			break;
		case 0:
			var alpha1 = _g[2];
			if(h.colbits != 8) throw "Unsupported color mode";
			var width1 = h.width;
			var stride7;
			stride7 = (alpha1?2:1) * width1 + 1;
			if(data.length < h.height * stride7) throw "Not enough data";
			var _g22 = 0;
			var _g112 = h.height;
			while(_g22 < _g112) {
				var y2 = _g22++;
				var f2 = data.get(r++);
				switch(f2) {
				case 0:
					if(alpha1) {
						var _g3 = 0;
						while(_g3 < width1) {
							var x10 = _g3++;
							var v1 = data.get(r++);
							bgra.set(w++,v1);
							bgra.set(w++,v1);
							bgra.set(w++,v1);
							bgra.set(w++,data.get(r++));
						}
					} else {
						var _g31 = 0;
						while(_g31 < width1) {
							var x11 = _g31++;
							var v2 = data.get(r++);
							bgra.set(w++,v2);
							bgra.set(w++,v2);
							bgra.set(w++,v2);
							bgra.set(w++,255);
						}
					}
					break;
				case 1:
					var cv = 0;
					var ca6 = 0;
					if(alpha1) {
						var _g32 = 0;
						while(_g32 < width1) {
							var x12 = _g32++;
							cv += data.get(r++);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							ca6 += data.get(r++);
							bgra.set(w++,ca6);
						}
					} else {
						var _g33 = 0;
						while(_g33 < width1) {
							var x13 = _g33++;
							cv += data.get(r++);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,255);
						}
					}
					break;
				case 2:
					var stride8;
					if(y2 == 0) stride8 = 0; else stride8 = width1 * 4;
					if(alpha1) {
						var _g34 = 0;
						while(_g34 < width1) {
							var x14 = _g34++;
							var v3 = data.get(r++) + bgra.b[w - stride8];
							bgra.set(w++,v3);
							bgra.set(w++,v3);
							bgra.set(w++,v3);
							bgra.set(w++,data.get(r++) + bgra.b[w - stride8]);
						}
					} else {
						var _g35 = 0;
						while(_g35 < width1) {
							var x15 = _g35++;
							var v4 = data.get(r++) + bgra.b[w - stride8];
							bgra.set(w++,v4);
							bgra.set(w++,v4);
							bgra.set(w++,v4);
							bgra.set(w++,255);
						}
					}
					break;
				case 3:
					var cv1 = 0;
					var ca7 = 0;
					var stride9;
					if(y2 == 0) stride9 = 0; else stride9 = width1 * 4;
					if(alpha1) {
						var _g36 = 0;
						while(_g36 < width1) {
							var x16 = _g36++;
							cv1 = data.get(r++) + (cv1 + bgra.b[w - stride9] >> 1) & 255;
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							ca7 = data.get(r++) + (ca7 + bgra.b[w - stride9] >> 1) & 255;
							bgra.set(w++,ca7);
						}
					} else {
						var _g37 = 0;
						while(_g37 < width1) {
							var x17 = _g37++;
							cv1 = data.get(r++) + (cv1 + bgra.b[w - stride9] >> 1) & 255;
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,255);
						}
					}
					break;
				case 4:
					var stride10 = width1 * 4;
					var cv2 = 0;
					var ca8 = 0;
					if(alpha1) {
						var _g38 = 0;
						while(_g38 < width1) {
							var x18 = _g38++;
							cv2 = format.png.Tools.filter(bgra,x18,y2,stride10,cv2,w,null) + data.get(r++) & 255;
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							ca8 = format.png.Tools.filter(bgra,x18,y2,stride10,ca8,w,null) + data.get(r++) & 255;
							bgra.set(w++,ca8);
						}
					} else {
						var _g39 = 0;
						while(_g39 < width1) {
							var x19 = _g39++;
							cv2 = format.png.Tools.filter(bgra,x19,y2,stride10,cv2,w,null) + data.get(r++) & 255;
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,255);
						}
					}
					break;
				default:
					throw "Invalid filter " + f2;
				}
			}
			break;
		case 1:
			var alpha3 = _g[2];
			if(h.colbits != 8) throw "Unsupported color mode";
			var width2 = h.width;
			var stride11;
			stride11 = (alpha3?4:3) * width2 + 1;
			if(data.length < h.height * stride11) throw "Not enough data";
			var _g23 = 0;
			var _g113 = h.height;
			while(_g23 < _g113) {
				var y3 = _g23++;
				var f3 = data.get(r++);
				switch(f3) {
				case 0:
					if(alpha3) {
						var _g310 = 0;
						while(_g310 < width2) {
							var x20 = _g310++;
							bgra.set(w++,data.b[r + 2]);
							bgra.set(w++,data.b[r + 1]);
							bgra.set(w++,data.b[r]);
							bgra.set(w++,data.b[r + 3]);
							r += 4;
						}
					} else {
						var _g311 = 0;
						while(_g311 < width2) {
							var x21 = _g311++;
							bgra.set(w++,data.b[r + 2]);
							bgra.set(w++,data.b[r + 1]);
							bgra.set(w++,data.b[r]);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 1:
					var cr6 = 0;
					var cg6 = 0;
					var cb6 = 0;
					var ca9 = 0;
					if(alpha3) {
						var _g312 = 0;
						while(_g312 < width2) {
							var x22 = _g312++;
							cb6 += data.b[r + 2];
							bgra.set(w++,cb6);
							cg6 += data.b[r + 1];
							bgra.set(w++,cg6);
							cr6 += data.b[r];
							bgra.set(w++,cr6);
							ca9 += data.b[r + 3];
							bgra.set(w++,ca9);
							r += 4;
						}
					} else {
						var _g313 = 0;
						while(_g313 < width2) {
							var x23 = _g313++;
							cb6 += data.b[r + 2];
							bgra.set(w++,cb6);
							cg6 += data.b[r + 1];
							bgra.set(w++,cg6);
							cr6 += data.b[r];
							bgra.set(w++,cr6);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 2:
					var stride12;
					if(y3 == 0) stride12 = 0; else stride12 = width2 * 4;
					if(alpha3) {
						var _g314 = 0;
						while(_g314 < width2) {
							var x24 = _g314++;
							bgra.b[w] = data.b[r + 2] + bgra.b[w - stride12] & 255;
							w++;
							bgra.b[w] = data.b[r + 1] + bgra.b[w - stride12] & 255;
							w++;
							bgra.b[w] = data.b[r] + bgra.b[w - stride12] & 255;
							w++;
							bgra.b[w] = data.b[r + 3] + bgra.b[w - stride12] & 255;
							w++;
							r += 4;
						}
					} else {
						var _g315 = 0;
						while(_g315 < width2) {
							var x25 = _g315++;
							bgra.b[w] = data.b[r + 2] + bgra.b[w - stride12] & 255;
							w++;
							bgra.b[w] = data.b[r + 1] + bgra.b[w - stride12] & 255;
							w++;
							bgra.b[w] = data.b[r] + bgra.b[w - stride12] & 255;
							w++;
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 3:
					var cr7 = 0;
					var cg7 = 0;
					var cb7 = 0;
					var ca10 = 0;
					var stride13;
					if(y3 == 0) stride13 = 0; else stride13 = width2 * 4;
					if(alpha3) {
						var _g316 = 0;
						while(_g316 < width2) {
							var x26 = _g316++;
							cb7 = data.b[r + 2] + (cb7 + bgra.b[w - stride13] >> 1) & 255;
							bgra.set(w++,cb7);
							cg7 = data.b[r + 1] + (cg7 + bgra.b[w - stride13] >> 1) & 255;
							bgra.set(w++,cg7);
							cr7 = data.b[r] + (cr7 + bgra.b[w - stride13] >> 1) & 255;
							bgra.set(w++,cr7);
							ca10 = data.b[r + 3] + (ca10 + bgra.b[w - stride13] >> 1) & 255;
							bgra.set(w++,ca10);
							r += 4;
						}
					} else {
						var _g317 = 0;
						while(_g317 < width2) {
							var x27 = _g317++;
							cb7 = data.b[r + 2] + (cb7 + bgra.b[w - stride13] >> 1) & 255;
							bgra.set(w++,cb7);
							cg7 = data.b[r + 1] + (cg7 + bgra.b[w - stride13] >> 1) & 255;
							bgra.set(w++,cg7);
							cr7 = data.b[r] + (cr7 + bgra.b[w - stride13] >> 1) & 255;
							bgra.set(w++,cr7);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 4:
					var stride14 = width2 * 4;
					var cr8 = 0;
					var cg8 = 0;
					var cb8 = 0;
					var ca11 = 0;
					if(alpha3) {
						var _g318 = 0;
						while(_g318 < width2) {
							var x28 = _g318++;
							cb8 = format.png.Tools.filter(bgra,x28,y3,stride14,cb8,w,null) + data.b[r + 2] & 255;
							bgra.set(w++,cb8);
							cg8 = format.png.Tools.filter(bgra,x28,y3,stride14,cg8,w,null) + data.b[r + 1] & 255;
							bgra.set(w++,cg8);
							cr8 = format.png.Tools.filter(bgra,x28,y3,stride14,cr8,w,null) + data.b[r] & 255;
							bgra.set(w++,cr8);
							ca11 = format.png.Tools.filter(bgra,x28,y3,stride14,ca11,w,null) + data.b[r + 3] & 255;
							bgra.set(w++,ca11);
							r += 4;
						}
					} else {
						var _g319 = 0;
						while(_g319 < width2) {
							var x29 = _g319++;
							cb8 = format.png.Tools.filter(bgra,x29,y3,stride14,cb8,w,null) + data.b[r + 2] & 255;
							bgra.set(w++,cb8);
							cg8 = format.png.Tools.filter(bgra,x29,y3,stride14,cg8,w,null) + data.b[r + 1] & 255;
							bgra.set(w++,cg8);
							cr8 = format.png.Tools.filter(bgra,x29,y3,stride14,cr8,w,null) + data.b[r] & 255;
							bgra.set(w++,cr8);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				default:
					throw "Invalid filter " + f3;
				}
			}
			break;
		}
	}
	return bgra;
};
format.png.Tools.buildGrey = function(width,height,data) {
	var rgb = haxe.io.Bytes.alloc(width * height + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgb.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgb.set(w++,data.get(r++));
		}
	}
	var l = new List();
	l.add(format.png.Chunk.CHeader({ width : width, height : height, colbits : 8, color : format.png.Color.ColGrey(false), interlaced : false}));
	l.add(format.png.Chunk.CData(format.tools.Deflate.run(rgb)));
	l.add(format.png.Chunk.CEnd);
	return l;
};
format.png.Tools.buildRGB = function(width,height,data) {
	var rgb = haxe.io.Bytes.alloc(width * height * 3 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgb.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgb.set(w++,data.b[r + 2]);
			rgb.set(w++,data.b[r + 1]);
			rgb.set(w++,data.b[r]);
			r += 3;
		}
	}
	var l = new List();
	l.add(format.png.Chunk.CHeader({ width : width, height : height, colbits : 8, color : format.png.Color.ColTrue(false), interlaced : false}));
	l.add(format.png.Chunk.CData(format.tools.Deflate.run(rgb)));
	l.add(format.png.Chunk.CEnd);
	return l;
};
format.png.Tools.build32ARGB = function(width,height,data) {
	var rgba = haxe.io.Bytes.alloc(width * height * 4 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgba.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgba.set(w++,data.b[r + 1]);
			rgba.set(w++,data.b[r + 2]);
			rgba.set(w++,data.b[r + 3]);
			rgba.set(w++,data.b[r]);
			r += 4;
		}
	}
	var l = new List();
	l.add(format.png.Chunk.CHeader({ width : width, height : height, colbits : 8, color : format.png.Color.ColTrue(true), interlaced : false}));
	l.add(format.png.Chunk.CData(format.tools.Deflate.run(rgba)));
	l.add(format.png.Chunk.CEnd);
	return l;
};
format.png.Tools.build32BGRA = function(width,height,data) {
	var rgba = haxe.io.Bytes.alloc(width * height * 4 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgba.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgba.set(w++,data.b[r + 2]);
			rgba.set(w++,data.b[r + 1]);
			rgba.set(w++,data.b[r]);
			rgba.set(w++,data.b[r + 3]);
			r += 4;
		}
	}
	var l = new List();
	l.add(format.png.Chunk.CHeader({ width : width, height : height, colbits : 8, color : format.png.Color.ColTrue(true), interlaced : false}));
	l.add(format.png.Chunk.CData(format.tools.Deflate.run(rgba)));
	l.add(format.png.Chunk.CEnd);
	return l;
};
format.png.Writer = function(o) {
	this.o = o;
	o.set_bigEndian(true);
};
format.png.Writer.__name__ = true;
format.png.Writer.prototype = {
	o: null
	,write: function(png) {
		var _g = 0;
		var _g1 = [137,80,78,71,13,10,26,10];
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			this.o.writeByte(b);
		}
		var $it0 = png.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			switch(c[1]) {
			case 1:
				var h = c[2];
				var b1 = new haxe.io.BytesOutput();
				b1.set_bigEndian(true);
				b1.writeInt32(h.width);
				b1.writeInt32(h.height);
				b1.writeByte(h.colbits);
				b1.writeByte((function($this) {
					var $r;
					var _g2 = h.color;
					$r = (function($this) {
						var $r;
						switch(_g2[1]) {
						case 0:
							$r = (function($this) {
								var $r;
								var alpha = _g2[2];
								$r = alpha?4:0;
								return $r;
							}($this));
							break;
						case 1:
							$r = (function($this) {
								var $r;
								var alpha1 = _g2[2];
								$r = alpha1?6:2;
								return $r;
							}($this));
							break;
						case 2:
							$r = 3;
							break;
						}
						return $r;
					}($this));
					return $r;
				}(this)));
				b1.writeByte(0);
				b1.writeByte(0);
				b1.writeByte(h.interlaced?1:0);
				this.writeChunk("IHDR",b1.getBytes());
				break;
			case 0:
				this.writeChunk("IEND",haxe.io.Bytes.alloc(0));
				break;
			case 2:
				var d = c[2];
				this.writeChunk("IDAT",d);
				break;
			case 3:
				var b2 = c[2];
				this.writeChunk("PLTE",b2);
				break;
			case 4:
				var data = c[3];
				var id = c[2];
				this.writeChunk(id,data);
				break;
			}
		}
	}
	,writeChunk: function(id,data) {
		this.o.writeInt32(data.length);
		this.o.writeString(id);
		this.o.write(data);
		var crc = new haxe.crypto.Crc32();
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			crc["byte"](HxOverrides.cca(id,i));
		}
		crc.update(data,0,data.length);
		this.o.writeInt32(crc.get());
	}
	,__class__: format.png.Writer
};
format.tools = {};
format.tools.Adler32 = function() {
	this.a1 = 1;
	this.a2 = 0;
};
format.tools.Adler32.__name__ = true;
format.tools.Adler32.read = function(i) {
	var a = new format.tools.Adler32();
	var a2a = i.readByte();
	var a2b = i.readByte();
	var a1a = i.readByte();
	var a1b = i.readByte();
	a.a1 = a1a << 8 | a1b;
	a.a2 = a2a << 8 | a2b;
	return a;
};
format.tools.Adler32.prototype = {
	a1: null
	,a2: null
	,update: function(b,pos,len) {
		var a1 = this.a1;
		var a2 = this.a2;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var p = _g1++;
			var c = b.b[p];
			a1 = (a1 + c) % 65521;
			a2 = (a2 + a1) % 65521;
		}
		this.a1 = a1;
		this.a2 = a2;
	}
	,equals: function(a) {
		return a.a1 == this.a1 && a.a2 == this.a2;
	}
	,__class__: format.tools.Adler32
};
format.tools.Deflate = function() { };
format.tools.Deflate.__name__ = true;
format.tools.Deflate.run = function(b) {
	throw "Deflate is not supported on this platform";
	return null;
};
format.tools.Huffman = { __ename__ : true, __constructs__ : ["Found","NeedBit","NeedBits"] };
format.tools.Huffman.Found = function(i) { var $x = ["Found",0,i]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; };
format.tools.Huffman.NeedBit = function(left,right) { var $x = ["NeedBit",1,left,right]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; };
format.tools.Huffman.NeedBits = function(n,table) { var $x = ["NeedBits",2,n,table]; $x.__enum__ = format.tools.Huffman; $x.toString = $estr; return $x; };
format.tools.HuffTools = function() {
};
format.tools.HuffTools.__name__ = true;
format.tools.HuffTools.prototype = {
	treeDepth: function(t) {
		switch(t[1]) {
		case 0:
			return 0;
		case 2:
			throw "assert";
			break;
		case 1:
			var b = t[3];
			var a = t[2];
			var da = this.treeDepth(a);
			var db = this.treeDepth(b);
			return 1 + (da < db?da:db);
		}
	}
	,treeCompress: function(t) {
		var d = this.treeDepth(t);
		if(d == 0) return t;
		if(d == 1) switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			return format.tools.Huffman.NeedBit(this.treeCompress(a),this.treeCompress(b));
		default:
			throw "assert";
		}
		var size = 1 << d;
		var table = new Array();
		var _g = 0;
		while(_g < size) {
			var i = _g++;
			table.push(format.tools.Huffman.Found(-1));
		}
		this.treeWalk(table,0,0,d,t);
		return format.tools.Huffman.NeedBits(d,table);
	}
	,treeWalk: function(table,p,cd,d,t) {
		switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			if(d > 0) {
				this.treeWalk(table,p,cd + 1,d - 1,a);
				this.treeWalk(table,p | 1 << cd,cd + 1,d - 1,b);
			} else table[p] = this.treeCompress(t);
			break;
		default:
			table[p] = this.treeCompress(t);
		}
	}
	,treeMake: function(bits,maxbits,v,len) {
		if(len > maxbits) throw "Invalid huffman";
		var idx = v << 5 | len;
		if(bits.exists(idx)) return format.tools.Huffman.Found(bits.get(idx));
		v <<= 1;
		len += 1;
		return format.tools.Huffman.NeedBit(this.treeMake(bits,maxbits,v,len),this.treeMake(bits,maxbits,v | 1,len));
	}
	,make: function(lengths,pos,nlengths,maxbits) {
		var counts = new Array();
		var tmp = new Array();
		if(maxbits > 32) throw "Invalid huffman";
		var _g = 0;
		while(_g < maxbits) {
			var i = _g++;
			counts.push(0);
			tmp.push(0);
		}
		var _g1 = 0;
		while(_g1 < nlengths) {
			var i1 = _g1++;
			var p = lengths[i1 + pos];
			if(p >= maxbits) throw "Invalid huffman";
			counts[p]++;
		}
		var code = 0;
		var _g11 = 1;
		var _g2 = maxbits - 1;
		while(_g11 < _g2) {
			var i2 = _g11++;
			code = code + counts[i2] << 1;
			tmp[i2] = code;
		}
		var bits = new haxe.ds.IntMap();
		var _g3 = 0;
		while(_g3 < nlengths) {
			var i3 = _g3++;
			var l = lengths[i3 + pos];
			if(l != 0) {
				var n = tmp[l - 1];
				tmp[l - 1] = n + 1;
				bits.set(n << 5 | l,i3);
			}
		}
		return this.treeCompress(format.tools.Huffman.NeedBit(this.treeMake(bits,maxbits,0,1),this.treeMake(bits,maxbits,1,1)));
	}
	,__class__: format.tools.HuffTools
};
format.tools.Inflate = function() { };
format.tools.Inflate.__name__ = true;
format.tools.Inflate.run = function(bytes) {
	return format.tools.InflateImpl.run(new haxe.io.BytesInput(bytes));
};
format.tools._InflateImpl = {};
format.tools._InflateImpl.Window = function(hasCrc) {
	this.buffer = haxe.io.Bytes.alloc(65536);
	this.pos = 0;
	if(hasCrc) this.crc = new format.tools.Adler32();
};
format.tools._InflateImpl.Window.__name__ = true;
format.tools._InflateImpl.Window.prototype = {
	buffer: null
	,pos: null
	,crc: null
	,slide: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,32768);
		var b = haxe.io.Bytes.alloc(65536);
		this.pos -= 32768;
		b.blit(0,this.buffer,32768,this.pos);
		this.buffer = b;
	}
	,addBytes: function(b,p,len) {
		if(this.pos + len > 65536) this.slide();
		this.buffer.blit(this.pos,b,p,len);
		this.pos += len;
	}
	,addByte: function(c) {
		if(this.pos == 65536) this.slide();
		this.buffer.b[this.pos] = c & 255;
		this.pos++;
	}
	,getLastChar: function() {
		return this.buffer.b[this.pos - 1];
	}
	,available: function() {
		return this.pos;
	}
	,checksum: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,this.pos);
		return this.crc;
	}
	,__class__: format.tools._InflateImpl.Window
};
format.tools._InflateImpl.State = { __ename__ : true, __constructs__ : ["Head","Block","CData","Flat","Crc","Dist","DistOne","Done"] };
format.tools._InflateImpl.State.Head = ["Head",0];
format.tools._InflateImpl.State.Head.toString = $estr;
format.tools._InflateImpl.State.Head.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Block = ["Block",1];
format.tools._InflateImpl.State.Block.toString = $estr;
format.tools._InflateImpl.State.Block.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.CData = ["CData",2];
format.tools._InflateImpl.State.CData.toString = $estr;
format.tools._InflateImpl.State.CData.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Flat = ["Flat",3];
format.tools._InflateImpl.State.Flat.toString = $estr;
format.tools._InflateImpl.State.Flat.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Crc = ["Crc",4];
format.tools._InflateImpl.State.Crc.toString = $estr;
format.tools._InflateImpl.State.Crc.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Dist = ["Dist",5];
format.tools._InflateImpl.State.Dist.toString = $estr;
format.tools._InflateImpl.State.Dist.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.DistOne = ["DistOne",6];
format.tools._InflateImpl.State.DistOne.toString = $estr;
format.tools._InflateImpl.State.DistOne.__enum__ = format.tools._InflateImpl.State;
format.tools._InflateImpl.State.Done = ["Done",7];
format.tools._InflateImpl.State.Done.toString = $estr;
format.tools._InflateImpl.State.Done.__enum__ = format.tools._InflateImpl.State;
format.tools.InflateImpl = function(i,header,crc) {
	if(crc == null) crc = true;
	if(header == null) header = true;
	this["final"] = false;
	this.htools = new format.tools.HuffTools();
	this.huffman = this.buildFixedHuffman();
	this.huffdist = null;
	this.len = 0;
	this.dist = 0;
	if(header) this.state = format.tools._InflateImpl.State.Head; else this.state = format.tools._InflateImpl.State.Block;
	this.input = i;
	this.bits = 0;
	this.nbits = 0;
	this.needed = 0;
	this.output = null;
	this.outpos = 0;
	this.lengths = new Array();
	var _g = 0;
	while(_g < 19) {
		var i1 = _g++;
		this.lengths.push(-1);
	}
	this.window = new format.tools._InflateImpl.Window(crc);
};
format.tools.InflateImpl.__name__ = true;
format.tools.InflateImpl.run = function(i,bufsize) {
	if(bufsize == null) bufsize = 65536;
	var buf = haxe.io.Bytes.alloc(bufsize);
	var output = new haxe.io.BytesBuffer();
	var inflate = new format.tools.InflateImpl(i);
	while(true) {
		var len = inflate.readBytes(buf,0,bufsize);
		output.addBytes(buf,0,len);
		if(len < bufsize) break;
	}
	return output.getBytes();
};
format.tools.InflateImpl.prototype = {
	nbits: null
	,bits: null
	,state: null
	,'final': null
	,huffman: null
	,huffdist: null
	,htools: null
	,len: null
	,dist: null
	,needed: null
	,output: null
	,outpos: null
	,input: null
	,lengths: null
	,window: null
	,buildFixedHuffman: function() {
		if(format.tools.InflateImpl.FIXED_HUFFMAN != null) return format.tools.InflateImpl.FIXED_HUFFMAN;
		var a = new Array();
		var _g = 0;
		while(_g < 288) {
			var n = _g++;
			a.push(n <= 143?8:n <= 255?9:n <= 279?7:8);
		}
		format.tools.InflateImpl.FIXED_HUFFMAN = this.htools.make(a,0,288,10);
		return format.tools.InflateImpl.FIXED_HUFFMAN;
	}
	,readBytes: function(b,pos,len) {
		this.needed = len;
		this.outpos = pos;
		this.output = b;
		if(len > 0) while(this.inflateLoop()) {
		}
		return len - this.needed;
	}
	,getBits: function(n) {
		while(this.nbits < n) {
			this.bits |= this.input.readByte() << this.nbits;
			this.nbits += 8;
		}
		var b = this.bits & (1 << n) - 1;
		this.nbits -= n;
		this.bits >>= n;
		return b;
	}
	,getBit: function() {
		if(this.nbits == 0) {
			this.nbits = 8;
			this.bits = this.input.readByte();
		}
		var b = (this.bits & 1) == 1;
		this.nbits--;
		this.bits >>= 1;
		return b;
	}
	,getRevBits: function(n) {
		if(n == 0) return 0; else if(this.getBit()) return 1 << n - 1 | this.getRevBits(n - 1); else return this.getRevBits(n - 1);
	}
	,resetBits: function() {
		this.bits = 0;
		this.nbits = 0;
	}
	,addBytes: function(b,p,len) {
		this.window.addBytes(b,p,len);
		this.output.blit(this.outpos,b,p,len);
		this.needed -= len;
		this.outpos += len;
	}
	,addByte: function(b) {
		this.window.addByte(b);
		this.output.b[this.outpos] = b & 255;
		this.needed--;
		this.outpos++;
	}
	,addDistOne: function(n) {
		var c = this.window.getLastChar();
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this.addByte(c);
		}
	}
	,addDist: function(d,len) {
		this.addBytes(this.window.buffer,this.window.pos - d,len);
	}
	,applyHuffman: function(h) {
		switch(h[1]) {
		case 0:
			var n = h[2];
			return n;
		case 1:
			var b = h[3];
			var a = h[2];
			return this.applyHuffman(this.getBit()?b:a);
		case 2:
			var tbl = h[3];
			var n1 = h[2];
			return this.applyHuffman(tbl[this.getBits(n1)]);
		}
	}
	,inflateLengths: function(a,max) {
		var i = 0;
		var prev = 0;
		while(i < max) {
			var n = this.applyHuffman(this.huffman);
			switch(n) {
			case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:case 10:case 11:case 12:case 13:case 14:case 15:
				prev = n;
				a[i] = n;
				i++;
				break;
			case 16:
				var end = i + 3 + this.getBits(2);
				if(end > max) throw "Invalid data";
				while(i < end) {
					a[i] = prev;
					i++;
				}
				break;
			case 17:
				i += 3 + this.getBits(3);
				if(i > max) throw "Invalid data";
				break;
			case 18:
				i += 11 + this.getBits(7);
				if(i > max) throw "Invalid data";
				break;
			default:
				throw "Invalid data";
			}
		}
	}
	,inflateLoop: function() {
		var _g = this.state;
		switch(_g[1]) {
		case 0:
			var cmf = this.input.readByte();
			var cm = cmf & 15;
			var cinfo = cmf >> 4;
			if(cm != 8) throw "Invalid data";
			var flg = this.input.readByte();
			var fdict = (flg & 32) != 0;
			if(((cmf << 8) + flg) % 31 != 0) throw "Invalid data";
			if(fdict) throw "Unsupported dictionary";
			this.state = format.tools._InflateImpl.State.Block;
			return true;
		case 4:
			var calc = this.window.checksum();
			if(calc == null) {
				this.state = format.tools._InflateImpl.State.Done;
				return true;
			}
			var crc = format.tools.Adler32.read(this.input);
			if(!calc.equals(crc)) throw "Invalid CRC";
			this.state = format.tools._InflateImpl.State.Done;
			return true;
		case 7:
			return false;
		case 1:
			this["final"] = this.getBit();
			var _g1 = this.getBits(2);
			switch(_g1) {
			case 0:
				this.len = this.input.readUInt16();
				var nlen = this.input.readUInt16();
				if(nlen != 65535 - this.len) throw "Invalid data";
				this.state = format.tools._InflateImpl.State.Flat;
				var r = this.inflateLoop();
				this.resetBits();
				return r;
			case 1:
				this.huffman = this.buildFixedHuffman();
				this.huffdist = null;
				this.state = format.tools._InflateImpl.State.CData;
				return true;
			case 2:
				var hlit = this.getBits(5) + 257;
				var hdist = this.getBits(5) + 1;
				var hclen = this.getBits(4) + 4;
				var _g2 = 0;
				while(_g2 < hclen) {
					var i = _g2++;
					this.lengths[format.tools.InflateImpl.CODE_LENGTHS_POS[i]] = this.getBits(3);
				}
				var _g21 = hclen;
				while(_g21 < 19) {
					var i1 = _g21++;
					this.lengths[format.tools.InflateImpl.CODE_LENGTHS_POS[i1]] = 0;
				}
				this.huffman = this.htools.make(this.lengths,0,19,8);
				var lengths = new Array();
				var _g3 = 0;
				var _g22 = hlit + hdist;
				while(_g3 < _g22) {
					var i2 = _g3++;
					lengths.push(0);
				}
				this.inflateLengths(lengths,hlit + hdist);
				this.huffdist = this.htools.make(lengths,hlit,hdist,16);
				this.huffman = this.htools.make(lengths,0,hlit,16);
				this.state = format.tools._InflateImpl.State.CData;
				return true;
			default:
				throw "Invalid data";
			}
			break;
		case 3:
			var rlen;
			if(this.len < this.needed) rlen = this.len; else rlen = this.needed;
			var bytes = this.input.read(rlen);
			this.len -= rlen;
			this.addBytes(bytes,0,rlen);
			if(this.len == 0) if(this["final"]) this.state = format.tools._InflateImpl.State.Crc; else this.state = format.tools._InflateImpl.State.Block;
			return this.needed > 0;
		case 6:
			var rlen1;
			if(this.len < this.needed) rlen1 = this.len; else rlen1 = this.needed;
			this.addDistOne(rlen1);
			this.len -= rlen1;
			if(this.len == 0) this.state = format.tools._InflateImpl.State.CData;
			return this.needed > 0;
		case 5:
			while(this.len > 0 && this.needed > 0) {
				var rdist;
				if(this.len < this.dist) rdist = this.len; else rdist = this.dist;
				var rlen2;
				if(this.needed < rdist) rlen2 = this.needed; else rlen2 = rdist;
				this.addDist(this.dist,rlen2);
				this.len -= rlen2;
			}
			if(this.len == 0) this.state = format.tools._InflateImpl.State.CData;
			return this.needed > 0;
		case 2:
			var n = this.applyHuffman(this.huffman);
			if(n < 256) {
				this.addByte(n);
				return this.needed > 0;
			} else if(n == 256) {
				if(this["final"]) this.state = format.tools._InflateImpl.State.Crc; else this.state = format.tools._InflateImpl.State.Block;
				return true;
			} else {
				n -= 257;
				var extra_bits = format.tools.InflateImpl.LEN_EXTRA_BITS_TBL[n];
				if(extra_bits == -1) throw "Invalid data";
				this.len = format.tools.InflateImpl.LEN_BASE_VAL_TBL[n] + this.getBits(extra_bits);
				var dist_code;
				if(this.huffdist == null) dist_code = this.getRevBits(5); else dist_code = this.applyHuffman(this.huffdist);
				extra_bits = format.tools.InflateImpl.DIST_EXTRA_BITS_TBL[dist_code];
				if(extra_bits == -1) throw "Invalid data";
				this.dist = format.tools.InflateImpl.DIST_BASE_VAL_TBL[dist_code] + this.getBits(extra_bits);
				if(this.dist > this.window.available()) throw "Invalid data";
				if(this.dist == 1) this.state = format.tools._InflateImpl.State.DistOne; else this.state = format.tools._InflateImpl.State.Dist;
				return true;
			}
			break;
		}
	}
	,__class__: format.tools.InflateImpl
};
var haxe = {};
haxe.StackItem = { __ename__ : true, __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; };
haxe.CallStack = function() { };
haxe.CallStack.__name__ = true;
haxe.CallStack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.CallStack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe.CallStack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
};
haxe.Log = function() { };
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Resource = function() { };
haxe.Resource.__name__ = true;
haxe.Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return x.str;
			var b = haxe.crypto.Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
haxe.Resource.getBytes = function(name) {
	var _g = 0;
	var _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return haxe.io.Bytes.ofString(x.str);
			return haxe.crypto.Base64.decode(x.data);
		}
	}
	return null;
};
haxe.Timer = function() { };
haxe.Timer.__name__ = true;
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe.Utf8 = function(size) {
	this.__b = "";
};
haxe.Utf8.__name__ = true;
haxe.Utf8.prototype = {
	__b: null
	,__class__: haxe.Utf8
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
};
haxe.io.Bytes.prototype = {
	length: null
	,b: null
	,get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i1 = _g++;
			b1[i1 + pos] = b2[i1 + srcpos];
		}
	}
	,fill: function(pos,len,value) {
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.set(pos++,value);
		}
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,getData: function() {
		return this.b;
	}
	,__class__: haxe.io.Bytes
};
haxe.crypto = {};
haxe.crypto.Base64 = function() { };
haxe.crypto.Base64.__name__ = true;
haxe.crypto.Base64.decode = function(str,complement) {
	if(complement == null) complement = true;
	if(complement) while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	return new haxe.crypto.BaseCode(haxe.crypto.Base64.BYTES).decodeBytes(haxe.io.Bytes.ofString(str));
};
haxe.crypto.BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw "BaseCode : base length must be a power of two.";
	this.base = base;
	this.nbits = nbits;
};
haxe.crypto.BaseCode.__name__ = true;
haxe.crypto.BaseCode.prototype = {
	base: null
	,nbits: null
	,tbl: null
	,initTable: function() {
		var tbl = new Array();
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe.io.Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.get(pin++)];
				if(i == -1) throw "BaseCode : invalid encoded char";
				buf |= i;
			}
			curbits -= 8;
			out.set(pout++,buf >> curbits & 255);
		}
		return out;
	}
	,__class__: haxe.crypto.BaseCode
};
haxe.crypto.Crc32 = function() {
	this.crc = -1;
};
haxe.crypto.Crc32.__name__ = true;
haxe.crypto.Crc32.prototype = {
	crc: null
	,'byte': function(b) {
		var tmp = (this.crc ^ b) & 255;
		var _g = 0;
		while(_g < 8) {
			var j = _g++;
			if((tmp & 1) == 1) tmp = tmp >>> 1 ^ -306674912; else tmp >>>= 1;
		}
		this.crc = this.crc >>> 8 ^ tmp;
	}
	,update: function(b,pos,len) {
		var b1 = b.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			var tmp = (this.crc ^ b1[i]) & 255;
			var _g2 = 0;
			while(_g2 < 8) {
				var j = _g2++;
				if((tmp & 1) == 1) tmp = tmp >>> 1 ^ -306674912; else tmp >>>= 1;
			}
			this.crc = this.crc >>> 8 ^ tmp;
		}
	}
	,get: function() {
		return this.crc ^ -1;
	}
	,__class__: haxe.crypto.Crc32
};
haxe.crypto.Md5 = function() {
};
haxe.crypto.Md5.__name__ = true;
haxe.crypto.Md5.encode = function(s) {
	var m = new haxe.crypto.Md5();
	var h = m.doEncode(haxe.crypto.Md5.str2blks(s));
	return m.hex(h);
};
haxe.crypto.Md5.str2blks = function(str) {
	var nblk = (str.length + 8 >> 6) + 1;
	var blks = new Array();
	var blksSize = nblk * 16;
	var _g = 0;
	while(_g < blksSize) {
		var i = _g++;
		blks[i] = 0;
	}
	var i1 = 0;
	while(i1 < str.length) {
		blks[i1 >> 2] |= HxOverrides.cca(str,i1) << (str.length * 8 + i1) % 4 * 8;
		i1++;
	}
	blks[i1 >> 2] |= 128 << (str.length * 8 + i1) % 4 * 8;
	var l = str.length * 8;
	var k = nblk * 16 - 2;
	blks[k] = l & 255;
	blks[k] |= (l >>> 8 & 255) << 8;
	blks[k] |= (l >>> 16 & 255) << 16;
	blks[k] |= (l >>> 24 & 255) << 24;
	return blks;
};
haxe.crypto.Md5.prototype = {
	bitOR: function(a,b) {
		var lsb = a & 1 | b & 1;
		var msb31 = a >>> 1 | b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitXOR: function(a,b) {
		var lsb = a & 1 ^ b & 1;
		var msb31 = a >>> 1 ^ b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitAND: function(a,b) {
		var lsb = a & 1 & (b & 1);
		var msb31 = a >>> 1 & b >>> 1;
		return msb31 << 1 | lsb;
	}
	,addme: function(x,y) {
		var lsw = (x & 65535) + (y & 65535);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	}
	,hex: function(a) {
		var str = "";
		var hex_chr = "0123456789abcdef";
		var _g = 0;
		while(_g < a.length) {
			var num = a[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < 4) {
				var j = _g1++;
				str += hex_chr.charAt(num >> j * 8 + 4 & 15) + hex_chr.charAt(num >> j * 8 & 15);
			}
		}
		return str;
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,cmn: function(q,a,b,x,s,t) {
		return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
	}
	,ff: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
	}
	,gg: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
	}
	,hh: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
	}
	,ii: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
	}
	,doEncode: function(x) {
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			step = 0;
			a = this.ff(a,b,c,d,x[i],7,-680876936);
			d = this.ff(d,a,b,c,x[i + 1],12,-389564586);
			c = this.ff(c,d,a,b,x[i + 2],17,606105819);
			b = this.ff(b,c,d,a,x[i + 3],22,-1044525330);
			a = this.ff(a,b,c,d,x[i + 4],7,-176418897);
			d = this.ff(d,a,b,c,x[i + 5],12,1200080426);
			c = this.ff(c,d,a,b,x[i + 6],17,-1473231341);
			b = this.ff(b,c,d,a,x[i + 7],22,-45705983);
			a = this.ff(a,b,c,d,x[i + 8],7,1770035416);
			d = this.ff(d,a,b,c,x[i + 9],12,-1958414417);
			c = this.ff(c,d,a,b,x[i + 10],17,-42063);
			b = this.ff(b,c,d,a,x[i + 11],22,-1990404162);
			a = this.ff(a,b,c,d,x[i + 12],7,1804603682);
			d = this.ff(d,a,b,c,x[i + 13],12,-40341101);
			c = this.ff(c,d,a,b,x[i + 14],17,-1502002290);
			b = this.ff(b,c,d,a,x[i + 15],22,1236535329);
			a = this.gg(a,b,c,d,x[i + 1],5,-165796510);
			d = this.gg(d,a,b,c,x[i + 6],9,-1069501632);
			c = this.gg(c,d,a,b,x[i + 11],14,643717713);
			b = this.gg(b,c,d,a,x[i],20,-373897302);
			a = this.gg(a,b,c,d,x[i + 5],5,-701558691);
			d = this.gg(d,a,b,c,x[i + 10],9,38016083);
			c = this.gg(c,d,a,b,x[i + 15],14,-660478335);
			b = this.gg(b,c,d,a,x[i + 4],20,-405537848);
			a = this.gg(a,b,c,d,x[i + 9],5,568446438);
			d = this.gg(d,a,b,c,x[i + 14],9,-1019803690);
			c = this.gg(c,d,a,b,x[i + 3],14,-187363961);
			b = this.gg(b,c,d,a,x[i + 8],20,1163531501);
			a = this.gg(a,b,c,d,x[i + 13],5,-1444681467);
			d = this.gg(d,a,b,c,x[i + 2],9,-51403784);
			c = this.gg(c,d,a,b,x[i + 7],14,1735328473);
			b = this.gg(b,c,d,a,x[i + 12],20,-1926607734);
			a = this.hh(a,b,c,d,x[i + 5],4,-378558);
			d = this.hh(d,a,b,c,x[i + 8],11,-2022574463);
			c = this.hh(c,d,a,b,x[i + 11],16,1839030562);
			b = this.hh(b,c,d,a,x[i + 14],23,-35309556);
			a = this.hh(a,b,c,d,x[i + 1],4,-1530992060);
			d = this.hh(d,a,b,c,x[i + 4],11,1272893353);
			c = this.hh(c,d,a,b,x[i + 7],16,-155497632);
			b = this.hh(b,c,d,a,x[i + 10],23,-1094730640);
			a = this.hh(a,b,c,d,x[i + 13],4,681279174);
			d = this.hh(d,a,b,c,x[i],11,-358537222);
			c = this.hh(c,d,a,b,x[i + 3],16,-722521979);
			b = this.hh(b,c,d,a,x[i + 6],23,76029189);
			a = this.hh(a,b,c,d,x[i + 9],4,-640364487);
			d = this.hh(d,a,b,c,x[i + 12],11,-421815835);
			c = this.hh(c,d,a,b,x[i + 15],16,530742520);
			b = this.hh(b,c,d,a,x[i + 2],23,-995338651);
			a = this.ii(a,b,c,d,x[i],6,-198630844);
			d = this.ii(d,a,b,c,x[i + 7],10,1126891415);
			c = this.ii(c,d,a,b,x[i + 14],15,-1416354905);
			b = this.ii(b,c,d,a,x[i + 5],21,-57434055);
			a = this.ii(a,b,c,d,x[i + 12],6,1700485571);
			d = this.ii(d,a,b,c,x[i + 3],10,-1894986606);
			c = this.ii(c,d,a,b,x[i + 10],15,-1051523);
			b = this.ii(b,c,d,a,x[i + 1],21,-2054922799);
			a = this.ii(a,b,c,d,x[i + 8],6,1873313359);
			d = this.ii(d,a,b,c,x[i + 15],10,-30611744);
			c = this.ii(c,d,a,b,x[i + 6],15,-1560198380);
			b = this.ii(b,c,d,a,x[i + 13],21,1309151649);
			a = this.ii(a,b,c,d,x[i + 4],6,-145523070);
			d = this.ii(d,a,b,c,x[i + 11],10,-1120210379);
			c = this.ii(c,d,a,b,x[i + 2],15,718787259);
			b = this.ii(b,c,d,a,x[i + 9],21,-343485551);
			a = this.addme(a,olda);
			b = this.addme(b,oldb);
			c = this.addme(c,oldc);
			d = this.addme(d,oldd);
			i += 16;
		}
		return [a,b,c,d];
	}
	,__class__: haxe.crypto.Md5
};
haxe.ds = {};
haxe.ds.BalancedTree = function() {
};
haxe.ds.BalancedTree.__name__ = true;
haxe.ds.BalancedTree.prototype = {
	root: null
	,set: function(key,value) {
		this.root = this.setLoop(key,value,this.root);
	}
	,remove: function(key) {
		try {
			this.root = this.removeLoop(key,this.root);
			return true;
		} catch( e ) {
			if( js.Boot.__instanceof(e,String) ) {
				return false;
			} else throw(e);
		}
	}
	,exists: function(key) {
		var node = this.root;
		while(node != null) {
			var c = this.compare(key,node.key);
			if(c == 0) return true; else if(c < 0) node = node.left; else node = node.right;
		}
		return false;
	}
	,iterator: function() {
		var ret = [];
		this.iteratorLoop(this.root,ret);
		return HxOverrides.iter(ret);
	}
	,setLoop: function(k,v,node) {
		if(node == null) return new haxe.ds.TreeNode(null,k,v,null);
		var c = this.compare(k,node.key);
		if(c == 0) return new haxe.ds.TreeNode(node.left,k,v,node.right,node == null?0:node._height); else if(c < 0) {
			var nl = this.setLoop(k,v,node.left);
			return this.balance(nl,node.key,node.value,node.right);
		} else {
			var nr = this.setLoop(k,v,node.right);
			return this.balance(node.left,node.key,node.value,nr);
		}
	}
	,removeLoop: function(k,node) {
		if(node == null) throw "Not_found";
		var c = this.compare(k,node.key);
		if(c == 0) return this.merge(node.left,node.right); else if(c < 0) return this.balance(this.removeLoop(k,node.left),node.key,node.value,node.right); else return this.balance(node.left,node.key,node.value,this.removeLoop(k,node.right));
	}
	,iteratorLoop: function(node,acc) {
		if(node != null) {
			this.iteratorLoop(node.left,acc);
			acc.push(node.value);
			this.iteratorLoop(node.right,acc);
		}
	}
	,merge: function(t1,t2) {
		if(t1 == null) return t2;
		if(t2 == null) return t1;
		var t = this.minBinding(t2);
		return this.balance(t1,t.key,t.value,this.removeMinBinding(t2));
	}
	,minBinding: function(t) {
		if(t == null) throw "Not_found"; else if(t.left == null) return t; else return this.minBinding(t.left);
	}
	,removeMinBinding: function(t) {
		if(t.left == null) return t.right; else return this.balance(this.removeMinBinding(t.left),t.key,t.value,t.right);
	}
	,balance: function(l,k,v,r) {
		var hl;
		if(l == null) hl = 0; else hl = l._height;
		var hr;
		if(r == null) hr = 0; else hr = r._height;
		if(hl > hr + 2) {
			if((function($this) {
				var $r;
				var _this = l.left;
				$r = _this == null?0:_this._height;
				return $r;
			}(this)) >= (function($this) {
				var $r;
				var _this1 = l.right;
				$r = _this1 == null?0:_this1._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(l.left,l.key,l.value,new haxe.ds.TreeNode(l.right,k,v,r)); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l.left,l.key,l.value,l.right.left),l.right.key,l.right.value,new haxe.ds.TreeNode(l.right.right,k,v,r));
		} else if(hr > hl + 2) {
			if((function($this) {
				var $r;
				var _this2 = r.right;
				$r = _this2 == null?0:_this2._height;
				return $r;
			}(this)) > (function($this) {
				var $r;
				var _this3 = r.left;
				$r = _this3 == null?0:_this3._height;
				return $r;
			}(this))) return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left),r.key,r.value,r.right); else return new haxe.ds.TreeNode(new haxe.ds.TreeNode(l,k,v,r.left.left),r.left.key,r.left.value,new haxe.ds.TreeNode(r.left.right,r.key,r.value,r.right));
		} else return new haxe.ds.TreeNode(l,k,v,r,(hl > hr?hl:hr) + 1);
	}
	,compare: function(k1,k2) {
		return Reflect.compare(k1,k2);
	}
	,__class__: haxe.ds.BalancedTree
};
haxe.ds.TreeNode = function(l,k,v,r,h) {
	if(h == null) h = -1;
	this.left = l;
	this.key = k;
	this.value = v;
	this.right = r;
	if(h == -1) this._height = ((function($this) {
		var $r;
		var _this = $this.left;
		$r = _this == null?0:_this._height;
		return $r;
	}(this)) > (function($this) {
		var $r;
		var _this1 = $this.right;
		$r = _this1 == null?0:_this1._height;
		return $r;
	}(this))?(function($this) {
		var $r;
		var _this2 = $this.left;
		$r = _this2 == null?0:_this2._height;
		return $r;
	}(this)):(function($this) {
		var $r;
		var _this3 = $this.right;
		$r = _this3 == null?0:_this3._height;
		return $r;
	}(this))) + 1; else this._height = h;
};
haxe.ds.TreeNode.__name__ = true;
haxe.ds.TreeNode.prototype = {
	left: null
	,right: null
	,key: null
	,value: null
	,_height: null
	,__class__: haxe.ds.TreeNode
};
haxe.ds.EnumValueMap = function() {
	haxe.ds.BalancedTree.call(this);
};
haxe.ds.EnumValueMap.__name__ = true;
haxe.ds.EnumValueMap.__interfaces__ = [IMap];
haxe.ds.EnumValueMap.__super__ = haxe.ds.BalancedTree;
haxe.ds.EnumValueMap.prototype = $extend(haxe.ds.BalancedTree.prototype,{
	compare: function(k1,k2) {
		var d = k1[1] - k2[1];
		if(d != 0) return d;
		var p1 = k1.slice(2);
		var p2 = k2.slice(2);
		if(p1.length == 0 && p2.length == 0) return 0;
		return this.compareArgs(p1,p2);
	}
	,compareArgs: function(a1,a2) {
		var ld = a1.length - a2.length;
		if(ld != 0) return ld;
		var _g1 = 0;
		var _g = a1.length;
		while(_g1 < _g) {
			var i = _g1++;
			var d = this.compareArg(a1[i],a2[i]);
			if(d != 0) return d;
		}
		return 0;
	}
	,compareArg: function(v1,v2) {
		if(Reflect.isEnumValue(v1) && Reflect.isEnumValue(v2)) return this.compare(v1,v2); else if((v1 instanceof Array) && v1.__enum__ == null && ((v2 instanceof Array) && v2.__enum__ == null)) return this.compareArgs(v1,v2); else return Reflect.compare(v1,v2);
	}
	,__class__: haxe.ds.EnumValueMap
});
haxe.ds.IntMap = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i.__id__];
		}};
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,__class__: haxe.ds.StringMap
};
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
haxe.io.BytesBuffer.__name__ = true;
haxe.io.BytesBuffer.prototype = {
	b: null
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0;
		var _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,__class__: haxe.io.BytesBuffer
};
haxe.io.Input = function() { };
haxe.io.Input.__name__ = true;
haxe.io.Input.prototype = {
	bigEndian: null
	,readByte: function() {
		throw "Not implemented";
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		if(this.bigEndian) return ch2 | ch1 << 8; else return ch1 | ch2 << 8;
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if(this.bigEndian) return ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24; else return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"set_bigEndian"}
};
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
haxe.io.BytesInput.__name__ = true;
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	b: null
	,pos: null
	,len: null
	,totlen: null
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,__class__: haxe.io.BytesInput
});
haxe.io.Output = function() { };
haxe.io.Output.__name__ = true;
haxe.io.Output.prototype = {
	bigEndian: null
	,writeByte: function(c) {
		throw "Not implemented";
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,set_bigEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			l -= k;
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeString: function(s) {
		var b = haxe.io.Bytes.ofString(s);
		this.writeFullBytes(b,0,b.length);
	}
	,__class__: haxe.io.Output
	,__properties__: {set_bigEndian:"set_bigEndian"}
};
haxe.io.BytesOutput = function() {
	this.b = new haxe.io.BytesBuffer();
};
haxe.io.BytesOutput.__name__ = true;
haxe.io.BytesOutput.__super__ = haxe.io.Output;
haxe.io.BytesOutput.prototype = $extend(haxe.io.Output.prototype,{
	b: null
	,writeByte: function(c) {
		this.b.b.push(c);
	}
	,writeBytes: function(buf,pos,len) {
		this.b.addBytes(buf,pos,len);
		return len;
	}
	,getBytes: function() {
		return this.b.getBytes();
	}
	,__class__: haxe.io.BytesOutput
});
haxe.io.Eof = function() {
};
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.io.Path = function(path) {
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		this.dir = HxOverrides.substr(path,0,c2);
		path = HxOverrides.substr(path,c2 + 1,null);
		this.backslash = true;
	} else if(c2 < c1) {
		this.dir = HxOverrides.substr(path,0,c1);
		path = HxOverrides.substr(path,c1 + 1,null);
	} else this.dir = null;
	var cp = path.lastIndexOf(".");
	if(cp != -1) {
		this.ext = HxOverrides.substr(path,cp + 1,null);
		this.file = HxOverrides.substr(path,0,cp);
	} else {
		this.ext = null;
		this.file = path;
	}
};
haxe.io.Path.__name__ = true;
haxe.io.Path.directory = function(path) {
	var s = new haxe.io.Path(path);
	if(s.dir == null) return "";
	return s.dir;
};
haxe.io.Path.extension = function(path) {
	var s = new haxe.io.Path(path);
	if(s.ext == null) return "";
	return s.ext;
};
haxe.io.Path.join = function(paths) {
	var paths1 = paths.filter(function(s) {
		return s != null && s != "";
	});
	if(paths1.length == 0) return "";
	var path = paths1[0];
	var _g1 = 1;
	var _g = paths1.length;
	while(_g1 < _g) {
		var i = _g1++;
		path = haxe.io.Path.addTrailingSlash(path);
		path += paths1[i];
	}
	return haxe.io.Path.normalize(path);
};
haxe.io.Path.normalize = function(path) {
	var slash = "/";
	path = path.split("\\").join("/");
	if(path == null || path == slash) return slash;
	var target = [];
	var src;
	var parts;
	var token;
	src = path.split(slash);
	var _g1 = 0;
	var _g = src.length;
	while(_g1 < _g) {
		var i = _g1++;
		token = src[i];
		if(token == "..") target.pop(); else if(token != ".") target.push(token);
	}
	var tmp = target.join(slash);
	var regex = new EReg("([^:])/+","g");
	var result = regex.replace(tmp,"$1" + slash);
	return result;
};
haxe.io.Path.addTrailingSlash = function(path) {
	if(path.length == 0) return "/";
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		if(c2 != path.length - 1) return path + "\\"; else return path;
	} else if(c1 != path.length - 1) return path + "/"; else return path;
};
haxe.io.Path.prototype = {
	dir: null
	,file: null
	,ext: null
	,backslash: null
	,__class__: haxe.io.Path
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.html = {};
js.html._CanvasElement = {};
js.html._CanvasElement.CanvasUtil = function() { };
js.html._CanvasElement.CanvasUtil.__name__ = true;
js.html._CanvasElement.CanvasUtil.getContextWebGL = function(canvas,attribs) {
	var _g = 0;
	var _g1 = ["webgl","experimental-webgl"];
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var ctx = canvas.getContext(name,attribs);
		if(ctx != null) return ctx;
	}
	return null;
};
luxe.Audio = function(_core) {
	this.core = _core;
};
luxe.Audio.__name__ = true;
luxe.Audio.prototype = {
	core: null
	,init: function() {
		null;
	}
	,destroy: function() {
		null;
	}
	,create: function(_id,_name,_streaming) {
		if(_streaming == null) _streaming = false;
		if(_name == null) _name = "";
		return this.core.app.audio.create(_id,_name,_streaming);
	}
	,uncreate: function(_name) {
		return this.core.app.audio.uncreate(_name);
	}
	,on: function(_name,_event,_handler) {
		return this.core.app.audio.on(_name,_event,_handler);
	}
	,off: function(_name,_event,_handler) {
		return this.core.app.audio.off(_name,_event,_handler);
	}
	,get: function(_name) {
		return this.core.app.audio.get(_name);
	}
	,exists: function(_name) {
		return this.get(_name) != null;
	}
	,on_complete: function(_name,handler) {
	}
	,loop: function(_name) {
		return this.core.app.audio.loop(_name);
	}
	,stop: function(_name) {
		return this.core.app.audio.stop(_name);
	}
	,play: function(_name) {
		return this.core.app.audio.play(_name);
	}
	,pause: function(_name) {
		return this.core.app.audio.pause(_name);
	}
	,toggle: function(_name) {
		return this.core.app.audio.toggle(_name);
	}
	,volume: function(_name,_volume) {
		return this.core.app.audio.volume(_name,_volume);
	}
	,pan: function(_name,_pan) {
		return this.core.app.audio.pan(_name,_pan);
	}
	,pitch: function(_name,_pitch) {
		return this.core.app.audio.pitch(_name,_pitch);
	}
	,position: function(_name,_position) {
		return this.core.app.audio.position(_name,_position);
	}
	,duration: function(_name) {
		return this.core.app.audio.duration(_name);
	}
	,process: function() {
	}
	,__class__: luxe.Audio
};
luxe.SizeMode = { __ename__ : true, __constructs__ : ["fit","cover","contain"] };
luxe.SizeMode.fit = ["fit",0];
luxe.SizeMode.fit.toString = $estr;
luxe.SizeMode.fit.__enum__ = luxe.SizeMode;
luxe.SizeMode.cover = ["cover",1];
luxe.SizeMode.cover.toString = $estr;
luxe.SizeMode.cover.__enum__ = luxe.SizeMode;
luxe.SizeMode.contain = ["contain",2];
luxe.SizeMode.contain.toString = $estr;
luxe.SizeMode.contain.__enum__ = luxe.SizeMode;
luxe.Objects = function(_name,_id) {
	if(_id == null) _id = "";
	if(_name == null) _name = "";
	this.name = "";
	this.id = "";
	luxe.Emitter.call(this);
	this.name = _name;
	if(_id == "") this.id = Luxe.utils.uniqueid(); else this.id = _id;
};
luxe.Objects.__name__ = true;
luxe.Objects.__super__ = luxe.Emitter;
luxe.Objects.prototype = $extend(luxe.Emitter.prototype,{
	id: null
	,name: null
	,__class__: luxe.Objects
});
luxe.Entity = function(_options) {
	this.active = true;
	this.fixed_rate = 0;
	this.started = false;
	this.inited = false;
	this.destroyed = false;
	luxe.Objects.call(this,"entity");
	this.name += "." + this.id;
	this.options = _options;
	this._components = new luxe.components.Components(this);
	this.children = new Array();
	this.events = new luxe.Events();
	this.transform = new phoenix.Transform();
	this.transform.listen_pos($bind(this,this.set_pos_from_transform));
	this.transform.listen_scale($bind(this,this.set_scale_from_transform));
	this.transform.listen_origin($bind(this,this.set_origin_from_transform));
	this.transform.listen_parent($bind(this,this.set_parent_from_transform));
	this.transform.listen_rotation($bind(this,this.set_rotation_from_transform));
	if(this.options != null) {
		if(this.options.name_unique == null) this.options.name_unique = false;
		if(this.options.name != null) {
			this.name = this.options.name;
			if(this.options.name_unique) this.name += "." + this.id;
		}
		if(this.options.pos != null) {
			var _op = this.options.pos;
			this.set_pos(new phoenix.Vector(_op.x,_op.y,_op.z,_op.w));
		}
		if(this.options.scale != null) {
			var _os = this.options.scale;
			this.set_scale(new phoenix.Vector(_os.x,_os.y,_os.z,_os.w));
		}
		var _should_add = true;
		if(this.options.no_scene != null) {
			if(this.options.no_scene == true) {
				_should_add = false;
				null;
			}
		}
		if(this.options.parent != null) {
			_should_add = false;
			this.set_parent(this.options.parent);
			null;
		}
		if(_should_add) {
			if(this.options.scene != null) {
				this.set_scene(this.options.scene);
				null;
			} else {
				this.set_scene(Luxe.scene);
				null;
			}
		}
	} else {
		this.set_scene(Luxe.scene);
		null;
	}
	if(this.get_scene() != null) this.get_scene().add(this); else null;
	null;
};
luxe.Entity.__name__ = true;
luxe.Entity.__super__ = luxe.Objects;
luxe.Entity.prototype = $extend(luxe.Objects.prototype,{
	events: null
	,children: null
	,destroyed: null
	,inited: null
	,started: null
	,fixed_rate: null
	,parent: null
	,scene: null
	,active: null
	,transform: null
	,_components: null
	,fixed_rate_timer: null
	,options: null
	,init: function() {
	}
	,update: function(dt) {
	}
	,onfixedupdate: function(rate) {
	}
	,onreset: function() {
	}
	,ondestroy: function() {
	}
	,onkeyup: function(event) {
	}
	,onkeydown: function(event) {
	}
	,ontextinput: function(event) {
	}
	,oninputdown: function(name,event) {
	}
	,oninputup: function(name,event) {
	}
	,onmousedown: function(event) {
	}
	,onmouseup: function(event) {
	}
	,onmousemove: function(event) {
	}
	,onmousewheel: function(event) {
	}
	,ontouchdown: function(event) {
	}
	,ontouchup: function(event) {
	}
	,ontouchmove: function(event) {
	}
	,ongamepadup: function(event) {
	}
	,ongamepaddown: function(event) {
	}
	,ongamepadaxis: function(event) {
	}
	,ongamepaddevice: function(event) {
	}
	,add: function(_component) {
		return this._components.add(_component);
	}
	,remove: function(_name) {
		return this._components.remove(_name);
	}
	,get: function(_name,_in_children) {
		if(_in_children == null) _in_children = false;
		return this._components.get(_name,_in_children);
	}
	,get_any: function(_name,_in_children,_first_only) {
		if(_first_only == null) _first_only = true;
		if(_in_children == null) _in_children = false;
		return this._components.get_any(_name,_in_children,_first_only);
	}
	,has: function(_name) {
		return this._components.has(_name);
	}
	,_init: function() {
		this.init();
		this.emit("init",null,{ fileName : "Entity.hx", lineNumber : 268, className : "luxe.Entity", methodName : "_init"});
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.init();
		}
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var _child = _g1[_g];
			++_g;
			_child._init();
		}
		this.inited = true;
	}
	,_reset: function(_) {
		this.onreset();
		this.emit("reset",null,{ fileName : "Entity.hx", lineNumber : 294, className : "luxe.Entity", methodName : "_reset"});
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.onreset();
		}
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var _child = _g1[_g];
			++_g;
			_child._reset(_);
			null;
		}
		this._start_fixed_rate_timer(this.get_fixed_rate());
		this.started = true;
	}
	,destroy: function(_from_parent) {
		if(_from_parent == null) _from_parent = false;
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var _child = _g1[_g];
			++_g;
			_child.destroy(true);
		}
		this.children = null;
		this.children = [];
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.onremoved();
			_component.ondestroy();
		}
		this.emit("destroy",null,{ fileName : "Entity.hx", lineNumber : 337, className : "luxe.Entity", methodName : "destroy"});
		this.ondestroy();
		if(this.get_parent() != null && !_from_parent) this.get_parent()._remove_child(this);
		this._stop_fixed_rate_timer();
		this.destroyed = true;
		this.inited = false;
		this.started = false;
		if(this.get_scene() != null) this.get_scene().remove(this);
		if(this.events != null) {
			this.events.destroy();
			this.events = null;
		}
	}
	,_update: function(dt) {
		if(this.destroyed) return;
		if(!this.get_active() || !this.inited || !this.started) return;
		this.transform.clean_check();
		this.update(dt);
		if(this.events != null) this.events.process();
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.update(dt);
		}
		if(this.children.length > 0) {
			var _g = 0;
			var _g1 = this.children;
			while(_g < _g1.length) {
				var _child = _g1[_g];
				++_g;
				_child._update(dt);
			}
		}
	}
	,_fixed_update: function() {
		if(this.destroyed) return;
		if(!this.get_active() || !this.inited || !this.started) return;
		this.emit("fixedupdate",null,{ fileName : "Entity.hx", lineNumber : 423, className : "luxe.Entity", methodName : "_fixed_update"});
		this.onfixedupdate(this.get_fixed_rate());
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.onfixedupdate(this.get_fixed_rate());
		}
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var _child = _g1[_g];
			++_g;
			_child._fixed_update();
		}
	}
	,_listen: function(_event,_handler,_self) {
		if(_self == null) _self = false;
		if(!_self) this.on(_event,_handler,{ fileName : "Entity.hx", lineNumber : 449, className : "luxe.Entity", methodName : "_listen"});
		if(this.get_scene() != null) switch(_event) {
		case "keyup":
			this.get_scene().on(_event,$bind(this,this._keyup),{ fileName : "Entity.hx", lineNumber : 455, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "keydown":
			this.get_scene().on(_event,$bind(this,this._keydown),{ fileName : "Entity.hx", lineNumber : 456, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "textinput":
			this.get_scene().on(_event,$bind(this,this._textinput),{ fileName : "Entity.hx", lineNumber : 457, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "mousedown":
			this.get_scene().on(_event,$bind(this,this._mousedown),{ fileName : "Entity.hx", lineNumber : 459, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "mouseup":
			this.get_scene().on(_event,$bind(this,this._mouseup),{ fileName : "Entity.hx", lineNumber : 460, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "mousemove":
			this.get_scene().on(_event,$bind(this,this._mousemove),{ fileName : "Entity.hx", lineNumber : 461, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "mousewheel":
			this.get_scene().on(_event,$bind(this,this._mousewheel),{ fileName : "Entity.hx", lineNumber : 462, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "touchdown":
			this.get_scene().on(_event,$bind(this,this._touchdown),{ fileName : "Entity.hx", lineNumber : 464, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "touchup":
			this.get_scene().on(_event,$bind(this,this._touchup),{ fileName : "Entity.hx", lineNumber : 465, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "touchmove":
			this.get_scene().on(_event,$bind(this,this._touchmove),{ fileName : "Entity.hx", lineNumber : 466, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "inputup":
			this.get_scene().on(_event,$bind(this,this._inputup),{ fileName : "Entity.hx", lineNumber : 468, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "inputdown":
			this.get_scene().on(_event,$bind(this,this._inputdown),{ fileName : "Entity.hx", lineNumber : 469, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "gamepaddown":
			this.get_scene().on(_event,$bind(this,this._gamepaddown),{ fileName : "Entity.hx", lineNumber : 471, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "gamepadup":
			this.get_scene().on(_event,$bind(this,this._gamepadup),{ fileName : "Entity.hx", lineNumber : 472, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "gamepadaxis":
			this.get_scene().on(_event,$bind(this,this._gamepadaxis),{ fileName : "Entity.hx", lineNumber : 473, className : "luxe.Entity", methodName : "_listen"});
			break;
		case "gamepaddevice":
			this.get_scene().on(_event,$bind(this,this._gamepaddevice),{ fileName : "Entity.hx", lineNumber : 474, className : "luxe.Entity", methodName : "_listen"});
			break;
		}
	}
	,_unlisten: function(_event,_handler,_self) {
		if(_self == null) _self = false;
		if(!_self) this.off(_event,_handler,{ fileName : "Entity.hx", lineNumber : 484, className : "luxe.Entity", methodName : "_unlisten"});
	}
	,_detach_scene: function() {
		if(this.get_scene() != null) {
			this.get_scene().off("reset",$bind(this,this._reset),{ fileName : "Entity.hx", lineNumber : 496, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("destroy",$bind(this,this.destroy),{ fileName : "Entity.hx", lineNumber : 497, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("keyup",$bind(this,this._keyup),{ fileName : "Entity.hx", lineNumber : 500, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("keydown",$bind(this,this._keydown),{ fileName : "Entity.hx", lineNumber : 501, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("textinput",$bind(this,this._textinput),{ fileName : "Entity.hx", lineNumber : 502, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("mousedown",$bind(this,this._mousedown),{ fileName : "Entity.hx", lineNumber : 503, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("mouseup",$bind(this,this._mouseup),{ fileName : "Entity.hx", lineNumber : 504, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("mousemove",$bind(this,this._mousemove),{ fileName : "Entity.hx", lineNumber : 505, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("mousewheel",$bind(this,this._mousewheel),{ fileName : "Entity.hx", lineNumber : 506, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("touchdown",$bind(this,this._touchdown),{ fileName : "Entity.hx", lineNumber : 507, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("touchup",$bind(this,this._touchup),{ fileName : "Entity.hx", lineNumber : 508, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("touchmove",$bind(this,this._touchmove),{ fileName : "Entity.hx", lineNumber : 509, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("inputup",$bind(this,this._inputup),{ fileName : "Entity.hx", lineNumber : 510, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("inputdown",$bind(this,this._inputdown),{ fileName : "Entity.hx", lineNumber : 511, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("gamepaddown",$bind(this,this._gamepaddown),{ fileName : "Entity.hx", lineNumber : 512, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("gamepadup",$bind(this,this._gamepadup),{ fileName : "Entity.hx", lineNumber : 513, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("gamepadaxis",$bind(this,this._gamepadaxis),{ fileName : "Entity.hx", lineNumber : 514, className : "luxe.Entity", methodName : "_detach_scene"});
			this.get_scene().off("gamepaddevice",$bind(this,this._gamepaddevice),{ fileName : "Entity.hx", lineNumber : 515, className : "luxe.Entity", methodName : "_detach_scene"});
		}
	}
	,_attach_scene: function() {
		if(this.get_scene() != null) {
			this.get_scene().on("reset",$bind(this,this._reset),{ fileName : "Entity.hx", lineNumber : 524, className : "luxe.Entity", methodName : "_attach_scene"});
			this.get_scene().on("destroy",$bind(this,this.destroy),{ fileName : "Entity.hx", lineNumber : 525, className : "luxe.Entity", methodName : "_attach_scene"});
		}
	}
	,_keyup: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.onkeyup(_event);
		this.emit("keyup",_event,{ fileName : "Entity.hx", lineNumber : 541, className : "luxe.Entity", methodName : "_keyup"});
	}
	,_keydown: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.onkeydown(_event);
		this.emit("keydown",_event,{ fileName : "Entity.hx", lineNumber : 554, className : "luxe.Entity", methodName : "_keydown"});
	}
	,_textinput: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.ontextinput(_event);
		this.emit("textinput",_event,{ fileName : "Entity.hx", lineNumber : 567, className : "luxe.Entity", methodName : "_textinput"});
	}
	,_mousedown: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.onmousedown(_event);
		this.emit("mousedown",_event,{ fileName : "Entity.hx", lineNumber : 583, className : "luxe.Entity", methodName : "_mousedown"});
	}
	,_mouseup: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.onmouseup(_event);
		this.emit("mouseup",_event,{ fileName : "Entity.hx", lineNumber : 597, className : "luxe.Entity", methodName : "_mouseup"});
	}
	,_mousewheel: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.onmousewheel(_event);
		this.emit("mousewheel",_event,{ fileName : "Entity.hx", lineNumber : 610, className : "luxe.Entity", methodName : "_mousewheel"});
	}
	,_mousemove: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.onmousemove(_event);
		this.emit("mousemove",_event,{ fileName : "Entity.hx", lineNumber : 623, className : "luxe.Entity", methodName : "_mousemove"});
	}
	,_touchdown: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.ontouchdown(_event);
		this.emit("touchdown",_event,{ fileName : "Entity.hx", lineNumber : 637, className : "luxe.Entity", methodName : "_touchdown"});
	}
	,_touchup: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.ontouchup(_event);
		this.emit("touchup",_event,{ fileName : "Entity.hx", lineNumber : 650, className : "luxe.Entity", methodName : "_touchup"});
	}
	,_touchmove: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.ontouchmove(_event);
		this.emit("touchmove",_event,{ fileName : "Entity.hx", lineNumber : 663, className : "luxe.Entity", methodName : "_touchmove"});
	}
	,_gamepadaxis: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.ongamepadaxis(_event);
		this.emit("gamepadaxis",_event,{ fileName : "Entity.hx", lineNumber : 677, className : "luxe.Entity", methodName : "_gamepadaxis"});
	}
	,_gamepaddown: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.ongamepaddown(_event);
		this.emit("gamepaddown",_event,{ fileName : "Entity.hx", lineNumber : 690, className : "luxe.Entity", methodName : "_gamepaddown"});
	}
	,_gamepadup: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.ongamepadup(_event);
		this.emit("gamepadup",_event,{ fileName : "Entity.hx", lineNumber : 703, className : "luxe.Entity", methodName : "_gamepadup"});
	}
	,_gamepaddevice: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.ongamepaddevice(_event);
		this.emit("gamepaddevice",_event,{ fileName : "Entity.hx", lineNumber : 716, className : "luxe.Entity", methodName : "_gamepaddevice"});
	}
	,_inputdown: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.oninputdown(_event.name,_event.event);
		this.emit("inputdown",_event,{ fileName : "Entity.hx", lineNumber : 731, className : "luxe.Entity", methodName : "_inputdown"});
	}
	,_inputup: function(_event) {
		if(!this.get_active() || !this.inited || !this.started) return;
		this.oninputup(_event.name,_event.event);
		this.emit("inputup",_event,{ fileName : "Entity.hx", lineNumber : 744, className : "luxe.Entity", methodName : "_inputup"});
	}
	,get_fixed_rate: function() {
		return this.fixed_rate;
	}
	,set_fixed_rate: function(_rate) {
		this.fixed_rate = _rate;
		this._stop_fixed_rate_timer();
		this._start_fixed_rate_timer(_rate);
		return this.get_fixed_rate();
	}
	,_stop_fixed_rate_timer: function() {
		if(this.fixed_rate_timer != null) {
			this.fixed_rate_timer.stop();
			this.fixed_rate_timer = null;
		}
	}
	,_start_fixed_rate_timer: function(_rate) {
		if(_rate != 0 && this.get_parent() == null && !this.destroyed) {
			this.fixed_rate_timer = new snow.utils.Timer(_rate);
			this.fixed_rate_timer.run = $bind(this,this._fixed_update);
		}
	}
	,get_components: function() {
		return this._components.components;
	}
	,_add_child: function(child) {
		this.children.push(child);
		if(child.get_scene() != null) {
			var removed = child.get_scene().remove(child);
		} else null;
	}
	,_remove_child: function(child) {
		HxOverrides.remove(this.children,child);
	}
	,set_pos_from_transform: function(_pos) {
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.entity_pos_change(_pos);
		}
	}
	,set_rotation_from_transform: function(_rotation) {
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.entity_rotation_change(_rotation);
		}
	}
	,set_scale_from_transform: function(_scale) {
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.entity_scale_change(_scale);
		}
	}
	,set_origin_from_transform: function(_origin) {
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.entity_origin_change(_origin);
		}
	}
	,set_parent_from_transform: function(_parent) {
		var $it0 = (function($this) {
			var $r;
			var this1 = $this.get_components();
			$r = this1.iterator();
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var _component = $it0.next();
			_component.entity_parent_change(_parent);
		}
	}
	,set_pos: function(_p) {
		return this.transform.local.set_pos(_p);
	}
	,get_pos: function() {
		return this.transform.local.pos;
	}
	,set_rotation: function(_r) {
		return this.transform.local.set_rotation(_r);
	}
	,get_rotation: function() {
		return this.transform.local.rotation;
	}
	,set_scale: function(_s) {
		return this.transform.local.set_scale(_s);
	}
	,get_scale: function() {
		return this.transform.local.scale;
	}
	,set_origin: function(_origin) {
		return this.transform.set_origin(_origin);
	}
	,get_origin: function() {
		return this.transform.origin;
	}
	,set_parent: function(other) {
		if(this.get_parent() != null) this.get_parent()._remove_child(this);
		this.parent = other;
		if(this.get_parent() != null) {
			this.get_parent()._add_child(this);
			this.transform.set_parent(this.get_parent().transform);
		} else this.transform.set_parent(null);
		return this.get_parent();
	}
	,get_parent: function() {
		return this.parent;
	}
	,set_scene: function(_scene) {
		this._detach_scene();
		this.scene = _scene;
		this._attach_scene();
		return this.get_scene();
	}
	,get_scene: function() {
		return this.scene;
	}
	,set_active: function(_active) {
		return this.active = _active;
	}
	,get_active: function() {
		return this.active;
	}
	,__class__: luxe.Entity
	,__properties__: {set_origin:"set_origin",get_origin:"get_origin",set_scale:"set_scale",get_scale:"get_scale",set_rotation:"set_rotation",get_rotation:"get_rotation",set_pos:"set_pos",get_pos:"get_pos",set_active:"set_active",get_active:"get_active",set_scene:"set_scene",get_scene:"get_scene",set_parent:"set_parent",get_parent:"get_parent",set_fixed_rate:"set_fixed_rate",get_fixed_rate:"get_fixed_rate",get_components:"get_components"}
});
luxe.Camera = function(options) {
	this.minimum_shake = 0.1;
	this.shaking = false;
	this._size_factor = new phoenix.Vector();
	this._rotation_radian = new phoenix.Vector();
	this._rotation_cache = new phoenix.Quaternion();
	this.set_size_mode(luxe.SizeMode.fit);
	var _name = "untitled camera";
	if(options != null) {
		if(options.name != null) _name = options.name;
	} else options = { no_scene : false};
	luxe.Entity.call(this,{ name : _name, no_scene : options.no_scene});
	if(options.view == null) this.view = new phoenix.Camera(options); else this.view = options.view;
	this._final_pos = this.view.get_pos();
};
luxe.Camera.__name__ = true;
luxe.Camera.__super__ = luxe.Entity;
luxe.Camera.prototype = $extend(luxe.Entity.prototype,{
	size: null
	,size_mode: null
	,view: null
	,bounds: null
	,shake_vector: null
	,shake_amount: null
	,shaking: null
	,minimum_shake: null
	,update_view_pos: null
	,_size_factor: null
	,_final_pos: null
	,_rotation_radian: null
	,_rotation_cache: null
	,get_viewport: function() {
		return this.view.get_viewport();
	}
	,set_viewport: function(_v) {
		return this.view.set_viewport(_v);
	}
	,get_center: function() {
		return this.view.get_center();
	}
	,set_center: function(_c) {
		this.set_pos(new phoenix.Vector(_c.x - this.get_viewport().w / 2,_c.y - this.get_viewport().h / 2));
		return this.view.set_center(_c);
	}
	,get_minimum_zoom: function() {
		return this.view.minimum_zoom;
	}
	,set_minimum_zoom: function(_m) {
		return this.view.minimum_zoom = _m;
	}
	,get_zoom: function() {
		return this.view.zoom;
	}
	,set_zoom: function(_z) {
		this.view.set_zoom(_z);
		if(this.get_size() != null) {
			var _g = this.view.get_scale();
			_g.set_x(_g.x * (1 / this._size_factor.x));
			var _g1 = this.view.get_scale();
			_g1.set_y(_g1.y * (1 / this._size_factor.y));
		}
		return this.view.zoom;
	}
	,get_size: function() {
		return this.size;
	}
	,get_size_mode: function() {
		return this.size_mode;
	}
	,set_size_mode: function(_m) {
		if(this.get_size_mode() != null) {
			this.size_mode = _m;
			if(this.get_size() != null) this.set_size(this.get_size());
		}
		return this.size_mode = _m;
	}
	,set_size: function(_size) {
		if(_size == null) {
			this.set_center(new phoenix.Vector(this.get_viewport().w / 2,this.get_viewport().h / 2));
			this.size = _size;
			this._size_factor.set_x(this._size_factor.set_y(1));
			this.set_zoom(this.get_zoom());
			return this.get_size();
		}
		var _ratio_x = this.get_viewport().w / _size.x;
		var _ratio_y = this.get_viewport().h / _size.y;
		var _shortest = Math.max(_ratio_x,_ratio_y);
		var _longest = Math.min(_ratio_x,_ratio_y);
		var _g = this.get_size_mode();
		switch(_g[1]) {
		case 0:
			_ratio_x = _ratio_y = _longest;
			break;
		case 1:
			_ratio_x = _ratio_y = _shortest;
			break;
		case 2:
			break;
		}
		this._size_factor.set_x(_ratio_x);
		this._size_factor.set_y(_ratio_y);
		this.view.get_scale().set_x(1 / (this._size_factor.x * this.get_zoom()));
		this.view.get_scale().set_y(1 / (this._size_factor.y * this.get_zoom()));
		this.set_center(new phoenix.Vector(_size.x / 2,_size.y / 2));
		return this.size = new phoenix.Vector(_size.x,_size.y,_size.z,_size.w);
	}
	,focus: function(_p,_t,oncomplete) {
		if(_t == null) _t = 0.6;
		var _g = this;
		luxe.tween.Actuate.tween(this.view.get_center(),_t,{ x : _p.x, y : _p.y},true).onComplete(oncomplete).ease(luxe.tween.easing.Quad.get_easeInOut()).onUpdate(function() {
			_g.transform.local.pos.set_xy(_g.view.get_pos().x,_g.view.get_pos().y);
		});
	}
	,screen_point_to_world: function(_vector) {
		return this.view.screen_point_to_world(_vector);
	}
	,world_point_to_screen: function(_vector,_viewport) {
		return this.view.world_point_to_screen(_vector,_viewport);
	}
	,set_pos_from_transform: function(_pos) {
		if(this.bounds != null) {
			if(_pos.x < this.bounds.x) _pos.set_x(this.bounds.x);
			if(_pos.y < this.bounds.y) _pos.set_y(this.bounds.y);
			if(_pos.x > this.bounds.w - this.view.get_viewport().w) _pos.set_x(this.bounds.w - this.view.get_viewport().w);
			if(_pos.y > this.bounds.h - this.view.get_viewport().h) _pos.set_y(this.bounds.h - this.view.get_viewport().h);
		}
		luxe.Entity.prototype.set_pos_from_transform.call(this,_pos);
		this.update_view_pos = _pos;
	}
	,set_rotation_from_transform: function(_rotation) {
		luxe.Entity.prototype.set_rotation_from_transform.call(this,_rotation);
		if(this.view != null) this.view.set_rotation(_rotation);
	}
	,set_scale_from_transform: function(_scale) {
		luxe.Entity.prototype.set_scale_from_transform.call(this,_scale);
		if(this.view != null) this.view.set_scale(_scale);
	}
	,shake: function(amount) {
		this.shake_amount = amount;
		this.shaking = true;
	}
	,update: function(dt) {
		if(this.shaking) {
			this._final_pos.set_xyz(this.transform.local.pos.x,this.transform.local.pos.y,this.transform.local.pos.z);
			this.shake_vector = Luxe.utils.geometry.random_point_in_unit_circle();
			var _g = this.shake_vector;
			_g.set_x(_g.x * this.shake_amount);
			var _g1 = this.shake_vector;
			_g1.set_y(_g1.y * this.shake_amount);
			var _g2 = this.shake_vector;
			_g2.set_z(_g2.z * this.shake_amount);
			this.shake_amount *= 0.9;
			if(this.shake_amount <= this.minimum_shake) {
				this.shake_amount = 0;
				this.shaking = false;
			}
			this._final_pos.set_xyz(this._final_pos.x + this.shake_vector.x,this._final_pos.y + this.shake_vector.y,this._final_pos.z + this.shake_vector.z);
			this.update_view_pos = this._final_pos;
		}
		if(this.update_view_pos != null && this.view != null) {
			this.view.set_pos(this.update_view_pos.clone());
			this.update_view_pos = null;
		}
	}
	,init: function() {
	}
	,ondestroy: function() {
		luxe.Entity.prototype.ondestroy.call(this);
	}
	,__class__: luxe.Camera
	,__properties__: $extend(luxe.Entity.prototype.__properties__,{set_size_mode:"set_size_mode",get_size_mode:"get_size_mode",set_size:"set_size",get_size:"get_size",set_minimum_zoom:"set_minimum_zoom",get_minimum_zoom:"get_minimum_zoom",set_zoom:"set_zoom",get_zoom:"get_zoom",set_center:"set_center",get_center:"get_center",set_viewport:"set_viewport",get_viewport:"get_viewport"})
});
luxe.ID = function(_name,_id) {
	if(_id == null) _id = "";
	if(_name == null) _name = "";
	this.name = "";
	this.name = _name;
	if(_id == "") this.id = Luxe.utils.uniqueid(); else this.id = _id;
};
luxe.ID.__name__ = true;
luxe.ID.prototype = {
	id: null
	,name: null
	,__class__: luxe.ID
};
luxe.Component = function(_options) {
	var _name = "";
	if(_options != null) {
		if(_options.name != null) _name = _options.name;
	}
	luxe.ID.call(this,_name == ""?Luxe.utils.uniqueid():_name);
};
luxe.Component.__name__ = true;
luxe.Component.__super__ = luxe.ID;
luxe.Component.prototype = $extend(luxe.ID.prototype,{
	entity: null
	,transform: null
	,init: function() {
	}
	,update: function(dt) {
	}
	,onadded: function() {
	}
	,onremoved: function() {
	}
	,onfixedupdate: function(rate) {
	}
	,onreset: function() {
	}
	,ondestroy: function() {
	}
	,onkeyup: function(event) {
	}
	,onkeydown: function(event) {
	}
	,ontextinput: function(event) {
	}
	,oninputdown: function(event) {
	}
	,oninputup: function(event) {
	}
	,onmousedown: function(event) {
	}
	,onmouseup: function(event) {
	}
	,onmousemove: function(event) {
	}
	,onmousewheel: function(event) {
	}
	,ontouchdown: function(event) {
	}
	,ontouchup: function(event) {
	}
	,ontouchmove: function(event) {
	}
	,ongamepadup: function(event) {
	}
	,ongamepaddown: function(event) {
	}
	,ongamepadaxis: function(event) {
	}
	,ongamepaddevice: function(event) {
	}
	,add: function(component) {
		return this.get_entity().add(component);
	}
	,remove: function(_name) {
		return this.get_entity().remove(_name);
	}
	,get: function(_name,in_children) {
		if(in_children == null) in_children = false;
		return this.get_entity().get(_name,in_children);
	}
	,get_any: function(_name,in_children,first_only) {
		if(first_only == null) first_only = true;
		if(in_children == null) in_children = false;
		return this.get_entity().get_any(_name,in_children,first_only);
	}
	,has: function(_name) {
		return this.get_entity().has(_name);
	}
	,_detach_entity: function() {
		if(this.get_entity() != null) {
		}
	}
	,_attach_entity: function() {
		if(this.get_entity() != null) {
		}
	}
	,set_entity: function(_entity) {
		this._detach_entity();
		this.entity = _entity;
		this._attach_entity();
		return this.get_entity();
	}
	,get_entity: function() {
		return this.entity;
	}
	,set_pos: function(_p) {
		return this.get_entity().transform.local.set_pos(_p);
	}
	,get_pos: function() {
		return this.get_entity().transform.local.pos;
	}
	,set_rotation: function(_r) {
		return this.get_entity().transform.local.set_rotation(_r);
	}
	,get_rotation: function() {
		return this.get_entity().transform.local.rotation;
	}
	,set_scale: function(_s) {
		return this.get_entity().transform.local.set_scale(_s);
	}
	,get_scale: function() {
		return this.get_entity().transform.local.scale;
	}
	,set_origin: function(_o) {
		return this.get_entity().transform.set_origin(_o);
	}
	,get_origin: function() {
		return this.get_entity().transform.origin;
	}
	,set_transform: function(_o) {
		return this.get_entity().transform = _o;
	}
	,get_transform: function() {
		return this.get_entity().transform;
	}
	,entity_pos_change: function(_pos) {
	}
	,entity_scale_change: function(_scale) {
	}
	,entity_rotation_change: function(_rotation) {
	}
	,entity_origin_change: function(_origin) {
	}
	,entity_parent_change: function(_parent) {
	}
	,__class__: luxe.Component
	,__properties__: {set_origin:"set_origin",get_origin:"get_origin",set_scale:"set_scale",get_scale:"get_scale",set_rotation:"set_rotation",get_rotation:"get_rotation",set_pos:"set_pos",get_pos:"get_pos",set_entity:"set_entity",get_entity:"get_entity"}
});
var snow = {};
snow.App = function() {
	this.next_render = 0;
	this.next_tick = 0;
	this.alpha = 1.0;
	this.cur_frame_start = 0.0;
	this.current_time = 0;
	this.last_frame_start = 0.0;
	this.delta_sim = 0.016666666666666666;
	this.delta_time = 0.016666666666666666;
	this.max_frame_time = 0.25;
	this.update_rate = 0;
	this.render_rate = 0.016666666666666666;
	this.fixed_delta = 0;
	this.timescale = 1;
};
snow.App.__name__ = true;
snow.App.prototype = {
	app: null
	,timescale: null
	,fixed_delta: null
	,render_rate: null
	,update_rate: null
	,max_frame_time: null
	,delta_time: null
	,delta_sim: null
	,last_frame_start: null
	,current_time: null
	,cur_frame_start: null
	,alpha: null
	,next_tick: null
	,next_render: null
	,config: function(config) {
		return config;
	}
	,ready: function() {
	}
	,update: function(dt) {
	}
	,ondestroy: function() {
	}
	,onevent: function(event) {
	}
	,onkeydown: function(keycode,scancode,repeat,mod,timestamp,window_id) {
	}
	,onkeyup: function(keycode,scancode,repeat,mod,timestamp,window_id) {
	}
	,ontextinput: function(text,start,length,type,timestamp,window_id) {
	}
	,onmousedown: function(x,y,button,timestamp,window_id) {
	}
	,onmouseup: function(x,y,button,timestamp,window_id) {
	}
	,onmousewheel: function(x,y,timestamp,window_id) {
	}
	,onmousemove: function(x,y,xrel,yrel,timestamp,window_id) {
	}
	,ontouchdown: function(x,y,touch_id,timestamp) {
	}
	,ontouchup: function(x,y,touch_id,timestamp) {
	}
	,ontouchmove: function(x,y,dx,dy,touch_id,timestamp) {
	}
	,ongamepadaxis: function(gamepad,axis,value,timestamp) {
	}
	,ongamepaddown: function(gamepad,button,value,timestamp) {
	}
	,ongamepadup: function(gamepad,button,value,timestamp) {
	}
	,ongamepaddevice: function(gamepad,type,timestamp) {
	}
	,on_internal_init: function() {
		this.cur_frame_start = snow.Snow.core.timestamp();
		this.last_frame_start = this.cur_frame_start;
		this.current_time = 0;
		this.delta_time = 0.016;
	}
	,on_internal_update: function() {
		if(this.update_rate != 0) {
			if(this.next_tick < snow.Snow.core.timestamp()) this.next_tick = snow.Snow.core.timestamp() + this.update_rate; else return;
		}
		this.cur_frame_start = snow.Snow.core.timestamp();
		this.delta_time = this.cur_frame_start - this.last_frame_start;
		this.last_frame_start = this.cur_frame_start;
		var used_delta;
		if(this.fixed_delta == 0) used_delta = this.delta_time; else used_delta = this.fixed_delta;
		used_delta *= this.timescale;
		this.delta_sim = used_delta;
		this.current_time += used_delta;
		this.app.do_internal_update(used_delta);
		if(this.render_rate != 0) {
			if(this.next_render < snow.Snow.core.timestamp()) {
				this.app.render();
				this.next_render += this.render_rate;
			}
		}
	}
	,__class__: snow.App
};
luxe.Core = function(_game) {
	this.has_inited = false;
	this.has_shutdown = false;
	this.shutting_down = false;
	this.headless = false;
	this.console_visible = false;
	snow.App.call(this);
	this.game = _game;
	this.game.app = this;
	this.emitter = new luxe.Emitter();
	this._mouse_pos = new phoenix.Vector();
	this._touch_pos = new phoenix.Vector();
	Luxe.mouse = this._mouse_pos;
	Luxe.core = this;
	Luxe.utils = new luxe.utils.Utils(this);
};
luxe.Core.__name__ = true;
luxe.Core.__super__ = snow.App;
luxe.Core.prototype = $extend(snow.App.prototype,{
	game: null
	,console_visible: null
	,headless: null
	,emitter: null
	,debug: null
	,draw: null
	,timer: null
	,events: null
	,input: null
	,audio: null
	,scene: null
	,renderer: null
	,screen: null
	,physics: null
	,_mouse_pos: null
	,_touch_pos: null
	,shutting_down: null
	,has_shutdown: null
	,has_inited: null
	,ready: function() {
		Luxe.version = haxe.Resource.getString("version");
		Luxe.build = Luxe.version + haxe.Resource.getString("build");
		haxe.Log.trace("     i / luxe / " + ("version " + Luxe.build),{ fileName : "Core.hx", lineNumber : 140, className : "luxe.Core", methodName : "ready"});
		this.init();
		this.game.ready();
		this.emitter.emit("init",null,{ fileName : "Core.hx", lineNumber : 154, className : "luxe.Core", methodName : "ready"});
		this.has_inited = true;
		this.physics.reset();
		if(!this.app.snow_config.has_loop) this.shutdown();
	}
	,ondestroy: function() {
		this.shutting_down = true;
		haxe.Log.trace("     i / luxe / " + "shutting down...",{ fileName : "Core.hx", lineNumber : 172, className : "luxe.Core", methodName : "ondestroy"});
		this.game.ondestroy();
		this.emitter.emit("destroy",null,{ fileName : "Core.hx", lineNumber : 178, className : "luxe.Core", methodName : "ondestroy"});
		if(this.renderer != null) this.renderer.destroy();
		this.physics.destroy();
		this.input.destroy();
		this.audio.destroy();
		this.timer.destroy();
		this.events.destroy();
		this.debug.destroy();
		this.emitter = null;
		this.input = null;
		this.audio = null;
		this.events = null;
		this.timer = null;
		this.debug = null;
		Luxe.utils = null;
		this.has_shutdown = true;
		haxe.Log.trace("     i / luxe / " + "goodbye.",{ fileName : "Core.hx", lineNumber : 204, className : "luxe.Core", methodName : "ondestroy"});
	}
	,init: function() {
		this.debug = new luxe.Debug(this);
		Luxe.debug = this.debug;
		this.draw = new luxe.Draw(this);
		this.timer = new luxe.Timer(this);
		this.events = new luxe.Events();
		this.audio = new luxe.Audio(this);
		this.input = new luxe.Input(this);
		this.physics = new luxe.Physics(this);
		if(this.app.window == null) this.headless = true;
		if(!this.headless) {
			this.renderer = new phoenix.Renderer(this);
			Luxe.renderer = this.renderer;
		}
		var _window_w = 0;
		var _window_h = 0;
		if(this.app.window != null) {
			_window_w = this.app.window.width;
			_window_h = this.app.window.height;
		}
		this.screen = new luxe.Screen(this,0,0,_window_w,_window_h);
		this.debug.init();
		this.timer.init();
		this.audio.init();
		this.input.init();
		if(!this.headless) this.renderer.init();
		this.physics.init();
		Luxe.audio = this.audio;
		Luxe.draw = this.draw;
		Luxe.events = this.events;
		Luxe.timer = this.timer;
		Luxe.input = this.input;
		if(!this.headless) {
			Luxe.camera = new luxe.Camera({ name : "default camera", view : this.renderer.camera});
			Luxe.resources = this.renderer.resource_manager;
		}
		Luxe.physics = this.physics;
		this.scene = new luxe.Scene("default scene");
		Luxe.scene = this.scene;
		if(!this.headless) {
			this.scene.add(Luxe.camera);
			this.debug.create_debug_console();
		}
		if(this.app.window != null && !this.headless) {
			this.app.window.onrender = $bind(this,this.render);
			this.debug.start(luxe.Core.core_tag_update);
			this.debug.start(luxe.Core.core_tag_renderdt);
		}
	}
	,shutdown: function() {
		this.shutting_down = true;
		this.app.shutdown();
	}
	,on: function(event,handler) {
		this.emitter.on(event,handler,{ fileName : "Core.hx", lineNumber : 310, className : "luxe.Core", methodName : "on"});
	}
	,off: function(event,handler) {
		return this.emitter.off(event,handler,{ fileName : "Core.hx", lineNumber : 314, className : "luxe.Core", methodName : "off"});
	}
	,emit: function(event,data) {
		return this.emitter.emit(event,data,{ fileName : "Core.hx", lineNumber : 318, className : "luxe.Core", methodName : "emit"});
	}
	,onevent: function(event) {
		this.game.onevent(event);
	}
	,update: function(dt) {
		if(this.has_shutdown) return;
		this.debug.end(luxe.Core.core_tag_update);
		this.debug.start(luxe.Core.core_tag_update);
		this.timer.process();
		this.input.process();
		this.audio.process();
		this.events.process();
		this.physics.process();
		this.process_loading_thread();
		this.debug.start(luxe.Core.core_tag_updates);
		this.emitter.emit("update",dt,{ fileName : "Core.hx", lineNumber : 368, className : "luxe.Core", methodName : "update"});
		this.debug.end(luxe.Core.core_tag_updates);
		this.debug.start(luxe.Core.game_tag_update);
		this.game.update(dt);
		this.debug.end(luxe.Core.game_tag_update);
		this.debug.process();
	}
	,render: function(window) {
		if(this.shutting_down) return;
		this.debug.end(luxe.Core.core_tag_renderdt);
		this.debug.start(luxe.Core.core_tag_renderdt);
		if(!this.headless) {
			this.debug.start(luxe.Core.core_tag_render);
			this.emitter.emit("prerender",null,{ fileName : "Core.hx", lineNumber : 396, className : "luxe.Core", methodName : "render"});
			this.game.onprerender();
			this.emitter.emit("render",null,{ fileName : "Core.hx", lineNumber : 399, className : "luxe.Core", methodName : "render"});
			this.game.onrender();
			this.renderer.process();
			this.emitter.emit("postrender",null,{ fileName : "Core.hx", lineNumber : 403, className : "luxe.Core", methodName : "render"});
			this.game.onpostrender();
			this.debug.end(luxe.Core.core_tag_render);
		}
	}
	,show_console: function(_show) {
		if(_show == null) _show = true;
		this.console_visible = _show;
		this.debug.show_console(this.console_visible);
	}
	,onkeydown: function(keycode,scancode,repeat,mod,timestamp,window_id) {
		var event = { scancode : scancode, keycode : keycode, state : luxe.InteractState.down, mod : mod, repeat : repeat, timestamp : timestamp, window_id : window_id};
		if(!this.shutting_down) {
			this.input.check_named_keys(event,true);
			this.emitter.emit("keydown",event,{ fileName : "Core.hx", lineNumber : 452, className : "luxe.Core", methodName : "onkeydown"});
			this.game.onkeydown(event);
			if(scancode == snow.input.Scancodes.grave) this.show_console(!this.console_visible);
		}
	}
	,onkeyup: function(keycode,scancode,repeat,mod,timestamp,window_id) {
		var event = { scancode : scancode, keycode : keycode, state : luxe.InteractState.up, mod : mod, repeat : repeat, timestamp : timestamp, window_id : window_id};
		if(!this.shutting_down) {
			this.input.check_named_keys(event);
			this.emitter.emit("keyup",event,{ fileName : "Core.hx", lineNumber : 480, className : "luxe.Core", methodName : "onkeyup"});
			this.game.onkeyup(event);
		}
	}
	,ontextinput: function(text,start,length,type,timestamp,window_id) {
		var _type = luxe.TextEventType.unknown;
		switch(type) {
		case 1:
			_type = luxe.TextEventType.edit;
			break;
		case 2:
			_type = luxe.TextEventType.input;
			break;
		default:
			return;
		}
		var event = { text : text, start : start, length : length, type : _type, timestamp : timestamp, window_id : window_id};
		if(!this.shutting_down) {
			this.emitter.emit("textinput",event,{ fileName : "Core.hx", lineNumber : 511, className : "luxe.Core", methodName : "ontextinput"});
			this.game.ontextinput(event);
		}
	}
	,oninputdown: function(name,event) {
		if(!this.shutting_down) {
			this.emitter.emit("inputdown",{ name : name, event : event},{ fileName : "Core.hx", lineNumber : 525, className : "luxe.Core", methodName : "oninputdown"});
			this.game.oninputdown(name,event);
		}
	}
	,oninputup: function(name,event) {
		if(!this.shutting_down) {
			this.emitter.emit("inputup",{ name : name, event : event},{ fileName : "Core.hx", lineNumber : 537, className : "luxe.Core", methodName : "oninputup"});
			this.game.oninputup(name,event);
		}
	}
	,mouse_button_from_number: function(button) {
		switch(button) {
		case 1:
			return luxe.MouseButton.left;
		case 2:
			return luxe.MouseButton.middle;
		case 3:
			return luxe.MouseButton.right;
		case 4:
			return luxe.MouseButton.extra1;
		case 5:
			return luxe.MouseButton.extra2;
		default:
			return luxe.MouseButton.none;
		}
		return luxe.MouseButton.none;
	}
	,onmousedown: function(x,y,button,timestamp,window_id) {
		this._mouse_pos = new phoenix.Vector(x,y);
		Luxe.mouse = this._mouse_pos;
		var event = { timestamp : timestamp, window_id : window_id, state : luxe.InteractState.down, button : this.mouse_button_from_number(button), x : x, y : y, xrel : x, yrel : y, pos : this._mouse_pos};
		if(!this.shutting_down) {
			this.input.check_named_mouse(event,true);
			this.emitter.emit("mousedown",event,{ fileName : "Core.hx", lineNumber : 584, className : "luxe.Core", methodName : "onmousedown"});
			this.game.onmousedown(event);
		}
	}
	,onmouseup: function(x,y,button,timestamp,window_id) {
		this._mouse_pos = new phoenix.Vector(x,y);
		Luxe.mouse = this._mouse_pos;
		var event = { timestamp : timestamp, window_id : window_id, state : luxe.InteractState.up, button : this.mouse_button_from_number(button), x : x, y : y, xrel : x, yrel : y, pos : this._mouse_pos};
		if(!this.shutting_down) {
			this.input.check_named_mouse(event);
			this.emitter.emit("mouseup",event,{ fileName : "Core.hx", lineNumber : 611, className : "luxe.Core", methodName : "onmouseup"});
			this.game.onmouseup(event);
		}
	}
	,onmousemove: function(x,y,xrel,yrel,timestamp,window_id) {
		this._mouse_pos = new phoenix.Vector(x,y);
		Luxe.mouse = this._mouse_pos;
		var event = { timestamp : timestamp, window_id : window_id, state : luxe.InteractState.move, button : luxe.MouseButton.none, x : x, y : y, xrel : xrel, yrel : yrel, pos : this._mouse_pos};
		if(!this.shutting_down) {
			this.emitter.emit("mousemove",event,{ fileName : "Core.hx", lineNumber : 637, className : "luxe.Core", methodName : "onmousemove"});
			this.game.onmousemove(event);
		}
	}
	,onmousewheel: function(x,y,timestamp,window_id) {
		var event = { timestamp : timestamp, window_id : window_id, state : luxe.InteractState.wheel, button : luxe.MouseButton.none, x : x, y : y, xrel : x, yrel : y, pos : this._mouse_pos};
		if(!this.shutting_down) {
			this.input.check_named_mouse(event,false);
			this.emitter.emit("mousewheel",event,{ fileName : "Core.hx", lineNumber : 661, className : "luxe.Core", methodName : "onmousewheel"});
			this.game.onmousewheel(event);
		}
	}
	,ontouchdown: function(x,y,touch_id,timestamp) {
		this._touch_pos = new phoenix.Vector(x,y);
		var event = { state : luxe.InteractState.down, timestamp : timestamp, touch_id : touch_id, x : x, y : y, dx : x, dy : y, pos : this._touch_pos};
		if(!this.shutting_down) {
			this.emitter.emit("touchdown",event,{ fileName : "Core.hx", lineNumber : 687, className : "luxe.Core", methodName : "ontouchdown"});
			this.game.ontouchdown(event);
			if(touch_id == 2) {
				if(this.console_visible) this.debug.switch_view();
			}
			if(touch_id == 3) this.show_console(!this.console_visible);
		}
	}
	,ontouchup: function(x,y,touch_id,timestamp) {
		this._touch_pos = new phoenix.Vector(x,y);
		var event = { state : luxe.InteractState.up, timestamp : timestamp, touch_id : touch_id, x : x, y : y, dx : x, dy : y, pos : this._touch_pos};
		if(!this.shutting_down) {
			this.emitter.emit("touchup",event,{ fileName : "Core.hx", lineNumber : 724, className : "luxe.Core", methodName : "ontouchup"});
			this.game.ontouchup(event);
		}
	}
	,ontouchmove: function(x,y,dx,dy,touch_id,timestamp) {
		this._touch_pos = new phoenix.Vector(x,y);
		var event = { state : luxe.InteractState.move, timestamp : timestamp, touch_id : touch_id, x : x, y : y, dx : dx, dy : dy, pos : this._touch_pos};
		if(!this.shutting_down) {
			this.emitter.emit("touchmove",event,{ fileName : "Core.hx", lineNumber : 748, className : "luxe.Core", methodName : "ontouchmove"});
			this.game.ontouchmove(event);
		}
	}
	,ongamepadaxis: function(gamepad,axis,value,timestamp) {
		var event = { timestamp : timestamp, type : luxe.GamepadEventType.axis, state : luxe.InteractState.axis, gamepad : gamepad, button : -1, axis : axis, value : value};
		if(!this.shutting_down) {
			this.emitter.emit("gamepadaxis",event,{ fileName : "Core.hx", lineNumber : 771, className : "luxe.Core", methodName : "ongamepadaxis"});
			this.game.ongamepadaxis(event);
		}
	}
	,ongamepaddown: function(gamepad,button,value,timestamp) {
		var event = { timestamp : timestamp, type : luxe.GamepadEventType.button, state : luxe.InteractState.down, gamepad : gamepad, button : button, axis : -1, value : value};
		if(!this.shutting_down) {
			this.emitter.emit("gamepaddown",event,{ fileName : "Core.hx", lineNumber : 792, className : "luxe.Core", methodName : "ongamepaddown"});
			this.game.ongamepaddown(event);
		}
	}
	,ongamepadup: function(gamepad,button,value,timestamp) {
		var event = { timestamp : timestamp, type : luxe.GamepadEventType.button, state : luxe.InteractState.up, gamepad : gamepad, button : button, axis : -1, value : value};
		if(!this.shutting_down) {
			this.emitter.emit("gamepadup",event,{ fileName : "Core.hx", lineNumber : 813, className : "luxe.Core", methodName : "ongamepadup"});
			this.game.ongamepadup(event);
		}
	}
	,ongamepaddevice: function(gamepad,type,timestamp) {
		var _event_type = luxe.GamepadEventType.unknown;
		switch(type) {
		case 1:
			_event_type = luxe.GamepadEventType.device_added;
			break;
		case 2:
			_event_type = luxe.GamepadEventType.device_removed;
			break;
		case 3:
			_event_type = luxe.GamepadEventType.device_remapped;
			break;
		default:
		}
		var event = { timestamp : timestamp, type : _event_type, state : luxe.InteractState.none, gamepad : gamepad, button : -1, axis : -1, value : 0};
		if(!this.shutting_down) this.game.ongamepaddevice(event);
	}
	,config: function(config) {
		config.window.title = "luxe app";
		return this.game.config(config);
	}
	,process_loading_thread: function() {
	}
	,__class__: luxe.Core
});
luxe.Debug = function(_core) {
	this.last_cursor_grab = false;
	this.last_cursor_shown = true;
	this.profiling = false;
	this.profile_path = "profile.txt";
	this.started = false;
	this.last_view_index = 0;
	this.current_view_index = 0;
	this.dt_average_count = 0;
	this.dt_average_span = 60;
	this.dt_average_accum = 0;
	this.dt_average = 0;
	this.visible = false;
	this.core = _core;
};
luxe.Debug.__name__ = true;
luxe.Debug.internal_trace = function(v,inf) {
	var _line = StringTools.rpad(inf.lineNumber == null?"null":"" + inf.lineNumber," ",4);
	console.log("" + inf.fileName + "::" + _line + " " + Std.string(v));
	if(luxe.Debug.shut_down) return;
	var $it0 = luxe.Debug.trace_callbacks.iterator();
	while( $it0.hasNext() ) {
		var _callback = $it0.next();
		_callback(v,inf);
	}
};
luxe.Debug.prototype = {
	core: null
	,visible: null
	,debug_inspector: null
	,overlay: null
	,batcher: null
	,view: null
	,debug_font: null
	,dt_average: null
	,dt_average_accum: null
	,dt_average_span: null
	,dt_average_count: null
	,current_view_index: null
	,last_view_index: null
	,current_view: null
	,padding: null
	,started: null
	,profile_path: null
	,profiling: null
	,init: function() {
		luxe.Debug.trace_callbacks = new haxe.ds.StringMap();
		luxe.Debug.views = [new luxe.debug.TraceDebugView(),new luxe.debug.StatsDebugView(),new luxe.debug.ProfilerDebugView()];
		this.current_view = luxe.Debug.views[0];
		haxe.Log.trace = luxe.Debug.internal_trace;
		null;
	}
	,start: function(_name) {
		luxe.debug.ProfilerDebugView.start(_name);
	}
	,end: function(_name) {
		luxe.debug.ProfilerDebugView.end(_name);
	}
	,remove_trace_listener: function(_name) {
		luxe.Debug.trace_callbacks.remove(_name);
	}
	,add_trace_listener: function(_name,_callback) {
		luxe.Debug.trace_callbacks.set(_name,_callback);
	}
	,create_debug_console: function() {
		this.core.on("keyup",$bind(this,this.keyup));
		this.core.on("keydown",$bind(this,this.keydown));
		this.core.on("mouseup",$bind(this,this.mouseup));
		this.core.on("mousedown",$bind(this,this.mousedown));
		this.core.on("mousemove",$bind(this,this.mousemove));
		this.batcher = new phoenix.Batcher(Luxe.renderer,"debug_batcher");
		this.view = new phoenix.Camera();
		this.batcher.view = this.view;
		this.batcher.set_layer(999);
		Luxe.renderer.add_batch(this.batcher);
		this.overlay = new phoenix.geometry.QuadGeometry({ x : 0, y : 0, w : Luxe.get_screen().w, h : Luxe.get_screen().h, color : new phoenix.Color(0,0,0,0.8), depth : 999, group : 999, visible : false, batcher : this.batcher});
		this.padding = new phoenix.Vector(Luxe.get_screen().w * 0.05,Luxe.get_screen().h * 0.05);
		this.debug_inspector = new luxe.debug.Inspector({ title : "luxe debug", pos : new phoenix.Vector(this.padding.x,this.padding.y), size : new phoenix.Vector(Luxe.get_screen().w - this.padding.x * 2,Luxe.get_screen().h - this.padding.y * 2), batcher : this.batcher});
		this.debug_inspector.onrefresh = $bind(this,this.refresh);
		this.batcher.enabled = false;
		var _g = 0;
		var _g1 = luxe.Debug.views;
		while(_g < _g1.length) {
			var view = _g1[_g];
			++_g;
			view.create();
		}
	}
	,mouseup: function(e) {
		if(this.visible) {
			var _g = 0;
			var _g1 = luxe.Debug.views;
			while(_g < _g1.length) {
				var view = _g1[_g];
				++_g;
				view.onmouseup(e);
			}
		}
	}
	,mousedown: function(e) {
		if(this.visible) {
			var _g = 0;
			var _g1 = luxe.Debug.views;
			while(_g < _g1.length) {
				var view = _g1[_g];
				++_g;
				view.onmousedown(e);
			}
		}
	}
	,mousewheel: function(e) {
		if(this.visible) {
			var _g = 0;
			var _g1 = luxe.Debug.views;
			while(_g < _g1.length) {
				var view = _g1[_g];
				++_g;
				view.onmousewheel(e);
			}
		}
	}
	,mousemove: function(e) {
		if(this.visible) {
			var _g = 0;
			var _g1 = luxe.Debug.views;
			while(_g < _g1.length) {
				var view = _g1[_g];
				++_g;
				view.onmousemove(e);
			}
		}
	}
	,keyup: function(e) {
		if(this.visible) {
			var _g = 0;
			var _g1 = luxe.Debug.views;
			while(_g < _g1.length) {
				var view = _g1[_g];
				++_g;
				view.onkeyup(e);
			}
		}
	}
	,keydown: function(e) {
		if(this.visible) {
			if(e.keycode == snow.input.Keycodes.key_1 && this.core.console_visible) this.switch_view();
			var _g = 0;
			var _g1 = luxe.Debug.views;
			while(_g < _g1.length) {
				var view = _g1[_g];
				++_g;
				view.onkeydown(e);
			}
		}
	}
	,onresize: function(e) {
		this.view.set_viewport(new phoenix.Rectangle(0,0,Luxe.get_screen().w,Luxe.get_screen().h));
	}
	,refresh: function() {
		this.current_view.refresh();
	}
	,switch_view: function() {
		this.last_view_index = this.current_view_index;
		this.current_view_index++;
		if(this.current_view_index > luxe.Debug.views.length - 1) this.current_view_index = 0;
		luxe.Debug.views[this.last_view_index].hide();
		this.current_view = luxe.Debug.views[this.current_view_index];
		this.current_view.show();
	}
	,last_cursor_shown: null
	,last_cursor_grab: null
	,show_console: function(_show) {
		if(_show == null) _show = true;
		if(_show) {
			this.last_cursor_shown = Luxe.get_screen().cursor.get_visible();
			this.last_cursor_grab = Luxe.get_screen().cursor.get_grab();
			Luxe.get_screen().cursor.set_visible(true);
			Luxe.get_screen().cursor.set_grab(false);
		} else {
			if(this.last_cursor_shown != true) Luxe.get_screen().cursor.set_visible(this.last_cursor_shown);
			if(this.last_cursor_grab != false) Luxe.get_screen().cursor.set_grab(this.last_cursor_grab);
		}
		this.visible = _show;
		this.batcher.enabled = _show;
		if(_show) {
			this.current_view.show();
			this.overlay.set_visible(true);
			this.debug_inspector.show();
		} else {
			this.current_view.hide();
			this.debug_inspector.hide();
			this.overlay.set_visible(false);
		}
	}
	,destroy: function() {
		this.core.off("keyup",$bind(this,this.keyup));
		this.core.off("keydown",$bind(this,this.keydown));
		this.core.off("mouseup",$bind(this,this.mouseup));
		this.core.off("mousedown",$bind(this,this.mousedown));
		this.core.off("mousemove",$bind(this,this.mousemove));
		luxe.Debug.shut_down = true;
	}
	,process: function() {
		this.dt_average_accum += Luxe.core.delta_time;
		this.dt_average_count++;
		if(this.dt_average_count == this.dt_average_span - 1) {
			this.dt_average = this.dt_average_accum / this.dt_average_span;
			this.dt_average_accum = this.dt_average;
			this.dt_average_count = 0;
		}
		if(!this.visible) return;
		this.debug_inspector._title_text.set_text("[ " + this.current_view.name + " ] " + luxe.utils.Maths.fixed(Luxe.core.delta_time,5) + " / " + luxe.utils.Maths.fixed(this.dt_average,5));
		var _g = 0;
		var _g1 = luxe.Debug.views;
		while(_g < _g1.length) {
			var view = _g1[_g];
			++_g;
			view.process();
		}
	}
	,__class__: luxe.Debug
};
luxe.Draw = function(_core) {
	this.core = _core;
};
luxe.Draw.__name__ = true;
luxe.Draw.prototype = {
	line: function(options) {
		if(options.p0 == null) throw "draw.line requires p0:Vector, and p1:Vector";
		if(options.p1 == null) throw "draw.line requires p0:Vector, and p1:Vector";
		if(options.id == null) options.id = "line.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		return new phoenix.geometry.LineGeometry(options);
	}
	,rectangle: function(options) {
		if(options.id == null) options.id = "rectangle.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		return new phoenix.geometry.RectangleGeometry(options);
	}
	,box: function(options) {
		if(options.id == null) options.id = "quad.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		return new phoenix.geometry.QuadGeometry(options);
	}
	,ring: function(options) {
		if(options.id == null) options.id = "ring.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		return new phoenix.geometry.RingGeometry(options);
	}
	,circle: function(options) {
		if(options.id == null) options.id = "circle.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		return new phoenix.geometry.CircleGeometry(options);
	}
	,arc: function(options) {
		if(options.id == null) options.id = "arc.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		return new phoenix.geometry.ArcGeometry(options);
	}
	,ngon: function(options) {
		if(options.id == null) options.id = "ngon.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		var _sides = 3;
		var _radius = 64;
		var _solid = false;
		var _x = 0;
		var _y = 0;
		var _angle = 0;
		if(options.sides != null) _sides = options.sides;
		if(options.r != null) _radius = options.r;
		if(options.x != null) _x = options.x;
		if(options.y != null) _y = options.y;
		if(options.angle != null) _angle = options.angle;
		if(options.solid != null) _solid = options.solid;
		var _geometry = new phoenix.geometry.Geometry(options);
		if(!_solid) _geometry.set_primitive_type(1); else _geometry.set_primitive_type(6);
		var _two_pi = 2 * Math.PI;
		var _sides_over_pi = Math.PI / _sides;
		var _sides_over_twopi = _two_pi / _sides;
		var _angle_rad = _angle * 0.017453292519943278;
		if(_solid) _geometry.add(new phoenix.geometry.Vertex(new phoenix.Vector(_x,_y),options.color));
		var _count;
		if(_solid == false) _count = _sides; else _count = _sides + 1;
		var _points = [];
		var _g = 0;
		while(_g < _count) {
			var i = _g++;
			var __x = _radius * Math.sin(_angle_rad + _sides_over_pi + i * _sides_over_twopi);
			var __y = _radius * Math.cos(_angle_rad + _sides_over_pi + i * _sides_over_twopi);
			var __pos = new phoenix.Vector(_x + __x,_y + __y,0);
			_geometry.add(new phoenix.geometry.Vertex(__pos,options.color));
			if(!_solid) {
				if(i > 0) {
					var _last = _points[i - 1];
					_geometry.add(new phoenix.geometry.Vertex(__pos,options.color));
				}
			}
			_points.push(__pos);
		}
		if(!_solid) _geometry.add(new phoenix.geometry.Vertex(_points[0],options.color));
		return _geometry;
	}
	,texture: function(options) {
		if(options.id == null) options.id = "texture.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		var _x = 0;
		var _y = 0;
		var _w = 0;
		var _h = 0;
		var _tw = 64;
		var _th = 64;
		if(options.texture != null) {
			_tw = options.texture.width;
			_th = options.texture.height;
			if(options.size == null) {
				_w = _tw;
				_h = _th;
			}
		}
		if(options.pos != null) {
			_x = options.pos.x;
			_y = options.pos.y;
		}
		if(options.size != null) {
			_w = options.size.x;
			_h = options.size.y;
		}
		if(options.x == null) options.x = _x;
		if(options.y == null) options.y = _y;
		if(options.w == null) options.w = _w;
		if(options.h == null) options.h = _h;
		var _quad = new phoenix.geometry.QuadGeometry(options);
		var _ux = 0;
		var _uy = 0;
		var _uw = _tw;
		var _uh = _th;
		if(options.uv != null) {
			_ux = options.uv.x;
			_uy = options.uv.y;
			_uw = options.uv.w;
			_uh = options.uv.h;
		}
		_quad.uv(new phoenix.Rectangle(_ux,_uy,_uw,_uh));
		return _quad;
	}
	,text: function(options) {
		if(options.id == null) options.id = "text.geometry";
		if(options.font == null) options.font = Luxe.renderer.font;
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		var _text = options.font.draw_text(options);
		return _text;
	}
	,plane: function(options) {
		if(options.id == null) options.id = "plane.geometry";
		if(options.batcher == null) options.batcher = Luxe.renderer.batcher;
		return new phoenix.geometry.PlaneGeometry(options);
	}
	,core: null
	,__class__: luxe.Draw
};
luxe.Events = function() {
	this.event_connections = new haxe.ds.StringMap();
	this.event_slots = new haxe.ds.StringMap();
	this.event_filters = new haxe.ds.StringMap();
	this.event_queue = new haxe.ds.StringMap();
	this.event_schedules = new haxe.ds.StringMap();
};
luxe.Events.__name__ = true;
luxe.Events.prototype = {
	event_queue: null
	,event_connections: null
	,event_slots: null
	,event_filters: null
	,event_schedules: null
	,destroy: function() {
		this.clear();
	}
	,clear: function() {
		var $it0 = this.event_schedules.iterator();
		while( $it0.hasNext() ) {
			var schedule = $it0.next();
			schedule.stop();
			schedule = null;
		}
		var $it1 = this.event_connections.keys();
		while( $it1.hasNext() ) {
			var connection = $it1.next();
			this.event_connections.remove(connection);
		}
		var $it2 = this.event_filters.keys();
		while( $it2.hasNext() ) {
			var filter = $it2.next();
			this.event_filters.remove(filter);
		}
		var $it3 = this.event_slots.keys();
		while( $it3.hasNext() ) {
			var slot = $it3.next();
			this.event_slots.remove(slot);
		}
		var $it4 = this.event_queue.keys();
		while( $it4.hasNext() ) {
			var event = $it4.next();
			this.event_queue.remove(event);
		}
	}
	,does_filter_event: function(_filter,_event) {
		var _replace_stars = new EReg("\\*","gi");
		var _final_filter = _replace_stars.replace(_filter,".*?");
		var _final_search = new EReg(_final_filter,"gi");
		return _final_search.match(_event);
	}
	,listen: function(_event_name,_listener) {
		var id = Luxe.utils.uniqueid();
		var connection = new luxe._Events.EventConnection(id,_event_name,_listener);
		this.event_connections.set(id,connection);
		var _has_stars = new EReg("\\*","gi");
		if(_has_stars.match(_event_name)) {
			if(!this.event_filters.exists(_event_name)) {
				var value = new Array();
				this.event_filters.set(_event_name,value);
			}
			this.event_filters.get(_event_name).push(connection);
		} else {
			if(!this.event_slots.exists(_event_name)) {
				var value1 = new Array();
				this.event_slots.set(_event_name,value1);
			}
			this.event_slots.get(_event_name).push(connection);
		}
		return id;
	}
	,disconnect: function(event_id) {
		if(this.event_connections.exists(event_id)) {
			var connection = this.event_connections.get(event_id);
			var event_slot = this.event_slots.get(connection.event_name);
			if(event_slot != null) {
				HxOverrides.remove(event_slot,connection);
				return true;
			} else {
				var event_filter = this.event_filters.get(connection.event_name);
				if(event_filter != null) {
					HxOverrides.remove(event_filter,connection);
					return true;
				} else return false;
			}
			return true;
		} else return false;
	}
	,queue: function(event_name,properties) {
		var id = Luxe.utils.uniqueid();
		var event = new luxe._Events.EventObject(id,event_name,properties);
		this.event_queue.set(id,event);
		return id;
	}
	,dequeue: function(event_id) {
		if(this.event_queue.exists(event_id)) {
			var event = this.event_queue.get(event_id);
			event = null;
			this.event_queue.remove(event_id);
			return true;
		}
		return false;
	}
	,process: function() {
		var $it0 = this.event_queue.iterator();
		while( $it0.hasNext() ) {
			var event = $it0.next();
			this.fire(event.name,event.properties);
		}
		if(this.event_queue.keys().hasNext()) {
			this.event_queue = null;
			this.event_queue = new haxe.ds.StringMap();
		}
	}
	,fire: function(_event_name,_properties) {
		var $it0 = this.event_filters.iterator();
		while( $it0.hasNext() ) {
			var _filter = $it0.next();
			if(_filter.length > 0) {
				var _filter_name = _filter[0].event_name;
				if(this.does_filter_event(_filter_name,_event_name)) {
					_properties = this.tag_properties(_properties,_event_name,_filter.length);
					var _g = 0;
					while(_g < _filter.length) {
						var _connection = _filter[_g];
						++_g;
						_connection.listener(_properties);
					}
				}
			}
		}
		if(this.event_slots.exists(_event_name)) {
			var connections = this.event_slots.get(_event_name);
			var _g1 = 0;
			while(_g1 < connections.length) {
				var connection = connections[_g1];
				++_g1;
				connection.listener(_properties);
			}
		} else return false;
		return false;
	}
	,schedule: function(time,event_name,properties) {
		var _g = this;
		var id = Luxe.utils.uniqueid();
		var _timer = Luxe.timer.schedule(time,function() {
			_g.fire(event_name,properties);
		});
		this.event_schedules.set(id,_timer);
		return id;
	}
	,unschedule: function(schedule_id) {
		if(this.event_schedules.exists(schedule_id)) {
			var timer = this.event_schedules.get(schedule_id);
			timer.stop();
			this.event_schedules.remove(schedule_id);
			return true;
		}
		return false;
	}
	,tag_properties: function(_properties,_name,_count) {
		if(_properties == null) _properties = { };
		_properties._event_name_ = _name;
		_properties._event_connection_count_ = _count;
		return _properties;
	}
	,__class__: luxe.Events
};
luxe._Events = {};
luxe._Events.EventConnection = function(_id,_event_name,_listener) {
	this.id = _id;
	this.listener = _listener;
	this.event_name = _event_name;
};
luxe._Events.EventConnection.__name__ = true;
luxe._Events.EventConnection.prototype = {
	listener: null
	,id: null
	,event_name: null
	,__class__: luxe._Events.EventConnection
};
luxe._Events.EventObject = function(_id,_event_name,_event_properties) {
	this.id = _id;
	this.name = _event_name;
	this.properties = _event_properties;
};
luxe._Events.EventObject.__name__ = true;
luxe._Events.EventObject.prototype = {
	id: null
	,name: null
	,properties: null
	,__class__: luxe._Events.EventObject
};
luxe.MouseButton = { __ename__ : true, __constructs__ : ["none","left","middle","right","extra1","extra2"] };
luxe.MouseButton.none = ["none",0];
luxe.MouseButton.none.toString = $estr;
luxe.MouseButton.none.__enum__ = luxe.MouseButton;
luxe.MouseButton.left = ["left",1];
luxe.MouseButton.left.toString = $estr;
luxe.MouseButton.left.__enum__ = luxe.MouseButton;
luxe.MouseButton.middle = ["middle",2];
luxe.MouseButton.middle.toString = $estr;
luxe.MouseButton.middle.__enum__ = luxe.MouseButton;
luxe.MouseButton.right = ["right",3];
luxe.MouseButton.right.toString = $estr;
luxe.MouseButton.right.__enum__ = luxe.MouseButton;
luxe.MouseButton.extra1 = ["extra1",4];
luxe.MouseButton.extra1.toString = $estr;
luxe.MouseButton.extra1.__enum__ = luxe.MouseButton;
luxe.MouseButton.extra2 = ["extra2",5];
luxe.MouseButton.extra2.toString = $estr;
luxe.MouseButton.extra2.__enum__ = luxe.MouseButton;
luxe.InteractState = { __ename__ : true, __constructs__ : ["unknown","none","down","up","move","wheel","axis"] };
luxe.InteractState.unknown = ["unknown",0];
luxe.InteractState.unknown.toString = $estr;
luxe.InteractState.unknown.__enum__ = luxe.InteractState;
luxe.InteractState.none = ["none",1];
luxe.InteractState.none.toString = $estr;
luxe.InteractState.none.__enum__ = luxe.InteractState;
luxe.InteractState.down = ["down",2];
luxe.InteractState.down.toString = $estr;
luxe.InteractState.down.__enum__ = luxe.InteractState;
luxe.InteractState.up = ["up",3];
luxe.InteractState.up.toString = $estr;
luxe.InteractState.up.__enum__ = luxe.InteractState;
luxe.InteractState.move = ["move",4];
luxe.InteractState.move.toString = $estr;
luxe.InteractState.move.__enum__ = luxe.InteractState;
luxe.InteractState.wheel = ["wheel",5];
luxe.InteractState.wheel.toString = $estr;
luxe.InteractState.wheel.__enum__ = luxe.InteractState;
luxe.InteractState.axis = ["axis",6];
luxe.InteractState.axis.toString = $estr;
luxe.InteractState.axis.__enum__ = luxe.InteractState;
luxe.TextEventType = { __ename__ : true, __constructs__ : ["unknown","edit","input"] };
luxe.TextEventType.unknown = ["unknown",0];
luxe.TextEventType.unknown.toString = $estr;
luxe.TextEventType.unknown.__enum__ = luxe.TextEventType;
luxe.TextEventType.edit = ["edit",1];
luxe.TextEventType.edit.toString = $estr;
luxe.TextEventType.edit.__enum__ = luxe.TextEventType;
luxe.TextEventType.input = ["input",2];
luxe.TextEventType.input.toString = $estr;
luxe.TextEventType.input.__enum__ = luxe.TextEventType;
luxe.GamepadEventType = { __ename__ : true, __constructs__ : ["unknown","axis","button","device_added","device_removed","device_remapped"] };
luxe.GamepadEventType.unknown = ["unknown",0];
luxe.GamepadEventType.unknown.toString = $estr;
luxe.GamepadEventType.unknown.__enum__ = luxe.GamepadEventType;
luxe.GamepadEventType.axis = ["axis",1];
luxe.GamepadEventType.axis.toString = $estr;
luxe.GamepadEventType.axis.__enum__ = luxe.GamepadEventType;
luxe.GamepadEventType.button = ["button",2];
luxe.GamepadEventType.button.toString = $estr;
luxe.GamepadEventType.button.__enum__ = luxe.GamepadEventType;
luxe.GamepadEventType.device_added = ["device_added",3];
luxe.GamepadEventType.device_added.toString = $estr;
luxe.GamepadEventType.device_added.__enum__ = luxe.GamepadEventType;
luxe.GamepadEventType.device_removed = ["device_removed",4];
luxe.GamepadEventType.device_removed.toString = $estr;
luxe.GamepadEventType.device_removed.__enum__ = luxe.GamepadEventType;
luxe.GamepadEventType.device_remapped = ["device_remapped",5];
luxe.GamepadEventType.device_remapped.toString = $estr;
luxe.GamepadEventType.device_remapped.__enum__ = luxe.GamepadEventType;
luxe.InputType = { __ename__ : true, __constructs__ : ["mouse","touch","keys","gamepad"] };
luxe.InputType.mouse = ["mouse",0];
luxe.InputType.mouse.toString = $estr;
luxe.InputType.mouse.__enum__ = luxe.InputType;
luxe.InputType.touch = ["touch",1];
luxe.InputType.touch.toString = $estr;
luxe.InputType.touch.__enum__ = luxe.InputType;
luxe.InputType.keys = ["keys",2];
luxe.InputType.keys.toString = $estr;
luxe.InputType.keys.__enum__ = luxe.InputType;
luxe.InputType.gamepad = ["gamepad",3];
luxe.InputType.gamepad.toString = $estr;
luxe.InputType.gamepad.__enum__ = luxe.InputType;
luxe.Input = function(_core) {
	this.core = _core;
};
luxe.Input.__name__ = true;
luxe.Input.prototype = {
	core: null
	,key_bindings: null
	,mouse_bindings: null
	,_named_input_released: null
	,_named_input_pressed: null
	,_named_input_down: null
	,init: function() {
		this.key_bindings = new haxe.ds.StringMap();
		this.mouse_bindings = new haxe.ds.StringMap();
		this._named_input_down = new haxe.ds.StringMap();
		this._named_input_pressed = new haxe.ds.StringMap();
		this._named_input_released = new haxe.ds.StringMap();
		null;
	}
	,destroy: function() {
		null;
	}
	,process: function() {
		var $it0 = this._named_input_pressed.keys();
		while( $it0.hasNext() ) {
			var _event = $it0.next();
			if(this._named_input_pressed.get(_event)) this._named_input_pressed.remove(_event); else this._named_input_pressed.set(_event,true);
		}
		var $it1 = this._named_input_released.keys();
		while( $it1.hasNext() ) {
			var _event1 = $it1.next();
			if(this._named_input_released.get(_event1)) this._named_input_released.remove(_event1); else this._named_input_released.set(_event1,true);
		}
	}
	,inputpressed: function(_event) {
		return this._named_input_pressed.exists(_event);
	}
	,inputreleased: function(_event) {
		return this._named_input_released.exists(_event);
	}
	,inputdown: function(_event) {
		return this._named_input_down.exists(_event);
	}
	,keypressed: function(_code) {
		return this.core.app.input.keypressed(_code);
	}
	,keyreleased: function(_code) {
		return this.core.app.input.keyreleased(_code);
	}
	,keydown: function(_code) {
		return this.core.app.input.keydown(_code);
	}
	,scanpressed: function(_code) {
		return this.core.app.input.scanpressed(_code);
	}
	,scanreleased: function(_code) {
		return this.core.app.input.scanreleased(_code);
	}
	,scandown: function(_code) {
		return this.core.app.input.scandown(_code);
	}
	,mousepressed: function(_button) {
		return this.core.app.input.mousepressed(_button);
	}
	,mousereleased: function(_button) {
		return this.core.app.input.mousereleased(_button);
	}
	,mousedown: function(_button) {
		return this.core.app.input.mousedown(_button);
	}
	,gamepadpressed: function(_gamepad,_button) {
		return this.core.app.input.gamepadpressed(_gamepad,_button);
	}
	,gamepadreleased: function(_gamepad,_button) {
		return this.core.app.input.gamepadreleased(_gamepad,_button);
	}
	,gamepaddown: function(_gamepad,_button) {
		return this.core.app.input.gamepaddown(_gamepad,_button);
	}
	,gamepadaxis: function(_gamepad,_axis) {
		return this.core.app.input.gamepadaxis(_gamepad,_axis);
	}
	,add_key_binding: function(_name,_value) {
		if(!this.key_bindings.exists(_name)) {
			var value = new haxe.ds.IntMap();
			this.key_bindings.set(_name,value);
		}
		var kb = this.key_bindings.get(_name);
		kb.set(_value,true);
	}
	,add_mouse_binding: function(_name,_value) {
		if(!this.mouse_bindings.exists(_name)) {
			var value = new haxe.ds.EnumValueMap();
			this.mouse_bindings.set(_name,value);
		}
		var mb = this.mouse_bindings.get(_name);
		mb.set(_value,true);
	}
	,add: function(_name,_binding_value) {
		if(((_binding_value | 0) === _binding_value)) this.add_key_binding(_name,_binding_value); else if(js.Boot.__instanceof(_binding_value,luxe.MouseButton)) this.add_mouse_binding(_name,_binding_value);
	}
	,check_named_keys: function(e,_down) {
		if(_down == null) _down = false;
		var _fired = [];
		var $it0 = this.key_bindings.keys();
		while( $it0.hasNext() ) {
			var _name = $it0.next();
			var _b = this.key_bindings.get(_name);
			var _is_down_repeat = _down && e.repeat;
			if(_b.exists(e.keycode) && !_is_down_repeat) {
				if(!Lambda.has(_fired,_name)) _fired.push(_name);
			}
		}
		var _g = 0;
		while(_g < _fired.length) {
			var _f = _fired[_g];
			++_g;
			if(_down) {
				this._named_input_pressed.set(_f,false);
				this._named_input_down.set(_f,true);
				this.core.oninputdown(_f,{ name : _f, type : luxe.InputType.keys, state : luxe.InteractState.down, key_event : e});
			} else {
				this._named_input_released.set(_f,false);
				this._named_input_down.remove(_f);
				this.core.oninputup(_f,{ name : _f, type : luxe.InputType.keys, state : luxe.InteractState.up, key_event : e});
			}
		}
	}
	,check_named_mouse: function(e,_down) {
		if(_down == null) _down = false;
		var _fired = [];
		var $it0 = this.mouse_bindings.keys();
		while( $it0.hasNext() ) {
			var _name = $it0.next();
			var _b = this.mouse_bindings.get(_name);
			if(_b.exists(e.button)) {
				if(!Lambda.has(_fired,_name)) _fired.push(_name);
			}
		}
		var _g = 0;
		while(_g < _fired.length) {
			var _f = _fired[_g];
			++_g;
			if(_down) this.core.oninputdown(_f,{ name : _f, type : luxe.InputType.mouse, state : luxe.InteractState.down, mouse_event : e}); else this.core.oninputup(_f,{ name : _f, type : luxe.InputType.mouse, state : luxe.InteractState.up, mouse_event : e});
		}
	}
	,__class__: luxe.Input
};
luxe.Log = function() { };
luxe.Log.__name__ = true;
luxe.Log._get_spacing = function(_file) {
	var _spaces = "";
	var _trace_length = _file.length + 4;
	var _diff = luxe.Log._log_width - _trace_length;
	if(_diff > 0) {
		var _g = 0;
		while(_g < _diff) {
			var i = _g++;
			_spaces += " ";
		}
	}
	return _spaces;
};
luxe.Visual = function(_options) {
	this.ignore_texture_on_geometry_change = false;
	this._creating_geometry = false;
	this._has_custom_origin = false;
	this.radians = 0.0;
	this.group = 0;
	this.depth = 0.0;
	this.visible = true;
	this.locked = false;
	var _g = this;
	if(_options == null) throw "Visual needs not-null options at the moment";
	this._rotation_euler = new phoenix.Vector();
	this._rotation_quat = new phoenix.Quaternion();
	luxe.Entity.call(this,_options);
	this.set_color(new phoenix.Color());
	this.set_size(new phoenix.Vector());
	if(this.options.texture != null) this.set_texture(this.options.texture);
	if(this.options.shader != null) this.set_shader(this.options.shader);
	if(this.options.color != null) this.set_color(this.options.color);
	if(this.options.depth != null) this.set_depth(this.options.depth);
	if(this.options.group != null) this.set_group(this.options.group);
	if(this.options.visible != null) this.set_visible(this.options.visible);
	if(this.options.size != null) {
		this.set_size(this.options.size);
		this._create_geometry();
	} else if(this.texture != null) {
		if(this.texture.loaded) {
			this.set_size(new phoenix.Vector(this.texture.width,this.texture.height));
			this._create_geometry();
		} else this.texture.set_onload(function(_texture) {
			_g.set_size(new phoenix.Vector(_texture.width,_texture.height));
			_g._create_geometry();
		});
	} else {
		this.set_size(new phoenix.Vector(64,64));
		this._create_geometry();
	}
};
luxe.Visual.__name__ = true;
luxe.Visual.__super__ = luxe.Entity;
luxe.Visual.prototype = $extend(luxe.Entity.prototype,{
	size: null
	,geometry: null
	,locked: null
	,texture: null
	,shader: null
	,color: null
	,visible: null
	,depth: null
	,group: null
	,clip_rect: null
	,radians: null
	,_rotation_euler: null
	,_rotation_quat: null
	,_has_custom_origin: null
	,_creating_geometry: null
	,_create_geometry: function() {
		if(this.options.geometry == null) {
			if(this.options.no_geometry == null || this.options.no_geometry == false) {
				this._creating_geometry = true;
				var _batcher = null;
				if(this.options.no_batcher_add == null || this.options.no_batcher_add == false) {
					if(this.options.batcher != null) _batcher = this.options.batcher; else _batcher = Luxe.renderer.batcher;
				}
				this.set_geometry(new phoenix.geometry.QuadGeometry({ id : this.name + ".visual", x : 0, y : 0, w : this.size.x, h : this.size.y, scale : new phoenix.Vector(1,1,1), texture : this.texture, color : this.color, shader : this.shader, batcher : _batcher, depth : this.options.depth == null?0:this.options.depth, group : this.options.group == null?0:this.options.group, visible : this.options.visible == null?true:this.options.visible}));
				this._creating_geometry = false;
				this.on_geometry_created();
			}
		} else this.set_geometry(this.options.geometry);
		if(this.geometry != null) {
			this.geometry.id = this.name + ".visual";
			this.geometry.transform.id = this.name + ".visual.transform";
		}
		if(this.options.origin != null) {
			this._has_custom_origin = true;
			this.set_origin(this.options.origin);
		}
		if(this.options.rotation_z != null) this.set_rotation_z(this.options.rotation_z);
	}
	,ondestroy: function() {
		if(this.geometry != null && this.geometry.added) this.geometry.drop(true);
		this.set_geometry(null);
		this.set_texture(null);
	}
	,on_geometry_created: function() {
	}
	,set_visible: function(_v) {
		this.visible = _v;
		if(this.geometry != null) this.geometry.set_visible(this.visible);
		return this.visible;
	}
	,set_depth: function(_v) {
		if(this.geometry != null) this.geometry.set_depth(_v);
		return this.depth = _v;
	}
	,set_group: function(_v) {
		if(this.geometry != null) this.geometry.set_group(_v);
		return this.group = _v;
	}
	,set_color: function(_c) {
		if(this.color != null && this.geometry != null) this.geometry.set_color(_c);
		return this.color = _c;
	}
	,set_texture: function(_t) {
		if(this.geometry != null) this.geometry.set_texture(_t);
		return this.texture = _t;
	}
	,set_shader: function(_s) {
		if(this.geometry != null) this.geometry.set_shader(_s);
		return this.shader = _s;
	}
	,ignore_texture_on_geometry_change: null
	,set_geometry: function(_g) {
		if(this.geometry != null) this.geometry.drop();
		this.geometry = _g;
		if(this.geometry != null) {
			this.geometry.transform.set_parent(this.transform);
			if(this._creating_geometry == false) {
				this.geometry.set_color(this.color);
				this.geometry.set_group(this.group);
				this.geometry.set_depth(this.depth);
				this.geometry.set_visible(this.visible);
				this.geometry.set_shader(this.shader);
				if(!this.ignore_texture_on_geometry_change) this.geometry.set_texture(this.texture);
			}
		}
		return this.geometry;
	}
	,set_parent_from_transform: function(_parent) {
		luxe.Entity.prototype.set_parent_from_transform.call(this,_parent);
		if(this.geometry != null) this.geometry.transform.set_parent(this.transform);
	}
	,set_rotation_from_transform: function(_rotation) {
		luxe.Entity.prototype.set_rotation_from_transform.call(this,_rotation);
		this._rotation_euler.setEulerFromQuaternion(_rotation,null);
		this._rotation_quat.copy(_rotation);
	}
	,set_size: function(_v) {
		this.size = _v;
		phoenix.Vector.Listen(this.size,$bind(this,this._size_change));
		return this.size;
	}
	,get_rotation_z: function() {
		return luxe.utils.Maths.degrees(this.get_radians());
	}
	,set_rotation_z: function(_degrees) {
		this.set_radians(_degrees * 0.017453292519943278);
		return _degrees;
	}
	,set_radians: function(_r) {
		this._rotation_euler.set_z(_r);
		this._rotation_quat.setFromEuler(this._rotation_euler);
		this.set_rotation(this._rotation_quat.clone());
		return this.radians = _r;
	}
	,get_radians: function() {
		return this.radians;
	}
	,set_locked: function(_l) {
		if(this.geometry != null) this.geometry.set_locked(_l);
		return this.locked = _l;
	}
	,set_clip_rect: function(val) {
		return this.geometry.set_clip_rect(val);
	}
	,_size_change: function(_v) {
		this.set_size(this.size);
	}
	,init: function() {
	}
	,__class__: luxe.Visual
	,__properties__: $extend(luxe.Entity.prototype.__properties__,{set_rotation_z:"set_rotation_z",get_rotation_z:"get_rotation_z",set_radians:"set_radians",get_radians:"get_radians",set_clip_rect:"set_clip_rect",set_group:"set_group",set_depth:"set_depth",set_visible:"set_visible",set_color:"set_color",set_shader:"set_shader",set_texture:"set_texture",set_locked:"set_locked",set_geometry:"set_geometry",set_size:"set_size"})
});
luxe.Sprite = function(options) {
	this.flipy = false;
	this.flipx = false;
	this.centered = true;
	this.set_uv(new phoenix.Rectangle());
	if(options == null) throw "Sprite needs not-null options at the moment";
	if(options.centered != null) this.set_centered(options.centered);
	if(options.flipx != null) this.set_flipx(options.flipx);
	if(options.flipy != null) this.set_flipy(options.flipy);
	luxe.Visual.call(this,options);
};
luxe.Sprite.__name__ = true;
luxe.Sprite.__super__ = luxe.Visual;
luxe.Sprite.prototype = $extend(luxe.Visual.prototype,{
	centered: null
	,flipx: null
	,flipy: null
	,uv: null
	,geometry_quad: null
	,on_geometry_created: function() {
		var _g = this;
		luxe.Visual.prototype.on_geometry_created.call(this);
		if(this.texture != null) this.texture.set_onload(function(t) {
			if(_g.options.uv == null) _g.set_uv(new phoenix.Rectangle(0,0,_g.texture.width,_g.texture.height)); else _g.set_uv(_g.options.uv);
			if(_g.texture.type == luxe.resource.ResourceType.render_texture) _g.set_flipy(true);
		});
		this.set_centered(!(!this.centered));
		this.set_flipx(!(!this.flipx));
		this.set_flipy(!(!this.flipy));
	}
	,set_geometry: function(_g) {
		this.geometry_quad = _g;
		return luxe.Visual.prototype.set_geometry.call(this,_g);
	}
	,point_inside: function(_p) {
		if(this.geometry == null) return false;
		return Luxe.utils.geometry.point_in_geometry(_p,this.geometry);
	}
	,point_inside_AABB: function(_p) {
		if(this.get_pos() == null) return false;
		if(this.size == null) return false;
		if(this.centered) {
			var hx = this.size.x / 2;
			var hy = this.size.y / 2;
			if(_p.x < this.get_pos().x - hx) return false;
			if(_p.y < this.get_pos().y - hy) return false;
			if(_p.x > this.get_pos().x + this.size.x - hx) return false;
			if(_p.y > this.get_pos().y + this.size.y - hy) return false;
		} else {
			if(_p.x < this.get_pos().x) return false;
			if(_p.y < this.get_pos().y) return false;
			if(_p.x > this.get_pos().x + this.size.x) return false;
			if(_p.y > this.get_pos().y + this.size.y) return false;
		}
		return true;
	}
	,set_uv: function(_uv) {
		if(this.geometry_quad != null) this.geometry_quad.uv(_uv);
		this.uv = _uv;
		phoenix.Rectangle.listen(this.uv,$bind(this,this._uv_change));
		return this.uv;
	}
	,set_flipy: function(_v) {
		if(_v == this.flipy) return this.flipy;
		if(this.geometry_quad != null) this.geometry_quad.set_flipy(_v);
		return this.flipy = _v;
	}
	,set_flipx: function(_v) {
		if(_v == this.flipx) return this.flipx;
		if(this.geometry_quad != null) this.geometry_quad.set_flipx(_v);
		return this.flipx = _v;
	}
	,set_size: function(_v) {
		if(this.geometry_quad != null) {
			this.geometry_quad.resize(new phoenix.Vector(_v.x,_v.y));
			if(!this._has_custom_origin) {
				if(this.centered) this.set_origin(new phoenix.Vector(_v.x,_v.y,_v.z,_v.w).divideScalar(2));
			}
		}
		return luxe.Visual.prototype.set_size.call(this,_v);
	}
	,set_centered: function(_c) {
		if(this.size != null) {
			if(_c) this.set_origin(new phoenix.Vector(this.size.x / 2,this.size.y / 2)); else this.set_origin(new phoenix.Vector());
		}
		return this.centered = _c;
	}
	,_uv_change: function(_v) {
		this.set_uv(this.uv);
	}
	,init: function() {
	}
	,ondestroy: function() {
		luxe.Visual.prototype.ondestroy.call(this);
	}
	,__class__: luxe.Sprite
	,__properties__: $extend(luxe.Visual.prototype.__properties__,{set_uv:"set_uv",set_flipy:"set_flipy",set_flipx:"set_flipx",set_centered:"set_centered"})
});
luxe.NineSlice = function(_options) {
	this.added = false;
	this.midheight = 0.0;
	this.midwidth = 0.0;
	this.is_set = false;
	this.source_h = 0.0;
	this.source_w = 0.0;
	this.source_y = 0.0;
	this.source_x = 0.0;
	this.height = 0.0;
	this.bottom = 32;
	this.width = 0.0;
	this.right = 32;
	this.left = 32;
	this.top = 32;
	this.slices = new Array();
	if(_options == null) _options = { no_geometry : true, no_scene : true}; else {
		_options.no_geometry = true;
		_options.no_scene = true;
	}
	this.nineslice_options = _options;
	if(_options.batcher != null) this._batcher = _options.batcher; else this._batcher = Luxe.renderer.batcher;
	luxe.Sprite.call(this,_options);
	if(_options.top != null) this.top = _options.top;
	if(_options.left != null) this.left = _options.left;
	if(_options.right != null) this.right = _options.right;
	if(_options.bottom != null) this.bottom = _options.bottom;
	if(_options.source_x != null) this.source_x = _options.source_x;
	if(_options.source_y != null) this.source_y = _options.source_y;
	if(_options.source_w != null) this.source_w = _options.source_w; else this.source_w = this.texture.width;
	if(_options.source_h != null) this.source_h = _options.source_h; else this.source_h = this.texture.height;
	this.set_geometry(null);
};
luxe.NineSlice.__name__ = true;
luxe.NineSlice.__super__ = luxe.Sprite;
luxe.NineSlice.prototype = $extend(luxe.Sprite.prototype,{
	top: null
	,left: null
	,right: null
	,width: null
	,bottom: null
	,height: null
	,source_x: null
	,source_y: null
	,source_w: null
	,source_h: null
	,is_set: null
	,midwidth: null
	,midheight: null
	,slices: null
	,added: null
	,nineslice_options: null
	,_geometry: null
	,_batcher: null
	,lock: function() {
		if(this.is_set && this._geometry != null) this._geometry.set_locked(true);
	}
	,dirty: function() {
		if(this.is_set && this._geometry != null) this._geometry.set_dirty(true);
	}
	,update_size: function(_width,_height) {
		this.width = _width;
		this.height = _height;
		this.midwidth = Math.abs(this.width - this.left - this.right);
		this.midheight = Math.abs(this.height - this.top - this.bottom);
		this.slices[0].source_width = this.left;
		this.slices[0].source_height = this.top;
		this.slices[0].source_x = this.source_x;
		this.slices[0].source_y = this.source_y;
		this.slices[0].pos.set_xy(0,0);
		this.slices[0].width = this.left;
		this.slices[0].height = this.top;
		this.slices[1].source_width = this.source_w - this.left - this.right;
		this.slices[1].source_height = this.top;
		this.slices[1].source_x = this.source_x + this.left;
		this.slices[1].source_y = this.source_y;
		this.slices[1].pos.set_xy(this.left,0);
		this.slices[1].width = this.width - this.left - this.right;
		this.slices[1].height = this.top;
		this.slices[2].source_width = this.right;
		this.slices[2].source_height = this.top;
		this.slices[2].source_x = this.source_x + (this.source_w - this.right);
		this.slices[2].source_y = this.source_y;
		this.slices[2].pos.set_xy(this.left + this.midwidth,0);
		this.slices[2].width = this.right;
		this.slices[2].height = this.top;
		this.slices[3].source_width = this.left;
		this.slices[3].source_height = this.source_h - this.top - this.bottom;
		this.slices[3].source_x = this.source_x;
		this.slices[3].source_y = this.source_y + this.top;
		this.slices[3].pos.set_xy(0,this.top);
		this.slices[3].width = this.left;
		this.slices[3].height = this.height - this.top - this.bottom;
		this.slices[4].source_width = this.source_w - this.left - this.right;
		this.slices[4].source_height = this.source_h - this.top - this.bottom;
		this.slices[4].source_x = this.source_x + this.left;
		this.slices[4].source_y = this.source_y + this.top;
		this.slices[4].pos.set_xy(this.left,this.top);
		this.slices[4].width = this.width - this.left - this.right;
		this.slices[4].height = this.height - this.top - this.bottom;
		this.slices[5].source_width = this.right;
		this.slices[5].source_height = this.source_h - this.top - this.bottom;
		this.slices[5].source_x = this.source_x + (this.source_w - this.right);
		this.slices[5].source_y = this.source_y + this.top;
		this.slices[5].pos.set_xy(this.left + this.midwidth,this.top);
		this.slices[5].width = this.right;
		this.slices[5].height = this.height - this.top - this.bottom;
		this.slices[6].source_width = this.left;
		this.slices[6].source_height = this.bottom;
		this.slices[6].source_x = this.source_x;
		this.slices[6].source_y = this.source_y + (this.source_h - this.bottom);
		this.slices[6].pos.set_xy(0,this.top + this.midheight);
		this.slices[6].width = this.left;
		this.slices[6].height = this.bottom;
		this.slices[7].source_width = this.source_w - this.left - this.right;
		this.slices[7].source_height = this.bottom;
		this.slices[7].source_x = this.source_x + this.left;
		this.slices[7].source_y = this.source_y + (this.source_h - this.bottom);
		this.slices[7].pos.set_xy(this.left,this.top + this.midheight);
		this.slices[7].width = this.width - this.left - this.right;
		this.slices[7].height = this.bottom;
		this.slices[8].source_width = this.right;
		this.slices[8].source_height = this.bottom;
		this.slices[8].source_x = this.source_x + (this.source_w - this.right);
		this.slices[8].source_y = this.source_y + (this.source_h - this.bottom);
		this.slices[8].pos.set_xy(this.left + this.midwidth,this.top + this.midheight);
		this.slices[8].width = this.right;
		this.slices[8].height = this.bottom;
	}
	,set: function(_width,_height) {
		if(this.added) {
			this._geometry.drop();
			this.added = false;
		}
		this.slices.splice(0,this.slices.length);
		this.width = _width;
		this.height = _height;
		this.midwidth = Math.abs(this.width - this.left - this.right);
		this.midheight = Math.abs(this.height - this.top - this.bottom);
		this.slices.push({ source_width : this.left, source_height : this.top, source_x : this.source_x, source_y : this.source_y, pos : new phoenix.Vector(0,0), width : this.left, height : this.top, geometry_id : ""});
		this.slices.push({ source_width : this.source_w - this.left - this.right, source_height : this.top, source_x : this.source_x + this.left, source_y : this.source_y, pos : new phoenix.Vector(this.left,0), width : this.width - this.left - this.right, height : this.top, geometry_id : ""});
		this.slices.push({ source_width : this.right, source_height : this.top, source_x : this.source_x + (this.source_w - this.right), source_y : this.source_y, pos : new phoenix.Vector(this.left + this.midwidth,0), width : this.right, height : this.top, geometry_id : ""});
		this.slices.push({ source_width : this.left, source_height : this.source_h - this.top - this.bottom, source_x : this.source_x, source_y : this.source_y + this.top, pos : new phoenix.Vector(0,this.top), width : this.left, height : this.height - this.top - this.bottom, geometry_id : ""});
		this.slices.push({ source_width : this.source_w - this.left - this.right, source_height : this.source_h - this.top - this.bottom, source_x : this.source_x + this.left, source_y : this.source_y + this.top, pos : new phoenix.Vector(this.left,this.top), width : this.width - this.left - this.right, height : this.height - this.top - this.bottom, geometry_id : ""});
		this.slices.push({ source_width : this.right, source_height : this.source_h - this.top - this.bottom, source_x : this.source_x + (this.source_w - this.right), source_y : this.source_y + this.top, pos : new phoenix.Vector(this.left + this.midwidth,this.top), width : this.right, height : this.height - this.top - this.bottom, geometry_id : ""});
		this.slices.push({ source_width : this.left, source_height : this.bottom, source_x : this.source_x, source_y : this.source_y + (this.source_h - this.bottom), pos : new phoenix.Vector(0,this.top + this.midheight), width : this.left, height : this.bottom, geometry_id : ""});
		this.slices.push({ source_width : this.source_w - this.left - this.right, source_height : this.bottom, source_x : this.source_x + this.left, source_y : this.source_y + (this.source_h - this.bottom), pos : new phoenix.Vector(this.left,this.top + this.midheight), width : this.width - this.left - this.right, height : this.bottom, geometry_id : ""});
		this.slices.push({ source_width : this.right, source_height : this.bottom, source_x : this.source_x + (this.source_w - this.right), source_y : this.source_y + (this.source_h - this.bottom), pos : new phoenix.Vector(this.left + this.midwidth,this.top + this.midheight), width : this.right, height : this.bottom, geometry_id : ""});
		this.is_set = true;
	}
	,set_size: function(_v) {
		if(!this.is_set) return _v;
		this.update_size(_v.x,_v.y);
		var _g = 0;
		var _g1 = this.slices;
		while(_g < _g1.length) {
			var slice = _g1[_g];
			++_g;
			if(this._geometry != null) this._geometry.quad_resize(slice.geometry_id,new phoenix.Rectangle(slice.pos.x,slice.pos.y,slice.width,slice.height));
		}
		return _v;
	}
	,set_pos: function(_v) {
		luxe.Sprite.prototype.set_pos.call(this,_v);
		var _pv = new phoenix.Vector(_v.x,_v.y,_v.z,_v.w);
		if(this.is_set) this._geometry.transform.local.set_pos(_pv);
		return luxe.Sprite.prototype.set_pos.call(this,_pv);
	}
	,ondestroy: function() {
		if(this.is_set) this._geometry.drop();
	}
	,set_visible: function(_v) {
		luxe.Sprite.prototype.set_visible.call(this,_v);
		if(this.is_set) this._geometry.set_visible(_v);
		return this.visible = _v;
	}
	,set_depth: function(_d) {
		luxe.Sprite.prototype.set_depth.call(this,_d);
		if(this.is_set) this._geometry.set_depth(_d);
		return this.depth = _d;
	}
	,set_clip_rect: function(val) {
		if(this.is_set) this._geometry.set_clip_rect(val);
		return this.clip_rect = val;
	}
	,set_color: function(_color) {
		if(this.is_set) this._geometry.set_color(_color);
		return this.color = _color;
	}
	,_create: function(_pos,_w,_h,_reset) {
		if(_reset == null) _reset = false;
		if(!this.is_set || _reset) this.set(_w,_h);
		var _color = new phoenix.Color();
		this._geometry = new phoenix.geometry.ComplexGeometry({ texture : this.texture, color : _color, depth : this.nineslice_options.depth, group : this.nineslice_options.group, visible : this.nineslice_options.visible, batcher : this._batcher});
		var _g = 0;
		var _g1 = this.slices;
		while(_g < _g1.length) {
			var slice = _g1[_g];
			++_g;
			slice.geometry_id = this._geometry.quad_add({ x : slice.pos.x, y : slice.pos.y, w : slice.width, h : slice.height});
			this._geometry.quad_uv(slice.geometry_id,new phoenix.Rectangle(slice.source_x,slice.source_y,slice.source_width,slice.source_height));
			this._geometry.quad_pos(slice.geometry_id,new phoenix.Vector(slice.pos.x,slice.pos.y));
		}
		this._geometry.transform.local.set_pos(_pos);
		this._geometry.id = "NineSlice";
		this.added = true;
		this.is_set = true;
	}
	,create: function(_pos,_w,_h,_reset) {
		if(_reset == null) _reset = false;
		var _g = this;
		if(!this.texture.loaded) this.texture.set_onload(function(texture) {
			_g._create(_pos,_w,_h,_reset);
		}); else this._create(_pos,_w,_h,_reset);
	}
	,init: function() {
	}
	,__class__: luxe.NineSlice
});
luxe.Physics = function(_core) {
	this.step_delta = 0.016666666666666666;
	this.step_rate = 0.016666666666666666;
	this.core = _core;
};
luxe.Physics.__name__ = true;
luxe.Physics.prototype = {
	core: null
	,engines: null
	,step_rate: null
	,step_delta: null
	,timer: null
	,init: function() {
		this.engines = [];
	}
	,reset: function() {
		if(this.timer != null) {
			this.timer.stop();
			this.timer = null;
		}
		if(this.step_rate != 0) this.timer = Luxe.timer.schedule(this.step_rate,$bind(this,this.fixed_update),true);
	}
	,fixed_update: function() {
		Luxe.debug.start(luxe.Physics.tag_physics);
		this.update();
		Luxe.debug.end(luxe.Physics.tag_physics);
	}
	,add_engine: function(type,_data) {
		var _engine_instance = Type.createInstance(type,[_data]);
		var _physics_engine = _engine_instance;
		_physics_engine.init();
		this.engines.push(_physics_engine);
		return _engine_instance;
	}
	,update: function() {
		var _g = 0;
		var _g1 = this.engines;
		while(_g < _g1.length) {
			var engine = _g1[_g];
			++_g;
			engine.update();
		}
	}
	,process: function() {
		var _g = 0;
		var _g1 = this.engines;
		while(_g < _g1.length) {
			var engine = _g1[_g];
			++_g;
			engine.process();
		}
	}
	,render: function() {
		var _g = 0;
		var _g1 = this.engines;
		while(_g < _g1.length) {
			var engine = _g1[_g];
			++_g;
			engine.render();
		}
	}
	,destroy: function() {
		this.timer.stop();
		this.timer = null;
		var _g = 0;
		var _g1 = this.engines;
		while(_g < _g1.length) {
			var engine = _g1[_g];
			++_g;
			engine.destroy();
		}
	}
	,set_step_rate: function(_rate) {
		this.step_rate = _rate;
		this.step_delta = this.step_rate;
		this.reset();
		return this.step_rate;
	}
	,__class__: luxe.Physics
	,__properties__: {set_step_rate:"set_step_rate"}
};
luxe.PhysicsEngine = function() {
	this.draw = true;
	this.paused = false;
	this.name = "engine";
	this.set_gravity(new phoenix.Vector(0,-9.8,0));
	Luxe.on("render",$bind(this,this._render));
};
luxe.PhysicsEngine.__name__ = true;
luxe.PhysicsEngine.prototype = {
	name: null
	,paused: null
	,gravity: null
	,draw: null
	,init: function() {
	}
	,_render: function(_) {
		this.render();
	}
	,process: function() {
	}
	,update: function() {
	}
	,render: function() {
	}
	,get_paused: function() {
		return this.paused;
	}
	,set_paused: function(_pause) {
		return this.paused = _pause;
	}
	,get_draw: function() {
		return this.draw;
	}
	,set_draw: function(_draw) {
		return this.draw = _draw;
	}
	,get_gravity: function() {
		return this.gravity;
	}
	,set_gravity: function(_gravity) {
		return this.gravity = _gravity;
	}
	,destroy: function() {
	}
	,__class__: luxe.PhysicsEngine
	,__properties__: {set_draw:"set_draw",get_draw:"get_draw",set_gravity:"set_gravity",get_gravity:"get_gravity",set_paused:"set_paused",get_paused:"get_paused"}
};
luxe.Scene = function(_name) {
	if(_name == null) _name = "untitled scene";
	this.length = 0;
	this.started = false;
	this.inited = false;
	luxe.Objects.call(this,_name);
	this.entities = new haxe.ds.StringMap();
	this._delayed_init_entities = [];
	this._delayed_reset_entities = [];
	Luxe.core.on("init",$bind(this,this.init));
	Luxe.core.on("destroy",$bind(this,this._destroy));
	Luxe.core.on("update",$bind(this,this.update));
	Luxe.core.on("prerender",$bind(this,this.prerender));
	Luxe.core.on("postrender",$bind(this,this.postrender));
	Luxe.core.on("render",$bind(this,this.render));
	Luxe.core.on("keydown",$bind(this,this.keydown));
	Luxe.core.on("keyup",$bind(this,this.keyup));
	Luxe.core.on("textinput",$bind(this,this.textinput));
	Luxe.core.on("inputup",$bind(this,this.inputup));
	Luxe.core.on("inputdown",$bind(this,this.inputdown));
	Luxe.core.on("mouseup",$bind(this,this.mouseup));
	Luxe.core.on("mousedown",$bind(this,this.mousedown));
	Luxe.core.on("mousemove",$bind(this,this.mousemove));
	Luxe.core.on("mousewheel",$bind(this,this.mousewheel));
	Luxe.core.on("touchup",$bind(this,this.touchup));
	Luxe.core.on("touchdown",$bind(this,this.touchdown));
	Luxe.core.on("touchmove",$bind(this,this.touchmove));
	Luxe.core.on("gamepadup",$bind(this,this.gamepadup));
	Luxe.core.on("gamepaddown",$bind(this,this.gamepaddown));
	Luxe.core.on("gamepadaxis",$bind(this,this.gamepadaxis));
	Luxe.core.on("gamepaddevice",$bind(this,this.gamepaddevice));
	if(Luxe.core.has_inited) this.init(null);
};
luxe.Scene.__name__ = true;
luxe.Scene.__super__ = luxe.Objects;
luxe.Scene.prototype = $extend(luxe.Objects.prototype,{
	entities: null
	,inited: null
	,started: null
	,_delayed_init_entities: null
	,_delayed_reset_entities: null
	,length: null
	,add: function(entity) {
		if(entity == null) throw "can't put entity in a scene if the entity is null.";
		if(this.entities.exists(entity.name)) haxe.Log.trace("    i / scene / " + ("" + this.name + " / adding a second entity named " + entity.name + "!\r\n                This will replace the existing one, possibly leaving the previous one in limbo.\r\n                Use EntityOptions name_unique flag to automatically handle this for similar named entities."),{ fileName : "Scene.hx", lineNumber : 78, className : "luxe.Scene", methodName : "add"});
		entity.set_scene(this);
		this.entities.set(entity.name,entity);
		if(this.inited) this._delayed_init_entities.push(entity);
		if(this.started) this._delayed_reset_entities.push(entity);
	}
	,remove: function(entity) {
		if(entity == null) throw "can't remove entity from a scene if the entity is null.";
		if(entity.get_scene() == this) {
			entity.set_scene(null);
			return this.entities.remove(entity.name);
		} else {
			haxe.Log.trace("    i / scene / " + "can't remove the entity from this scene, it is not mine (entity.scene != this)",{ fileName : "Scene.hx", lineNumber : 113, className : "luxe.Scene", methodName : "remove"});
			return false;
		}
		return false;
	}
	,empty: function() {
		var $it0 = this.entities.iterator();
		while( $it0.hasNext() ) {
			var entity = $it0.next();
			if(entity != null) {
				this.remove(entity);
				entity.destroy();
				entity = null;
			}
		}
	}
	,get_named_like: function(_name,into) {
		var _filter = new EReg("^((?:" + _name + ")[.]{1})","g");
		var $it0 = this.entities.iterator();
		while( $it0.hasNext() ) {
			var _entity = $it0.next();
			if(_filter.match(_entity.name)) into.push(_entity);
		}
		return into;
	}
	,render: function(_) {
		this.emit("render",null,{ fileName : "Scene.hx", lineNumber : 164, className : "luxe.Scene", methodName : "render"});
	}
	,prerender: function(_) {
		this.emit("prerender",null,{ fileName : "Scene.hx", lineNumber : 170, className : "luxe.Scene", methodName : "prerender"});
	}
	,postrender: function(_) {
		this.emit("postrender",null,{ fileName : "Scene.hx", lineNumber : 176, className : "luxe.Scene", methodName : "postrender"});
	}
	,keydown: function(e) {
		this.emit("keydown",e,{ fileName : "Scene.hx", lineNumber : 186, className : "luxe.Scene", methodName : "keydown"});
	}
	,keyup: function(e) {
		this.emit("keyup",e,{ fileName : "Scene.hx", lineNumber : 194, className : "luxe.Scene", methodName : "keyup"});
	}
	,textinput: function(e) {
		this.emit("textinput",e,{ fileName : "Scene.hx", lineNumber : 202, className : "luxe.Scene", methodName : "textinput"});
	}
	,mousedown: function(e) {
		this.emit("mousedown",e,{ fileName : "Scene.hx", lineNumber : 212, className : "luxe.Scene", methodName : "mousedown"});
	}
	,mousewheel: function(e) {
		this.emit("mousewheel",e,{ fileName : "Scene.hx", lineNumber : 220, className : "luxe.Scene", methodName : "mousewheel"});
	}
	,mouseup: function(e) {
		this.emit("mouseup",e,{ fileName : "Scene.hx", lineNumber : 228, className : "luxe.Scene", methodName : "mouseup"});
	}
	,mousemove: function(e) {
		this.emit("mousemove",e,{ fileName : "Scene.hx", lineNumber : 236, className : "luxe.Scene", methodName : "mousemove"});
	}
	,touchdown: function(event) {
		this.emit("touchdown",event,{ fileName : "Scene.hx", lineNumber : 244, className : "luxe.Scene", methodName : "touchdown"});
	}
	,touchup: function(event) {
		this.emit("touchup",event,{ fileName : "Scene.hx", lineNumber : 250, className : "luxe.Scene", methodName : "touchup"});
	}
	,touchmove: function(event) {
		this.emit("touchmove",event,{ fileName : "Scene.hx", lineNumber : 256, className : "luxe.Scene", methodName : "touchmove"});
	}
	,gamepadaxis: function(event) {
		this.emit("gamepadaxis",event,{ fileName : "Scene.hx", lineNumber : 264, className : "luxe.Scene", methodName : "gamepadaxis"});
	}
	,gamepadup: function(event) {
		this.emit("gamepadup",event,{ fileName : "Scene.hx", lineNumber : 270, className : "luxe.Scene", methodName : "gamepadup"});
	}
	,gamepaddown: function(event) {
		this.emit("gamepaddown",event,{ fileName : "Scene.hx", lineNumber : 276, className : "luxe.Scene", methodName : "gamepaddown"});
	}
	,gamepaddevice: function(event) {
		this.emit("gamepaddevice",event,{ fileName : "Scene.hx", lineNumber : 282, className : "luxe.Scene", methodName : "gamepaddevice"});
	}
	,inputdown: function(event) {
		this.emit("inputdown",event,{ fileName : "Scene.hx", lineNumber : 290, className : "luxe.Scene", methodName : "inputdown"});
	}
	,inputup: function(event) {
		this.emit("inputup",event,{ fileName : "Scene.hx", lineNumber : 296, className : "luxe.Scene", methodName : "inputup"});
	}
	,_destroy: function(_) {
		this.destroy();
	}
	,destroy: function() {
		Luxe.core.off("init",$bind(this,this.init));
		Luxe.core.off("destroy",$bind(this,this._destroy));
		Luxe.core.off("update",$bind(this,this.update));
		Luxe.core.off("prerender",$bind(this,this.prerender));
		Luxe.core.off("postrender",$bind(this,this.postrender));
		Luxe.core.off("render",$bind(this,this.render));
		Luxe.core.off("keydown",$bind(this,this.keydown));
		Luxe.core.off("keyup",$bind(this,this.keyup));
		Luxe.core.off("textinput",$bind(this,this.textinput));
		Luxe.core.off("inputup",$bind(this,this.inputup));
		Luxe.core.off("inputdown",$bind(this,this.inputdown));
		Luxe.core.off("mouseup",$bind(this,this.mouseup));
		Luxe.core.off("mousedown",$bind(this,this.mousedown));
		Luxe.core.off("mousemove",$bind(this,this.mousemove));
		Luxe.core.off("mousewheel",$bind(this,this.mousewheel));
		Luxe.core.off("touchup",$bind(this,this.touchup));
		Luxe.core.off("touchdown",$bind(this,this.touchdown));
		Luxe.core.off("touchmove",$bind(this,this.touchmove));
		Luxe.core.off("gamepadup",$bind(this,this.gamepadup));
		Luxe.core.off("gamepaddown",$bind(this,this.gamepaddown));
		Luxe.core.off("gamepadaxis",$bind(this,this.gamepadaxis));
		Luxe.core.off("gamepaddevice",$bind(this,this.gamepaddevice));
		this.emit("destroy",null,{ fileName : "Scene.hx", lineNumber : 339, className : "luxe.Scene", methodName : "destroy"});
	}
	,_do_init: function() {
		var _before_count = this.get_length();
		var $it0 = this.entities.iterator();
		while( $it0.hasNext() ) {
			var entity = $it0.next();
			if(entity != null) {
				if(!entity.inited) entity._init();
			}
		}
		var _after_count = this.get_length();
		return _before_count != _after_count;
	}
	,init: function(_) {
		var keep_going = true;
		while(keep_going) keep_going = this._do_init();
		this.inited = true;
		this.emit("init",null,{ fileName : "Scene.hx", lineNumber : 373, className : "luxe.Scene", methodName : "init"});
		this.reset();
	}
	,reset: function() {
		this.started = false;
		this.emit("reset",null,{ fileName : "Scene.hx", lineNumber : 384, className : "luxe.Scene", methodName : "reset"});
		this.started = true;
	}
	,update: function(dt) {
		Luxe.core.debug.start("scene." + this.name);
		this.handle_delayed_additions();
		this.emit("update",dt,{ fileName : "Scene.hx", lineNumber : 397, className : "luxe.Scene", methodName : "update"});
		var $it0 = this.entities.iterator();
		while( $it0.hasNext() ) {
			var entity = $it0.next();
			if(entity != null) entity._update(dt);
		}
		Luxe.core.debug.end("scene." + this.name);
	}
	,handle_delayed_additions: function() {
		if(this._delayed_init_entities.length != 0 || this._delayed_reset_entities.length != 0) null;
		if(this._delayed_init_entities.length > 0) {
			var _g = 0;
			var _g1 = this._delayed_init_entities;
			while(_g < _g1.length) {
				var entity = _g1[_g];
				++_g;
				entity._init();
			}
			this._delayed_init_entities.splice(0,this._delayed_init_entities.length);
		}
		if(this._delayed_reset_entities.length > 0) {
			var _g2 = 0;
			var _g11 = this._delayed_reset_entities;
			while(_g2 < _g11.length) {
				var entity1 = _g11[_g2];
				++_g2;
				entity1._reset(null);
			}
			this._delayed_reset_entities.splice(0,this._delayed_reset_entities.length);
		}
	}
	,get_length: function() {
		return Lambda.count(this.entities);
	}
	,toString: function() {
		return "luxe Scene: " + this.name + " / " + this.get_length() + " entities / id: " + this.id;
	}
	,__class__: luxe.Scene
	,__properties__: {get_length:"get_length"}
});
luxe.Screen = function(_core,_x,_y,_w,_h) {
	this.core = _core;
	this.cursor = new luxe.Cursor(this);
	this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;
	this.mid = new phoenix.Vector(Math.round(this.w / 2),Math.round(this.h / 2));
	this.size = new phoenix.Vector(this.w,this.h);
};
luxe.Screen.__name__ = true;
luxe.Screen.prototype = {
	x: null
	,y: null
	,w: null
	,h: null
	,cursor: null
	,core: null
	,mid: null
	,size: null
	,toString: function() {
		return "luxe.Screen({ x:" + this.x + ", y:" + this.y + ", w:" + this.w + ", h:" + this.h + " })";
	}
	,get_mid: function() {
		return this.mid.clone();
	}
	,get_size: function() {
		return this.size.clone();
	}
	,point_inside: function(_p) {
		if(_p.x < this.x) return false;
		if(_p.y < this.y) return false;
		if(_p.x > this.x + this.w) return false;
		if(_p.y > this.y + this.h) return false;
		return true;
	}
	,__class__: luxe.Screen
	,__properties__: {get_size:"get_size",get_mid:"get_mid"}
};
luxe.Cursor = function(_screen) {
	this.lock = false;
	this.grab = false;
	this.visible = true;
	this.screen = _screen;
	this.set_pos(new phoenix.Vector());
};
luxe.Cursor.__name__ = true;
luxe.Cursor.prototype = {
	screen: null
	,visible: null
	,grab: null
	,lock: null
	,pos: null
	,get_visible: function() {
		return this.visible;
	}
	,set_visible: function(_visible) {
		this.screen.core.app.windowing.enable_cursor(_visible);
		return this.visible = _visible;
	}
	,get_grab: function() {
		return this.grab;
	}
	,get_lock: function() {
		return this.lock;
	}
	,set_grab: function(_grab) {
		this.screen.core.app.window.set_grab(_grab);
		return this.grab = _grab;
	}
	,set_lock: function(_lock) {
		this.screen.core.app.windowing.enable_cursor_lock(_lock);
		return this.lock = _lock;
	}
	,get_pos: function() {
		if(this.pos != null) this.pos.set_xy(Luxe.mouse.x,Luxe.mouse.y);
		return this.pos;
	}
	,set_pos: function(_p) {
		if(this.get_pos() != null) this.screen.core.app.window.set_cursor_position(_p.x | 0,_p.y | 0);
		return this.pos = _p;
	}
	,__class__: luxe.Cursor
	,__properties__: {set_pos:"set_pos",get_pos:"get_pos",set_lock:"set_lock",get_lock:"get_lock",set_grab:"set_grab",get_grab:"get_grab",set_visible:"set_visible",get_visible:"get_visible"}
};
luxe.Text = function(_options) {
	this.ready = false;
	this.textsize = 32;
	this.text = "";
	if(_options.batcher == null) this._batcher = Luxe.renderer.batcher; else this._batcher = _options.batcher;
	if(_options.pos == null) _options.pos = new phoenix.Vector();
	if(_options.color == null) _options.color = new phoenix.Color();
	if(_options.depth == null) _options.depth = 0;
	if(_options.group == null) _options.group = 0;
	if(_options.visible == null) _options.visible = true;
	this.text_options = _options;
	luxe.Visual.call(this,{ name : _options.name, no_scene : _options.no_scene, batcher : this._batcher, color : _options.color, parent : _options.parent, visible : _options.visible, depth : _options.depth, group : _options.group, no_geometry : true});
	var _font;
	if(_options.font == null) _font = null; else _font = _options.font;
	if(_font == null) _font = Luxe.renderer.font;
	this.set_textsize(_options.size == null?24:_options.size);
	if(typeof(_font) == "string") {
		var _folder = haxe.io.Path.directory(_font) + "/";
		this.font = Luxe.loadFont(_font,_folder,$bind(this,this.onloaded));
	} else {
		this.font = _font;
		this.ready = true;
	}
	this.text_options.size = this.textsize;
	this.set_text(_options.text);
};
luxe.Text.__name__ = true;
luxe.Text.__super__ = luxe.Visual;
luxe.Text.prototype = $extend(luxe.Visual.prototype,{
	font: null
	,_batcher: null
	,composite_geometry: null
	,text: null
	,textsize: null
	,ready: null
	,text_options: null
	,size_rect_cache: null
	,scale_cache: null
	,point_inside: function(p) {
		if(this.font == null) return false;
		if(!this.ready) return false;
		if(this.size_rect_cache == null) {
			this.scale_cache = new phoenix.Vector();
			this.size_rect_cache = new phoenix.Rectangle();
		}
		this.scale_cache.set_x(this.scale_cache.set_y(this.text_options.size / this.font.font_size));
		var dim = this.font.get_text_dimensions(this.text,this.scale_cache);
		this.size_rect_cache.set_x(this.get_pos().x - dim.x / 2);
		this.size_rect_cache.set_y(this.get_pos().y);
		this.size_rect_cache.set_w(dim.x);
		this.size_rect_cache.set_h(dim.y);
		return this.size_rect_cache.point_inside(p);
	}
	,onloaded: function(font) {
		this.ready = true;
		this.set_text(this.text + "");
	}
	,set_pos_from_transform: function(_p) {
		luxe.Visual.prototype.set_pos_from_transform.call(this,_p);
		this.text_options.pos = this.get_pos();
	}
	,set_textsize: function(v) {
		if(this.text_options != null) {
			this.textsize = v;
			this.text_options.size = this.textsize;
			this.set_text(this.text + "");
		}
		return this.textsize;
	}
	,set_color: function(c) {
		luxe.Visual.prototype.set_color.call(this,c);
		this.text_options.color = this.color;
		return this.color;
	}
	,set_visible: function(b) {
		luxe.Visual.prototype.set_visible.call(this,b);
		this.text_options.visible = this.visible;
		return this.visible;
	}
	,set_locked: function(l) {
		luxe.Visual.prototype.set_locked.call(this,l);
		this.text_options.locked = this.locked;
		return this.locked;
	}
	,set_text: function(t) {
		this.text = t;
		if(this.ready && this.text_options != null) {
			this.text_options.text = t;
			if(this.geometry != null) this.geometry.drop();
			this.set_geometry(null);
			this.composite_geometry = null;
			this.composite_geometry = this.font.draw_text(this.text_options);
			this.set_origin(this.composite_geometry.transform.origin.clone());
			this.set_pos(this.composite_geometry.transform.local.pos.clone());
			this.set_locked(this.composite_geometry.get_locked());
			this.set_visible(this.composite_geometry.visible);
			this.composite_geometry.transform.set_origin(new phoenix.Vector());
			this.composite_geometry.transform.set_pos(new phoenix.Vector());
			this.ignore_texture_on_geometry_change = true;
			this.set_geometry(this.composite_geometry);
			this.ignore_texture_on_geometry_change = false;
		}
		return this.text;
	}
	,init: function() {
	}
	,ondestroy: function() {
		luxe.Visual.prototype.ondestroy.call(this);
	}
	,__class__: luxe.Text
	,__properties__: $extend(luxe.Visual.prototype.__properties__,{set_textsize:"set_textsize",set_text:"set_text"})
});
luxe.Timer = function(_core) {
	this.core = _core;
	this.timers = [];
};
luxe.Timer.__name__ = true;
luxe.Timer.prototype = {
	core: null
	,timers: null
	,init: function() {
		null;
	}
	,destroy: function() {
		null;
	}
	,process: function() {
	}
	,reset: function() {
		var _g = 0;
		var _g1 = this.timers;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			t.stop();
			t = null;
		}
		this.timers = null;
		this.timers = [];
	}
	,schedule: function(_time_in_seconds,_on_time,repeat) {
		if(repeat == null) repeat = false;
		var _g = this;
		var t = new snow.utils.Timer(_time_in_seconds);
		t.run = function() {
			if(!repeat) {
				t.stop();
				HxOverrides.remove(_g.timers,t);
			}
			_on_time();
		};
		this.timers.push(t);
		return t;
	}
	,__class__: luxe.Timer
};
luxe.components = {};
luxe.components.Components = function(_entity) {
	this.components = new haxe.ds.StringMap();
	this.entity = _entity;
};
luxe.components.Components.__name__ = true;
luxe.components.Components.prototype = {
	components: null
	,entity: null
	,add: function(_component) {
		if(_component == null) {
			haxe.Log.trace("attempt to add null component to " + this.entity.name,{ fileName : "Components.hx", lineNumber : 26, className : "luxe.components.Components", methodName : "add"});
			return _component;
		}
		_component.set_entity(this.entity);
		this.components.set(_component.name,_component);
		_component.onadded();
		if(this.entity.inited) _component.init();
		if(this.entity.started) _component.onreset();
		return _component;
	}
	,remove: function(_name) {
		if(!this.components.exists(_name)) {
			haxe.Log.trace("attempt to remove " + _name + " from " + this.entity.name + " failed because that component was not attached to this entity",{ fileName : "Components.hx", lineNumber : 59, className : "luxe.components.Components", methodName : "remove"});
			return false;
		}
		var _component = this.components.get(_name);
		_component.onremoved();
		_component.set_entity(null);
		return this.components.remove(_name);
	}
	,get: function(_name,in_children) {
		if(in_children == null) in_children = false;
		if(!in_children) return this.components.get(_name); else {
			var in_this_entity = this.components.get(_name);
			if(in_this_entity != null) return in_this_entity;
			var _g = 0;
			var _g1 = this.entity.children;
			while(_g < _g1.length) {
				var _child = _g1[_g];
				++_g;
				var found = _child.get(_name,true);
				if(found != null) return found;
			}
			return null;
		}
		return null;
	}
	,get_any: function(_name,in_children,first_only) {
		if(first_only == null) first_only = true;
		if(in_children == null) in_children = false;
		var results = [];
		if(!in_children) return [this.components.get(_name)]; else {
			var in_this_entity = this.components.get(_name);
			if(in_this_entity != null) {
				if(first_only) return [in_this_entity]; else results.push(in_this_entity);
			}
			var _g = 0;
			var _g1 = this.entity.children;
			while(_g < _g1.length) {
				var _child = _g1[_g];
				++_g;
				var found = _child.get_any(_name,true,first_only);
				if(found != null) {
					if(first_only && found.length > 0) return [found[0]]; else results.concat(found);
				}
			}
		}
		return results;
	}
	,has: function(_name) {
		return this.components.exists(_name);
	}
	,__class__: luxe.components.Components
};
luxe.debug = {};
luxe.debug.DebugView = function() {
	this.visible = false;
	luxe.Objects.call(this);
};
luxe.debug.DebugView.__name__ = true;
luxe.debug.DebugView.__super__ = luxe.Objects;
luxe.debug.DebugView.prototype = $extend(luxe.Objects.prototype,{
	visible: null
	,refresh: function() {
	}
	,process: function() {
	}
	,onmousedown: function(e) {
	}
	,onmousewheel: function(e) {
	}
	,onmouseup: function(e) {
	}
	,onmousemove: function(e) {
	}
	,onkeydown: function(e) {
	}
	,onkeyup: function(e) {
	}
	,create: function() {
	}
	,show: function() {
		this.visible = true;
	}
	,hide: function() {
		this.visible = false;
	}
	,__class__: luxe.debug.DebugView
});
luxe.debug.BatcherDebugView = function() {
	this.as_immediate = false;
	this.dragging = false;
	luxe.debug.DebugView.call(this);
	this.name = "Batcher Debug";
};
luxe.debug.BatcherDebugView.__name__ = true;
luxe.debug.BatcherDebugView.__super__ = luxe.debug.DebugView;
luxe.debug.BatcherDebugView.prototype = $extend(luxe.debug.DebugView.prototype,{
	batcher: null
	,create: function() {
		this.batcher = Luxe.renderer.create_batcher({ name : "debug_batcher_view", camera : new phoenix.Camera({ camera_name : "batcher_debug_view"}), layer : 1000});
	}
	,refresh: function() {
		this.clear_batcher_tree();
		this.draw_batcher_tree();
	}
	,dragging: null
	,dragstart: null
	,dragmstart: null
	,onmousedown: function(e) {
		this.dragmstart = e.pos.clone();
		this.dragstart = this.batcher.view.get_pos().clone();
		this.dragging = true;
	}
	,onmouseup: function(e) {
		this.dragging = false;
	}
	,onmousemove: function(e) {
		if(this.dragging) {
			var diff = phoenix.Vector.Subtract(e.pos,this.dragmstart);
			this.batcher.view.set_pos(phoenix.Vector.Subtract(this.dragstart,diff));
		}
	}
	,onmousewheel: function(e) {
		if(e.y < 0) {
			var _g = this.batcher.view;
			_g.set_zoom(_g.zoom - 0.1);
		} else {
			var _g1 = this.batcher.view;
			_g1.set_zoom(_g1.zoom + 0.1);
		}
	}
	,_tree_geom: null
	,as_immediate: null
	,clear_batcher_tree: function() {
		if(this._tree_geom != null) {
			this._tree_geom.drop();
			this._tree_geom = null;
		}
	}
	,keystr: function(key,key2) {
		return "ts: " + key.timestamp + "\n" + "seq: " + key.sequence + "\n" + "primitive_type: " + Std.string(key.primitive_type) + " " + Std.string(key.primitive_type) + "\n" + "texture: " + (key.texture == null?"null":Std.string(key.texture.texture)) + "\n" + "texture id: " + (key.texture == null?"null":key.texture.id) + "\n" + "shader: " + (key.shader == null?"null":key.shader.id) + "\n" + "group: " + key.group + "\n" + "depth: " + key.depth + "\n" + "clip: " + (key.clip == null?"null":"" + key.clip);
	}
	,draw_geom_node: function(l,_leaf,_p,_bbw) {
		if(_bbw == null) _bbw = 20;
		var _bw = 128;
		var _bwhalf = _bw / 2;
		var _bh = 128;
		var _g = _leaf.value;
		var c = new phoenix.Color(1,1,1,0.4).rgb(16777215);
		if(_g.dropped) c = new phoenix.Color(1,1,1,1).rgb(13369344);
		this._tree_geom.add_geometry(Luxe.draw.rectangle({ immediate : this.as_immediate, x : _p.x - _bwhalf, y : _p.y, w : _bw, h : _bh, color : c, batcher : this.batcher, depth : 999.4}));
		this._tree_geom.add_geometry(Luxe.draw.text({ immediate : this.as_immediate, bounds : new phoenix.Rectangle(_p.x - _bwhalf,_p.y,_bw,_bh), size : 13, color : c, batcher : this.batcher, depth : 999.4, text : this.keystr(_leaf.key,_g.key), align : phoenix.TextAlign.center, align_vertical : phoenix.TextAlign.center}));
		var t = new phoenix.Vector(_p.x,_p.y,_p.z,_p.w).set_xy(_p.x,_p.y - 16);
		var t2 = new phoenix.Vector(_p.x,_p.y,_p.z,_p.w).set_xy(_p.x,_p.y + _bw + 2);
		var talign = phoenix.TextAlign.center;
		this._tree_geom.add_geometry(Luxe.draw.text({ immediate : this.as_immediate, pos : t, size : 13, color : c, batcher : this.batcher, depth : 999.4, text : _g.short_id(), align : talign}));
		var c2 = new phoenix.Color(1,1,1,0.4).rgb(16750916);
		var notes_l = "none";
		var notes_r = "none";
		if(_leaf.left != null) {
			notes_l = "node";
			var compare = Luxe.renderer.batcher.compare_rule(_leaf.key,_leaf.left.key);
			notes_l = Luxe.renderer.batcher.compare_rule_to_string(compare);
		}
		if(_leaf.right != null) {
			notes_r = "node";
			var compare1 = Luxe.renderer.batcher.compare_rule(_leaf.key,_leaf.right.key);
			notes_r = Luxe.renderer.batcher.compare_rule_to_string(compare1);
		}
		this._tree_geom.add_geometry(Luxe.draw.text({ immediate : this.as_immediate, pos : t2, size : 13, color : c2, batcher : this.batcher, depth : 999.4, text : notes_l + " / " + notes_r, align : talign}));
	}
	,draw_geom_leaf: function(L,_leaf,_p) {
		if(_leaf == null) return;
		var _bw = _leaf.nodecount / 20;
		var _bwb = _leaf.nodecount * 25;
		var _bh = 128;
		var _bh2 = 148;
		var _bwhalf = _bw / 2;
		var c = new phoenix.Color(1,1,1,0.4).rgb(16777215);
		if(_leaf != null) {
			this.draw_geom_node(L,_leaf,_p,_bw);
			if(_leaf.left != null) {
				if(Luxe.renderer.batcher.geometry_compare(_leaf.left.key,_leaf.key) < 0) c = new phoenix.Color(1,1,1,1).rgb(52224); else c = new phoenix.Color(1,1,1,1).rgb(13369344);
				this._tree_geom.add_geometry(Luxe.draw.line({ immediate : this.as_immediate, p0 : new phoenix.Vector(_p.x - _bwhalf,_p.y + _bh), p1 : new phoenix.Vector(_p.x - _bwb,_p.y + _bh2), color : c, batcher : this.batcher, depth : 999.4}));
				this.draw_geom_leaf(true,_leaf.left,new phoenix.Vector(_p.x - _bwb,_p.y + _bh2));
			}
			if(_leaf.right != null) {
				if(Luxe.renderer.batcher.geometry_compare(_leaf.right.key,_leaf.key) > 0) c = new phoenix.Color(1,1,1,1).rgb(52224); else c = new phoenix.Color(1,1,1,1).rgb(13369344);
				this._tree_geom.add_geometry(Luxe.draw.line({ immediate : this.as_immediate, p0 : new phoenix.Vector(_p.x + _bwhalf,_p.y + _bh), p1 : new phoenix.Vector(_p.x + _bwb,_p.y + _bh2), color : c, batcher : this.batcher, depth : 999.4}));
				this.draw_geom_leaf(false,_leaf.right,new phoenix.Vector(_p.x + _bwb,_p.y + _bh2));
			}
		}
	}
	,draw_batcher_tree: function() {
		this._tree_geom = null;
		this._tree_geom = new phoenix.geometry.CompositeGeometry({ batcher : this.batcher, immediate : this.as_immediate, depth : 999.4});
		var _p = new phoenix.Vector(Luxe.get_screen().w / 2,Luxe.debug.padding.y * 2 + 10);
		var _node = Luxe.renderer.batcher.geometry.root;
		this.draw_geom_leaf(true,_node,_p);
	}
	,process: function() {
		if(this.visible) {
			if(Luxe.renderer.batcher.tree_changed) this.refresh();
		}
	}
	,show: function() {
		luxe.debug.DebugView.prototype.show.call(this);
		this.refresh();
	}
	,hide: function() {
		luxe.debug.DebugView.prototype.hide.call(this);
		this.clear_batcher_tree();
	}
	,__class__: luxe.debug.BatcherDebugView
});
luxe.debug.Inspector = function(_options) {
	this.title = "Inspector";
	this.font = Luxe.renderer.font;
	this.size = new phoenix.Vector(Luxe.get_screen().w * 0.2 | 0,Luxe.get_screen().h * 0.6 | 0);
	this.pos = new phoenix.Vector(Luxe.get_screen().w / 2 - this.size.x / 2,Luxe.get_screen().h / 2 - this.size.y / 2);
	this.uitexture = phoenix.Texture.load_from_resource("tiny.ui.png");
	this.uibutton = phoenix.Texture.load_from_resource("tiny.button.png");
	this._batcher = Luxe.renderer.batcher;
	if(_options != null) {
		if(_options.title != null) this.title = _options.title;
		if(_options.font != null) this.font = _options.font;
		if(_options.pos != null) this.pos = _options.pos;
		if(_options.size != null) this.size = _options.size;
		if(_options.batcher != null) this._batcher = _options.batcher;
	}
};
luxe.debug.Inspector.__name__ = true;
luxe.debug.Inspector.prototype = {
	title: null
	,font: null
	,pos: null
	,size: null
	,_title_text: null
	,_version_text: null
	,uitexture: null
	,uibutton: null
	,_window: null
	,onrefresh: null
	,_batcher: null
	,refresh: function() {
		if(this._window == null) this._create_window();
		if(this.onrefresh != null) this.onrefresh();
	}
	,show: function() {
		this.refresh();
		this._window.set_visible(true);
		this._title_text.set_visible(true);
		this._version_text.set_visible(true);
	}
	,hide: function() {
		this._window.set_visible(false);
		this._title_text.set_visible(false);
		this._version_text.set_visible(false);
	}
	,_create_window: function() {
		if(this._window != null) this._window.destroy();
		this._window = new luxe.NineSlice({ depth : 999.1, texture : this.uitexture, batcher : this._batcher});
		this._window.create(this.pos,this.size.x,this.size.y);
		this._window._geometry.id = "debug.Inspector";
		this._window.lock();
		this._title_text = new luxe.Text({ name : "debug.title", batcher : this._batcher, no_scene : true, depth : 999.2, color : new phoenix.Color().rgb(16121979), pos : new phoenix.Vector(this.pos.x + this.size.x / 2,this.pos.y + 5), align : phoenix.TextAlign.center, font : this.font, text : this.title, size : 16, visible : false});
		this._version_text = new luxe.Text({ name : "debug.version", batcher : this._batcher, no_scene : true, depth : 999.2, color : new phoenix.Color().rgb(3355443), pos : new phoenix.Vector(this.pos.x + (this.size.x - 14),this.pos.y + 5), align : phoenix.TextAlign.right, font : this.font, text : "" + Luxe.build, size : 16, visible : false});
		if(this._title_text.geometry != null) this._title_text.geometry.id = "debug.title.text";
		if(this._version_text.geometry != null) this._version_text.geometry.id = "debug.version.text";
	}
	,__class__: luxe.debug.Inspector
};
luxe.debug.ProfilerDebugView = function() {
	this._setup = false;
	luxe.debug.DebugView.call(this);
	this.name = "Profiler";
	luxe.debug.ProfilerDebugView.lists = new haxe.ds.StringMap();
};
luxe.debug.ProfilerDebugView.__name__ = true;
luxe.debug.ProfilerDebugView.add_offset = function(_id,_offset) {
	var _item = luxe.debug.ProfilerDebugView.lists.get(_id);
	var _offsetitem = luxe.debug.ProfilerDebugView.lists.get(_offset);
	if(_item != null && _offsetitem != null) _item.offsets.push(_offsetitem); else {
		haxe.Log.trace("not found for " + _id + " or " + _offset,{ fileName : "ProfilerDebugView.hx", lineNumber : 32, className : "luxe.debug.ProfilerDebugView", methodName : "add_offset"});
		haxe.Log.trace(Std.string(_item) + " / " + Std.string(_offsetitem),{ fileName : "ProfilerDebugView.hx", lineNumber : 33, className : "luxe.debug.ProfilerDebugView", methodName : "add_offset"});
	}
};
luxe.debug.ProfilerDebugView.hide_item = function(_id) {
	var _item = luxe.debug.ProfilerDebugView.lists.get(_id);
	if(_item != null) {
		_item.hidden = true;
		_item.bar.hide();
	}
};
luxe.debug.ProfilerDebugView.show_item = function(_id) {
	var _item = luxe.debug.ProfilerDebugView.lists.get(_id);
	if(_item != null) {
		_item.hidden = false;
		_item.bar.show();
	}
};
luxe.debug.ProfilerDebugView.start = function(_id) {
	var _item = luxe.debug.ProfilerDebugView.lists.get(_id);
	if(_item == null) {
		_item = new luxe.debug._ProfilerDebugView.ProfilerValue(_id,new luxe.debug._ProfilerDebugView.ProfilerBar(_id,new phoenix.Color().rgb(16121979)));
		_item.bar.set_pos(new phoenix.Vector(Luxe.debug.padding.x * 2,Luxe.debug.padding.y * 3 + Lambda.count(luxe.debug.ProfilerDebugView.lists) * 20));
		luxe.debug.ProfilerDebugView.lists.set(_id,_item);
	}
	_item.start = Luxe.get_time();
};
luxe.debug.ProfilerDebugView.end = function(_id) {
	var _item = luxe.debug.ProfilerDebugView.lists.get(_id);
	if(_item != null) _item.set(); else throw "Profile end called for " + _id + " but no start called";
};
luxe.debug.ProfilerDebugView.__super__ = luxe.debug.DebugView;
luxe.debug.ProfilerDebugView.prototype = $extend(luxe.debug.DebugView.prototype,{
	_setup: null
	,show: function() {
		var $it0 = luxe.debug.ProfilerDebugView.lists.iterator();
		while( $it0.hasNext() ) {
			var _item = $it0.next();
			if(!_item.hidden) _item.bar.show();
		}
		if(!this._setup) {
			luxe.debug.ProfilerDebugView.add_offset("core.render","batch.debug_batcher");
			this._setup = true;
		}
	}
	,hide: function() {
		var $it0 = luxe.debug.ProfilerDebugView.lists.iterator();
		while( $it0.hasNext() ) {
			var _item = $it0.next();
			_item.bar.hide();
		}
	}
	,__class__: luxe.debug.ProfilerDebugView
});
luxe.debug._ProfilerDebugView = {};
luxe.debug._ProfilerDebugView.ProfilerValue = function(_name,_bar) {
	this.accum = 0;
	this.count = 0;
	this.hidden = false;
	this.avg = 10;
	this.start = 0.0;
	this.name = _name;
	this.bar = _bar;
	this.history = [];
	this.offsets = [];
};
luxe.debug._ProfilerDebugView.ProfilerValue.__name__ = true;
luxe.debug._ProfilerDebugView.ProfilerValue.prototype = {
	offsets: null
	,bar: null
	,name: null
	,start: null
	,history: null
	,avg: null
	,hidden: null
	,count: null
	,accum: null
	,set: function() {
		var _t = Luxe.get_time() - this.start;
		var _g = 0;
		var _g1 = this.offsets;
		while(_g < _g1.length) {
			var _offset = _g1[_g];
			++_g;
			_t -= _offset.history[_offset.history.length - 1];
		}
		this.history.push(_t);
		if(this.history.length > this.avg) this.history.shift();
		this.count++;
		if(this.count == this.avg) {
			var __t = this.accum / this.avg;
			this.bar.set_value(__t);
			this.bar.set_ping(__t);
			this.accum = 0;
			this.count = 0;
		}
		this.accum += _t;
		if(this.bar.visible) this.bar.set_text(Std.string(luxe.utils.Maths.fixed(_t * 1000,4)));
	}
	,__class__: luxe.debug._ProfilerDebugView.ProfilerValue
};
luxe.debug._ProfilerDebugView.ProfilerBar = function(_name,_color) {
	this.visible = false;
	this.history = 33;
	this.max = 16.6;
	this.height2 = 8;
	this.height = 8;
	this.width = 128;
	this.color_red = new phoenix.Color().rgb(13369344);
	this.color_green = new phoenix.Color().rgb(2263108);
	this.color_normal = new phoenix.Color().rgb(15790320);
	this.max = 16.666666666666668;
	this.name = _name;
	this.segment = this.width / this.history;
	this.height2 = this.height * 2;
	this.text_item = new luxe.Text({ no_scene : true, name : "profiler.text." + _name, pos : new phoenix.Vector(0,0), color : _color, size : this.height * 1.8, depth : 999.3, text : "32ms", batcher : Luxe.debug.batcher});
	this.bg_geometry = Luxe.draw.box({ color : new phoenix.Color().rgb(592137), depth : 999.3, batcher : Luxe.debug.batcher, x : 0, y : 0, w : this.width, h : this.height});
	this.graphbg_geometry = Luxe.draw.box({ color : new phoenix.Color().rgb(2236962), depth : 999.3, batcher : Luxe.debug.batcher, x : 0, y : 0, w : this.width - this.segment, h : this.height * 2});
	this.bar_geometry = Luxe.draw.box({ color : _color, depth : 999.33, batcher : Luxe.debug.batcher, x : 1, y : 1, w : this.width - 2, h : this.height - 2});
	this.graph_geometry = new phoenix.geometry.Geometry({ color : _color, depth : 999.33, batcher : Luxe.debug.batcher});
	var _g1 = 0;
	var _g = this.history;
	while(_g1 < _g) {
		var i = _g1++;
		var _b = new phoenix.geometry.Vertex(new phoenix.Vector(this.segment * i,0),_color);
		this.graph_geometry.add(_b);
	}
	this.graph_geometry.set_primitive_type(3);
	this.hide();
};
luxe.debug._ProfilerDebugView.ProfilerBar.__name__ = true;
luxe.debug._ProfilerDebugView.ProfilerBar.prototype = {
	bar_geometry: null
	,bg_geometry: null
	,graphbg_geometry: null
	,graph_geometry: null
	,text_item: null
	,name: null
	,width: null
	,height: null
	,height2: null
	,max: null
	,history: null
	,visible: null
	,segment: null
	,color_red: null
	,color_green: null
	,color_normal: null
	,text: null
	,pos: null
	,value: null
	,ping: null
	,hide: function() {
		this.visible = false;
		this.bar_geometry.set_visible(false);
		this.bg_geometry.set_visible(false);
		this.graph_geometry.set_visible(false);
		this.graphbg_geometry.set_visible(false);
		this.text_item.set_visible(false);
	}
	,show: function() {
		this.visible = true;
		this.bar_geometry.set_visible(true);
		this.bg_geometry.set_visible(true);
		this.graph_geometry.set_visible(true);
		this.graphbg_geometry.set_visible(true);
		this.text_item.set_visible(true);
	}
	,set_ping: function(_v) {
		var _vv = luxe.utils.Maths.fixed(_v * 1000,4);
		var _p = _vv / this.max;
		var _g1 = 0;
		var _g = this.history;
		while(_g1 < _g) {
			var i = _g1++;
			var v = this.graph_geometry.vertices[i];
			if(i < this.history - 1) {
				var v1 = this.graph_geometry.vertices[i + 1];
				if(v1 != null) {
					v.pos.set_y(v1.pos.y);
					v.color = v1.color;
				}
			}
		}
		if(_p > 1) {
			_p = 1;
			this.graph_geometry.vertices[this.history - 1].color = this.color_red;
		} else if(_p < 0.2) this.graph_geometry.vertices[this.history - 1].color = this.color_green; else this.graph_geometry.vertices[this.history - 1].color = this.color_normal;
		if(_p < 0.001) _p = 0.001;
		this.graph_geometry.vertices[this.history - 1].pos.set_y(this.height2 * (1.0 - _p));
		return this.ping = _v;
	}
	,set_value: function(_v) {
		var _vv = luxe.utils.Maths.fixed(_v * 1000,4);
		var _p = _vv / this.max;
		if(_p > 1) {
			_p = 1;
			this.bar_geometry.set_color(this.color_red);
		} else if(_p < 0.15) this.bar_geometry.set_color(this.color_green); else this.bar_geometry.set_color(this.color_normal);
		if(_p < 0.005) _p = 0.005;
		var nx = (this.width - 2) * _p;
		this.bar_geometry.resize(new phoenix.Vector(nx,this.height - 2));
		return this.value = _v;
	}
	,set_pos: function(_p) {
		this.bg_geometry.transform.local.set_pos(_p);
		this.bar_geometry.transform.set_pos(new phoenix.Vector(_p.x + 1,_p.y + 1));
		this.text_item.set_pos(new phoenix.Vector(_p.x + this.width * 2 + 10,_p.y - 6));
		this.graphbg_geometry.transform.set_pos(new phoenix.Vector(_p.x + this.width + 2,_p.y - 4));
		this.graph_geometry.transform.local.set_pos(this.graphbg_geometry.transform.local.pos);
		return this.pos = _p;
	}
	,set_text: function(_t) {
		this.text_item.set_text(this.name + " | " + _t + "ms");
		return this.text = _t;
	}
	,__class__: luxe.debug._ProfilerDebugView.ProfilerBar
	,__properties__: {set_ping:"set_ping",set_value:"set_value",set_pos:"set_pos",set_text:"set_text"}
};
luxe.debug.StatsDebugView = function() {
	this.hide_debug = true;
	this.font_size = 15;
	this.debug_geometry_count = 13;
	this.debug_draw_call_count = 3;
	luxe.debug.DebugView.call(this);
	this.name = "Statistics";
	this._last_render_stats = { batchers : 0, geometry_count : 0, dynamic_batched_count : 0, static_batched_count : 0, visible_count : 0, draw_calls : 0, vert_count : 0, group_count : 0};
	this._render_stats = { batchers : 0, geometry_count : 0, dynamic_batched_count : 0, static_batched_count : 0, visible_count : 0, draw_calls : 0, vert_count : 0, group_count : 0};
};
luxe.debug.StatsDebugView.__name__ = true;
luxe.debug.StatsDebugView.__super__ = luxe.debug.DebugView;
luxe.debug.StatsDebugView.prototype = $extend(luxe.debug.DebugView.prototype,{
	_last_render_stats: null
	,_render_stats: null
	,debug_draw_call_count: null
	,debug_geometry_count: null
	,font_size: null
	,render_stats_text: null
	,resource_stats_text: null
	,resource_list_text: null
	,get_resource_stats_string: function() {
		return Std.string(Luxe.resources.stats);
	}
	,get_render_stats_string: function() {
		return "Renderer Statistics\n" + "\tbatcher count : " + this._render_stats.batchers + "\n" + "\ttotal geometry : " + this._render_stats.geometry_count + "\n" + "\tvisible geometry : " + this._render_stats.visible_count + "\n" + "\tdynamic batch count : " + this._render_stats.dynamic_batched_count + "\n" + "\tstatic batch count : " + this._render_stats.static_batched_count + "\n" + "\ttotal draw calls : " + this._render_stats.draw_calls + "\n" + "\ttotal vert count : " + this._render_stats.vert_count;
	}
	,create: function() {
		var debug = Luxe.debug;
		this.render_stats_text = new luxe.Text({ depth : 999.3, no_scene : true, color : new phoenix.Color(0,0,0,1).rgb(16121979), pos : new phoenix.Vector(debug.padding.x * 2,debug.padding.y * 3), font : Luxe.renderer.font, text : this.get_render_stats_string(), size : this.font_size, batcher : debug.batcher, visible : false});
		this.resource_stats_text = new luxe.Text({ depth : 999.3, no_scene : true, color : new phoenix.Color(0,0,0,1).rgb(16121979), pos : new phoenix.Vector(debug.padding.x * 2,debug.padding.y * 7.5), font : Luxe.renderer.font, text : this.get_resource_stats_string(), size : this.font_size, batcher : debug.batcher, visible : false});
		this.resource_list_text = new luxe.Text({ depth : 999.3, no_scene : true, color : new phoenix.Color(0,0,0,1).rgb(16121979), pos : new phoenix.Vector(debug.padding.x * 7,debug.padding.y * 3), font : Luxe.renderer.font, text : "", size : this.font_size * 0.8, batcher : debug.batcher, visible : false});
		this.resource_list_text.set_locked(true);
		this.resource_stats_text.set_locked(true);
	}
	,refresh: function() {
		var texture_lists = "";
		var shader_lists = "";
		var font_lists = "";
		var _g = 0;
		var _g1 = Luxe.resources.resourcelist;
		while(_g < _g1.length) {
			var res = _g1[_g];
			++_g;
			var _g2 = res.type;
			switch(_g2[1]) {
			case 4:
				var t = res;
				texture_lists += "\t" + t.id + "    (" + t.width_actual + "x" + t.height_actual + "  " + t.estimated_memory() + " )\n";
				break;
			case 7:
				font_lists += "\t" + res.id + "\n";
				break;
			case 8:
				shader_lists += "\t" + res.id + "\n";
				break;
			default:
			}
		}
		var lists = "Fonts\n";
		lists += font_lists;
		lists += "Shader\n";
		lists += shader_lists;
		lists += "Textures\n";
		lists += texture_lists;
		this.resource_list_text.set_text(lists);
		if(this.resource_list_text.geometry != null) this.resource_list_text.geometry.set_dirty(true);
	}
	,process: function() {
		if(!this.visible) return;
		var dirty = false;
		this.update_render_stats();
		if(this._last_render_stats.batchers != this._render_stats.batchers) {
			dirty = true;
			this._last_render_stats.batchers = this._render_stats.batchers;
		}
		if(this._last_render_stats.geometry_count != this._render_stats.geometry_count) {
			dirty = true;
			this._last_render_stats.geometry_count = this._render_stats.geometry_count;
		}
		if(this._last_render_stats.dynamic_batched_count != this._render_stats.dynamic_batched_count) {
			dirty = true;
			this._last_render_stats.dynamic_batched_count = this._render_stats.dynamic_batched_count;
		}
		if(this._last_render_stats.static_batched_count != this._render_stats.static_batched_count) {
			dirty = true;
			this._last_render_stats.static_batched_count = this._render_stats.static_batched_count;
		}
		if(this._last_render_stats.visible_count != this._render_stats.visible_count) {
			dirty = true;
			this._last_render_stats.visible_count = this._render_stats.visible_count;
		}
		if(this._last_render_stats.draw_calls != this._render_stats.draw_calls) {
			dirty = true;
			this._last_render_stats.draw_calls = this._render_stats.draw_calls;
		}
		if(this._last_render_stats.group_count != this._render_stats.group_count) {
			dirty = true;
			this._last_render_stats.group_count = this._render_stats.group_count;
		}
		if(this._last_render_stats.vert_count != this._render_stats.vert_count) {
			dirty = true;
			this._last_render_stats.vert_count = this._render_stats.vert_count;
		}
		if(dirty) this.refresh_render_stats();
	}
	,onkeydown: function(e) {
		if(e.keycode == snow.input.Keycodes.key_2 && this.visible) this.toggle_debug_stats();
	}
	,show: function() {
		luxe.debug.DebugView.prototype.show.call(this);
		this.refresh();
		this.render_stats_text.set_visible(true);
		this.resource_stats_text.set_visible(true);
		this.resource_list_text.set_visible(true);
	}
	,hide: function() {
		luxe.debug.DebugView.prototype.hide.call(this);
		this.render_stats_text.set_visible(false);
		this.resource_stats_text.set_visible(false);
		this.resource_list_text.set_visible(false);
	}
	,refresh_render_stats: function() {
		if(!this.visible) return;
		this.render_stats_text.set_text(this.get_render_stats_string());
		this.resource_stats_text.set_text(this.get_resource_stats_string());
		this.resource_stats_text.set_locked(true);
		this.render_stats_text.set_locked(true);
		if(this.render_stats_text.geometry != null) {
			this.resource_stats_text.geometry.set_dirty(true);
			this.render_stats_text.geometry.set_dirty(true);
		}
	}
	,hide_debug: null
	,toggle_debug_stats: function() {
		this.hide_debug = !this.hide_debug;
	}
	,update_render_stats: function() {
		this.debug_geometry_count = Luxe.debug.batcher.geometry.size();
		this.debug_draw_call_count = Luxe.debug.batcher.draw_calls;
		this._render_stats.batchers = Luxe.renderer.stats.batchers;
		this._render_stats.geometry_count = Luxe.renderer.stats.geometry_count;
		this._render_stats.visible_count = Luxe.renderer.stats.visible_count;
		this._render_stats.dynamic_batched_count = Luxe.renderer.stats.dynamic_batched_count;
		this._render_stats.static_batched_count = Luxe.renderer.stats.static_batched_count;
		this._render_stats.draw_calls = Luxe.renderer.stats.draw_calls;
		this._render_stats.vert_count = Luxe.renderer.stats.vert_count;
		if(this.hide_debug) {
			this._render_stats.batchers = this._render_stats.batchers - 1;
			this._render_stats.geometry_count = this._render_stats.geometry_count - this.debug_geometry_count;
			this._render_stats.visible_count = this._render_stats.visible_count - Luxe.debug.batcher.visible_count;
			this._render_stats.dynamic_batched_count = this._render_stats.dynamic_batched_count - Luxe.debug.batcher.dynamic_batched_count;
			this._render_stats.static_batched_count = this._render_stats.static_batched_count - Luxe.debug.batcher.static_batched_count;
			this._render_stats.draw_calls -= this.debug_draw_call_count;
			this._render_stats.vert_count -= Luxe.debug.batcher.vert_count;
		}
	}
	,__class__: luxe.debug.StatsDebugView
});
luxe.debug.TraceDebugView = function() {
	this._last_logged_length = 0;
	this.max_lines = 35;
	luxe.debug.DebugView.call(this);
	this.name = "Log";
	Luxe.debug.add_trace_listener("TraceDebugView",$bind(this,this.on_trace));
	this.logged = new Array();
	this.add_line("luxe version " + Luxe.build + " Debug Log");
};
luxe.debug.TraceDebugView.__name__ = true;
luxe.debug.TraceDebugView.__super__ = luxe.debug.DebugView;
luxe.debug.TraceDebugView.prototype = $extend(luxe.debug.DebugView.prototype,{
	logged: null
	,lines: null
	,max_lines: null
	,on_trace: function(v,inf) {
		this.add_line(inf.fileName + ":" + inf.lineNumber + " " + Std.string(v));
	}
	,create: function() {
		var debug = Luxe.debug;
		this.lines = new luxe.Text({ name : "debug.log.text", no_scene : true, depth : 999.3, color : new phoenix.Color().rgb(8947848), bounds : new phoenix.Rectangle(debug.padding.x + 20,debug.padding.y + 40,Luxe.get_screen().w - debug.padding.x * 2 - 20,Luxe.get_screen().h - debug.padding.y * 2 - 40), font : Luxe.renderer.font, text : "", align_vertical : phoenix.TextAlign.bottom, size : 12, batcher : debug.batcher, visible : false});
		if(this.lines.geometry != null) this.lines.geometry.set_locked(true);
	}
	,add_line: function(_t) {
		if(this.logged == null) return;
		this.logged.push(_t);
		if(!this.visible) return;
		this.refresh_lines();
	}
	,_last_logged_length: null
	,refresh_lines: function() {
		if(this._last_logged_length == this.logged.length) return;
		var _final = "";
		if(this.logged.length <= this.max_lines) {
			var _g = 0;
			var _g1 = this.logged;
			while(_g < _g1.length) {
				var _line = _g1[_g];
				++_g;
				_final += _line + "\n";
			}
		} else {
			var _start = this.logged.length - this.max_lines;
			var _total = this.logged.length;
			var _g11 = _start;
			var _g2 = this.logged.length;
			while(_g11 < _g2) {
				var i = _g11++;
				var _line1 = this.logged[i];
				_final += _line1 + "\n";
			}
		}
		this.lines.set_text(_final);
		if(this.lines.geometry != null) {
			this.lines.geometry.set_locked(true);
			this.lines.geometry.set_dirty(true);
		}
		this._last_logged_length = this.logged.length;
	}
	,refresh: function() {
	}
	,process: function() {
	}
	,show: function() {
		luxe.debug.DebugView.prototype.show.call(this);
		this.refresh_lines();
		this.lines.set_visible(true);
	}
	,hide: function() {
		luxe.debug.DebugView.prototype.hide.call(this);
		this.lines.set_visible(false);
	}
	,__class__: luxe.debug.TraceDebugView
});
luxe.macros = {};
luxe.macros.BuildVersion = function() { };
luxe.macros.BuildVersion.__name__ = true;
luxe.macros.BuildVersion.try_git = function(root) {
	return "";
};
luxe.options = {};
luxe.options._DrawOptions = {};
luxe.options._DrawOptions.DrawOptions = function() { };
luxe.options._DrawOptions.DrawOptions.__name__ = true;
luxe.resource = {};
luxe.resource.ResourceType = { __ename__ : true, __constructs__ : ["unknown","text","json","data","texture","sound","render_texture","font","shader"] };
luxe.resource.ResourceType.unknown = ["unknown",0];
luxe.resource.ResourceType.unknown.toString = $estr;
luxe.resource.ResourceType.unknown.__enum__ = luxe.resource.ResourceType;
luxe.resource.ResourceType.text = ["text",1];
luxe.resource.ResourceType.text.toString = $estr;
luxe.resource.ResourceType.text.__enum__ = luxe.resource.ResourceType;
luxe.resource.ResourceType.json = ["json",2];
luxe.resource.ResourceType.json.toString = $estr;
luxe.resource.ResourceType.json.__enum__ = luxe.resource.ResourceType;
luxe.resource.ResourceType.data = ["data",3];
luxe.resource.ResourceType.data.toString = $estr;
luxe.resource.ResourceType.data.__enum__ = luxe.resource.ResourceType;
luxe.resource.ResourceType.texture = ["texture",4];
luxe.resource.ResourceType.texture.toString = $estr;
luxe.resource.ResourceType.texture.__enum__ = luxe.resource.ResourceType;
luxe.resource.ResourceType.sound = ["sound",5];
luxe.resource.ResourceType.sound.toString = $estr;
luxe.resource.ResourceType.sound.__enum__ = luxe.resource.ResourceType;
luxe.resource.ResourceType.render_texture = ["render_texture",6];
luxe.resource.ResourceType.render_texture.toString = $estr;
luxe.resource.ResourceType.render_texture.__enum__ = luxe.resource.ResourceType;
luxe.resource.ResourceType.font = ["font",7];
luxe.resource.ResourceType.font.toString = $estr;
luxe.resource.ResourceType.font.__enum__ = luxe.resource.ResourceType;
luxe.resource.ResourceType.shader = ["shader",8];
luxe.resource.ResourceType.shader.toString = $estr;
luxe.resource.ResourceType.shader.__enum__ = luxe.resource.ResourceType;
luxe.resource.Resource = function(_manager,_type,_load_time) {
	this.dropped = false;
	this.time_created = 0;
	this.time_to_load = 0;
	this.persistent = false;
	if(_manager == null) this.manager = Luxe.resources; else this.manager = _manager;
	this.type = _type;
	this.time_to_load = _load_time;
	this.time_created = Luxe.get_time();
	this.manager.add(this);
};
luxe.resource.Resource.__name__ = true;
luxe.resource.Resource.prototype = {
	manager: null
	,type: null
	,id: null
	,persistent: null
	,time_to_load: null
	,time_created: null
	,dropped: null
	,drop: function() {
		if(!this.dropped) {
			this.dropped = true;
			this.manager.remove(this);
		}
	}
	,__class__: luxe.resource.Resource
};
luxe.resource.TextResource = function(_id,_text,_manager) {
	this.id = _id;
	luxe.resource.Resource.call(this,_manager,luxe.resource.ResourceType.text);
	this.text = _text;
};
luxe.resource.TextResource.__name__ = true;
luxe.resource.TextResource.__super__ = luxe.resource.Resource;
luxe.resource.TextResource.prototype = $extend(luxe.resource.Resource.prototype,{
	text: null
	,__class__: luxe.resource.TextResource
});
luxe.resource.JSONResource = function(_id,_json,_manager) {
	this.id = _id;
	luxe.resource.Resource.call(this,_manager,luxe.resource.ResourceType.json);
	this.json = _json;
};
luxe.resource.JSONResource.__name__ = true;
luxe.resource.JSONResource.__super__ = luxe.resource.Resource;
luxe.resource.JSONResource.prototype = $extend(luxe.resource.Resource.prototype,{
	json: null
	,__class__: luxe.resource.JSONResource
});
luxe.resource.DataResource = function(_id,_data,_manager) {
	this.id = _id;
	luxe.resource.Resource.call(this,_manager,luxe.resource.ResourceType.data);
	this.data = _data;
};
luxe.resource.DataResource.__name__ = true;
luxe.resource.DataResource.__super__ = luxe.resource.Resource;
luxe.resource.DataResource.prototype = $extend(luxe.resource.Resource.prototype,{
	data: null
	,__class__: luxe.resource.DataResource
});
luxe.resource.SoundResource = function(_id,_name,_manager) {
	this.id = _id;
	luxe.resource.Resource.call(this,_manager,luxe.resource.ResourceType.sound);
	this.name = _name;
};
luxe.resource.SoundResource.__name__ = true;
luxe.resource.SoundResource.__super__ = luxe.resource.Resource;
luxe.resource.SoundResource.prototype = $extend(luxe.resource.Resource.prototype,{
	name: null
	,__class__: luxe.resource.SoundResource
});
luxe.resource.ResourceStats = function() {
	this.unknown = 0;
	this.sounds = 0;
	this.datas = 0;
	this.jsons = 0;
	this.texts = 0;
	this.shaders = 0;
	this.render_textures = 0;
	this.textures = 0;
	this.fonts = 0;
	this.resources = 0;
};
luxe.resource.ResourceStats.__name__ = true;
luxe.resource.ResourceStats.prototype = {
	resources: null
	,fonts: null
	,textures: null
	,render_textures: null
	,shaders: null
	,texts: null
	,jsons: null
	,datas: null
	,sounds: null
	,unknown: null
	,toString: function() {
		return "Resource Statistics\n" + "\ttotal resources : " + this.resources + "\n" + "\ttextures : " + this.textures + " \n" + "" + "\trender textures : " + this.render_textures + " \n" + "\tfonts : " + this.fonts + "\n" + "\tshaders : " + this.shaders + "\n" + "\tsounds : " + this.sounds + "\n" + "\ttext : " + this.texts + "\n" + "\tjson : " + this.jsons + "\n" + "\tdata : " + this.datas + "\n" + "\tunknown : " + this.unknown;
	}
	,reset: function() {
		this.resources = 0;
		this.fonts = 0;
		this.textures = 0;
		this.render_textures = 0;
		this.shaders = 0;
		this.texts = 0;
		this.jsons = 0;
		this.datas = 0;
		this.sounds = 0;
		this.unknown = 0;
	}
	,__class__: luxe.resource.ResourceStats
};
luxe.resource.ResourceManager = function() {
	this.resourcelist = new Array();
	this.textures = new haxe.ds.StringMap();
	this.render_textures = new haxe.ds.StringMap();
	this.fonts = new haxe.ds.StringMap();
	this.shaders = new haxe.ds.StringMap();
	this.sounds = new haxe.ds.StringMap();
	this.data = new haxe.ds.StringMap();
	this.text = new haxe.ds.StringMap();
	this.json = new haxe.ds.StringMap();
	this.stats = new luxe.resource.ResourceStats();
};
luxe.resource.ResourceManager.__name__ = true;
luxe.resource.ResourceManager.prototype = {
	resourcelist: null
	,render_textures: null
	,textures: null
	,shaders: null
	,fonts: null
	,data: null
	,text: null
	,json: null
	,sounds: null
	,stats: null
	,add: function(res) {
		this.resourcelist.push(res);
		var _g = res.type;
		switch(_g[1]) {
		case 4:
			this.stats.textures++;
			break;
		case 6:
			this.stats.render_textures++;
			break;
		case 7:
			this.stats.fonts++;
			break;
		case 8:
			this.stats.shaders++;
			break;
		case 5:
			this.stats.sounds++;
			break;
		case 1:
			this.stats.texts++;
			break;
		case 2:
			this.stats.jsons++;
			break;
		case 3:
			this.stats.datas++;
			break;
		case 0:
			this.stats.unknown++;
			break;
		}
		this.stats.resources++;
	}
	,remove: function(res) {
		HxOverrides.remove(this.resourcelist,res);
		this.uncache(res);
		var _g = res.type;
		switch(_g[1]) {
		case 4:
			this.stats.textures--;
			break;
		case 6:
			this.stats.render_textures--;
			break;
		case 7:
			this.stats.fonts--;
			break;
		case 8:
			this.stats.shaders--;
			break;
		case 5:
			this.stats.sounds--;
			break;
		case 1:
			this.stats.texts--;
			break;
		case 2:
			this.stats.jsons--;
			break;
		case 3:
			this.stats.datas--;
			break;
		case 0:
			this.stats.unknown--;
			break;
		}
		this.stats.resources--;
	}
	,uncache: function(res) {
		var _g = res.type;
		switch(_g[1]) {
		case 4:
			this.textures.remove(res.id);
			break;
		case 6:
			this.render_textures.remove(res.id);
			break;
		case 7:
			this.fonts.remove(res.id);
			break;
		case 8:
			this.shaders.remove(res.id);
			break;
		case 5:
			this.sounds.remove(res.id);
			break;
		case 3:
			this.data.remove(res.id);
			break;
		case 1:
			this.text.remove(res.id);
			break;
		case 2:
			this.json.remove(res.id);
			break;
		case 0:
			break;
		}
	}
	,cache: function(res) {
		var _g = res.type;
		switch(_g[1]) {
		case 4:
			this.textures.set(res.id,res);
			break;
		case 6:
			this.render_textures.set(res.id,res);
			break;
		case 7:
			this.fonts.set(res.id,res);
			break;
		case 8:
			this.shaders.set(res.id,res);
			break;
		case 5:
			this.sounds.set(res.id,res);
			break;
		case 1:
			this.text.set(res.id,res);
			break;
		case 2:
			this.json.set(res.id,res);
			break;
		case 3:
			this.data.set(res.id,res);
			break;
		case 0:
			break;
		}
	}
	,find_render_texture: function(_name) {
		return this.render_textures.get(_name);
	}
	,find_texture: function(_name) {
		return this.textures.get(_name);
	}
	,find_shader: function(_name) {
		return this.shaders.get(_name);
	}
	,find_font: function(_name) {
		return this.fonts.get(_name);
	}
	,find_sound: function(_name) {
		return this.sounds.get(_name);
	}
	,find_text: function(_name) {
		return this.text.get(_name);
	}
	,find_json: function(_name) {
		return this.json.get(_name);
	}
	,find_data: function(_name) {
		return this.data.get(_name);
	}
	,clear: function(and_persistent) {
		if(and_persistent == null) and_persistent = false;
		var keep = [];
		var _g = 0;
		var _g1 = this.resourcelist;
		while(_g < _g1.length) {
			var res = _g1[_g];
			++_g;
			if(!res.persistent || and_persistent) res.drop(); else keep.push(res);
		}
		this.resourcelist.splice(0,this.resourcelist.length);
		this.resourcelist = new Array();
		this.stats.reset();
		var _g2 = 0;
		while(_g2 < keep.length) {
			var res1 = keep[_g2];
			++_g2;
			this.add(res1);
		}
		keep = null;
	}
	,find: function(id) {
		var _g = 0;
		var _g1 = this.resourcelist;
		while(_g < _g1.length) {
			var resource = _g1[_g];
			++_g;
			if(resource.id == id) return resource;
		}
		return null;
	}
	,__class__: luxe.resource.ResourceManager
};
luxe.structural = {};
luxe.structural.BalancedBST = function(compare_function) {
	this.compare = compare_function;
	this._array = [];
};
luxe.structural.BalancedBST.__name__ = true;
luxe.structural.BalancedBST.prototype = {
	root: null
	,compare: null
	,empty: null
	,_array: null
	,size: function() {
		return this.node_count(this.root);
	}
	,depth: function() {
		return this.node_depth(this.root);
	}
	,insert: function(_key,_value) {
		this.root = this.node_insert(this.root,_key,_value);
		this.root.color = false;
		this._array = null;
		this._array = this.toArray();
	}
	,contains: function(_key) {
		return this.find(_key) != null;
	}
	,find: function(_key) {
		return this.node_find(this.root,_key);
	}
	,rank: function(_key) {
		return this.node_rank(_key,this.root);
	}
	,select: function(_rank) {
		var _node = this.node_select(this.root,_rank);
		if(_node != null) return _node.key; else return null;
	}
	,smallest: function() {
		var _node = this.node_smallest(this.root);
		if(_node != null) return _node.key; else return null;
	}
	,largest: function() {
		var _node = this.node_largest(this.root);
		if(_node != null) return _node.key; else return null;
	}
	,remove: function(_key) {
		if(!this.is_red(this.root.left) && !this.is_red(this.root.right)) this.root.color = true;
		if(!this.contains(_key)) return false;
		this.root = this.node_remove(this.root,_key);
		if(this.root != null) this.root.color = false;
		this._array = null;
		this._array = this.toArray();
		return true;
	}
	,remove_smallest: function() {
		if(!this.is_red(this.root.left) && !this.is_red(this.root.right)) this.root.color = true;
		this.root = this.node_remove_smallest(this.root);
		if(this.root != null) this.root.color = false;
		this._array = null;
		this._array = this.toArray();
		return true;
	}
	,remove_largest: function() {
		if(!this.is_red(this.root.left) && !this.is_red(this.root.right)) this.root.color = true;
		this.root = this.node_remove_largest(this.root);
		if(this.root != null) this.root.color = false;
		this._array = null;
		this._array = this.toArray();
		return true;
	}
	,floor: function(_key) {
		var _node = this.node_floor(this.root,_key);
		if(_node == null) return null;
		return _node.key;
	}
	,ceil: function(_key) {
		var _node = this.node_ceil(this.root,_key);
		if(_node == null) return null;
		return _node.key;
	}
	,toArray: function() {
		var a = new Array();
		this.traverse_node(this.root,luxe.structural.BalancedBSTTraverseMethod.order_retain,function(_node) {
			a.push(_node.value);
		});
		return a;
	}
	,keys: function() {
		var a = new Array();
		this.traverse_node(this.root,luxe.structural.BalancedBSTTraverseMethod.order_retain,function(_node) {
			a.push(_node.key);
		});
		return a;
	}
	,iterator: function() {
		return HxOverrides.iter(this._array);
	}
	,traverse_node: function(_node,_method,_on_traverse) {
		if(_node != null) switch(_method[1]) {
		case 0:
			_on_traverse(_node);
			this.traverse_node(_node.left,_method,_on_traverse);
			this.traverse_node(_node.right,_method,_on_traverse);
			break;
		case 1:
			this.traverse_node(_node.left,_method,_on_traverse);
			_on_traverse(_node);
			this.traverse_node(_node.right,_method,_on_traverse);
			break;
		case 2:
			this.traverse_node(_node.left,_method,_on_traverse);
			this.traverse_node(_node.right,_method,_on_traverse);
			_on_traverse(_node);
			break;
		}
	}
	,get_empty: function() {
		return this.root == null;
	}
	,node_depth: function(_node) {
		if(_node == null) return 0;
		var _n_depth = Math.max(this.node_depth(_node.left),this.node_depth(_node.right));
		return 1 + (_n_depth | 0);
	}
	,node_count: function(_node) {
		if(_node == null) return 0; else return _node.nodecount;
	}
	,node_insert: function(_node,_key,_value) {
		if(_node == null) return new luxe.structural.BalancedBSTNode(_key,_value,1,true);
		var comparison = this.compare(_key,_node.key);
		if(comparison < 0) _node.left = this.node_insert(_node.left,_key,_value); else if(comparison > 0) _node.right = this.node_insert(_node.right,_key,_value); else _node.value = _value;
		if(this.is_red(_node.right) && !this.is_red(_node.left)) _node = this.rotate_left(_node);
		if(this.is_red(_node.left) && this.is_red(_node.left.left)) _node = this.rotate_right(_node);
		if(this.is_red(_node.left) && this.is_red(_node.right)) this.swap_color(_node);
		this.node_update_count(_node);
		return _node;
	}
	,node_update_count: function(_node) {
		_node.nodecount = this.node_count(_node.left) + this.node_count(_node.right) + 1;
		return _node;
	}
	,node_find: function(_node,_key) {
		if(_node == null) return null;
		var comparison = this.compare(_key,_node.key);
		if(comparison < 0) return this.node_find(_node.left,_key); else if(comparison > 0) return this.node_find(_node.right,_key); else return _node.value;
	}
	,node_rank: function(_key,_node) {
		if(_node == null) return 0;
		var comparison = this.compare(_key,_node.key);
		if(comparison < 0) return this.node_rank(_key,_node.left); else if(comparison > 0) return 1 + this.node_count(_node.left) + this.node_rank(_key,_node.right); else return this.node_count(_node.left);
	}
	,node_select: function(_node,_rank) {
		if(_node == null) return null;
		var _r = this.node_count(_node.left);
		if(_r > _rank) return this.node_select(_node.left,_rank); else if(_r < _rank) return this.node_select(_node.right,_rank - _r - 1); else return _node;
	}
	,node_smallest: function(_node) {
		if(_node.left == null) return _node;
		return this.node_smallest(_node.left);
	}
	,node_largest: function(_node) {
		if(_node.right == null) return _node; else return this.node_largest(_node.right);
	}
	,node_floor: function(_node,_key) {
		if(_node == null) return null;
		var comparison = this.compare(_key,_node.key);
		if(comparison == 0) return _node; else if(comparison < 0) return this.node_floor(_node.left,_key);
		var _n = this.node_floor(_node.right,_key);
		if(_n != null) return _n; else return _node;
	}
	,node_ceil: function(_node,_key) {
		if(_node == null) return null;
		var comparison = this.compare(_key,_node.key);
		if(comparison == 0) return _node; else if(comparison < 0) {
			var _n = this.node_ceil(_node.left,_key);
			if(_n != null) return _n; else return _node;
		}
		return this.node_ceil(_node.right,_key);
	}
	,node_remove_smallest: function(_node) {
		if(_node.left == null) return null;
		if(!this.is_red(_node.left) && !this.is_red(_node.left.left)) _node = this.move_red_left(_node);
		_node.left = this.node_remove_smallest(_node.left);
		this.node_update_count(_node);
		return this.balance(_node);
	}
	,node_remove_largest: function(_node) {
		if(this.is_red(_node.left)) _node = this.rotate_right(_node);
		if(_node.right == null) return null;
		if(!this.is_red(_node.right) && !this.is_red(_node.right.left)) _node = this.move_red_right(_node);
		_node.right = this.node_remove_largest(_node.right);
		this.node_update_count(_node);
		return this.balance(_node);
	}
	,node_remove: function(_node,_key) {
		var comparison = this.compare(_key,_node.key);
		if(comparison < 0) {
			if(!this.is_red(_node.left) && !this.is_red(_node.left.left)) _node = this.move_red_left(_node);
			_node.left = this.node_remove(_node.left,_key);
		} else {
			if(this.is_red(_node.left)) _node = this.rotate_right(_node);
			var comparison1 = this.compare(_key,_node.key);
			if(comparison1 == 0 && _node.right == null) return null;
			if(!this.is_red(_node.right) && !this.is_red(_node.right.left)) _node = this.move_red_right(_node);
			var comparison2 = this.compare(_key,_node.key);
			if(comparison2 == 0) {
				var _n = this.node_smallest(_node.right);
				_node.key = _n.key;
				_node.value = _n.value;
				_node.right = this.node_remove_smallest(_node.right);
			} else _node.right = this.node_remove(_node.right,_key);
		}
		return this.balance(_node);
	}
	,is_red: function(_node) {
		if(_node == null) return false;
		return _node.color == true;
	}
	,rotate_left: function(_node) {
		var _n = _node.right;
		_n.color = _node.color;
		_node.color = true;
		_node.right = _n.left;
		_n.left = _node;
		_n.nodecount = _node.nodecount;
		this.node_update_count(_node);
		return _n;
	}
	,rotate_right: function(_node) {
		var _n = _node.left;
		_n.color = _node.color;
		_node.color = true;
		_node.left = _n.right;
		_n.right = _node;
		_n.nodecount = _node.nodecount;
		this.node_update_count(_node);
		return _n;
	}
	,swap_color: function(_node) {
		_node.color = !_node.color;
		_node.left.color = !_node.left.color;
		_node.right.color = !_node.right.color;
	}
	,move_red_left: function(_node) {
		this.swap_color(_node);
		if(this.is_red(_node.right.left)) {
			_node.right = this.rotate_right(_node.right);
			_node = this.rotate_left(_node);
		}
		return _node;
	}
	,move_red_right: function(_node) {
		this.swap_color(_node);
		if(this.is_red(_node.left.left)) _node = this.rotate_right(_node);
		return _node;
	}
	,balance: function(_node) {
		if(this.is_red(_node.right)) _node = this.rotate_left(_node);
		if(this.is_red(_node.left) && this.is_red(_node.left.left)) _node = this.rotate_right(_node);
		if(this.is_red(_node.left) && this.is_red(_node.right)) this.swap_color(_node);
		this.node_update_count(_node);
		return _node;
	}
	,__class__: luxe.structural.BalancedBST
	,__properties__: {get_empty:"get_empty"}
};
luxe.structural._BalancedBST = {};
luxe.structural._BalancedBST.NodeColor = function() { };
luxe.structural._BalancedBST.NodeColor.__name__ = true;
luxe.structural.BalancedBSTNode = function(_key,_value,_node_count,_color) {
	this.left = null;
	this.right = null;
	this.key = _key;
	this.value = _value;
	this.nodecount = _node_count;
	this.color = _color;
};
luxe.structural.BalancedBSTNode.__name__ = true;
luxe.structural.BalancedBSTNode.prototype = {
	left: null
	,right: null
	,nodecount: null
	,color: null
	,key: null
	,value: null
	,__class__: luxe.structural.BalancedBSTNode
};
luxe.structural.BalancedBSTTraverseMethod = { __ename__ : true, __constructs__ : ["order_pre","order_retain","order_post"] };
luxe.structural.BalancedBSTTraverseMethod.order_pre = ["order_pre",0];
luxe.structural.BalancedBSTTraverseMethod.order_pre.toString = $estr;
luxe.structural.BalancedBSTTraverseMethod.order_pre.__enum__ = luxe.structural.BalancedBSTTraverseMethod;
luxe.structural.BalancedBSTTraverseMethod.order_retain = ["order_retain",1];
luxe.structural.BalancedBSTTraverseMethod.order_retain.toString = $estr;
luxe.structural.BalancedBSTTraverseMethod.order_retain.__enum__ = luxe.structural.BalancedBSTTraverseMethod;
luxe.structural.BalancedBSTTraverseMethod.order_post = ["order_post",2];
luxe.structural.BalancedBSTTraverseMethod.order_post.toString = $estr;
luxe.structural.BalancedBSTTraverseMethod.order_post.__enum__ = luxe.structural.BalancedBSTTraverseMethod;
luxe.structural.BalancedBSTNode_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry = function(_key,_value,_node_count,_color) {
	this.left = null;
	this.right = null;
	this.key = _key;
	this.value = _value;
	this.nodecount = _node_count;
	this.color = _color;
};
luxe.structural.BalancedBSTNode_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry.__name__ = true;
luxe.structural.BalancedBSTNode_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry.prototype = {
	left: null
	,right: null
	,nodecount: null
	,color: null
	,key: null
	,value: null
	,__class__: luxe.structural.BalancedBSTNode_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry
};
luxe.structural.BalancedBST_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry = function(compare_function) {
	this.compare = compare_function;
	this._array = [];
};
luxe.structural.BalancedBST_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry.__name__ = true;
luxe.structural.BalancedBST_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry.prototype = {
	root: null
	,compare: null
	,empty: null
	,_array: null
	,size: function() {
		return this.node_count(this.root);
	}
	,depth: function() {
		return this.node_depth(this.root);
	}
	,insert: function(_key,_value) {
		this.root = this.node_insert(this.root,_key,_value);
		this.root.color = false;
		this._array = null;
		this._array = this.toArray();
	}
	,contains: function(_key) {
		return this.find(_key) != null;
	}
	,find: function(_key) {
		return this.node_find(this.root,_key);
	}
	,rank: function(_key) {
		return this.node_rank(_key,this.root);
	}
	,select: function(_rank) {
		var _node = this.node_select(this.root,_rank);
		if(_node != null) return _node.key; else return null;
	}
	,smallest: function() {
		var _node = this.node_smallest(this.root);
		if(_node != null) return _node.key; else return null;
	}
	,largest: function() {
		var _node = this.node_largest(this.root);
		if(_node != null) return _node.key; else return null;
	}
	,remove: function(_key) {
		if(!this.is_red(this.root.left) && !this.is_red(this.root.right)) this.root.color = true;
		if(!this.contains(_key)) return false;
		this.root = this.node_remove(this.root,_key);
		if(this.root != null) this.root.color = false;
		this._array = null;
		this._array = this.toArray();
		return true;
	}
	,remove_smallest: function() {
		if(!this.is_red(this.root.left) && !this.is_red(this.root.right)) this.root.color = true;
		this.root = this.node_remove_smallest(this.root);
		if(this.root != null) this.root.color = false;
		this._array = null;
		this._array = this.toArray();
		return true;
	}
	,remove_largest: function() {
		if(!this.is_red(this.root.left) && !this.is_red(this.root.right)) this.root.color = true;
		this.root = this.node_remove_largest(this.root);
		if(this.root != null) this.root.color = false;
		this._array = null;
		this._array = this.toArray();
		return true;
	}
	,floor: function(_key) {
		var _node = this.node_floor(this.root,_key);
		if(_node == null) return null;
		return _node.key;
	}
	,ceil: function(_key) {
		var _node = this.node_ceil(this.root,_key);
		if(_node == null) return null;
		return _node.key;
	}
	,toArray: function() {
		var a = new Array();
		this.traverse_node(this.root,luxe.structural.BalancedBSTTraverseMethod.order_retain,function(_node) {
			a.push(_node.value);
		});
		return a;
	}
	,keys: function() {
		var a = new Array();
		this.traverse_node(this.root,luxe.structural.BalancedBSTTraverseMethod.order_retain,function(_node) {
			a.push(_node.key);
		});
		return a;
	}
	,iterator: function() {
		return HxOverrides.iter(this._array);
	}
	,traverse_node: function(_node,_method,_on_traverse) {
		if(_node != null) switch(_method[1]) {
		case 0:
			_on_traverse(_node);
			this.traverse_node(_node.left,_method,_on_traverse);
			this.traverse_node(_node.right,_method,_on_traverse);
			break;
		case 1:
			this.traverse_node(_node.left,_method,_on_traverse);
			_on_traverse(_node);
			this.traverse_node(_node.right,_method,_on_traverse);
			break;
		case 2:
			this.traverse_node(_node.left,_method,_on_traverse);
			this.traverse_node(_node.right,_method,_on_traverse);
			_on_traverse(_node);
			break;
		}
	}
	,get_empty: function() {
		return this.root == null;
	}
	,node_depth: function(_node) {
		if(_node == null) return 0;
		var _n_depth = Math.max(this.node_depth(_node.left),this.node_depth(_node.right));
		return 1 + (_n_depth | 0);
	}
	,node_count: function(_node) {
		if(_node == null) return 0; else return _node.nodecount;
	}
	,node_insert: function(_node,_key,_value) {
		if(_node == null) return new luxe.structural.BalancedBSTNode_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry(_key,_value,1,true);
		var comparison = this.compare(_key,_node.key);
		if(comparison < 0) _node.left = this.node_insert(_node.left,_key,_value); else if(comparison > 0) _node.right = this.node_insert(_node.right,_key,_value); else _node.value = _value;
		if(this.is_red(_node.right) && !this.is_red(_node.left)) _node = this.rotate_left(_node);
		if(this.is_red(_node.left) && this.is_red(_node.left.left)) _node = this.rotate_right(_node);
		if(this.is_red(_node.left) && this.is_red(_node.right)) this.swap_color(_node);
		this.node_update_count(_node);
		return _node;
	}
	,node_update_count: function(_node) {
		_node.nodecount = this.node_count(_node.left) + this.node_count(_node.right) + 1;
		return _node;
	}
	,node_find: function(_node,_key) {
		if(_node == null) return null;
		var comparison = this.compare(_key,_node.key);
		if(comparison < 0) return this.node_find(_node.left,_key); else if(comparison > 0) return this.node_find(_node.right,_key); else return _node.value;
	}
	,node_rank: function(_key,_node) {
		if(_node == null) return 0;
		var comparison = this.compare(_key,_node.key);
		if(comparison < 0) return this.node_rank(_key,_node.left); else if(comparison > 0) return 1 + this.node_count(_node.left) + this.node_rank(_key,_node.right); else return this.node_count(_node.left);
	}
	,node_select: function(_node,_rank) {
		if(_node == null) return null;
		var _r = this.node_count(_node.left);
		if(_r > _rank) return this.node_select(_node.left,_rank); else if(_r < _rank) return this.node_select(_node.right,_rank - _r - 1); else return _node;
	}
	,node_smallest: function(_node) {
		if(_node.left == null) return _node;
		return this.node_smallest(_node.left);
	}
	,node_largest: function(_node) {
		if(_node.right == null) return _node; else return this.node_largest(_node.right);
	}
	,node_floor: function(_node,_key) {
		if(_node == null) return null;
		var comparison = this.compare(_key,_node.key);
		if(comparison == 0) return _node; else if(comparison < 0) return this.node_floor(_node.left,_key);
		var _n = this.node_floor(_node.right,_key);
		if(_n != null) return _n; else return _node;
	}
	,node_ceil: function(_node,_key) {
		if(_node == null) return null;
		var comparison = this.compare(_key,_node.key);
		if(comparison == 0) return _node; else if(comparison < 0) {
			var _n = this.node_ceil(_node.left,_key);
			if(_n != null) return _n; else return _node;
		}
		return this.node_ceil(_node.right,_key);
	}
	,node_remove_smallest: function(_node) {
		if(_node.left == null) return null;
		if(!this.is_red(_node.left) && !this.is_red(_node.left.left)) _node = this.move_red_left(_node);
		_node.left = this.node_remove_smallest(_node.left);
		this.node_update_count(_node);
		return this.balance(_node);
	}
	,node_remove_largest: function(_node) {
		if(this.is_red(_node.left)) _node = this.rotate_right(_node);
		if(_node.right == null) return null;
		if(!this.is_red(_node.right) && !this.is_red(_node.right.left)) _node = this.move_red_right(_node);
		_node.right = this.node_remove_largest(_node.right);
		this.node_update_count(_node);
		return this.balance(_node);
	}
	,node_remove: function(_node,_key) {
		var comparison = this.compare(_key,_node.key);
		if(comparison < 0) {
			if(!this.is_red(_node.left) && !this.is_red(_node.left.left)) _node = this.move_red_left(_node);
			_node.left = this.node_remove(_node.left,_key);
		} else {
			if(this.is_red(_node.left)) _node = this.rotate_right(_node);
			var comparison1 = this.compare(_key,_node.key);
			if(comparison1 == 0 && _node.right == null) return null;
			if(!this.is_red(_node.right) && !this.is_red(_node.right.left)) _node = this.move_red_right(_node);
			var comparison2 = this.compare(_key,_node.key);
			if(comparison2 == 0) {
				var _n = this.node_smallest(_node.right);
				_node.key = _n.key;
				_node.value = _n.value;
				_node.right = this.node_remove_smallest(_node.right);
			} else _node.right = this.node_remove(_node.right,_key);
		}
		return this.balance(_node);
	}
	,is_red: function(_node) {
		if(_node == null) return false;
		return _node.color == true;
	}
	,rotate_left: function(_node) {
		var _n = _node.right;
		_n.color = _node.color;
		_node.color = true;
		_node.right = _n.left;
		_n.left = _node;
		_n.nodecount = _node.nodecount;
		this.node_update_count(_node);
		return _n;
	}
	,rotate_right: function(_node) {
		var _n = _node.left;
		_n.color = _node.color;
		_node.color = true;
		_node.left = _n.right;
		_n.right = _node;
		_n.nodecount = _node.nodecount;
		this.node_update_count(_node);
		return _n;
	}
	,swap_color: function(_node) {
		_node.color = !_node.color;
		_node.left.color = !_node.left.color;
		_node.right.color = !_node.right.color;
	}
	,move_red_left: function(_node) {
		this.swap_color(_node);
		if(this.is_red(_node.right.left)) {
			_node.right = this.rotate_right(_node.right);
			_node = this.rotate_left(_node);
		}
		return _node;
	}
	,move_red_right: function(_node) {
		this.swap_color(_node);
		if(this.is_red(_node.left.left)) _node = this.rotate_right(_node);
		return _node;
	}
	,balance: function(_node) {
		if(this.is_red(_node.right)) _node = this.rotate_left(_node);
		if(this.is_red(_node.left) && this.is_red(_node.left.left)) _node = this.rotate_right(_node);
		if(this.is_red(_node.left) && this.is_red(_node.right)) this.swap_color(_node);
		this.node_update_count(_node);
		return _node;
	}
	,__class__: luxe.structural.BalancedBST_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry
	,__properties__: {get_empty:"get_empty"}
};
luxe.tween = {};
luxe.tween.actuators = {};
luxe.tween.actuators.IGenericActuator = function() { };
luxe.tween.actuators.IGenericActuator.__name__ = true;
luxe.tween.actuators.IGenericActuator.prototype = {
	autoVisible: null
	,delay: null
	,ease: null
	,onComplete: null
	,onRepeat: null
	,onUpdate: null
	,reflect: null
	,repeat: null
	,reverse: null
	,timescale: null
	,smartRotation: null
	,snapping: null
	,__class__: luxe.tween.actuators.IGenericActuator
};
luxe.tween.actuators.GenericActuator = function(target,duration,properties) {
	this.timescaled = false;
	this._autoVisible = true;
	this._delay = 0;
	this._reflect = false;
	this._repeat = 0;
	this._reverse = false;
	this._smartRotation = false;
	this._snapping = false;
	this.special = false;
	this.target = target;
	this.properties = properties;
	this.duration = duration;
	this._ease = luxe.tween.Actuate.defaultEase;
};
luxe.tween.actuators.GenericActuator.__name__ = true;
luxe.tween.actuators.GenericActuator.__interfaces__ = [luxe.tween.actuators.IGenericActuator];
luxe.tween.actuators.GenericActuator.prototype = {
	duration: null
	,id: null
	,properties: null
	,target: null
	,_autoVisible: null
	,_delay: null
	,_ease: null
	,_onComplete: null
	,_onCompleteParams: null
	,_onRepeat: null
	,_onRepeatParams: null
	,_onUpdate: null
	,_onUpdateParams: null
	,_reflect: null
	,_repeat: null
	,_reverse: null
	,_smartRotation: null
	,_snapping: null
	,special: null
	,apply: function() {
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			if(Object.prototype.hasOwnProperty.call(this.target,i)) Reflect.setField(this.target,i,Reflect.field(this.properties,i)); else Reflect.setProperty(this.target,i,Reflect.field(this.properties,i));
		}
	}
	,autoVisible: function(value) {
		if(value == null) value = true;
		this._autoVisible = value;
		return this;
	}
	,callMethod: function(method,params) {
		if(params == null) params = [];
		return method.apply(method,params);
	}
	,change: function() {
		if(this._onUpdate != null) this.callMethod(this._onUpdate,this._onUpdateParams);
	}
	,complete: function(sendEvent) {
		if(sendEvent == null) sendEvent = true;
		if(sendEvent) {
			this.change();
			if(this._onComplete != null) this.callMethod(this._onComplete,this._onCompleteParams);
		}
		luxe.tween.Actuate.unload(this);
	}
	,delay: function(duration) {
		this._delay = duration;
		return this;
	}
	,ease: function(easing) {
		this._ease = easing;
		return this;
	}
	,move: function() {
	}
	,timescaled: null
	,timescale: function(_value) {
		if(_value == null) _value = true;
		this.timescaled = _value;
		return this;
	}
	,onComplete: function(handler,parameters) {
		this._onComplete = handler;
		if(parameters == null) this._onCompleteParams = []; else this._onCompleteParams = parameters;
		if(this.duration == 0) this.complete();
		return this;
	}
	,onRepeat: function(handler,parameters) {
		this._onRepeat = handler;
		if(parameters == null) this._onRepeatParams = []; else this._onRepeatParams = parameters;
		return this;
	}
	,onUpdate: function(handler,parameters) {
		this._onUpdate = handler;
		if(parameters == null) this._onUpdateParams = []; else this._onUpdateParams = parameters;
		return this;
	}
	,pause: function() {
	}
	,reflect: function(value) {
		if(value == null) value = true;
		this._reflect = value;
		this.special = true;
		return this;
	}
	,repeat: function(times) {
		if(times == null) times = -1;
		this._repeat = times;
		return this;
	}
	,resume: function() {
	}
	,reverse: function(value) {
		if(value == null) value = true;
		this._reverse = value;
		this.special = true;
		return this;
	}
	,smartRotation: function(value) {
		if(value == null) value = true;
		this._smartRotation = value;
		this.special = true;
		return this;
	}
	,snapping: function(value) {
		if(value == null) value = true;
		this._snapping = value;
		this.special = true;
		return this;
	}
	,stop: function(properties,complete,sendEvent) {
	}
	,__class__: luxe.tween.actuators.GenericActuator
};
luxe.tween.actuators.SimpleActuator = function(target,duration,properties) {
	this.has_timescaled_starttime = false;
	this.active = true;
	this.propertyDetails = new Array();
	this.sendChange = false;
	this.paused = false;
	this.cacheVisible = false;
	this.initialized = false;
	this.setVisible = false;
	this.toggleVisible = false;
	this.startTime = Luxe.get_time();
	luxe.tween.actuators.GenericActuator.call(this,target,duration,properties);
	if(!luxe.tween.actuators.SimpleActuator.addedEvent) {
		luxe.tween.actuators.SimpleActuator.addedEvent = true;
		Luxe.on("update",luxe.tween.actuators.SimpleActuator.on_internal_update);
	}
};
luxe.tween.actuators.SimpleActuator.__name__ = true;
luxe.tween.actuators.SimpleActuator.on_internal_update = function(dt) {
	luxe.tween.actuators.SimpleActuator.update_timer += dt;
	luxe.tween.actuators.SimpleActuator.current_time = Luxe.get_time();
	var currentTime = luxe.tween.actuators.SimpleActuator.current_time;
	var actuator;
	var j = 0;
	var cleanup = false;
	var _g1 = 0;
	var _g = luxe.tween.actuators.SimpleActuator.actuatorsLength;
	while(_g1 < _g) {
		var i = _g1++;
		actuator = luxe.tween.actuators.SimpleActuator.actuators[j];
		if(actuator != null && actuator.active) {
			if(actuator.timescaled) currentTime = luxe.tween.actuators.SimpleActuator.update_timer; else currentTime = luxe.tween.actuators.SimpleActuator.current_time;
			if(actuator.timescaled && !actuator.has_timescaled_starttime) {
				actuator.has_timescaled_starttime = true;
				actuator.startTime = luxe.tween.actuators.SimpleActuator.update_timer;
				actuator.timeOffset = actuator.startTime;
			}
			if(currentTime > actuator.timeOffset) actuator.update(currentTime);
			j++;
		} else {
			luxe.tween.actuators.SimpleActuator.actuators.splice(j,1);
			--luxe.tween.actuators.SimpleActuator.actuatorsLength;
		}
	}
};
luxe.tween.actuators.SimpleActuator.__super__ = luxe.tween.actuators.GenericActuator;
luxe.tween.actuators.SimpleActuator.prototype = $extend(luxe.tween.actuators.GenericActuator.prototype,{
	timeOffset: null
	,active: null
	,cacheVisible: null
	,detailsLength: null
	,initialized: null
	,paused: null
	,pauseTime: null
	,propertyDetails: null
	,sendChange: null
	,setVisible: null
	,startTime: null
	,toggleVisible: null
	,has_timescaled_starttime: null
	,autoVisible: function(value) {
		if(value == null) value = true;
		this._autoVisible = value;
		if(!value) {
			this.toggleVisible = false;
			if(this.setVisible) this.setField(this.target,"visible",this.cacheVisible);
		}
		return this;
	}
	,delay: function(duration) {
		this._delay = duration;
		this.timeOffset = this.startTime + duration;
		return this;
	}
	,getField: function(target,propertyName) {
		var value = null;
		if(Object.prototype.hasOwnProperty.call(target,propertyName)) value = Reflect.field(target,propertyName); else value = Reflect.getProperty(target,propertyName);
		return value;
	}
	,initialize: function() {
		var details;
		var start;
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var i = _g1[_g];
			++_g;
			var isField = true;
			if(Object.prototype.hasOwnProperty.call(this.target,i) && (!this.target.__properties__ || !this.target.__properties__["set_" + i])) start = Reflect.field(this.target,i); else {
				isField = false;
				start = Reflect.getProperty(this.target,i);
			}
			if(typeof(start) == "number") {
				details = new luxe.tween.actuators.PropertyDetails(this.target,i,start,this.getField(this.properties,i) - start,isField);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,move: function() {
		this.toggleVisible = Object.prototype.hasOwnProperty.call(this.properties,"alpha") && Object.prototype.hasOwnProperty.call(this.properties,"visible");
		if(this.toggleVisible && this.properties.alpha != 0 && !this.getField(this.target,"visible")) {
			this.setVisible = true;
			this.cacheVisible = this.getField(this.target,"visible");
			this.setField(this.target,"visible",true);
		}
		this.timeOffset = this.startTime;
		luxe.tween.actuators.SimpleActuator.actuators.push(this);
		++luxe.tween.actuators.SimpleActuator.actuatorsLength;
	}
	,onUpdate: function(handler,parameters) {
		this._onUpdate = handler;
		if(parameters == null) this._onUpdateParams = []; else this._onUpdateParams = parameters;
		this.sendChange = true;
		return this;
	}
	,pause: function() {
		this.paused = true;
		if(this.timescaled) this.pauseTime = luxe.tween.actuators.SimpleActuator.update_timer; else this.pauseTime = luxe.tween.actuators.SimpleActuator.current_time;
	}
	,resume: function() {
		if(this.paused) {
			this.paused = false;
			this.timeOffset += ((this.timescaled?luxe.tween.actuators.SimpleActuator.update_timer:luxe.tween.actuators.SimpleActuator.current_time) - this.pauseTime) / 1000;
		}
	}
	,setField: function(target,propertyName,value) {
		if(Object.prototype.hasOwnProperty.call(target,propertyName)) target[propertyName] = value; else Reflect.setProperty(target,propertyName,value);
	}
	,setProperty: function(details,value) {
		if(details.isField) Reflect.setProperty(details.target,details.propertyName,value); else Reflect.setProperty(details.target,details.propertyName,value);
	}
	,stop: function(properties,complete,sendEvent) {
		if(this.active) {
			if(properties == null) {
				this.active = false;
				if(complete) this.apply();
				this.complete(sendEvent);
				return;
			}
			var _g = 0;
			var _g1 = Reflect.fields(properties);
			while(_g < _g1.length) {
				var i = _g1[_g];
				++_g;
				if(Object.prototype.hasOwnProperty.call(this.properties,i)) {
					this.active = false;
					if(complete) this.apply();
					this.complete(sendEvent);
					return;
				}
			}
		}
	}
	,update: function(currentTime) {
		if(!this.paused) {
			var details;
			var easing;
			var i;
			var tweenPosition = (currentTime - this.timeOffset) / this.duration;
			if(tweenPosition > 1) tweenPosition = 1;
			if(!this.initialized) this.initialize();
			if(!this.special) {
				easing = this._ease.calculate(tweenPosition);
				var _g1 = 0;
				var _g = this.detailsLength;
				while(_g1 < _g) {
					var i1 = _g1++;
					details = this.propertyDetails[i1];
					this.setProperty(details,details.start + details.change * easing);
				}
			} else {
				if(!this._reverse) easing = this._ease.calculate(tweenPosition); else easing = this._ease.calculate(1 - tweenPosition);
				var endValue;
				var _g11 = 0;
				var _g2 = this.detailsLength;
				while(_g11 < _g2) {
					var i2 = _g11++;
					details = this.propertyDetails[i2];
					if(this._smartRotation && (details.propertyName == "rotation" || details.propertyName == "rotationX" || details.propertyName == "rotationY" || details.propertyName == "rotationZ")) {
						var rotation = details.change % 360;
						if(rotation > 180) rotation -= 360; else if(rotation < -180) rotation += 360;
						endValue = details.start + rotation * easing;
					} else endValue = details.start + details.change * easing;
					if(!this._snapping) {
						if(details.isField) Reflect.setProperty(details.target,details.propertyName,endValue); else Reflect.setProperty(details.target,details.propertyName,endValue);
					} else this.setProperty(details,Math.round(endValue));
				}
			}
			if(tweenPosition == 1) {
				if(this._repeat == 0) {
					this.active = false;
					if(this.toggleVisible && this.getField(this.target,"alpha") == 0) this.setField(this.target,"visible",false);
					this.complete(true);
					return;
				} else {
					if(this._onRepeat != null) this.callMethod(this._onRepeat,this._onRepeatParams);
					if(this._reflect) this._reverse = !this._reverse;
					this.startTime = currentTime;
					this.timeOffset = this.startTime + this._delay;
					if(this._repeat > 0) this._repeat--;
				}
			}
			if(this.sendChange) this.change();
		}
	}
	,__class__: luxe.tween.actuators.SimpleActuator
});
luxe.tween.easing = {};
luxe.tween.easing.Quad = function() { };
luxe.tween.easing.Quad.__name__ = true;
luxe.tween.easing.Quad.__properties__ = {get_easeOut:"get_easeOut",get_easeInOut:"get_easeInOut",get_easeIn:"get_easeIn"}
luxe.tween.easing.Quad.get_easeIn = function() {
	return new luxe.tween.easing.QuadEaseIn();
};
luxe.tween.easing.Quad.get_easeInOut = function() {
	return new luxe.tween.easing.QuadEaseInOut();
};
luxe.tween.easing.Quad.get_easeOut = function() {
	return new luxe.tween.easing.QuadEaseOut();
};
luxe.tween.easing.IEasing = function() { };
luxe.tween.easing.IEasing.__name__ = true;
luxe.tween.easing.IEasing.prototype = {
	calculate: null
	,ease: null
	,__class__: luxe.tween.easing.IEasing
};
luxe.tween.easing.QuadEaseOut = function() {
};
luxe.tween.easing.QuadEaseOut.__name__ = true;
luxe.tween.easing.QuadEaseOut.__interfaces__ = [luxe.tween.easing.IEasing];
luxe.tween.easing.QuadEaseOut.prototype = {
	calculate: function(k) {
		return -k * (k - 2);
	}
	,ease: function(t,b,c,d) {
		return -c * (t /= d) * (t - 2) + b;
	}
	,__class__: luxe.tween.easing.QuadEaseOut
};
luxe.tween.Actuate = function() { };
luxe.tween.Actuate.__name__ = true;
luxe.tween.Actuate.apply = function(target,properties,customActuator) {
	luxe.tween.Actuate.stop(target,properties);
	if(customActuator == null) customActuator = luxe.tween.Actuate.defaultActuator;
	var actuator = Type.createInstance(customActuator,[target,0,properties]);
	actuator.apply();
	return actuator;
};
luxe.tween.Actuate.getLibrary = function(target,allowCreation) {
	if(allowCreation == null) allowCreation = true;
	if(!luxe.tween.Actuate.targetLibraries.exists(target) && allowCreation) luxe.tween.Actuate.targetLibraries.set(target,new Array());
	return luxe.tween.Actuate.targetLibraries.get(target);
};
luxe.tween.Actuate.motionPath = function(target,duration,properties,overwrite) {
	if(overwrite == null) overwrite = true;
	return luxe.tween.Actuate.tween(target,duration,properties,overwrite,luxe.tween.actuators.MotionPathActuator);
};
luxe.tween.Actuate.pause = function(target) {
	if(js.Boot.__instanceof(target,luxe.tween.actuators.GenericActuator)) (js.Boot.__cast(target , luxe.tween.actuators.GenericActuator)).pause(); else {
		var library = luxe.tween.Actuate.getLibrary(target,false);
		if(library != null) {
			var _g = 0;
			while(_g < library.length) {
				var actuator = library[_g];
				++_g;
				actuator.pause();
			}
		}
	}
};
luxe.tween.Actuate.pauseAll = function() {
	var $it0 = luxe.tween.Actuate.targetLibraries.iterator();
	while( $it0.hasNext() ) {
		var library = $it0.next();
		var _g = 0;
		while(_g < library.length) {
			var actuator = library[_g];
			++_g;
			actuator.pause();
		}
	}
};
luxe.tween.Actuate.reset = function() {
	var $it0 = luxe.tween.Actuate.targetLibraries.iterator();
	while( $it0.hasNext() ) {
		var library = $it0.next();
		var i = library.length - 1;
		while(i >= 0) {
			library[i].stop(null,false,false);
			i--;
		}
	}
	luxe.tween.Actuate.targetLibraries = new haxe.ds.ObjectMap();
};
luxe.tween.Actuate.resume = function(target) {
	if(js.Boot.__instanceof(target,luxe.tween.actuators.GenericActuator)) (js.Boot.__cast(target , luxe.tween.actuators.GenericActuator)).resume(); else {
		var library = luxe.tween.Actuate.getLibrary(target,false);
		if(library != null) {
			var _g = 0;
			while(_g < library.length) {
				var actuator = library[_g];
				++_g;
				actuator.resume();
			}
		}
	}
};
luxe.tween.Actuate.resumeAll = function() {
	var $it0 = luxe.tween.Actuate.targetLibraries.iterator();
	while( $it0.hasNext() ) {
		var library = $it0.next();
		var _g = 0;
		while(_g < library.length) {
			var actuator = library[_g];
			++_g;
			actuator.resume();
		}
	}
};
luxe.tween.Actuate.stop = function(target,properties,complete,sendEvent) {
	if(sendEvent == null) sendEvent = true;
	if(complete == null) complete = false;
	if(target != null) {
		if(js.Boot.__instanceof(target,luxe.tween.actuators.GenericActuator)) (js.Boot.__cast(target , luxe.tween.actuators.GenericActuator)).stop(null,complete,sendEvent); else {
			var library = luxe.tween.Actuate.getLibrary(target,false);
			if(library != null) {
				if(typeof(properties) == "string") {
					var temp = { };
					Reflect.setField(temp,properties,null);
					properties = temp;
				} else if((properties instanceof Array) && properties.__enum__ == null) {
					var temp1 = { };
					var _g = 0;
					var _g1;
					_g1 = js.Boot.__cast(properties , Array);
					while(_g < _g1.length) {
						var property = _g1[_g];
						++_g;
						Reflect.setField(temp1,property,null);
					}
					properties = temp1;
				}
				var i = library.length - 1;
				while(i >= 0) {
					library[i].stop(properties,complete,sendEvent);
					i--;
				}
			}
		}
	}
};
luxe.tween.Actuate.timer = function(duration,customActuator) {
	return luxe.tween.Actuate.tween(new luxe.tween._Actuate.TweenTimer(0),duration,new luxe.tween._Actuate.TweenTimer(1),false,customActuator);
};
luxe.tween.Actuate.tween = function(target,duration,properties,overwrite,customActuator) {
	if(overwrite == null) overwrite = true;
	if(target != null) {
		if(duration > 0) {
			if(customActuator == null) customActuator = luxe.tween.Actuate.defaultActuator;
			var actuator = Type.createInstance(customActuator,[target,duration,properties]);
			var library = luxe.tween.Actuate.getLibrary(actuator.target);
			if(overwrite) {
				var i = library.length - 1;
				while(i >= 0) {
					library[i].stop(actuator.properties,false,false);
					i--;
				}
				library = luxe.tween.Actuate.getLibrary(actuator.target);
			}
			library.push(actuator);
			actuator.move();
			return actuator;
		} else return luxe.tween.Actuate.apply(target,properties,customActuator);
	}
	return null;
};
luxe.tween.Actuate.unload = function(actuator) {
	var target = actuator.target;
	if(luxe.tween.Actuate.targetLibraries.h.__keys__[target.__id__] != null) {
		HxOverrides.remove(luxe.tween.Actuate.targetLibraries.h[target.__id__],actuator);
		if(luxe.tween.Actuate.targetLibraries.h[target.__id__].length == 0) luxe.tween.Actuate.targetLibraries.remove(target);
	}
};
luxe.tween.Actuate.update = function(target,duration,start,end,overwrite) {
	if(overwrite == null) overwrite = true;
	var properties = { start : start, end : end};
	return luxe.tween.Actuate.tween(target,duration,properties,overwrite,luxe.tween.actuators.MethodActuator);
};
luxe.tween._Actuate = {};
luxe.tween._Actuate.TweenTimer = function(progress) {
	this.progress = progress;
};
luxe.tween._Actuate.TweenTimer.__name__ = true;
luxe.tween._Actuate.TweenTimer.prototype = {
	progress: null
	,__class__: luxe.tween._Actuate.TweenTimer
};
luxe.tween.MotionPath = function() {
	this._x = new luxe.tween.ComponentPath();
	this._y = new luxe.tween.ComponentPath();
	this._rotation = null;
};
luxe.tween.MotionPath.__name__ = true;
luxe.tween.MotionPath.prototype = {
	rotation: null
	,x: null
	,y: null
	,_rotation: null
	,_x: null
	,_y: null
	,bezier: function(x,y,controlX,controlY,strength) {
		if(strength == null) strength = 1;
		this._x.addPath(new luxe.tween.BezierPath(x,controlX,strength));
		this._y.addPath(new luxe.tween.BezierPath(y,controlY,strength));
		return this;
	}
	,line: function(x,y,strength) {
		if(strength == null) strength = 1;
		this._x.addPath(new luxe.tween.LinearPath(x,strength));
		this._y.addPath(new luxe.tween.LinearPath(y,strength));
		return this;
	}
	,get_rotation: function() {
		if(this._rotation == null) this._rotation = new luxe.tween.RotationPath(this._x,this._y);
		return this._rotation;
	}
	,get_x: function() {
		return this._x;
	}
	,get_y: function() {
		return this._y;
	}
	,__class__: luxe.tween.MotionPath
	,__properties__: {get_y:"get_y",get_x:"get_x",get_rotation:"get_rotation"}
};
luxe.tween.IComponentPath = function() { };
luxe.tween.IComponentPath.__name__ = true;
luxe.tween.IComponentPath.prototype = {
	end: null
	,start: null
	,calculate: null
	,__class__: luxe.tween.IComponentPath
};
luxe.tween.ComponentPath = function() {
	this.paths = new Array();
	this.start = 0;
	this.totalStrength = 0;
};
luxe.tween.ComponentPath.__name__ = true;
luxe.tween.ComponentPath.__interfaces__ = [luxe.tween.IComponentPath];
luxe.tween.ComponentPath.prototype = {
	start: null
	,end: null
	,paths: null
	,totalStrength: null
	,addPath: function(path) {
		this.paths.push(path);
		this.totalStrength += path.strength;
	}
	,calculate: function(k) {
		if(this.paths.length == 1) return this.paths[0].calculate(this.start,k); else {
			var ratio = k * this.totalStrength;
			var lastEnd = this.start;
			var _g = 0;
			var _g1 = this.paths;
			while(_g < _g1.length) {
				var path = _g1[_g];
				++_g;
				if(ratio > path.strength) {
					ratio -= path.strength;
					lastEnd = path.end;
				} else return path.calculate(lastEnd,ratio / path.strength);
			}
		}
		return 0;
	}
	,get_end: function() {
		if(this.paths.length > 0) {
			var path = this.paths[this.paths.length - 1];
			return path.end;
		} else return this.start;
	}
	,__class__: luxe.tween.ComponentPath
	,__properties__: {get_end:"get_end"}
};
luxe.tween.BezierPath = function(end,control,strength) {
	this.end = end;
	this.control = control;
	this.strength = strength;
};
luxe.tween.BezierPath.__name__ = true;
luxe.tween.BezierPath.prototype = {
	control: null
	,end: null
	,strength: null
	,calculate: function(start,k) {
		return (1 - k) * (1 - k) * start + 2 * (1 - k) * k * this.control + k * k * this.end;
	}
	,__class__: luxe.tween.BezierPath
};
luxe.tween.LinearPath = function(end,strength) {
	luxe.tween.BezierPath.call(this,end,0,strength);
};
luxe.tween.LinearPath.__name__ = true;
luxe.tween.LinearPath.__super__ = luxe.tween.BezierPath;
luxe.tween.LinearPath.prototype = $extend(luxe.tween.BezierPath.prototype,{
	calculate: function(start,k) {
		return start + k * (this.end - start);
	}
	,__class__: luxe.tween.LinearPath
});
luxe.tween.RotationPath = function(x,y) {
	this.step = 0.01;
	this._x = x;
	this._y = y;
	this.offset = 0;
	this.start = this.calculate(0.0);
};
luxe.tween.RotationPath.__name__ = true;
luxe.tween.RotationPath.__interfaces__ = [luxe.tween.IComponentPath];
luxe.tween.RotationPath.prototype = {
	end: null
	,offset: null
	,start: null
	,step: null
	,_x: null
	,_y: null
	,calculate: function(k) {
		var dX = this._x.calculate(k) - this._x.calculate(k + this.step);
		var dY = this._y.calculate(k) - this._y.calculate(k + this.step);
		var angle = Math.atan2(dY,dX) * (180 / Math.PI);
		angle = (angle + this.offset) % 360;
		return angle;
	}
	,get_end: function() {
		return this.calculate(1.0);
	}
	,__class__: luxe.tween.RotationPath
	,__properties__: {get_end:"get_end"}
};
luxe.tween.actuators.MethodActuator = function(target,duration,properties) {
	this.currentParameters = new Array();
	this.tweenProperties = { };
	luxe.tween.actuators.SimpleActuator.call(this,target,duration,properties);
	if(!Object.prototype.hasOwnProperty.call(properties,"start")) this.properties.start = new Array();
	if(!Object.prototype.hasOwnProperty.call(properties,"end")) this.properties.end = this.properties.start;
	var _g1 = 0;
	var _g = this.properties.start.length;
	while(_g1 < _g) {
		var i = _g1++;
		this.currentParameters.push(null);
	}
};
luxe.tween.actuators.MethodActuator.__name__ = true;
luxe.tween.actuators.MethodActuator.__super__ = luxe.tween.actuators.SimpleActuator;
luxe.tween.actuators.MethodActuator.prototype = $extend(luxe.tween.actuators.SimpleActuator.prototype,{
	currentParameters: null
	,tweenProperties: null
	,apply: function() {
		this.callMethod(this.target,this.properties.end);
	}
	,complete: function(sendEvent) {
		if(sendEvent == null) sendEvent = true;
		var _g1 = 0;
		var _g = this.properties.start.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.currentParameters[i] = Reflect.field(this.tweenProperties,"param" + i);
		}
		this.callMethod(this.target,this.currentParameters);
		luxe.tween.actuators.SimpleActuator.prototype.complete.call(this,sendEvent);
	}
	,initialize: function() {
		var details;
		var propertyName;
		var start;
		var _g1 = 0;
		var _g = this.properties.start.length;
		while(_g1 < _g) {
			var i = _g1++;
			propertyName = "param" + i;
			start = this.properties.start[i];
			this.tweenProperties[propertyName] = start;
			if(typeof(start) == "number" || ((start | 0) === start)) {
				details = new luxe.tween.actuators.PropertyDetails(this.tweenProperties,propertyName,start,this.properties.end[i] - start);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,update: function(currentTime) {
		luxe.tween.actuators.SimpleActuator.prototype.update.call(this,currentTime);
		if(this.active) {
			var _g1 = 0;
			var _g = this.properties.start.length;
			while(_g1 < _g) {
				var i = _g1++;
				this.currentParameters[i] = Reflect.field(this.tweenProperties,"param" + i);
			}
			this.callMethod(this.target,this.currentParameters);
		}
	}
	,__class__: luxe.tween.actuators.MethodActuator
});
luxe.tween.actuators.MotionPathActuator = function(target,duration,properties) {
	luxe.tween.actuators.SimpleActuator.call(this,target,duration,properties);
};
luxe.tween.actuators.MotionPathActuator.__name__ = true;
luxe.tween.actuators.MotionPathActuator.__super__ = luxe.tween.actuators.SimpleActuator;
luxe.tween.actuators.MotionPathActuator.prototype = $extend(luxe.tween.actuators.SimpleActuator.prototype,{
	apply: function() {
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var propertyName = _g1[_g];
			++_g;
			if(Object.prototype.hasOwnProperty.call(this.target,propertyName)) Reflect.setField(this.target,propertyName,(js.Boot.__cast(Reflect.field(this.properties,propertyName) , luxe.tween.IComponentPath)).get_end()); else Reflect.setProperty(this.target,propertyName,(js.Boot.__cast(Reflect.field(this.properties,propertyName) , luxe.tween.IComponentPath)).get_end());
		}
	}
	,initialize: function() {
		var details;
		var path;
		var _g = 0;
		var _g1 = Reflect.fields(this.properties);
		while(_g < _g1.length) {
			var propertyName = _g1[_g];
			++_g;
			path = js.Boot.__cast(Reflect.field(this.properties,propertyName) , luxe.tween.IComponentPath);
			if(path != null) {
				var isField = true;
				if(Object.prototype.hasOwnProperty.call(this.target,propertyName)) path.start = Reflect.field(this.target,propertyName); else {
					isField = false;
					path.start = Reflect.getProperty(this.target,propertyName);
				}
				details = new luxe.tween.actuators.PropertyPathDetails(this.target,propertyName,path,isField);
				this.propertyDetails.push(details);
			}
		}
		this.detailsLength = this.propertyDetails.length;
		this.initialized = true;
	}
	,update: function(currentTime) {
		if(!this.paused) {
			var details;
			var easing;
			var tweenPosition = (currentTime - this.timeOffset) / this.duration;
			if(tweenPosition > 1) tweenPosition = 1;
			if(!this.initialized) this.initialize();
			if(!this.special) {
				easing = this._ease.calculate(tweenPosition);
				var _g = 0;
				var _g1 = this.propertyDetails;
				while(_g < _g1.length) {
					var details1 = _g1[_g];
					++_g;
					if(details1.isField) Reflect.setField(details1.target,details1.propertyName,(js.Boot.__cast(details1 , luxe.tween.actuators.PropertyPathDetails)).path.calculate(easing)); else Reflect.setProperty(details1.target,details1.propertyName,(js.Boot.__cast(details1 , luxe.tween.actuators.PropertyPathDetails)).path.calculate(easing));
				}
			} else {
				if(!this._reverse) easing = this._ease.calculate(tweenPosition); else easing = this._ease.calculate(1 - tweenPosition);
				var endValue;
				var _g2 = 0;
				var _g11 = this.propertyDetails;
				while(_g2 < _g11.length) {
					var details2 = _g11[_g2];
					++_g2;
					if(!this._snapping) {
						if(details2.isField) Reflect.setField(details2.target,details2.propertyName,(js.Boot.__cast(details2 , luxe.tween.actuators.PropertyPathDetails)).path.calculate(easing)); else Reflect.setProperty(details2.target,details2.propertyName,(js.Boot.__cast(details2 , luxe.tween.actuators.PropertyPathDetails)).path.calculate(easing));
					} else if(details2.isField) Reflect.setField(details2.target,details2.propertyName,Math.round((js.Boot.__cast(details2 , luxe.tween.actuators.PropertyPathDetails)).path.calculate(easing))); else Reflect.setProperty(details2.target,details2.propertyName,Math.round((js.Boot.__cast(details2 , luxe.tween.actuators.PropertyPathDetails)).path.calculate(easing)));
				}
			}
			if(tweenPosition == 1) {
				if(this._repeat == 0) {
					this.active = false;
					if(this.toggleVisible && this.getField(this.target,"alpha") == 0) this.setField(this.target,"visible",false);
					this.complete(true);
					return;
				} else {
					if(this._reflect) this._reverse = !this._reverse;
					this.startTime = currentTime;
					this.timeOffset = this.startTime + this._delay;
					if(this._repeat > 0) this._repeat--;
				}
			}
			if(this.sendChange) this.change();
		}
	}
	,__class__: luxe.tween.actuators.MotionPathActuator
});
luxe.tween.actuators.PropertyDetails = function(target,propertyName,start,change,isField) {
	if(isField == null) isField = true;
	this.target = target;
	this.propertyName = propertyName;
	this.start = start;
	this.change = change;
	this.isField = isField;
};
luxe.tween.actuators.PropertyDetails.__name__ = true;
luxe.tween.actuators.PropertyDetails.prototype = {
	change: null
	,isField: null
	,propertyName: null
	,start: null
	,target: null
	,__class__: luxe.tween.actuators.PropertyDetails
};
luxe.tween.actuators.PropertyPathDetails = function(target,propertyName,path,isField) {
	if(isField == null) isField = true;
	luxe.tween.actuators.PropertyDetails.call(this,target,propertyName,0,0,isField);
	this.path = path;
};
luxe.tween.actuators.PropertyPathDetails.__name__ = true;
luxe.tween.actuators.PropertyPathDetails.__super__ = luxe.tween.actuators.PropertyDetails;
luxe.tween.actuators.PropertyPathDetails.prototype = $extend(luxe.tween.actuators.PropertyDetails.prototype,{
	path: null
	,__class__: luxe.tween.actuators.PropertyPathDetails
});
luxe.tween.easing.QuadEaseIn = function() {
};
luxe.tween.easing.QuadEaseIn.__name__ = true;
luxe.tween.easing.QuadEaseIn.__interfaces__ = [luxe.tween.easing.IEasing];
luxe.tween.easing.QuadEaseIn.prototype = {
	calculate: function(k) {
		return k * k;
	}
	,ease: function(t,b,c,d) {
		return c * (t /= d) * t + b;
	}
	,__class__: luxe.tween.easing.QuadEaseIn
};
luxe.tween.easing.QuadEaseInOut = function() {
};
luxe.tween.easing.QuadEaseInOut.__name__ = true;
luxe.tween.easing.QuadEaseInOut.__interfaces__ = [luxe.tween.easing.IEasing];
luxe.tween.easing.QuadEaseInOut.prototype = {
	calculate: function(k) {
		if((k *= 2) < 1) return 0.5 * k * k;
		return -0.5 * ((k - 1) * (k - 3) - 1);
	}
	,ease: function(t,b,c,d) {
		if((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((t - 1) * (t - 3) - 1) + b;
	}
	,__class__: luxe.tween.easing.QuadEaseInOut
};
luxe.utils = {};
luxe.utils.GeometryUtils = function(_luxe) {
	this.luxe = _luxe;
};
luxe.utils.GeometryUtils.__name__ = true;
luxe.utils.GeometryUtils.prototype = {
	luxe: null
	,segments_for_smooth_circle: function(_radius,_smooth) {
		if(_smooth == null) _smooth = 6;
		return Std["int"](_smooth * Math.sqrt(_radius));
	}
	,random_point_in_unit_circle: function() {
		var _r = Math.sqrt(Math.random());
		var _t = (-1 + 2 * Math.random()) * 6.283185307179586;
		return new phoenix.Vector(_r * Math.cos(_t),_r * Math.sin(_t));
	}
	,point_in_polygon: function(_point,_offset,_verts) {
		if(_offset == null) _offset = new phoenix.Vector();
		var c = false;
		var nvert = _verts.length;
		var j = nvert - 1;
		var _g = 0;
		while(_g < nvert) {
			var i = _g++;
			if(_verts[i].y + _offset.y > _point.y != _verts[j].y + _offset.y > _point.y && _point.x < (_verts[j].x + _offset.x - (_verts[i].x + _offset.x)) * (_point.y - (_verts[i].y + _offset.y)) / (_verts[j].y + _offset.y - (_verts[i].y + _offset.y)) + (_verts[i].x + _offset.x)) c = !c;
			j = i;
		}
		return c;
	}
	,point_in_geometry: function(_point,_geometry) {
		var c = false;
		var nvert = _geometry.vertices.length;
		var j = nvert - 1;
		var _g = 0;
		while(_g < nvert) {
			var i = _g++;
			var _vert_i_pos = _geometry.vertices[i].pos.clone().transform(_geometry.transform.get_world().get_matrix());
			var _vert_j_pos = _geometry.vertices[j].pos.clone().transform(_geometry.transform.get_world().get_matrix());
			if(_vert_i_pos.y > _point.y != _vert_j_pos.y > _point.y && _point.x < (_vert_j_pos.x - _vert_i_pos.x) * (_point.y - _vert_i_pos.y) / (_vert_j_pos.y - _vert_i_pos.y) + _vert_i_pos.x) c = !c;
			j = i;
		}
		return c;
	}
	,intersect_ray_plane: function(_ray_start,_ray_dir,_plane_normal,_plane_point) {
		var part1 = _plane_normal.dot(new phoenix.Vector(_plane_point.x - _ray_start.x,_plane_point.y - _ray_start.y,_plane_point.z - _ray_start.z));
		var part2 = _plane_normal.x * _ray_dir.x + _plane_normal.y * _ray_dir.y + _plane_normal.z * _ray_dir.z;
		var T = part1 / part2;
		return phoenix.Vector.Add(_ray_start,phoenix.Vector.Multiply(_ray_dir,T));
	}
	,__class__: luxe.utils.GeometryUtils
};
luxe.utils.JSON = function() { };
luxe.utils.JSON.__name__ = true;
luxe.utils.JSON.encode = function(o) {
	return new luxe.utils.json.JSONEncoder(o).getString();
};
luxe.utils.JSON.decode = function(s,strict) {
	if(strict == null) strict = true;
	return new luxe.utils.json.JSONDecoder(s,strict).getValue();
};
luxe.utils.JSON.stringify = function(o) {
	return new luxe.utils.json.JSONEncoder(o).getString();
};
luxe.utils.JSON.parse = function(s,strict) {
	if(strict == null) strict = false;
	return new luxe.utils.json.JSONDecoder(s,strict).getValue();
};
luxe.utils.Maths = function(_luxe) {
	this.luxe = _luxe;
};
luxe.utils.Maths.__name__ = true;
luxe.utils.Maths.fixed = function(value,precision) {
	var n = Math.pow(10,precision);
	return (value * n | 0) / n;
};
luxe.utils.Maths.lerp = function(value,target,t) {
	if(t < 0) t = 0; else if(t > 1) t = 1; else t = t;
	return value + t * (target - value);
};
luxe.utils.Maths.weighted_avg = function(value,target,slowness) {
	if(slowness == 0) slowness = 0.00000001;
	return (value * (slowness - 1) + target) / slowness;
};
luxe.utils.Maths.clamp = function(value,a,b) {
	if(value < a) return a; else if(value > b) return b; else return value;
};
luxe.utils.Maths.clamp_bottom = function(value,a) {
	if(value < a) return a; else return value;
};
luxe.utils.Maths.within_range = function(value,start_range,end_range) {
	return value >= start_range && value <= end_range;
};
luxe.utils.Maths.wrap_angle = function(degrees,lower,upper) {
	var _radians = degrees * 0.017453292519943278;
	var _distance = upper - lower;
	var _times = Math.floor((degrees - lower) / _distance);
	return degrees - _times * _distance;
};
luxe.utils.Maths.nearest_power_of_two = function(_value) {
	_value--;
	_value |= _value >> 1;
	_value |= _value >> 2;
	_value |= _value >> 4;
	_value |= _value >> 8;
	_value |= _value >> 16;
	_value++;
	return _value;
};
luxe.utils.Maths.map_linear = function(value,a1,a2,b1,b2) {
	return b1 + (value - a1) * (b2 - b1) / (a2 - a1);
};
luxe.utils.Maths.smoothstep = function(x,min,max) {
	if(x <= min) return 0;
	if(x >= max) return 1;
	x = (x - min) / (max - min);
	return x * x * (3 - 2 * x);
};
luxe.utils.Maths.smootherstep = function(x,min,max) {
	if(x <= min) return 0;
	if(x >= max) return 1;
	x = (x - min) / (max - min);
	return x * x * x * (x * (x * 6 - 15) + 10);
};
luxe.utils.Maths.random16 = function() {
	return (65280 * Math.random() + 255 * Math.random()) / 65535;
};
luxe.utils.Maths.random_int = function(low,high) {
	return low + Math.floor(Math.random() * (high - low + 1));
};
luxe.utils.Maths.random_float = function(low,high) {
	return low + Math.random() * (high - low);
};
luxe.utils.Maths.random_float_spread = function(range) {
	return range * (0.5 - Math.random());
};
luxe.utils.Maths.sign = function(x) {
	if(x < 0) return -1; else if(x > 0) return 1; else return 0;
};
luxe.utils.Maths.radians = function(degrees) {
	return degrees * 0.017453292519943278;
};
luxe.utils.Maths.degrees = function(radians) {
	return radians * 57.29577951308238;
};
luxe.utils.Maths.prototype = {
	luxe: null
	,__class__: luxe.utils.Maths
};
luxe.utils._UUID = {};
luxe.utils._UUID.Rule30 = function(cells) {
	this.cellsLength = cells.length;
	this.cells = cells;
	var str = new StringBuf();
	var stir = this.cellsLength * 16;
	var _g = 0;
	while(_g < stir) {
		var i = _g++;
		this.getBit();
	}
	var _g1 = 0;
	var _g2 = this.cellsLength;
	while(_g1 < _g2) {
		var i1 = _g1++;
		str.addChar(this.getBits(8));
	}
	this.cells = str.b;
};
luxe.utils._UUID.Rule30.__name__ = true;
luxe.utils._UUID.Rule30.createWithLength = function(length) {
	var str = new StringBuf();
	var f = Math.floor;
	var r = Math.random;
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		str.addChar(f(r() * 256));
	}
	return new luxe.utils._UUID.Rule30(str.b);
};
luxe.utils._UUID.Rule30.prototype = {
	cells: null
	,cellsLength: null
	,getBits: function(length) {
		if(length > 30) length = 30;
		var bits = 0;
		var _g = 0;
		while(_g < length) {
			var i = _g++;
			bits = bits << 1 | this.getBit();
		}
		return bits;
	}
	,getBit: function() {
		var cells = this.cells;
		var newCells = new StringBuf();
		var C = $bind(newCells,newCells.addChar);
		var newCell = 0;
		var section = HxOverrides.cca(cells,this.cellsLength - 1) << 8 | HxOverrides.cca(cells,0);
		var _g1 = 0;
		var _g = this.cellsLength;
		while(_g1 < _g) {
			var pos = _g1++;
			section = section << 8 | HxOverrides.cca(cells,pos % this.cellsLength);
			newCell = 0;
			var i = 16;
			while(i-- > 8) newCell = newCell << 1 | 30 >> (section >> i & 7) & 1;
			newCells.b += String.fromCharCode(newCell);
		}
		this.cells = newCells.b;
		return newCell & 1;
	}
	,__class__: luxe.utils._UUID.Rule30
};
luxe.utils.UUID = function() { };
luxe.utils.UUID.__name__ = true;
luxe.utils.UUID.generate_undashed = function() {
	var sbuf = new StringBuf();
	var getBits = ($_=luxe.utils.UUID.rule30,$bind($_,$_.getBits));
	var hex = (function(f,a1) {
		return function(n) {
			return f(a1,n);
		};
	})(luxe.utils.UUID.hex,sbuf);
	hex(getBits(16));
	hex(getBits(16));
	hex(getBits(16));
	hex(16384 | getBits(12));
	hex(32768 | getBits(14));
	hex(getBits(16));
	hex(getBits(16));
	hex(getBits(16));
	return sbuf.b;
};
luxe.utils.UUID.get = function() {
	var sbuf = new StringBuf();
	var getBits = ($_=luxe.utils.UUID.rule30,$bind($_,$_.getBits));
	var hex = (function(f,a1) {
		return function(n) {
			return f(a1,n);
		};
	})(luxe.utils.UUID.hex,sbuf);
	hex(getBits(16));
	hex(getBits(16));
	sbuf.b += "-";
	hex(getBits(16));
	sbuf.b += "-";
	hex(16384 | getBits(12));
	sbuf.b += "-";
	hex(32768 | getBits(14));
	sbuf.b += "-";
	hex(getBits(16));
	hex(getBits(16));
	hex(getBits(16));
	return sbuf.b.toLowerCase();
};
luxe.utils.UUID.hex = function(sbuf,n) {
	var s = new StringBuf();
	do {
		s.addChar(HxOverrides.cca(luxe.utils.UUID.hexChars,n % 16));
		n = n / 16 | 0;
	} while(n > 0);
	var s1 = s.b;
	var _g1 = 0;
	var _g = 4 - s1.length;
	while(_g1 < _g) {
		var i = _g1++;
		sbuf.b += "0";
	}
	if(s1 == null) sbuf.b += "null"; else sbuf.b += "" + s1;
};
luxe.utils.Utils = function(_luxe) {
	this.luxe = _luxe;
	this.geometry = new luxe.utils.GeometryUtils(this.luxe);
	this._byte_levels = ["bytes","Kb","MB","GB","TB"];
};
luxe.utils.Utils.__name__ = true;
luxe.utils.Utils.prototype = {
	geometry: null
	,luxe: null
	,_byte_levels: null
	,uniqueid: function() {
		return haxe.crypto.Md5.encode(Std.string(Luxe.get_time() * Math.random()));
	}
	,uuid: function() {
		return luxe.utils.UUID.get();
	}
	,stacktrace: function(_depth) {
		if(_depth == null) _depth = 100;
		var result = "\n";
		var stack = haxe.CallStack.callStack();
		stack.shift();
		stack.reverse();
		var total = Std["int"](Math.min(stack.length,_depth));
		var _g = 0;
		while(_g < total) {
			var i = _g++;
			var stackitem = stack[i];
			var params = stackitem.slice(2);
			result += " >  " + params[1] + ":" + params[2];
			if(i != total - 1) result += "\n";
		}
		return result;
	}
	,path_is_relative: function(_path) {
		return _path.charAt(0) != "#" && _path.charAt(0) != "/" && _path.indexOf(":\\") == -1 && _path.indexOf(":/") == -1 && (_path.indexOf("//") == -1 || _path.indexOf("//") > _path.indexOf("#") || _path.indexOf("//") > _path.indexOf("?"));
	}
	,find_assets_image_sequence: function(_name,_ext,_start) {
		if(_start == null) _start = "1";
		if(_ext == null) _ext = ".png";
		var _final = [];
		var _sequence_type = "";
		var _pattern_regex = null;
		var _type0 = _name + _start + _ext;
		var _type0_re = new EReg("(" + _name + ")(\\d\\b)","gi");
		var _type1 = _name + "_" + _start + _ext;
		var _type1_re = new EReg("(" + _name + ")(_\\d\\b)","gi");
		var _type2 = _name + "-" + _start + _ext;
		var _type2_re = new EReg("(" + _name + ")(-\\d\\b)","gi");
		if(this.luxe.app.assets.listed(_type0)) {
			_sequence_type = _type0;
			_pattern_regex = _type0_re;
		} else if(this.luxe.app.assets.listed(_type1)) {
			_sequence_type = _type1;
			_pattern_regex = _type1_re;
		} else if(this.luxe.app.assets.listed(_type2)) {
			_sequence_type = _type2;
			_pattern_regex = _type2_re;
		} else haxe.Log.trace("Sequence requested from " + _name + " but no assets found like `" + _type0 + "` or `" + _type1 + "` or `" + _type2 + "`",{ fileName : "Utils.hx", lineNumber : 102, className : "luxe.utils.Utils", methodName : "find_assets_image_sequence"});
		if(_sequence_type != "") {
			var $it0 = this.luxe.app.assets.list.iterator();
			while( $it0.hasNext() ) {
				var _asset = $it0.next();
				if(_pattern_regex.match(_asset.id)) _final.push(_asset.id);
			}
			_final.sort(function(a,b) {
				if(a == b) return 0;
				if(a < b) return -1;
				return 1;
			});
		}
		return _final;
	}
	,bytes_to_string: function(bytes) {
		var index = Math.floor(Math.log(bytes) / Math.log(1024));
		var _byte_value = bytes / Math.pow(1024,index);
		return _byte_value + this._byte_levels[index];
	}
	,array_to_bytes: function(array) {
		if(array == null) return null;
		var bytes = haxe.io.Bytes.alloc(array.length);
		var _g1 = 0;
		var _g = bytes.length;
		while(_g1 < _g) {
			var n = _g1++;
			bytes.b[n] = array[n] & 255;
		}
		return bytes;
	}
	,__class__: luxe.utils.Utils
};
luxe.utils.json = {};
luxe.utils.json.JSONTokenType = { __ename__ : true, __constructs__ : ["tUNKNOWN","tCOMMA","tLEFT_BRACE","tRIGHT_BRACE","tLEFT_BRACKET","tRIGHT_BRACKET","tCOLON","tTRUE","tFALSE","tNULL","tSTRING","tNUMBER","tNAN"] };
luxe.utils.json.JSONTokenType.tUNKNOWN = ["tUNKNOWN",0];
luxe.utils.json.JSONTokenType.tUNKNOWN.toString = $estr;
luxe.utils.json.JSONTokenType.tUNKNOWN.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tCOMMA = ["tCOMMA",1];
luxe.utils.json.JSONTokenType.tCOMMA.toString = $estr;
luxe.utils.json.JSONTokenType.tCOMMA.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tLEFT_BRACE = ["tLEFT_BRACE",2];
luxe.utils.json.JSONTokenType.tLEFT_BRACE.toString = $estr;
luxe.utils.json.JSONTokenType.tLEFT_BRACE.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tRIGHT_BRACE = ["tRIGHT_BRACE",3];
luxe.utils.json.JSONTokenType.tRIGHT_BRACE.toString = $estr;
luxe.utils.json.JSONTokenType.tRIGHT_BRACE.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tLEFT_BRACKET = ["tLEFT_BRACKET",4];
luxe.utils.json.JSONTokenType.tLEFT_BRACKET.toString = $estr;
luxe.utils.json.JSONTokenType.tLEFT_BRACKET.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tRIGHT_BRACKET = ["tRIGHT_BRACKET",5];
luxe.utils.json.JSONTokenType.tRIGHT_BRACKET.toString = $estr;
luxe.utils.json.JSONTokenType.tRIGHT_BRACKET.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tCOLON = ["tCOLON",6];
luxe.utils.json.JSONTokenType.tCOLON.toString = $estr;
luxe.utils.json.JSONTokenType.tCOLON.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tTRUE = ["tTRUE",7];
luxe.utils.json.JSONTokenType.tTRUE.toString = $estr;
luxe.utils.json.JSONTokenType.tTRUE.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tFALSE = ["tFALSE",8];
luxe.utils.json.JSONTokenType.tFALSE.toString = $estr;
luxe.utils.json.JSONTokenType.tFALSE.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tNULL = ["tNULL",9];
luxe.utils.json.JSONTokenType.tNULL.toString = $estr;
luxe.utils.json.JSONTokenType.tNULL.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tSTRING = ["tSTRING",10];
luxe.utils.json.JSONTokenType.tSTRING.toString = $estr;
luxe.utils.json.JSONTokenType.tSTRING.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tNUMBER = ["tNUMBER",11];
luxe.utils.json.JSONTokenType.tNUMBER.toString = $estr;
luxe.utils.json.JSONTokenType.tNUMBER.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONTokenType.tNAN = ["tNAN",12];
luxe.utils.json.JSONTokenType.tNAN.toString = $estr;
luxe.utils.json.JSONTokenType.tNAN.__enum__ = luxe.utils.json.JSONTokenType;
luxe.utils.json.JSONDecoder = function(s,strict) {
	this.strict = strict;
	this.tokenizer = new luxe.utils.json.JSONTokenizer(s,strict);
	this.nextToken();
	this.value = this.parseValue();
	if(strict && this.nextToken() != null) this.tokenizer.parseError("Unexpected characters left in input stream!");
};
luxe.utils.json.JSONDecoder.__name__ = true;
luxe.utils.json.JSONDecoder.prototype = {
	strict: null
	,value: null
	,tokenizer: null
	,token: null
	,getValue: function() {
		return this.value;
	}
	,nextToken: function() {
		return this.token = this.tokenizer.getNextToken();
	}
	,parseArray: function() {
		var a = new Array();
		this.nextToken();
		if(this.token.type == luxe.utils.json.JSONTokenType.tRIGHT_BRACKET) return a; else if(!this.strict && this.token.type == luxe.utils.json.JSONTokenType.tCOMMA) {
			this.nextToken();
			if(this.token.type == luxe.utils.json.JSONTokenType.tRIGHT_BRACKET) return a; else this.tokenizer.parseError("Leading commas are not supported.  Expecting ']' but found " + Std.string(this.token.value));
		}
		while(true) {
			a.push(this.parseValue());
			this.nextToken();
			if(this.token.type == luxe.utils.json.JSONTokenType.tRIGHT_BRACKET) return a; else if(this.token.type == luxe.utils.json.JSONTokenType.tCOMMA) {
				this.nextToken();
				if(!this.strict) {
					if(this.token.type == luxe.utils.json.JSONTokenType.tRIGHT_BRACKET) return a;
				}
			} else this.tokenizer.parseError("Expecting ] or , but found " + Std.string(this.token.value));
		}
		return null;
	}
	,parseObject: function() {
		var o = { };
		var key;
		this.nextToken();
		if(this.token.type == luxe.utils.json.JSONTokenType.tRIGHT_BRACE) return o; else if(!this.strict && this.token.type == luxe.utils.json.JSONTokenType.tCOMMA) {
			this.nextToken();
			if(this.token.type == luxe.utils.json.JSONTokenType.tRIGHT_BRACE) return o; else this.tokenizer.parseError("Leading commas are not supported.  Expecting '}' but found " + Std.string(this.token.value));
		}
		while(true) if(this.token.type == luxe.utils.json.JSONTokenType.tSTRING) {
			key = Std.string(this.token.value);
			this.nextToken();
			if(this.token.type == luxe.utils.json.JSONTokenType.tCOLON) {
				this.nextToken();
				Reflect.setField(o,key,this.parseValue());
				this.nextToken();
				if(this.token.type == luxe.utils.json.JSONTokenType.tRIGHT_BRACE) return o; else if(this.token.type == luxe.utils.json.JSONTokenType.tCOMMA) {
					this.nextToken();
					if(!this.strict) {
						if(this.token.type == luxe.utils.json.JSONTokenType.tRIGHT_BRACE) return o;
					}
				} else this.tokenizer.parseError("Expecting } or , but found " + Std.string(this.token.value));
			} else this.tokenizer.parseError("Expecting : but found " + Std.string(this.token.value));
		} else this.tokenizer.parseError("Expecting string but found " + Std.string(this.token.value));
		return null;
	}
	,parseValue: function() {
		if(this.token == null) this.tokenizer.parseError("Unexpected end of input");
		var _g = this.token.type;
		switch(_g[1]) {
		case 2:
			return this.parseObject();
		case 4:
			return this.parseArray();
		case 10:
			return this.token.value;
		case 11:
			return this.token.value;
		case 7:
			return true;
		case 8:
			return false;
		case 9:
			return null;
		case 12:
			if(!this.strict) return this.token.value; else this.tokenizer.parseError("Unexpected " + Std.string(this.token.value));
			break;
		default:
			this.tokenizer.parseError("Unexpected " + Std.string(this.token.value));
		}
		return null;
	}
	,__class__: luxe.utils.json.JSONDecoder
};
luxe.utils.json.JSONEncoder = function(value) {
	this.debug = false;
	this.jsonString = this.convertToString(value);
};
luxe.utils.json.JSONEncoder.__name__ = true;
luxe.utils.json.JSONEncoder.prototype = {
	jsonString: null
	,getString: function() {
		return this.jsonString;
	}
	,debug: null
	,_trace: function(e) {
		if(this.debug) haxe.Log.trace(e,{ fileName : "JSONEncoder.hx", lineNumber : 70, className : "luxe.utils.json.JSONEncoder", methodName : "_trace"});
	}
	,convertToString: function(value) {
		if(js.Boot.__instanceof(value,List) || js.Boot.__instanceof(value,haxe.ds.StringMap)) {
			value = Lambda.array(value);
			this._trace("convertToString: was List or Map");
		}
		if(js.Boot.__instanceof(value,haxe.ds.StringMap)) {
			value = this.mapHash(value);
			this._trace("convertToString: was Hash");
		}
		if(typeof(value) == "string") {
			this._trace("convertToString: value was String");
			return this.escapeString(js.Boot.__cast(value , String));
		} else if(typeof(value) == "number") {
			this._trace("convertToString: value was Float");
			if(Math.isFinite(js.Boot.__cast(value , Float))) return Std.string(value) + ""; else return "null";
		} else if(typeof(value) == "boolean") {
			this._trace("convertToString: value was Bool");
			if(value) return "true"; else return "false";
		} else if((value instanceof Array) && value.__enum__ == null) {
			this._trace("convertToString: value was Array");
			return this.arrayToString(js.Boot.__cast(value , Array));
		} else if(js.Boot.__instanceof(value,Dynamic) && value != null) {
			this._trace("convertToString: value was Dynamic");
			var cls = Type.getClass(value);
			if(null == cls) return this.objectToString(value); else return this.instanceToString(value,cls);
		} else if(Type.getEnum(value) != null) {
			this._trace("convertToString: value was (Type.getEnum(value) != null)");
			return Std.string(Type.enumIndex(value));
		}
		this._trace("convertToString: returning null");
		return "null";
	}
	,mapHash: function(value) {
		var ret = { };
		var $it0 = value.keys();
		while( $it0.hasNext() ) {
			var i = $it0.next();
			Reflect.setField(ret,i,value.get(i));
		}
		return ret;
	}
	,escapeString: function(str) {
		var s = "";
		var ch;
		var len = str.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			ch = str.charAt(i);
			switch(ch) {
			case "\"":
				s += "\\\"";
				break;
			case "\\":
				s += "\\\\";
				break;
			case "\n":
				s += "\\n";
				break;
			case "\r":
				s += "\\r";
				break;
			case "\t":
				s += "\\t";
				break;
			default:
				var code = HxOverrides.cca(ch,0);
				if(ch < " " || code > 127) {
					var hexCode = StringTools.hex(HxOverrides.cca(ch,0));
					var zeroPad = "";
					var _g2 = 0;
					var _g1 = 4 - hexCode.length;
					while(_g2 < _g1) {
						var j = _g2++;
						zeroPad += "0";
					}
					s += "\\u" + zeroPad + hexCode;
				} else s += ch;
			}
		}
		return "\"" + s + "\"";
	}
	,arrayToString: function(a) {
		var s = "";
		var _g1 = 0;
		var _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(s.length > 0) s += ",";
			s += this.convertToString(a[i]);
		}
		return "[" + s + "]";
	}
	,objectToString: function(o) {
		var s = "";
		var value;
		var _g = 0;
		var _g1 = Reflect.fields(o);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			value = Reflect.field(o,key);
			if(!Reflect.isFunction(value)) {
				if(s.length > 0) s += ",";
				s += this.escapeString(key) + ":" + this.convertToString(value);
			}
		}
		return "{" + s + "}";
	}
	,instanceToString: function(o,cls) {
		var s = "";
		var value;
		var _g = 0;
		var _g1 = Type.getInstanceFields(cls);
		while(_g < _g1.length) {
			var key = _g1[_g];
			++_g;
			value = Reflect.field(o,key);
			if(!Reflect.isFunction(value)) {
				if(s.length > 0) s += ",";
				s += this.escapeString(key) + ":" + this.convertToString(value);
			}
		}
		return "{" + s + "}";
	}
	,__class__: luxe.utils.json.JSONEncoder
};
luxe.utils.json.JSONParseError = function(message,location,text) {
	if(text == null) text = "";
	if(location == null) location = 0;
	if(message == null) message = "";
	this.name = "JSONParseError";
	this._location = location;
	this._text = text;
	this.message = message;
};
luxe.utils.json.JSONParseError.__name__ = true;
luxe.utils.json.JSONParseError.prototype = {
	_location: null
	,_text: null
	,name: null
	,text: null
	,location: null
	,message: null
	,get_location: function() {
		return this._location;
	}
	,get_text: function() {
		return this._text;
	}
	,toString: function() {
		return this.name + ": " + this.message + " at position: " + this._location + " near \"" + this._text + "\"";
	}
	,__class__: luxe.utils.json.JSONParseError
	,__properties__: {get_location:"get_location",get_text:"get_text"}
};
luxe.utils.json.JSONToken = function(type,value) {
	if(type == null) this.type = luxe.utils.json.JSONTokenType.tUNKNOWN; else this.type = type;
	this.value = value;
};
luxe.utils.json.JSONToken.__name__ = true;
luxe.utils.json.JSONToken.prototype = {
	type: null
	,value: null
	,__class__: luxe.utils.json.JSONToken
};
luxe.utils.json.JSONTokenizer = function(s,strict) {
	this.jsonString = s;
	this.strict = strict;
	this.loc = 0;
	this.nextChar();
};
luxe.utils.json.JSONTokenizer.__name__ = true;
luxe.utils.json.JSONTokenizer.prototype = {
	obj: null
	,jsonString: null
	,loc: null
	,ch: null
	,strict: null
	,getNextToken: function() {
		var token = new luxe.utils.json.JSONToken();
		this.skipIgnored();
		var _g = this.ch;
		switch(_g) {
		case "{":
			token.type = luxe.utils.json.JSONTokenType.tLEFT_BRACE;
			token.value = "{";
			this.nextChar();
			break;
		case "}":
			token.type = luxe.utils.json.JSONTokenType.tRIGHT_BRACE;
			token.value = "}";
			this.nextChar();
			break;
		case "[":
			token.type = luxe.utils.json.JSONTokenType.tLEFT_BRACKET;
			token.value = "[";
			this.nextChar();
			break;
		case "]":
			token.type = luxe.utils.json.JSONTokenType.tRIGHT_BRACKET;
			token.value = "]";
			this.nextChar();
			break;
		case ",":
			token.type = luxe.utils.json.JSONTokenType.tCOMMA;
			token.value = ",";
			this.nextChar();
			break;
		case ":":
			token.type = luxe.utils.json.JSONTokenType.tCOLON;
			token.value = ":";
			this.nextChar();
			break;
		case "t":
			var possibleTrue = "t" + (this.nextChar() + this.nextChar() + this.nextChar());
			if(possibleTrue == "true") {
				token.type = luxe.utils.json.JSONTokenType.tTRUE;
				token.value = true;
				this.nextChar();
			} else this.parseError("Expecting 'true' but found " + possibleTrue);
			break;
		case "f":
			var possibleFalse = "f" + this.nextChar() + this.nextChar() + this.nextChar() + this.nextChar();
			if(possibleFalse == "false") {
				token.type = luxe.utils.json.JSONTokenType.tFALSE;
				token.value = false;
				this.nextChar();
			} else this.parseError("Expecting 'false' but found " + possibleFalse);
			break;
		case "n":
			var possibleNull = "n" + this.nextChar() + this.nextChar() + this.nextChar();
			if(possibleNull == "null") {
				token.type = luxe.utils.json.JSONTokenType.tNULL;
				token.value = null;
				this.nextChar();
			} else this.parseError("Expecting 'null' but found " + possibleNull);
			break;
		case "N":
			var possibleNAN = "N" + this.nextChar() + this.nextChar();
			if(possibleNAN == "NAN" || possibleNAN == "NaN") {
				token.type = luxe.utils.json.JSONTokenType.tNAN;
				token.value = Math.NaN;
				this.nextChar();
			} else this.parseError("Expecting 'nan' but found " + possibleNAN);
			break;
		case "\"":
			token = this.readString();
			break;
		default:
			if(this.isDigit(this.ch) || this.ch == "-") token = this.readNumber(); else if(this.ch == "") return null; else this.parseError("Unexpected " + this.ch + " encountered");
		}
		return token;
	}
	,readString: function() {
		var string = "";
		this.nextChar();
		while(this.ch != "\"" && this.ch != "") {
			if(this.ch == "\\") {
				this.nextChar();
				var _g = this.ch;
				switch(_g) {
				case "\"":
					string += "\"";
					break;
				case "/":
					string += "/";
					break;
				case "\\/":
					string += "/";
					break;
				case "\\":
					string += "\\";
					break;
				case "n":
					string += "\n";
					break;
				case "r":
					string += "\r";
					break;
				case "t":
					string += "\t";
					break;
				case "u":
					var hexValue = "";
					var _g1 = 0;
					while(_g1 < 4) {
						var i = _g1++;
						if(!this.isHexDigit(this.nextChar())) this.parseError(" Excepted a hex digit, but found: " + this.ch);
						hexValue += this.ch;
					}
					string += String.fromCharCode(this.hexValToInt(hexValue));
					break;
				default:
					string += "\\" + this.ch;
				}
			} else string += this.ch;
			this.nextChar();
		}
		if(this.ch == "") this.parseError("Unterminated string literal");
		this.nextChar();
		var token = new luxe.utils.json.JSONToken();
		token.type = luxe.utils.json.JSONTokenType.tSTRING;
		token.value = string;
		return token;
	}
	,hexValToInt: function(hexVal) {
		var ret = 0;
		var _g1 = 0;
		var _g = hexVal.length;
		while(_g1 < _g) {
			var i = _g1++;
			ret = ret << 4;
			var _g2 = hexVal.charAt(i).toUpperCase();
			switch(_g2) {
			case "1":
				ret += 1;
				break;
			case "2":
				ret += 2;
				break;
			case "3":
				ret += 3;
				break;
			case "4":
				ret += 4;
				break;
			case "5":
				ret += 5;
				break;
			case "6":
				ret += 6;
				break;
			case "7":
				ret += 7;
				break;
			case "8":
				ret += 8;
				break;
			case "9":
				ret += 9;
				break;
			case "A":
				ret += 10;
				break;
			case "B":
				ret += 11;
				break;
			case "C":
				ret += 12;
				break;
			case "D":
				ret += 13;
				break;
			case "E":
				ret += 14;
				break;
			case "F":
				ret += 15;
				break;
			}
		}
		return ret;
	}
	,readNumber: function() {
		var input = "";
		if(this.ch == "-") {
			input += "-";
			this.nextChar();
		}
		if(!this.isDigit(this.ch)) this.parseError("Expecting a digit");
		if(this.ch == "0") {
			input += this.ch;
			this.nextChar();
			if(this.isDigit(this.ch)) this.parseError("A digit cannot immediately follow 0"); else if(!this.strict && this.ch == "x") {
				input += this.ch;
				this.nextChar();
				if(this.isHexDigit(this.ch)) {
					input += this.ch;
					this.nextChar();
				} else this.parseError("Number in hex format require at least one hex digit after \"0x\"");
				while(this.isHexDigit(this.ch)) {
					input += this.ch;
					this.nextChar();
				}
				input = Std.string(this.hexValToInt(input));
			}
		} else while(this.isDigit(this.ch)) {
			input += this.ch;
			this.nextChar();
		}
		if(this.ch == ".") {
			input += ".";
			this.nextChar();
			if(!this.isDigit(this.ch)) this.parseError("Expecting a digit");
			while(this.isDigit(this.ch)) {
				input += this.ch;
				this.nextChar();
			}
		}
		if(this.ch == "e" || this.ch == "E") {
			input += "e";
			this.nextChar();
			if(this.ch == "+" || this.ch == "-") {
				input += this.ch;
				this.nextChar();
			}
			if(!this.isDigit(this.ch)) this.parseError("Scientific notation number needs exponent value");
			while(this.isDigit(this.ch)) {
				input += this.ch;
				this.nextChar();
			}
		}
		var num = Std.parseFloat(input);
		if(Math.isFinite(num) && !Math.isNaN(num)) {
			var token = new luxe.utils.json.JSONToken();
			token.type = luxe.utils.json.JSONTokenType.tNUMBER;
			token.value = num;
			return token;
		} else this.parseError("Number " + num + " is not valid!");
		return null;
	}
	,nextChar: function() {
		return this.ch = this.jsonString.charAt(this.loc++);
	}
	,skipIgnored: function() {
		var originalLoc;
		do {
			originalLoc = this.loc;
			this.skipWhite();
			this.skipComments();
		} while(originalLoc != this.loc);
	}
	,skipComments: function() {
		if(this.ch == "/") {
			this.nextChar();
			var _g = this.ch;
			switch(_g) {
			case "/":
				do this.nextChar(); while(this.ch != "\n" && this.ch != "");
				this.nextChar();
				break;
			case "*":
				this.nextChar();
				while(true) {
					if(this.ch == "*") {
						this.nextChar();
						if(this.ch == "/") {
							this.nextChar();
							break;
						}
					} else this.nextChar();
					if(this.ch == "") this.parseError("Multi-line comment not closed");
				}
				break;
			default:
				this.parseError("Unexpected " + this.ch + " encountered (expecting '/' or '*' )");
			}
		}
	}
	,skipWhite: function() {
		while(this.isWhiteSpace(this.ch)) this.nextChar();
	}
	,isWhiteSpace: function(ch) {
		return ch == " " || ch == "\t" || ch == "\n" || ch == "\r";
	}
	,isDigit: function(ch) {
		return ch >= "0" && ch <= "9";
	}
	,isHexDigit: function(ch) {
		var uc = ch.toUpperCase();
		return this.isDigit(ch) || uc >= "A" && uc <= "F";
	}
	,parseError: function(message) {
		throw new luxe.utils.json.JSONParseError(message,this.loc,this.jsonString);
	}
	,__class__: luxe.utils.json.JSONTokenizer
};
var phoenix = {};
phoenix.BatchState = function(_r) {
	this.log = false;
	this.last_group = -1;
	this.batcher = _r;
	this.geom_state = new phoenix.geometry.GeometryState();
	this.last_geom_state = new phoenix.geometry.GeometryState();
};
phoenix.BatchState.__name__ = true;
phoenix.BatchState.prototype = {
	batcher: null
	,geom_state: null
	,last_geom_state: null
	,last_texture_id: null
	,last_shader_id: null
	,last_group: null
	,is_clipping: null
	,clip_rect: null
	,last_clip_rect: null
	,log: null
	,active_shader: function() {
		if(this.geom_state.shader != null) return this.geom_state.shader; else if(this.geom_state.texture != null) return this.batcher.renderer.default_shader_textured; else return this.batcher.renderer.default_shader;
	}
	,activate: function(batcher) {
		if(this.geom_state.dirty) {
			if(this.geom_state.texture != null) {
				if(this.last_texture_id == null) {
				}
				if(this.last_texture_id != this.geom_state.texture.id) {
					this.last_texture_id = this.geom_state.texture.id;
					if(this.geom_state.texture.loaded) {
						this.geom_state.texture.bind();
						this.geom_state.texture.activate(batcher.tex0_attribute);
					}
				}
			} else {
				Luxe.renderer.state.bindTexture2D(null);
				this.last_texture_id = null;
			}
			if(this.geom_state.shader != null) {
				if(this.last_shader_id != this.geom_state.shader.program) {
					batcher.shader_activate(this.geom_state.shader);
					this.last_shader_id = this.geom_state.shader.program;
				}
			} else if(this.geom_state.texture != null) {
				batcher.shader_activate(batcher.renderer.default_shader_textured);
				this.last_shader_id = batcher.renderer.default_shader_textured.program;
			} else {
				batcher.shader_activate(batcher.renderer.default_shader);
				this.last_shader_id = batcher.renderer.default_shader.program;
			}
			if(this.geom_state.group != this.last_group) {
				var previous = batcher.groups.get(this.last_group);
				if(previous != null) {
					var _g = 0;
					while(_g < previous.length) {
						var _batch_group = previous[_g];
						++_g;
						if(_batch_group.post_render != null) _batch_group.post_render(batcher);
					}
				}
				var current = batcher.groups.get(this.geom_state.group);
				if(current != null) {
					var _g1 = 0;
					while(_g1 < current.length) {
						var _batch_group1 = current[_g1];
						++_g1;
						if(_batch_group1.pre_render != null) _batch_group1.pre_render(batcher);
					}
				}
				this.last_group = this.geom_state.group;
			}
		}
		if(this.geom_state.clip) {
			if(!this.is_clipping) {
				snow.platform.web.render.opengl.GL.enable(3089);
				this.is_clipping = true;
			}
			if(this.clip_rect != null) {
				if(!this.clip_rect.equal(this.last_clip_rect)) {
					var _y = batcher.view.get_viewport().h - (this.clip_rect.y + this.clip_rect.h);
					snow.platform.web.render.opengl.GL.scissor(this.clip_rect.x | 0,_y | 0,this.clip_rect.w | 0,this.clip_rect.h | 0);
				}
			}
		} else if(this.is_clipping) {
			snow.platform.web.render.opengl.GL.disable(3089);
			this.is_clipping = false;
		}
		this.geom_state.clean();
	}
	,deactivate: function(batcher) {
		if(this.last_texture_id != null) Luxe.renderer.state.bindTexture2D(null);
		Luxe.renderer.state.useProgram(null);
		var previous = batcher.groups.get(this.last_group);
		if(previous != null) {
			var _g = 0;
			while(_g < previous.length) {
				var _batch_group = previous[_g];
				++_g;
				if(_batch_group.post_render != null) _batch_group.post_render(batcher);
			}
		}
		if(this.is_clipping) snow.platform.web.render.opengl.GL.disable(3089);
	}
	,update: function(geom) {
		this.geom_state.clone_onto(this.last_geom_state);
		this.geom_state.update(geom.state);
		if(this.geom_state.clip) {
			this.last_clip_rect = this.clip_rect;
			this.clip_rect = geom.get_clip_rect();
		}
		return this.geom_state.dirty || this.last_clip_rect != this.clip_rect;
	}
	,str: function() {
		if(!this.log) return;
		haxe.Log.trace("\t+ BATCHSTATE LAST ",{ fileName : "BatchState.hx", lineNumber : 200, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tdepth - " + this.last_geom_state.depth,{ fileName : "BatchState.hx", lineNumber : 201, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tgroup - " + this.last_geom_state.group,{ fileName : "BatchState.hx", lineNumber : 202, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\ttexture - " + (this.last_geom_state.texture == null?"null":this.last_geom_state.texture.id),{ fileName : "BatchState.hx", lineNumber : 203, className : "phoenix.BatchState", methodName : "str"});
		if(this.last_geom_state.texture != null) haxe.Log.trace("\t\t\t " + Std.string(this.last_geom_state.texture.texture),{ fileName : "BatchState.hx", lineNumber : 205, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tshader - " + (this.last_geom_state.shader == null?"null":this.last_geom_state.shader.id),{ fileName : "BatchState.hx", lineNumber : 207, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tprimitive_type - " + Std.string(this.last_geom_state.primitive_type),{ fileName : "BatchState.hx", lineNumber : 208, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tclip - " + Std.string(this.last_geom_state.clip),{ fileName : "BatchState.hx", lineNumber : 209, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t- BATCHSTATE LAST",{ fileName : "BatchState.hx", lineNumber : 210, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t+ BATCHSTATE STATE",{ fileName : "BatchState.hx", lineNumber : 212, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tdepth - " + this.geom_state.depth,{ fileName : "BatchState.hx", lineNumber : 213, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tgroup - " + this.geom_state.group,{ fileName : "BatchState.hx", lineNumber : 214, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\ttexture - " + (this.geom_state.texture == null?"null":this.geom_state.texture.id),{ fileName : "BatchState.hx", lineNumber : 215, className : "phoenix.BatchState", methodName : "str"});
		if(this.geom_state.texture != null) haxe.Log.trace("\t\t\t " + Std.string(this.geom_state.texture.texture),{ fileName : "BatchState.hx", lineNumber : 217, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tshader - " + (this.geom_state.shader == null?"null":this.geom_state.shader.id),{ fileName : "BatchState.hx", lineNumber : 219, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tprimitive_type - " + Std.string(this.geom_state.primitive_type),{ fileName : "BatchState.hx", lineNumber : 220, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t\tclip - " + Std.string(this.geom_state.clip),{ fileName : "BatchState.hx", lineNumber : 221, className : "phoenix.BatchState", methodName : "str"});
		haxe.Log.trace("\t- BATCHSTATE STATE",{ fileName : "BatchState.hx", lineNumber : 222, className : "phoenix.BatchState", methodName : "str"});
	}
	,__class__: phoenix.BatchState
};
phoenix._Batcher = {};
phoenix._Batcher.PrimitiveType_Impl_ = function() { };
phoenix._Batcher.PrimitiveType_Impl_.__name__ = true;
phoenix._Batcher.BlendMode_Impl_ = function() { };
phoenix._Batcher.BlendMode_Impl_.__name__ = true;
phoenix._Batcher.BlendEquation_Impl_ = function() { };
phoenix._Batcher.BlendEquation_Impl_.__name__ = true;
phoenix.BatchGroup = function(_pre,_post) {
	this.pre_render = _pre;
	this.post_render = _post;
};
phoenix.BatchGroup.__name__ = true;
phoenix.BatchGroup.prototype = {
	pre_render: null
	,post_render: null
	,__class__: phoenix.BatchGroup
};
phoenix.Batcher = function(_r,_name) {
	if(_name == null) _name = "";
	this.sequence = -1;
	this.name = "";
	this.log = false;
	this.visible_count = 0;
	this.static_batched_count = 0;
	this.dynamic_batched_count = 0;
	this.draw_calls = 0;
	this.color_attribute = 2;
	this.tcoord_attribute = 1;
	this.vert_attribute = 0;
	this.vert_count = 0;
	this.max_floats = 0;
	this.max_verts = 0;
	this.buffer_index = 0;
	this.buffer_count = 6;
	this.static_normal_floats = 0;
	this.static_color_floats = 0;
	this.static_tcoord_floats = 0;
	this.static_vert_floats = 0;
	this.normal_floats = 0;
	this.color_floats = 0;
	this.tcoord_floats = 0;
	this.vert_floats = 0;
	this.tree_changed = false;
	this.enabled = true;
	this.layer = 0;
	this.id = Luxe.utils.uniqueid();
	this.renderer = _r;
	this.sequence = ++phoenix.Batcher._sequence_key;
	this.geometry = new luxe.structural.BalancedBST_phoenix_geometry_GeometryKey_phoenix_geometry_Geometry($bind(this,this.geometry_compare));
	this.groups = new haxe.ds.IntMap();
	this.max_verts = Std["int"](Math.pow(2,16));
	this.max_floats = this.max_verts << 2;
	this.vertlist = new Float32Array(this.max_floats);
	this.tcoordlist = new Float32Array(this.max_floats);
	this.colorlist = new Float32Array(this.max_floats);
	this.static_vertlist = new Float32Array(this.max_floats);
	this.static_tcoordlist = new Float32Array(this.max_floats);
	this.static_colorlist = new Float32Array(this.max_floats);
	this.view = this.renderer.camera;
	this.vertexBuffers = [];
	this.tcoordBuffers = [];
	this.vcolorBuffers = [];
	var _g1 = 0;
	var _g = this.buffer_count;
	while(_g1 < _g) {
		var i = _g1++;
		var _vb = snow.platform.web.render.opengl.GL.createBuffer();
		var _tb = snow.platform.web.render.opengl.GL.createBuffer();
		var _cb = snow.platform.web.render.opengl.GL.createBuffer();
		var _nb = snow.platform.web.render.opengl.GL.createBuffer();
		snow.platform.web.render.opengl.GL.bindBuffer(34962,_vb);
		snow.platform.web.render.opengl.GL.bufferData(34962,this.vertlist,35044);
		snow.platform.web.render.opengl.GL.bindBuffer(34962,_tb);
		snow.platform.web.render.opengl.GL.bufferData(34962,this.tcoordlist,35044);
		snow.platform.web.render.opengl.GL.bindBuffer(34962,_cb);
		snow.platform.web.render.opengl.GL.bufferData(34962,this.colorlist,35044);
		this.vertexBuffers.push(_vb);
		this.tcoordBuffers.push(_tb);
		this.vcolorBuffers.push(_cb);
	}
	snow.platform.web.render.opengl.GL.enableVertexAttribArray(this.vert_attribute);
	snow.platform.web.render.opengl.GL.enableVertexAttribArray(this.tcoord_attribute);
	snow.platform.web.render.opengl.GL.enableVertexAttribArray(this.color_attribute);
	if(_name.length == 0) this.name = Luxe.utils.uniqueid(); else this.name = _name;
};
phoenix.Batcher.__name__ = true;
phoenix.Batcher.prototype = {
	id: null
	,layer: null
	,enabled: null
	,geometry: null
	,groups: null
	,tree_changed: null
	,vertlist: null
	,tcoordlist: null
	,colorlist: null
	,normallist: null
	,static_vertlist: null
	,static_tcoordlist: null
	,static_colorlist: null
	,static_normallist: null
	,vert_floats: null
	,tcoord_floats: null
	,color_floats: null
	,normal_floats: null
	,static_vert_floats: null
	,static_tcoord_floats: null
	,static_color_floats: null
	,static_normal_floats: null
	,buffer_count: null
	,buffer_index: null
	,max_verts: null
	,max_floats: null
	,vert_count: null
	,vertexBuffers: null
	,tcoordBuffers: null
	,vcolorBuffers: null
	,projectionmatrix_attribute: null
	,modelviewmatrix_attribute: null
	,vert_attribute: null
	,tcoord_attribute: null
	,color_attribute: null
	,tex0_attribute: null
	,tex1_attribute: null
	,tex2_attribute: null
	,tex3_attribute: null
	,tex4_attribute: null
	,tex5_attribute: null
	,tex6_attribute: null
	,tex7_attribute: null
	,renderer: null
	,view: null
	,draw_calls: null
	,dynamic_batched_count: null
	,static_batched_count: null
	,visible_count: null
	,log: null
	,name: null
	,sequence: null
	,set_layer: function(_layer) {
		this.layer = _layer;
		this.renderer.batchers.sort(($_=this.renderer,$bind($_,$_.sort_batchers)));
		return this.layer;
	}
	,toString: function() {
		return "Batcher(" + this.name + ")";
	}
	,compare: function(other) {
		if(this.layer == other.layer) return 0;
		if(this.layer < other.layer) return -1;
		return 1;
	}
	,add_group: function(_group,_pre_render,_post_render) {
		if(!this.groups.exists(_group)) {
			var value = new Array();
			this.groups.set(_group,value);
		}
		this.groups.get(_group).push(new phoenix.BatchGroup(_pre_render,_post_render));
	}
	,compare_rule_to_string: function(r) {
		switch(r) {
		case 0:
			return "same";
		case 1:
			return "depth <";
		case 2:
			return "depth >";
		case 3:
			return "shader <";
		case 4:
			return "shader >";
		case 5:
			return "shader s._ >";
		case 6:
			return "shader _.s <";
		case 7:
			return "texture <";
		case 8:
			return "texture >";
		case 9:
			return "texture t._ >";
		case 10:
			return "texture _.t <";
		case 11:
			return "primitive <";
		case 12:
			return "primitive >";
		case 13:
			return "unclipped";
		case 14:
			return "clipped";
		case 15:
			return "timestamp <";
		case 16:
			return "timestamp >";
		case 17:
			return "timestamp ==";
		case 18:
			return "sequence <";
		case 19:
			return "sequence >";
		case 20:
			return "fallback";
		}
		return "unknown";
	}
	,compare_rule: function(a,b) {
		if(a.uuid == b.uuid) return 0;
		if(a.depth < b.depth) return 1;
		if(a.depth > b.depth) return 2;
		if(a.shader != null && b.shader != null) {
			if(a.shader.id < b.shader.id) return 3;
			if(a.shader.id > b.shader.id) return 4;
		} else if(a.shader != null && b.shader == null) return 5; else if(a.shader == null && b.shader != null) return 6;
		if(a.texture != null && b.texture != null) {
			if(a.texture.id < b.texture.id) return 7;
			if(a.texture.id > b.texture.id) return 8;
		} else if(a.texture != null && b.texture == null) return 9; else if(a.texture == null && b.texture != null) return 10;
		var a_primitive_index = a.primitive_type;
		var b_primitive_index = b.primitive_type;
		if(a_primitive_index < b_primitive_index) return 11;
		if(a_primitive_index > b_primitive_index) return 12;
		if(a.clip != b.clip) {
			if(a.clip == false && b.clip == true) return 13; else if(a.clip == true && b.clip == false) return 14;
		}
		if(a.timestamp < b.timestamp) return 15;
		if(a.timestamp > b.timestamp) return 16;
		if(a.timestamp == b.timestamp) return 17;
		if(a.sequence < b.sequence) return 18;
		if(a.sequence > b.sequence) return 19;
		return 20;
	}
	,geometry_compare: function(a,b) {
		if(a.uuid == b.uuid) return 0;
		if(a.depth < b.depth) return -1;
		if(a.depth > b.depth) return 1;
		if(a.shader != null && b.shader != null) {
			if(a.shader.id < b.shader.id) return -1;
			if(a.shader.id > b.shader.id) return 1;
		} else if(a.shader != null && b.shader == null) return 1; else if(a.shader == null && b.shader != null) return -1;
		if(a.texture != null && b.texture != null) {
			if(a.texture.id < b.texture.id) return -1;
			if(a.texture.id > b.texture.id) return 1;
		} else if(a.texture != null && b.texture == null) return 1; else if(a.texture == null && b.texture != null) return -1;
		var a_primitive_index = a.primitive_type;
		var b_primitive_index = b.primitive_type;
		if(a_primitive_index < b_primitive_index) return -1;
		if(a_primitive_index > b_primitive_index) return 1;
		if(a.clip != b.clip) {
			if(a.clip == false && b.clip == true) return 1; else if(a.clip == true && b.clip == false) return -1;
		}
		if(a.timestamp < b.timestamp) return -1;
		if(a.timestamp >= b.timestamp) return 1;
		if(a.sequence < b.sequence) return -1;
		if(a.sequence > b.sequence) return 1;
		return 1;
	}
	,list_geometry: function() {
		var $it0 = this.geometry.iterator();
		while( $it0.hasNext() ) {
			var geom = $it0.next();
			null;
		}
	}
	,add: function(_geom,_force_add) {
		if(_force_add == null) _force_add = false;
		if(this.geometry.find(_geom.key) == null || _force_add) {
			if(!Lambda.has(_geom.batchers,this)) _geom.batchers.push(this);
			this.geometry.insert(_geom.key,_geom);
			_geom.added = true;
			this.tree_changed = true;
		} else {
		}
	}
	,empty: function(_drop) {
		if(_drop == null) _drop = true;
		if(_drop) {
			var $it0 = this.geometry.iterator();
			while( $it0.hasNext() ) {
				var geom = $it0.next();
				geom.drop(true);
				geom = null;
			}
		} else {
			var $it1 = this.geometry.iterator();
			while( $it1.hasNext() ) {
				var geom1 = $it1.next();
				this.geometry.remove(geom1.key);
			}
		}
	}
	,remove: function(_geom,_remove_batcher_from_geometry) {
		if(_remove_batcher_from_geometry == null) _remove_batcher_from_geometry = true;
		if(_remove_batcher_from_geometry) {
			HxOverrides.remove(_geom.batchers,this);
			if(_geom.batchers.length == 0) _geom.added = false;
		}
		var countbefore = this.geometry.size();
		this.geometry.remove(_geom.key);
		var countafter = this.geometry.size();
		if(countbefore == countafter) {
		}
		this.tree_changed = true;
	}
	,shader_activate: function(_shader) {
		_shader.activate();
		this.projectionmatrix_attribute = _shader.projectionmatrix_attribute;
		this.modelviewmatrix_attribute = _shader.modelviewmatrix_attribute;
		this.tex0_attribute = _shader.tex0_attribute;
		this.tex1_attribute = _shader.tex1_attribute;
		this.tex2_attribute = _shader.tex2_attribute;
		this.tex3_attribute = _shader.tex3_attribute;
		this.tex4_attribute = _shader.tex4_attribute;
		this.tex5_attribute = _shader.tex5_attribute;
		this.tex6_attribute = _shader.tex6_attribute;
		this.tex7_attribute = _shader.tex7_attribute;
		_shader.apply_uniforms();
		Luxe.renderer.state.activeTexture(33984);
	}
	,state: null
	,batch: function(persist_immediate) {
		if(persist_immediate == null) persist_immediate = false;
		this.dynamic_batched_count = 0;
		this.static_batched_count = 0;
		this.visible_count = 0;
		this.vert_floats = 0;
		this.tcoord_floats = 0;
		this.color_floats = 0;
		this.normal_floats = 0;
		this.state = new phoenix.BatchState(this);
		var geom = null;
		var $it0 = this.geometry.iterator();
		while( $it0.hasNext() ) {
			var _geom = $it0.next();
			geom = _geom;
			if(geom != null && !geom.dropped) {
				if(this.state.update(geom)) {
					if(this.vert_floats > 0) this.submit_current_vertex_list(this.state.last_geom_state.primitive_type);
				}
				this.state.activate(this);
				if(geom.visible) {
					this.visible_count++;
					if(geom.get_locked()) {
						this.submit_static_geometry(geom);
						this.vert_count += geom.vertices.length;
					} else if(geom.get_primitive_type() == 3 || geom.get_primitive_type() == 2 || geom.get_primitive_type() == 5 || geom.get_primitive_type() == 6) {
						this.geometry_batch(geom);
						this.submit_current_vertex_list(geom.get_primitive_type());
						this.vert_count += geom.vertices.length;
					} else {
						this.geometry_batch(geom);
						this.dynamic_batched_count++;
						this.vert_count += geom.vertices.length;
					}
					if(!persist_immediate && geom.immediate) geom.drop();
				}
			} else {
			}
		}
		if(this.vert_floats > 0 && geom != null) {
			this.state.update(geom);
			this.state.activate(this);
			this.submit_current_vertex_list(this.state.last_geom_state.primitive_type);
		}
		this.state.deactivate(this);
		this.state = null;
	}
	,draw: function(persist_immediate) {
		if(persist_immediate == null) persist_immediate = false;
		this.draw_calls = 0;
		this.vert_count = 0;
		this.view.process();
		this.renderer.state.viewport(this.view.get_viewport().x,this.view.get_viewport().y,this.view.get_viewport().w,this.view.get_viewport().h);
		this.batch(persist_immediate);
	}
	,submit_static_geometry: function(geom) {
		if(geom.vertices.length == 0) return;
		this.static_vert_floats = 0;
		this.static_tcoord_floats = 0;
		this.static_color_floats = 0;
		if(!geom.submitted || geom.get_dirty()) this.geometry_batch_static(geom); else {
			this.static_vert_floats = geom.vertices.length * 4;
			this.static_tcoord_floats = geom.vertices.length * 4;
			this.static_color_floats = geom.vertices.length * 4;
		}
		if(geom.static_vertex_buffer == null) {
			geom.static_vertex_buffer = snow.platform.web.render.opengl.GL.createBuffer();
			geom.static_tcoord_buffer = snow.platform.web.render.opengl.GL.createBuffer();
			geom.static_vcolor_buffer = snow.platform.web.render.opengl.GL.createBuffer();
		}
		this._enable_attributes();
		snow.platform.web.render.opengl.GL.bindBuffer(34962,geom.static_vertex_buffer);
		snow.platform.web.render.opengl.GL.vertexAttribPointer(this.vert_attribute,4,5126,false,0,0);
		if(!geom.submitted || geom.get_dirty()) snow.platform.web.render.opengl.GL.bufferData(34962,this.static_vertlist,35044);
		snow.platform.web.render.opengl.GL.bindBuffer(34962,geom.static_tcoord_buffer);
		snow.platform.web.render.opengl.GL.vertexAttribPointer(this.tcoord_attribute,4,5126,false,0,0);
		if(!geom.submitted || geom.get_dirty()) snow.platform.web.render.opengl.GL.bufferData(34962,this.static_tcoordlist,35044);
		snow.platform.web.render.opengl.GL.bindBuffer(34962,geom.static_vcolor_buffer);
		snow.platform.web.render.opengl.GL.vertexAttribPointer(this.color_attribute,4,5126,false,0,0);
		if(!geom.submitted || geom.get_dirty()) snow.platform.web.render.opengl.GL.bufferData(34962,this.static_colorlist,35044);
		snow.platform.web.render.opengl.GL.drawArrays(geom.get_primitive_type(),0,phoenix.utils.Rendering.get_elements_for_type(geom.get_primitive_type(),this.static_vert_floats));
		this._disable_attributes();
		this.draw_calls++;
		this.static_batched_count++;
		this.static_vert_floats = 0;
		this.static_tcoord_floats = 0;
		this.static_color_floats = 0;
		geom.set_dirty(false);
		geom.submitted = true;
	}
	,submit_current_vertex_list: function(type) {
		if(this.vert_floats == 0) return;
		if(this.vert_floats > this.max_floats) throw "uh oh, somehow too many floats are being submitted (max:$max_floats, attempt:$vert_floats).";
		this._enable_attributes();
		snow.platform.web.render.opengl.GL.bindBuffer(34962,this.vertexBuffers[this.buffer_index]);
		snow.platform.web.render.opengl.GL.vertexAttribPointer(0,4,5126,false,0,0);
		snow.platform.web.render.opengl.GL.bufferSubData(34962,0,new Float32Array(this.vertlist.buffer,0,this.vert_floats));
		snow.platform.web.render.opengl.GL.bindBuffer(34962,this.tcoordBuffers[this.buffer_index]);
		snow.platform.web.render.opengl.GL.vertexAttribPointer(1,4,5126,false,0,0);
		snow.platform.web.render.opengl.GL.bufferSubData(34962,0,new Float32Array(this.tcoordlist.buffer,0,this.tcoord_floats));
		snow.platform.web.render.opengl.GL.bindBuffer(34962,this.vcolorBuffers[this.buffer_index]);
		snow.platform.web.render.opengl.GL.vertexAttribPointer(2,4,5126,false,0,0);
		snow.platform.web.render.opengl.GL.bufferSubData(34962,0,new Float32Array(this.colorlist.buffer,0,this.color_floats));
		snow.platform.web.render.opengl.GL.drawArrays(type,0,phoenix.utils.Rendering.get_elements_for_type(type,this.vert_floats));
		this._disable_attributes();
		this.buffer_index++;
		if(this.buffer_index >= this.buffer_count) this.buffer_index = 0;
		this.vert_floats = 0;
		this.tcoord_floats = 0;
		this.color_floats = 0;
		this.normal_floats = 0;
		this.draw_calls++;
	}
	,geometry_batch: function(geom) {
		var _count_after = geom.vertices.length + this.vert_floats / 4;
		if(_count_after > this.max_verts) this.submit_current_vertex_list(geom.get_primitive_type());
		geom.batch(this.vert_floats,this.tcoord_floats,this.color_floats,this.normal_floats,this.vertlist,this.tcoordlist,this.colorlist,this.normallist);
		this.vert_floats += geom.vertices.length * 4;
		this.tcoord_floats += geom.vertices.length * 4;
		this.color_floats += geom.vertices.length * 4;
	}
	,geometry_batch_static: function(geom) {
		geom.batch(this.static_vert_floats,this.static_tcoord_floats,this.static_color_floats,this.static_normal_floats,this.static_vertlist,this.static_tcoordlist,this.static_colorlist,this.static_normallist);
		this.static_vert_floats += geom.vertices.length * 4;
		this.static_tcoord_floats += geom.vertices.length * 4;
		this.static_color_floats += geom.vertices.length * 4;
	}
	,_enable_attributes: function() {
		snow.platform.web.render.opengl.GL.uniformMatrix4fv(this.projectionmatrix_attribute,false,this.view.projection_float32array);
		snow.platform.web.render.opengl.GL.uniformMatrix4fv(this.modelviewmatrix_attribute,false,this.view.view_inverse_float32array);
	}
	,_disable_attributes: function() {
	}
	,__class__: phoenix.Batcher
	,__properties__: {set_layer:"set_layer"}
};
phoenix.TextAlign = { __ename__ : true, __constructs__ : ["left","right","center","top","bottom"] };
phoenix.TextAlign.left = ["left",0];
phoenix.TextAlign.left.toString = $estr;
phoenix.TextAlign.left.__enum__ = phoenix.TextAlign;
phoenix.TextAlign.right = ["right",1];
phoenix.TextAlign.right.toString = $estr;
phoenix.TextAlign.right.__enum__ = phoenix.TextAlign;
phoenix.TextAlign.center = ["center",2];
phoenix.TextAlign.center.toString = $estr;
phoenix.TextAlign.center.__enum__ = phoenix.TextAlign;
phoenix.TextAlign.top = ["top",3];
phoenix.TextAlign.top.toString = $estr;
phoenix.TextAlign.top.__enum__ = phoenix.TextAlign;
phoenix.TextAlign.bottom = ["bottom",4];
phoenix.TextAlign.bottom.toString = $estr;
phoenix.TextAlign.bottom.__enum__ = phoenix.TextAlign;
phoenix.BitmapFont = function(_resource_manager) {
	this.items_loaded = 0;
	this.loaded = false;
	this.font_character_count = 0;
	this.font_size = 0.0;
	this.line_height = 0.0;
	this.spacing = 0.0;
	luxe.resource.Resource.call(this,_resource_manager,luxe.resource.ResourceType.font);
	this.id = "Unnamed font";
	this.line_widths = new Array();
	this.dimensions = new phoenix.Vector();
	this.characters = new haxe.ds.IntMap();
	this.kernings = new haxe.ds.ObjectMap();
	this.scale = new phoenix.Vector(1,1);
	this.pages = new haxe.ds.IntMap();
};
phoenix.BitmapFont.__name__ = true;
phoenix.BitmapFont.load = function(_fontid,_path,_onloaded) {
	if(_path == null) _path = "assets/";
	var new_font = new phoenix.BitmapFont(Luxe.resources);
	var file_path = haxe.io.Path.join([_path,_fontid]);
	Luxe.loadText(file_path,function(font_data) {
		new_font.from_string(font_data.text,_path,_onloaded);
		Luxe.resources.cache(new_font);
	});
	return new_font;
};
phoenix.BitmapFont.__super__ = luxe.resource.Resource;
phoenix.BitmapFont.prototype = $extend(luxe.resource.Resource.prototype,{
	dimensions: null
	,spacing: null
	,line_height: null
	,font_size: null
	,font_character_count: null
	,pages: null
	,characters: null
	,kernings: null
	,scale: null
	,onload: null
	,loaded: null
	,line_widths: null
	,toString: function() {
		return "BitmapFont(" + this.id + ")";
	}
	,_tokenize_font_line: function(_line_tokens) {
		var _item_map = new haxe.ds.StringMap();
		var _g = 0;
		while(_g < _line_tokens.length) {
			var _line_token = _line_tokens[_g];
			++_g;
			var _items = _line_token.split("=");
			_item_map.set(_items[0],{ key : _items[0], value : _items[1]});
		}
		return _item_map;
	}
	,on_completely_loaded: function() {
		this.loaded = true;
		if(this.onload != null) this.onload(this);
	}
	,items_loaded: null
	,one_item_loaded: function(t) {
		var total_items = Lambda.count(this.pages);
		this.items_loaded++;
		if(this.items_loaded == total_items) this.on_completely_loaded();
	}
	,from_string: function(_bitmap_file,_folder,onloaded,custom_pages) {
		if(_folder == null) _folder = "assets/";
		if(_bitmap_file == null) _bitmap_file = "";
		var _g1 = this;
		var lines = _bitmap_file.split("\n");
		var _pages = [];
		this.onload = onloaded;
		var _g = 0;
		while(_g < lines.length) {
			var line = lines[_g];
			++_g;
			var _initial_tokens = line.split(" ");
			var _g11 = _initial_tokens[0];
			switch(_g11) {
			case "info":
				HxOverrides.remove(_initial_tokens,"info");
				var _items = this._tokenize_font_line(_initial_tokens);
				var _id = _items.get("face").value;
				if(_id.indexOf("\"") != -1) _id = StringTools.replace(_id,"\"","");
				this.font_size = Std.parseFloat(_items.get("size").value);
				this.id = _id;
				break;
			case "common":
				HxOverrides.remove(_initial_tokens,"common");
				var _items1 = this._tokenize_font_line(_initial_tokens);
				this.line_height = Std.parseFloat(_items1.get("lineHeight").value);
				break;
			case "page":
				HxOverrides.remove(_initial_tokens,"page");
				var _items2 = this._tokenize_font_line(_initial_tokens);
				var _id1 = Std.parseInt(_items2.get("id").value);
				var _file = _items2.get("file").value;
				if(_file.indexOf("\"") != -1) _file = StringTools.replace(_file,"\"","");
				_file = StringTools.trim(_file);
				_pages.push({ id : _id1, file : _file});
				this.pages.set(_id1,null);
				break;
			case "chars":
				HxOverrides.remove(_initial_tokens,"chars");
				var _items3 = this._tokenize_font_line(_initial_tokens);
				this.font_character_count = Std.parseInt(_items3.get("count").value);
				break;
			case "char":
				HxOverrides.remove(_initial_tokens,"char");
				var _items4 = this._tokenize_font_line(_initial_tokens);
				var _character_info = { id : Std.parseInt(_items4.get("id").value), x : Std.parseFloat(_items4.get("x").value), y : Std.parseFloat(_items4.get("y").value), width : Std.parseFloat(_items4.get("width").value), height : Std.parseFloat(_items4.get("height").value), xoffset : Std.parseFloat(_items4.get("xoffset").value), yoffset : Std.parseFloat(_items4.get("yoffset").value), xadvance : Std.parseFloat(_items4.get("xadvance").value), page : Std.parseInt(_items4.get("page").value)};
				this.set_character(_character_info.id,_character_info);
				break;
			case "kerning":
				HxOverrides.remove(_initial_tokens,"char");
				var _items5 = this._tokenize_font_line(_initial_tokens);
				var first = Std.parseInt(_items5.get("first").value);
				var second = Std.parseInt(_items5.get("second").value);
				var amount = Std.parseFloat(_items5.get("amount").value);
				this.set_kerning(first,second,amount);
				break;
			}
		}
		if(custom_pages == null) {
			var _g2 = 0;
			while(_g2 < _pages.length) {
				var _page_item = [_pages[_g2]];
				++_g2;
				var _t = [Luxe.loadTexture(_folder + _page_item[0].file)];
				_t[0].set_onload((function(_t,_page_item) {
					return function(t_t) {
						_g1.pages.set(_page_item[0].id,_t[0]);
						_t[0].set_filter_min(phoenix.FilterType.linear);
						_g1.one_item_loaded(_t[0]);
					};
				})(_t,_page_item));
			}
		} else {
			var _id2 = 0;
			var _g3 = 0;
			while(_g3 < custom_pages.length) {
				var _page = custom_pages[_g3];
				++_g3;
				this.pages.set(_id2,_page);
				++_id2;
			}
			this.on_completely_loaded();
		}
	}
	,set_kerning: function(_glyph,_index,_amount) {
		this.kernings.set({ glyph : _glyph, index : _index},_amount);
	}
	,get_kerning: function(_glyph,_index) {
		var key = { glyph : _glyph, index : _index};
		if(this.kernings.h.__keys__[key.__id__] != null) return this.kernings.h[key.__id__]; else return 0;
	}
	,get_text_dimensions: function(_string,_scale) {
		this.line_widths.splice(0,this.line_widths.length);
		var cumulative_x = 0.0;
		var cumulative_y = 0.0;
		var max_x = 0.0;
		var spc;
		var key = HxOverrides.cca(" ",0);
		spc = this.characters.get(key);
		var _g1 = 0;
		var _g = _string.length;
		while(_g1 < _g) {
			var i = _g1++;
			var glyph = _string.charAt(i);
			if(glyph == "\n") {
				cumulative_y += this.line_height * _scale.y;
				max_x = Math.max(max_x,cumulative_x);
				this.line_widths.push(cumulative_x);
				cumulative_x = 0;
				continue;
			}
			var c;
			var key1 = HxOverrides.cca(glyph,0);
			c = this.characters.get(key1);
			var _x_advance = 0.0;
			if(c != null) _x_advance = c.xadvance;
			var x_inc = _x_advance;
			if(i < _string.length - 1) x_inc += this.get_kerning(HxOverrides.cca(glyph,0),(function($this) {
				var $r;
				var _this = _string.charAt(i);
				$r = HxOverrides.cca(_this,0);
				return $r;
			}(this)));
			if(glyph == "\t") x_inc += spc.xadvance * 4;
			cumulative_x += x_inc * _scale.x;
		}
		this.line_widths.push(cumulative_x);
		max_x = Math.max(max_x,cumulative_x);
		cumulative_y += this.line_height * _scale.y;
		return new phoenix.Vector(max_x,cumulative_y);
	}
	,draw_text: function(options) {
		var _string;
		if(options.text == null) _string = ""; else _string = Std.string(options.text);
		var _pos;
		if(options.pos == null) _pos = new phoenix.Vector(); else _pos = options.pos;
		var _col;
		if(options.color == null) _col = new phoenix.Color(); else _col = options.color;
		var _bounds;
		if(options.bounds == null) _bounds = null; else _bounds = options.bounds;
		var _align;
		if(options.align == null) _align = phoenix.TextAlign.left; else _align = options.align;
		var _valign;
		if(options.align_vertical == null) _valign = phoenix.TextAlign.top; else _valign = options.align_vertical;
		var _depth;
		if(options.depth == null) _depth = 0; else _depth = options.depth;
		var _size;
		if(options.size == null) _size = 22; else _size = options.size;
		var _batcher;
		if(options.batcher == null) _batcher = Luxe.renderer.batcher; else _batcher = options.batcher;
		var _visible;
		if(options.visible == null) _visible = true; else _visible = options.visible;
		var _immediate;
		if(options.immediate == null) _immediate = false; else _immediate = options.immediate;
		var _final_geom;
		if(options.geometry == null) _final_geom = new phoenix.geometry.CompositeGeometry(null); else _final_geom = options.geometry;
		var _bounds_based = false;
		if(_bounds != null) _bounds_based = true;
		if(this.pages.get(0) == null) {
			haxe.Log.trace("i / bitmapfont / " + ("Warning ; " + this.id + " font trying to draw without a texture."),{ fileName : "BitmapFont.hx", lineNumber : 386, className : "phoenix.BitmapFont", methodName : "draw_text"});
			return _final_geom;
		}
		var _geoms = new Array();
		var _page_count = Lambda.count(this.pages);
		var _g = 0;
		while(_g < _page_count) {
			var i = _g++;
			var _g1 = new phoenix.geometry.Geometry({ texture : this.pages.get(i), color : _col, depth : _depth, visible : _visible, immediate : _immediate});
			_g1.id = "text.page" + i + "." + _string;
			_g1.set_primitive_type(4);
			_g1.immediate = _immediate;
			_geoms.push(_g1);
		}
		var point_size = _size / this.font_size;
		var _scale = new phoenix.Vector(point_size,point_size);
		if(!_immediate) {
		}
		var _cumulative_x = 0.0;
		var _cumulative_y = 0.0;
		var spc;
		var key = HxOverrides.cca(" ",0);
		spc = this.characters.get(key);
		var _line_number = 0;
		var _dimensions = this.get_text_dimensions(_string,_scale);
		var _max_line_width = _dimensions.x;
		var _lines = _string.split("\n");
		var _g2 = 0;
		while(_g2 < _lines.length) {
			var _line = _lines[_g2];
			++_g2;
			var _align_x_offset = 0.0;
			if(_align == phoenix.TextAlign.center) _align_x_offset = _max_line_width / 2.0 - this.line_widths[_line_number] / 2.0; else if(_align == phoenix.TextAlign.right) _align_x_offset = _max_line_width - this.line_widths[_line_number];
			if(_line_number != 0) {
				_cumulative_y += this.line_height * _scale.y;
				_cumulative_x = 0;
			}
			var _g21 = 0;
			var _g11 = _line.length;
			while(_g21 < _g11) {
				var i1 = _g21++;
				var _char = _line.charAt(i1);
				var c;
				var key1 = HxOverrides.cca(_char,0);
				c = this.characters.get(key1);
				if(c == null) c = spc;
				var _geom = _geoms[c.page];
				var _tw = this.pages.get(c.page).width_actual;
				var _th = this.pages.get(c.page).height_actual;
				var _u = c.x / _tw;
				var _v = c.y / _th;
				var _u2 = (c.x + c.width) / _tw;
				var _v2 = (c.y + c.height) / _th;
				var _x = _align_x_offset + _cumulative_x + c.xoffset * _scale.x;
				var _y = _cumulative_y + c.yoffset * _scale.y;
				var _w = c.width * _scale.x;
				var _h = c.height * _scale.y;
				var _x_inc = c.xadvance;
				if(i1 < _line.length - 1) _x_inc += this.get_kerning(c.id,HxOverrides.cca(_char,0));
				if(_char == "\t") _x_inc += spc.xadvance * 4;
				_cumulative_x += _x_inc * _scale.x;
				var vert0 = new phoenix.geometry.Vertex(new phoenix.Vector(_x,_y),_col);
				vert0.uv.uv0.set_uv(_u,_v);
				var vert1 = new phoenix.geometry.Vertex(new phoenix.Vector(_x + _w,_y),_col);
				vert1.uv.uv0.set_uv(_u2,_v);
				var vert2 = new phoenix.geometry.Vertex(new phoenix.Vector(_x + _w,_y + _h),_col);
				vert2.uv.uv0.set_uv(_u2,_v2);
				var vert3 = new phoenix.geometry.Vertex(new phoenix.Vector(_x,_y + _h),_col);
				vert3.uv.uv0.set_uv(_u,_v2);
				var vert4 = new phoenix.geometry.Vertex(new phoenix.Vector(_x,_y),_col);
				vert4.uv.uv0.set_uv(_u,_v);
				var vert5 = new phoenix.geometry.Vertex(new phoenix.Vector(_x + _w,_y + _h),_col);
				vert5.uv.uv0.set_uv(_u2,_v2);
				_geom.add(vert0);
				_geom.add(vert1);
				_geom.add(vert2);
				_geom.add(vert3);
				_geom.add(vert4);
				_geom.add(vert5);
			}
			_line_number++;
		}
		_final_geom.replace(_geoms);
		_final_geom.add_to_batcher(_batcher);
		if(!_bounds_based) {
			var _po = new phoenix.Vector(_pos.x,_pos.y,_pos.z,_pos.w);
			if(_align == phoenix.TextAlign.center) _po.set_x(_pos.x - _max_line_width / 2); else if(_align == phoenix.TextAlign.right) _po.set_x(_pos.x - _max_line_width);
			_final_geom.transform.set_origin(new phoenix.Vector(_pos.x - _po.x,_pos.y - _po.y));
			_final_geom.transform.set_pos(new phoenix.Vector(_pos.x,_pos.y,_pos.z,_pos.w));
		} else {
			var _po1 = new phoenix.Vector(_bounds.x,_bounds.y);
			if(_align == phoenix.TextAlign.center) _po1.set_x(_po1.x + (_bounds.w / 2 - _dimensions.x / 2)); else if(_align == phoenix.TextAlign.right) _po1.set_x(_po1.x + (_bounds.w - _dimensions.x));
			if(_valign == phoenix.TextAlign.center) _po1.set_y(_po1.y + (_bounds.h / 2 - _dimensions.y / 2)); else if(_valign == phoenix.TextAlign.bottom) _po1.set_y(_po1.y + (_bounds.h - _dimensions.y));
			_final_geom.transform.set_origin(new phoenix.Vector(_pos.x - _po1.x,_pos.y - _po1.y));
			_final_geom.transform.set_pos(new phoenix.Vector(_pos.x,_pos.y,_pos.z,_pos.w));
		}
		_final_geom.id = "drawn_text- " + HxOverrides.substr(_string,0,10);
		_final_geom.immediate = _immediate;
		_final_geom.set_visible(_visible);
		return _final_geom;
	}
	,set_character: function(_index,_char_info) {
		this.characters.set(_index,_char_info);
	}
	,__class__: phoenix.BitmapFont
});
phoenix.ProjectionType = { __ename__ : true, __constructs__ : ["ortho","perspective","custom"] };
phoenix.ProjectionType.ortho = ["ortho",0];
phoenix.ProjectionType.ortho.toString = $estr;
phoenix.ProjectionType.ortho.__enum__ = phoenix.ProjectionType;
phoenix.ProjectionType.perspective = ["perspective",1];
phoenix.ProjectionType.perspective.toString = $estr;
phoenix.ProjectionType.perspective.__enum__ = phoenix.ProjectionType;
phoenix.ProjectionType.custom = ["custom",2];
phoenix.ProjectionType.custom.toString = $estr;
phoenix.ProjectionType.custom.__enum__ = phoenix.ProjectionType;
phoenix.Camera = function(_options) {
	this._refresh_pos = false;
	this._setup = true;
	this.look_at_dirty = true;
	this.projection_dirty = true;
	this.transform_dirty = true;
	this.minimum_zoom = 0.01;
	this.aspect = 1.5;
	this.fov = 60;
	this.far = -1000;
	this.near = 1000;
	this.zoom = 1.0;
	this.name = "camera";
	this.transform = new phoenix.Transform();
	this.options = _options;
	if(this.options == null) this.options = this.default_camera_options();
	if(this.options.camera_name != null) this.name = this.options.camera_name;
	if(this.options.projection != null) this.projection = this.options.projection; else this.projection = phoenix.ProjectionType.ortho;
	this.set_center(new phoenix.Vector(Luxe.get_screen().w / 2,Luxe.get_screen().h / 2));
	this.set_pos(new phoenix.Vector());
	if(this.options.viewport != null) this.set_viewport(this.options.viewport); else this.set_viewport(new phoenix.Rectangle(0,0,Luxe.get_screen().w,Luxe.get_screen().h));
	this.up = new phoenix.Vector(0,1,0);
	this.projection_matrix = new phoenix.Matrix();
	this.view_matrix = new phoenix.Matrix();
	this.view_matrix_inverse = new phoenix.Matrix();
	this.look_at_matrix = new phoenix.Matrix();
	this.transform.listen($bind(this,this.on_transform_cleaned));
	this.apply_default_camera_options();
	var _g = this.projection;
	switch(_g[1]) {
	case 0:
		this.set_ortho(this.options);
		break;
	case 1:
		this.set_perspective(this.options);
		break;
	case 2:
		break;
	}
	this._setup = false;
};
phoenix.Camera.__name__ = true;
phoenix.Camera.prototype = {
	name: null
	,viewport: null
	,center: null
	,zoom: null
	,near: null
	,far: null
	,fov: null
	,aspect: null
	,target: null
	,pos: null
	,transform: null
	,minimum_zoom: null
	,projection_matrix: null
	,view_matrix: null
	,view_matrix_inverse: null
	,look_at_matrix: null
	,options: null
	,projection: null
	,up: null
	,projection_float32array: null
	,view_inverse_float32array: null
	,transform_dirty: null
	,projection_dirty: null
	,look_at_dirty: null
	,_setup: null
	,set_ortho: function(_options) {
		this.projection = phoenix.ProjectionType.ortho;
		this._merge_options(_options);
	}
	,set_perspective: function(_options) {
		this.projection = phoenix.ProjectionType.perspective;
		this._merge_options(_options);
		this.transform.origin.set_xyz(0,0,0);
	}
	,project: function(_vector) {
		this.update_view_matrix();
		var _transform = new phoenix.Matrix().multiplyMatrices(this.projection_matrix,this.view_matrix_inverse);
		return new phoenix.Vector(_vector.x,_vector.y,_vector.z,_vector.w).applyProjection(_transform);
	}
	,unproject: function(_vector) {
		this.update_view_matrix();
		var _inverted = new phoenix.Matrix().multiplyMatrices(this.projection_matrix,this.view_matrix_inverse);
		return new phoenix.Vector(_vector.x,_vector.y,_vector.z,_vector.w).applyProjection(_inverted.getInverse(_inverted));
	}
	,screen_point_to_ray: function(_vector) {
		return new phoenix.Ray(_vector,this);
	}
	,screen_point_to_world: function(_vector) {
		if(this.projection == phoenix.ProjectionType.ortho) return this.ortho_screen_to_world(_vector); else if(this.projection == phoenix.ProjectionType.perspective) return this.screen_point_to_ray(_vector).end;
		return this.ortho_screen_to_world(_vector);
	}
	,world_point_to_screen: function(_vector,_viewport) {
		if(this.projection == phoenix.ProjectionType.ortho) return this.ortho_world_to_screen(_vector); else if(this.projection == phoenix.ProjectionType.perspective) return this.persepective_world_to_screen(_vector,_viewport);
		return this.ortho_world_to_screen(_vector);
	}
	,process: function() {
		if(this.target != null) this.update_look_at();
		this.update_projection_matrix();
		this.update_view_matrix();
		this.apply_state(2884,this.options.cull_backfaces);
		this.apply_state(2929,this.options.depth_test);
	}
	,on_transform_cleaned: function(t) {
		this.transform_dirty = true;
	}
	,update_look_at: function() {
		if(this.look_at_dirty && this.target != null) {
			this.look_at_matrix.lookAt(this.target,this.get_pos(),this.up);
			this.get_rotation().setFromRotationMatrix(this.look_at_matrix);
		}
	}
	,update_view_matrix: function() {
		this.view_matrix = this.transform.get_world().get_matrix();
		if(!this.transform_dirty) return;
		this.view_matrix_inverse = this.view_matrix.inverse();
		this.view_inverse_float32array = new Float32Array(this.view_matrix_inverse.elements);
		this.transform_dirty = false;
	}
	,update_projection_matrix: function() {
		if(!this.projection_dirty) return;
		var _g = this.projection;
		switch(_g[1]) {
		case 1:
			this.projection_matrix.makePerspective(this.fov,this.aspect,this.near,this.far);
			break;
		case 0:
			this.projection_matrix.makeOrthographic(0,this.get_viewport().w,0,this.get_viewport().h,this.near,this.far);
			break;
		case 2:
			break;
		}
		this.projection_float32array = new Float32Array(this.projection_matrix.elements);
		this.projection_dirty = false;
	}
	,apply_state: function(state,value) {
		if(value) Luxe.renderer.state.enable(state); else Luxe.renderer.state.disable(state);
	}
	,apply_default_camera_options: function() {
		var _g = this.projection;
		switch(_g[1]) {
		case 0:
			if(this.options.cull_backfaces == null) this.options.cull_backfaces = false;
			if(this.options.depth_test == null) this.options.depth_test = false;
			break;
		case 1:
			if(this.options.cull_backfaces == null) this.options.cull_backfaces = true;
			if(this.options.depth_test == null) this.options.depth_test = true;
			break;
		case 2:
			break;
		}
	}
	,default_camera_options: function() {
		return { projection : phoenix.ProjectionType.ortho, depth_test : false, cull_backfaces : false, near : 1000, far : -1000};
	}
	,ortho_screen_to_world: function(_vector) {
		this.update_view_matrix();
		return new phoenix.Vector(_vector.x,_vector.y,_vector.z,_vector.w).transform(this.view_matrix);
	}
	,ortho_world_to_screen: function(_vector) {
		this.update_view_matrix();
		return new phoenix.Vector(_vector.x,_vector.y,_vector.z,_vector.w).transform(this.view_matrix_inverse);
	}
	,persepective_world_to_screen: function(_vector,_viewport) {
		if(_viewport == null) _viewport = this.get_viewport();
		var _projected = this.project(_vector);
		var width_half = _viewport.w / 2;
		var height_half = _viewport.h / 2;
		return new phoenix.Vector(_projected.x * width_half + width_half,-(_projected.y * height_half) + height_half);
	}
	,set_target: function(_target) {
		if(_target != null) this.look_at_dirty = true;
		return this.target = _target;
	}
	,set_fov: function(_fov) {
		this.projection_dirty = true;
		this.options.fov = _fov;
		return this.fov = _fov;
	}
	,set_aspect: function(_aspect) {
		this.projection_dirty = true;
		this.options.aspect = _aspect;
		return this.aspect = _aspect;
	}
	,set_near: function(_near) {
		this.projection_dirty = true;
		this.options.near = _near;
		return this.near = _near;
	}
	,set_far: function(_far) {
		this.projection_dirty = true;
		this.options.far = _far;
		return this.far = _far;
	}
	,set_zoom: function(_z) {
		var _new_zoom = _z;
		if(_new_zoom < this.minimum_zoom) _new_zoom = this.minimum_zoom;
		var _g = this.projection;
		switch(_g[1]) {
		case 0:
			this.transform.local.scale.set_x(1 / _new_zoom);
			this.transform.local.scale.set_y(1 / _new_zoom);
			break;
		case 1:
			break;
		case 2:
			break;
		}
		return this.zoom = _new_zoom;
	}
	,_refresh_pos: null
	,set_center: function(_p) {
		this.center = _p;
		var _g = this.projection;
		switch(_g[1]) {
		case 0:
			if(!this._refresh_pos && !this._setup) {
				this.get_pos().ignore_listeners = true;
				this.get_pos().set_x(_p.x - this.get_viewport().w / 2);
				this.get_pos().set_y(_p.y - this.get_viewport().h / 2);
				this.get_pos().ignore_listeners = false;
			}
			break;
		case 1:
			break;
		case 2:
			break;
		}
		phoenix.Vector.Listen(this.get_center(),$bind(this,this._center_changed));
		return this.get_center();
	}
	,get_center: function() {
		return this.center;
	}
	,get_pos: function() {
		return this.pos;
	}
	,get_rotation: function() {
		return this.transform.local.rotation;
	}
	,get_scale: function() {
		return this.transform.local.scale;
	}
	,get_viewport: function() {
		return this.viewport;
	}
	,set_viewport: function(_r) {
		this.viewport = _r;
		var _g = this.projection;
		switch(_g[1]) {
		case 0:
			this.transform.set_origin(new phoenix.Vector(_r.w / 2,_r.h / 2));
			this.set_pos(this.get_pos());
			break;
		case 1:
			break;
		case 2:
			break;
		}
		return this.get_viewport();
	}
	,set_rotation: function(_q) {
		return this.transform.local.set_rotation(_q);
	}
	,set_scale: function(_s) {
		return this.transform.local.set_scale(_s);
	}
	,set_pos: function(_p) {
		this.pos = _p;
		var _g = this.projection;
		switch(_g[1]) {
		case 0:
			var _cx = this.get_center().x;
			var _cy = this.get_center().y;
			if(this.get_viewport() != null) {
				_cx = _p.x + this.get_viewport().w / 2;
				_cy = _p.y + this.get_viewport().h / 2;
			}
			this._refresh_pos = true;
			this.get_center().ignore_listeners = true;
			this.get_center().set_x(_cx);
			this.get_center().set_y(_cy);
			this.get_center().ignore_listeners = false;
			this._refresh_pos = false;
			this.transform.local.pos.set_x(_cx);
			this.transform.local.pos.set_y(_cy);
			break;
		case 1:
			this.transform.set_pos(this.get_pos());
			break;
		case 2:
			break;
		}
		phoenix.Vector.Listen(this.get_pos(),$bind(this,this._pos_changed));
		return this.get_pos();
	}
	,_merge_options: function(_options) {
		if(_options.aspect != null) {
			this.options.aspect = _options.aspect;
			this.set_aspect(this.options.aspect);
		}
		if(_options.far != null) {
			this.options.far = _options.far;
			this.set_far(this.options.far);
		}
		if(_options.fov != null) {
			this.options.fov = _options.fov;
			this.set_fov(this.options.fov);
		}
		if(_options.near != null) {
			this.options.near = _options.near;
			this.set_near(this.options.near);
		}
		if(_options.viewport != null) {
			this.options.viewport = _options.viewport;
			this.set_viewport(this.options.viewport);
		}
		this.apply_default_camera_options();
		if(_options.cull_backfaces != null) this.options.cull_backfaces = _options.cull_backfaces;
		if(_options.depth_test != null) this.options.depth_test = _options.depth_test;
	}
	,_pos_changed: function(v) {
		this.set_pos(this.get_pos());
	}
	,_center_changed: function(v) {
		this.set_center(this.get_center());
	}
	,__class__: phoenix.Camera
	,__properties__: {set_rotation:"set_rotation",get_rotation:"get_rotation",set_scale:"set_scale",get_scale:"get_scale",set_pos:"set_pos",get_pos:"get_pos",set_target:"set_target",set_aspect:"set_aspect",set_fov:"set_fov",set_far:"set_far",set_near:"set_near",set_zoom:"set_zoom",set_center:"set_center",get_center:"get_center",set_viewport:"set_viewport",get_viewport:"get_viewport"}
};
phoenix.Circle = function(_x,_y,_r) {
	if(_r == null) _r = 0;
	if(_y == null) _y = 0;
	if(_x == null) _x = 0;
	this.x = _x;
	this.y = _y;
	this.r = _r;
};
phoenix.Circle.__name__ = true;
phoenix.Circle.prototype = {
	x: null
	,y: null
	,r: null
	,toString: function() {
		return "{ x:" + this.x + ", y:" + this.y + ", r:" + this.r + " }";
	}
	,point_inside: function(_p) {
		var diff = new phoenix.Vector(_p.x - this.x,_p.y - this.y);
		return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z) <= this.r;
	}
	,clone: function() {
		return new phoenix.Circle(this.x,this.y,this.r);
	}
	,set: function(_x,_y,_r) {
		var _setx = this.x;
		var _sety = this.y;
		var _setr = this.r;
		if(_x != null) _setx = _x;
		if(_y != null) _sety = _y;
		if(_r != null) _setr = _r;
		this.x = _setx;
		this.y = _sety;
		this.r = _setr;
		return this;
	}
	,__class__: phoenix.Circle
};
phoenix.Color = function(_r,_g,_b,_a) {
	if(_a == null) _a = 1.0;
	if(_b == null) _b = 1.0;
	if(_g == null) _g = 1.0;
	if(_r == null) _r = 1.0;
	this.refreshing = false;
	this.is_hsv = false;
	this.is_hsl = false;
	this.a = 1.0;
	this.b = 1.0;
	this.g = 1.0;
	this.r = 1.0;
	this.set_r(_r);
	this.set_g(_g);
	this.set_b(_b);
	this.a = _a;
};
phoenix.Color.__name__ = true;
phoenix.Color.random = function(_include_alpha) {
	if(_include_alpha == null) _include_alpha = false;
	return new phoenix.Color(Math.random(),Math.random(),Math.random(),_include_alpha?Math.random():1.0);
};
phoenix.Color.prototype = {
	r: null
	,g: null
	,b: null
	,a: null
	,is_hsl: null
	,is_hsv: null
	,refreshing: null
	,set_r: function(_r) {
		this.r = _r;
		if(!this.refreshing) {
			if(this.is_hsl) {
				var colorhsl = this;
				colorhsl.fromColor(this);
			} else if(this.is_hsv) {
				var colorhsv = this;
				colorhsv.fromColor(this);
			}
		}
		return this.r;
	}
	,set_g: function(_g) {
		this.g = _g;
		if(!this.refreshing) {
			if(this.is_hsl) {
				var colorhsl = this;
				colorhsl.fromColor(this);
			} else if(this.is_hsv) {
				var colorhsv = this;
				colorhsv.fromColor(this);
			}
		}
		return this.g;
	}
	,set_b: function(_b) {
		this.b = _b;
		if(!this.refreshing) {
			if(this.is_hsl) {
				var colorhsl = this;
				colorhsl.fromColor(this);
			} else if(this.is_hsv) {
				var colorhsv = this;
				colorhsv.fromColor(this);
			}
		}
		return this.b;
	}
	,set: function(_r,_g,_b,_a) {
		var _setr = this.r;
		var _setg = this.g;
		var _setb = this.b;
		var _seta = this.a;
		if(_r != null) _setr = _r;
		if(_g != null) _setg = _g;
		if(_b != null) _setb = _b;
		if(_a != null) _seta = _a;
		this.set_r(_setr);
		this.set_g(_setg);
		this.set_b(_setb);
		this.a = _seta;
		return this;
	}
	,maxRGB: function() {
		return Math.max(this.r,Math.max(this.g,this.b));
	}
	,minRGB: function() {
		return Math.min(this.r,Math.min(this.g,this.b));
	}
	,tween: function(_time_in_seconds,_properties_to_tween,_override) {
		if(_override == null) _override = true;
		if(_time_in_seconds == null) _time_in_seconds = 0.5;
		if(_properties_to_tween != null) {
			var _dest_r = this.r;
			var _dest_g = this.g;
			var _dest_b = this.b;
			var _dest_a = this.a;
			var _change_r = false;
			var _change_g = false;
			var _change_b = false;
			var _change_a = false;
			if(js.Boot.__instanceof(_properties_to_tween,phoenix.Color)) {
				_dest_r = _properties_to_tween.r;
				_dest_g = _properties_to_tween.g;
				_dest_b = _properties_to_tween.b;
				_dest_a = _properties_to_tween.a;
				_change_r = true;
				_change_g = true;
				_change_b = true;
				_change_a = true;
			} else {
				if(_properties_to_tween.r != null) {
					_dest_r = _properties_to_tween.r;
					_change_r = true;
				}
				if(_properties_to_tween.g != null) {
					_dest_g = _properties_to_tween.g;
					_change_g = true;
				}
				if(_properties_to_tween.b != null) {
					_dest_b = _properties_to_tween.b;
					_change_b = true;
				}
				if(_properties_to_tween.a != null) {
					_dest_a = _properties_to_tween.a;
					_change_a = true;
				}
			}
			var _properties = { };
			if(_change_r) _properties.r = _dest_r;
			if(_change_g) _properties.g = _dest_g;
			if(_change_b) _properties.b = _dest_b;
			if(_change_a) _properties.a = _dest_a;
			return luxe.tween.Actuate.tween(this,_time_in_seconds,_properties,_override);
		} else throw " Warning: Color.tween passed a null destination ";
	}
	,clone: function() {
		return new phoenix.Color(this.r,this.g,this.b,this.a);
	}
	,rgb: function(_rgb) {
		if(_rgb == null) _rgb = 16777215;
		this.from_int(_rgb);
		return this;
	}
	,argb: function(_argb) {
		if(_argb == null) _argb = -1;
		this.from_int_a(_argb);
		return this;
	}
	,toRGBInt: function() {
		var _r = this.r * 255 | 0;
		var _g = this.g * 255 | 0;
		var _b = this.b * 255 | 0;
		return _r << 16 | _g << 8 | _b;
	}
	,toARGBInt: function() {
		var _a = this.a * 255 | 0;
		var _r = this.r * 255 | 0;
		var _g = this.g * 255 | 0;
		var _b = this.b * 255 | 0;
		return _a << 24 | _r << 16 | _g << 8 | _b;
	}
	,toColorHSL: function() {
		return new phoenix.ColorHSL().fromColor(this);
	}
	,toColorHSV: function() {
		return new phoenix.ColorHSV().fromColor(this);
	}
	,fromColorHSV: function(_color_hsv) {
		var d = _color_hsv.h % 360 / 60;
		if(d < 0) d += 6;
		var hf = Math.floor(d);
		var hi = hf % 6;
		var f = d - hf;
		var v = _color_hsv.v;
		var p = _color_hsv.v * (1 - _color_hsv.s);
		var q = _color_hsv.v * (1 - f * _color_hsv.s);
		var t = _color_hsv.v * (1 - (1 - f) * _color_hsv.s);
		switch(hi) {
		case 0:
			this.set_r(v);
			this.set_g(t);
			this.set_b(p);
			break;
		case 1:
			this.set_r(q);
			this.set_g(v);
			this.set_b(p);
			break;
		case 2:
			this.set_r(p);
			this.set_g(v);
			this.set_b(t);
			break;
		case 3:
			this.set_r(p);
			this.set_g(q);
			this.set_b(v);
			break;
		case 4:
			this.set_r(t);
			this.set_g(p);
			this.set_b(v);
			break;
		case 5:
			this.set_r(v);
			this.set_g(p);
			this.set_b(q);
			break;
		}
		this.a = _color_hsv.a;
	}
	,fromColorHSL: function(_color_hsl) {
		var q = 1;
		if(_color_hsl.l < 0.5) q = _color_hsl.l * (1 + _color_hsl.s); else q = _color_hsl.l + _color_hsl.s - _color_hsl.l * _color_hsl.s;
		var p = 2 * _color_hsl.l - q;
		var hk = _color_hsl.h % 360 / 360;
		var tr = hk + 0.33333333333333331;
		var tg = hk;
		var tb = hk - 0.33333333333333331;
		var tc = [tr,tg,tb];
		var _g1 = 0;
		var _g = tc.length;
		while(_g1 < _g) {
			var n = _g1++;
			var t = tc[n];
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 0.16666666666666666) tc[n] = p + (q - p) * 6 * t; else if(t < 0.5) tc[n] = q; else if(t < 0.66666666666666663) tc[n] = p + (q - p) * 6 * (0.66666666666666663 - t); else tc[n] = p;
		}
		this.set_r(tc[0]);
		this.set_g(tc[1]);
		this.set_b(tc[2]);
		this.a = _color_hsl.a;
		return this;
	}
	,toString: function() {
		return "{ r:" + this.r + " , g:" + this.g + " , b:" + this.b + " , a:" + this.a + " }";
	}
	,from_int: function(_i) {
		var _r = _i >> 16;
		var _g = _i >> 8 & 255;
		var _b = _i & 255;
		this.set_r(_r / 255);
		this.set_g(_g / 255);
		this.set_b(_b / 255);
	}
	,from_int_a: function(_i) {
		var _a = _i >> 24 & 255;
		var _r = _i >> 16 & 255;
		var _g = _i >> 8 & 255;
		var _b = _i & 255;
		this.a = _a / 255;
		this.set_r(_r / 255);
		this.set_g(_g / 255);
		this.set_b(_b / 255);
	}
	,__class__: phoenix.Color
	,__properties__: {set_b:"set_b",set_g:"set_g",set_r:"set_r"}
};
phoenix.ColorHSL = function(_h,_s,_l,_a) {
	if(_a == null) _a = 1.0;
	if(_l == null) _l = 1.0;
	if(_s == null) _s = 1.0;
	if(_h == null) _h = 0.0;
	this.l = 1.0;
	this.s = 1.0;
	this.h = 0.0;
	phoenix.Color.call(this);
	this.is_hsl = true;
	this.set_h(_h);
	this.set_s(_s);
	this.set_l(_l);
	this.a = _a;
	this._refresh();
};
phoenix.ColorHSL.__name__ = true;
phoenix.ColorHSL.__super__ = phoenix.Color;
phoenix.ColorHSL.prototype = $extend(phoenix.Color.prototype,{
	h: null
	,s: null
	,l: null
	,set_h: function(_h) {
		this.h = _h;
		this._refresh();
		return _h;
	}
	,set_s: function(_s) {
		this.s = _s;
		this._refresh();
		return _s;
	}
	,set_l: function(_l) {
		this.l = _l;
		this._refresh();
		return _l;
	}
	,set: function(_h,_s,_l,_a) {
		var _seth = this.h;
		var _sets = this.s;
		var _setl = this.l;
		var _seta = this.a;
		if(_h != null) _seth = _h;
		if(_s != null) _sets = _s;
		if(_l != null) _setl = _l;
		if(_a != null) _seta = _a;
		this.set_h(_seth);
		this.set_s(_sets);
		this.set_l(_setl);
		this.a = _seta;
		this._refresh();
		return this;
	}
	,tween: function(_time_in_seconds,_dest,_override) {
		if(_override == null) _override = true;
		if(_time_in_seconds == null) _time_in_seconds = 0.5;
		phoenix.Color.prototype.tween.call(this,_time_in_seconds,_dest,_override);
		if(_dest != null) {
			var _dest_h = this.h;
			var _dest_s = this.s;
			var _dest_l = this.l;
			var _dest_a = this.a;
			var _change_h = false;
			var _change_s = false;
			var _change_l = false;
			var _change_a = false;
			if(js.Boot.__instanceof(_dest,phoenix.ColorHSL)) {
				_dest_h = _dest.h;
				_dest_s = _dest.s;
				_dest_l = _dest.l;
				_dest_a = _dest.a;
				_change_h = true;
				_change_s = true;
				_change_l = true;
				_change_a = true;
			} else {
				if(_dest.h != null) {
					_dest_h = _dest.h;
					_change_h = true;
				}
				if(_dest.s != null) {
					_dest_s = _dest.s;
					_change_s = true;
				}
				if(_dest.l != null) {
					_dest_l = _dest.l;
					_change_l = true;
				}
				if(_dest.a != null) {
					_dest_a = _dest.a;
					_change_a = true;
				}
			}
			var _properties = { };
			if(_change_h) _properties.h = _dest_h;
			if(_change_s) _properties.s = _dest_s;
			if(_change_l) _properties.l = _dest_l;
			if(_change_a) _properties.a = _dest_a;
			return luxe.tween.Actuate.tween(this,_time_in_seconds,_properties,_override);
		} else throw " Warning: Color.tween passed a null destination ";
	}
	,_refresh: function() {
		this.refreshing = true;
		phoenix.Color.prototype.fromColorHSL.call(this,this);
		this.refreshing = false;
		return this;
	}
	,clone: function() {
		return new phoenix.ColorHSL(this.h,this.s,this.l,this.a);
	}
	,toColor: function() {
		return this._refresh();
	}
	,fromColor: function(_color) {
		var max = _color.maxRGB();
		var min = _color.minRGB();
		var add = max + min;
		var sub = max - min;
		var _h = 0;
		if(max == min) _h = 0; else if(max == _color.r) _h = (60 * (_color.g - _color.b) / sub + 360) % 360; else if(max == _color.g) _h = 60 * (_color.b - _color.r) / sub + 120; else if(max == _color.b) _h = 60 * (_color.r - _color.g) / sub + 240;
		var _l = add / 2;
		var _s;
		if(max == min) _s = 0; else if(this.l <= 0.5) _s = sub / add; else _s = sub / (2 - add);
		this.set_h(_h);
		this.set_s(_s);
		this.set_l(_l);
		this.a = _color.a;
		return this;
	}
	,toString: function() {
		return "{ h:" + this.h + " , s:" + this.s + " , l:" + this.l + " , a:" + this.a + " }";
	}
	,__class__: phoenix.ColorHSL
	,__properties__: $extend(phoenix.Color.prototype.__properties__,{set_l:"set_l",set_s:"set_s",set_h:"set_h"})
});
phoenix.ColorHSV = function(_h,_s,_v,_a) {
	if(_a == null) _a = 1.0;
	if(_v == null) _v = 1.0;
	if(_s == null) _s = 0.0;
	if(_h == null) _h = 0.0;
	this.v = 1.0;
	this.s = 0.0;
	this.h = 0.0;
	phoenix.Color.call(this);
	this.is_hsv = true;
	this.set_h(_h);
	this.set_s(_s);
	this.set_v(_v);
	this.a = _a;
	this._refresh();
};
phoenix.ColorHSV.__name__ = true;
phoenix.ColorHSV.__super__ = phoenix.Color;
phoenix.ColorHSV.prototype = $extend(phoenix.Color.prototype,{
	h: null
	,s: null
	,v: null
	,set_h: function(_h) {
		this.h = _h;
		this._refresh();
		return _h;
	}
	,set_s: function(_s) {
		this.s = _s;
		this._refresh();
		return this.s;
	}
	,set_v: function(_v) {
		this.v = _v;
		this._refresh();
		return this.v;
	}
	,set: function(_h,_s,_v,_a) {
		var _seth = this.h;
		var _sets = this.s;
		var _setv = this.v;
		var _seta = this.a;
		if(_h != null) _seth = _h;
		if(_s != null) _sets = _s;
		if(_v != null) _setv = _v;
		if(_a != null) _seta = _a;
		this.set_h(_seth);
		this.set_s(_sets);
		this.set_v(_setv);
		this.a = _seta;
		this._refresh();
		return this;
	}
	,tween: function(_time_in_seconds,_dest,_override) {
		if(_override == null) _override = true;
		if(_time_in_seconds == null) _time_in_seconds = 0.5;
		phoenix.Color.prototype.tween.call(this,_time_in_seconds,_dest,_override);
		if(_dest != null) {
			var _dest_h = this.h;
			var _dest_s = this.s;
			var _dest_v = this.v;
			var _dest_a = this.a;
			var _change_h = false;
			var _change_s = false;
			var _change_v = false;
			var _change_a = false;
			if(js.Boot.__instanceof(_dest,phoenix.ColorHSV)) {
				_dest_h = _dest.h;
				_dest_s = _dest.s;
				_dest_v = _dest.v;
				_dest_a = _dest.a;
				_change_h = true;
				_change_s = true;
				_change_v = true;
				_change_a = true;
			} else {
				if(_dest.h != null) {
					_dest_h = _dest.h;
					_change_h = true;
				}
				if(_dest.s != null) {
					_dest_s = _dest.s;
					_change_s = true;
				}
				if(_dest.v != null) {
					_dest_v = _dest.v;
					_change_v = true;
				}
				if(_dest.a != null) {
					_dest_a = _dest.a;
					_change_a = true;
				}
			}
			var _properties = { };
			if(_change_h) _properties.h = _dest_h;
			if(_change_s) _properties.s = _dest_s;
			if(_change_v) _properties.v = _dest_v;
			if(_change_a) _properties.a = _dest_a;
			return luxe.tween.Actuate.tween(this,_time_in_seconds,_properties,_override);
		} else throw " Warning: Color.tween passed a null destination ";
	}
	,_refresh: function() {
		this.refreshing = true;
		phoenix.Color.prototype.fromColorHSV.call(this,this);
		this.refreshing = false;
		return this;
	}
	,clone: function() {
		return new phoenix.ColorHSV(this.h,this.s,this.v,this.a);
	}
	,toColor: function() {
		return this._refresh();
	}
	,toColorHSL: function() {
		this._refresh();
		return phoenix.Color.prototype.toColorHSL.call(this);
	}
	,fromColorHSL: function(_color_hsl) {
		_color_hsl._refresh();
		return this.fromColor(_color_hsl);
	}
	,fromColor: function(_color) {
		var max = _color.maxRGB();
		var min = _color.minRGB();
		var add = max + min;
		var sub = max - min;
		var _h = 0;
		if(max == min) _h = 0; else if(max == _color.r) _h = (60 * (_color.g - _color.b) / sub + 360) % 360; else if(max == _color.g) _h = 60 * (_color.b - _color.r) / sub + 120; else if(max == _color.b) _h = 60 * (_color.r - _color.g) / sub + 240;
		var _s;
		if(max == 0) _s = 0; else _s = 1 - min / max;
		this.set_h(_h);
		this.set_s(_s);
		this.set_v(max);
		this.a = _color.a;
		return this;
	}
	,toString: function() {
		return "{ h:" + this.h + " , s:" + this.s + " , v:" + this.v + " , a:" + this.a + " }";
	}
	,__class__: phoenix.ColorHSV
	,__properties__: $extend(phoenix.Color.prototype.__properties__,{set_v:"set_v",set_s:"set_s",set_h:"set_h"})
});
phoenix.MatrixTransform = function(p,r,s) {
	this.pos = p;
	this.rotation = r;
	this.scale = s;
};
phoenix.MatrixTransform.__name__ = true;
phoenix.MatrixTransform.prototype = {
	pos: null
	,rotation: null
	,scale: null
	,destroy: function() {
		this.pos = null;
		this.rotation = null;
		this.scale = null;
	}
	,__class__: phoenix.MatrixTransform
};
phoenix.Matrix = function(n11,n12,n13,n14,n21,n22,n23,n24,n31,n32,n33,n34,n41,n42,n43,n44) {
	if(n44 == null) n44 = 1;
	if(n43 == null) n43 = 0;
	if(n42 == null) n42 = 0;
	if(n41 == null) n41 = 0;
	if(n34 == null) n34 = 0;
	if(n33 == null) n33 = 1;
	if(n32 == null) n32 = 0;
	if(n31 == null) n31 = 0;
	if(n24 == null) n24 = 0;
	if(n23 == null) n23 = 0;
	if(n22 == null) n22 = 1;
	if(n21 == null) n21 = 0;
	if(n14 == null) n14 = 0;
	if(n13 == null) n13 = 0;
	if(n12 == null) n12 = 0;
	if(n11 == null) n11 = 1;
	this.M44 = 1;
	this.M34 = 0;
	this.M24 = 0;
	this.M14 = 0;
	this.M43 = 0;
	this.M33 = 1;
	this.M23 = 0;
	this.M13 = 0;
	this.M42 = 0;
	this.M32 = 0;
	this.M22 = 1;
	this.M12 = 0;
	this.M41 = 0;
	this.M31 = 0;
	this.M21 = 0;
	this.M11 = 1;
	this.elements = new Array();
	var i = 0;
	while(i++ < 16) this.elements.push(0.0);
	this.set(n11,n12,n13,n14,n21,n22,n23,n24,n31,n32,n33,n34,n41,n42,n43,n44);
	this._float32array = new Float32Array(this.elements);
};
phoenix.Matrix.__name__ = true;
phoenix.Matrix.prototype = {
	elements: null
	,_float32array: null
	,M11: null
	,M21: null
	,M31: null
	,M41: null
	,M12: null
	,M22: null
	,M32: null
	,M42: null
	,M13: null
	,M23: null
	,M33: null
	,M43: null
	,M14: null
	,M24: null
	,M34: null
	,M44: null
	,set: function(n11,n12,n13,n14,n21,n22,n23,n24,n31,n32,n33,n34,n41,n42,n43,n44) {
		var e = this.elements;
		e[0] = n11;
		e[4] = n12;
		e[8] = n13;
		e[12] = n14;
		e[1] = n21;
		e[5] = n22;
		e[9] = n23;
		e[13] = n24;
		e[2] = n31;
		e[6] = n32;
		e[10] = n33;
		e[14] = n34;
		e[3] = n41;
		e[7] = n42;
		e[11] = n43;
		e[15] = n44;
		return this;
	}
	,toString: function() {
		var e = this.elements;
		var str = "{ 11:" + luxe.utils.Maths.fixed(e[0],3) + ", 12:" + luxe.utils.Maths.fixed(e[4],3) + ", 13:" + luxe.utils.Maths.fixed(e[8],3) + ", 14:" + luxe.utils.Maths.fixed(e[12],3) + " }, " + "{ 21:" + luxe.utils.Maths.fixed(e[1],3) + ", 22:" + luxe.utils.Maths.fixed(e[5],3) + ", 23:" + luxe.utils.Maths.fixed(e[9],3) + ", 24:" + luxe.utils.Maths.fixed(e[13],3) + " }, " + "{ 31:" + luxe.utils.Maths.fixed(e[2],3) + ", 32:" + luxe.utils.Maths.fixed(e[6],3) + ", 33:" + luxe.utils.Maths.fixed(e[10],3) + ", 34:" + luxe.utils.Maths.fixed(e[14],3) + " }, " + "{ 41:" + luxe.utils.Maths.fixed(e[3],3) + ", 42:" + luxe.utils.Maths.fixed(e[7],3) + ", 43:" + luxe.utils.Maths.fixed(e[11],3) + ", 44:" + luxe.utils.Maths.fixed(e[15],3) + " }";
		return str;
	}
	,get_M11: function() {
		return this.elements[0];
	}
	,get_M12: function() {
		return this.elements[1];
	}
	,get_M13: function() {
		return this.elements[2];
	}
	,get_M14: function() {
		return this.elements[3];
	}
	,get_M21: function() {
		return this.elements[4];
	}
	,get_M22: function() {
		return this.elements[5];
	}
	,get_M23: function() {
		return this.elements[6];
	}
	,get_M24: function() {
		return this.elements[7];
	}
	,get_M31: function() {
		return this.elements[8];
	}
	,get_M32: function() {
		return this.elements[9];
	}
	,get_M33: function() {
		return this.elements[10];
	}
	,get_M34: function() {
		return this.elements[11];
	}
	,get_M41: function() {
		return this.elements[12];
	}
	,get_M42: function() {
		return this.elements[13];
	}
	,get_M43: function() {
		return this.elements[14];
	}
	,get_M44: function() {
		return this.elements[15];
	}
	,set_M11: function(_value) {
		this.elements[0] = _value;
		return _value;
	}
	,set_M12: function(_value) {
		this.elements[1] = _value;
		return _value;
	}
	,set_M13: function(_value) {
		this.elements[2] = _value;
		return _value;
	}
	,set_M14: function(_value) {
		this.elements[3] = _value;
		return _value;
	}
	,set_M21: function(_value) {
		this.elements[4] = _value;
		return _value;
	}
	,set_M22: function(_value) {
		this.elements[5] = _value;
		return _value;
	}
	,set_M23: function(_value) {
		this.elements[6] = _value;
		return _value;
	}
	,set_M24: function(_value) {
		this.elements[7] = _value;
		return _value;
	}
	,set_M31: function(_value) {
		this.elements[8] = _value;
		return _value;
	}
	,set_M32: function(_value) {
		this.elements[9] = _value;
		return _value;
	}
	,set_M33: function(_value) {
		this.elements[10] = _value;
		return _value;
	}
	,set_M34: function(_value) {
		this.elements[11] = _value;
		return _value;
	}
	,set_M41: function(_value) {
		this.elements[12] = _value;
		return _value;
	}
	,set_M42: function(_value) {
		this.elements[13] = _value;
		return _value;
	}
	,set_M43: function(_value) {
		this.elements[14] = _value;
		return _value;
	}
	,set_M44: function(_value) {
		this.elements[15] = _value;
		return _value;
	}
	,float32array: function() {
		return new Float32Array(this.elements);
	}
	,identity: function() {
		this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
		return this;
	}
	,copy: function(m) {
		var me = m.elements;
		this.set(me[0],me[4],me[8],me[12],me[1],me[5],me[9],me[13],me[2],me[6],me[10],me[14],me[3],me[7],me[11],me[15]);
		return this;
	}
	,make2D: function(_x,_y,_scale,_rotation) {
		if(_rotation == null) _rotation = 0;
		if(_scale == null) _scale = 1;
		var theta = _rotation * 0.017453292519943278;
		var c = Math.cos(theta);
		var s = Math.sin(theta);
		this.set(c * _scale,s * _scale,0,_x,-s * _scale,c * _scale,0,_y,0,0,1,0,0,0,0,1);
		return this;
	}
	,copyPosition: function(m) {
		this.elements[12] = m.elements[12];
		this.elements[13] = m.elements[13];
		this.elements[14] = m.elements[14];
		return this;
	}
	,getPosition: function() {
		return new phoenix.Vector(this.elements[12],this.elements[13],this.elements[14],1);
	}
	,extractRotation: function(m) {
		var _temp = new phoenix.Vector();
		var me = m.elements;
		var _scale_x = 1 / _temp.set_xyz(me[0],me[1],me[2]).get_length();
		var _scale_y = 1 / _temp.set_xyz(me[4],me[5],me[6]).get_length();
		var _scale_z = 1 / _temp.set_xyz(me[8],me[9],me[10]).get_length();
		this.elements[0] = me[0] * _scale_x;
		this.elements[1] = me[1] * _scale_x;
		this.elements[2] = me[2] * _scale_x;
		this.elements[4] = me[4] * _scale_y;
		this.elements[5] = me[5] * _scale_y;
		this.elements[6] = me[6] * _scale_y;
		this.elements[8] = me[8] * _scale_z;
		this.elements[9] = me[9] * _scale_z;
		this.elements[10] = me[10] * _scale_z;
		return this;
	}
	,makeRotationFromEuler: function(_v,_order) {
		if(_order == null) _order = 0;
		var te = this.elements;
		var x = _v.x;
		var y = _v.y;
		var z = _v.z;
		var a = Math.cos(x);
		var b = Math.sin(x);
		var c = Math.cos(y);
		var d = Math.sin(y);
		var e = Math.cos(z);
		var f = Math.sin(z);
		if(_order == 0) {
			var ae = a * e;
			var af = a * f;
			var be = b * e;
			var bf = b * f;
			te[0] = c * e;
			te[4] = -c * f;
			te[8] = d;
			te[1] = af + be * d;
			te[5] = ae - bf * d;
			te[9] = -b * c;
			te[2] = bf - ae * d;
			te[6] = be + af * d;
			te[10] = a * c;
		} else if(_order == 1) {
			var ce = c * e;
			var cf = c * f;
			var de = d * e;
			var df = d * f;
			te[0] = ce + df * b;
			te[4] = de * b - cf;
			te[8] = a * d;
			te[1] = a * f;
			te[5] = a * e;
			te[9] = -b;
			te[2] = cf * b - de;
			te[6] = df + ce * b;
			te[10] = a * c;
		} else if(_order == 2) {
			var ce1 = c * e;
			var cf1 = c * f;
			var de1 = d * e;
			var df1 = d * f;
			te[0] = ce1 - df1 * b;
			te[4] = -a * f;
			te[8] = de1 + cf1 * b;
			te[1] = cf1 + de1 * b;
			te[5] = a * e;
			te[9] = df1 - ce1 * b;
			te[2] = -a * d;
			te[6] = b;
			te[10] = a * c;
		} else if(_order == 3) {
			var ae1 = a * e;
			var af1 = a * f;
			var be1 = b * e;
			var bf1 = b * f;
			te[0] = c * e;
			te[4] = be1 * d - af1;
			te[8] = ae1 * d + bf1;
			te[1] = c * f;
			te[5] = bf1 * d + ae1;
			te[9] = af1 * d - be1;
			te[2] = -d;
			te[6] = b * c;
			te[10] = a * c;
		} else if(_order == 4) {
			var ac = a * c;
			var ad = a * d;
			var bc = b * c;
			var bd = b * d;
			te[0] = c * e;
			te[4] = bd - ac * f;
			te[8] = bc * f + ad;
			te[1] = f;
			te[5] = a * e;
			te[9] = -b * e;
			te[2] = -d * e;
			te[6] = ad * f + bc;
			te[10] = ac - bd * f;
		} else if(_order == 5) {
			var ac1 = a * c;
			var ad1 = a * d;
			var bc1 = b * c;
			var bd1 = b * d;
			te[0] = c * e;
			te[4] = -f;
			te[8] = d * e;
			te[1] = ac1 * f + bd1;
			te[5] = a * e;
			te[9] = ad1 * f - bc1;
			te[2] = bc1 * f - ad1;
			te[6] = b * e;
			te[10] = bd1 * f + ac1;
		}
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;
		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}
	,makeRotationFromQuaternion: function(q) {
		var te = this.elements;
		var x2 = q.x + q.x;
		var y2 = q.y + q.y;
		var z2 = q.z + q.z;
		var xx = q.x * x2;
		var xy = q.x * y2;
		var xz = q.x * z2;
		var yy = q.y * y2;
		var yz = q.y * z2;
		var zz = q.z * z2;
		var wx = q.w * x2;
		var wy = q.w * y2;
		var wz = q.w * z2;
		te[0] = 1 - (yy + zz);
		te[4] = xy - wz;
		te[8] = xz + wy;
		te[1] = xy + wz;
		te[5] = 1 - (xx + zz);
		te[9] = yz - wx;
		te[2] = xz - wy;
		te[6] = yz + wx;
		te[10] = 1 - (xx + yy);
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;
		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;
		return this;
	}
	,lookAt: function(_eye,_target,_up) {
		var _x = new phoenix.Vector();
		var _y = new phoenix.Vector();
		var _z = new phoenix.Vector();
		var te = this.elements;
		_z = new phoenix.Vector(_target.x - _eye.x,_target.y - _eye.y,_target.z - _eye.z).get_normalized();
		if(Math.sqrt(_z.x * _z.x + _z.y * _z.y + _z.z * _z.z) == 0) {
			_z.z = 1;
			if(_z._construct) _z.z; else {
				if(_z.listen_z != null && !_z.ignore_listeners) _z.listen_z(1);
				_z.z;
			}
		}
		_x = new phoenix.Vector(_up.y * _z.z - _up.z * _z.y,_up.z * _z.x - _up.x * _z.z,_up.x * _z.y - _up.y * _z.x).get_normalized();
		if(Math.sqrt(_x.x * _x.x + _x.y * _x.y + _x.z * _x.z) == 0) {
			var _g = _z;
			_g.set_x(_g.x + 0.0001);
			_x = new phoenix.Vector(_up.y * _z.z - _up.z * _z.y,_up.z * _z.x - _up.x * _z.z,_up.x * _z.y - _up.y * _z.x).get_normalized();
		}
		_y = new phoenix.Vector(_z.y * _x.z - _z.z * _x.y,_z.z * _x.x - _z.x * _x.z,_z.x * _x.y - _z.y * _x.x);
		te[0] = _x.x;
		te[4] = _y.x;
		te[8] = _z.x;
		te[1] = _x.y;
		te[5] = _y.y;
		te[9] = _z.y;
		te[2] = _x.z;
		te[6] = _y.z;
		te[10] = _z.z;
		return this;
	}
	,multiply: function(_m) {
		return this.multiplyMatrices(this,_m);
	}
	,multiplyMatrices: function(_a,_b) {
		var ae = _a.elements;
		var be = _b.elements;
		var te = this.elements;
		var a11 = ae[0];
		var a12 = ae[4];
		var a13 = ae[8];
		var a14 = ae[12];
		var a21 = ae[1];
		var a22 = ae[5];
		var a23 = ae[9];
		var a24 = ae[13];
		var a31 = ae[2];
		var a32 = ae[6];
		var a33 = ae[10];
		var a34 = ae[14];
		var a41 = ae[3];
		var a42 = ae[7];
		var a43 = ae[11];
		var a44 = ae[15];
		var b11 = be[0];
		var b12 = be[4];
		var b13 = be[8];
		var b14 = be[12];
		var b21 = be[1];
		var b22 = be[5];
		var b23 = be[9];
		var b24 = be[13];
		var b31 = be[2];
		var b32 = be[6];
		var b33 = be[10];
		var b34 = be[14];
		var b41 = be[3];
		var b42 = be[7];
		var b43 = be[11];
		var b44 = be[15];
		te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
		te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
		te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
		te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
		return this;
	}
	,multiplyToArray: function(_a,_b,_r) {
		var te = this.elements;
		this.multiplyMatrices(_a,_b);
		_r[0] = te[0];
		_r[1] = te[1];
		_r[2] = te[2];
		_r[3] = te[3];
		_r[4] = te[4];
		_r[5] = te[5];
		_r[6] = te[6];
		_r[7] = te[7];
		_r[8] = te[8];
		_r[9] = te[9];
		_r[10] = te[10];
		_r[11] = te[11];
		_r[12] = te[12];
		_r[13] = te[13];
		_r[14] = te[14];
		_r[15] = te[15];
		return this;
	}
	,multiplyScalar: function(_s) {
		var te = this.elements;
		te[0] *= _s;
		te[4] *= _s;
		te[8] *= _s;
		te[12] *= _s;
		te[1] *= _s;
		te[5] *= _s;
		te[9] *= _s;
		te[13] *= _s;
		te[2] *= _s;
		te[6] *= _s;
		te[10] *= _s;
		te[14] *= _s;
		te[3] *= _s;
		te[7] *= _s;
		te[11] *= _s;
		te[15] *= _s;
		return this;
	}
	,multiplyVector3Array: function(_a) {
		var v1 = new phoenix.Vector();
		var i = 0;
		var il = _a.length;
		while(i < il) {
			v1.set_x(_a[i]);
			v1.set_y(_a[i + 1]);
			v1.set_z(_a[i + 2]);
			v1.applyProjection(this);
			_a[i] = v1.x;
			_a[i + 1] = v1.y;
			_a[i + 2] = v1.z;
			i += 3;
		}
		return _a;
	}
	,determinant: function() {
		var te = this.elements;
		var n11 = te[0];
		var n12 = te[4];
		var n13 = te[8];
		var n14 = te[12];
		var n21 = te[1];
		var n22 = te[5];
		var n23 = te[9];
		var n24 = te[13];
		var n31 = te[2];
		var n32 = te[6];
		var n33 = te[10];
		var n34 = te[14];
		var n41 = te[3];
		var n42 = te[7];
		var n43 = te[11];
		var n44 = te[15];
		return n41 * (n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
	}
	,transpose: function() {
		var te = this.elements;
		var tmp;
		tmp = te[1];
		te[1] = te[4];
		te[4] = tmp;
		tmp = te[2];
		te[2] = te[8];
		te[8] = tmp;
		tmp = te[6];
		te[6] = te[9];
		te[9] = tmp;
		tmp = te[3];
		te[3] = te[12];
		te[12] = tmp;
		tmp = te[7];
		te[7] = te[13];
		te[13] = tmp;
		tmp = te[11];
		te[11] = te[14];
		te[14] = tmp;
		return this;
	}
	,flattenToArray: function(_flat) {
		if(_flat == null) {
			_flat = new Array();
			var _g = 0;
			while(_g < 16) {
				var i = _g++;
				_flat.push(0.0);
			}
		}
		var te = this.elements;
		_flat[0] = te[0];
		_flat[1] = te[1];
		_flat[2] = te[2];
		_flat[3] = te[3];
		_flat[4] = te[4];
		_flat[5] = te[5];
		_flat[6] = te[6];
		_flat[7] = te[7];
		_flat[8] = te[8];
		_flat[9] = te[9];
		_flat[10] = te[10];
		_flat[11] = te[11];
		_flat[12] = te[12];
		_flat[13] = te[13];
		_flat[14] = te[14];
		_flat[15] = te[15];
		return _flat;
	}
	,flattenToArrayOffset: function(_flat,_offset) {
		var te = this.elements;
		_flat[_offset] = te[0];
		_flat[_offset + 1] = te[1];
		_flat[_offset + 2] = te[2];
		_flat[_offset + 3] = te[3];
		_flat[_offset + 4] = te[4];
		_flat[_offset + 5] = te[5];
		_flat[_offset + 6] = te[6];
		_flat[_offset + 7] = te[7];
		_flat[_offset + 8] = te[8];
		_flat[_offset + 9] = te[9];
		_flat[_offset + 10] = te[10];
		_flat[_offset + 11] = te[11];
		_flat[_offset + 12] = te[12];
		_flat[_offset + 13] = te[13];
		_flat[_offset + 14] = te[14];
		_flat[_offset + 15] = te[15];
		return _flat;
	}
	,setPosition: function(_v) {
		var te = this.elements;
		te[12] = _v.x;
		te[13] = _v.y;
		te[14] = _v.z;
		return this;
	}
	,inverse: function() {
		return this.clone().getInverse(this);
	}
	,getInverse: function(_m) {
		var te = this.elements;
		var me = _m.elements;
		var n11 = me[0];
		var n12 = me[4];
		var n13 = me[8];
		var n14 = me[12];
		var n21 = me[1];
		var n22 = me[5];
		var n23 = me[9];
		var n24 = me[13];
		var n31 = me[2];
		var n32 = me[6];
		var n33 = me[10];
		var n34 = me[14];
		var n41 = me[3];
		var n42 = me[7];
		var n43 = me[11];
		var n44 = me[15];
		te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
		var det = me[0] * te[0] + me[1] * te[4] + me[2] * te[8] + me[3] * te[12];
		if(det == 0) {
			haxe.Log.trace("Matrix.getInverse: cant invert matrix, determinant is 0",{ fileName : "Matrix.hx", lineNumber : 699, className : "phoenix.Matrix", methodName : "getInverse"});
			this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
			this;
			return this;
		}
		this.multiplyScalar(1 / det);
		return this;
	}
	,scale: function(_v) {
		var te = this.elements;
		var _x = _v.x;
		var _y = _v.y;
		var _z = _v.z;
		te[0] *= _x;
		te[4] *= _y;
		te[8] *= _z;
		te[1] *= _x;
		te[5] *= _y;
		te[9] *= _z;
		te[2] *= _x;
		te[6] *= _y;
		te[10] *= _z;
		te[3] *= _x;
		te[7] *= _y;
		te[11] *= _z;
		return this;
	}
	,getMaxScaleOnAxis: function() {
		var te = this.elements;
		var _scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
		var _scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
		var _scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
		return Math.sqrt(Math.max(_scaleXSq,Math.max(_scaleYSq,_scaleZSq)));
	}
	,makeTranslation: function(_x,_y,_z) {
		this.set(1,0,0,_x,0,1,0,_y,0,0,1,_z,0,0,0,1);
		return this;
	}
	,makeRotationX: function(_theta) {
		var _c = Math.cos(_theta);
		var _s = Math.sin(_theta);
		this.set(1,0,0,0,0,_c,-_s,0,0,_s,_c,0,0,0,0,1);
		return this;
	}
	,makeRotationY: function(_theta) {
		var _c = Math.cos(_theta);
		var _s = Math.sin(_theta);
		this.set(_c,0,_s,0,0,1,0,0,-_s,0,_c,0,0,0,0,1);
		return this;
	}
	,makeRotationZ: function(_theta) {
		var _c = Math.cos(_theta);
		var _s = Math.sin(_theta);
		this.set(_c,-_s,0,0,_s,_c,0,0,0,0,1,0,0,0,0,1);
		return this;
	}
	,makeRotationAxis: function(_axis,_angle) {
		var _c = Math.cos(_angle);
		var _s = Math.sin(_angle);
		var _t = 1 - _c;
		var _ax = _axis.x;
		var _ay = _axis.y;
		var _az = _axis.z;
		var _tx = _t * _ax;
		var _ty = _t * _ay;
		this.set(_tx * _ax + _c,_tx * _ay - _s * _az,_tx * _az + _s * _ay,0,_tx * _ay + _s * _az,_ty * _ay + _c,_ty * _az - _s * _ax,0,_tx * _az - _s * _ay,_ty * _az + _s * _ax,_t * _az * _az + _c,0,0,0,0,1);
		return this;
	}
	,makeScale: function(_x,_y,_z) {
		this.set(_x,0,0,0,0,_y,0,0,0,0,_z,0,0,0,0,1);
		return this;
	}
	,compose_with_origin: function(_position,_origin,_quaternion,_scale) {
		this.set(1,0,0,_origin.x,0,1,0,_origin.y,0,0,1,_origin.z,0,0,0,1);
		this;
		this.scale(_scale);
		this.multiply(new phoenix.Matrix().makeRotationFromQuaternion(_quaternion));
		this.multiply(new phoenix.Matrix().makeTranslation(-_origin.x,-_origin.y,-_origin.z));
		this.multiply(new phoenix.Matrix().makeTranslation(_position.x,_position.y,_position.z));
		return this;
	}
	,compose: function(_position,_quaternion,_scale) {
		this.makeRotationFromQuaternion(_quaternion);
		this.scale(_scale);
		this.setPosition(_position);
		return this;
	}
	,_transform: null
	,decompose: function(_position,_quaternion,_scale) {
		var te = this.elements;
		var matrix = new phoenix.Matrix();
		var _ax_x = te[0];
		var _ax_y = te[1];
		var _ax_z = te[2];
		var _ay_x = te[4];
		var _ay_y = te[5];
		var _ay_z = te[6];
		var _az_x = te[8];
		var _az_y = te[9];
		var _az_z = te[10];
		var _ax_length = Math.sqrt(_ax_x * _ax_x + _ax_y * _ax_y + _ax_z * _ax_z);
		var _ay_length = Math.sqrt(_ay_x * _ay_x + _ay_y * _ay_y + _ay_z * _ay_z);
		var _az_length = Math.sqrt(_az_x * _az_x + _az_y * _az_y + _az_z * _az_z);
		if(_quaternion == null) _quaternion = new phoenix.Quaternion();
		if(_position == null) _position = new phoenix.Vector(te[12],te[13],te[14]); else {
			_position.set_x(te[12]);
			_position.set_y(te[13]);
			_position.set_z(te[14]);
		}
		if(_scale == null) _scale = new phoenix.Vector(_ax_length,_ay_length,_az_length); else {
			_scale.x = _ax_length;
			if(_scale._construct) _scale.x; else {
				if(_scale.listen_x != null && !_scale.ignore_listeners) _scale.listen_x(_ax_length);
				_scale.x;
			}
			_scale.y = _ay_length;
			if(_scale._construct) _scale.y; else {
				if(_scale.listen_y != null && !_scale.ignore_listeners) _scale.listen_y(_ay_length);
				_scale.y;
			}
			_scale.z = _az_length;
			if(_scale._construct) _scale.z; else {
				if(_scale.listen_z != null && !_scale.ignore_listeners) _scale.listen_z(_az_length);
				_scale.z;
			}
		}
		matrix.elements = this.elements.concat([]);
		var me = matrix.elements;
		me[0] /= _ax_length;
		me[1] /= _ax_length;
		me[2] /= _ax_length;
		me[4] /= _ay_length;
		me[5] /= _ay_length;
		me[6] /= _ay_length;
		me[8] /= _az_length;
		me[9] /= _az_length;
		me[10] /= _az_length;
		_quaternion.setFromRotationMatrix(matrix);
		if(this._transform == null) this._transform = new phoenix.MatrixTransform(_position,_quaternion,_scale); else {
			this._transform.pos = _position;
			this._transform.rotation = _quaternion;
			this._transform.scale = _scale;
		}
		return this._transform;
	}
	,makeFrustum: function(_left,_right,_bottom,_top,_near,_far) {
		var te = this.elements;
		var tx = 2 * _near / (_right - _left);
		var ty = 2 * _near / (_top - _bottom);
		var a = (_right + _left) / (_right - _left);
		var b = (_top + _bottom) / (_top - _bottom);
		var c = -(_far + _near) / (_far - _near);
		var d = -2 * _far * _near / (_far - _near);
		te[0] = tx;
		te[4] = 0;
		te[8] = a;
		te[12] = 0;
		te[1] = 0;
		te[5] = ty;
		te[9] = b;
		te[13] = 0;
		te[2] = 0;
		te[6] = 0;
		te[10] = c;
		te[14] = d;
		te[3] = 0;
		te[7] = 0;
		te[11] = -1;
		te[15] = 0;
		return this;
	}
	,makePerspective: function(_fov,_aspect,_near,_far) {
		var ymax = _near * Math.tan(_fov * 0.5 * 0.017453292519943278);
		var ymin = -ymax;
		var xmin = ymin * _aspect;
		var xmax = ymax * _aspect;
		return this.makeFrustum(xmin,xmax,ymin,ymax,_near,_far);
	}
	,makeOrthographic: function(_left,_right,_top,_bottom,_near,_far) {
		var te = this.elements;
		var w = _right - _left;
		var h = _top - _bottom;
		var p = _far - _near;
		var tx = (_right + _left) / w;
		var ty = (_top + _bottom) / h;
		var tz = (_far + _near) / p;
		te[0] = 2 / w;
		te[4] = 0;
		te[8] = 0;
		te[12] = -tx;
		te[1] = 0;
		te[5] = 2 / h;
		te[9] = 0;
		te[13] = -ty;
		te[2] = 0;
		te[6] = 0;
		te[10] = -2 / p;
		te[14] = -tz;
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;
		te[15] = 1;
		return this;
	}
	,fromArray: function(_from) {
		this.elements = _from.concat([]);
	}
	,toArray: function() {
		var te = this.elements;
		return [te[0],te[1],te[2],te[3],te[4],te[5],te[6],te[7],te[8],te[9],te[10],te[11],te[12],te[13],te[14],te[15]];
	}
	,clone: function() {
		var te = this.elements;
		return new phoenix.Matrix(te[0],te[4],te[8],te[12],te[1],te[5],te[9],te[13],te[2],te[6],te[10],te[14],te[3],te[7],te[11],te[15]);
	}
	,up: function() {
		return new phoenix.Vector(this.elements[4],this.elements[5],this.elements[10]);
	}
	,down: function() {
		return new phoenix.Vector(this.elements[4],this.elements[5],this.elements[10]).get_inverted();
	}
	,left: function() {
		return new phoenix.Vector(this.elements[0],this.elements[1],this.elements[2]).get_inverted();
	}
	,right: function() {
		return new phoenix.Vector(this.elements[0],this.elements[1],this.elements[2]);
	}
	,backward: function() {
		return new phoenix.Vector(this.elements[8],this.elements[9],this.elements[10]);
	}
	,forward: function() {
		return new phoenix.Vector(this.elements[8],this.elements[9],this.elements[10]).get_inverted();
	}
	,__class__: phoenix.Matrix
	,__properties__: {set_M44:"set_M44",get_M44:"get_M44",set_M34:"set_M34",get_M34:"get_M34",set_M24:"set_M24",get_M24:"get_M24",set_M14:"set_M14",get_M14:"get_M14",set_M43:"set_M43",get_M43:"get_M43",set_M33:"set_M33",get_M33:"get_M33",set_M23:"set_M23",get_M23:"get_M23",set_M13:"set_M13",get_M13:"get_M13",set_M42:"set_M42",get_M42:"get_M42",set_M32:"set_M32",get_M32:"get_M32",set_M22:"set_M22",get_M22:"get_M22",set_M12:"set_M12",get_M12:"get_M12",set_M41:"set_M41",get_M41:"get_M41",set_M31:"set_M31",get_M31:"get_M31",set_M21:"set_M21",get_M21:"get_M21",set_M11:"set_M11",get_M11:"get_M11"}
};
phoenix.Quaternion = function(_x,_y,_z,_w) {
	if(_w == null) _w = 1;
	if(_z == null) _z = 0;
	if(_y == null) _y = 0;
	if(_x == null) _x = 0;
	this.ignore_euler = false;
	this._construct = false;
	this.ignore_listeners = false;
	this.w = 0.0;
	this.z = 0.0;
	this.y = 0.0;
	this.x = 0.0;
	this._construct = true;
	this.x = _x;
	if(this._construct) this.x; else {
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		this.x;
	}
	this.y = _y;
	if(this._construct) this.y; else {
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		this.y;
	}
	this.z = _z;
	if(this._construct) this.z; else {
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		this.z;
	}
	this.w = _w;
	if(this._construct) this.w; else {
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		this.w;
	}
	this.euler = new phoenix.Vector();
	this._construct = false;
};
phoenix.Quaternion.__name__ = true;
phoenix.Quaternion.Add = function(_a,_b) {
	return _a.clone().add(_b);
};
phoenix.Quaternion.Multiply = function(_a,_b) {
	return _a.clone().multiply(_b);
};
phoenix.Quaternion.MultiplyScalar = function(_quaternion,_scalar) {
	return _quaternion.clone().multiplyScalar(_scalar);
};
phoenix.Quaternion.Slerp = function(_qa,_qb,_qm,_t) {
	return _qm.copy(_qa).slerp(_qb,_t);
};
phoenix.Quaternion.Dot = function(_a,_b) {
	return new phoenix.Quaternion(_a.x,_a.y,_a.z,_a.w).dot(_b);
};
phoenix.Quaternion.Listen = function(_q,listener) {
	_q.listen_x = listener;
	_q.listen_y = listener;
	_q.listen_z = listener;
	_q.listen_w = listener;
};
phoenix.Quaternion.prototype = {
	x: null
	,y: null
	,z: null
	,w: null
	,euler: null
	,ignore_listeners: null
	,listen_x: null
	,listen_y: null
	,listen_z: null
	,listen_w: null
	,_construct: null
	,toString: function() {
		return "{ x:" + this.x + ", y:" + this.y + ", z:" + this.z + ", w:" + this.w + " }";
	}
	,set: function(_x,_y,_z,_w) {
		this.ignore_euler = true;
		this.x = _x;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _y;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _z;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = _w;
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		return this;
	}
	,copy: function(_quaternion) {
		this.ignore_euler = true;
		this.x = _quaternion.x;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _quaternion.y;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _quaternion.z;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = _quaternion.w;
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		return this;
	}
	,dot: function(_other) {
		return this.x * _other.x + this.y * _other.y + this.z * _other.z + this.w * _other.w;
	}
	,setFromEuler: function(_euler,_order) {
		if(_order == null) _order = 0;
		var _x = this.x;
		var _y = this.y;
		var _z = this.z;
		var _w = this.w;
		var c1 = Math.cos(_euler.x / 2);
		var c2 = Math.cos(_euler.y / 2);
		var c3 = Math.cos(_euler.z / 2);
		var s1 = Math.sin(_euler.x / 2);
		var s2 = Math.sin(_euler.y / 2);
		var s3 = Math.sin(_euler.z / 2);
		if(_order == 0) {
			_x = s1 * c2 * c3 + c1 * s2 * s3;
			_y = c1 * s2 * c3 - s1 * c2 * s3;
			_z = c1 * c2 * s3 + s1 * s2 * c3;
			_w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if(_order == 1) {
			_x = s1 * c2 * c3 + c1 * s2 * s3;
			_y = c1 * s2 * c3 - s1 * c2 * s3;
			_z = c1 * c2 * s3 - s1 * s2 * c3;
			_w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if(_order == 2) {
			_x = s1 * c2 * c3 - c1 * s2 * s3;
			_y = c1 * s2 * c3 + s1 * c2 * s3;
			_z = c1 * c2 * s3 + s1 * s2 * c3;
			_w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if(_order == 3) {
			_x = s1 * c2 * c3 - c1 * s2 * s3;
			_y = c1 * s2 * c3 + s1 * c2 * s3;
			_z = c1 * c2 * s3 - s1 * s2 * c3;
			_w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if(_order == 4) {
			_x = s1 * c2 * c3 + c1 * s2 * s3;
			_y = c1 * s2 * c3 + s1 * c2 * s3;
			_z = c1 * c2 * s3 - s1 * s2 * c3;
			_w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if(_order == 5) {
			_x = s1 * c2 * c3 - c1 * s2 * s3;
			_y = c1 * s2 * c3 - s1 * c2 * s3;
			_z = c1 * c2 * s3 + s1 * s2 * c3;
			_w = c1 * c2 * c3 + s1 * s2 * s3;
		}
		this.ignore_euler = true;
		this.x = _x;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _y;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _z;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = _w;
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		return this;
	}
	,setFromAxisAngle: function(_axis,_angle) {
		var _halfAngle = _angle / 2;
		var _s = Math.sin(_halfAngle);
		this.set_xyzw(_axis.x * _s,_axis.y * _s,_axis.z * _s,Math.cos(_halfAngle));
		return this;
	}
	,setFromRotationMatrix: function(_m) {
		var te = _m.elements;
		var m11 = te[0];
		var m12 = te[4];
		var m13 = te[8];
		var m21 = te[1];
		var m22 = te[5];
		var m23 = te[9];
		var m31 = te[2];
		var m32 = te[6];
		var m33 = te[10];
		var _x = this.x;
		var _y = this.y;
		var _z = this.z;
		var _w = this.w;
		var tr = m11 + m22 + m33;
		var s;
		if(tr > 0) {
			s = 0.5 / Math.sqrt(tr + 1.0);
			_w = 0.25 / s;
			_x = (m32 - m23) * s;
			_y = (m13 - m31) * s;
			_z = (m21 - m12) * s;
		} else if(m11 > m22 && m11 > m33) {
			s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
			_w = (m32 - m23) / s;
			_x = 0.25 * s;
			_y = (m12 + m21) / s;
			_z = (m13 + m31) / s;
		} else if(m22 > m33) {
			s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
			_w = (m13 - m31) / s;
			_x = (m12 + m21) / s;
			_y = 0.25 * s;
			_z = (m23 + m32) / s;
		} else {
			s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
			_w = (m21 - m12) / s;
			_x = (m13 + m31) / s;
			_y = (m23 + m32) / s;
			_z = 0.25 * s;
		}
		this.ignore_euler = true;
		this.x = _x;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _y;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _z;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = _w;
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		return this;
	}
	,inverse: function() {
		return this.conjugate().normalize();
	}
	,conjugate: function() {
		this.ignore_euler = true;
		this.x = this.x * -1;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = this.y * -1;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = this.z * -1;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		return this;
	}
	,lengthSq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
	,length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	,normalize: function() {
		var l = this.length();
		if(l == 0) {
			this.ignore_euler = true;
			this.x = 0;
			if(this._construct) this.x; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
				this.x;
			}
			this.y = 0;
			if(this._construct) this.y; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
				this.y;
			}
			this.z = 0;
			if(this._construct) this.z; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
				this.z;
			}
			this.w = 1;
			if(this._construct) this.w; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
				this.w;
			}
			this.ignore_euler = false;
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		} else {
			l = 1 / l;
			this.ignore_euler = true;
			this.x = this.x * l;
			if(this._construct) this.x; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
				this.x;
			}
			this.y = this.y * l;
			if(this._construct) this.y; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
				this.y;
			}
			this.z = this.z * l;
			if(this._construct) this.z; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
				this.z;
			}
			this.w = this.w * l;
			if(this._construct) this.w; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
				this.w;
			}
			this.ignore_euler = false;
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		}
		return this;
	}
	,multiply: function(_quaternion) {
		return this.multiplyQuaternions(this,_quaternion);
	}
	,add: function(_quaternion) {
		return this.addQuaternions(this,_quaternion);
	}
	,addQuaternions: function(_a,_b) {
		this.x = _a.x + _b.x;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _a.y + _b.y;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _a.z + _b.z;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = _a.w + _b.w;
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		return this;
	}
	,multiplyScalar: function(_scalar) {
		var _g = this;
		_g.x = _g.x * _scalar;
		if(_g._construct) _g.x; else {
			if(_g.euler == null || _g.ignore_euler || _g._construct) null; else _g.euler.setEulerFromQuaternion(_g,null);
			if(_g.listen_x != null && !_g.ignore_listeners) _g.listen_x(_g.x);
			_g.x;
		}
		var _g1 = this;
		_g1.y = _g1.y * _scalar;
		if(_g1._construct) _g1.y; else {
			if(_g1.euler == null || _g1.ignore_euler || _g1._construct) null; else _g1.euler.setEulerFromQuaternion(_g1,null);
			if(_g1.listen_y != null && !_g1.ignore_listeners) _g1.listen_y(_g1.y);
			_g1.y;
		}
		var _g2 = this;
		_g2.z = _g2.z * _scalar;
		if(_g2._construct) _g2.z; else {
			if(_g2.euler == null || _g2.ignore_euler || _g2._construct) null; else _g2.euler.setEulerFromQuaternion(_g2,null);
			if(_g2.listen_z != null && !_g2.ignore_listeners) _g2.listen_z(_g2.z);
			_g2.z;
		}
		var _g3 = this;
		_g3.w = _g3.w * _scalar;
		if(_g3._construct) _g3.w; else {
			if(_g3.euler == null || _g3.ignore_euler || _g3._construct) null; else _g3.euler.setEulerFromQuaternion(_g3,null);
			if(_g3.listen_w != null && !_g3.ignore_listeners) _g3.listen_w(_g3.w);
			_g3.w;
		}
		return this;
	}
	,multiplyQuaternions: function(_a,_b) {
		var qax = _a.x;
		var qay = _a.y;
		var qaz = _a.z;
		var qaw = _a.w;
		var qbx = _b.x;
		var qby = _b.y;
		var qbz = _b.z;
		var qbw = _b.w;
		this.ignore_euler = true;
		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		return this;
	}
	,slerp: function(_qb,_t) {
		var _x = this.x;
		var _y = this.y;
		var _z = this.z;
		var _w = this.w;
		var cosHalfTheta = _w * _qb.w + _x * _qb.x + _y * _qb.y + _z * _qb.z;
		if(cosHalfTheta < 0) {
			this.w = -_qb.w;
			if(this._construct) this.w; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
				this.w;
			}
			this.x = -_qb.x;
			if(this._construct) this.x; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
				this.x;
			}
			this.y = -_qb.y;
			if(this._construct) this.y; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
				this.y;
			}
			this.z = -_qb.z;
			if(this._construct) this.z; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
				this.z;
			}
			cosHalfTheta = -cosHalfTheta;
		} else this.copy(_qb);
		if(cosHalfTheta >= 1.0) {
			this.ignore_euler = true;
			this.x = _x;
			if(this._construct) this.x; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
				this.x;
			}
			this.y = _y;
			if(this._construct) this.y; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
				this.y;
			}
			this.z = _z;
			if(this._construct) this.z; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
				this.z;
			}
			this.w = _w;
			if(this._construct) this.w; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
				this.w;
			}
			this.ignore_euler = false;
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			return this;
		}
		var halfTheta = Math.acos(cosHalfTheta);
		var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
		if(Math.abs(sinHalfTheta) < 0.001) {
			this.ignore_euler = true;
			this.x = 0.5 * (_w + this.w);
			if(this._construct) this.x; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
				this.x;
			}
			this.y = 0.5 * (_x + this.x);
			if(this._construct) this.y; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
				this.y;
			}
			this.z = 0.5 * (_y + this.y);
			if(this._construct) this.z; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
				this.z;
			}
			this.w = 0.5 * (_z + this.z);
			if(this._construct) this.w; else {
				if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
				if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
				this.w;
			}
			this.ignore_euler = false;
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			return this;
		}
		var ratioA = Math.sin((1 - _t) * halfTheta) / sinHalfTheta;
		var ratioB = Math.sin(_t * halfTheta) / sinHalfTheta;
		this.ignore_euler = true;
		this.x = _w * ratioA + this.w * ratioB;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _x * ratioA + this.x * ratioB;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _y * ratioA + this.y * ratioB;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = _z * ratioA + this.z * ratioB;
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		return this;
	}
	,equals: function(_q) {
		return _q.x == this.x && _q.y == this.y && _q.z == this.z && _q.w == this.w;
	}
	,fromArray: function(_a) {
		this.ignore_euler = true;
		this.x = _a[0];
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _a[1];
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _a[2];
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = _a[3];
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		return this;
	}
	,toArray: function() {
		return [this.x,this.y,this.z,this.w];
	}
	,clone: function() {
		return new phoenix.Quaternion(this.x,this.y,this.z,this.w);
	}
	,toeuler: function() {
		return new phoenix.Vector().setEulerFromQuaternion(this,null).degrees();
	}
	,update_euler: function() {
		if(this.euler == null || this.ignore_euler || this._construct) return;
		this.euler.setEulerFromQuaternion(this,null);
	}
	,ignore_euler: null
	,set_xyzw: function(_x,_y,_z,_w) {
		this.ignore_euler = true;
		this.x = _x;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _y;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _z;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.w = _w;
		if(this._construct) this.w; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
			this.w;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
	}
	,set_xyz: function(_x,_y,_z) {
		this.ignore_euler = true;
		this.x = _x;
		if(this._construct) this.x; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
			this.x;
		}
		this.y = _y;
		if(this._construct) this.y; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
			this.y;
		}
		this.z = _z;
		if(this._construct) this.z; else {
			if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
			this.z;
		}
		this.ignore_euler = false;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
	}
	,set_x: function(_v) {
		this.x = _v;
		if(this._construct) return this.x;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		return this.x;
	}
	,set_y: function(_v) {
		this.y = _v;
		if(this._construct) return this.y;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		return this.y;
	}
	,set_z: function(_v) {
		this.z = _v;
		if(this._construct) return this.z;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		return this.z;
	}
	,set_w: function(_v) {
		this.w = _v;
		if(this._construct) return this.w;
		if(this.euler == null || this.ignore_euler || this._construct) null; else this.euler.setEulerFromQuaternion(this,null);
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(this.w);
		return this.w;
	}
	,__class__: phoenix.Quaternion
	,__properties__: {set_w:"set_w",set_z:"set_z",set_y:"set_y",set_x:"set_x"}
};
phoenix.Ray = function(_screen_pos,_camera,_viewport) {
	if(_viewport == null) _viewport = new phoenix.Rectangle(0,0,Luxe.get_screen().w,Luxe.get_screen().h);
	if(_camera == null) throw "Camera required for a ray!";
	this.camera = _camera;
	this.viewport = _viewport;
	this.refresh(_screen_pos);
};
phoenix.Ray.__name__ = true;
phoenix.Ray.prototype = {
	origin: null
	,end: null
	,dir: null
	,camera: null
	,viewport: null
	,refresh: function(_screen_pos) {
		var ndc_x = (_screen_pos.x / this.viewport.w - 0.5) * 2.0;
		var ndc_y = ((this.viewport.h - _screen_pos.y) / this.viewport.h - 0.5) * 2.0;
		var start_ndc = new phoenix.Vector(ndc_x,ndc_y,0.0,1.0);
		var end_ndc = new phoenix.Vector(ndc_x,ndc_y,1.0,1.0);
		this.origin = this.camera.unproject(start_ndc);
		this.end = this.camera.unproject(end_ndc);
		this.dir = phoenix.Vector.Subtract(this.end,this.origin);
	}
	,__class__: phoenix.Ray
};
phoenix.Rectangle = function(_x,_y,_w,_h) {
	if(_h == null) _h = 0;
	if(_w == null) _w = 0;
	if(_y == null) _y = 0;
	if(_x == null) _x = 0;
	this.ignore_listeners = false;
	this.h = 0;
	this.w = 0;
	this.y = 0;
	this.x = 0;
	this.set_x(_x);
	this.set_y(_y);
	this.set_w(_w);
	this.set_h(_h);
};
phoenix.Rectangle.__name__ = true;
phoenix.Rectangle.listen = function(_r,listener) {
	_r.listen_x = listener;
	_r.listen_y = listener;
	_r.listen_w = listener;
	_r.listen_h = listener;
};
phoenix.Rectangle.prototype = {
	x: null
	,y: null
	,w: null
	,h: null
	,ignore_listeners: null
	,listen_x: null
	,listen_y: null
	,listen_w: null
	,listen_h: null
	,toString: function() {
		return "{ x:" + this.x + ", y:" + this.y + ", w:" + this.w + ", h:" + this.h + " }";
	}
	,point_inside: function(_p) {
		if(_p.x < this.x) return false;
		if(_p.y < this.y) return false;
		if(_p.x > this.x + this.w) return false;
		if(_p.y > this.y + this.h) return false;
		return true;
	}
	,overlaps: function(_other) {
		if(_other == null) return false;
		if(this.x < _other.x + _other.w && this.y < _other.y + _other.h && this.x + this.w > _other.x && this.y + this.h > _other.y) return true;
		return false;
	}
	,clone: function() {
		return new phoenix.Rectangle(this.x,this.y,this.w,this.h);
	}
	,equal: function(_other) {
		if(_other == null) return false;
		return this.x == _other.x && this.y == _other.y && this.w == _other.w && this.h == _other.h;
	}
	,copy_from: function(_rect) {
		this.set_x(_rect.x);
		this.set_y(_rect.y);
		this.set_w(_rect.w);
		this.set_h(_rect.h);
	}
	,set: function(_x,_y,_w,_h) {
		var _setx = this.x;
		var _sety = this.y;
		var _setw = this.w;
		var _seth = this.h;
		if(_x != null) _setx = _x;
		if(_y != null) _sety = _y;
		if(_w != null) _setw = _w;
		if(_h != null) _seth = _h;
		this.set_x(_setx);
		this.set_y(_sety);
		this.set_w(_setw);
		this.set_h(_seth);
		return this;
	}
	,set_x: function(_x) {
		this.x = _x;
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(_x);
		return this.x;
	}
	,set_y: function(_y) {
		this.y = _y;
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(_y);
		return this.y;
	}
	,set_w: function(_w) {
		this.w = _w;
		if(this.listen_w != null && !this.ignore_listeners) this.listen_w(_w);
		return this.w;
	}
	,set_h: function(_h) {
		this.h = _h;
		if(this.listen_h != null && !this.ignore_listeners) this.listen_h(_h);
		return this.h;
	}
	,__class__: phoenix.Rectangle
	,__properties__: {set_h:"set_h",set_w:"set_w",set_y:"set_y",set_x:"set_x"}
};
phoenix.RenderPath = function(_renderer) {
	this.renderer = _renderer;
};
phoenix.RenderPath.__name__ = true;
phoenix.RenderPath.prototype = {
	renderer: null
	,render: function(_batchers,_stats) {
		var _g = 0;
		while(_g < _batchers.length) {
			var batch = _batchers[_g];
			++_g;
			if(batch.enabled) {
				Luxe.debug.start("batch." + batch.name);
				batch.draw();
				_stats.geometry_count += batch.geometry.size();
				_stats.dynamic_batched_count += batch.dynamic_batched_count;
				_stats.static_batched_count += batch.static_batched_count;
				_stats.visible_count += batch.visible_count;
				_stats.draw_calls += batch.draw_calls;
				_stats.vert_count += batch.vert_count;
				Luxe.debug.end("batch." + batch.name);
			}
		}
	}
	,__class__: phoenix.RenderPath
};
phoenix.RenderState = function(_renderer) {
	this._last_depth_mask = true;
	this._last_line_width = 1;
	this._bound_texture_2D = null;
	this._active_texture = -1;
	this._used_program = null;
	this._current_rbo = null;
	this._current_fbo = null;
	this.depth_mask = true;
	this.depth_test = false;
	this.cull_face = false;
	this.renderer = _renderer;
	this._viewport = new phoenix.Rectangle(0,0,0,0);
};
phoenix.RenderState.__name__ = true;
phoenix.RenderState.prototype = {
	cull_face: null
	,depth_test: null
	,depth_mask: null
	,renderer: null
	,_viewport: null
	,enable: function(what) {
		switch(what) {
		case 2884:
			if(!this.cull_face) {
				this.cull_face = true;
				snow.platform.web.render.opengl.GL.enable(2884);
			}
			break;
		case 2929:
			if(Luxe.core.app.window.config.depth_bits > 0) {
				if(!this.depth_test) {
					this.depth_test = true;
					snow.platform.web.render.opengl.GL.enable(2929);
				}
			}
			break;
		}
	}
	,disable: function(what) {
		switch(what) {
		case 2884:
			if(this.cull_face) {
				this.cull_face = false;
				snow.platform.web.render.opengl.GL.disable(2884);
			}
			break;
		case 2929:
			if(Luxe.core.app.window.config.depth_bits > 0) {
				if(this.depth_test) {
					this.depth_test = false;
					snow.platform.web.render.opengl.GL.disable(2929);
				}
			}
			break;
		}
	}
	,viewport: function(x,y,w,h) {
		if(this._viewport.x != x || this._viewport.y != y || this._viewport.w != w || this._viewport.h != h) {
			this._viewport.set_x(x);
			this._viewport.set_y(y);
			this._viewport.set_w(w);
			this._viewport.set_h(h);
			var _y = this.renderer.target_size.y - (y + h);
			snow.platform.web.render.opengl.GL.viewport(x | 0,_y | 0,w | 0,h | 0);
		}
	}
	,_current_fbo: null
	,bindFramebuffer: function(buffer) {
		if(this._current_fbo != buffer) {
			if(buffer == null) buffer = this.renderer.default_fbo;
			snow.platform.web.render.opengl.GL.bindFramebuffer(36160,buffer);
			this._current_fbo = buffer;
		}
	}
	,_current_rbo: null
	,bindRenderbuffer: function(buffer) {
		if(this._current_rbo != buffer) {
			if(buffer == null) buffer = this.renderer.default_rbo;
			snow.platform.web.render.opengl.GL.bindRenderbuffer(36161,buffer);
			this._current_rbo = buffer;
		}
	}
	,_used_program: null
	,useProgram: function(program) {
		if(this._used_program != program) {
			this._used_program = program;
			snow.platform.web.render.opengl.GL.useProgram(program);
		}
	}
	,_active_texture: null
	,activeTexture: function(val) {
		if(this._active_texture != val) {
			snow.platform.web.render.opengl.GL.activeTexture(val);
			this._active_texture = val;
		}
	}
	,_bound_texture_2D: null
	,bindTexture2D: function(tex) {
		if(this._bound_texture_2D != tex) {
			this._bound_texture_2D = tex;
			snow.platform.web.render.opengl.GL.bindTexture(3553,tex);
		}
	}
	,_last_line_width: null
	,lineWidth: function(_width) {
		if(this._last_line_width != _width) {
			this._last_line_width = _width;
			snow.platform.web.render.opengl.GL.lineWidth(_width);
		}
	}
	,_last_depth_mask: null
	,depthMask: function(_enable) {
		if(this._last_depth_mask != _enable) {
			this._last_depth_mask = _enable;
			snow.platform.web.render.opengl.GL.depthMask(_enable);
		}
	}
	,__class__: phoenix.RenderState
};
phoenix.Texture = function(_manager,_type) {
	this.slot = 0;
	this.loaded = false;
	this.height = -1;
	this.width = -1;
	this.height_actual = -1;
	this.width_actual = -1;
	if(_type == null) _type = luxe.resource.ResourceType.texture;
	luxe.resource.Resource.call(this,_manager,_type);
	this._onload_handlers = new Array();
	this.id = Luxe.utils.uniqueid();
	this.set_filter(phoenix.FilterType.linear);
	this.set_clamp(phoenix.ClampType.edge);
};
phoenix.Texture.__name__ = true;
phoenix.Texture.load = function(_id,_onloaded,_silent) {
	if(_silent == null) _silent = false;
	var resources = Luxe.resources;
	var _exists = resources.find_texture(_id);
	if(_exists != null) {
		if(_onloaded != null) _onloaded(_exists);
		return _exists;
	}
	var texture = new phoenix.Texture(resources);
	if(_onloaded != null) texture.set_onload(_onloaded);
	var _asset = Luxe.core.app.assets.image(_id,{ onload : function(asset) {
		if(asset != null && asset.image != null) {
			texture.from_asset(asset);
			texture.reset();
			texture.do_onload();
			if(!_silent) haxe.Log.trace("  i / texture / " + ("texture loaded " + texture.id + " (" + texture.width + "x" + texture.height + ") real size (" + texture.width_actual + "x" + texture.height_actual + ")"),{ fileName : "Texture.hx", lineNumber : 149, className : "phoenix.Texture", methodName : "load"});
		} else if(!_silent) haxe.Log.trace("  i / texture / " + ("texture failed to load! " + _id),{ fileName : "Texture.hx", lineNumber : 154, className : "phoenix.Texture", methodName : "load"});
	}});
	if(_asset != null) {
		texture.id = _id;
		resources.cache(texture);
		return texture;
	}
	return null;
};
phoenix.Texture.load_from_resource = function(_name,_cache) {
	if(_cache == null) _cache = true;
	var texture_bytes = haxe.Resource.getBytes(_name);
	if(texture_bytes != null) {
		var texture = phoenix.Texture.load_from_bytearray(_name,snow.platform.web.utils.ByteArray.fromBytes(texture_bytes),_cache);
		texture_bytes = null;
		return texture;
	}
	return null;
};
phoenix.Texture.load_from_bytearray = function(_name,_bytes,_cache) {
	if(_cache == null) _cache = true;
	if(_bytes != null) {
		var resources = Luxe.renderer.resource_manager;
		var texture = new phoenix.Texture(resources);
		var _asset = Luxe.core.app.assets.image(_name,{ bytes : _bytes});
		if(_asset != null) {
			texture.from_asset(_asset);
			texture.reset();
			texture.do_onload();
			if(_cache) resources.cache(texture);
			return texture;
		}
	}
	return null;
};
phoenix.Texture.load_from_pixels = function(_id,_width,_height,_pixels,_cache) {
	if(_cache == null) _cache = true;
	if(_pixels == null) return null;
	var resources = Luxe.renderer.resource_manager;
	var texture = new phoenix.Texture(resources);
	var _asset_info = Luxe.core.app.assets.info_from_id(_id,"image");
	var _asset = new snow.assets.AssetImage(Luxe.core.app.assets,_asset_info);
	_asset.load_from_pixels(_id,_width,_height,_pixels);
	texture.from_asset(_asset);
	texture.reset();
	texture.do_onload();
	if(_cache) resources.cache(texture);
	return texture;
};
phoenix.Texture.__super__ = luxe.resource.Resource;
phoenix.Texture.prototype = $extend(luxe.resource.Resource.prototype,{
	texture: null
	,asset: null
	,width_actual: null
	,height_actual: null
	,width: null
	,height: null
	,loaded: null
	,slot: null
	,_onload_handlers: null
	,filter: null
	,filter_min: null
	,filter_mag: null
	,clamp: null
	,set_onload: function(f) {
		if(this.loaded) {
			f(this);
			return f;
		} else this._onload_handlers.push(f);
		return f;
	}
	,do_onload: function() {
		this.loaded = true;
		var _g = 0;
		var _g1 = this._onload_handlers;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			if(f != null) f(this);
		}
		this._onload_handlers.splice(0,this._onload_handlers.length);
	}
	,toString: function() {
		return "Texture (" + Std.string(this.texture) + ") (" + this.width + "x" + this.height + ") real size(" + this.width_actual + "x" + this.height_actual + ") " + Std.string(this.filter) + " filtering. " + Std.string(this.clamp) + " clamp. id: " + this.id;
	}
	,estimated_memory: function() {
		var _bytes = this.width_actual * this.height_actual * 4;
		return Luxe.utils.bytes_to_string(_bytes);
	}
	,check_size: function() {
		var max_size = snow.platform.web.render.opengl.GL.getParameter(3379);
		if(this.asset.image.width_actual > max_size) throw "texture bigger than MAX_TEXTURE_SIZE (" + max_size + ") " + this.asset.id;
		if(this.asset.image.height_actual > max_size) throw "texture bigger than MAX_TEXTURE_SIZE (" + max_size + ") " + this.asset.id;
	}
	,reset: function() {
		this.texture = snow.platform.web.render.opengl.GL.createTexture();
		this.bind();
		snow.platform.web.render.opengl.GL.texImage2D(3553,0,6408,this.width_actual,this.height_actual,0,6408,5121,this.asset.image.data);
		this._set_filter(this.filter);
		this._set_clamp(this.clamp);
	}
	,from_asset: function(_asset) {
		if(_asset == null) throw "null asset passed to Texture.from_asset";
		this.asset = _asset;
		this.check_size();
		this.id = this.asset.id;
		this.width = this.asset.image.width;
		this.height = this.asset.image.height;
		this.width_actual = this.asset.image.width_actual;
		this.height_actual = this.asset.image.height_actual;
	}
	,generate_mipmaps: function() {
		var _g = this;
		this.set_onload(function(t) {
			_g.bind();
			snow.platform.web.render.opengl.GL.generateMipmap(3553);
		});
	}
	,bind: function() {
		Luxe.renderer.state.activeTexture(33984 + this.slot);
		Luxe.renderer.state.bindTexture2D(this.texture);
	}
	,get_pixel: function(_pos) {
		if(this.asset.image.data == null) return null;
		var x = _pos.x | 0;
		var y = _pos.y | 0;
		return { r : this.asset.image.data[(y * this.width + x) * 4] / 255.0, g : this.asset.image.data[(y * this.width + x) * 4 + 1] / 255.0, b : this.asset.image.data[(y * this.width + x) * 4 + 2] / 255.0, a : this.asset.image.data[(y * this.width + x) * 4 + 3] / 255.0};
	}
	,set_pixel: function(_pos,_color) {
		if(this.asset.image.data == null) return;
		var x = _pos.x | 0;
		var y = _pos.y | 0;
		this.asset.image.data[(y * this.width + x) * 4] = _color.r * 255 | 0;
		this.asset.image.data[(y * this.width + x) * 4 + 1] = _color.g * 255 | 0;
		this.asset.image.data[(y * this.width + x) * 4 + 2] = _color.b * 255 | 0;
		this.asset.image.data[(y * this.width + x) * 4 + 3] = _color.a * 255 | 0;
	}
	,lock: function() {
		return true;
	}
	,unlock: function() {
		if(this.asset.image.data != null) {
			Luxe.renderer.state.bindTexture2D(this.texture);
			snow.platform.web.render.opengl.GL.texImage2D(3553,0,6408,this.width,this.height,0,6408,5121,this.asset.image.data);
			this.asset.image.data = null;
		}
	}
	,drop: function() {
		luxe.resource.Resource.prototype.drop.call(this);
		this.destroy();
	}
	,activate: function(att) {
	}
	,destroy: function() {
		snow.platform.web.render.opengl.GL.deleteTexture(this.texture);
	}
	,_set_clamp: function(_clamp) {
		switch(_clamp[1]) {
		case 0:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10242,33071);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10243,33071);
			break;
		case 1:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10242,10497);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10243,10497);
			break;
		case 2:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10242,33648);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10243,33648);
			break;
		}
	}
	,set_clamp: function(_clamp) {
		var _g = this;
		if(this.clamp == null) return this.clamp = _clamp;
		if(this.loaded == false) this.set_onload(function(t) {
			_g.bind();
			_g._set_clamp(_clamp);
		}); else {
			this.bind();
			this._set_clamp(_clamp);
		}
		return _clamp;
	}
	,_set_filter: function(_filter) {
		switch(_filter[1]) {
		case 1:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9729);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9729);
			break;
		case 0:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9728);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9728);
			break;
		case 2:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9984);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9984);
			break;
		case 3:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9985);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9985);
			break;
		case 4:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9986);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9986);
			break;
		case 5:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9987);
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9987);
			break;
		}
	}
	,_set_filter_min: function(_filter) {
		switch(_filter[1]) {
		case 1:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9729);
			break;
		case 0:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9728);
			break;
		case 2:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9984);
			break;
		case 3:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9985);
			break;
		case 4:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9986);
			break;
		case 5:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10241,9987);
			break;
		}
	}
	,_set_filter_mag: function(_filter) {
		switch(_filter[1]) {
		case 1:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9729);
			break;
		case 0:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9728);
			break;
		case 2:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9984);
			break;
		case 3:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9985);
			break;
		case 4:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9986);
			break;
		case 5:
			snow.platform.web.render.opengl.GL.texParameteri(3553,10240,9987);
			break;
		}
	}
	,set_filter: function(_filter) {
		var _g = this;
		if(this.filter == null) return this.filter = _filter;
		if(this.loaded == false) this.set_onload(function(t) {
			_g.bind();
			_g._set_filter(_filter);
		}); else {
			this.bind();
			this._set_filter(_filter);
		}
		return this.filter = _filter;
	}
	,set_filter_min: function(_filter) {
		var _g = this;
		if(this.loaded == false) this.set_onload(function(t) {
			_g.bind();
			_g._set_filter_min(_filter);
		}); else {
			this.bind();
			this._set_filter_min(_filter);
		}
		return this.filter_min = _filter;
	}
	,set_filter_mag: function(_filter) {
		var _g = this;
		if(this.loaded == false) this.set_onload(function(t) {
			_g.bind();
			_g._set_filter_mag(_filter);
		}); else {
			this.bind();
			this._set_filter_mag(_filter);
		}
		return this.filter_mag = _filter;
	}
	,__class__: phoenix.Texture
	,__properties__: {set_clamp:"set_clamp",set_filter_mag:"set_filter_mag",set_filter_min:"set_filter_min",set_filter:"set_filter",set_onload:"set_onload"}
});
phoenix.RenderTexture = function(_manager,_size) {
	phoenix.Texture.call(this,_manager,luxe.resource.ResourceType.render_texture);
	if(_size == null) new phoenix.Vector(Luxe.get_screen().w,Luxe.get_screen().h); else _size;
	this.width = this.width_actual = _size.x | 0;
	this.height = this.height_actual = _size.y | 0;
	this.texture = snow.platform.web.render.opengl.GL.createTexture();
	this.bind();
	snow.platform.web.render.opengl.GL.texImage2D(3553,0,6408,this.width,this.height,0,6408,5121,null);
	this._set_filter(phoenix.FilterType.linear);
	this._set_clamp(phoenix.ClampType.edge);
	this.fbo = snow.platform.web.render.opengl.GL.createFramebuffer();
	this.bindBuffer();
	this.renderbuffer = snow.platform.web.render.opengl.GL.createRenderbuffer();
	this.bindRenderBuffer();
	snow.platform.web.render.opengl.GL.renderbufferStorage(36161,33189,this.width,this.height);
	snow.platform.web.render.opengl.GL.framebufferTexture2D(36160,36064,3553,this.texture,0);
	snow.platform.web.render.opengl.GL.framebufferRenderbuffer(36160,36096,36161,this.renderbuffer);
	var status = snow.platform.web.render.opengl.GL.checkFramebufferStatus(36160);
	switch(status) {
	case 36053:
		break;
	case 36054:
		throw "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT";
		break;
	case 36055:
		throw "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";
		break;
	case 36057:
		throw "Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS";
		break;
	case 36061:
		throw "Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED";
		break;
	default:
		throw "Incomplete framebuffer: " + status;
	}
	this.unbindBuffer();
	this.unbindRenderBuffer();
	this.loaded = true;
};
phoenix.RenderTexture.__name__ = true;
phoenix.RenderTexture.__super__ = phoenix.Texture;
phoenix.RenderTexture.prototype = $extend(phoenix.Texture.prototype,{
	fbo: null
	,renderbuffer: null
	,destroy: function() {
		snow.platform.web.render.opengl.GL.deleteFramebuffer(this.fbo);
		snow.platform.web.render.opengl.GL.deleteRenderbuffer(this.renderbuffer);
		phoenix.Texture.prototype.destroy.call(this);
	}
	,bindBuffer: function() {
		Luxe.renderer.state.bindFramebuffer(this.fbo);
	}
	,unbindBuffer: function(_other) {
		Luxe.renderer.state.bindFramebuffer(_other);
	}
	,bindRenderBuffer: function() {
		Luxe.renderer.state.bindRenderbuffer(this.renderbuffer);
	}
	,unbindRenderBuffer: function(_other) {
		Luxe.renderer.state.bindRenderbuffer(_other);
	}
	,__class__: phoenix.RenderTexture
});
phoenix.Renderer = function(_core) {
	this.stop_count = 0;
	this.stop = false;
	this.should_clear = true;
	this.core = _core;
	this.default_fbo = snow.platform.web.render.opengl.GL.getParameter(36006);
	this.default_rbo = snow.platform.web.render.opengl.GL.getParameter(36007);
	null;
};
phoenix.Renderer.__name__ = true;
phoenix.Renderer.prototype = {
	resource_manager: null
	,batchers: null
	,core: null
	,state: null
	,default_fbo: null
	,default_rbo: null
	,default_shader: null
	,default_shader_textured: null
	,default_vert_source: null
	,default_frag_source: null
	,default_frag_textured_source: null
	,batcher: null
	,camera: null
	,font: null
	,render_path: null
	,default_render_path: null
	,vsync: null
	,target: null
	,target_size: null
	,should_clear: null
	,stop: null
	,stop_count: null
	,clear_color: null
	,stats: null
	,init: function() {
		this.state = new phoenix.RenderState(this);
		this.clear_color = new phoenix.Color().rgb(1710618);
		this.stats = new phoenix.RendererStats();
		this.resource_manager = new luxe.resource.ResourceManager();
		this.batchers = [];
		this.target_size = new phoenix.Vector(Luxe.get_screen().w,Luxe.get_screen().h);
		this.camera = new phoenix.Camera();
		this.default_render_path = new phoenix.RenderPath(this);
		this.render_path = this.default_render_path;
		this.create_default_shaders();
		this.batcher = new phoenix.Batcher(this,"default batcher");
		this.batcher.set_layer(1);
		this.add_batch(this.batcher);
		this.create_default_font();
		if(this.core.app.window.config.depth_bits > 0) {
			snow.platform.web.render.opengl.GL.enable(2929);
			snow.platform.web.render.opengl.GL.depthFunc(515);
			snow.platform.web.render.opengl.GL.clearDepth(1.0);
		}
		snow.platform.web.render.opengl.GL.enable(3042);
		snow.platform.web.render.opengl.GL.blendFunc(770,771);
		snow.platform.web.render.opengl.GL.pixelStorei(37441,0);
	}
	,destroy: function() {
		this.clear(new phoenix.Color().rgb(16729099));
	}
	,sort_batchers: function(a,b) {
		if(a.layer < b.layer) return -1;
		if(a.layer > b.layer) return 1;
		if(a.sequence < b.sequence) return -1;
		if(a.sequence > b.sequence) return 1;
		return 1;
	}
	,add_batch: function(batch) {
		this.batchers.push(batch);
		this.batchers.sort($bind(this,this.sort_batchers));
	}
	,remove_batch: function(batch) {
		HxOverrides.remove(this.batchers,batch);
	}
	,create_batcher: function(options) {
		var _new_batcher_layer = 2;
		if(options != null) {
			if(options.name == null) options.name = "batcher";
			if(options.layer == null) options.layer = _new_batcher_layer;
			if(options.camera == null) options.camera = new phoenix.Camera();
		} else options = { name : "batcher", camera : new phoenix.Camera(), layer : _new_batcher_layer};
		var _batcher = new phoenix.Batcher(this,options.name);
		_batcher.view = options.camera;
		_batcher.set_layer(options.layer);
		if(options.no_add == null || options.no_add == false) this.add_batch(_batcher);
		return _batcher;
	}
	,clear: function(_color) {
		if(_color == null) _color = this.clear_color;
		snow.platform.web.render.opengl.GL.clearColor(_color.r,_color.g,_color.b,_color.a);
		if(this.core.app.window.config.depth_bits > 0) {
			snow.platform.web.render.opengl.GL.clear(16640);
			snow.platform.web.render.opengl.GL.clearDepth(1.0);
		} else snow.platform.web.render.opengl.GL.clear(16384);
	}
	,blend_mode: function(_src_mode,_dst_mode) {
		if(_dst_mode == null) _dst_mode = 771;
		if(_src_mode == null) _src_mode = 770;
		snow.platform.web.render.opengl.GL.blendFunc(_src_mode,_dst_mode);
	}
	,blend_equation: function(_equation) {
		if(_equation == null) _equation = 32774;
		snow.platform.web.render.opengl.GL.blendEquation(_equation);
	}
	,process: function() {
		if(this.stop) return;
		if(this.should_clear) this.clear(this.clear_color);
		this.stats.batchers = this.batchers.length;
		this.stats.reset();
		this.render_path.render(this.batchers,this.stats);
	}
	,onresize: function(e) {
	}
	,set_vsync: function(_vsync) {
		Luxe.core.app.windowing.enable_vsync(_vsync);
		return this.vsync = _vsync;
	}
	,get_vsync: function() {
		return this.vsync;
	}
	,get_target: function() {
		return this.target;
	}
	,set_target: function(_target) {
		if(_target != null) {
			this.target_size.set_x(_target.width);
			this.target_size.set_y(_target.height);
			this.state.bindFramebuffer(_target.fbo);
		} else {
			this.target_size.set_x(Luxe.get_screen().w);
			this.target_size.set_y(Luxe.get_screen().h);
			this.state.bindFramebuffer();
		}
		return this.target = _target;
	}
	,create_default_shaders: function() {
		this.default_vert_source = haxe.Resource.getString("default.vert.glsl");
		this.default_frag_source = haxe.Resource.getString("default.frag.glsl");
		this.default_frag_textured_source = haxe.Resource.getString("default.frag.textured.glsl");
		this.default_frag_source = "precision mediump float;\n" + this.default_frag_source;
		this.default_frag_textured_source = "precision mediump float;\n" + this.default_frag_textured_source;
		this.default_shader = new phoenix.Shader(this.resource_manager);
		this.default_shader.id = "default_shader";
		this.default_shader_textured = new phoenix.Shader(this.resource_manager);
		this.default_shader_textured.id = "default_shader_textured";
		this.default_shader.from_string(this.default_vert_source,this.default_frag_source,null,null,false);
		this.default_shader_textured.from_string(this.default_vert_source,this.default_frag_textured_source,null,null,false);
		null;
	}
	,create_default_font: function() {
		this.font = new phoenix.BitmapFont(this.resource_manager);
		var _font_texture = phoenix.Texture.load_from_resource("cabin.png");
		_font_texture.set_filter_min(phoenix.FilterType.linear);
		this.font.from_string(haxe.Resource.getString("cabin.fnt"),"luxe.font",null,[_font_texture]);
		null;
	}
	,__class__: phoenix.Renderer
	,__properties__: {set_target:"set_target",get_target:"get_target",set_vsync:"set_vsync",get_vsync:"get_vsync"}
};
phoenix.RendererStats = function() {
	this.vert_count = 0;
	this.group_count = 0;
	this.draw_calls = 0;
	this.visible_count = 0;
	this.static_batched_count = 0;
	this.dynamic_batched_count = 0;
	this.geometry_count = 0;
	this.batchers = 0;
};
phoenix.RendererStats.__name__ = true;
phoenix.RendererStats.prototype = {
	batchers: null
	,geometry_count: null
	,dynamic_batched_count: null
	,static_batched_count: null
	,visible_count: null
	,draw_calls: null
	,group_count: null
	,vert_count: null
	,reset: function() {
		this.geometry_count = 0;
		this.dynamic_batched_count = 0;
		this.static_batched_count = 0;
		this.visible_count = 0;
		this.group_count = 0;
		this.draw_calls = 0;
		this.vert_count = 0;
	}
	,toString: function() {
		return "Renderer Statistics\n" + "\tbatcher count : " + this.batchers + "\n" + "\ttotal geometry : " + this.geometry_count + "\n" + "\tvisible geometry : " + this.visible_count + "\n" + "\tdynamic batched geometry : " + this.dynamic_batched_count + "\n" + "\tstatic batched geometry : " + this.static_batched_count + "\n" + "\ttotal draw calls : " + this.draw_calls + "\n" + "\ttotal vertices : " + this.vert_count;
	}
	,__class__: phoenix.RendererStats
};
phoenix.UniformValueType = { __ename__ : true, __constructs__ : ["int","float","vector2","vector3","vector4","color","texture","unknown"] };
phoenix.UniformValueType["int"] = ["int",0];
phoenix.UniformValueType["int"].toString = $estr;
phoenix.UniformValueType["int"].__enum__ = phoenix.UniformValueType;
phoenix.UniformValueType["float"] = ["float",1];
phoenix.UniformValueType["float"].toString = $estr;
phoenix.UniformValueType["float"].__enum__ = phoenix.UniformValueType;
phoenix.UniformValueType.vector2 = ["vector2",2];
phoenix.UniformValueType.vector2.toString = $estr;
phoenix.UniformValueType.vector2.__enum__ = phoenix.UniformValueType;
phoenix.UniformValueType.vector3 = ["vector3",3];
phoenix.UniformValueType.vector3.toString = $estr;
phoenix.UniformValueType.vector3.__enum__ = phoenix.UniformValueType;
phoenix.UniformValueType.vector4 = ["vector4",4];
phoenix.UniformValueType.vector4.toString = $estr;
phoenix.UniformValueType.vector4.__enum__ = phoenix.UniformValueType;
phoenix.UniformValueType.color = ["color",5];
phoenix.UniformValueType.color.toString = $estr;
phoenix.UniformValueType.color.__enum__ = phoenix.UniformValueType;
phoenix.UniformValueType.texture = ["texture",6];
phoenix.UniformValueType.texture.toString = $estr;
phoenix.UniformValueType.texture.__enum__ = phoenix.UniformValueType;
phoenix.UniformValueType.unknown = ["unknown",7];
phoenix.UniformValueType.unknown.toString = $estr;
phoenix.UniformValueType.unknown.__enum__ = phoenix.UniformValueType;
phoenix.Shader = function(_manager) {
	this.normal_attribute = 3;
	this.color_attribute = 2;
	this.tcoord_attribute = 1;
	this.vert_attribute = 0;
	this.fragment_source_name = "";
	this.vertex_source_name = "";
	this.log = "";
	this.errors = "";
	luxe.resource.Resource.call(this,_manager,luxe.resource.ResourceType.shader);
	this.uniforms = new haxe.ds.StringMap();
	this.uniform_textures = new haxe.ds.StringMap();
};
phoenix.Shader.__name__ = true;
phoenix.Shader.load = function(_psid,_vsid,_onloaded) {
	var _frag_shader = "";
	var _vert_shader = "";
	if(_vsid == "default" || _vsid == "") {
		_vsid = "default shader";
		_vert_shader = Luxe.renderer.default_vert_source;
	} else _vert_shader = Luxe.loadText(_vsid).text;
	if(_psid == "default" || _psid == "") {
		_psid = "default shader";
		_frag_shader = Luxe.renderer.default_frag_source;
	} else if(_psid == "textured") {
		_psid = "default textured";
		_frag_shader = Luxe.renderer.default_frag_textured_source;
	} else _frag_shader = Luxe.loadText(_psid).text;
	var _shader = null;
	if(_frag_shader != null && _frag_shader.length > 0 && _vert_shader != null && _vert_shader.length > 0) {
		var prefixes = "";
		prefixes += "precision mediump float;\n";
		_shader = new phoenix.Shader(Luxe.resources);
		_shader.from_string(_vert_shader,prefixes + _frag_shader,_psid,_vsid,false);
	}
	if(_shader != null) {
		_shader.id = _psid + "|" + _vsid;
		if(_onloaded != null) _onloaded(_shader);
		haxe.Log.trace("   i / shader / " + ("shader loaded " + _shader.id),{ fileName : "Shader.hx", lineNumber : 383, className : "phoenix.Shader", methodName : "load"});
		return _shader;
	} else return null;
};
phoenix.Shader.__super__ = luxe.resource.Resource;
phoenix.Shader.prototype = $extend(luxe.resource.Resource.prototype,{
	errors: null
	,log: null
	,vertex_source_name: null
	,fragment_source_name: null
	,vert_shader: null
	,frag_shader: null
	,program: null
	,shader: null
	,vert_attribute: null
	,tcoord_attribute: null
	,color_attribute: null
	,normal_attribute: null
	,projectionmatrix_attribute: null
	,modelviewmatrix_attribute: null
	,tex0_attribute: null
	,tex1_attribute: null
	,tex2_attribute: null
	,tex3_attribute: null
	,tex4_attribute: null
	,tex5_attribute: null
	,tex6_attribute: null
	,tex7_attribute: null
	,uniforms: null
	,uniform_textures: null
	,activate: function() {
		if(this.program != null) Luxe.renderer.state.useProgram(this.program); else {
		}
	}
	,deactivate: function() {
		Luxe.renderer.state.useProgram(null);
	}
	,set_uniform_int: function(_name,_value) {
		if(this.uniforms.exists(_name)) {
			var _uniformvalue = this.uniforms.get(_name);
			_uniformvalue.value = _value;
		} else {
			var _uniformvalue1 = { name : _name, value : _value, type : phoenix.UniformValueType["int"], location : snow.platform.web.render.opengl.GL.getUniformLocation(this.program,_name)};
			this.uniforms.set(_name,_uniformvalue1);
		}
	}
	,set_uniform_float: function(_name,_value) {
		if(this.uniforms.exists(_name)) {
			var _uniformvalue = this.uniforms.get(_name);
			_uniformvalue.value = _value;
		} else {
			var _uniformvalue1 = { name : _name, value : _value, type : phoenix.UniformValueType["float"], location : snow.platform.web.render.opengl.GL.getUniformLocation(this.program,_name)};
			this.uniforms.set(_name,_uniformvalue1);
		}
	}
	,set_uniform_vector2: function(_name,_value) {
		if(this.uniforms.exists(_name)) {
			var _uniformvalue = this.uniforms.get(_name);
			_uniformvalue.value = _value;
		} else {
			var _uniformvalue1 = { name : _name, value : _value, type : phoenix.UniformValueType.vector2, location : snow.platform.web.render.opengl.GL.getUniformLocation(this.program,_name)};
			this.uniforms.set(_name,_uniformvalue1);
		}
	}
	,set_uniform_vector3: function(_name,_value) {
		if(this.uniforms.exists(_name)) {
			var _uniformvalue = this.uniforms.get(_name);
			_uniformvalue.value = _value;
		} else {
			var _uniformvalue1 = { name : _name, value : _value, type : phoenix.UniformValueType.vector3, location : snow.platform.web.render.opengl.GL.getUniformLocation(this.program,_name)};
			this.uniforms.set(_name,_uniformvalue1);
		}
	}
	,set_uniform_vector4: function(_name,_value) {
		if(this.uniforms.exists(_name)) {
			var _uniformvalue = this.uniforms.get(_name);
			_uniformvalue.value = _value;
		} else {
			var _uniformvalue1 = { name : _name, value : _value, type : phoenix.UniformValueType.vector4, location : snow.platform.web.render.opengl.GL.getUniformLocation(this.program,_name)};
			this.uniforms.set(_name,_uniformvalue1);
		}
	}
	,set_uniform_color: function(_name,_value) {
		if(this.uniforms.exists(_name)) {
			var _uniformvalue = this.uniforms.get(_name);
			_uniformvalue.value = _value;
		} else {
			var _uniformvalue1 = { name : _name, value : _value, type : phoenix.UniformValueType.color, location : snow.platform.web.render.opengl.GL.getUniformLocation(this.program,_name)};
			this.uniforms.set(_name,_uniformvalue1);
		}
	}
	,set_uniform_texture: function(_name,_value) {
		if(this.uniforms.exists(_name)) {
			var _uniformvalue = this.uniforms.get(_name);
			_uniformvalue.value = _value;
			this.uniform_textures.set(_name,_value);
		} else {
			var _uniformvalue1 = { name : _name, value : _value, type : phoenix.UniformValueType.texture, location : snow.platform.web.render.opengl.GL.getUniformLocation(this.program,_name)};
			this.uniforms.set(_name,_uniformvalue1);
			this.uniform_textures.set(_name,_value);
		}
	}
	,compile: function(_type,_source,_verbose) {
		if(_verbose == null) _verbose = false;
		var _shader = snow.platform.web.render.opengl.GL.createShader(_type);
		snow.platform.web.render.opengl.GL.shaderSource(_shader,_source);
		snow.platform.web.render.opengl.GL.compileShader(_shader);
		var shader_log = "";
		if(_verbose) {
			shader_log = snow.platform.web.render.opengl.GL.getShaderInfoLog(_shader);
			if(shader_log.length > 0) {
				this.addLog("\n\t :: start -- (" + (_type == 35632?"fragment":"vertex") + ") Shader compile log -- " + this.id + "\n");
				this.addLog("\t\t" + shader_log + "\n");
				this.addLog("\t :: end -- (" + (_type == 35632?"fragment":"vertex") + ") Shader compile log -- " + this.id);
			}
		}
		if(snow.platform.web.render.opengl.GL.getShaderParameter(_shader,35713) == 0) {
			var _info;
			if(_type == 35632) _info = "fragment"; else _info = "vertex";
			if(_type == 35632) _info += "(" + this.fragment_source_name + ")"; else _info += "(" + this.vertex_source_name + ")";
			this.addError("\tFailed to compile shader (" + _info + ") : \n");
			if(!_verbose) shader_log = snow.platform.web.render.opengl.GL.getShaderInfoLog(_shader);
			this.addError("\t\t" + shader_log);
			snow.platform.web.render.opengl.GL.deleteShader(_shader);
			_shader = null;
			return null;
		}
		return _shader;
	}
	,link: function() {
		var _program = snow.platform.web.render.opengl.GL.createProgram();
		snow.platform.web.render.opengl.GL.attachShader(_program,this.vert_shader);
		snow.platform.web.render.opengl.GL.attachShader(_program,this.frag_shader);
		snow.platform.web.render.opengl.GL.bindAttribLocation(_program,this.vert_attribute,"vertexPosition");
		snow.platform.web.render.opengl.GL.bindAttribLocation(_program,this.tcoord_attribute,"vertexTCoord");
		snow.platform.web.render.opengl.GL.bindAttribLocation(_program,this.color_attribute,"vertexColor");
		snow.platform.web.render.opengl.GL.bindAttribLocation(_program,this.normal_attribute,"vertexNormal");
		snow.platform.web.render.opengl.GL.linkProgram(_program);
		if(snow.platform.web.render.opengl.GL.getProgramParameter(_program,35714) == 0) {
			this.addError("\tFailed to link shader program:");
			this.addError("\t\t" + snow.platform.web.render.opengl.GL.getProgramInfoLog(_program));
			snow.platform.web.render.opengl.GL.deleteProgram(_program);
			_program = null;
			return null;
		}
		this.activate();
		this.projectionmatrix_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"projectionMatrix");
		this.modelviewmatrix_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"modelViewMatrix");
		this.tex0_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"tex0");
		this.tex1_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"tex1");
		this.tex2_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"tex2");
		this.tex3_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"tex3");
		this.tex4_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"tex4");
		this.tex5_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"tex5");
		this.tex6_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"tex6");
		this.tex7_attribute = snow.platform.web.render.opengl.GL.getUniformLocation(_program,"tex7");
		return _program;
	}
	,drop: function() {
		luxe.resource.Resource.prototype.drop.call(this);
		this.destroy();
	}
	,destroy: function() {
		if(this.vert_shader != null) snow.platform.web.render.opengl.GL.deleteShader(this.vert_shader);
		if(this.frag_shader != null) snow.platform.web.render.opengl.GL.deleteShader(this.frag_shader);
		if(this.program != null) snow.platform.web.render.opengl.GL.deleteProgram(this.program);
	}
	,from_string: function(_vertex_source,_fragment_source,_frag_name,_vertex_name,_verbose) {
		if(_verbose == null) _verbose = false;
		if(_vertex_name == null) _vertex_name = "";
		if(_frag_name == null) _frag_name = "";
		this.destroy();
		this.fragment_source_name = _frag_name;
		this.vertex_source_name = _vertex_name;
		this.vert_shader = this.compile(35633,_vertex_source,_verbose);
		this.frag_shader = this.compile(35632,_fragment_source,_verbose);
		if(this.vert_shader == null || this.frag_shader == null) {
			if(_verbose) throw "SHADER : " + this.id + " \n\n " + this.log + "\n" + this.errors; else throw this.errors;
			return false;
		}
		this.program = this.link();
		if(this.program == null) {
			if(_verbose) throw this.log + "\n" + this.errors; else throw this.errors;
		} else if(_verbose && this.log.length > 0) haxe.Log.trace(this.log,{ fileName : "Shader.hx", lineNumber : 429, className : "phoenix.Shader", methodName : "from_string"});
		if(this.program == null) return false;
		return true;
	}
	,apply_uniforms: function() {
		snow.platform.web.render.opengl.GL.uniform1i(this.tex0_attribute,0);
		snow.platform.web.render.opengl.GL.uniform1i(this.tex1_attribute,1);
		snow.platform.web.render.opengl.GL.uniform1i(this.tex2_attribute,2);
		snow.platform.web.render.opengl.GL.uniform1i(this.tex3_attribute,3);
		snow.platform.web.render.opengl.GL.uniform1i(this.tex4_attribute,4);
		snow.platform.web.render.opengl.GL.uniform1i(this.tex5_attribute,5);
		snow.platform.web.render.opengl.GL.uniform1i(this.tex6_attribute,6);
		snow.platform.web.render.opengl.GL.uniform1i(this.tex7_attribute,7);
		var $it0 = this.uniforms.iterator();
		while( $it0.hasNext() ) {
			var uniform = $it0.next();
			var _g = uniform.type;
			switch(_g[1]) {
			case 0:
				this.setUniformInt(uniform.name,uniform.value,uniform.location);
				break;
			case 1:
				this.setUniformFloat(uniform.name,uniform.value,uniform.location);
				break;
			case 2:
				this.setUniformVector2(uniform.name,uniform.value,uniform.location);
				break;
			case 3:
				this.setUniformVector3(uniform.name,uniform.value,uniform.location);
				break;
			case 4:
				this.setUniformVector4(uniform.name,uniform.value,uniform.location);
				break;
			case 5:
				this.setUniformColor(uniform.name,uniform.value,uniform.location);
				break;
			case 6:
				this.setUniformTexture(uniform.name,uniform.value,uniform.location);
				break;
			case 7:
				break;
			}
		}
	}
	,getUniform: function(uniform_name) {
		return snow.platform.web.render.opengl.GL.getUniformLocation(this.program,uniform_name);
	}
	,setUniformInt: function(uniform_name,value,location) {
		snow.platform.web.render.opengl.GL.uniform1i(location,value);
	}
	,setUniformFloat: function(uniform_name,value,location) {
		snow.platform.web.render.opengl.GL.uniform1f(location,value);
	}
	,setUniformVector2: function(uniform_name,value,location) {
		snow.platform.web.render.opengl.GL.uniform2f(location,value.x,value.y);
	}
	,setUniformVector3: function(uniform_name,value,location) {
		snow.platform.web.render.opengl.GL.uniform3f(location,value.x,value.y,value.z);
	}
	,setUniformVector4: function(uniform_name,value,location) {
		snow.platform.web.render.opengl.GL.uniform4f(location,value.x,value.y,value.z,value.w);
	}
	,setUniformColor: function(uniform_name,value,location) {
		snow.platform.web.render.opengl.GL.uniform4f(location,value.r,value.g,value.b,value.a);
	}
	,setUniformTexture: function(uniform_name,value,location) {
		snow.platform.web.render.opengl.GL.uniform1i(location,value.slot);
		value.bind();
	}
	,addLog: function(_log) {
		this.log += _log;
	}
	,addError: function(_error) {
		this.errors += _error;
	}
	,__class__: phoenix.Shader
});
phoenix.FilterType = { __ename__ : true, __constructs__ : ["nearest","linear","mip_nearest_nearest","mip_linear_nearest","mip_nearest_linear","mip_linear_linear"] };
phoenix.FilterType.nearest = ["nearest",0];
phoenix.FilterType.nearest.toString = $estr;
phoenix.FilterType.nearest.__enum__ = phoenix.FilterType;
phoenix.FilterType.linear = ["linear",1];
phoenix.FilterType.linear.toString = $estr;
phoenix.FilterType.linear.__enum__ = phoenix.FilterType;
phoenix.FilterType.mip_nearest_nearest = ["mip_nearest_nearest",2];
phoenix.FilterType.mip_nearest_nearest.toString = $estr;
phoenix.FilterType.mip_nearest_nearest.__enum__ = phoenix.FilterType;
phoenix.FilterType.mip_linear_nearest = ["mip_linear_nearest",3];
phoenix.FilterType.mip_linear_nearest.toString = $estr;
phoenix.FilterType.mip_linear_nearest.__enum__ = phoenix.FilterType;
phoenix.FilterType.mip_nearest_linear = ["mip_nearest_linear",4];
phoenix.FilterType.mip_nearest_linear.toString = $estr;
phoenix.FilterType.mip_nearest_linear.__enum__ = phoenix.FilterType;
phoenix.FilterType.mip_linear_linear = ["mip_linear_linear",5];
phoenix.FilterType.mip_linear_linear.toString = $estr;
phoenix.FilterType.mip_linear_linear.__enum__ = phoenix.FilterType;
phoenix.ClampType = { __ename__ : true, __constructs__ : ["edge","repeat","mirror"] };
phoenix.ClampType.edge = ["edge",0];
phoenix.ClampType.edge.toString = $estr;
phoenix.ClampType.edge.__enum__ = phoenix.ClampType;
phoenix.ClampType.repeat = ["repeat",1];
phoenix.ClampType.repeat.toString = $estr;
phoenix.ClampType.repeat.__enum__ = phoenix.ClampType;
phoenix.ClampType.mirror = ["mirror",2];
phoenix.ClampType.mirror.toString = $estr;
phoenix.ClampType.mirror.__enum__ = phoenix.ClampType;
phoenix.Transform = function() {
	this._destroying = false;
	this._cleaning = false;
	this._setup = true;
	this.dirty = true;
	luxe.ID.call(this,"transform");
	this.set_local(new phoenix.Spatial());
	this.set_world(new phoenix.Spatial());
	this._origin_undo_matrix = new phoenix.Matrix();
	this._pos_matrix = new phoenix.Matrix();
	this._rotation_matrix = new phoenix.Matrix();
	this.set_origin(new phoenix.Vector());
	this.local.pos_changed = $bind(this,this.on_local_pos_change);
	this.local.rotation_changed = $bind(this,this.on_local_rotation_change);
	this.local.scale_changed = $bind(this,this.on_local_scale_change);
	this._setup = false;
};
phoenix.Transform.__name__ = true;
phoenix.Transform.__super__ = luxe.ID;
phoenix.Transform.prototype = $extend(luxe.ID.prototype,{
	parent: null
	,local: null
	,world: null
	,origin: null
	,dirty: null
	,_origin_undo_matrix: null
	,_pos_matrix: null
	,_rotation_matrix: null
	,_setup: null
	,_cleaning: null
	,_clean_handlers: null
	,_dirty_handlers: null
	,_pos_handlers: null
	,_rotation_handlers: null
	,_scale_handlers: null
	,_origin_handlers: null
	,_parent_handlers: null
	,_destroying: null
	,destroy: function() {
		this._destroying = true;
		if(this.parent != null) this.parent.unlisten($bind(this,this.on_parent_cleaned));
		this._clean_handlers = null;
		this._dirty_handlers = null;
		this._pos_handlers = null;
		this._rotation_handlers = null;
		this._scale_handlers = null;
		this._origin_handlers = null;
		this._parent_handlers = null;
		this.local.destroy();
		((function($this) {
			var $r;
			if(!$this._destroying) {
				if($this.parent != null) {
					if($this.parent.dirty) $this.parent.clean();
				}
				if($this.dirty && !$this._cleaning) {
					if(!$this.dirty) null; else {
						$this._cleaning = true;
						$this._pos_matrix.makeTranslation($this.local.pos.x,$this.local.pos.y,$this.local.pos.z);
						$this._rotation_matrix.makeRotationFromQuaternion($this.local.rotation);
						$this._origin_undo_matrix.makeTranslation(-$this.origin.x,-$this.origin.y,-$this.origin.z);
						$this.local.matrix.makeTranslation($this.origin.x,$this.origin.y,$this.origin.z);
						$this.local.matrix.scale($this.local.scale);
						$this.local.matrix.multiply($this._rotation_matrix);
						$this.local.matrix.setPosition($this.local.pos);
						$this.local.matrix.multiply($this._origin_undo_matrix);
						if($this.parent != null) $this.get_world().set_matrix($this.get_world().get_matrix().multiplyMatrices($this.parent.get_world().get_matrix(),$this.local.matrix)); else $this.get_world().set_matrix($this.local.matrix.clone());
						$this.get_world().decompose(false);
						$this.dirty = false;
						if($this.dirty && !$this._setup && $this._dirty_handlers != null && $this._dirty_handlers.length > 0) $this.propagate_dirty();
						$this.dirty;
						$this._cleaning = false;
						if($this._clean_handlers != null && $this._clean_handlers.length > 0) $this.propagate_clean();
					}
				}
			}
			$r = $this.world;
			return $r;
		}(this))).destroy();
		this.local = null;
		this.world = null;
		this.dirty = true;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
		this.origin = null;
		if(this._origin_handlers != null && this._origin_handlers.length > 0) this.propagate_origin(this.origin);
		this.origin;
		this._origin_undo_matrix = null;
		this._pos_matrix = null;
		this._rotation_matrix = null;
	}
	,set_dirty: function(_dirty) {
		this.dirty = _dirty;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		return this.dirty;
	}
	,on_local_pos_change: function(v) {
		this.dirty = true;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
		if(this._pos_handlers != null && this._pos_handlers.length > 0) this.propagate_pos(v);
	}
	,on_local_rotation_change: function(r) {
		this.dirty = true;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
		if(this._rotation_handlers != null && this._rotation_handlers.length > 0) this.propagate_rotation(r);
	}
	,on_local_scale_change: function(s) {
		this.dirty = true;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
		if(this._scale_handlers != null && this._scale_handlers.length > 0) this.propagate_scale(s);
	}
	,on_parent_cleaned: function(p) {
		this.dirty = true;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
	}
	,get_local: function() {
		return this.local;
	}
	,set_local: function(l) {
		if(l != null) {
			this.dirty = true;
			if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
			this.dirty;
			l.pos_changed = $bind(this,this.on_local_pos_change);
			l.rotation_changed = $bind(this,this.on_local_rotation_change);
			l.scale_changed = $bind(this,this.on_local_scale_change);
		}
		return this.local = l;
	}
	,get_world: function() {
		if(!this._destroying) {
			if(this.parent != null) {
				if(this.parent.dirty) this.parent.clean();
			}
			if(this.dirty && !this._cleaning) {
				if(!this.dirty) null; else {
					this._cleaning = true;
					this._pos_matrix.makeTranslation(this.local.pos.x,this.local.pos.y,this.local.pos.z);
					this._rotation_matrix.makeRotationFromQuaternion(this.local.rotation);
					this._origin_undo_matrix.makeTranslation(-this.origin.x,-this.origin.y,-this.origin.z);
					this.local.matrix.makeTranslation(this.origin.x,this.origin.y,this.origin.z);
					this.local.matrix.scale(this.local.scale);
					this.local.matrix.multiply(this._rotation_matrix);
					this.local.matrix.setPosition(this.local.pos);
					this.local.matrix.multiply(this._origin_undo_matrix);
					if(this.parent != null) this.get_world().set_matrix(this.get_world().get_matrix().multiplyMatrices(this.parent.get_world().get_matrix(),this.local.matrix)); else this.get_world().set_matrix(this.local.matrix.clone());
					this.get_world().decompose(false);
					this.dirty = false;
					if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
					this.dirty;
					this._cleaning = false;
					if(this._clean_handlers != null && this._clean_handlers.length > 0) this.propagate_clean();
				}
			}
		}
		return this.world;
	}
	,clean_check: function() {
		if(this.parent != null) {
			if(this.parent.dirty) this.parent.clean();
		}
		if(this.dirty && !this._cleaning) {
			if(!this.dirty) null; else {
				this._cleaning = true;
				this._pos_matrix.makeTranslation(this.local.pos.x,this.local.pos.y,this.local.pos.z);
				this._rotation_matrix.makeRotationFromQuaternion(this.local.rotation);
				this._origin_undo_matrix.makeTranslation(-this.origin.x,-this.origin.y,-this.origin.z);
				this.local.matrix.makeTranslation(this.origin.x,this.origin.y,this.origin.z);
				this.local.matrix.scale(this.local.scale);
				this.local.matrix.multiply(this._rotation_matrix);
				this.local.matrix.setPosition(this.local.pos);
				this.local.matrix.multiply(this._origin_undo_matrix);
				if(this.parent != null) this.get_world().set_matrix(this.get_world().get_matrix().multiplyMatrices(this.parent.get_world().get_matrix(),this.local.matrix)); else this.get_world().set_matrix(this.local.matrix.clone());
				this.get_world().decompose(false);
				this.dirty = false;
				if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
				this.dirty;
				this._cleaning = false;
				if(this._clean_handlers != null && this._clean_handlers.length > 0) this.propagate_clean();
			}
		}
	}
	,clean: function() {
		if(!this.dirty) return;
		this._cleaning = true;
		this._pos_matrix.makeTranslation(this.local.pos.x,this.local.pos.y,this.local.pos.z);
		this._rotation_matrix.makeRotationFromQuaternion(this.local.rotation);
		this._origin_undo_matrix.makeTranslation(-this.origin.x,-this.origin.y,-this.origin.z);
		this.local.matrix.makeTranslation(this.origin.x,this.origin.y,this.origin.z);
		this.local.matrix.scale(this.local.scale);
		this.local.matrix.multiply(this._rotation_matrix);
		this.local.matrix.setPosition(this.local.pos);
		this.local.matrix.multiply(this._origin_undo_matrix);
		if(this.parent != null) this.get_world().set_matrix(this.get_world().get_matrix().multiplyMatrices(this.parent.get_world().get_matrix(),this.local.matrix)); else this.get_world().set_matrix(this.local.matrix.clone());
		this.get_world().decompose(false);
		this.dirty = false;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
		this._cleaning = false;
		if(this._clean_handlers != null && this._clean_handlers.length > 0) this.propagate_clean();
	}
	,toString: function() {
		return "Transform (" + this.id + ")";
	}
	,get_origin: function() {
		return this.origin;
	}
	,set_origin: function(o) {
		this.dirty = true;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
		this.origin = o;
		if(this._origin_handlers != null && this._origin_handlers.length > 0) this.propagate_origin(this.origin);
		return this.origin;
	}
	,set_world: function(w) {
		if(w == null) return this.world = w;
		this.dirty = true;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
		return this.world = w;
	}
	,get_parent: function() {
		return this.parent;
	}
	,set_parent: function(_p) {
		this.dirty = true;
		if(this.dirty && !this._setup && this._dirty_handlers != null && this._dirty_handlers.length > 0) this.propagate_dirty();
		this.dirty;
		if(this.parent != null) this.parent.unlisten($bind(this,this.on_parent_cleaned));
		this.parent = _p;
		if(this._parent_handlers != null && this._parent_handlers.length > 0) this.propagate_parent(this.parent);
		if(this.parent != null) this.parent.listen($bind(this,this.on_parent_cleaned));
		return this.parent;
	}
	,get_pos: function() {
		return this.local.pos;
	}
	,get_rotation: function() {
		return this.local.rotation;
	}
	,get_scale: function() {
		return this.local.scale;
	}
	,set_pos: function(value) {
		return this.local.set_pos(value);
	}
	,set_rotation: function(value) {
		return this.local.set_rotation(value);
	}
	,set_scale: function(value) {
		return this.local.set_scale(value);
	}
	,propagate_clean: function() {
		var _g = 0;
		var _g1 = this._clean_handlers;
		while(_g < _g1.length) {
			var _handler = _g1[_g];
			++_g;
			if(_handler != null) _handler(this);
		}
	}
	,propagate_dirty: function() {
		var _g = 0;
		var _g1 = this._dirty_handlers;
		while(_g < _g1.length) {
			var _handler = _g1[_g];
			++_g;
			if(_handler != null) _handler(this);
		}
	}
	,propagate_pos: function(_pos) {
		var _g = 0;
		var _g1 = this._pos_handlers;
		while(_g < _g1.length) {
			var _handler = _g1[_g];
			++_g;
			if(_handler != null) _handler(_pos);
		}
	}
	,propagate_rotation: function(_rotation) {
		var _g = 0;
		var _g1 = this._rotation_handlers;
		while(_g < _g1.length) {
			var _handler = _g1[_g];
			++_g;
			if(_handler != null) _handler(_rotation);
		}
	}
	,propagate_scale: function(_scale) {
		var _g = 0;
		var _g1 = this._scale_handlers;
		while(_g < _g1.length) {
			var _handler = _g1[_g];
			++_g;
			if(_handler != null) _handler(_scale);
		}
	}
	,propagate_origin: function(_origin) {
		var _g = 0;
		var _g1 = this._origin_handlers;
		while(_g < _g1.length) {
			var _handler = _g1[_g];
			++_g;
			if(_handler != null) _handler(_origin);
		}
	}
	,propagate_parent: function(_parent) {
		var _g = 0;
		var _g1 = this._parent_handlers;
		while(_g < _g1.length) {
			var _handler = _g1[_g];
			++_g;
			if(_handler != null) _handler(_parent);
		}
	}
	,listen: function(_handler) {
		if(this._clean_handlers == null) this._clean_handlers = [];
		this._clean_handlers.push(_handler);
	}
	,unlisten: function(_handler) {
		if(this._clean_handlers == null) return false;
		return HxOverrides.remove(this._clean_handlers,_handler);
	}
	,listen_dirty: function(_handler) {
		if(this._dirty_handlers == null) this._dirty_handlers = [];
		this._dirty_handlers.push(_handler);
	}
	,unlisten_dirty: function(_handler) {
		if(this._dirty_handlers == null) return false;
		return HxOverrides.remove(this._dirty_handlers,_handler);
	}
	,listen_pos: function(_handler) {
		if(this._pos_handlers == null) this._pos_handlers = [];
		this._pos_handlers.push(_handler);
	}
	,unlisten_pos: function(_handler) {
		if(this._pos_handlers == null) return false;
		return HxOverrides.remove(this._pos_handlers,_handler);
	}
	,listen_scale: function(_handler) {
		if(this._scale_handlers == null) this._scale_handlers = [];
		this._scale_handlers.push(_handler);
	}
	,unlisten_scale: function(_handler) {
		if(this._scale_handlers == null) return false;
		return HxOverrides.remove(this._scale_handlers,_handler);
	}
	,listen_rotation: function(_handler) {
		if(this._rotation_handlers == null) this._rotation_handlers = [];
		this._rotation_handlers.push(_handler);
	}
	,unlisten_rotation: function(_handler) {
		if(this._rotation_handlers == null) return false;
		return HxOverrides.remove(this._rotation_handlers,_handler);
	}
	,listen_origin: function(_handler) {
		if(this._origin_handlers == null) this._origin_handlers = [];
		this._origin_handlers.push(_handler);
	}
	,unlisten_origin: function(_handler) {
		if(this._origin_handlers == null) return false;
		return HxOverrides.remove(this._origin_handlers,_handler);
	}
	,listen_parent: function(_handler) {
		if(this._parent_handlers == null) this._parent_handlers = [];
		this._parent_handlers.push(_handler);
	}
	,unlisten_parent: function(_handler) {
		if(this._parent_handlers == null) return false;
		return HxOverrides.remove(this._parent_handlers,_handler);
	}
	,__class__: phoenix.Transform
	,__properties__: {set_scale:"set_scale",get_scale:"get_scale",set_rotation:"set_rotation",get_rotation:"get_rotation",set_pos:"set_pos",get_pos:"get_pos",set_dirty:"set_dirty",set_origin:"set_origin",get_origin:"get_origin",set_world:"set_world",get_world:"get_world",set_local:"set_local",get_local:"get_local",set_parent:"set_parent",get_parent:"get_parent"}
});
phoenix.Spatial = function() {
	this._setup = true;
	this.auto_decompose = false;
	this.ignore_listeners = false;
	this.set_matrix(new phoenix.Matrix());
	this.floats = new Float32Array(this.matrix.elements);
	this.set_pos(new phoenix.Vector());
	this.set_rotation(new phoenix.Quaternion());
	this.set_scale(new phoenix.Vector(1,1,1));
	this._setup = false;
};
phoenix.Spatial.__name__ = true;
phoenix.Spatial.prototype = {
	pos: null
	,rotation: null
	,scale: null
	,matrix: null
	,floats: null
	,ignore_listeners: null
	,auto_decompose: null
	,pos_changed: null
	,rotation_changed: null
	,scale_changed: null
	,_setup: null
	,destroy: function() {
		this.matrix = null;
		this.matrix;
		this.floats = null;
		this.pos = null;
		this.pos;
		this.rotation = null;
		this.rotation;
		this.scale = null;
		this.scale;
	}
	,decompose: function(_force) {
		if(_force == null) _force = true;
		if(this.auto_decompose || _force) {
			var _transform = this.matrix.decompose(null,null,null);
			this.set_pos(_transform.pos);
			this.set_rotation(_transform.rotation);
			this.set_scale(_transform.scale);
		}
		return this;
	}
	,get_matrix: function() {
		return this.matrix;
	}
	,set_matrix: function(_m) {
		this.matrix = _m;
		if(_m != null) this.floats = new Float32Array(this.matrix.elements);
		return this.matrix;
	}
	,propagate_pos: function(_p) {
		if(this.pos_changed != null && !this.ignore_listeners) this.pos_changed(_p);
	}
	,propagate_rotation: function(_r) {
		if(this.rotation_changed != null && !this.ignore_listeners) this.rotation_changed(_r);
	}
	,propagate_scale: function(_s) {
		if(this.scale_changed != null && !this.ignore_listeners) this.scale_changed(_s);
	}
	,set_pos: function(_p) {
		this.pos = _p;
		if(_p != null) {
			phoenix.Vector.Listen(this.pos,$bind(this,this._pos_change));
			if(this.pos_changed != null && !this.ignore_listeners) this.pos_changed(this.pos);
		}
		return this.pos;
	}
	,set_rotation: function(_r) {
		this.rotation = _r;
		if(_r != null) {
			phoenix.Quaternion.Listen(this.rotation,$bind(this,this._rotation_change));
			if(this.rotation_changed != null && !this.ignore_listeners) this.rotation_changed(this.rotation);
		}
		return this.rotation;
	}
	,set_scale: function(_s) {
		this.scale = _s;
		if(_s != null) {
			phoenix.Vector.Listen(this.scale,$bind(this,this._scale_change));
			if(this.scale_changed != null && !this.ignore_listeners) this.scale_changed(this.scale);
		}
		return this.scale;
	}
	,_pos_change: function(_v) {
		this.set_pos(this.pos);
	}
	,_scale_change: function(_v) {
		this.set_scale(this.scale);
	}
	,_rotation_change: function(_v) {
		this.set_rotation(this.rotation);
	}
	,__class__: phoenix.Spatial
	,__properties__: {set_matrix:"set_matrix",get_matrix:"get_matrix",set_scale:"set_scale",set_rotation:"set_rotation",set_pos:"set_pos"}
};
phoenix.Vector = function(_x,_y,_z,_w) {
	if(_w == null) _w = 0;
	if(_z == null) _z = 0;
	if(_y == null) _y = 0;
	if(_x == null) _x = 0;
	this._construct = false;
	this.ignore_listeners = false;
	this.w = 0;
	this.z = 0;
	this.y = 0;
	this.x = 0;
	this._construct = true;
	this.x = _x;
	if(this._construct) this.x; else {
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(_x);
		this.x;
	}
	this.y = _y;
	if(this._construct) this.y; else {
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(_y);
		this.y;
	}
	this.z = _z;
	if(this._construct) this.z; else {
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(_z);
		this.z;
	}
	this.w = _w;
	this._construct = false;
};
phoenix.Vector.__name__ = true;
phoenix.Vector.Add = function(a,b) {
	return new phoenix.Vector(a.x + b.x,a.y + b.y,a.z + b.z);
};
phoenix.Vector.Subtract = function(a,b) {
	return new phoenix.Vector(a.x - b.x,a.y - b.y,a.z - b.z);
};
phoenix.Vector.MultiplyVector = function(a,b) {
	return new phoenix.Vector(a.x * b.x,a.y * b.y,a.z * b.z);
};
phoenix.Vector.DivideVector = function(a,b) {
	return new phoenix.Vector(a.x / b.x,a.y / b.y,a.z / b.z);
};
phoenix.Vector.Multiply = function(a,b) {
	return new phoenix.Vector(a.x * b,a.y * b,a.z * b);
};
phoenix.Vector.Divide = function(a,b) {
	return new phoenix.Vector(a.x / b,a.y / b,a.z / b);
};
phoenix.Vector.AddScalar = function(a,b) {
	return new phoenix.Vector(a.x + b,a.y + b,a.z + b);
};
phoenix.Vector.SubtractScalar = function(a,b) {
	return new phoenix.Vector(a.x - b,a.y - b,a.z - b);
};
phoenix.Vector.Cross = function(a,b) {
	return new phoenix.Vector(a.y * b.z - a.z * b.y,a.z * b.x - a.x * b.z,a.x * b.y - a.y * b.x);
};
phoenix.Vector.RotationTo = function(a,b) {
	return a.rotationTo(b);
};
phoenix.Vector.Listen = function(_v,listener) {
	_v.listen_x = listener;
	_v.listen_y = listener;
	_v.listen_z = listener;
};
phoenix.Vector.Degrees = function(_radian_vector) {
	return new phoenix.Vector(_radian_vector.x,_radian_vector.y,_radian_vector.z,_radian_vector.w).degrees();
};
phoenix.Vector.Radians = function(_degree_vector) {
	return new phoenix.Vector(_degree_vector.x,_degree_vector.y,_degree_vector.z,_degree_vector.w).radians();
};
phoenix.Vector.prototype = {
	x: null
	,y: null
	,z: null
	,w: null
	,length: null
	,lengthsq: null
	,angle2D: null
	,normalized: null
	,inverted: null
	,ignore_listeners: null
	,listen_x: null
	,listen_y: null
	,listen_z: null
	,_construct: null
	,copy_from: function(_other) {
		this.set(_other.x,_other.y,_other.z,_other.w);
		return this;
	}
	,set: function(_x,_y,_z,_w) {
		var prev = this.ignore_listeners;
		this.ignore_listeners = true;
		this.x = _x;
		if(this._construct) this.x; else {
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(_x);
			this.x;
		}
		this.y = _y;
		if(this._construct) this.y; else {
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(_y);
			this.y;
		}
		this.z = _z;
		if(this._construct) this.z; else {
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(_z);
			this.z;
		}
		this.w = _w;
		this.ignore_listeners = prev;
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		return this;
	}
	,set_xy: function(_x,_y) {
		var prev = this.ignore_listeners;
		this.ignore_listeners = true;
		this.x = _x;
		if(this._construct) this.x; else {
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(_x);
			this.x;
		}
		this.y = _y;
		if(this._construct) this.y; else {
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(_y);
			this.y;
		}
		this.ignore_listeners = prev;
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		return this;
	}
	,set_xyz: function(_x,_y,_z) {
		var prev = this.ignore_listeners;
		this.ignore_listeners = true;
		this.x = _x;
		if(this._construct) this.x; else {
			if(this.listen_x != null && !this.ignore_listeners) this.listen_x(_x);
			this.x;
		}
		this.y = _y;
		if(this._construct) this.y; else {
			if(this.listen_y != null && !this.ignore_listeners) this.listen_y(_y);
			this.y;
		}
		this.z = _z;
		if(this._construct) this.z; else {
			if(this.listen_z != null && !this.ignore_listeners) this.listen_z(_z);
			this.z;
		}
		this.ignore_listeners = prev;
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(this.x);
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(this.y);
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(this.z);
		return this;
	}
	,lerp_xy: function(_dest_x,_dest_y,_t) {
		this.set_xy(luxe.utils.Maths.lerp(this.x,_dest_x,_t),luxe.utils.Maths.lerp(this.y,_dest_y,_t));
		return this;
	}
	,lerp_xyz: function(_dest_x,_dest_y,_dest_z,_t) {
		this.set_xyz(luxe.utils.Maths.lerp(this.x,_dest_x,_t),luxe.utils.Maths.lerp(this.y,_dest_y,_t),luxe.utils.Maths.lerp(this.z,_dest_z,_t));
		return this;
	}
	,weighted_average_xy: function(_dest_x,_dest_y,_slowness) {
		this.set_xy(luxe.utils.Maths.weighted_avg(this.x,_dest_x,_slowness),luxe.utils.Maths.weighted_avg(this.y,_dest_y,_slowness));
		return this;
	}
	,weighted_average_xyz: function(_dest_x,_dest_y,_dest_z,_slowness) {
		this.set_xyz(luxe.utils.Maths.weighted_avg(this.x,_dest_x,_slowness),luxe.utils.Maths.weighted_avg(this.y,_dest_y,_slowness),luxe.utils.Maths.weighted_avg(this.z,_dest_z,_slowness));
		return this;
	}
	,'int': function() {
		this.set_xyz(Math.round(this.x),Math.round(this.y),Math.round(this.z));
		return this;
	}
	,int_x: function() {
		this.set_x(Math.round(this.x));
		return this;
	}
	,int_y: function() {
		this.set_y(Math.round(this.y));
		return this;
	}
	,int_z: function() {
		this.set_z(Math.round(this.z));
		return this;
	}
	,toString: function() {
		return "{ x:" + this.x + ", y:" + this.y + ", z:" + this.z + " }";
	}
	,equals: function(other) {
		return this.x == other.x && this.y == other.y && this.z == other.z && this.w == other.w;
	}
	,clone: function() {
		return new phoenix.Vector(this.x,this.y,this.z,this.w);
	}
	,normalize: function() {
		return this.divideScalar(Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
	}
	,dot: function(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}
	,cross: function(a,b) {
		this.set_xyz(a.y * b.z - a.z * b.y,a.z * b.x - a.x * b.z,a.x * b.y - a.y * b.x);
		return this;
	}
	,invert: function() {
		this.set_xyz(-this.x,-this.y,-this.z);
		return this;
	}
	,add: function(other) {
		if(other == null) throw "vector.add other was handed in as null";
		this.set_xyz(this.x + other.x,this.y + other.y,this.z + other.z);
		return this;
	}
	,add_xyz: function(_x,_y,_z) {
		if(_z == null) _z = 0;
		if(_y == null) _y = 0;
		if(_x == null) _x = 0;
		this.set_xyz(this.x + _x,this.y + _y,this.z + _z);
		return this;
	}
	,subtract: function(other) {
		if(other == null) throw "vector.subtract other was handed in as null";
		this.set_xyz(this.x - other.x,this.y - other.y,this.z - other.z);
		return this;
	}
	,subtract_xyz: function(_x,_y,_z) {
		if(_z == null) _z = 0;
		if(_y == null) _y = 0;
		if(_x == null) _x = 0;
		this.set_xyz(this.x - _x,this.y - _y,this.z - _z);
		return this;
	}
	,multiply: function(other) {
		if(other == null) throw "vector.multiply other was handed in as null";
		this.set_xyz(this.x * other.x,this.y * other.y,this.z * other.z);
		return this;
	}
	,multiply_xyz: function(_x,_y,_z) {
		if(_z == null) _z = 1;
		if(_y == null) _y = 1;
		if(_x == null) _x = 1;
		this.set_xyz(this.x * _x,this.y * _y,this.z * _z);
		return this;
	}
	,divide: function(other) {
		if(other == null) throw "vector.divide other was handed in as null";
		this.set_xyz(this.x / other.x,this.y / other.y,this.z / other.z);
		return this;
	}
	,divide_xyz: function(_x,_y,_z) {
		if(_z == null) _z = 1;
		if(_y == null) _y = 1;
		if(_x == null) _x = 1;
		this.set_xyz(this.x / _x,this.y / _y,this.z / _z);
		return this;
	}
	,addScalar: function(v) {
		this.set_xyz(this.x + v,this.y + v,this.z + v);
		return this;
	}
	,subtractScalar: function(v) {
		this.set_xyz(this.x - v,this.y - v,this.z - v);
		return this;
	}
	,multiplyScalar: function(v) {
		this.set_xyz(this.x * v,this.y * v,this.z * v);
		return this;
	}
	,divideScalar: function(v) {
		if(v != 0) this.set_xyz(this.x / v,this.y / v,this.z / v); else this.set_xyz(0,0,0);
		return this;
	}
	,set_length: function(value) {
		this.divideScalar(Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)).multiplyScalar(value);
		return value;
	}
	,get_length: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	,get_lengthsq: function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	,get_normalized: function() {
		return phoenix.Vector.Divide(this,Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
	}
	,set_x: function(_x) {
		this.x = _x;
		if(this._construct) return this.x;
		if(this.listen_x != null && !this.ignore_listeners) this.listen_x(_x);
		return this.x;
	}
	,set_y: function(_y) {
		this.y = _y;
		if(this._construct) return this.y;
		if(this.listen_y != null && !this.ignore_listeners) this.listen_y(_y);
		return this.y;
	}
	,set_z: function(_z) {
		this.z = _z;
		if(this._construct) return this.z;
		if(this.listen_z != null && !this.ignore_listeners) this.listen_z(_z);
		return this.z;
	}
	,get_inverted: function() {
		return new phoenix.Vector(-this.x,-this.y,-this.z);
	}
	,set_angle2D: function(value) {
		var len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		this.set_xy(Math.cos(value) * len,Math.sin(value) * len);
		return value;
	}
	,get_angle2D: function() {
		return Math.atan2(this.y,this.x);
	}
	,truncate: function(max) {
		this.set_length(Math.min(max,Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)));
		return this;
	}
	,rotationTo: function(other) {
		var theta = Math.atan2(other.x - this.x,other.y - this.y);
		var r = -(180.0 + theta * 180.0 / Math.PI);
		return r;
	}
	,applyQuaternion: function(q) {
		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;
		var ix = qw * this.x + qy * this.z - qz * this.y;
		var iy = qw * this.y + qz * this.x - qx * this.z;
		var iz = qw * this.z + qx * this.y - qy * this.x;
		var iw = -qx * this.x - qy * this.y - qz * this.z;
		this.set_xyz(ix * qw + iw * -qx + iy * -qz - iz * -qy,iy * qw + iw * -qy + iz * -qx - ix * -qz,iz * qw + iw * -qz + ix * -qy - iy * -qx);
		return this;
	}
	,applyProjection: function(m) {
		var e = m.elements;
		var x = this.x;
		var y = this.y;
		var z = this.z;
		var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
		this.set_xyz((e[0] * x + e[4] * y + e[8] * z + e[12]) * d,(e[1] * x + e[5] * y + e[9] * z + e[13]) * d,(e[2] * x + e[6] * y + e[10] * z + e[14]) * d);
		return this;
	}
	,transform: function(_m) {
		var _x = this.x;
		var _y = this.y;
		var _z = this.z;
		var e = _m.elements;
		this.set_xyz(e[0] * _x + e[4] * _y + e[8] * _z + e[12],e[1] * _x + e[5] * _y + e[9] * _z + e[13],e[2] * _x + e[6] * _y + e[10] * _z + e[14]);
		return this;
	}
	,transformDirection: function(m) {
		var e = m.elements;
		var x = this.x;
		var y = this.y;
		var z = this.z;
		this.set_xyz(e[0] * x + e[4] * y + e[8] * z,e[1] * x + e[5] * y + e[9] * z,e[2] * x + e[6] * y + e[10] * z);
		this.divideScalar(Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z));
		return this;
	}
	,setEulerFromRotationMatrix: function(m,order) {
		if(order == null) order = 0;
		var te = m.elements;
		var m11 = te[0];
		var m12 = te[4];
		var m13 = te[8];
		var m21 = te[1];
		var m22 = te[5];
		var m23 = te[9];
		var m31 = te[2];
		var m32 = te[6];
		var m33 = te[10];
		var _x = this.x;
		var _y = this.y;
		var _z = this.z;
		if(order == 0) {
			_y = Math.asin(m13 < -1?-1:m13 > 1?1:m13);
			if(Math.abs(m13) < 0.99999) {
				_x = Math.atan2(-m23,m33);
				_z = Math.atan2(-m12,m11);
			} else {
				_x = Math.atan2(m32,m22);
				_z = 0;
			}
		} else if(order == 1) {
			_x = Math.asin(-(m23 < -1?-1:m23 > 1?1:m23));
			if(Math.abs(m23) < 0.99999) {
				_y = Math.atan2(m13,m33);
				_z = Math.atan2(m21,m22);
			} else {
				_y = Math.atan2(-m31,m11);
				_z = 0;
			}
		} else if(order == 2) {
			_x = Math.asin(m32 < -1?-1:m32 > 1?1:m32);
			if(Math.abs(m32) < 0.99999) {
				_y = Math.atan2(-m31,m33);
				_z = Math.atan2(-m12,m22);
			} else {
				_y = 0;
				_z = Math.atan2(m21,m11);
			}
		} else if(order == 3) {
			_y = Math.asin(-(m31 < -1?-1:m31 > 1?1:m31));
			if(Math.abs(m31) < 0.99999) {
				_x = Math.atan2(m32,m33);
				_z = Math.atan2(m21,m11);
			} else {
				_x = 0;
				_z = Math.atan2(-m12,m22);
			}
		} else if(order == 4) {
			_z = Math.asin(m21 < -1?-1:m21 > 1?1:m21);
			if(Math.abs(m21) < 0.99999) {
				_x = Math.atan2(-m23,m22);
				_y = Math.atan2(-m31,m11);
			} else {
				_x = 0;
				_y = Math.atan2(m13,m33);
			}
		} else if(order == 5) {
			_z = Math.asin(-(m12 < -1?-1:m12 > 1?1:m12));
			if(Math.abs(m12) < 0.99999) {
				_x = Math.atan2(m32,m22);
				_y = Math.atan2(m13,m11);
			} else {
				_x = Math.atan2(-m23,m33);
				_y = 0;
			}
		}
		this.set_xyz(_x,_y,_z);
		return this;
	}
	,setEulerFromQuaternion: function(q,order) {
		if(order == null) order = 0;
		var sqx = q.x * q.x;
		var sqy = q.y * q.y;
		var sqz = q.z * q.z;
		var sqw = q.w * q.w;
		var _x = this.x;
		var _y = this.y;
		var _z = this.z;
		if(order == 0) {
			_x = Math.atan2(2 * (q.x * q.w - q.y * q.z),sqw - sqx - sqy + sqz);
			_y = Math.asin(luxe.utils.Maths.clamp(2 * (q.x * q.z + q.y * q.w),-1,1));
			_z = Math.atan2(2 * (q.z * q.w - q.x * q.y),sqw + sqx - sqy - sqz);
		} else if(order == 1) {
			_x = Math.asin(luxe.utils.Maths.clamp(2 * (q.x * q.w - q.y * q.z),-1,1));
			_y = Math.atan2(2 * (q.x * q.z + q.y * q.w),sqw - sqx - sqy + sqz);
			_z = Math.atan2(2 * (q.x * q.y + q.z * q.w),sqw - sqx + sqy - sqz);
		} else if(order == 2) {
			_x = Math.asin(luxe.utils.Maths.clamp(2 * (q.x * q.w + q.y * q.z),-1,1));
			_y = Math.atan2(2 * (q.y * q.w - q.z * q.x),sqw - sqx - sqy + sqz);
			_z = Math.atan2(2 * (q.z * q.w - q.x * q.y),sqw - sqx + sqy - sqz);
		} else if(order == 3) {
			_x = Math.atan2(2 * (q.x * q.w + q.z * q.y),sqw - sqx - sqy + sqz);
			_y = Math.asin(luxe.utils.Maths.clamp(2 * (q.y * q.w - q.x * q.z),-1,1));
			_z = Math.atan2(2 * (q.x * q.y + q.z * q.w),sqw + sqx - sqy - sqz);
		} else if(order == 4) {
			_x = Math.atan2(2 * (q.x * q.w - q.z * q.y),sqw - sqx + sqy - sqz);
			_y = Math.atan2(2 * (q.y * q.w - q.x * q.z),sqw + sqx - sqy - sqz);
			_z = Math.asin(luxe.utils.Maths.clamp(2 * (q.x * q.y + q.z * q.w),-1,1));
		} else if(order == 5) {
			_x = Math.atan2(2 * (q.x * q.w + q.y * q.z),sqw - sqx + sqy - sqz);
			_y = Math.atan2(2 * (q.x * q.z + q.y * q.w),sqw + sqx - sqy - sqz);
			_z = Math.asin(luxe.utils.Maths.clamp(2 * (q.z * q.w - q.x * q.y),-1,1));
		}
		this.set_xyz(this.x,this.y,this.z);
		return this;
	}
	,degrees: function() {
		this.set_xyz(this.x * 57.29577951308238,this.y * 57.29577951308238,this.z * 57.29577951308238);
		return this;
	}
	,radians: function() {
		this.set_xyz(this.x * 0.017453292519943278,this.y * 0.017453292519943278,this.z * 0.017453292519943278);
		return this;
	}
	,__class__: phoenix.Vector
	,__properties__: {get_inverted:"get_inverted",get_normalized:"get_normalized",set_angle2D:"set_angle2D",get_angle2D:"get_angle2D",get_lengthsq:"get_lengthsq",set_length:"set_length",get_length:"get_length",set_z:"set_z",set_y:"set_y",set_x:"set_x"}
};
phoenix._Vector = {};
phoenix._Vector.ComponentOrder_Impl_ = function() { };
phoenix._Vector.ComponentOrder_Impl_.__name__ = true;
phoenix._Vector.Vec_Impl_ = function() { };
phoenix._Vector.Vec_Impl_.__name__ = true;
phoenix._Vector.Vec_Impl_._new = function(_x,_y,_z,_w) {
	return new phoenix.Vector(_x,_y,_z,_w);
};
phoenix._Vector.Vec_Impl_._multiply = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x * rhs.x,lhs.y * rhs.y,lhs.z * rhs.z);
};
phoenix._Vector.Vec_Impl_._multiply_scalar = function(lhs,rhs) {
	return phoenix.Vector.Multiply(lhs,rhs);
};
phoenix._Vector.Vec_Impl_._multiply_scalar_int = function(lhs,rhs) {
	return phoenix.Vector.Multiply(lhs,rhs);
};
phoenix._Vector.Vec_Impl_._divide = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x / rhs.x,lhs.y / rhs.y,lhs.z / rhs.z);
};
phoenix._Vector.Vec_Impl_._divide_scalar = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x / rhs,lhs.y / rhs,lhs.z / rhs);
};
phoenix._Vector.Vec_Impl_._divide_scalar_int = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x / rhs,lhs.y / rhs,lhs.z / rhs);
};
phoenix._Vector.Vec_Impl_._add = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x + rhs.x,lhs.y + rhs.y,lhs.z + rhs.z);
};
phoenix._Vector.Vec_Impl_._add_scalar = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x + rhs,lhs.y + rhs,lhs.z + rhs);
};
phoenix._Vector.Vec_Impl_._add_scalar_int = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x + rhs,lhs.y + rhs,lhs.z + rhs);
};
phoenix._Vector.Vec_Impl_._subtract = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x - rhs.x,lhs.y - rhs.y,lhs.z - rhs.z);
};
phoenix._Vector.Vec_Impl_._subtract_scalar = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x - rhs,lhs.y - rhs,lhs.z - rhs);
};
phoenix._Vector.Vec_Impl_._subtract_scalar_int = function(lhs,rhs) {
	return new phoenix.Vector(lhs.x - rhs,lhs.y - rhs,lhs.z - rhs);
};
phoenix.geometry = {};
phoenix.geometry.Geometry = function(options) {
	this.dirty = false;
	this.locked = false;
	this.immediate = false;
	this.visible = true;
	this.dirty_clip = false;
	this.dirty_depth = false;
	this.dirty_group = false;
	this.dirty_shader = false;
	this.dirty_texture = false;
	this.dirty_primitive_type = false;
	this.shadow_clip = false;
	this.shadow_depth = 0.0;
	this.shadow_group = 0;
	this.id = "";
	this.uuid = "";
	this.dropped = false;
	this.added = false;
	this.submitted = false;
	this.uuid = Luxe.utils.uniqueid();
	this.id = this.uuid;
	this.vertices = new Array();
	this.state = new phoenix.geometry.GeometryState();
	this.batchers = new Array();
	this.transform = new phoenix.Transform();
	this._final_vert_position = new phoenix.Vector();
	this.set_clip_rect(null);
	this.set_clip(false);
	var _do_add = true;
	if(options != null) {
		this.state.set_depth(options.depth == null?this.state.depth:options.depth);
		this.state.set_group(options.group == null?this.state.group:options.group);
		this.state.set_texture(options.texture == null?this.state.texture:options.texture);
		this.state.set_clip_rect(options.clip_rect == null?this.state.clip_rect:options.clip_rect);
		this.state.set_primitive_type(options.primitive_type == null?this.state.primitive_type:options.primitive_type);
		this.state.set_shader(options.shader == null?this.state.shader:options.shader);
		if(options.id == null) this.id = this.uuid; else this.id = options.id;
		this.transform.local.set_pos(options.pos == null?this.transform.local.pos:options.pos);
		this.transform.local.set_rotation(options.rotation == null?this.transform.local.rotation:options.rotation);
		this.transform.local.set_scale(options.scale == null?this.transform.local.scale:options.scale);
		this.transform.set_origin(options.origin == null?this.transform.origin:options.origin);
		if(options.immediate == null) this.immediate = false; else this.immediate = options.immediate;
		this.set_visible(options.visible == null?true:options.visible);
		this.set_color(options.color == null?new phoenix.Color():options.color);
		if(options.no_batcher_add == null) _do_add = true; else _do_add = options.no_batcher_add;
	} else this.set_color(new phoenix.Color());
	phoenix.geometry.Geometry._sequence_key++;
	this.key = new phoenix.geometry.GeometryKey();
	this.key.uuid = this.uuid;
	this.key.timestamp = Luxe.get_time();
	this.key.sequence = phoenix.geometry.Geometry._sequence_key;
	this.key.primitive_type = this.state.primitive_type;
	this.key.texture = this.state.texture;
	this.key.shader = this.state.shader;
	this.key.group = this.state.group;
	this.key.depth = this.state.depth;
	this.key.clip = this.state.clip;
	this.transform.id = this.uuid;
	this.transform.name = this.id;
	if(options != null && options.batcher != null && _do_add) options.batcher.add(this);
};
phoenix.geometry.Geometry.__name__ = true;
phoenix.geometry.Geometry.prototype = {
	transform: null
	,vertices: null
	,submitted: null
	,static_vertex_buffer: null
	,static_tcoord_buffer: null
	,static_vcolor_buffer: null
	,static_normal_buffer: null
	,added: null
	,batchers: null
	,state: null
	,dropped: null
	,uuid: null
	,id: null
	,primitive_type: null
	,texture: null
	,shader: null
	,depth: null
	,group: null
	,clip_rect: null
	,shadow_primitive_type: null
	,shadow_texture: null
	,shadow_shader: null
	,shadow_group: null
	,shadow_depth: null
	,shadow_clip: null
	,dirty_primitive_type: null
	,dirty_texture: null
	,dirty_shader: null
	,dirty_group: null
	,dirty_depth: null
	,dirty_clip: null
	,visible: null
	,immediate: null
	,locked: null
	,dirty: null
	,color: null
	,clip: null
	,_final_vert_position: null
	,key: null
	,key_string: function() {
		return "ts: " + this.key.timestamp + "\n" + "sequence: " + this.key.sequence + "\n" + "primitive_type: " + Std.string(this.key.primitive_type) + "\n" + "texture: " + (this.key.texture == null?"null":this.key.texture.id) + "\n" + "shader: " + (this.key.shader == null?"null":this.key.shader.id) + "\n" + "group: " + this.key.group + "\n" + "depth: " + this.key.depth + "\n" + "clip: " + Std.string(this.key.clip);
	}
	,refresh_key: function() {
		this.key.uuid = this.uuid;
		this.key.timestamp = Luxe.get_time();
		this.key.sequence = phoenix.geometry.Geometry._sequence_key;
		this.key.primitive_type = this.state.primitive_type;
		this.key.texture = this.state.texture;
		this.key.shader = this.state.shader;
		this.key.group = this.state.group;
		this.key.depth = this.state.depth;
		this.key.clip = this.state.clip;
	}
	,short_id: function() {
		return HxOverrides.substr(this.uuid,0,6);
	}
	,str: function() {
		if(!this.state.log) return;
		haxe.Log.trace("\t\tgeometry ; " + this.short_id(),{ fileName : "Geometry.hx", lineNumber : 217, className : "phoenix.geometry.Geometry", methodName : "str"});
		this.state.log = true;
		this.state.str();
		this.state.log = false;
	}
	,drop: function(remove) {
		if(remove == null) remove = true;
		if(remove && this.added) {
			var _g = 0;
			var _g1 = this.batchers;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				b.remove(this,true);
			}
		}
		if(this.transform != null) {
			this.transform.destroy();
			this.transform = null;
		}
		this.dropped = true;
	}
	,add: function(v) {
		this.vertices.push(v);
		if(this.vertices.length > Luxe.renderer.batcher.max_verts) {
			haxe.Log.trace("from " + this.id,{ fileName : "Geometry.hx", lineNumber : 247, className : "phoenix.geometry.Geometry", methodName : "add"});
			throw "Currently a single geometry cannot exceed the maximum vert count of " + Luxe.renderer.batcher.max_verts;
		}
	}
	,remove: function(v) {
		HxOverrides.remove(this.vertices,v);
	}
	,batch: function(vert_index,tcoord_index,color_index,normal_index,vertlist,tcoordlist,colorlist,normallist) {
		var _g = 0;
		var _g1 = this.vertices;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			this._final_vert_position.set(v.pos.x,v.pos.y,v.pos.z,v.pos.w);
			this._final_vert_position.transform(this.transform.get_world().get_matrix());
			vertlist[vert_index] = this._final_vert_position.x;
			vertlist[vert_index + 1] = this._final_vert_position.y;
			vertlist[vert_index + 2] = this._final_vert_position.z;
			vertlist[vert_index + 3] = this._final_vert_position.w;
			vert_index += 4;
			tcoordlist[tcoord_index] = v.uv.uv0.u;
			tcoordlist[tcoord_index + 1] = v.uv.uv0.v;
			tcoordlist[tcoord_index + 2] = v.uv.uv0.w;
			tcoordlist[tcoord_index + 3] = v.uv.uv0.t;
			tcoord_index += 4;
			colorlist[color_index] = v.color.r;
			colorlist[color_index + 1] = v.color.g;
			colorlist[color_index + 2] = v.color.b;
			colorlist[color_index + 3] = v.color.a;
			color_index += 4;
		}
	}
	,batch_into_arrays: function(vertlist,tcoordlist,colorlist,normallist) {
		var _g = 0;
		var _g1 = this.vertices;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			this._final_vert_position.set(v.pos.x,v.pos.y,v.pos.z,v.pos.w);
			this._final_vert_position.transform(this.transform.get_world().get_matrix());
			vertlist.push(this._final_vert_position.x);
			vertlist.push(this._final_vert_position.y);
			vertlist.push(this._final_vert_position.z);
			vertlist.push(this._final_vert_position.w);
			tcoordlist.push(v.uv.uv0.u);
			tcoordlist.push(v.uv.uv0.v);
			tcoordlist.push(v.uv.uv0.w);
			tcoordlist.push(v.uv.uv0.t);
			colorlist.push(v.color.r);
			colorlist.push(v.color.g);
			colorlist.push(v.color.b);
			colorlist.push(v.color.a);
			normallist.push(v.normal.x);
			normallist.push(v.normal.y);
			normallist.push(v.normal.z);
			normallist.push(v.normal.w);
		}
	}
	,translate: function(_offset) {
		this.transform.local.pos.set_xyz(this.transform.local.pos.x + _offset.x,this.transform.local.pos.y + _offset.y,this.transform.local.pos.x + _offset.z);
	}
	,set_locked: function(_locked) {
		return this.locked = _locked;
	}
	,get_locked: function() {
		return this.locked;
	}
	,set_dirty: function(_dirty) {
		return this.dirty = _dirty;
	}
	,get_dirty: function() {
		return this.dirty;
	}
	,refresh: function() {
		var _g = 0;
		var _g1 = this.batchers;
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			b.remove(this,false);
		}
		if(this.dirty_primitive_type) {
			this.dirty_primitive_type = false;
			this.state.set_primitive_type(this.shadow_primitive_type);
		}
		if(this.dirty_texture) {
			this.dirty_texture = false;
			this.state.set_texture(this.shadow_texture);
		}
		if(this.dirty_shader) {
			this.dirty_shader = false;
			this.state.set_shader(this.shadow_shader);
		}
		if(this.dirty_group) {
			this.dirty_group = false;
			this.state.set_group(this.shadow_group);
		}
		if(this.dirty_depth) {
			this.dirty_depth = false;
			this.state.set_depth(this.shadow_depth);
		}
		if(this.dirty_clip) {
			this.dirty_clip = false;
			this.state.set_clip(this.shadow_clip);
		}
		this.refresh_key();
		var _g2 = 0;
		var _g11 = this.batchers;
		while(_g2 < _g11.length) {
			var b1 = _g11[_g2];
			++_g2;
			b1.add(this,false);
		}
	}
	,get_primitive_type: function() {
		return this.state.primitive_type;
	}
	,set_primitive_type: function(val) {
		if(this.state.primitive_type != val) {
			this.shadow_primitive_type = val;
			this.dirty_primitive_type = true;
			this.refresh();
		}
		return this.primitive_type = val;
	}
	,get_texture: function() {
		return this.state.texture;
	}
	,set_texture: function(val) {
		if(this.state.texture != val) {
			this.shadow_texture = val;
			this.dirty_texture = true;
			this.refresh();
		}
		return this.texture = val;
	}
	,set_visible: function(val) {
		return this.visible = val;
	}
	,set_color: function(val) {
		var _g = 0;
		var _g1 = this.vertices;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			v.color = val;
		}
		return this.color = val;
	}
	,get_shader: function() {
		return this.state.shader;
	}
	,set_shader: function(val) {
		if(this.state.shader != val) {
			this.shadow_shader = val;
			this.dirty_shader = true;
			this.refresh();
		}
		return this.shader = val;
	}
	,get_depth: function() {
		return this.state.depth;
	}
	,set_depth: function(val) {
		if(this.state.depth != val) {
			this.shadow_depth = val;
			this.dirty_depth = true;
			this.refresh();
		}
		return this.depth = val;
	}
	,get_group: function() {
		return this.state.group;
	}
	,set_group: function(val) {
		if(this.state.group != val) {
			this.shadow_group = val;
			this.dirty_group = true;
			this.refresh();
		}
		return this.group = val;
	}
	,get_clip: function() {
		return this.state.clip;
	}
	,set_clip: function(val) {
		if(this.state.clip != val) {
			this.shadow_clip = val;
			this.dirty_clip = true;
			this.refresh();
		}
		return this.clip = val;
	}
	,get_clip_rect: function() {
		return this.state.clip_rect;
	}
	,set_clip_rect: function(val) {
		if(val == null) this.set_clip(false); else this.set_clip(true);
		return this.state.set_clip_rect(val);
	}
	,__class__: phoenix.geometry.Geometry
	,__properties__: {set_clip:"set_clip",get_clip:"get_clip",set_color:"set_color",set_dirty:"set_dirty",get_dirty:"get_dirty",set_locked:"set_locked",get_locked:"get_locked",set_visible:"set_visible",set_clip_rect:"set_clip_rect",get_clip_rect:"get_clip_rect",set_group:"set_group",get_group:"get_group",set_depth:"set_depth",get_depth:"get_depth",set_shader:"set_shader",get_shader:"get_shader",set_texture:"set_texture",get_texture:"get_texture",set_primitive_type:"set_primitive_type",get_primitive_type:"get_primitive_type"}
};
phoenix.geometry.CircleGeometry = function(options) {
	phoenix.geometry.Geometry.call(this,options);
	if(options == null) return;
	var _radius_x = 32;
	var _radius_y = 32;
	if(options.end_angle == null) options.end_angle = 360;
	if(options.start_angle == null) options.start_angle = 0;
	if(options.r != null) {
		_radius_x = options.r;
		_radius_y = options.r;
	}
	if(options.rx != null) _radius_x = options.rx;
	if(options.ry != null) _radius_y = options.ry;
	if(options.steps == null) {
		if(options.smooth == null) {
			var _max = Math.max(_radius_x,_radius_y);
			options.steps = Luxe.utils.geometry.segments_for_smooth_circle(_max);
		} else {
			var _smooth = options.smooth;
			var _max1 = Math.max(_radius_x,_radius_y);
			options.steps = Luxe.utils.geometry.segments_for_smooth_circle(_max1,_smooth);
		}
	}
	this.set(options.x,options.y,_radius_x,_radius_y,options.steps,options.start_angle,options.end_angle);
	if(options.visible != null) this.set_visible(options.visible);
};
phoenix.geometry.CircleGeometry.__name__ = true;
phoenix.geometry.CircleGeometry.__super__ = phoenix.geometry.Geometry;
phoenix.geometry.CircleGeometry.prototype = $extend(phoenix.geometry.Geometry.prototype,{
	set: function(_x,_y,_rx,_ry,_steps,_start_angle,_end_angle) {
		if(_end_angle == null) _end_angle = 360;
		if(_start_angle == null) _start_angle = 0;
		this.set_primitive_type(4);
		var half_pi = Math.PI / 2;
		var _start_angle_rad = _start_angle * 0.017453292519943278 - half_pi;
		var _end_angle_rad = _end_angle * 0.017453292519943278 - half_pi;
		var _range = _end_angle_rad - _start_angle_rad;
		_steps = Math.ceil(Math.abs(_range) / (Math.PI * 2) * _steps);
		var theta = _range / _steps;
		var tangential_factor = Math.tan(theta);
		var radial_factor = Math.cos(theta);
		var x = _rx * Math.cos(_start_angle_rad);
		var y = _rx * Math.sin(_start_angle_rad);
		var radial_ratio = _rx / _ry;
		if(radial_ratio == 0) radial_ratio = 0.000000001;
		var _index = 0;
		var _segment_pos = [];
		var _g1 = 0;
		var _g = _steps + 1;
		while(_g1 < _g) {
			var i = _g1++;
			var __x = x;
			var __y = y / radial_ratio;
			var _seg = new phoenix.Vector(__x,__y);
			_segment_pos.push(_seg);
			if(_index > 0) this.add(new phoenix.geometry.Vertex(_seg,this.color));
			this.add(new phoenix.geometry.Vertex(new phoenix.Vector(0,0),this.color));
			this.add(new phoenix.geometry.Vertex(_seg,this.color));
			var tx = -y;
			var ty = x;
			x += tx * tangential_factor;
			y += ty * tangential_factor;
			x *= radial_factor;
			y *= radial_factor;
			_index++;
		}
		this.add(new phoenix.geometry.Vertex(_segment_pos[_steps],this.color));
		this.transform.set_pos(new phoenix.Vector(_x,_y));
	}
	,__class__: phoenix.geometry.CircleGeometry
});
phoenix.geometry.RingGeometry = function(options) {
	phoenix.geometry.CircleGeometry.call(this,options);
	this.set_primitive_type(1);
};
phoenix.geometry.RingGeometry.__name__ = true;
phoenix.geometry.RingGeometry.__super__ = phoenix.geometry.CircleGeometry;
phoenix.geometry.RingGeometry.prototype = $extend(phoenix.geometry.CircleGeometry.prototype,{
	set: function(_x,_y,_rx,_ry,_steps,_start_angle_degrees,_end_angle_degrees) {
		if(_end_angle_degrees == null) _end_angle_degrees = 360;
		if(_start_angle_degrees == null) _start_angle_degrees = 0;
		this.set_primitive_type(4);
		var _start_angle_rad = _start_angle_degrees * 0.017453292519943278;
		var _end_angle_rad = _end_angle_degrees * 0.017453292519943278;
		var _range = _end_angle_rad - _start_angle_rad;
		var theta = _range / _steps;
		var tangential_factor = Math.tan(theta);
		var radial_factor = Math.cos(theta);
		var x = _rx * Math.cos(_start_angle_rad);
		var y = _rx * Math.sin(_start_angle_rad);
		var radial_ratio = _rx / _ry;
		if(radial_ratio == 0) radial_ratio = 0.000000001;
		var _index = 0;
		var _segment_pos = [];
		var _g = 0;
		while(_g < _steps) {
			var i = _g++;
			var __x = x;
			var __y = y / radial_ratio;
			var _seg = new phoenix.Vector(__x,__y);
			_segment_pos.push(_seg);
			this.add(new phoenix.geometry.Vertex(_seg,this.color));
			if(_index > 0) {
				var prevvert = _segment_pos[_index];
				this.add(new phoenix.geometry.Vertex(new phoenix.Vector(prevvert.x,prevvert.y,prevvert.z,prevvert.w),this.color));
			}
			var tx = -y;
			var ty = x;
			x += tx * tangential_factor;
			y += ty * tangential_factor;
			x *= radial_factor;
			y *= radial_factor;
			_index++;
		}
		this.add(new phoenix.geometry.Vertex(_segment_pos[0],this.color));
		this.transform.set_pos(new phoenix.Vector(_x,_y));
	}
	,__class__: phoenix.geometry.RingGeometry
});
phoenix.geometry.ArcGeometry = function(options) {
	phoenix.geometry.RingGeometry.call(this,options);
	this.vertices.pop();
	this.vertices.pop();
	this.set_primitive_type(1);
};
phoenix.geometry.ArcGeometry.__name__ = true;
phoenix.geometry.ArcGeometry.__super__ = phoenix.geometry.RingGeometry;
phoenix.geometry.ArcGeometry.prototype = $extend(phoenix.geometry.RingGeometry.prototype,{
	__class__: phoenix.geometry.ArcGeometry
});
phoenix.geometry.ComplexGeometry = function(_options) {
	phoenix.geometry.Geometry.call(this,_options);
	this.set_primitive_type(4);
	this.quads = new haxe.ds.StringMap();
};
phoenix.geometry.ComplexGeometry.__name__ = true;
phoenix.geometry.ComplexGeometry.__super__ = phoenix.geometry.Geometry;
phoenix.geometry.ComplexGeometry.prototype = $extend(phoenix.geometry.Geometry.prototype,{
	quads: null
	,clear: function() {
		var $it0 = this.quads.keys();
		while( $it0.hasNext() ) {
			var q = $it0.next();
			this.quad_remove(q);
		}
	}
	,quad_add: function(_options) {
		var _uuid = Luxe.utils.uniqueid();
		var vert0 = new phoenix.geometry.Vertex(new phoenix.Vector(_options.x,_options.y));
		var vert1 = new phoenix.geometry.Vertex(new phoenix.Vector(_options.x + _options.w,_options.y));
		var vert2 = new phoenix.geometry.Vertex(new phoenix.Vector(_options.x + _options.w,_options.y + _options.h));
		var vert3 = new phoenix.geometry.Vertex(new phoenix.Vector(_options.x,_options.y + _options.h));
		var vert4 = new phoenix.geometry.Vertex(new phoenix.Vector(_options.x,_options.y));
		var vert5 = new phoenix.geometry.Vertex(new phoenix.Vector(_options.x + _options.w,_options.y + _options.h));
		this.add(vert0);
		this.add(vert1);
		this.add(vert2);
		this.add(vert3);
		this.add(vert4);
		this.add(vert5);
		var _complex_quad = { uuid : _uuid, verts : new Array(), flipx : false, flipy : false, _uv_cache : new phoenix.Rectangle(0,0,1,1)};
		_complex_quad.verts.push(vert0);
		_complex_quad.verts.push(vert1);
		_complex_quad.verts.push(vert2);
		_complex_quad.verts.push(vert3);
		_complex_quad.verts.push(vert4);
		_complex_quad.verts.push(vert5);
		this.quads.set(_uuid,_complex_quad);
		this.set_dirty(true);
		return _uuid;
	}
	,quad_remove: function(_quad_id) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			this.remove(_complex_quad.verts[0]);
			this.remove(_complex_quad.verts[1]);
			this.remove(_complex_quad.verts[2]);
			this.remove(_complex_quad.verts[3]);
			this.remove(_complex_quad.verts[4]);
			this.remove(_complex_quad.verts[5]);
			this.quads.remove(_quad_id);
			this.set_dirty(true);
		}
	}
	,quad_hide: function(_quad_id) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			this.remove(_complex_quad.verts[0]);
			this.remove(_complex_quad.verts[1]);
			this.remove(_complex_quad.verts[2]);
			this.remove(_complex_quad.verts[3]);
			this.remove(_complex_quad.verts[4]);
			this.remove(_complex_quad.verts[5]);
			this.set_dirty(true);
		}
	}
	,quad_show: function(_quad_id) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			this.add(_complex_quad.verts[0]);
			this.add(_complex_quad.verts[1]);
			this.add(_complex_quad.verts[2]);
			this.add(_complex_quad.verts[3]);
			this.add(_complex_quad.verts[4]);
			this.add(_complex_quad.verts[5]);
			this.set_dirty(true);
		}
	}
	,quad_resize: function(_quad_id,_quad) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			_complex_quad.verts[0].pos = new phoenix.Vector(_quad.x,_quad.y);
			_complex_quad.verts[1].pos = new phoenix.Vector(_quad.x + _quad.w,_quad.y);
			_complex_quad.verts[2].pos = new phoenix.Vector(_quad.x + _quad.w,_quad.y + _quad.h);
			_complex_quad.verts[3].pos = new phoenix.Vector(_quad.x,_quad.y + _quad.h);
			_complex_quad.verts[4].pos = new phoenix.Vector(_quad.x,_quad.y);
			_complex_quad.verts[5].pos = new phoenix.Vector(_quad.x + _quad.w,_quad.y + _quad.h);
			this.set_dirty(true);
		}
	}
	,quad_pos: function(_quad_id,_p) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			var _diffx = _p.x - _complex_quad.verts[0].pos.x;
			var _diffy = _p.y - _complex_quad.verts[0].pos.y;
			var _g = _complex_quad.verts[0].pos;
			_g.set_x(_g.x + _diffx);
			var _g1 = _complex_quad.verts[0].pos;
			_g1.set_y(_g1.y + _diffy);
			var _g2 = _complex_quad.verts[1].pos;
			_g2.set_x(_g2.x + _diffx);
			var _g3 = _complex_quad.verts[1].pos;
			_g3.set_y(_g3.y + _diffy);
			var _g4 = _complex_quad.verts[2].pos;
			_g4.set_x(_g4.x + _diffx);
			var _g5 = _complex_quad.verts[2].pos;
			_g5.set_y(_g5.y + _diffy);
			var _g6 = _complex_quad.verts[3].pos;
			_g6.set_x(_g6.x + _diffx);
			var _g7 = _complex_quad.verts[3].pos;
			_g7.set_y(_g7.y + _diffy);
			var _g8 = _complex_quad.verts[4].pos;
			_g8.set_x(_g8.x + _diffx);
			var _g9 = _complex_quad.verts[4].pos;
			_g9.set_y(_g9.y + _diffy);
			var _g10 = _complex_quad.verts[5].pos;
			_g10.set_x(_g10.x + _diffx);
			var _g11 = _complex_quad.verts[5].pos;
			_g11.set_y(_g11.y + _diffy);
			this.set_dirty(true);
		}
	}
	,quad_color: function(_quad_id,_c) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			_complex_quad.verts[0].color = _c;
			_complex_quad.verts[1].color = _c;
			_complex_quad.verts[2].color = _c;
			_complex_quad.verts[3].color = _c;
			_complex_quad.verts[4].color = _c;
			_complex_quad.verts[5].color = _c;
		}
	}
	,quad_alpha: function(_quad_id,_a) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			_complex_quad.verts[0].color.a = _a;
			_complex_quad.verts[1].color.a = _a;
			_complex_quad.verts[2].color.a = _a;
			_complex_quad.verts[3].color.a = _a;
			_complex_quad.verts[4].color.a = _a;
			_complex_quad.verts[5].color.a = _a;
		}
	}
	,quad_uv_space: function(_quad_id,_uv) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			var flipx = _complex_quad.flipx;
			var flipy = _complex_quad.flipy;
			var sz_x = _uv.w;
			var sz_y = _uv.h;
			var tl_x = _uv.x;
			var tl_y = _uv.y;
			_complex_quad._uv_cache.set(tl_x,tl_y,sz_x,sz_y);
			var tr_x = tl_x + sz_x;
			var tr_y = tl_y;
			var br_x = tl_x + sz_x;
			var br_y = tl_y + sz_y;
			var bl_x = tl_x;
			var bl_y = tl_y + sz_y;
			var tmp_x = 0.0;
			var tmp_y = 0.0;
			if(flipy) {
				tmp_y = bl_y;
				bl_y = tl_y;
				tl_y = tmp_y;
				tmp_y = br_y;
				br_y = tr_y;
				tr_y = tmp_y;
			}
			if(flipx) {
				tmp_x = tr_x;
				tr_x = tl_x;
				tl_x = tmp_x;
				tmp_x = br_x;
				br_x = bl_x;
				bl_x = tmp_x;
			}
			_complex_quad.verts[0].uv.uv0.set_uv(tl_x,tl_y);
			_complex_quad.verts[1].uv.uv0.set_uv(tr_x,tr_y);
			_complex_quad.verts[2].uv.uv0.set_uv(br_x,br_y);
			_complex_quad.verts[3].uv.uv0.set_uv(bl_x,bl_y);
			_complex_quad.verts[4].uv.uv0.set_uv(tl_x,tl_y);
			_complex_quad.verts[5].uv.uv0.set_uv(br_x,br_y);
			this.set_dirty(true);
		}
	}
	,quad_uv: function(_quad_id,_uv) {
		if(this.get_texture() == null) {
			haxe.Log.trace("Warning : calling UV on a Complex Geometry with null texture.",{ fileName : "ComplexGeometry.hx", lineNumber : 328, className : "phoenix.geometry.ComplexGeometry", methodName : "quad_uv"});
			return;
		}
		var tlx = _uv.x / this.get_texture().width_actual;
		var tly = _uv.y / this.get_texture().height_actual;
		var szx = _uv.w / this.get_texture().width_actual;
		var szy = _uv.h / this.get_texture().height_actual;
		this.quad_uv_space(_quad_id,new phoenix.Rectangle(tlx,tly,szx,szy));
	}
	,quad_flipx: function(_quad_id,_flip) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			_complex_quad.flipx = _flip;
			this.quad_uv_space(_quad_id,_complex_quad._uv_cache);
		}
	}
	,quad_flipy: function(_quad_id,_flip) {
		var _complex_quad = this.quads.get(_quad_id);
		if(_complex_quad != null) {
			_complex_quad.flipy = _flip;
			this.quad_uv_space(_quad_id,_complex_quad._uv_cache);
		}
	}
	,__class__: phoenix.geometry.ComplexGeometry
});
phoenix.geometry.CompositeGeometry = function(_options) {
	phoenix.geometry.Geometry.call(this,_options);
	this.geometry = new Array();
};
phoenix.geometry.CompositeGeometry.__name__ = true;
phoenix.geometry.CompositeGeometry.__super__ = phoenix.geometry.Geometry;
phoenix.geometry.CompositeGeometry.prototype = $extend(phoenix.geometry.Geometry.prototype,{
	geometry: null
	,toString: function() {
		return "CompositeGeometry " + Std.string(this.geometry) + " : " + Std.string(this.geometry);
	}
	,clear: function() {
		var _g = 0;
		var _g1 = this.geometry;
		while(_g < _g1.length) {
			var geom = _g1[_g];
			++_g;
			geom.transform.set_parent(null);
		}
		this.geometry.splice(0,this.geometry.length);
	}
	,replace: function(_geometry) {
		this.clear();
		this.geometry = _geometry;
		var _g = 0;
		var _g1 = this.geometry;
		while(_g < _g1.length) {
			var geom = _g1[_g];
			++_g;
			geom.transform.set_parent(this.transform);
		}
	}
	,has_geometry: function(geom) {
		return Lambda.has(this.geometry,geom);
	}
	,add_geometry: function(geom) {
		if(geom != null) {
			geom.transform.set_parent(this.transform);
			this.geometry.push(geom);
		}
	}
	,remove_geometry: function(g) {
		if(HxOverrides.remove(this.geometry,g)) g.transform.set_parent(null);
	}
	,add_to_batcher: function(_batcher) {
		var _g = 0;
		var _g1 = this.geometry;
		while(_g < _g1.length) {
			var geom = _g1[_g];
			++_g;
			_batcher.add(geom);
		}
	}
	,drop: function(remove) {
		if(remove == null) remove = true;
		phoenix.geometry.Geometry.prototype.drop.call(this,remove);
		var _g = 0;
		var _g1 = this.geometry;
		while(_g < _g1.length) {
			var geom = _g1[_g];
			++_g;
			geom.drop(remove);
			geom = null;
		}
		this.geometry = null;
		this.geometry = [];
	}
	,translate: function(_offset) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.translate(_offset);
			}
		}
	}
	,set_color: function(_color) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_color(_color);
			}
		}
		return this.color = _color;
	}
	,set_primitive_type: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_primitive_type(val);
			}
		}
		return this.primitive_type = val;
	}
	,set_shader: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_shader(val);
			}
		}
		return this.shader = val;
	}
	,set_texture: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_texture(val);
			}
		}
		return this.texture = val;
	}
	,set_depth: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_depth(val);
			}
		}
		return this.depth = val;
	}
	,set_group: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_group(val);
			}
		}
		return this.group = val;
	}
	,set_locked: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_locked(val);
			}
		}
		return this.locked = val;
	}
	,set_dirty: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_dirty(val);
			}
		}
		return this.dirty = val;
	}
	,set_clip_rect: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_clip_rect(val);
			}
		}
		return this.clip_rect = val;
	}
	,set_visible: function(val) {
		if(this.geometry != null) {
			var _g = 0;
			var _g1 = this.geometry;
			while(_g < _g1.length) {
				var geom = _g1[_g];
				++_g;
				geom.set_visible(val);
			}
		}
		return this.visible = val;
	}
	,__class__: phoenix.geometry.CompositeGeometry
});
phoenix.geometry.GeometryKey = function() {
	this.clip = false;
	this.depth = 0;
	this.group = 0;
	this.uuid = "";
	this.sequence = 0;
	this.timestamp = 0;
};
phoenix.geometry.GeometryKey.__name__ = true;
phoenix.geometry.GeometryKey.prototype = {
	timestamp: null
	,sequence: null
	,uuid: null
	,primitive_type: null
	,texture: null
	,shader: null
	,group: null
	,depth: null
	,clip: null
	,__class__: phoenix.geometry.GeometryKey
};
phoenix.geometry.GeometryState = function() {
	this.log = false;
	this.set_clip(false);
	this.set_clip_rect(new phoenix.Rectangle());
	this.set_texture(null);
	this.set_shader(null);
	this.set_group(0);
	this.set_depth(0.0);
	this.set_primitive_type(0);
	this.dirty = false;
};
phoenix.geometry.GeometryState.__name__ = true;
phoenix.geometry.GeometryState.prototype = {
	dirty: null
	,primitive_type: null
	,shader: null
	,texture: null
	,depth: null
	,group: null
	,clip: null
	,clip_rect: null
	,log: null
	,clone_onto: function(_other) {
		_other.dirty = this.dirty;
		_other.set_texture(this.texture);
		_other.set_shader(this.shader);
		_other.set_group(this.group);
		_other.set_depth(this.depth);
		_other.set_primitive_type(this.primitive_type);
		_other.set_clip(this.clip);
		_other.clip_rect.copy_from(this.clip_rect);
	}
	,str: function() {
		if(!this.log) return;
		haxe.Log.trace("\t+ GEOMETRYSTATE " + Std.string(this.dirty),{ fileName : "GeometryState.hx", lineNumber : 53, className : "phoenix.geometry.GeometryState", methodName : "str"});
		haxe.Log.trace("\t\tdepth - " + this.depth,{ fileName : "GeometryState.hx", lineNumber : 54, className : "phoenix.geometry.GeometryState", methodName : "str"});
		haxe.Log.trace("\t\tgroup - " + this.group,{ fileName : "GeometryState.hx", lineNumber : 55, className : "phoenix.geometry.GeometryState", methodName : "str"});
		haxe.Log.trace("\t\ttexture - " + (this.texture == null?"null":this.texture.id),{ fileName : "GeometryState.hx", lineNumber : 56, className : "phoenix.geometry.GeometryState", methodName : "str"});
		if(this.texture != null) haxe.Log.trace("\t\t\t " + Std.string(this.texture.texture),{ fileName : "GeometryState.hx", lineNumber : 58, className : "phoenix.geometry.GeometryState", methodName : "str"});
		haxe.Log.trace("\t\tshader - " + (this.shader == null?"null":this.shader.id),{ fileName : "GeometryState.hx", lineNumber : 60, className : "phoenix.geometry.GeometryState", methodName : "str"});
		haxe.Log.trace("\t\tprimitive_type - " + Std.string(this.primitive_type),{ fileName : "GeometryState.hx", lineNumber : 61, className : "phoenix.geometry.GeometryState", methodName : "str"});
		haxe.Log.trace("\t\tclip - " + Std.string(this.clip),{ fileName : "GeometryState.hx", lineNumber : 62, className : "phoenix.geometry.GeometryState", methodName : "str"});
		haxe.Log.trace("\t\tclip rect - " + Std.string(this.clip_rect),{ fileName : "GeometryState.hx", lineNumber : 63, className : "phoenix.geometry.GeometryState", methodName : "str"});
		haxe.Log.trace("\t- GEOMETRYSTATE",{ fileName : "GeometryState.hx", lineNumber : 64, className : "phoenix.geometry.GeometryState", methodName : "str"});
	}
	,clean: function() {
		this.dirty = false;
	}
	,update: function(other) {
		if(this.depth != other.depth) this.set_depth(other.depth);
		if(this.group != other.group) this.set_group(other.group);
		if(this.texture != other.texture) this.set_texture(other.texture);
		if(this.shader != other.shader) this.set_shader(other.shader);
		if(this.primitive_type != other.primitive_type) this.set_primitive_type(other.primitive_type);
		if(this.clip != other.clip) this.set_clip(other.clip);
		if(this.clip_rect != null) {
			if(other.clip_rect != null && !this.clip_rect.equal(other.clip_rect)) this.clip_rect.set(other.clip_rect.x,other.clip_rect.y,other.clip_rect.w,other.clip_rect.h);
		}
	}
	,set_primitive_type: function(val) {
		this.dirty = true;
		return this.primitive_type = val;
	}
	,set_texture: function(val) {
		this.dirty = true;
		return this.texture = val;
	}
	,set_shader: function(val) {
		this.dirty = true;
		return this.shader = val;
	}
	,set_depth: function(val) {
		return this.depth = val;
	}
	,set_group: function(val) {
		this.dirty = true;
		return this.group = val;
	}
	,set_clip: function(val) {
		this.dirty = true;
		return this.clip = val;
	}
	,set_clip_rect: function(val) {
		this.dirty = true;
		return this.clip_rect = val;
	}
	,__class__: phoenix.geometry.GeometryState
	,__properties__: {set_clip_rect:"set_clip_rect",set_clip:"set_clip",set_group:"set_group",set_depth:"set_depth",set_texture:"set_texture",set_shader:"set_shader",set_primitive_type:"set_primitive_type"}
};
phoenix.geometry.LineGeometry = function(options) {
	phoenix.geometry.Geometry.call(this,options);
	if(options == null) return;
	if(options.color == null) options.color = new phoenix.Color();
	if(options.color0 == null) options.color0 = options.color;
	if(options.color1 == null) options.color1 = options.color;
	this.set_p0(new phoenix.Vector());
	this.set_p1(new phoenix.Vector());
	this.set(options);
};
phoenix.geometry.LineGeometry.__name__ = true;
phoenix.geometry.LineGeometry.__super__ = phoenix.geometry.Geometry;
phoenix.geometry.LineGeometry.prototype = $extend(phoenix.geometry.Geometry.prototype,{
	p0: null
	,p1: null
	,set_p0: function(_p) {
		if(this.vertices.length == 0) return this.p0 = _p;
		this.vertices[0].pos.set_x(_p.x);
		this.vertices[0].pos.set_y(_p.y);
		this.vertices[0].pos.set_z(_p.z);
		return this.p0 = _p;
	}
	,set_p1: function(_p) {
		if(this.vertices.length == 0) return this.set_p0(_p);
		this.vertices[1].pos.set_x(_p.x);
		this.vertices[1].pos.set_y(_p.y);
		this.vertices[1].pos.set_z(_p.z);
		return this.p1 = _p;
	}
	,set: function(options) {
		this.vertices.splice(0,this.vertices.length);
		var vert0 = new phoenix.geometry.Vertex(new phoenix.Vector(options.p0.x,options.p0.y,options.p0.z),options.color0);
		vert0.uv.uv0.set_uv(0,0);
		var vert1 = new phoenix.geometry.Vertex(new phoenix.Vector(options.p1.x,options.p1.y,options.p1.z),options.color1);
		vert1.uv.uv0.set_uv(1,0);
		this.add(vert0);
		this.add(vert1);
		this.set_primitive_type(1);
		this.immediate = options.immediate;
	}
	,__class__: phoenix.geometry.LineGeometry
	,__properties__: $extend(phoenix.geometry.Geometry.prototype.__properties__,{set_p1:"set_p1",set_p0:"set_p0"})
});
phoenix.geometry.PlaneGeometry = function(options) {
	this.is_set = false;
	this.flipy = false;
	this.flipx = false;
	phoenix.geometry.Geometry.call(this,options);
	if(options == null) return;
	if(options.flipx != null) this.set_flipx(options.flipx);
	if(options.flipy != null) this.set_flipy(options.flipy);
	this._uv_cache = new phoenix.Rectangle(0,0,1,1);
	this.set(new phoenix.Rectangle(options.x,options.z,options.w,options.h),options.y);
	if(options.visible != null) this.set_visible(options.visible);
	if(options.immediate != null) this.immediate = options.immediate;
};
phoenix.geometry.PlaneGeometry.__name__ = true;
phoenix.geometry.PlaneGeometry.__super__ = phoenix.geometry.Geometry;
phoenix.geometry.PlaneGeometry.prototype = $extend(phoenix.geometry.Geometry.prototype,{
	flipx: null
	,flipy: null
	,_uv_cache: null
	,is_set: null
	,uv: function(_rect) {
		if(this.get_texture() == null) {
			haxe.Log.trace("Warning : calling UV on a geometry with null texture.",{ fileName : "PlaneGeometry.hx", lineNumber : 45, className : "phoenix.geometry.PlaneGeometry", methodName : "uv"});
			return;
		}
		var tlx = _rect.x / this.get_texture().width_actual;
		var tly = _rect.y / this.get_texture().height_actual;
		var szx = _rect.w / this.get_texture().width_actual;
		var szy = _rect.h / this.get_texture().height_actual;
		this.uv_space(new phoenix.Rectangle(tlx,tly,szx,szy));
	}
	,uv_space: function(_rect) {
		var sz_x = _rect.w;
		var sz_y = _rect.h;
		var tl_x = _rect.x;
		var tl_y = _rect.y;
		this._uv_cache.set(tl_x,tl_y,sz_x,sz_y);
		var tr_x = tl_x + sz_x;
		var tr_y = tl_y;
		var br_x = tl_x + sz_x;
		var br_y = tl_y + sz_y;
		var bl_x = tl_x;
		var bl_y = tl_y + sz_y;
		var tmp_x = 0.0;
		var tmp_y = 0.0;
		if(this.flipy) {
			tmp_y = bl_y;
			bl_y = tl_y;
			tl_y = tmp_y;
			tmp_y = br_y;
			br_y = tr_y;
			tr_y = tmp_y;
		}
		if(this.flipx) {
			tmp_x = tr_x;
			tr_x = tl_x;
			tl_x = tmp_x;
			tmp_x = br_x;
			br_x = bl_x;
			bl_x = tmp_x;
		}
		this.vertices[0].uv.uv0.set_uv(tl_x,tl_y);
		this.vertices[1].uv.uv0.set_uv(tr_x,tr_y);
		this.vertices[2].uv.uv0.set_uv(br_x,br_y);
		this.vertices[3].uv.uv0.set_uv(bl_x,bl_y);
		this.vertices[4].uv.uv0.set_uv(tl_x,tl_y);
		this.vertices[5].uv.uv0.set_uv(br_x,br_y);
		this.set_dirty(true);
	}
	,set: function(quad,y) {
		this.vertices.splice(0,this.vertices.length);
		var vert0 = new phoenix.geometry.Vertex(new phoenix.Vector(0,0,0),this.color);
		var vert1 = new phoenix.geometry.Vertex(new phoenix.Vector(quad.w,0,0),this.color);
		var vert2 = new phoenix.geometry.Vertex(new phoenix.Vector(quad.w,0,quad.h),this.color);
		var vert3 = new phoenix.geometry.Vertex(new phoenix.Vector(0,0,quad.h),this.color);
		var vert4 = new phoenix.geometry.Vertex(new phoenix.Vector(0,0,0),this.color);
		var vert5 = new phoenix.geometry.Vertex(new phoenix.Vector(quad.w,0,quad.h),this.color);
		this.add(vert5);
		this.add(vert4);
		this.add(vert3);
		this.add(vert2);
		this.add(vert1);
		this.add(vert0);
		this.set_primitive_type(4);
		this.immediate = false;
		this.transform.set_pos(new phoenix.Vector(quad.x,y,quad.y));
		this.is_set = true;
		this.uv_space(new phoenix.Rectangle(0,0,1,1));
	}
	,set_flipx: function(_val) {
		this.flipx = _val;
		if(this.is_set) this.uv_space(this._uv_cache);
		return this.flipx;
	}
	,set_flipy: function(_val) {
		this.flipy = _val;
		if(this.is_set) this.uv_space(this._uv_cache);
		return this.flipy;
	}
	,__class__: phoenix.geometry.PlaneGeometry
	,__properties__: $extend(phoenix.geometry.Geometry.prototype.__properties__,{set_flipy:"set_flipy",set_flipx:"set_flipx"})
});
phoenix.geometry.QuadGeometry = function(options) {
	this.is_set = false;
	this.flipy = false;
	this.flipx = false;
	phoenix.geometry.Geometry.call(this,options);
	if(options == null) return;
	if(options.flipx != null) this.set_flipx(options.flipx);
	if(options.flipy != null) this.set_flipy(options.flipy);
	this._uv_cache = new phoenix.Rectangle(0,0,1,1);
	this.set(new phoenix.Rectangle(options.x,options.y,options.w,options.h));
	if(options.visible != null) this.set_visible(options.visible);
	if(options.immediate != null) this.immediate = options.immediate;
};
phoenix.geometry.QuadGeometry.__name__ = true;
phoenix.geometry.QuadGeometry.__super__ = phoenix.geometry.Geometry;
phoenix.geometry.QuadGeometry.prototype = $extend(phoenix.geometry.Geometry.prototype,{
	flipx: null
	,flipy: null
	,_uv_cache: null
	,is_set: null
	,uv: function(_rect) {
		if(this.get_texture() == null) {
			haxe.Log.trace("Warning : calling UV on a geometry with null texture.",{ fileName : "QuadGeometry.hx", lineNumber : 44, className : "phoenix.geometry.QuadGeometry", methodName : "uv"});
			return;
		}
		var tlx = _rect.x / this.get_texture().width_actual;
		var tly = _rect.y / this.get_texture().height_actual;
		var szx = _rect.w / this.get_texture().width_actual;
		var szy = _rect.h / this.get_texture().height_actual;
		this.uv_space(new phoenix.Rectangle(tlx,tly,szx,szy));
	}
	,uv_space: function(_rect) {
		var sz_x = _rect.w;
		var sz_y = _rect.h;
		var tl_x = _rect.x;
		var tl_y = _rect.y;
		this._uv_cache.set(tl_x,tl_y,sz_x,sz_y);
		var tr_x = tl_x + sz_x;
		var tr_y = tl_y;
		var br_x = tl_x + sz_x;
		var br_y = tl_y + sz_y;
		var bl_x = tl_x;
		var bl_y = tl_y + sz_y;
		var tmp_x = 0.0;
		var tmp_y = 0.0;
		if(this.flipy) {
			tmp_y = bl_y;
			bl_y = tl_y;
			tl_y = tmp_y;
			tmp_y = br_y;
			br_y = tr_y;
			tr_y = tmp_y;
		}
		if(this.flipx) {
			tmp_x = tr_x;
			tr_x = tl_x;
			tl_x = tmp_x;
			tmp_x = br_x;
			br_x = bl_x;
			bl_x = tmp_x;
		}
		this.vertices[0].uv.uv0.set_uv(tl_x,tl_y);
		this.vertices[1].uv.uv0.set_uv(tr_x,tr_y);
		this.vertices[2].uv.uv0.set_uv(br_x,br_y);
		this.vertices[3].uv.uv0.set_uv(bl_x,bl_y);
		this.vertices[4].uv.uv0.set_uv(tl_x,tl_y);
		this.vertices[5].uv.uv0.set_uv(br_x,br_y);
		this.set_dirty(true);
	}
	,resize: function(quad) {
		this.vertices[0].pos.set_xy(0,0);
		this.vertices[1].pos.set_xy(quad.x,0);
		this.vertices[2].pos.set_xy(quad.x,quad.y);
		this.vertices[3].pos.set_xy(0,quad.y);
		this.vertices[4].pos.set_xy(0,0);
		this.vertices[5].pos.set_xy(quad.x,quad.y);
	}
	,set: function(quad) {
		this.vertices.splice(0,this.vertices.length);
		var vert0 = new phoenix.geometry.Vertex(new phoenix.Vector(0,0),this.color);
		var vert1 = new phoenix.geometry.Vertex(new phoenix.Vector(quad.w,0),this.color);
		var vert2 = new phoenix.geometry.Vertex(new phoenix.Vector(quad.w,quad.h),this.color);
		var vert3 = new phoenix.geometry.Vertex(new phoenix.Vector(0,quad.h),this.color);
		var vert4 = new phoenix.geometry.Vertex(new phoenix.Vector(0,0),this.color);
		var vert5 = new phoenix.geometry.Vertex(new phoenix.Vector(quad.w,quad.h),this.color);
		this.add(vert0);
		this.add(vert1);
		this.add(vert2);
		this.add(vert3);
		this.add(vert4);
		this.add(vert5);
		this.set_primitive_type(4);
		this.immediate = false;
		this.transform.set_pos(new phoenix.Vector(quad.x,quad.y));
		this.is_set = true;
		this.uv_space(new phoenix.Rectangle(0,0,1,1));
	}
	,set_flipx: function(_val) {
		this.flipx = _val;
		if(this.is_set) this.uv_space(this._uv_cache);
		return this.flipx;
	}
	,set_flipy: function(_val) {
		this.flipy = _val;
		if(this.is_set) this.uv_space(this._uv_cache);
		return this.flipy;
	}
	,__class__: phoenix.geometry.QuadGeometry
	,__properties__: $extend(phoenix.geometry.Geometry.prototype.__properties__,{set_flipy:"set_flipy",set_flipx:"set_flipx"})
});
phoenix.geometry.RectangleGeometry = function(options) {
	phoenix.geometry.Geometry.call(this,options);
	if(options == null) return;
	this.set(options);
};
phoenix.geometry.RectangleGeometry.__name__ = true;
phoenix.geometry.RectangleGeometry.__super__ = phoenix.geometry.Geometry;
phoenix.geometry.RectangleGeometry.prototype = $extend(phoenix.geometry.Geometry.prototype,{
	set: function(options) {
		this.vertices.splice(0,this.vertices.length);
		var vert0 = new phoenix.geometry.Vertex(new phoenix.Vector(0,0));
		vert0.uv.uv0.set_uv(0,0);
		var vert1 = new phoenix.geometry.Vertex(new phoenix.Vector(options.w,0));
		vert1.uv.uv0.set_uv(1,0);
		var vert2 = new phoenix.geometry.Vertex(new phoenix.Vector(options.w,0));
		vert2.uv.uv0.set_uv(1,0);
		var vert3 = new phoenix.geometry.Vertex(new phoenix.Vector(options.w,options.h));
		vert3.uv.uv0.set_uv(1,1);
		var vert4 = new phoenix.geometry.Vertex(new phoenix.Vector(options.w,options.h));
		vert4.uv.uv0.set_uv(1,1);
		var vert5 = new phoenix.geometry.Vertex(new phoenix.Vector(0,options.h));
		vert5.uv.uv0.set_uv(0,1);
		var vert6 = new phoenix.geometry.Vertex(new phoenix.Vector(0,options.h));
		vert6.uv.uv0.set_uv(0,1);
		var vert7 = new phoenix.geometry.Vertex(new phoenix.Vector(0,0));
		vert7.uv.uv0.set_uv(0,0);
		this.add(vert0);
		this.add(vert1);
		this.add(vert2);
		this.add(vert3);
		this.add(vert4);
		this.add(vert5);
		this.add(vert6);
		this.add(vert7);
		this.set_primitive_type(1);
		if(options.immediate == null) this.immediate = false; else this.immediate = options.immediate;
		this.set_visible(options.visible == null?true:options.visible);
		this.set_color(options.color == null?new phoenix.Color():options.color);
		this.transform.set_pos(new phoenix.Vector(options.x,options.y));
	}
	,__class__: phoenix.geometry.RectangleGeometry
});
phoenix.geometry.TextureCoordSet = function() {
	this.uv0 = new phoenix.geometry.TextureCoord();
	this.uv1 = new phoenix.geometry.TextureCoord();
	this.uv2 = new phoenix.geometry.TextureCoord();
	this.uv3 = new phoenix.geometry.TextureCoord();
	this.uv4 = new phoenix.geometry.TextureCoord();
	this.uv5 = new phoenix.geometry.TextureCoord();
	this.uv6 = new phoenix.geometry.TextureCoord();
	this.uv7 = new phoenix.geometry.TextureCoord();
};
phoenix.geometry.TextureCoordSet.__name__ = true;
phoenix.geometry.TextureCoordSet.prototype = {
	uv0: null
	,uv1: null
	,uv2: null
	,uv3: null
	,uv4: null
	,uv5: null
	,uv6: null
	,uv7: null
	,clone: function() {
		var _set = new phoenix.geometry.TextureCoordSet();
		_set.uv0.set(this.uv0.u,this.uv0.v,this.uv0.w,this.uv0.t);
		_set.uv1.set(this.uv1.u,this.uv1.v,this.uv1.w,this.uv1.t);
		_set.uv2.set(this.uv2.u,this.uv2.v,this.uv2.w,this.uv2.t);
		_set.uv3.set(this.uv3.u,this.uv3.v,this.uv3.w,this.uv3.t);
		_set.uv4.set(this.uv4.u,this.uv4.v,this.uv4.w,this.uv4.t);
		_set.uv5.set(this.uv5.u,this.uv5.v,this.uv5.w,this.uv5.t);
		_set.uv6.set(this.uv6.u,this.uv6.v,this.uv6.w,this.uv6.t);
		_set.uv7.set(this.uv7.u,this.uv7.v,this.uv7.w,this.uv7.t);
		return _set;
	}
	,__class__: phoenix.geometry.TextureCoordSet
};
phoenix.geometry.TextureCoord = function(_u,_v,_w,_t) {
	if(_t == null) _t = 0.0;
	if(_w == null) _w = 0.0;
	if(_v == null) _v = 0.0;
	if(_u == null) _u = 0.0;
	this.t = 0.0;
	this.w = 0.0;
	this.v = 0.0;
	this.u = 0.0;
	this.u = _u;
	this.v = _v;
	this.w = _w;
	this.t = _t;
};
phoenix.geometry.TextureCoord.__name__ = true;
phoenix.geometry.TextureCoord.prototype = {
	u: null
	,v: null
	,w: null
	,t: null
	,clone: function() {
		return new phoenix.geometry.TextureCoord(this.u,this.v,this.w,this.t);
	}
	,set: function(_u,_v,_w,_t) {
		this.u = _u;
		this.v = _v;
		this.w = _w;
		this.t = _t;
		return this;
	}
	,set_uv: function(_u,_v) {
		this.u = _u;
		this.v = _v;
		return this;
	}
	,toString: function() {
		return "{ u:" + this.v + ", v:" + this.v + " }";
	}
	,__class__: phoenix.geometry.TextureCoord
};
phoenix.geometry.Vertex = function(_pos,_color,_normal) {
	this.uv = new phoenix.geometry.TextureCoordSet();
	this.pos = _pos;
	if(_color == null) this.color = new phoenix.Color(); else this.color = _color;
	if(_normal == null) this.normal = new phoenix.Vector(); else this.normal = _normal;
};
phoenix.geometry.Vertex.__name__ = true;
phoenix.geometry.Vertex.prototype = {
	pos: null
	,color: null
	,uv: null
	,normal: null
	,clone: function() {
		var _new = new phoenix.geometry.Vertex(this.pos.clone(),this.color.clone(),this.normal.clone());
		_new.uv = this.uv.clone();
		return _new;
	}
	,__class__: phoenix.geometry.Vertex
};
phoenix.utils = {};
phoenix.utils.Rendering = function() { };
phoenix.utils.Rendering.__name__ = true;
phoenix.utils.Rendering.gl_blend_mode_from_BlendMode = function(_b) {
	switch(_b) {
	case 0:
		return 0;
	case 1:
		return 1;
	case 768:
		return 768;
	case 769:
		return 769;
	case 770:
		return 770;
	case 771:
		return 771;
	case 772:
		return 772;
	case 773:
		return 773;
	case 774:
		return 774;
	case 775:
		return 775;
	case 776:
		return 776;
	}
};
phoenix.utils.Rendering.get_elements_for_type = function(type,length) {
	switch(type) {
	case 0:
		return length / 4 | 0;
	case 1:
		return length / 4 | 0;
	case 3:
		return length / 4 | 0;
	case 2:
		return length / 4 | 0;
	case 5:
		return length / 4 | 0;
	case 6:
		return length / 4 | 0;
	default:
		return length / 4 | 0;
	}
};
snow.AppFixedTimestep = function() {
	this.overflow = 0.0;
	this.frame_time = 0.0167;
	snow.App.call(this);
};
snow.AppFixedTimestep.__name__ = true;
snow.AppFixedTimestep.__super__ = snow.App;
snow.AppFixedTimestep.prototype = $extend(snow.App.prototype,{
	frame_time: null
	,overflow: null
	,on_internal_init: function() {
		snow.App.prototype.on_internal_init.call(this);
		this.frame_time = 0.016666666666666666;
		this.last_frame_start = snow.Snow.core.timestamp();
	}
	,on_internal_update: function() {
		this.cur_frame_start = snow.Snow.core.timestamp();
		this.delta_time = this.cur_frame_start - this.last_frame_start;
		this.delta_sim = this.delta_time * this.timescale;
		if(this.delta_sim > this.max_frame_time) this.delta_sim = this.max_frame_time;
		this.last_frame_start = this.cur_frame_start;
		this.overflow += this.delta_sim;
		while(this.overflow >= this.frame_time) {
			this.app.do_internal_update(this.frame_time * this.timescale);
			this.current_time += this.frame_time * this.timescale;
			this.overflow -= this.frame_time * this.timescale;
		}
		this.alpha = this.overflow / this.frame_time;
		if(this.render_rate != 0) {
			if(this.next_render < snow.Snow.core.timestamp()) {
				this.app.render();
				this.next_render += this.render_rate;
			}
		}
	}
	,__class__: snow.AppFixedTimestep
});
snow.utils = {};
snow.utils.AbstractClass = function() { };
snow.utils.AbstractClass.__name__ = true;
snow.CoreBinding = function() { };
snow.CoreBinding.__name__ = true;
snow.CoreBinding.__interfaces__ = [snow.utils.AbstractClass];
snow.CoreBinding.prototype = {
	app: null
	,init: function(_event_handler) {
		throw "abstract method, must override";
	}
	,shutdown: function() {
		throw "abstract method, must override";
	}
	,timestamp: function() {
		throw "abstract method, must override";
	}
	,app_path: function() {
		throw "abstract method, must override";
	}
	,pref_path: function(_appname,_package) {
		throw "abstract method, must override";
	}
	,__class__: snow.CoreBinding
};
snow.Log = function() { };
snow.Log.__name__ = true;
snow.Log._get_spacing = function(_file) {
	var _spaces = "";
	var _trace_length = _file.length + 4;
	var _diff = snow.Log._log_width - _trace_length;
	if(_diff > 0) {
		var _g = 0;
		while(_g < _diff) {
			var i = _g++;
			_spaces += " ";
		}
	}
	return _spaces;
};
snow.Snow = function() {
	this.is_ready = false;
	this.was_ready = false;
	this.has_shutdown = false;
	this.shutting_down = false;
	snow.Snow.core = new snow.platform.web.Core(this);
	snow.Snow.next_list = [];
};
snow.Snow.__name__ = true;
snow.Snow.load = function(library,method,args) {
	if(args == null) args = 0;
	return snow.utils.Libs.load(library,method,args);
};
snow.Snow.next = function(func) {
	if(func != null) snow.Snow.next_list.push(func);
};
snow.Snow.prototype = {
	host: null
	,config: null
	,snow_config: null
	,io: null
	,input: null
	,assets: null
	,audio: null
	,windowing: null
	,shutting_down: null
	,has_shutdown: null
	,window: null
	,was_ready: null
	,is_ready: null
	,init: function(_snow_config,_host) {
		this.snow_config = _snow_config;
		this.config = { has_window : true, runtime : { }, window : null, assets : [], web : { no_context_menu : true, true_fullscreen : false}, 'native' : { audio_buffer_length : 176400, audio_buffer_count : 4, desktop_fullscreen : true}};
		this.host = _host;
		this.host.app = this;
		snow.Snow.core.init($bind(this,this.on_event));
	}
	,shutdown: function() {
		this.shutting_down = true;
		this.host.ondestroy();
		this.io.destroy();
		this.audio.destroy();
		this.input.destroy();
		this.windowing.destroy();
		snow.Snow.core.shutdown();
		this.has_shutdown = true;
	}
	,get_time: function() {
		return snow.Snow.core.timestamp();
	}
	,on_snow_init: function() {
		this.host.on_internal_init();
	}
	,on_snow_ready: function() {
		if(this.was_ready) {
			haxe.Log.trace("     i / snow / " + "firing ready event repeatedly is not ideal...",{ fileName : "Snow.hx", lineNumber : 164, className : "snow.Snow", methodName : "on_snow_ready"});
			return;
		}
		this.io = new snow.io.IO(this);
		this.input = new snow.input.Input(this);
		this.audio = new snow.audio.Audio(this);
		this.assets = new snow.assets.Assets(this);
		this.windowing = new snow.window.Windowing(this);
		if(!this.snow_config.config_custom_assets) {
			this.assets.manifest_path = this.snow_config.config_assets_path;
			this.config.assets = this.default_asset_list();
			this.assets.add(this.config.assets);
		}
		if(!this.snow_config.config_custom_runtime) this.config.runtime = this.default_runtime_config();
		this.config.window = this.default_window_config();
		this.config = this.host.config(this.config);
		this.was_ready = true;
		if(this.config.has_window == true) {
			this.window = this.windowing.create(this.config.window);
			if(this.window.handle == null) throw "requested default window cannot be created. Cannot continue.";
		}
		this.is_ready = true;
		this.host.ready();
	}
	,do_internal_update: function(dt) {
		this.io.update();
		this.input.update();
		this.audio.update();
		this.host.update(dt);
	}
	,render: function() {
		this.windowing.update();
	}
	,on_snow_update: function() {
		if(!this.is_ready) return;
		snow.utils.Timer.update();
		if(snow.Snow.next_list.length > 0) {
			var _pre_next_length = snow.Snow.next_list.length;
			var _g1 = 0;
			var _g = snow.Snow.next_list.length;
			while(_g1 < _g) {
				var i = _g1++;
				snow.Snow.next_list[i]();
			}
			snow.Snow.next_list.splice(0,_pre_next_length);
		}
		this.host.on_internal_update();
	}
	,dispatch_system_event: function(_event) {
		this.on_event(_event);
	}
	,on_event: function(_event) {
		if(_event.type != 3 && _event.type != 0 && _event.type != 5 && _event.type != 6) null;
		if(_event.type != 3) null;
		if(this.is_ready) {
			this.io.on_event(_event);
			this.audio.on_event(_event);
			this.windowing.on_event(_event);
			this.input.on_event(_event);
			this.host.onevent(_event);
		}
		var _g = _event.type;
		switch(_g) {
		case 1:
			this.on_snow_init();
			break;
		case 2:
			this.on_snow_ready();
			break;
		case 3:
			this.on_snow_update();
			break;
		case 7:case 8:
			this.shutdown();
			break;
		case 4:
			haxe.Log.trace("     i / snow / " + "Goodbye.",{ fileName : "Snow.hx", lineNumber : 328, className : "snow.Snow", methodName : "on_event"});
			break;
		default:
		}
	}
	,default_runtime_config: function() {
		var config_data = this.assets.text(this.snow_config.config_runtime_path);
		if(config_data != null && config_data.text != null) try {
			var json = JSON.parse(config_data.text);
			return json;
		} catch( e ) {
			haxe.Log.trace("     i / snow / " + "config / failed / default runtime config failed to parse as JSON. cannot recover.",{ fileName : "Snow.hx", lineNumber : 361, className : "snow.Snow", methodName : "default_runtime_config"});
			throw e;
		}
		return { };
	}
	,default_asset_list: function() {
		var asset_list = [];
		var manifest_data = snow.platform.web.utils.ByteArray.readFile(this.assets.assets_root + this.assets.manifest_path,false);
		if(manifest_data != null && manifest_data.length != 0) {
			var _list = JSON.parse(manifest_data.toString());
			var _g = 0;
			while(_g < _list.length) {
				var asset = _list[_g];
				++_g;
				asset_list.push({ id : asset, path : haxe.io.Path.join([this.assets.assets_root,asset]), type : haxe.io.Path.extension(asset), ext : haxe.io.Path.extension(asset)});
			}
			null;
		} else haxe.Log.trace("     i / snow / " + "config / failed / default asset manifest not found, or length was zero",{ fileName : "Snow.hx", lineNumber : 396, className : "snow.Snow", methodName : "default_asset_list"});
		return asset_list;
	}
	,default_window_config: function() {
		return { fullscreen : false, resizable : true, borderless : false, antialiasing : 0, red_bits : 8, green_bits : 8, blue_bits : 8, alpha_bits : 8, depth_bits : 0, stencil_bits : 0, x : 536805376, y : 536805376, width : 960, height : 640, title : "snow app"};
	}
	,get_uniqueid: function() {
		return haxe.crypto.Md5.encode(Std.string(snow.Snow.core.timestamp() * Math.random()));
	}
	,__class__: snow.Snow
	,__properties__: {get_uniqueid:"get_uniqueid",get_time:"get_time"}
};
snow.assets = {};
snow.assets.Asset = function(_assets,_info) {
	this.loaded = false;
	this.assets = _assets;
	this.info = _info;
	this.id = this.info.id;
};
snow.assets.Asset.__name__ = true;
snow.assets.Asset.prototype = {
	assets: null
	,id: null
	,info: null
	,type: null
	,loaded: null
	,__class__: snow.assets.Asset
};
snow.assets.AssetAudio = function(_assets,_info,_format,_load) {
	if(_load == null) _load = true;
	this.load_full = true;
	snow.assets.Asset.call(this,_assets,_info);
	this.type = 3;
	this.format = _format;
	this.load_full = _load;
};
snow.assets.AssetAudio.__name__ = true;
snow.assets.AssetAudio.__super__ = snow.assets.Asset;
snow.assets.AssetAudio.prototype = $extend(snow.assets.Asset.prototype,{
	audio: null
	,format: null
	,load_full: null
	,load: function(onload) {
		var _g = this;
		this.loaded = false;
		this.audio = null;
		this.assets.platform.audio_load_info(this.info.path,this.format,this.load_full,function(_audio) {
			_g.audio = _audio;
			_g.loaded = true;
			if(onload != null) snow.Snow.next(function() {
				onload(_g);
			});
		});
	}
	,__class__: snow.assets.AssetAudio
});
snow.assets.AssetBytes = function(_assets,_info,_async) {
	if(_async == null) _async = false;
	this.async = false;
	snow.assets.Asset.call(this,_assets,_info);
	this.type = 0;
	this.async = _async;
};
snow.assets.AssetBytes.__name__ = true;
snow.assets.AssetBytes.__super__ = snow.assets.Asset;
snow.assets.AssetBytes.prototype = $extend(snow.assets.Asset.prototype,{
	bytes: null
	,async: null
	,load: function(onload) {
		var _g = this;
		this.loaded = false;
		this.bytes = null;
		snow.platform.web.utils.ByteArray.readFile(this.info.path,this.async,function(result) {
			_g.bytes = result;
			_g.loaded = true;
			if(onload != null) snow.Snow.next(function() {
				onload(_g);
			});
		});
	}
	,load_from_bytes: function(_bytes,onload) {
		var _g = this;
		this.loaded = false;
		this.bytes = _bytes;
		this.loaded = true;
		if(onload != null) snow.Snow.next(function() {
			onload(_g);
		});
	}
	,__class__: snow.assets.AssetBytes
});
snow.assets.AssetImage = function(_assets,_info,_components) {
	if(_components == null) _components = 4;
	this.components = 4;
	snow.assets.Asset.call(this,_assets,_info);
	this.type = 2;
	this.components = _components;
};
snow.assets.AssetImage.__name__ = true;
snow.assets.AssetImage.__super__ = snow.assets.Asset;
snow.assets.AssetImage.prototype = $extend(snow.assets.Asset.prototype,{
	image: null
	,components: null
	,load: function(onload) {
		var _g = this;
		this.loaded = false;
		this.image = null;
		this.assets.platform.image_load_info(this.info.path,this.components,function(_image) {
			if(_image != null) {
				_g.image = _image;
				_g.loaded = true;
			}
			if(onload != null) snow.Snow.next(function() {
				onload(_g);
			});
		});
	}
	,load_from_bytes: function(bytes,onload) {
		var _g = this;
		this.loaded = false;
		this.image = null;
		this.image = this.assets.platform.image_info_from_bytes(this.info.path,bytes,this.components);
		if(onload != null) snow.Snow.next(function() {
			onload(_g);
		});
		this.loaded = true;
	}
	,load_from_pixels: function(_id,_width,_height,_pixels,onload) {
		var _g = this;
		this.loaded = false;
		this.image = null;
		this.image = { id : _id, width : _width, width_actual : _width, height : _height, height_actual : _height, bpp : 4, bpp_source : 4, data : _pixels};
		if(onload != null) snow.Snow.next(function() {
			onload(_g);
		});
		this.loaded = true;
	}
	,__class__: snow.assets.AssetImage
});
snow.assets.AssetSystemBinding = function() { };
snow.assets.AssetSystemBinding.__name__ = true;
snow.assets.AssetSystemBinding.__interfaces__ = [snow.utils.AbstractClass];
snow.assets.AssetSystemBinding.prototype = {
	manager: null
	,exists: function(_id,_strict) {
		if(_strict == null) _strict = true;
		throw "abstract method, must override";
	}
	,image_load_info: function(_path,_components,_onload) {
		if(_components == null) _components = 4;
		throw "abstract method, must override";
	}
	,image_info_from_bytes: function(_path,_bytes,_components) {
		if(_components == null) _components = 4;
		throw "abstract method, must override";
	}
	,audio_load_info: function(_path,_format,_load,_onload) {
		if(_load == null) _load = true;
		throw "abstract method, must override";
	}
	,__class__: snow.assets.AssetSystemBinding
};
snow.assets.AssetText = function(_assets,_info,_async) {
	if(_async == null) _async = false;
	this.async = false;
	snow.assets.Asset.call(this,_assets,_info);
	this.type = 1;
	this.async = _async;
};
snow.assets.AssetText.__name__ = true;
snow.assets.AssetText.__super__ = snow.assets.Asset;
snow.assets.AssetText.prototype = $extend(snow.assets.Asset.prototype,{
	text: null
	,async: null
	,load: function(onload) {
		var _g = this;
		this.loaded = false;
		this.text = null;
		snow.platform.web.utils.ByteArray.readFile(this.info.path,this.async,function(result) {
			if(result != null) _g.text = result.toString();
			_g.loaded = true;
			if(onload != null) onload(_g);
		});
	}
	,load_from_string: function(_string,onload) {
		var _g = this;
		this.loaded = false;
		this.text = _string;
		if(onload != null) snow.Snow.next(function() {
			onload(_g);
		});
		this.loaded = true;
	}
	,__class__: snow.assets.AssetText
});
snow.assets.Assets = function(_lib) {
	this.strict = true;
	this.manifest_path = "manifest";
	this.assets_root = "";
	this.lib = _lib;
	this.list = new haxe.ds.StringMap();
	this.platform = new snow.platform.web.assets.AssetSystem(this);
};
snow.assets.Assets.__name__ = true;
snow.assets.Assets.prototype = {
	list: null
	,assets_root: null
	,manifest_path: null
	,strict: null
	,platform: null
	,lib: null
	,add: function(_list) {
		var _g = 0;
		while(_g < _list.length) {
			var _asset = _list[_g];
			++_g;
			var images = ["psd","bmp","tga","gif","jpg","png"];
			var sounds = ["pcm","ogg","wav"];
			if(Lambda.has(images,_asset.ext)) _asset.type = "image"; else if(Lambda.has(sounds,_asset.ext)) _asset.type = "sound";
			this.list.set(_asset.id,_asset);
		}
	}
	,get: function(_id) {
		return this.list.get(_id);
	}
	,listed: function(_id) {
		return this.list.exists(_id);
	}
	,exists: function(_id,_strict) {
		if(_strict == null) _strict = true;
		return this.platform.exists(_id,_strict);
	}
	,path: function(_id) {
		if(this.listed(_id)) return this.get(_id).path;
		return this.assets_root + _id;
	}
	,bytes: function(_id,options) {
		var _strict = this.strict;
		if(options != null && options.strict != null) _strict = options.strict;
		if(this.exists(_id,_strict)) {
			var info = this.get(_id);
			if(info == null) info = this.info_from_id(_id,"bytes");
			var asset = new snow.assets.AssetBytes(this,info,options != null?options.async:null);
			asset.load(options != null?options.onload:null);
			return asset;
		} else this.exists_error(_id);
		return null;
	}
	,text: function(_id,options) {
		var _strict = this.strict;
		if(options != null && options.strict != null) _strict = options.strict;
		if(this.exists(_id,_strict)) {
			var info = this.get(_id);
			if(info == null) info = this.info_from_id(_id,"text");
			var asset = new snow.assets.AssetText(this,info,options != null?options.async:null);
			asset.load(options != null?options.onload:null);
			return asset;
		} else this.exists_error(_id);
		return null;
	}
	,image: function(_id,options) {
		var _strict = this.strict;
		var from_bytes = options != null && options.bytes != null;
		if(options != null && options.strict != null) _strict = options.strict;
		if(this.exists(_id,_strict) || from_bytes) {
			if(options == null) options = { components : 4};
			var info = this.get(_id);
			if(info == null) info = this.info_from_id(_id,"image");
			var comp;
			if(options.components == null) comp = 4; else comp = options.components;
			var asset = new snow.assets.AssetImage(this,info,comp);
			if(!from_bytes) asset.load(options.onload); else asset.load_from_bytes(options.bytes,options.onload);
			return asset;
		} else this.exists_error(_id);
		return null;
	}
	,audio: function(_id,options) {
		var _strict = this.strict;
		if(options != null && options.strict != null) _strict = options.strict;
		if(this.exists(_id,_strict)) {
			var info = this.get(_id);
			if(info == null) info = this.info_from_id(_id,"audio");
			if(options == null) options = { type : info.ext, load : true}; else if(options.type == null || options.type == "") options.type = info.ext;
			var _type = 0;
			var _g = options.type;
			switch(_g) {
			case "wav":
				_type = 2;
				break;
			case "ogg":
				_type = 1;
				break;
			case "pcm":
				_type = 3;
				break;
			default:
				this.load_error(_id,"unrecognized audio format");
				return null;
			}
			var asset = new snow.assets.AssetAudio(this,info,_type,options.load);
			asset.load(options != null?options.onload:null);
			return asset;
		} else this.exists_error(_id);
		return null;
	}
	,info_from_id: function(_id,_type) {
		return { id : _id, path : _id, ext : haxe.io.Path.extension(_id), type : _type};
	}
	,exists_error: function(_id) {
		haxe.Log.trace("   i / assets / " + ("not found \"" + _id + "\""),{ fileName : "Assets.hx", lineNumber : 293, className : "snow.assets.Assets", methodName : "exists_error"});
	}
	,load_error: function(_id,reason) {
		if(reason == null) reason = "unknown";
		haxe.Log.trace("   i / assets / " + ("found \"" + _id + "\" but it failed to load (" + reason + ")"),{ fileName : "Assets.hx", lineNumber : 297, className : "snow.assets.Assets", methodName : "load_error"});
	}
	,__class__: snow.assets.Assets
};
snow.audio = {};
snow.audio.Audio = function(_lib) {
	this.active = false;
	this.lib = _lib;
	this.platform = new snow.platform.web.audio.howlerjs.AudioSystem(this,this.lib);
	this.platform.init();
	this.sound_list = new haxe.ds.StringMap();
	this.stream_list = new haxe.ds.StringMap();
	this.handles = new haxe.ds.ObjectMap();
	this.active = true;
};
snow.audio.Audio.__name__ = true;
snow.audio.Audio.prototype = {
	platform: null
	,active: null
	,lib: null
	,handles: null
	,sound_list: null
	,stream_list: null
	,create: function(_id,_name,streaming) {
		if(streaming == null) streaming = false;
		if(_name == null) _name = "";
		var _g = this;
		if(_name == "") _name = this.lib.get_uniqueid();
		var sound = null;
		var _asset = this.lib.assets.audio(_id,{ load : !streaming, onload : function(asset) {
			if(asset != null && sound != null) {
				_g.handles.set(asset.audio.handle,sound);
				sound.set_info(asset.audio);
			}
		}});
		if(!streaming) sound = new snow.platform.web.audio.howlerjs.Sound(this,_name); else {
			var sound_stream = new snow.platform.web.audio.howlerjs.SoundStream(this,_name);
			this.stream_list.set(_name,sound_stream);
			sound = sound_stream;
		}
		this.sound_list.set(_name,sound);
		return sound;
	}
	,uncreate: function(_name) {
		var _sound = this.sound_list.get(_name);
		if(_sound == null) haxe.Log.trace("    i / audio / " + ("can't find sound, unable to uncreate, use create first: " + _name),{ fileName : "Audio.hx", lineNumber : 113, className : "snow.audio.Audio", methodName : "uncreate"});
		_sound.destroy();
	}
	,on: function(_name,_event,_handler) {
		var sound = this.get(_name);
		if(sound != null) sound.on(_event,_handler);
	}
	,off: function(_name,_event,_handler) {
		var sound = this.get(_name);
		if(sound != null) sound.off(_event,_handler);
	}
	,get: function(_name) {
		var _sound = this.sound_list.get(_name);
		if(_sound == null) haxe.Log.trace("    i / audio / " + ("sound not found, use create first: " + _name),{ fileName : "Audio.hx", lineNumber : 143, className : "snow.audio.Audio", methodName : "get"});
		return _sound;
	}
	,volume: function(_name,_volume) {
		var sound = this.get(_name);
		if(sound != null) {
			if(_volume != null) return sound.set_volume(_volume); else return sound.get_volume();
		}
		return 0;
	}
	,pan: function(_name,_pan) {
		var sound = this.get(_name);
		if(sound != null) {
			if(_pan != null) return sound.set_pan(_pan); else return sound.get_pan();
		}
		return 0;
	}
	,pitch: function(_name,_pitch) {
		var sound = this.get(_name);
		if(sound != null) {
			if(_pitch != null) return sound.set_pitch(_pitch); else return sound.get_pitch();
		}
		return 0;
	}
	,position: function(_name,_position) {
		var sound = this.get(_name);
		if(sound != null) {
			if(_position != null) return sound.set_position(_position); else return sound.get_position();
		}
		return 0;
	}
	,duration: function(_name) {
		var sound = this.get(_name);
		if(sound != null) return sound.get_duration();
		return 0;
	}
	,play: function(_name) {
		if(!this.active) return;
		var sound = this.get(_name);
		if(sound != null) sound.play();
	}
	,loop: function(_name) {
		if(!this.active) return;
		var sound = this.get(_name);
		if(sound != null) sound.loop();
	}
	,pause: function(_name) {
		if(!this.active) return;
		var sound = this.get(_name);
		if(sound != null) sound.pause();
	}
	,stop: function(_name) {
		if(!this.active) return;
		var sound = this.get(_name);
		if(sound != null) sound.stop();
	}
	,toggle: function(_name) {
		if(!this.active) return;
		var sound = this.get(_name);
		if(sound != null) sound.toggle();
	}
	,kill: function(_sound) {
		this.handles.remove(_sound.get_info().handle);
		this.sound_list.remove(_sound.name);
		this.stream_list.remove(_sound.name);
	}
	,suspend: function() {
		if(!this.active) return;
		haxe.Log.trace("    i / audio / " + "suspending sound context",{ fileName : "Audio.hx", lineNumber : 299, className : "snow.audio.Audio", methodName : "suspend"});
		this.active = false;
		var $it0 = this.stream_list.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.internal_pause();
		}
		this.platform.suspend();
	}
	,resume: function() {
		if(this.active) return;
		haxe.Log.trace("    i / audio / " + "resuming sound context",{ fileName : "Audio.hx", lineNumber : 317, className : "snow.audio.Audio", methodName : "resume"});
		this.active = true;
		this.platform.resume();
		var $it0 = this.stream_list.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.internal_play();
		}
	}
	,on_event: function(_event) {
		if(_event.type == 10) this.suspend(); else if(_event.type == 12) this.resume();
	}
	,destroy: function() {
		this.active = false;
		var $it0 = this.sound_list.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.destroy();
		}
		this.platform.destroy();
	}
	,update: function() {
		if(!this.active) return;
		var $it0 = this.sound_list.iterator();
		while( $it0.hasNext() ) {
			var _sound = $it0.next();
			if(_sound.playing) _sound.internal_update();
		}
		this.platform.process();
	}
	,__class__: snow.audio.Audio
};
snow.audio.AudioSystemBinding = function() { };
snow.audio.AudioSystemBinding.__name__ = true;
snow.audio.AudioSystemBinding.__interfaces__ = [snow.utils.AbstractClass];
snow.audio.AudioSystemBinding.prototype = {
	manager: null
	,lib: null
	,init: function() {
		throw "abstract method, must override";
	}
	,process: function() {
		throw "abstract method, must override";
	}
	,destroy: function() {
		throw "abstract method, must override";
	}
	,suspend: function() {
		throw "abstract method, must override";
	}
	,resume: function() {
		throw "abstract method, must override";
	}
	,__class__: snow.audio.AudioSystemBinding
};
snow.audio.SoundBinding = function(_manager,_name) {
	this.duration = 0.0;
	this.position = 0.0;
	this.looping = false;
	this.pan = 0.0;
	this.volume = 1.0;
	this.pitch = 1.0;
	this.is_stream = false;
	this.loaded = false;
	this.paused = false;
	this.playing = false;
	this.name = "";
	this.name = _name;
	this.manager = _manager;
	this.onload_list = [];
	this.onend_list = [];
};
snow.audio.SoundBinding.__name__ = true;
snow.audio.SoundBinding.prototype = {
	manager: null
	,name: null
	,playing: null
	,paused: null
	,loaded: null
	,is_stream: null
	,info: null
	,pitch: null
	,volume: null
	,pan: null
	,looping: null
	,position: null
	,duration: null
	,emit: function(_event) {
		switch(_event) {
		case "end":
			this.do_onend();
			break;
		case "load":
			this.do_onload();
			break;
		default:
			haxe.Log.trace("    i / sound / " + ("no event {" + _event + "}"),{ fileName : "Sound.hx", lineNumber : 80, className : "snow.audio.SoundBinding", methodName : "emit"});
		}
	}
	,on: function(_event,_handler) {
		switch(_event) {
		case "end":
			this.onend_list.push(_handler);
			break;
		case "load":
			this.add_onload(_handler);
			break;
		default:
			haxe.Log.trace("    i / sound / " + ("no event {" + _event + "}"),{ fileName : "Sound.hx", lineNumber : 91, className : "snow.audio.SoundBinding", methodName : "on"});
		}
	}
	,off: function(_event,_handler) {
		switch(_event) {
		case "end":
			HxOverrides.remove(this.onend_list,_handler);
			break;
		case "load":
			HxOverrides.remove(this.onload_list,_handler);
			break;
		default:
			haxe.Log.trace("    i / sound / " + ("no event {" + _event + "}"),{ fileName : "Sound.hx", lineNumber : 102, className : "snow.audio.SoundBinding", methodName : "off"});
		}
	}
	,onload_list: null
	,onend_list: null
	,play: function() {
	}
	,loop: function() {
	}
	,stop: function() {
	}
	,pause: function() {
	}
	,destroy: function() {
	}
	,internal_update: function() {
	}
	,internal_play: function() {
	}
	,internal_loop: function() {
	}
	,internal_stop: function() {
	}
	,internal_pause: function() {
	}
	,toggle: function() {
		this.playing = !this.playing;
		if(this.playing) {
			if(this.get_looping()) this.loop(); else this.play();
		} else this.pause();
	}
	,get_info: function() {
		return this.info;
	}
	,set_info: function(_info) {
		return this.info = _info;
	}
	,get_pan: function() {
		return this.pan;
	}
	,get_pitch: function() {
		return this.pitch;
	}
	,get_volume: function() {
		return this.volume;
	}
	,get_looping: function() {
		return this.looping;
	}
	,get_position: function() {
		return this.position;
	}
	,get_duration: function() {
		return 0;
	}
	,set_pan: function(_pan) {
		return this.pan = _pan;
	}
	,set_pitch: function(_pitch) {
		return this.pitch = _pitch;
	}
	,set_volume: function(_volume) {
		return this.volume = _volume;
	}
	,set_position: function(_position) {
		return this.position = _position;
	}
	,set_looping: function(_looping) {
		return this.looping = _looping;
	}
	,do_onload: function() {
		var _g = 0;
		var _g1 = this.onload_list;
		while(_g < _g1.length) {
			var _f = _g1[_g];
			++_g;
			_f(this);
		}
		this.onload_list = null;
		this.onload_list = [];
	}
	,do_onend: function() {
		var _g = 0;
		var _g1 = this.onend_list;
		while(_g < _g1.length) {
			var _f = _g1[_g];
			++_g;
			_f(this);
		}
	}
	,add_onload: function(_onload) {
		if(this.loaded) _onload(this); else this.onload_list.push(_onload);
		return _onload;
	}
	,__class__: snow.audio.SoundBinding
	,__properties__: {get_duration:"get_duration",set_position:"set_position",get_position:"get_position",set_looping:"set_looping",get_looping:"get_looping",set_pan:"set_pan",get_pan:"get_pan",set_volume:"set_volume",get_volume:"get_volume",set_pitch:"set_pitch",get_pitch:"get_pitch",set_info:"set_info",get_info:"get_info"}
};
snow.input = {};
snow.input.Input = function(_lib) {
	this.lib = _lib;
	this.platform = new snow.platform.web.input.InputSystem(this,this.lib);
	this.platform.init();
	this.key_code_pressed = new haxe.ds.IntMap();
	this.key_code_down = new haxe.ds.IntMap();
	this.key_code_released = new haxe.ds.IntMap();
	this.scan_code_pressed = new haxe.ds.IntMap();
	this.scan_code_down = new haxe.ds.IntMap();
	this.scan_code_released = new haxe.ds.IntMap();
	this.mouse_button_pressed = new haxe.ds.IntMap();
	this.mouse_button_down = new haxe.ds.IntMap();
	this.mouse_button_released = new haxe.ds.IntMap();
	this.gamepad_button_pressed = new haxe.ds.IntMap();
	this.gamepad_button_down = new haxe.ds.IntMap();
	this.gamepad_button_released = new haxe.ds.IntMap();
	this.gamepad_axis_values = new haxe.ds.IntMap();
};
snow.input.Input.__name__ = true;
snow.input.Input.prototype = {
	lib: null
	,platform: null
	,key_code_down: null
	,key_code_pressed: null
	,key_code_released: null
	,scan_code_down: null
	,scan_code_pressed: null
	,scan_code_released: null
	,mouse_button_down: null
	,mouse_button_pressed: null
	,mouse_button_released: null
	,gamepad_button_down: null
	,gamepad_button_pressed: null
	,gamepad_button_released: null
	,gamepad_axis_values: null
	,keypressed: function(_code) {
		return this.key_code_pressed.exists(_code);
	}
	,keyreleased: function(_code) {
		return this.key_code_released.exists(_code);
	}
	,keydown: function(_code) {
		return this.key_code_down.exists(_code);
	}
	,scanpressed: function(_code) {
		return this.scan_code_pressed.exists(_code);
	}
	,scanreleased: function(_code) {
		return this.scan_code_released.exists(_code);
	}
	,scandown: function(_code) {
		return this.scan_code_down.exists(_code);
	}
	,mousepressed: function(_button) {
		return this.mouse_button_pressed.exists(_button);
	}
	,mousereleased: function(_button) {
		return this.mouse_button_released.exists(_button);
	}
	,mousedown: function(_button) {
		return this.mouse_button_down.exists(_button);
	}
	,gamepadpressed: function(_gamepad,_button) {
		var _gamepad_state = this.gamepad_button_pressed.get(_gamepad);
		if(_gamepad_state != null) return _gamepad_state.exists(_button); else return false;
	}
	,gamepadreleased: function(_gamepad,_button) {
		var _gamepad_state = this.gamepad_button_released.get(_gamepad);
		if(_gamepad_state != null) return _gamepad_state.exists(_button); else return false;
	}
	,gamepaddown: function(_gamepad,_button) {
		var _gamepad_state = this.gamepad_button_down.get(_gamepad);
		if(_gamepad_state != null) return _gamepad_state.exists(_button); else return false;
	}
	,gamepadaxis: function(_gamepad,_axis) {
		var _gamepad_state = this.gamepad_axis_values.get(_gamepad);
		if(_gamepad_state.exists(_axis)) return _gamepad_state.get(_axis);
		return 0;
	}
	,dispatch_key_down_event: function(keycode,scancode,repeat,mod,timestamp,window_id) {
		if(!repeat) {
			this.key_code_pressed.set(keycode,false);
			this.key_code_down.set(keycode,true);
			this.scan_code_pressed.set(scancode,false);
			this.scan_code_down.set(scancode,true);
		}
		this.lib.host.onkeydown(keycode,scancode,repeat,mod,timestamp,window_id);
	}
	,dispatch_key_up_event: function(keycode,scancode,repeat,mod,timestamp,window_id) {
		this.key_code_released.set(keycode,false);
		this.key_code_down.remove(keycode);
		this.scan_code_released.set(scancode,false);
		this.scan_code_down.remove(scancode);
		this.lib.host.onkeyup(keycode,scancode,repeat,mod,timestamp,window_id);
	}
	,dispatch_text_event: function(text,start,length,type,timestamp,window_id) {
		this.lib.host.ontextinput(text,start,length,type,timestamp,window_id);
	}
	,dispatch_mouse_move_event: function(x,y,xrel,yrel,timestamp,window_id) {
		this.lib.host.onmousemove(x,y,xrel,yrel,timestamp,window_id);
	}
	,dispatch_mouse_down_event: function(x,y,button,timestamp,window_id) {
		this.mouse_button_pressed.set(button,false);
		this.mouse_button_down.set(button,true);
		this.lib.host.onmousedown(x,y,button,timestamp,window_id);
	}
	,dispatch_mouse_up_event: function(x,y,button,timestamp,window_id) {
		this.mouse_button_released.set(button,false);
		this.mouse_button_down.remove(button);
		this.lib.host.onmouseup(x,y,button,timestamp,window_id);
	}
	,dispatch_mouse_wheel_event: function(x,y,timestamp,window_id) {
		this.lib.host.onmousewheel(x,y,timestamp,window_id);
	}
	,dispatch_touch_down_event: function(x,y,touch_id,timestamp) {
		this.lib.host.ontouchdown(x,y,touch_id,timestamp);
	}
	,dispatch_touch_up_event: function(x,y,touch_id,timestamp) {
		this.lib.host.ontouchup(x,y,touch_id,timestamp);
	}
	,dispatch_touch_move_event: function(x,y,dx,dy,touch_id,timestamp) {
		this.lib.host.ontouchmove(x,y,dx,dy,touch_id,timestamp);
	}
	,dispatch_gamepad_axis_event: function(gamepad,axis,value,timestamp) {
		if(!this.gamepad_axis_values.exists(gamepad)) {
			var value1 = new haxe.ds.IntMap();
			this.gamepad_axis_values.set(gamepad,value1);
		}
		var this1 = this.gamepad_axis_values.get(gamepad);
		this1.set(axis,value);
		this.lib.host.ongamepadaxis(gamepad,axis,value,timestamp);
	}
	,dispatch_gamepad_button_down_event: function(gamepad,button,value,timestamp) {
		if(!this.gamepad_button_pressed.exists(gamepad)) {
			var value1 = new haxe.ds.IntMap();
			this.gamepad_button_pressed.set(gamepad,value1);
		}
		if(!this.gamepad_button_down.exists(gamepad)) {
			var value2 = new haxe.ds.IntMap();
			this.gamepad_button_down.set(gamepad,value2);
		}
		var this1 = this.gamepad_button_pressed.get(gamepad);
		this1.set(button,false);
		var this2 = this.gamepad_button_down.get(gamepad);
		this2.set(button,true);
		this.lib.host.ongamepaddown(gamepad,button,value,timestamp);
	}
	,dispatch_gamepad_button_up_event: function(gamepad,button,value,timestamp) {
		if(!this.gamepad_button_released.exists(gamepad)) {
			var value1 = new haxe.ds.IntMap();
			this.gamepad_button_released.set(gamepad,value1);
		}
		if(!this.gamepad_button_down.exists(gamepad)) {
			var value2 = new haxe.ds.IntMap();
			this.gamepad_button_down.set(gamepad,value2);
		}
		var this1 = this.gamepad_button_released.get(gamepad);
		this1.set(button,false);
		var this2 = this.gamepad_button_down.get(gamepad);
		this2.remove(button);
		this.lib.host.ongamepadup(gamepad,button,value,timestamp);
	}
	,dispatch_gamepad_device_event: function(gamepad,type,timestamp) {
		this.lib.host.ongamepaddevice(gamepad,type,timestamp);
	}
	,listen: function(_window) {
		this.platform.listen(_window);
	}
	,unlisten: function(_window) {
		this.platform.unlisten(_window);
	}
	,on_event: function(_event) {
		if(_event.type == 6) this.platform.on_event(_event.input);
	}
	,on_gamepad_added: function(_event) {
		this.platform.gamepad_add(_event.which);
	}
	,on_gamepad_removed: function(_event) {
		this.platform.gamepad_remove(_event.which);
	}
	,update: function() {
		this.platform.process();
		this._update_keystate();
		this._update_gamepadstate();
		this._update_mousestate();
	}
	,destroy: function() {
		this.platform.destroy();
	}
	,_update_mousestate: function() {
		var $it0 = this.mouse_button_pressed.keys();
		while( $it0.hasNext() ) {
			var _code = $it0.next();
			if(this.mouse_button_pressed.get(_code)) this.mouse_button_pressed.remove(_code); else this.mouse_button_pressed.set(_code,true);
		}
		var $it1 = this.mouse_button_released.keys();
		while( $it1.hasNext() ) {
			var _code1 = $it1.next();
			if(this.mouse_button_released.get(_code1)) this.mouse_button_released.remove(_code1); else this.mouse_button_released.set(_code1,true);
		}
	}
	,_update_gamepadstate: function() {
		var $it0 = this.gamepad_button_pressed.iterator();
		while( $it0.hasNext() ) {
			var _gamepad_pressed = $it0.next();
			var $it1 = _gamepad_pressed.keys();
			while( $it1.hasNext() ) {
				var _button = $it1.next();
				if(_gamepad_pressed.get(_button)) _gamepad_pressed.remove(_button); else _gamepad_pressed.set(_button,true);
			}
		}
		var $it2 = this.gamepad_button_released.iterator();
		while( $it2.hasNext() ) {
			var _gamepad_released = $it2.next();
			var $it3 = _gamepad_released.keys();
			while( $it3.hasNext() ) {
				var _button1 = $it3.next();
				if(_gamepad_released.get(_button1)) _gamepad_released.remove(_button1); else _gamepad_released.set(_button1,true);
			}
		}
	}
	,_update_keystate: function() {
		var $it0 = this.key_code_pressed.keys();
		while( $it0.hasNext() ) {
			var _code = $it0.next();
			if(this.key_code_pressed.get(_code)) this.key_code_pressed.remove(_code); else this.key_code_pressed.set(_code,true);
		}
		var $it1 = this.key_code_released.keys();
		while( $it1.hasNext() ) {
			var _code1 = $it1.next();
			if(this.key_code_released.get(_code1)) this.key_code_released.remove(_code1); else this.key_code_released.set(_code1,true);
		}
		var $it2 = this.scan_code_pressed.keys();
		while( $it2.hasNext() ) {
			var _code2 = $it2.next();
			if(this.scan_code_pressed.get(_code2)) this.scan_code_pressed.remove(_code2); else this.scan_code_pressed.set(_code2,true);
		}
		var $it3 = this.scan_code_released.keys();
		while( $it3.hasNext() ) {
			var _code3 = $it3.next();
			if(this.scan_code_released.get(_code3)) this.scan_code_released.remove(_code3); else this.scan_code_released.set(_code3,true);
		}
	}
	,__class__: snow.input.Input
};
snow.input.InputSystemBinding = function() { };
snow.input.InputSystemBinding.__name__ = true;
snow.input.InputSystemBinding.__interfaces__ = [snow.utils.AbstractClass];
snow.input.InputSystemBinding.prototype = {
	manager: null
	,lib: null
	,init: function() {
		throw "abstract method, must override";
	}
	,process: function() {
		throw "abstract method, must override";
	}
	,destroy: function() {
		throw "abstract method, must override";
	}
	,on_event: function(_event) {
		throw "abstract method, must override";
	}
	,text_input_start: function() {
		throw "abstract method, must override";
	}
	,text_input_stop: function() {
		throw "abstract method, must override";
	}
	,text_input_rect: function(x,y,w,h) {
		throw "abstract method, must override";
	}
	,gamepad_add: function(id) {
		throw "abstract method, must override";
	}
	,gamepad_remove: function(id) {
		throw "abstract method, must override";
	}
	,listen: function(window) {
		throw "abstract method, must override";
	}
	,unlisten: function(window) {
		throw "abstract method, must override";
	}
	,__class__: snow.input.InputSystemBinding
};
snow.input.Scancodes = function() { };
snow.input.Scancodes.__name__ = true;
snow.input.Scancodes.$name = function(scancode) {
	var res = null;
	if(scancode >= 0 && scancode < snow.input.Scancodes.scancode_names.length) res = snow.input.Scancodes.scancode_names[scancode];
	if(res != null) return res; else return "";
};
snow.input.Keycodes = function() { };
snow.input.Keycodes.__name__ = true;
snow.input.Keycodes.from_scan = function(scancode) {
	return scancode | snow.input.Scancodes.MASK;
};
snow.input.Keycodes.to_scan = function(keycode) {
	if((keycode & snow.input.Scancodes.MASK) != 0) return keycode & ~snow.input.Scancodes.MASK;
	switch(keycode) {
	case snow.input.Keycodes.enter:
		return snow.input.Scancodes.enter;
	case snow.input.Keycodes.escape:
		return snow.input.Scancodes.escape;
	case snow.input.Keycodes.backspace:
		return snow.input.Scancodes.backspace;
	case snow.input.Keycodes.tab:
		return snow.input.Scancodes.tab;
	case snow.input.Keycodes.space:
		return snow.input.Scancodes.space;
	case snow.input.Keycodes.slash:
		return snow.input.Scancodes.slash;
	case snow.input.Keycodes.key_0:
		return snow.input.Scancodes.key_0;
	case snow.input.Keycodes.key_1:
		return snow.input.Scancodes.key_1;
	case snow.input.Keycodes.key_2:
		return snow.input.Scancodes.key_2;
	case snow.input.Keycodes.key_3:
		return snow.input.Scancodes.key_3;
	case snow.input.Keycodes.key_4:
		return snow.input.Scancodes.key_4;
	case snow.input.Keycodes.key_5:
		return snow.input.Scancodes.key_5;
	case snow.input.Keycodes.key_6:
		return snow.input.Scancodes.key_6;
	case snow.input.Keycodes.key_7:
		return snow.input.Scancodes.key_7;
	case snow.input.Keycodes.key_8:
		return snow.input.Scancodes.key_8;
	case snow.input.Keycodes.key_9:
		return snow.input.Scancodes.key_9;
	case snow.input.Keycodes.semicolon:
		return snow.input.Scancodes.semicolon;
	case snow.input.Keycodes.equals:
		return snow.input.Scancodes.equals;
	case snow.input.Keycodes.leftbracket:
		return snow.input.Scancodes.leftbracket;
	case snow.input.Keycodes.backslash:
		return snow.input.Scancodes.backslash;
	case snow.input.Keycodes.rightbracket:
		return snow.input.Scancodes.rightbracket;
	case snow.input.Keycodes.backquote:
		return snow.input.Scancodes.grave;
	case snow.input.Keycodes.key_a:
		return snow.input.Scancodes.key_a;
	case snow.input.Keycodes.key_b:
		return snow.input.Scancodes.key_b;
	case snow.input.Keycodes.key_c:
		return snow.input.Scancodes.key_c;
	case snow.input.Keycodes.key_d:
		return snow.input.Scancodes.key_d;
	case snow.input.Keycodes.key_e:
		return snow.input.Scancodes.key_e;
	case snow.input.Keycodes.key_f:
		return snow.input.Scancodes.key_f;
	case snow.input.Keycodes.key_g:
		return snow.input.Scancodes.key_g;
	case snow.input.Keycodes.key_h:
		return snow.input.Scancodes.key_h;
	case snow.input.Keycodes.key_i:
		return snow.input.Scancodes.key_i;
	case snow.input.Keycodes.key_j:
		return snow.input.Scancodes.key_j;
	case snow.input.Keycodes.key_k:
		return snow.input.Scancodes.key_k;
	case snow.input.Keycodes.key_l:
		return snow.input.Scancodes.key_l;
	case snow.input.Keycodes.key_m:
		return snow.input.Scancodes.key_m;
	case snow.input.Keycodes.key_n:
		return snow.input.Scancodes.key_n;
	case snow.input.Keycodes.key_o:
		return snow.input.Scancodes.key_o;
	case snow.input.Keycodes.key_p:
		return snow.input.Scancodes.key_p;
	case snow.input.Keycodes.key_q:
		return snow.input.Scancodes.key_q;
	case snow.input.Keycodes.key_r:
		return snow.input.Scancodes.key_r;
	case snow.input.Keycodes.key_s:
		return snow.input.Scancodes.key_s;
	case snow.input.Keycodes.key_t:
		return snow.input.Scancodes.key_t;
	case snow.input.Keycodes.key_u:
		return snow.input.Scancodes.key_u;
	case snow.input.Keycodes.key_v:
		return snow.input.Scancodes.key_v;
	case snow.input.Keycodes.key_w:
		return snow.input.Scancodes.key_w;
	case snow.input.Keycodes.key_x:
		return snow.input.Scancodes.key_x;
	case snow.input.Keycodes.key_y:
		return snow.input.Scancodes.key_y;
	case snow.input.Keycodes.key_z:
		return snow.input.Scancodes.key_z;
	}
	return snow.input.Scancodes.unknown;
};
snow.input.Keycodes.$name = function(keycode) {
	if((keycode & snow.input.Scancodes.MASK) != 0) return snow.input.Scancodes.$name(keycode & ~snow.input.Scancodes.MASK);
	switch(keycode) {
	case snow.input.Keycodes.enter:
		return snow.input.Scancodes.$name(snow.input.Scancodes.enter);
	case snow.input.Keycodes.escape:
		return snow.input.Scancodes.$name(snow.input.Scancodes.escape);
	case snow.input.Keycodes.backspace:
		return snow.input.Scancodes.$name(snow.input.Scancodes.backspace);
	case snow.input.Keycodes.tab:
		return snow.input.Scancodes.$name(snow.input.Scancodes.tab);
	case snow.input.Keycodes.space:
		return snow.input.Scancodes.$name(snow.input.Scancodes.space);
	case snow.input.Keycodes["delete"]:
		return snow.input.Scancodes.$name(snow.input.Scancodes["delete"]);
	default:
		var decoder = new haxe.Utf8();
		decoder.__b += String.fromCharCode(keycode);
		return decoder.__b;
	}
};
snow.io = {};
snow.io.IO = function(_lib) {
	this.lib = _lib;
	this.platform = new snow.platform.web.io.IOSystem(this,this.lib);
	this.platform.init();
};
snow.io.IO.__name__ = true;
snow.io.IO.prototype = {
	lib: null
	,platform: null
	,url_open: function(_url) {
		this.platform.url_open(_url);
	}
	,on_event: function(_event) {
		this.platform.on_event(_event);
	}
	,update: function() {
		this.platform.process();
	}
	,destroy: function() {
		this.platform.destroy();
	}
	,__class__: snow.io.IO
};
snow.io.IOSystemBinding = function() { };
snow.io.IOSystemBinding.__name__ = true;
snow.io.IOSystemBinding.__interfaces__ = [snow.utils.AbstractClass];
snow.io.IOSystemBinding.prototype = {
	manager: null
	,lib: null
	,init: function() {
		throw "abstract method, must override";
	}
	,process: function() {
		throw "abstract method, must override";
	}
	,destroy: function() {
		throw "abstract method, must override";
	}
	,on_event: function(_event) {
		throw "abstract method, must override";
	}
	,url_open: function(_url) {
		throw "abstract method, must override";
	}
	,__class__: snow.io.IOSystemBinding
};
snow.platform = {};
snow.platform.web = {};
snow.platform.web.Core = function(_app) {
	this._time_now = 0.0;
	this._lf_timestamp = 0.016;
	this.start_timestamp = 0.0;
	this.app = _app;
	this.start_timestamp = this.timestamp();
};
snow.platform.web.Core.__name__ = true;
snow.platform.web.Core.__super__ = snow.CoreBinding;
snow.platform.web.Core.prototype = $extend(snow.CoreBinding.prototype,{
	start_timestamp: null
	,init: function(_event_handler) {
		this.app.dispatch_system_event({ type : 1});
		this.app.dispatch_system_event({ type : 2});
		if(this.app.snow_config.has_loop) this.request_update();
	}
	,shutdown: function() {
	}
	,timestamp: function() {
		var now;
		if(window.performance != null) now = window.performance.now() / 1000.0; else now = haxe.Timer.stamp();
		return now - this.start_timestamp;
	}
	,app_path: function() {
		return haxe.io.Path.directory(window.location.href) + "/";
	}
	,pref_path: function(_name,_package) {
		return "./";
	}
	,_lf_timestamp: null
	,_time_now: null
	,request_update: function() {
		var _g = this;
		if(($_=window,$bind($_,$_.requestAnimationFrame)) != null) window.requestAnimationFrame($bind(this,this.snow_core_loop)); else {
			haxe.Log.trace("     i / core / " + ("warning : requestAnimationFrame not found, falling back to render_rate! render_rate:" + this.app.host.render_rate),{ fileName : "Core.hx", lineNumber : 87, className : "snow.platform.web.Core", methodName : "request_update"});
			window.setTimeout(function() {
				var _now = _g.timestamp();
				_g._time_now += _now - _g._lf_timestamp;
				_g.snow_core_loop(_g._time_now * 1000.0);
				_g._lf_timestamp = _now;
			},this.app.host.render_rate * 1000.0 | 0);
		}
	}
	,snow_core_loop: function(_t) {
		if(_t == null) _t = 0.016;
		this.update();
		this.app.dispatch_system_event({ type : 3});
		this.request_update();
		return true;
	}
	,update: function() {
	}
	,__class__: snow.platform.web.Core
});
snow.platform.web.assets = {};
snow.platform.web.assets.AssetSystem = function(_manager) {
	this.manager = _manager;
};
snow.platform.web.assets.AssetSystem.__name__ = true;
snow.platform.web.assets.AssetSystem.__super__ = snow.assets.AssetSystemBinding;
snow.platform.web.assets.AssetSystem.prototype = $extend(snow.assets.AssetSystemBinding.prototype,{
	exists: function(_id,_strict) {
		if(_strict == null) _strict = true;
		var listed = this.manager.listed(_id);
		return listed;
	}
	,nearest_power_of_two: function(_value) {
		_value--;
		_value |= _value >> 1;
		_value |= _value >> 2;
		_value |= _value >> 4;
		_value |= _value >> 8;
		_value |= _value >> 16;
		_value++;
		return _value;
	}
	,image_load_info: function(_path,_components,_onload) {
		if(_components == null) _components = 4;
		var ext = haxe.io.Path.extension(_path);
		switch(ext) {
		case "tga":
			return this.image_load_info_tga(_path,_components,_onload);
		case "psd":
			return this.image_load_info_psd(_path,_components,_onload);
		default:
			return this.image_load_info_generic(_path,_components,_onload);
		}
		return null;
	}
	,image_load_info_generic: function(_path,_components,_onload) {
		if(_components == null) _components = 4;
		var _g = this;
		var image;
		var _this = window.document;
		image = _this.createElement("img");
		var info = null;
		image.onload = function(a) {
			var width_pot = _g.nearest_power_of_two(image.width);
			var height_pot = _g.nearest_power_of_two(image.height);
			var image_bytes = _g.POT_Uint8Array_from_image(image.width,image.height,width_pot,height_pot,image);
			info = { id : _path, bpp : 4, width : image.width, height : image.height, width_actual : width_pot, height_actual : height_pot, bpp_source : 4, data : new Uint8Array(image_bytes.data)};
			image_bytes = null;
			if(_onload != null) _onload(info);
		};
		image.src = _path;
		return info;
	}
	,image_load_info_tga: function(_path,_components,_onload) {
		if(_components == null) _components = 4;
		var _g = this;
		var info = null;
		snow.platform.web.utils.ByteArray.readFile(_path,true,function(data) {
			var uint = new Uint8Array(data.getData());
			var image = new window.TGA();
			image.load(uint);
			var width_pot = _g.nearest_power_of_two(image.header.width);
			var height_pot = _g.nearest_power_of_two(image.header.height);
			var image_bytes = _g.POT_Uint8Array_from_image(image.header.width,image.header.height,width_pot,height_pot,image.getCanvas());
			info = { id : _path, bpp : 4, width : image.header.width, height : image.header.height, width_actual : width_pot, height_actual : height_pot, bpp_source : 4, data : new Uint8Array(image_bytes.data)};
			image_bytes = null;
			if(_onload != null) _onload(info);
		});
		return info;
	}
	,POT_Uint8Array_from_image: function(_width,_height,_width_pot,_height_pot,_source) {
		var tmp_canvas;
		var _this = window.document;
		tmp_canvas = _this.createElement("canvas");
		tmp_canvas.width = _width_pot;
		tmp_canvas.height = _height_pot;
		var tmp_context = tmp_canvas.getContext("2d");
		tmp_context.clearRect(0,0,tmp_canvas.width,tmp_canvas.height);
		tmp_context.drawImage(_source,0,0,_width,_height);
		var image_bytes = null;
		try {
			image_bytes = tmp_context.getImageData(0,0,tmp_canvas.width,tmp_canvas.height);
		} catch( e ) {
			var tips = "- textures served from file:/// throw security errors\n";
			tips += "- textures served over http:// work for cross origin byte requests";
			haxe.Log.trace("i / assets / " + tips,{ fileName : "AssetSystem.hx", lineNumber : 185, className : "snow.platform.web.assets.AssetSystem", methodName : "POT_Uint8Array_from_image"});
			throw e;
		}
		tmp_canvas = null;
		tmp_context = null;
		return image_bytes;
	}
	,image_load_info_psd: function(_path,_components,_onload) {
		if(_components == null) _components = 4;
		var _g = this;
		var info = null;
		var image = new snow.platform.web.assets.psd.PSD();
		image.open(_path,function(psdimage) {
			var png_then = function(png_image) {
				var width_pot = _g.nearest_power_of_two(psdimage.header.width);
				var height_pot = _g.nearest_power_of_two(psdimage.header.height);
				var image_bytes = _g.POT_Uint8Array_from_image(psdimage.header.width,psdimage.header.height,width_pot,height_pot,png_image);
				info = { id : _path, bpp : 4, width : psdimage.header.width, height : psdimage.header.height, width_actual : width_pot, height_actual : height_pot, bpp_source : 4, data : new Uint8Array(image_bytes.data)};
				image_bytes = null;
				if(_onload != null) _onload(info);
			};
			psdimage.image.toPng().then(png_then);
		});
		return info;
	}
	,image_info_from_bytes: function(_path,_bytes,_components) {
		if(_components == null) _components = 4;
		if(_bytes == null) {
			haxe.Log.trace("i / assets / " + ("invalid bytes passed to image_info_from_bytes " + _path),{ fileName : "AssetSystem.hx", lineNumber : 243, className : "snow.platform.web.assets.AssetSystem", methodName : "image_info_from_bytes"});
			return null;
		}
		var _raw_bytes = snow.platform.web.utils.ByteArray.toBytes(_bytes);
		var byte_input = new haxe.io.BytesInput(_raw_bytes,0,_raw_bytes.length);
		var png_data = new snow.utils.format.png.Reader(byte_input).read();
		var png_bytes = snow.utils.format.png.Tools.extract32(png_data);
		var png_header = snow.utils.format.png.Tools.getHeader(png_data);
		return { id : _path, bpp : _components, width : png_header.width, height : png_header.height, width_actual : png_header.width, height_actual : png_header.height, bpp_source : png_header.colbits, data : new Uint8Array(png_bytes.b)};
	}
	,audio_load_info: function(_path,_format,_load,_onload) {
		if(_load == null) _load = true;
		var _g = this;
		var info = { format : _format, id : _path, handle : null, data : null};
		info.handle = new window.Howl({ urls : [_path], onend : function() {
			_g.manager.lib.audio.platform._on_end(info.handle);
		}, onload : function() {
			if(_onload != null) _onload(info);
		}});
		return info;
	}
	,__class__: snow.platform.web.assets.AssetSystem
});
snow.platform.web.assets.psd = {};
snow.platform.web.assets.psd.PSD = function() {
	this._PSD = window.require("psd");
};
snow.platform.web.assets.psd.PSD.__name__ = true;
snow.platform.web.assets.psd.PSD.prototype = {
	_PSD: null
	,open: function(_url,_psd_onload) {
		this._PSD.fromURL(_url).then(function(psd) {
			if(_psd_onload) _psd_onload(psd);
		});
	}
	,__class__: snow.platform.web.assets.psd.PSD
};
snow.platform.web.audio = {};
snow.platform.web.audio.AudioSystem = function(_manager,_lib) {
	this.manager = _manager;
	this.lib = _lib;
};
snow.platform.web.audio.AudioSystem.__name__ = true;
snow.platform.web.audio.AudioSystem.__super__ = snow.audio.AudioSystemBinding;
snow.platform.web.audio.AudioSystem.prototype = $extend(snow.audio.AudioSystemBinding.prototype,{
	init: function() {
	}
	,process: function() {
	}
	,destroy: function() {
	}
	,suspend: function() {
	}
	,resume: function() {
	}
	,__class__: snow.platform.web.audio.AudioSystem
});
snow.platform.web.audio.Sound = function(_manager,_name) {
	snow.audio.SoundBinding.call(this,_manager,_name);
};
snow.platform.web.audio.Sound.__name__ = true;
snow.platform.web.audio.Sound.__super__ = snow.audio.SoundBinding;
snow.platform.web.audio.Sound.prototype = $extend(snow.audio.SoundBinding.prototype,{
	__class__: snow.platform.web.audio.Sound
});
snow.platform.web.audio.howlerjs = {};
snow.platform.web.audio.howlerjs.Sound = function(_manager,_name) {
	this.volume_dirty = false;
	this.pan_dirty = false;
	snow.platform.web.audio.Sound.call(this,_manager,_name);
};
snow.platform.web.audio.howlerjs.Sound.__name__ = true;
snow.platform.web.audio.howlerjs.Sound.__super__ = snow.platform.web.audio.Sound;
snow.platform.web.audio.howlerjs.Sound.prototype = $extend(snow.platform.web.audio.Sound.prototype,{
	set_info: function(_info) {
		if(this.get_info() != null) this.destroy();
		this.info = null;
		if(_info == null) {
			haxe.Log.trace("    i / sound / " + "not creating sound, info was null",{ fileName : "Sound.hx", lineNumber : 33, className : "snow.platform.web.audio.howlerjs.Sound", methodName : "set_info"});
			return this.get_info();
		}
		this.info = _info;
		this.loaded = true;
		this.emit("load");
		return this.get_info();
	}
	,pan_dirty: null
	,volume_dirty: null
	,set_pan: function(_pan) {
		this.pan_dirty = true;
		return this.pan = _pan;
	}
	,set_volume: function(_volume) {
		this.volume_dirty = true;
		return this.volume = _volume;
	}
	,set_pitch: function(_pitch) {
		this.get_info().handle._rate = _pitch;
		return this.pitch = _pitch;
	}
	,set_position: function(_position) {
		if(this.get_info() != null && this.get_info().handle != null) this.get_info().handle.pos(_position);
		return this.position = _position;
	}
	,get_position: function() {
		if(this.get_info() != null && this.get_info().handle != null) return this.get_info().handle.pos();
		return this.position;
	}
	,get_duration: function() {
		if(this.get_info() != null && this.get_info().handle != null) return this.get_info().handle._duration;
		return 0;
	}
	,play: function() {
		if(this.get_info() != null && this.get_info().handle != null) {
			this.playing = true;
			this.get_info().handle.loop(false);
			this.get_info().handle.play();
			if(this.pan_dirty) this.get_info().handle.pos3d(this.get_pan());
			if(this.volume_dirty) this.get_info().handle.volume(this.get_volume());
		}
	}
	,loop: function() {
		if(this.get_info() != null && this.get_info().handle != null) {
			this.playing = true;
			this.get_info().handle.loop(true);
			this.get_info().handle.play();
			if(this.pan_dirty) this.get_info().handle.pos3d(this.get_pan());
			if(this.volume_dirty) this.get_info().handle.volume(this.get_volume());
		}
	}
	,stop: function() {
		this.playing = false;
		if(this.get_info() != null && this.get_info().handle != null) this.get_info().handle.stop();
	}
	,pause: function() {
		if(this.get_info() != null && this.get_info().handle != null) this.get_info().handle.pause();
	}
	,destroy: function() {
		if(this.get_info() != null && this.get_info().handle != null) this.get_info().handle.unload();
		this.manager.kill(this);
	}
	,__class__: snow.platform.web.audio.howlerjs.Sound
});
snow.platform.web.audio.SoundStream = function(_manager,_name) {
	snow.platform.web.audio.howlerjs.Sound.call(this,_manager,_name);
};
snow.platform.web.audio.SoundStream.__name__ = true;
snow.platform.web.audio.SoundStream.__super__ = snow.platform.web.audio.howlerjs.Sound;
snow.platform.web.audio.SoundStream.prototype = $extend(snow.platform.web.audio.howlerjs.Sound.prototype,{
	__class__: snow.platform.web.audio.SoundStream
});
snow.platform.web.audio.howlerjs.AudioSystem = function(_manager,_lib) {
	snow.platform.web.audio.AudioSystem.call(this,_manager,_lib);
};
snow.platform.web.audio.howlerjs.AudioSystem.__name__ = true;
snow.platform.web.audio.howlerjs.AudioSystem.__super__ = snow.platform.web.audio.AudioSystem;
snow.platform.web.audio.howlerjs.AudioSystem.prototype = $extend(snow.platform.web.audio.AudioSystem.prototype,{
	init: function() {
	}
	,process: function() {
	}
	,destroy: function() {
	}
	,suspend: function() {
	}
	,resume: function() {
	}
	,_on_end: function(handle) {
		var sound = this.manager.handles.h[handle.__id__];
		if(sound != null) sound.emit("end");
	}
	,__class__: snow.platform.web.audio.howlerjs.AudioSystem
});
snow.platform.web.audio.howlerjs.SoundStream = function(_manager,_name) {
	snow.platform.web.audio.SoundStream.call(this,_manager,_name);
};
snow.platform.web.audio.howlerjs.SoundStream.__name__ = true;
snow.platform.web.audio.howlerjs.SoundStream.__super__ = snow.platform.web.audio.SoundStream;
snow.platform.web.audio.howlerjs.SoundStream.prototype = $extend(snow.platform.web.audio.SoundStream.prototype,{
	__class__: snow.platform.web.audio.howlerjs.SoundStream
});
snow.platform.web.input = {};
snow.platform.web.input.DOMKeys = function() { };
snow.platform.web.input.DOMKeys.__name__ = true;
snow.platform.web.input.DOMKeys.dom_key_to_keycode = function(_keycode) {
	switch(_keycode) {
	case 16:
		return snow.input.Keycodes.lshift;
	case 17:
		return snow.input.Keycodes.lctrl;
	case 18:
		return snow.input.Keycodes.lalt;
	case 20:
		return snow.input.Keycodes.capslock;
	case 33:
		return snow.input.Keycodes.pageup;
	case 34:
		return snow.input.Keycodes.pagedown;
	case 35:
		return snow.input.Keycodes.end;
	case 36:
		return snow.input.Keycodes.home;
	case 37:
		return snow.input.Keycodes.left;
	case 38:
		return snow.input.Keycodes.up;
	case 39:
		return snow.input.Keycodes.right;
	case 40:
		return snow.input.Keycodes.down;
	case 44:
		return snow.input.Keycodes.printscreen;
	case 45:
		return snow.input.Keycodes.insert;
	case 46:
		return snow.input.Keycodes["delete"];
	case 91:
		return snow.input.Keycodes.lmeta;
	case 93:
		return snow.input.Keycodes.rmeta;
	case 224:
		return snow.input.Keycodes.lmeta;
	case 96:
		return snow.input.Keycodes.kp_0;
	case 97:
		return snow.input.Keycodes.kp_1;
	case 98:
		return snow.input.Keycodes.kp_2;
	case 99:
		return snow.input.Keycodes.kp_3;
	case 100:
		return snow.input.Keycodes.kp_4;
	case 101:
		return snow.input.Keycodes.kp_5;
	case 102:
		return snow.input.Keycodes.kp_6;
	case 103:
		return snow.input.Keycodes.kp_7;
	case 104:
		return snow.input.Keycodes.kp_8;
	case 105:
		return snow.input.Keycodes.kp_9;
	case 106:
		return snow.input.Keycodes.kp_multiply;
	case 107:
		return snow.input.Keycodes.kp_plus;
	case 109:
		return snow.input.Keycodes.kp_minus;
	case 110:
		return snow.input.Keycodes.kp_decimal;
	case 111:
		return snow.input.Keycodes.kp_divide;
	case 144:
		return snow.input.Keycodes.numlockclear;
	case 112:
		return snow.input.Keycodes.f1;
	case 113:
		return snow.input.Keycodes.f2;
	case 114:
		return snow.input.Keycodes.f3;
	case 115:
		return snow.input.Keycodes.f4;
	case 116:
		return snow.input.Keycodes.f5;
	case 117:
		return snow.input.Keycodes.f6;
	case 118:
		return snow.input.Keycodes.f7;
	case 119:
		return snow.input.Keycodes.f8;
	case 120:
		return snow.input.Keycodes.f9;
	case 121:
		return snow.input.Keycodes.f10;
	case 122:
		return snow.input.Keycodes.f11;
	case 123:
		return snow.input.Keycodes.f12;
	case 124:
		return snow.input.Keycodes.f13;
	case 125:
		return snow.input.Keycodes.f14;
	case 126:
		return snow.input.Keycodes.f15;
	case 127:
		return snow.input.Keycodes.f16;
	case 128:
		return snow.input.Keycodes.f17;
	case 129:
		return snow.input.Keycodes.f18;
	case 130:
		return snow.input.Keycodes.f19;
	case 131:
		return snow.input.Keycodes.f20;
	case 132:
		return snow.input.Keycodes.f21;
	case 133:
		return snow.input.Keycodes.f22;
	case 134:
		return snow.input.Keycodes.f23;
	case 135:
		return snow.input.Keycodes.f24;
	case 160:
		return snow.input.Keycodes.caret;
	case 161:
		return snow.input.Keycodes.exclaim;
	case 162:
		return snow.input.Keycodes.quotedbl;
	case 163:
		return snow.input.Keycodes.hash;
	case 164:
		return snow.input.Keycodes.dollar;
	case 165:
		return snow.input.Keycodes.percent;
	case 166:
		return snow.input.Keycodes.ampersand;
	case 167:
		return snow.input.Keycodes.underscore;
	case 168:
		return snow.input.Keycodes.leftparen;
	case 169:
		return snow.input.Keycodes.rightparen;
	case 170:
		return snow.input.Keycodes.asterisk;
	case 171:
		return snow.input.Keycodes.plus;
	case 172:
		return snow.input.Keycodes.backslash;
	case 173:
		return snow.input.Keycodes.minus;
	case 174:
		return snow.input.Keycodes.leftbracket;
	case 175:
		return snow.input.Keycodes.rightbracket;
	case 176:
		return snow.input.Keycodes.backquote;
	case 181:
		return snow.input.Keycodes.audiomute;
	case 182:
		return snow.input.Keycodes.volumedown;
	case 183:
		return snow.input.Keycodes.volumeup;
	case 188:
		return snow.input.Keycodes.comma;
	case 190:
		return snow.input.Keycodes.period;
	case 191:
		return snow.input.Keycodes.slash;
	case 192:
		return snow.input.Keycodes.backquote;
	case 219:
		return snow.input.Keycodes.leftbracket;
	case 221:
		return snow.input.Keycodes.rightbracket;
	case 220:
		return snow.input.Keycodes.backslash;
	case 222:
		return snow.input.Keycodes.quote;
	}
	return _keycode;
};
snow.platform.web.input.InputSystem = function(_manager,_lib) {
	this.gamepads_supported = false;
	this.manager = _manager;
	this.lib = _lib;
};
snow.platform.web.input.InputSystem.__name__ = true;
snow.platform.web.input.InputSystem.__super__ = snow.input.InputSystemBinding;
snow.platform.web.input.InputSystem.prototype = $extend(snow.input.InputSystemBinding.prototype,{
	active_gamepads: null
	,gamepads_supported: null
	,init: function() {
		window.document.addEventListener("keydown",$bind(this,this.on_keydown));
		window.document.addEventListener("keyup",$bind(this,this.on_keyup));
		this.active_gamepads = new haxe.ds.IntMap();
		this.gamepads_supported = this.get_gamepad_list() != null;
		haxe.Log.trace("i / input / " + ("Gamepads supported: " + Std.string(this.gamepads_supported)),{ fileName : "InputSystem.hx", lineNumber : 56, className : "snow.platform.web.input.InputSystem", methodName : "init"});
	}
	,process: function() {
		if(this.gamepads_supported) this.poll_gamepads();
	}
	,destroy: function() {
	}
	,listen: function(window) {
		window.handle.addEventListener("contextmenu",$bind(this,this.on_contextmenu));
		window.handle.addEventListener("mousedown",$bind(this,this.on_mousedown));
		window.handle.addEventListener("mouseup",$bind(this,this.on_mouseup));
		window.handle.addEventListener("mousemove",$bind(this,this.on_mousemove));
		window.handle.addEventListener("mousewheel",$bind(this,this.on_mousewheel));
		window.handle.addEventListener("wheel",$bind(this,this.on_mousewheel));
	}
	,unlisten: function(window) {
	}
	,on_event: function(_event) {
	}
	,text_input_start: function() {
	}
	,text_input_stop: function() {
	}
	,text_input_rect: function(x,y,w,h) {
	}
	,gamepad_add: function(id) {
	}
	,gamepad_remove: function(id) {
	}
	,poll_gamepads: function() {
		if(!this.gamepads_supported) return;
		var list = this.get_gamepad_list();
		if(list != null) {
			var _g1 = 0;
			var _g = list.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(list[i] != null) this.handle_gamepad(list[i]); else {
					var _gamepad = this.active_gamepads.get(i);
					if(_gamepad != null) this.manager.dispatch_gamepad_device_event(_gamepad.index,2,snow.Snow.core.timestamp());
					this.active_gamepads.remove(i);
				}
			}
		}
	}
	,handle_gamepad: function(_gamepad) {
		if(_gamepad == null) return;
		if(!(function($this) {
			var $r;
			var key = _gamepad.index;
			$r = $this.active_gamepads.exists(key);
			return $r;
		}(this))) {
			var _new_gamepad = { id : _gamepad.id, index : _gamepad.index, axes : [], buttons : [], timestamp : snow.Snow.core.timestamp()};
			var axes = _gamepad.axes;
			var _g = 0;
			while(_g < axes.length) {
				var value = axes[_g];
				++_g;
				_new_gamepad.axes.push(value);
			}
			var _button_list = _gamepad.buttons;
			var _g1 = 0;
			while(_g1 < _button_list.length) {
				var _button = _button_list[_g1];
				++_g1;
				_new_gamepad.buttons.push({ pressed : false, value : 0});
			}
			this.active_gamepads.set(_new_gamepad.index,_new_gamepad);
			this.manager.dispatch_gamepad_device_event(_new_gamepad.index,1,_new_gamepad.timestamp);
		} else {
			var gamepad;
			var key1 = _gamepad.index;
			gamepad = this.active_gamepads.get(key1);
			if(gamepad.id != _gamepad.id) gamepad.id = _gamepad.id;
			var axes_changed = [];
			var buttons_changed = [];
			var last_axes = gamepad.axes;
			var last_buttons = gamepad.buttons;
			var new_axes = _gamepad.axes;
			var new_buttons = _gamepad.buttons;
			var axis_index = 0;
			var _g2 = 0;
			while(_g2 < new_axes.length) {
				var axis = new_axes[_g2];
				++_g2;
				if(axis != last_axes[axis_index]) {
					axes_changed.push(axis_index);
					gamepad.axes[axis_index] = axis;
				}
				axis_index++;
			}
			var button_index = 0;
			var _g3 = 0;
			while(_g3 < new_buttons.length) {
				var button = new_buttons[_g3];
				++_g3;
				if(button.value != last_buttons[button_index].value) {
					buttons_changed.push(button_index);
					gamepad.buttons[button_index].pressed = button.pressed;
					gamepad.buttons[button_index].value = button.value;
				}
				button_index++;
			}
			var _g4 = 0;
			while(_g4 < axes_changed.length) {
				var index = axes_changed[_g4];
				++_g4;
				this.manager.dispatch_gamepad_axis_event(gamepad.index,index,new_axes[index],gamepad.timestamp);
			}
			var _g5 = 0;
			while(_g5 < buttons_changed.length) {
				var index1 = buttons_changed[_g5];
				++_g5;
				if(new_buttons[index1].pressed == true) this.manager.dispatch_gamepad_button_down_event(gamepad.index,index1,new_buttons[index1].value,gamepad.timestamp); else this.manager.dispatch_gamepad_button_up_event(gamepad.index,index1,new_buttons[index1].value,gamepad.timestamp);
			}
		}
	}
	,fail_gamepads: function() {
		this.gamepads_supported = false;
		haxe.Log.trace("i / input / " + "Gamepads are not supported in this browser :(",{ fileName : "InputSystem.hx", lineNumber : 283, className : "snow.platform.web.input.InputSystem", methodName : "fail_gamepads"});
	}
	,get_gamepad_list: function() {
		var modernizr = window.Modernizr;
		if(modernizr != null) {
			if(modernizr.gamepads == true) {
				if(($_=window.navigator,$bind($_,$_.getGamepads)) != null) return window.navigator.getGamepads();
				if(window.navigator.webkitGetGamepads != null) return window.navigator.webkitGetGamepads();
				this.fail_gamepads();
			} else this.fail_gamepads();
		}
		return null;
	}
	,on_mousedown: function(_mouse_event) {
		var _window = this.lib.windowing.window_from_handle(_mouse_event.target);
		this.manager.dispatch_mouse_down_event(_mouse_event.pageX - _window.x,_mouse_event.pageY - _window.y,_mouse_event.button + 1,_mouse_event.timeStamp,_window.id);
	}
	,on_mouseup: function(_mouse_event) {
		var _window = this.lib.windowing.window_from_handle(_mouse_event.target);
		this.manager.dispatch_mouse_up_event(_mouse_event.pageX - _window.x,_mouse_event.pageY - _window.y,_mouse_event.button + 1,_mouse_event.timeStamp,_window.id);
	}
	,on_mousemove: function(_mouse_event) {
		var _window = this.lib.windowing.window_from_handle(_mouse_event.target);
		var _movement_x = _mouse_event.movementX;
		var _movement_y = _mouse_event.movementY;
		if(_mouse_event.webkitMovementX != null) {
			_movement_x = _mouse_event.webkitMovementX;
			_movement_y = _mouse_event.webkitMovementY;
		} else if(_mouse_event.mozMovementX != null) {
			_movement_x = _mouse_event.mozMovementX;
			_movement_y = _mouse_event.mozMovementY;
		}
		this.manager.dispatch_mouse_move_event(_mouse_event.pageX - _window.x,_mouse_event.pageY - _window.y,_movement_x,_movement_y,_mouse_event.timeStamp,_window.id);
	}
	,on_mousewheel: function(_wheel_event) {
		var _window = this.lib.windowing.window_from_handle(_wheel_event.target);
		var _x = 0;
		var _y = 0;
		if(_wheel_event.deltaY != null) _y = _wheel_event.deltaY; else if(_wheel_event.wheelDeltaY != null) _y = -_wheel_event.wheelDeltaY / 3 | 0;
		if(_wheel_event.deltaX != null) _x = _wheel_event.deltaX; else if(_wheel_event.wheelDeltaX != null) _x = -_wheel_event.wheelDeltaX / 3 | 0;
		this.manager.dispatch_mouse_wheel_event(Math.round(_x / 16),Math.round(_y / 16),_wheel_event.timeStamp,_window.id);
	}
	,on_contextmenu: function(_event) {
		if(this.lib.config.web.no_context_menu) _event.preventDefault();
	}
	,on_keydown: function(_key_event) {
		var _keycode = this.convert_keycode(_key_event.keyCode);
		var _scancode = snow.input.Keycodes.to_scan(_keycode);
		var _mod_state = this.mod_state_from_event(_key_event);
		this.manager.dispatch_key_down_event(_keycode,_scancode,_key_event.repeat,_mod_state,_key_event.timeStamp,1);
	}
	,on_keyup: function(_key_event) {
		var _keycode = this.convert_keycode(_key_event.keyCode);
		var _scancode = snow.input.Keycodes.to_scan(_keycode);
		var _mod_state = this.mod_state_from_event(_key_event);
		this.manager.dispatch_key_up_event(_keycode,_scancode,_key_event.repeat,_mod_state,_key_event.timeStamp,1);
	}
	,mod_state_from_event: function(_key_event) {
		var _none = !_key_event.altKey && !_key_event.ctrlKey && !_key_event.metaKey && !_key_event.shiftKey;
		return { none : _none, lshift : _key_event.shiftKey, rshift : _key_event.shiftKey, lctrl : _key_event.ctrlKey, rctrl : _key_event.ctrlKey, lalt : _key_event.altKey, ralt : _key_event.altKey, lmeta : _key_event.metaKey, rmeta : _key_event.metaKey, num : false, caps : false, mode : false, ctrl : _key_event.ctrlKey, shift : _key_event.shiftKey, alt : _key_event.altKey, meta : _key_event.metaKey};
	}
	,convert_keycode: function(dom_keycode) {
		if(dom_keycode >= 65 && dom_keycode <= 90) return dom_keycode + 32;
		return snow.platform.web.input.DOMKeys.dom_key_to_keycode(dom_keycode);
	}
	,__class__: snow.platform.web.input.InputSystem
});
snow.platform.web.io = {};
snow.platform.web.io.IOSystem = function(_manager,_lib) {
	this.manager = _manager;
	this.lib = _lib;
};
snow.platform.web.io.IOSystem.__name__ = true;
snow.platform.web.io.IOSystem.__super__ = snow.io.IOSystemBinding;
snow.platform.web.io.IOSystem.prototype = $extend(snow.io.IOSystemBinding.prototype,{
	url_open: function(_url) {
		if(_url != null && _url.length > 0) window.open(_url,"_blank");
	}
	,init: function() {
	}
	,process: function() {
	}
	,destroy: function() {
	}
	,on_event: function(_event) {
	}
	,__class__: snow.platform.web.io.IOSystem
});
snow.platform.web.render = {};
snow.platform.web.render.opengl = {};
snow.platform.web.render.opengl.GL = function() { };
snow.platform.web.render.opengl.GL.__name__ = true;
snow.platform.web.render.opengl.GL.__properties__ = {get_version:"get_version"}
snow.platform.web.render.opengl.GL.versionString = function() {
	var ver = snow.platform.web.render.opengl.GL.current_context.getParameter(7938);
	var slver = snow.platform.web.render.opengl.GL.current_context.getParameter(35724);
	var ren = snow.platform.web.render.opengl.GL.current_context.getParameter(7937);
	var ven = snow.platform.web.render.opengl.GL.current_context.getParameter(7936);
	return "/ " + ver + " / " + slver + " / " + ren + " / " + ven + " /";
};
snow.platform.web.render.opengl.GL.activeTexture = function(texture) {
	snow.platform.web.render.opengl.GL.current_context.activeTexture(texture);
};
snow.platform.web.render.opengl.GL.attachShader = function(program,shader) {
	snow.platform.web.render.opengl.GL.current_context.attachShader(program,shader);
};
snow.platform.web.render.opengl.GL.bindAttribLocation = function(program,index,name) {
	snow.platform.web.render.opengl.GL.current_context.bindAttribLocation(program,index,name);
};
snow.platform.web.render.opengl.GL.bindBuffer = function(target,buffer) {
	snow.platform.web.render.opengl.GL.current_context.bindBuffer(target,buffer);
};
snow.platform.web.render.opengl.GL.bindFramebuffer = function(target,framebuffer) {
	snow.platform.web.render.opengl.GL.current_context.bindFramebuffer(target,framebuffer);
};
snow.platform.web.render.opengl.GL.bindRenderbuffer = function(target,renderbuffer) {
	snow.platform.web.render.opengl.GL.current_context.bindRenderbuffer(target,renderbuffer);
};
snow.platform.web.render.opengl.GL.bindTexture = function(target,texture) {
	snow.platform.web.render.opengl.GL.current_context.bindTexture(target,texture);
};
snow.platform.web.render.opengl.GL.blendColor = function(red,green,blue,alpha) {
	snow.platform.web.render.opengl.GL.current_context.blendColor(red,green,blue,alpha);
};
snow.platform.web.render.opengl.GL.blendEquation = function(mode) {
	snow.platform.web.render.opengl.GL.current_context.blendEquation(mode);
};
snow.platform.web.render.opengl.GL.blendEquationSeparate = function(modeRGB,modeAlpha) {
	snow.platform.web.render.opengl.GL.current_context.blendEquationSeparate(modeRGB,modeAlpha);
};
snow.platform.web.render.opengl.GL.blendFunc = function(sfactor,dfactor) {
	snow.platform.web.render.opengl.GL.current_context.blendFunc(sfactor,dfactor);
};
snow.platform.web.render.opengl.GL.blendFuncSeparate = function(srcRGB,dstRGB,srcAlpha,dstAlpha) {
	snow.platform.web.render.opengl.GL.current_context.blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);
};
snow.platform.web.render.opengl.GL.bufferData = function(target,data,usage) {
	snow.platform.web.render.opengl.GL.current_context.bufferData(target,data,usage);
};
snow.platform.web.render.opengl.GL.bufferSubData = function(target,offset,data) {
	snow.platform.web.render.opengl.GL.current_context.bufferSubData(target,offset,data);
};
snow.platform.web.render.opengl.GL.checkFramebufferStatus = function(target) {
	return snow.platform.web.render.opengl.GL.current_context.checkFramebufferStatus(target);
};
snow.platform.web.render.opengl.GL.clear = function(mask) {
	snow.platform.web.render.opengl.GL.current_context.clear(mask);
};
snow.platform.web.render.opengl.GL.clearColor = function(red,green,blue,alpha) {
	snow.platform.web.render.opengl.GL.current_context.clearColor(red,green,blue,alpha);
};
snow.platform.web.render.opengl.GL.clearDepth = function(depth) {
	snow.platform.web.render.opengl.GL.current_context.clearDepth(depth);
};
snow.platform.web.render.opengl.GL.clearStencil = function(s) {
	snow.platform.web.render.opengl.GL.current_context.clearStencil(s);
};
snow.platform.web.render.opengl.GL.colorMask = function(red,green,blue,alpha) {
	snow.platform.web.render.opengl.GL.current_context.colorMask(red,green,blue,alpha);
};
snow.platform.web.render.opengl.GL.compileShader = function(shader) {
	snow.platform.web.render.opengl.GL.current_context.compileShader(shader);
};
snow.platform.web.render.opengl.GL.compressedTexImage2D = function(target,level,internalformat,width,height,border,data) {
	snow.platform.web.render.opengl.GL.current_context.compressedTexImage2D(target,level,internalformat,width,height,border,data);
};
snow.platform.web.render.opengl.GL.compressedTexSubImage2D = function(target,level,xoffset,yoffset,width,height,format,data) {
	snow.platform.web.render.opengl.GL.current_context.compressedTexSubImage2D(target,level,xoffset,yoffset,width,height,format,data);
};
snow.platform.web.render.opengl.GL.copyTexImage2D = function(target,level,internalformat,x,y,width,height,border) {
	snow.platform.web.render.opengl.GL.current_context.copyTexImage2D(target,level,internalformat,x,y,width,height,border);
};
snow.platform.web.render.opengl.GL.copyTexSubImage2D = function(target,level,xoffset,yoffset,x,y,width,height) {
	snow.platform.web.render.opengl.GL.current_context.copyTexSubImage2D(target,level,xoffset,yoffset,x,y,width,height);
};
snow.platform.web.render.opengl.GL.createBuffer = function() {
	return snow.platform.web.render.opengl.GL.current_context.createBuffer();
};
snow.platform.web.render.opengl.GL.createFramebuffer = function() {
	return snow.platform.web.render.opengl.GL.current_context.createFramebuffer();
};
snow.platform.web.render.opengl.GL.createProgram = function() {
	return snow.platform.web.render.opengl.GL.current_context.createProgram();
};
snow.platform.web.render.opengl.GL.createRenderbuffer = function() {
	return snow.platform.web.render.opengl.GL.current_context.createRenderbuffer();
};
snow.platform.web.render.opengl.GL.createShader = function(type) {
	return snow.platform.web.render.opengl.GL.current_context.createShader(type);
};
snow.platform.web.render.opengl.GL.createTexture = function() {
	return snow.platform.web.render.opengl.GL.current_context.createTexture();
};
snow.platform.web.render.opengl.GL.cullFace = function(mode) {
	snow.platform.web.render.opengl.GL.current_context.cullFace(mode);
};
snow.platform.web.render.opengl.GL.deleteBuffer = function(buffer) {
	snow.platform.web.render.opengl.GL.current_context.deleteBuffer(buffer);
};
snow.platform.web.render.opengl.GL.deleteFramebuffer = function(framebuffer) {
	snow.platform.web.render.opengl.GL.current_context.deleteFramebuffer(framebuffer);
};
snow.platform.web.render.opengl.GL.deleteProgram = function(program) {
	snow.platform.web.render.opengl.GL.current_context.deleteProgram(program);
};
snow.platform.web.render.opengl.GL.deleteRenderbuffer = function(renderbuffer) {
	snow.platform.web.render.opengl.GL.current_context.deleteRenderbuffer(renderbuffer);
};
snow.platform.web.render.opengl.GL.deleteShader = function(shader) {
	snow.platform.web.render.opengl.GL.current_context.deleteShader(shader);
};
snow.platform.web.render.opengl.GL.deleteTexture = function(texture) {
	snow.platform.web.render.opengl.GL.current_context.deleteTexture(texture);
};
snow.platform.web.render.opengl.GL.depthFunc = function(func) {
	snow.platform.web.render.opengl.GL.current_context.depthFunc(func);
};
snow.platform.web.render.opengl.GL.depthMask = function(flag) {
	snow.platform.web.render.opengl.GL.current_context.depthMask(flag);
};
snow.platform.web.render.opengl.GL.depthRange = function(zNear,zFar) {
	snow.platform.web.render.opengl.GL.current_context.depthRange(zNear,zFar);
};
snow.platform.web.render.opengl.GL.detachShader = function(program,shader) {
	snow.platform.web.render.opengl.GL.current_context.detachShader(program,shader);
};
snow.platform.web.render.opengl.GL.disable = function(cap) {
	snow.platform.web.render.opengl.GL.current_context.disable(cap);
};
snow.platform.web.render.opengl.GL.disableVertexAttribArray = function(index) {
	snow.platform.web.render.opengl.GL.current_context.disableVertexAttribArray(index);
};
snow.platform.web.render.opengl.GL.drawArrays = function(mode,first,count) {
	snow.platform.web.render.opengl.GL.current_context.drawArrays(mode,first,count);
};
snow.platform.web.render.opengl.GL.drawElements = function(mode,count,type,offset) {
	snow.platform.web.render.opengl.GL.current_context.drawElements(mode,count,type,offset);
};
snow.platform.web.render.opengl.GL.enable = function(cap) {
	snow.platform.web.render.opengl.GL.current_context.enable(cap);
};
snow.platform.web.render.opengl.GL.enableVertexAttribArray = function(index) {
	snow.platform.web.render.opengl.GL.current_context.enableVertexAttribArray(index);
};
snow.platform.web.render.opengl.GL.finish = function() {
	snow.platform.web.render.opengl.GL.current_context.finish();
};
snow.platform.web.render.opengl.GL.flush = function() {
	snow.platform.web.render.opengl.GL.current_context.flush();
};
snow.platform.web.render.opengl.GL.framebufferRenderbuffer = function(target,attachment,renderbuffertarget,renderbuffer) {
	snow.platform.web.render.opengl.GL.current_context.framebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer);
};
snow.platform.web.render.opengl.GL.framebufferTexture2D = function(target,attachment,textarget,texture,level) {
	snow.platform.web.render.opengl.GL.current_context.framebufferTexture2D(target,attachment,textarget,texture,level);
};
snow.platform.web.render.opengl.GL.frontFace = function(mode) {
	snow.platform.web.render.opengl.GL.current_context.frontFace(mode);
};
snow.platform.web.render.opengl.GL.generateMipmap = function(target) {
	snow.platform.web.render.opengl.GL.current_context.generateMipmap(target);
};
snow.platform.web.render.opengl.GL.getActiveAttrib = function(program,index) {
	return snow.platform.web.render.opengl.GL.current_context.getActiveAttrib(program,index);
};
snow.platform.web.render.opengl.GL.getActiveUniform = function(program,index) {
	return snow.platform.web.render.opengl.GL.current_context.getActiveUniform(program,index);
};
snow.platform.web.render.opengl.GL.getAttachedShaders = function(program) {
	return snow.platform.web.render.opengl.GL.current_context.getAttachedShaders(program);
};
snow.platform.web.render.opengl.GL.getAttribLocation = function(program,name) {
	return snow.platform.web.render.opengl.GL.current_context.getAttribLocation(program,name);
};
snow.platform.web.render.opengl.GL.getBufferParameter = function(target,pname) {
	return snow.platform.web.render.opengl.GL.current_context.getBufferParameter(target,pname);
};
snow.platform.web.render.opengl.GL.getContextAttributes = function() {
	return snow.platform.web.render.opengl.GL.current_context.getContextAttributes();
};
snow.platform.web.render.opengl.GL.getError = function() {
	return snow.platform.web.render.opengl.GL.current_context.getError();
};
snow.platform.web.render.opengl.GL.getExtension = function(name) {
	return snow.platform.web.render.opengl.GL.current_context.getExtension(name);
};
snow.platform.web.render.opengl.GL.getFramebufferAttachmentParameter = function(target,attachment,pname) {
	return snow.platform.web.render.opengl.GL.current_context.getFramebufferAttachmentParameter(target,attachment,pname);
};
snow.platform.web.render.opengl.GL.getParameter = function(pname) {
	return snow.platform.web.render.opengl.GL.current_context.getParameter(pname);
};
snow.platform.web.render.opengl.GL.getProgramInfoLog = function(program) {
	return snow.platform.web.render.opengl.GL.current_context.getProgramInfoLog(program);
};
snow.platform.web.render.opengl.GL.getProgramParameter = function(program,pname) {
	return snow.platform.web.render.opengl.GL.current_context.getProgramParameter(program,pname);
};
snow.platform.web.render.opengl.GL.getRenderbufferParameter = function(target,pname) {
	return snow.platform.web.render.opengl.GL.current_context.getRenderbufferParameter(target,pname);
};
snow.platform.web.render.opengl.GL.getShaderInfoLog = function(shader) {
	return snow.platform.web.render.opengl.GL.current_context.getShaderInfoLog(shader);
};
snow.platform.web.render.opengl.GL.getShaderParameter = function(shader,pname) {
	return snow.platform.web.render.opengl.GL.current_context.getShaderParameter(shader,pname);
};
snow.platform.web.render.opengl.GL.getShaderPrecisionFormat = function(shadertype,precisiontype) {
	return snow.platform.web.render.opengl.GL.current_context.getShaderPrecisionFormat(shadertype,precisiontype);
};
snow.platform.web.render.opengl.GL.getShaderSource = function(shader) {
	return snow.platform.web.render.opengl.GL.current_context.getShaderSource(shader);
};
snow.platform.web.render.opengl.GL.getSupportedExtensions = function() {
	return snow.platform.web.render.opengl.GL.current_context.getSupportedExtensions();
};
snow.platform.web.render.opengl.GL.getTexParameter = function(target,pname) {
	return snow.platform.web.render.opengl.GL.current_context.getTexParameter(target,pname);
};
snow.platform.web.render.opengl.GL.getUniform = function(program,location) {
	return snow.platform.web.render.opengl.GL.current_context.getUniform(program,location);
};
snow.platform.web.render.opengl.GL.getUniformLocation = function(program,name) {
	return snow.platform.web.render.opengl.GL.current_context.getUniformLocation(program,name);
};
snow.platform.web.render.opengl.GL.getVertexAttrib = function(index,pname) {
	return snow.platform.web.render.opengl.GL.current_context.getVertexAttrib(index,pname);
};
snow.platform.web.render.opengl.GL.getVertexAttribOffset = function(index,pname) {
	return snow.platform.web.render.opengl.GL.current_context.getVertexAttribOffset(index,pname);
};
snow.platform.web.render.opengl.GL.hint = function(target,mode) {
	snow.platform.web.render.opengl.GL.current_context.hint(target,mode);
};
snow.platform.web.render.opengl.GL.isBuffer = function(buffer) {
	return snow.platform.web.render.opengl.GL.current_context.isBuffer(buffer);
};
snow.platform.web.render.opengl.GL.isEnabled = function(cap) {
	return snow.platform.web.render.opengl.GL.current_context.isEnabled(cap);
};
snow.platform.web.render.opengl.GL.isFramebuffer = function(framebuffer) {
	return snow.platform.web.render.opengl.GL.current_context.isFramebuffer(framebuffer);
};
snow.platform.web.render.opengl.GL.isProgram = function(program) {
	return snow.platform.web.render.opengl.GL.current_context.isProgram(program);
};
snow.platform.web.render.opengl.GL.isRenderbuffer = function(renderbuffer) {
	return snow.platform.web.render.opengl.GL.current_context.isRenderbuffer(renderbuffer);
};
snow.platform.web.render.opengl.GL.isShader = function(shader) {
	return snow.platform.web.render.opengl.GL.current_context.isShader(shader);
};
snow.platform.web.render.opengl.GL.isTexture = function(texture) {
	return snow.platform.web.render.opengl.GL.current_context.isTexture(texture);
};
snow.platform.web.render.opengl.GL.lineWidth = function(width) {
	snow.platform.web.render.opengl.GL.current_context.lineWidth(width);
};
snow.platform.web.render.opengl.GL.linkProgram = function(program) {
	snow.platform.web.render.opengl.GL.current_context.linkProgram(program);
};
snow.platform.web.render.opengl.GL.pixelStorei = function(pname,param) {
	snow.platform.web.render.opengl.GL.current_context.pixelStorei(pname,param);
};
snow.platform.web.render.opengl.GL.polygonOffset = function(factor,units) {
	snow.platform.web.render.opengl.GL.current_context.polygonOffset(factor,units);
};
snow.platform.web.render.opengl.GL.readPixels = function(x,y,width,height,format,type,pixels) {
	snow.platform.web.render.opengl.GL.current_context.readPixels(x,y,width,height,format,type,pixels);
};
snow.platform.web.render.opengl.GL.renderbufferStorage = function(target,internalformat,width,height) {
	snow.platform.web.render.opengl.GL.current_context.renderbufferStorage(target,internalformat,width,height);
};
snow.platform.web.render.opengl.GL.sampleCoverage = function(value,invert) {
	snow.platform.web.render.opengl.GL.current_context.sampleCoverage(value,invert);
};
snow.platform.web.render.opengl.GL.scissor = function(x,y,width,height) {
	snow.platform.web.render.opengl.GL.current_context.scissor(x,y,width,height);
};
snow.platform.web.render.opengl.GL.shaderSource = function(shader,source) {
	snow.platform.web.render.opengl.GL.current_context.shaderSource(shader,source);
};
snow.platform.web.render.opengl.GL.stencilFunc = function(func,ref,mask) {
	snow.platform.web.render.opengl.GL.current_context.stencilFunc(func,ref,mask);
};
snow.platform.web.render.opengl.GL.stencilFuncSeparate = function(face,func,ref,mask) {
	snow.platform.web.render.opengl.GL.current_context.stencilFuncSeparate(face,func,ref,mask);
};
snow.platform.web.render.opengl.GL.stencilMask = function(mask) {
	snow.platform.web.render.opengl.GL.current_context.stencilMask(mask);
};
snow.platform.web.render.opengl.GL.stencilMaskSeparate = function(face,mask) {
	snow.platform.web.render.opengl.GL.current_context.stencilMaskSeparate(face,mask);
};
snow.platform.web.render.opengl.GL.stencilOp = function(fail,zfail,zpass) {
	snow.platform.web.render.opengl.GL.current_context.stencilOp(fail,zfail,zpass);
};
snow.platform.web.render.opengl.GL.stencilOpSeparate = function(face,fail,zfail,zpass) {
	snow.platform.web.render.opengl.GL.current_context.stencilOpSeparate(face,fail,zfail,zpass);
};
snow.platform.web.render.opengl.GL.texImage2D = function(target,level,internalformat,width,height,border,format,type,pixels) {
	snow.platform.web.render.opengl.GL.current_context.texImage2D(target,level,internalformat,width,height,border,format,type,pixels);
};
snow.platform.web.render.opengl.GL.texParameterf = function(target,pname,param) {
	snow.platform.web.render.opengl.GL.current_context.texParameterf(target,pname,param);
};
snow.platform.web.render.opengl.GL.texParameteri = function(target,pname,param) {
	snow.platform.web.render.opengl.GL.current_context.texParameteri(target,pname,param);
};
snow.platform.web.render.opengl.GL.texSubImage2D = function(target,level,xoffset,yoffset,width,height,format,type,pixels) {
	snow.platform.web.render.opengl.GL.current_context.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels);
};
snow.platform.web.render.opengl.GL.uniform1f = function(location,x) {
	snow.platform.web.render.opengl.GL.current_context.uniform1f(location,x);
};
snow.platform.web.render.opengl.GL.uniform1fv = function(location,x) {
	snow.platform.web.render.opengl.GL.current_context.uniform1fv(location,x);
};
snow.platform.web.render.opengl.GL.uniform1i = function(location,x) {
	snow.platform.web.render.opengl.GL.current_context.uniform1i(location,x);
};
snow.platform.web.render.opengl.GL.uniform1iv = function(location,v) {
	snow.platform.web.render.opengl.GL.current_context.uniform1iv(location,v);
};
snow.platform.web.render.opengl.GL.uniform2f = function(location,x,y) {
	snow.platform.web.render.opengl.GL.current_context.uniform2f(location,x,y);
};
snow.platform.web.render.opengl.GL.uniform2fv = function(location,v) {
	snow.platform.web.render.opengl.GL.current_context.uniform2fv(location,v);
};
snow.platform.web.render.opengl.GL.uniform2i = function(location,x,y) {
	snow.platform.web.render.opengl.GL.current_context.uniform2i(location,x,y);
};
snow.platform.web.render.opengl.GL.uniform2iv = function(location,v) {
	snow.platform.web.render.opengl.GL.current_context.uniform2iv(location,v);
};
snow.platform.web.render.opengl.GL.uniform3f = function(location,x,y,z) {
	snow.platform.web.render.opengl.GL.current_context.uniform3f(location,x,y,z);
};
snow.platform.web.render.opengl.GL.uniform3fv = function(location,v) {
	snow.platform.web.render.opengl.GL.current_context.uniform3fv(location,v);
};
snow.platform.web.render.opengl.GL.uniform3i = function(location,x,y,z) {
	snow.platform.web.render.opengl.GL.current_context.uniform3i(location,x,y,z);
};
snow.platform.web.render.opengl.GL.uniform3iv = function(location,v) {
	snow.platform.web.render.opengl.GL.current_context.uniform3iv(location,v);
};
snow.platform.web.render.opengl.GL.uniform4f = function(location,x,y,z,w) {
	snow.platform.web.render.opengl.GL.current_context.uniform4f(location,x,y,z,w);
};
snow.platform.web.render.opengl.GL.uniform4fv = function(location,v) {
	snow.platform.web.render.opengl.GL.current_context.uniform4fv(location,v);
};
snow.platform.web.render.opengl.GL.uniform4i = function(location,x,y,z,w) {
	snow.platform.web.render.opengl.GL.current_context.uniform4i(location,x,y,z,w);
};
snow.platform.web.render.opengl.GL.uniform4iv = function(location,v) {
	snow.platform.web.render.opengl.GL.current_context.uniform4iv(location,v);
};
snow.platform.web.render.opengl.GL.uniformMatrix2fv = function(location,transpose,v) {
	snow.platform.web.render.opengl.GL.current_context.uniformMatrix2fv(location,transpose,v);
};
snow.platform.web.render.opengl.GL.uniformMatrix3fv = function(location,transpose,v) {
	snow.platform.web.render.opengl.GL.current_context.uniformMatrix3fv(location,transpose,v);
};
snow.platform.web.render.opengl.GL.uniformMatrix4fv = function(location,transpose,v) {
	snow.platform.web.render.opengl.GL.current_context.uniformMatrix4fv(location,transpose,v);
};
snow.platform.web.render.opengl.GL.useProgram = function(program) {
	snow.platform.web.render.opengl.GL.current_context.useProgram(program);
};
snow.platform.web.render.opengl.GL.validateProgram = function(program) {
	snow.platform.web.render.opengl.GL.current_context.validateProgram(program);
};
snow.platform.web.render.opengl.GL.vertexAttrib1f = function(indx,x) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttrib1f(indx,x);
};
snow.platform.web.render.opengl.GL.vertexAttrib1fv = function(indx,values) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttrib1fv(indx,values);
};
snow.platform.web.render.opengl.GL.vertexAttrib2f = function(indx,x,y) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttrib2f(indx,x,y);
};
snow.platform.web.render.opengl.GL.vertexAttrib2fv = function(indx,values) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttrib2fv(indx,values);
};
snow.platform.web.render.opengl.GL.vertexAttrib3f = function(indx,x,y,z) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttrib3f(indx,x,y,z);
};
snow.platform.web.render.opengl.GL.vertexAttrib3fv = function(indx,values) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttrib3fv(indx,values);
};
snow.platform.web.render.opengl.GL.vertexAttrib4f = function(indx,x,y,z,w) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttrib4f(indx,x,y,z,w);
};
snow.platform.web.render.opengl.GL.vertexAttrib4fv = function(indx,values) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttrib4fv(indx,values);
};
snow.platform.web.render.opengl.GL.vertexAttribPointer = function(indx,size,type,normalized,stride,offset) {
	snow.platform.web.render.opengl.GL.current_context.vertexAttribPointer(indx,size,type,normalized,stride,offset);
};
snow.platform.web.render.opengl.GL.viewport = function(x,y,width,height) {
	snow.platform.web.render.opengl.GL.current_context.viewport(x,y,width,height);
};
snow.platform.web.render.opengl.GL.get_version = function() {
	return 7938;
};
snow.platform.web.utils = {};
snow.platform.web.utils.ByteArray = function() {
	this.littleEndian = false;
	this.allocated = 0;
	this.position = 0;
	this.length = 0;
	this._snowResizeBuffer(this.allocated);
};
snow.platform.web.utils.ByteArray.__name__ = true;
snow.platform.web.utils.ByteArray.toBytes = function(ba) {
	if(ba == null) return null;
	var bytes = haxe.io.Bytes.alloc(ba.length);
	ba.position = 0;
	var _g1 = 0;
	var _g = bytes.length;
	while(_g1 < _g) {
		var _i = _g1++;
		bytes.set(_i,ba.readUnsignedByte());
	}
	ba.position = 0;
	return bytes;
};
snow.platform.web.utils.ByteArray.fromBytes = function(inBytes) {
	var result = new snow.platform.web.utils.ByteArray();
	result.byteView = new Uint8Array(inBytes.b);
	result.set_length(result.byteView.length);
	result.allocated = result.length;
	return result;
};
snow.platform.web.utils.ByteArray.snowOfBuffer = function(buffer) {
	var bytes = new snow.platform.web.utils.ByteArray();
	bytes.set_length(buffer.byteLength);
	bytes.data = new DataView(buffer);
	bytes.byteView = new Uint8Array(buffer);
	return bytes;
};
snow.platform.web.utils.ByteArray.readFile = function(_path,async,onload) {
	if(async == null) async = false;
	var request = new XMLHttpRequest();
	request.open("GET",_path,async);
	request.overrideMimeType("text/plain; charset=x-user-defined");
	if(async) request.responseType = "arraybuffer";
	var result = null;
	var finalized = false;
	var finalize = function() {
		if(!finalized) {
			if(!async) {
				result = new snow.platform.web.utils.ByteArray();
				result.writeUTFBytes(request.response);
				result.position = 0;
			} else result = snow.platform.web.utils.ByteArray.snowOfBuffer(request.response);
		}
		return result;
	};
	request.onload = function(data) {
		if(onload != null) {
			if(request.status == 200) onload(finalize()); else onload(null);
		}
	};
	request.send();
	if(!async) {
		if(request.status == 200) return finalize(); else return null;
	}
	return null;
};
snow.platform.web.utils.ByteArray.prototype = {
	bytesAvailable: null
	,length: null
	,objectEncoding: null
	,position: null
	,allocated: null
	,byteView: null
	,data: null
	,littleEndian: null
	,__get: function(pos) {
		return this.data.getUint8(pos);
	}
	,__set: function(pos,v) {
		this.data.setUint8(pos,v);
	}
	,_getUTFBytesCount: function(value) {
		var count = 0;
		var _g1 = 0;
		var _g = value.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = value.charCodeAt(i);
			if(c <= 127) count += 1; else if(c <= 2047) count += 2; else if(c <= 65535) count += 3; else count += 4;
		}
		return count;
	}
	,_snowResizeBuffer: function(len) {
		var oldByteView = this.byteView;
		var newByteView = new Uint8Array(len);
		if(oldByteView != null) {
			if(oldByteView.length <= len) newByteView.set(oldByteView); else newByteView.set(oldByteView.subarray(0,len));
		}
		this.byteView = newByteView;
		this.data = new DataView(newByteView.buffer);
	}
	,clear: function() {
		if(this.allocated < 0) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(0,this.allocated * 2))); else if(this.allocated > 0) this._snowResizeBuffer(this.allocated = 0);
		this.length = 0;
		0;
	}
	,getData: function() {
		return this.data.buffer;
	}
	,snowFromBytes: function(inBytes) {
		this.byteView = new Uint8Array(inBytes.b);
		this.set_length(this.byteView.length);
		this.allocated = this.length;
	}
	,snowGet: function(pos) {
		var data = this.data;
		return data.getUint8(pos);
	}
	,snowGetBuffer: function() {
		return this.data.buffer;
	}
	,snowSet: function(pos,v) {
		var data = this.data;
		data.setUint8(pos,v);
	}
	,readBoolean: function() {
		return this.readByte() != 0;
	}
	,readByte: function() {
		var data = this.data;
		return data.getUint8(this.position++);
	}
	,readBytes: function(bytes,offset,length) {
		if(offset < 0 || length < 0) throw "Read error - Out of bounds";
		if(offset == null) offset = 0;
		if(length == null) length = this.length;
		var lengthToEnsure = offset + length;
		if(bytes.length < lengthToEnsure) {
			if(bytes.allocated < lengthToEnsure) bytes._snowResizeBuffer(bytes.allocated = Std["int"](Math.max(lengthToEnsure,bytes.allocated * 2))); else if(bytes.allocated > lengthToEnsure) bytes._snowResizeBuffer(bytes.allocated = lengthToEnsure);
			bytes.length = lengthToEnsure;
			lengthToEnsure;
		}
		bytes.byteView.set(this.byteView.subarray(this.position,this.position + length),offset);
		bytes.position = offset;
		this.position += length;
		if(bytes.position + length > bytes.length) bytes.set_length(bytes.position + length);
	}
	,readDouble: function() {
		var $double = this.data.getFloat64(this.position,this.littleEndian);
		this.position += 8;
		return $double;
	}
	,readFloat: function() {
		var $float = this.data.getFloat32(this.position,this.littleEndian);
		this.position += 4;
		return $float;
	}
	,readFullBytes: function(bytes,pos,len) {
		if(this.length < len) {
			if(this.allocated < len) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(len,this.allocated * 2))); else if(this.allocated > len) this._snowResizeBuffer(this.allocated = len);
			this.length = len;
			len;
		}
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			var data = this.data;
			data.setInt8(this.position++,bytes.b[i]);
		}
	}
	,readInt: function() {
		var $int = this.data.getInt32(this.position,this.littleEndian);
		this.position += 4;
		return $int;
	}
	,readShort: function() {
		var $short = this.data.getInt16(this.position,this.littleEndian);
		this.position += 2;
		return $short;
	}
	,readUnsignedByte: function() {
		var data = this.data;
		return data.getUint8(this.position++);
	}
	,readUnsignedInt: function() {
		var uInt = this.data.getUint32(this.position,this.littleEndian);
		this.position += 4;
		return uInt;
	}
	,readUnsignedShort: function() {
		var uShort = this.data.getUint16(this.position,this.littleEndian);
		this.position += 2;
		return uShort;
	}
	,readUTF: function() {
		var bytesCount = this.readUnsignedShort();
		return this.readUTFBytes(bytesCount);
	}
	,readUTFBytes: function(len) {
		var value = "";
		var max = this.position + len;
		while(this.position < max) {
			var data = this.data;
			var c = data.getUint8(this.position++);
			if(c < 128) {
				if(c == 0) break;
				value += String.fromCharCode(c);
			} else if(c < 224) value += String.fromCharCode((c & 63) << 6 | data.getUint8(this.position++) & 127); else if(c < 240) {
				var c2 = data.getUint8(this.position++);
				value += String.fromCharCode((c & 31) << 12 | (c2 & 127) << 6 | data.getUint8(this.position++) & 127);
			} else {
				var c21 = data.getUint8(this.position++);
				var c3 = data.getUint8(this.position++);
				value += String.fromCharCode((c & 15) << 18 | (c21 & 127) << 12 | c3 << 6 & 127 | data.getUint8(this.position++) & 127);
			}
		}
		return value;
	}
	,toString: function() {
		var cachePosition = this.position;
		this.position = 0;
		var value = this.readUTFBytes(this.length);
		this.position = cachePosition;
		return value;
	}
	,uncompress: function() {
		var bytes = haxe.io.Bytes.ofData(this.byteView);
		var buf = format.tools.Inflate.run(bytes).getData();
		this.byteView = new Uint8Array(buf);
		this.data = new DataView(this.byteView.buffer);
		this.set_length(this.allocated = this.byteView.buffer.byteLength);
	}
	,writeBoolean: function(value) {
		this.writeByte(value?1:0);
	}
	,writeByte: function(value) {
		var lengthToEnsure = this.position + 1;
		if(this.length < lengthToEnsure) {
			if(this.allocated < lengthToEnsure) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(lengthToEnsure,this.allocated * 2))); else if(this.allocated > lengthToEnsure) this._snowResizeBuffer(this.allocated = lengthToEnsure);
			this.length = lengthToEnsure;
			lengthToEnsure;
		}
		var data = this.data;
		data.setInt8(this.position,value);
		this.position += 1;
	}
	,writeBytes: function(bytes,offset,length) {
		if(offset < 0 || length < 0) throw "Write error - Out of bounds";
		var lengthToEnsure = this.position + length;
		if(this.length < lengthToEnsure) {
			if(this.allocated < lengthToEnsure) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(lengthToEnsure,this.allocated * 2))); else if(this.allocated > lengthToEnsure) this._snowResizeBuffer(this.allocated = lengthToEnsure);
			this.length = lengthToEnsure;
			lengthToEnsure;
		}
		this.byteView.set(bytes.byteView.subarray(offset,offset + length),this.position);
		this.position += length;
	}
	,writeDouble: function(x) {
		var lengthToEnsure = this.position + 8;
		if(this.length < lengthToEnsure) {
			if(this.allocated < lengthToEnsure) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(lengthToEnsure,this.allocated * 2))); else if(this.allocated > lengthToEnsure) this._snowResizeBuffer(this.allocated = lengthToEnsure);
			this.length = lengthToEnsure;
			lengthToEnsure;
		}
		this.data.setFloat64(this.position,x,this.littleEndian);
		this.position += 8;
	}
	,writeFloat: function(x) {
		var lengthToEnsure = this.position + 4;
		if(this.length < lengthToEnsure) {
			if(this.allocated < lengthToEnsure) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(lengthToEnsure,this.allocated * 2))); else if(this.allocated > lengthToEnsure) this._snowResizeBuffer(this.allocated = lengthToEnsure);
			this.length = lengthToEnsure;
			lengthToEnsure;
		}
		this.data.setFloat32(this.position,x,this.littleEndian);
		this.position += 4;
	}
	,writeInt: function(value) {
		var lengthToEnsure = this.position + 4;
		if(this.length < lengthToEnsure) {
			if(this.allocated < lengthToEnsure) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(lengthToEnsure,this.allocated * 2))); else if(this.allocated > lengthToEnsure) this._snowResizeBuffer(this.allocated = lengthToEnsure);
			this.length = lengthToEnsure;
			lengthToEnsure;
		}
		this.data.setInt32(this.position,value,this.littleEndian);
		this.position += 4;
	}
	,writeShort: function(value) {
		var lengthToEnsure = this.position + 2;
		if(this.length < lengthToEnsure) {
			if(this.allocated < lengthToEnsure) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(lengthToEnsure,this.allocated * 2))); else if(this.allocated > lengthToEnsure) this._snowResizeBuffer(this.allocated = lengthToEnsure);
			this.length = lengthToEnsure;
			lengthToEnsure;
		}
		this.data.setInt16(this.position,value,this.littleEndian);
		this.position += 2;
	}
	,writeUnsignedInt: function(value) {
		var lengthToEnsure = this.position + 4;
		if(this.length < lengthToEnsure) {
			if(this.allocated < lengthToEnsure) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(lengthToEnsure,this.allocated * 2))); else if(this.allocated > lengthToEnsure) this._snowResizeBuffer(this.allocated = lengthToEnsure);
			this.length = lengthToEnsure;
			lengthToEnsure;
		}
		this.data.setUint32(this.position,value,this.littleEndian);
		this.position += 4;
	}
	,writeUnsignedShort: function(value) {
		var lengthToEnsure = this.position + 2;
		if(this.length < lengthToEnsure) {
			if(this.allocated < lengthToEnsure) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(lengthToEnsure,this.allocated * 2))); else if(this.allocated > lengthToEnsure) this._snowResizeBuffer(this.allocated = lengthToEnsure);
			this.length = lengthToEnsure;
			lengthToEnsure;
		}
		this.data.setUint16(this.position,value,this.littleEndian);
		this.position += 2;
	}
	,writeUTF: function(value) {
		this.writeUnsignedShort(this._getUTFBytesCount(value));
		this.writeUTFBytes(value);
	}
	,writeUTFBytes: function(value) {
		var _g1 = 0;
		var _g = value.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = value.charCodeAt(i);
			if(c <= 127) this.writeByte(c); else if(c <= 2047) {
				this.writeByte(192 | c >> 6);
				this.writeByte(128 | c & 63);
			} else if(c <= 65535) {
				this.writeByte(224 | c >> 12);
				this.writeByte(128 | c >> 6 & 63);
				this.writeByte(128 | c & 63);
			} else {
				this.writeByte(240 | c >> 18);
				this.writeByte(128 | c >> 12 & 63);
				this.writeByte(128 | c >> 6 & 63);
				this.writeByte(128 | c & 63);
			}
		}
	}
	,get_bytesAvailable: function() {
		return this.length - this.position;
	}
	,get_endian: function() {
		if(this.littleEndian) return "littleEndian"; else return "bigEndian";
	}
	,set_endian: function(endian) {
		this.littleEndian = endian == "littleEndian";
		return endian;
	}
	,set_length: function(value) {
		if(this.allocated < value) this._snowResizeBuffer(this.allocated = Std["int"](Math.max(value,this.allocated * 2))); else if(this.allocated > value) this._snowResizeBuffer(this.allocated = value);
		this.length = value;
		return value;
	}
	,__class__: snow.platform.web.utils.ByteArray
	,__properties__: {set_length:"set_length",set_endian:"set_endian",get_endian:"get_endian",get_bytesAvailable:"get_bytesAvailable"}
};
snow.window = {};
snow.window.WindowSystemBinding = function() { };
snow.window.WindowSystemBinding.__name__ = true;
snow.window.WindowSystemBinding.__interfaces__ = [snow.utils.AbstractClass];
snow.window.WindowSystemBinding.prototype = {
	manager: null
	,lib: null
	,init: function() {
		throw "abstract method, must override";
	}
	,process: function() {
		throw "abstract method, must override";
	}
	,destroy: function() {
		throw "abstract method, must override";
	}
	,listen: function(window) {
		throw "abstract method, must override";
	}
	,unlisten: function(window) {
		throw "abstract method, must override";
	}
	,create: function(config,on_created) {
		throw "abstract method, must override";
	}
	,close: function(window) {
		throw "abstract method, must override";
	}
	,show: function(window) {
		throw "abstract method, must override";
	}
	,destroy_window: function(window) {
		throw "abstract method, must override";
	}
	,update: function(window) {
		throw "abstract method, must override";
	}
	,render: function(window) {
		throw "abstract method, must override";
	}
	,swap: function(window) {
		throw "abstract method, must override";
	}
	,simple_message: function(window,message,title) {
		if(title == null) title = "";
		throw "abstract method, must override";
	}
	,set_size: function(window,w,h) {
		throw "abstract method, must override";
	}
	,set_position: function(window,x,y) {
		throw "abstract method, must override";
	}
	,set_title: function(window,title) {
		throw "abstract method, must override";
	}
	,set_max_size: function(window,w,h) {
		throw "abstract method, must override";
	}
	,set_min_size: function(window,w,h) {
		throw "abstract method, must override";
	}
	,fullscreen: function(window,fullscreen) {
		throw "abstract method, must override";
	}
	,bordered: function(window,bordered) {
		throw "abstract method, must override";
	}
	,grab: function(window,grabbed) {
		throw "abstract method, must override";
	}
	,set_cursor_position: function(window,x,y) {
		throw "abstract method, must override";
	}
	,system_enable_cursor: function(enable) {
		throw "abstract method, must override";
	}
	,system_lock_cursor: function(enable) {
		throw "abstract method, must override";
	}
	,system_enable_vsync: function(enable) {
		throw "abstract method, must override";
	}
	,display_count: function() {
		throw "abstract method, must override";
	}
	,display_mode_count: function(display) {
		throw "abstract method, must override";
	}
	,display_native_mode: function(display) {
		throw "abstract method, must override";
	}
	,display_current_mode: function(display) {
		throw "abstract method, must override";
	}
	,display_mode: function(display,mode_index) {
		throw "abstract method, must override";
	}
	,display_bounds: function(display) {
		throw "abstract method, must override";
	}
	,display_name: function(display) {
		throw "abstract method, must override";
	}
	,__class__: snow.window.WindowSystemBinding
};
snow.platform.web.window = {};
snow.platform.web.window.WindowSystem = function(_manager,_lib) {
	this._cursor_visible = true;
	this._pre_fs_height = 0;
	this._pre_fs_width = 0;
	this._pre_fs_s_height = "";
	this._pre_fs_s_width = "";
	this._pre_fs_margin = "0";
	this._pre_fs_padding = "0";
	this.seq_window = 1;
	this.manager = _manager;
	this.lib = _lib;
	this.gl_contexts = new haxe.ds.IntMap();
};
snow.platform.web.window.WindowSystem.__name__ = true;
snow.platform.web.window.WindowSystem.__super__ = snow.window.WindowSystemBinding;
snow.platform.web.window.WindowSystem.prototype = $extend(snow.window.WindowSystemBinding.prototype,{
	gl_contexts: null
	,seq_window: null
	,init: function() {
	}
	,process: function() {
	}
	,destroy: function() {
	}
	,create: function(config,on_created) {
		var _window_id = this.seq_window;
		var _handle;
		var _this = window.document;
		_handle = _this.createElement("canvas");
		_handle.width = config.width;
		_handle.height = config.height;
		_handle.style.display = "block";
		_handle.style.position = "relative";
		_handle.style.margin = "2em auto 0 auto";
		_handle.style.background = "#000";
		window.document.body.appendChild(_handle);
		var _gl_context = js.html._CanvasElement.CanvasUtil.getContextWebGL(_handle,{ alpha : false, premultipliedAlpha : false});
		if(_gl_context == null) {
			var msg = "WebGL is required to run this!<br/><br/>";
			msg += "visit http://get.webgl.org/ for help <br/>";
			msg += "and contact the developer of the application";
			this.internal_fallback(msg);
			throw msg;
		}
		if(snow.platform.web.render.opengl.GL.current_context == null) snow.platform.web.render.opengl.GL.current_context = _gl_context;
		this.gl_contexts.set(_window_id,_gl_context);
		var _window_pos = this.get_real_window_position(_handle);
		config.x = _window_pos.x;
		config.y = _window_pos.y;
		if(config.title != null && config.title != "") window.document.title = config.title;
		if(config.fullscreen) this.internal_fullscreen(_handle,config.fullscreen);
		on_created(_handle,_window_id,config);
		_handle.setAttribute("id","window" + _window_id);
		this.seq_window++;
	}
	,destroy_window: function(_window) {
		window.document.body.removeChild(_window.handle);
	}
	,close: function(_window) {
		_window.handle.style.display = "none";
	}
	,show: function(_window) {
		_window.handle.style.display = null;
	}
	,update: function(_window) {
		var _rect = _window.handle.getBoundingClientRect();
		if(_rect.left != _window.x || _rect.top != _window.y) this.lib.dispatch_system_event({ type : 5, window : { type : 5, timestamp : snow.Snow.core.timestamp(), window_id : _window.id, event : { x : _rect.left, y : _rect.top}}}); else if(_rect.width != _window.width || _rect.height != _window.height) this.lib.dispatch_system_event({ type : 5, window : { type : 7, timestamp : snow.Snow.core.timestamp(), window_id : _window.id, event : { x : _rect.width, y : _rect.height}}});
		_rect = null;
	}
	,render: function(_window) {
		var _window_gl_context = this.gl_contexts.get(_window.id);
		if(snow.platform.web.render.opengl.GL.current_context != _window_gl_context) snow.platform.web.render.opengl.GL.current_context = _window_gl_context;
	}
	,swap: function(_window) {
	}
	,simple_message: function(_window,message,title) {
		if(title == null) title = "";
		window.alert(message);
	}
	,set_size: function(_window,w,h) {
		_window.handle.style.width = "" + w + "px";
		_window.handle.style.height = "" + h + "px";
	}
	,set_position: function(_window,x,y) {
		_window.handle.style.left = "" + x + "px";
		_window.handle.style.top = "" + y + "px";
	}
	,get_real_window_position: function(handle) {
		var curleft = 0;
		var curtop = 0;
		var _obj = handle;
		var _has_parent = true;
		var _max_count = 0;
		while(_has_parent == true) {
			_max_count++;
			if(_max_count > 100) {
				_has_parent = false;
				break;
			}
			if(_obj.offsetParent != null) {
				curleft += _obj.offsetLeft;
				curtop += _obj.offsetTop;
				_obj = _obj.offsetParent;
			} else _has_parent = false;
		}
		return { x : curleft, y : curtop};
	}
	,set_title: function(_window,title) {
		window.document.title = title;
	}
	,set_max_size: function(_window,w,h) {
		_window.handle.style.maxWidth = "" + w + "px";
		_window.handle.style.maxHeight = "" + h + "px";
	}
	,set_min_size: function(_window,w,h) {
		_window.handle.style.minWidth = "" + w + "px";
		_window.handle.style.minHeight = "" + h + "px";
	}
	,_pre_fs_padding: null
	,_pre_fs_margin: null
	,_pre_fs_s_width: null
	,_pre_fs_s_height: null
	,_pre_fs_width: null
	,_pre_fs_height: null
	,internal_fullscreen: function(_handle,fullscreen) {
		var true_fullscreen = this.lib.config.web.true_fullscreen;
		if(fullscreen) {
			if(true_fullscreen) {
				if($bind(_handle,_handle.requestFullscreen) == null) {
					if($bind(_handle,_handle.requestFullScreen) == null) {
						if(_handle.webkitRequestFullscreen == null) {
							if(_handle.mozRequestFullScreen == null) {
							} else _handle.mozRequestFullScreen();
						} else _handle.webkitRequestFullscreen();
					} else _handle.requestFullScreen(0);
				} else _handle.requestFullscreen();
			} else {
				this._pre_fs_padding = _handle.style.padding;
				this._pre_fs_margin = _handle.style.margin;
				this._pre_fs_s_width = _handle.style.width;
				this._pre_fs_s_height = _handle.style.height;
				this._pre_fs_width = _handle.width;
				this._pre_fs_height = _handle.height;
				_handle.style.margin = "0";
				_handle.style.padding = "0";
				_handle.style.width = window.innerWidth + "px";
				_handle.style.height = window.innerHeight + "px";
				_handle.width = window.innerWidth;
				_handle.height = window.innerHeight;
			}
		} else if(!true_fullscreen) {
		} else {
			_handle.style.padding = this._pre_fs_padding;
			_handle.style.margin = this._pre_fs_margin;
			_handle.style.width = this._pre_fs_s_width;
			_handle.style.height = this._pre_fs_s_height;
			_handle.width = this._pre_fs_width;
			_handle.height = this._pre_fs_height;
		}
	}
	,fullscreen: function(_window,fullscreen) {
		this.internal_fullscreen(_window.handle,fullscreen);
	}
	,bordered: function(_window,bordered) {
	}
	,grab: function(_window,grabbed) {
		if(grabbed) {
			if(($_=_window.handle,$bind($_,$_.requestPointerLock)) == null) {
				if(_window.handle.webkitRequestPointerLock == null) {
					if(_window.handle.mozRequestPointerLock == null) {
					} else _window.handle.mozRequestPointerLock();
				} else _window.handle.webkitRequestPointerLock();
			} else _window.handle.requestPointerLock();
		} else {
		}
	}
	,set_cursor_position: function(_window,x,y) {
	}
	,cursor_style: null
	,_cursor_visible: null
	,system_enable_cursor: function(enable) {
		if(this.cursor_style == null) {
			var _this = window.document;
			this.cursor_style = _this.createElement("style");
			this.cursor_style.innerHTML = "* { cursor:none; }";
		}
		if(enable && !this._cursor_visible) {
			this._cursor_visible = true;
			window.document.body.removeChild(this.cursor_style);
		} else if(!enable && this._cursor_visible) {
			this._cursor_visible = false;
			window.document.body.appendChild(this.cursor_style);
		}
	}
	,system_lock_cursor: function(enable) {
		if(this.lib.window != null) this.grab(this.lib.window,enable);
	}
	,system_enable_vsync: function(enable) {
		return -1;
	}
	,display_count: function() {
		return 1;
	}
	,display_mode_count: function(display) {
		return 1;
	}
	,display_native_mode: function(display) {
		return { format : 0, refresh_rate : 0, width : window.screen.width, height : window.screen.height};
	}
	,display_current_mode: function(display) {
		return this.display_native_mode(display);
	}
	,display_mode: function(display,mode_index) {
		return this.display_native_mode(display);
	}
	,display_bounds: function(display) {
		return { x : 0, y : 0, width : window.innerWidth, height : window.innerHeight};
	}
	,display_name: function(display) {
		return window.navigator.vendor;
	}
	,listen: function(_window) {
		_window.handle.addEventListener("mouseleave",$bind(this,this.on_internal_leave));
		_window.handle.addEventListener("mouseenter",$bind(this,this.on_internal_enter));
	}
	,unlisten: function(_window) {
		_window.handle.removeEventListener("mouseleave",$bind(this,this.on_internal_leave));
		_window.handle.removeEventListener("mouseenter",$bind(this,this.on_internal_enter));
	}
	,on_internal_leave: function(_mouse_event) {
		var _window = this.lib.windowing.window_from_handle(_mouse_event.target);
		this.lib.dispatch_system_event({ type : 5, window : { type : 12, timestamp : _mouse_event.timeStamp, window_id : _window.id, event : _mouse_event}});
	}
	,on_internal_enter: function(_mouse_event) {
		var _window = this.lib.windowing.window_from_handle(_mouse_event.target);
		this.lib.dispatch_system_event({ type : 5, window : { type : 11, timestamp : _mouse_event.timeStamp, window_id : _window.id, event : _mouse_event}});
	}
	,internal_fallback: function(message) {
		var text_el;
		var overlay_el;
		var _this = window.document;
		text_el = _this.createElement("div");
		var _this1 = window.document;
		overlay_el = _this1.createElement("div");
		text_el.style.marginLeft = "auto";
		text_el.style.marginRight = "auto";
		text_el.style.color = "#d3d3d3";
		text_el.style.marginTop = "5em";
		text_el.style.fontSize = "1.4em";
		text_el.style.fontFamily = "helvetica,sans-serif";
		text_el.innerHTML = message;
		overlay_el.style.top = "0";
		overlay_el.style.left = "0";
		overlay_el.style.width = "100%";
		overlay_el.style.height = "100%";
		overlay_el.style.display = "block";
		overlay_el.style.minWidth = "100%";
		overlay_el.style.minHeight = "100%";
		overlay_el.style.textAlign = "center";
		overlay_el.style.position = "absolute";
		overlay_el.style.background = "rgba(1,1,1,0.90)";
		overlay_el.appendChild(text_el);
		window.document.body.appendChild(overlay_el);
	}
	,__class__: snow.platform.web.window.WindowSystem
});
snow.types = {};
snow.types._Types = {};
snow.types._Types.AssetType_Impl_ = function() { };
snow.types._Types.AssetType_Impl_.__name__ = true;
snow.types._Types.AudioFormatType_Impl_ = function() { };
snow.types._Types.AudioFormatType_Impl_.__name__ = true;
snow.types._Types.TextEventType_Impl_ = function() { };
snow.types._Types.TextEventType_Impl_.__name__ = true;
snow.types._Types.GamepadDeviceEventType_Impl_ = function() { };
snow.types._Types.GamepadDeviceEventType_Impl_.__name__ = true;
snow.types._Types.SystemEventType_Impl_ = function() { };
snow.types._Types.SystemEventType_Impl_.__name__ = true;
snow.types._Types.WindowEventType_Impl_ = function() { };
snow.types._Types.WindowEventType_Impl_.__name__ = true;
snow.types._Types.InputEventType_Impl_ = function() { };
snow.types._Types.InputEventType_Impl_.__name__ = true;
snow.types._Types.FileEventType_Impl_ = function() { };
snow.types._Types.FileEventType_Impl_.__name__ = true;
snow.utils.AbstractClassBuilder = function() { };
snow.utils.AbstractClassBuilder.__name__ = true;
snow.utils.IMemoryRange = function() { };
snow.utils.IMemoryRange.__name__ = true;
snow.utils.IMemoryRange.prototype = {
	getByteBuffer: null
	,getStart: null
	,getLength: null
	,__class__: snow.utils.IMemoryRange
};
snow.utils.Libs = function() { };
snow.utils.Libs.__name__ = true;
snow.utils.Libs.tryLoad = function(name,library,func,args) {
	return null;
};
snow.utils.Libs.findHaxeLib = function(library) {
	try {
	} catch( e ) {
	}
	return "";
};
snow.utils.Libs.get_system_name = function() {
	return window.navigator.userAgent;
	return "unknown";
};
snow.utils.Libs.web_add_lib = function(library,root) {
	if(snow.utils.Libs._web_libs == null) snow.utils.Libs._web_libs = new haxe.ds.StringMap();
	var value = root;
	snow.utils.Libs._web_libs.set(library,value);
	return true;
};
snow.utils.Libs.web_lib_load = function(library,method) {
	if(snow.utils.Libs._web_libs == null) snow.utils.Libs._web_libs = new haxe.ds.StringMap();
	var _root = snow.utils.Libs._web_libs.get(library);
	if(_root != null) return Reflect.field(_root,method);
	return null;
};
snow.utils.Libs.load = function(library,method,args) {
	if(args == null) args = 0;
	var found_in_web_libs = snow.utils.Libs.web_lib_load(library,method);
	if(found_in_web_libs) return found_in_web_libs;
	if(snow.utils.Libs.__moduleNames == null) snow.utils.Libs.__moduleNames = new haxe.ds.StringMap();
	if(snow.utils.Libs.__moduleNames.exists(library)) {
	}
	snow.utils.Libs.__moduleNames.set(library,library);
	var result = snow.utils.Libs.tryLoad("./" + library,library,method,args);
	if(result == null) result = snow.utils.Libs.tryLoad(".\\" + library,library,method,args);
	if(result == null) result = snow.utils.Libs.tryLoad(library,library,method,args);
	if(result == null) {
		var slash;
		if(((function($this) {
			var $r;
			var _this = snow.utils.Libs.get_system_name();
			$r = HxOverrides.substr(_this,7,null);
			return $r;
		}(this))).toLowerCase() == "windows") slash = "\\"; else slash = "/";
		var haxelib = snow.utils.Libs.findHaxeLib("snow");
		if(haxelib != "") {
			result = snow.utils.Libs.tryLoad(haxelib + slash + "ndll" + slash + snow.utils.Libs.get_system_name() + slash + library,library,method,args);
			if(result == null) result = snow.utils.Libs.tryLoad(haxelib + slash + "ndll" + slash + snow.utils.Libs.get_system_name() + "64" + slash + library,library,method,args);
		}
	}
	snow.utils.Libs.loaderTrace("Result : " + Std.string(result));
	return result;
};
snow.utils.Libs.loaderTrace = function(message) {
};
snow.utils.Timer = function(_time) {
	this.time = _time;
	snow.utils.Timer.running_timers.push(this);
	this.fire_at = snow.utils.Timer.stamp() + this.time;
	this.running = true;
};
snow.utils.Timer.__name__ = true;
snow.utils.Timer.measure = function(f,pos) {
	var t0 = snow.utils.Timer.stamp();
	var r = f();
	haxe.Log.trace(snow.utils.Timer.stamp() - t0 + "s",pos);
	return r;
};
snow.utils.Timer.update = function() {
	var now = snow.utils.Timer.stamp();
	var _g = 0;
	var _g1 = snow.utils.Timer.running_timers;
	while(_g < _g1.length) {
		var timer = _g1[_g];
		++_g;
		if(timer.running) {
			if(timer.fire_at < now) {
				timer.fire_at += timer.time;
				timer.run();
			}
		}
	}
};
snow.utils.Timer.delay = function(_time,_f) {
	var t = new snow.utils.Timer(_time);
	t.run = function() {
		t.stop();
		_f();
	};
	return t;
};
snow.utils.Timer.stamp = function() {
	return snow.Snow.core.timestamp();
};
snow.utils.Timer.prototype = {
	time: null
	,fire_at: null
	,running: null
	,run: function() {
	}
	,stop: function() {
		if(this.running) {
			this.running = false;
			HxOverrides.remove(snow.utils.Timer.running_timers,this);
		}
	}
	,__class__: snow.utils.Timer
};
snow.utils.format = {};
snow.utils.format.png = {};
snow.utils.format.png.Color = { __ename__ : true, __constructs__ : ["ColGrey","ColTrue","ColIndexed"] };
snow.utils.format.png.Color.ColGrey = function(alpha) { var $x = ["ColGrey",0,alpha]; $x.__enum__ = snow.utils.format.png.Color; $x.toString = $estr; return $x; };
snow.utils.format.png.Color.ColTrue = function(alpha) { var $x = ["ColTrue",1,alpha]; $x.__enum__ = snow.utils.format.png.Color; $x.toString = $estr; return $x; };
snow.utils.format.png.Color.ColIndexed = ["ColIndexed",2];
snow.utils.format.png.Color.ColIndexed.toString = $estr;
snow.utils.format.png.Color.ColIndexed.__enum__ = snow.utils.format.png.Color;
snow.utils.format.png.Chunk = { __ename__ : true, __constructs__ : ["CEnd","CHeader","CData","CPalette","CUnknown"] };
snow.utils.format.png.Chunk.CEnd = ["CEnd",0];
snow.utils.format.png.Chunk.CEnd.toString = $estr;
snow.utils.format.png.Chunk.CEnd.__enum__ = snow.utils.format.png.Chunk;
snow.utils.format.png.Chunk.CHeader = function(h) { var $x = ["CHeader",1,h]; $x.__enum__ = snow.utils.format.png.Chunk; $x.toString = $estr; return $x; };
snow.utils.format.png.Chunk.CData = function(b) { var $x = ["CData",2,b]; $x.__enum__ = snow.utils.format.png.Chunk; $x.toString = $estr; return $x; };
snow.utils.format.png.Chunk.CPalette = function(b) { var $x = ["CPalette",3,b]; $x.__enum__ = snow.utils.format.png.Chunk; $x.toString = $estr; return $x; };
snow.utils.format.png.Chunk.CUnknown = function(id,data) { var $x = ["CUnknown",4,id,data]; $x.__enum__ = snow.utils.format.png.Chunk; $x.toString = $estr; return $x; };
snow.utils.format.png.Reader = function(i) {
	this.i = i;
	i.set_bigEndian(true);
	this.checkCRC = true;
};
snow.utils.format.png.Reader.__name__ = true;
snow.utils.format.png.Reader.prototype = {
	i: null
	,checkCRC: null
	,read: function() {
		var _g = 0;
		var _g1 = [137,80,78,71,13,10,26,10];
		while(_g < _g1.length) {
			var b = _g1[_g];
			++_g;
			if(this.i.readByte() != b) throw "Invalid header";
		}
		var l = new List();
		while(true) {
			var c = this.readChunk();
			l.add(c);
			if(c == snow.utils.format.png.Chunk.CEnd) break;
		}
		return l;
	}
	,readHeader: function(i) {
		i.set_bigEndian(true);
		var width = i.readInt32();
		var height = i.readInt32();
		var colbits = i.readByte();
		var color = i.readByte();
		var color1;
		switch(color) {
		case 0:
			color1 = snow.utils.format.png.Color.ColGrey(false);
			break;
		case 2:
			color1 = snow.utils.format.png.Color.ColTrue(false);
			break;
		case 3:
			color1 = snow.utils.format.png.Color.ColIndexed;
			break;
		case 4:
			color1 = snow.utils.format.png.Color.ColGrey(true);
			break;
		case 6:
			color1 = snow.utils.format.png.Color.ColTrue(true);
			break;
		default:
			throw "Unknown color model " + color + ":" + colbits;
		}
		var compress = i.readByte();
		var filter = i.readByte();
		if(compress != 0 || filter != 0) throw "Invalid header";
		var interlace = i.readByte();
		if(interlace != 0 && interlace != 1) throw "Invalid header";
		return { width : width, height : height, colbits : colbits, color : color1, interlaced : interlace == 1};
	}
	,readChunk: function() {
		var dataLen = this.i.readInt32();
		var id = this.i.readString(4);
		var data = this.i.read(dataLen);
		var crc = this.i.readInt32();
		if(this.checkCRC) {
			var c = new haxe.crypto.Crc32();
			var _g = 0;
			while(_g < 4) {
				var i = _g++;
				c["byte"](HxOverrides.cca(id,i));
			}
			c.update(data,0,data.length);
			if(c.get() != crc) throw "CRC check failure";
		}
		switch(id) {
		case "IEND":
			return snow.utils.format.png.Chunk.CEnd;
		case "IHDR":
			return snow.utils.format.png.Chunk.CHeader(this.readHeader(new haxe.io.BytesInput(data)));
		case "IDAT":
			return snow.utils.format.png.Chunk.CData(data);
		case "PLTE":
			return snow.utils.format.png.Chunk.CPalette(data);
		default:
			return snow.utils.format.png.Chunk.CUnknown(id,data);
		}
	}
	,__class__: snow.utils.format.png.Reader
};
snow.utils.format.png.Tools = function() { };
snow.utils.format.png.Tools.__name__ = true;
snow.utils.format.png.Tools.getHeader = function(d) {
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 1:
			var h = c[2];
			return h;
		default:
		}
	}
	throw "Header not found";
};
snow.utils.format.png.Tools.getPalette = function(d) {
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 3:
			var b = c[2];
			return b;
		default:
		}
	}
	return null;
};
snow.utils.format.png.Tools.filter = function(data,x,y,stride,prev,p,numChannels) {
	if(numChannels == null) numChannels = 4;
	var b;
	if(y == 0) b = 0; else b = data.b[p - stride];
	var c;
	if(x == 0 || y == 0) c = 0; else c = data.b[p - stride - numChannels];
	var k = prev + b - c;
	var pa = k - prev;
	if(pa < 0) pa = -pa;
	var pb = k - b;
	if(pb < 0) pb = -pb;
	var pc = k - c;
	if(pc < 0) pc = -pc;
	if(pa <= pb && pa <= pc) return prev; else if(pb <= pc) return b; else return c;
};
snow.utils.format.png.Tools.reverseBytes = function(b) {
	var p = 0;
	var _g1 = 0;
	var _g = b.length >> 2;
	while(_g1 < _g) {
		var i = _g1++;
		var b1 = b.b[p];
		var g = b.b[p + 1];
		var r = b.b[p + 2];
		var a = b.b[p + 3];
		var p1 = p++;
		b.b[p1] = a & 255;
		var p2 = p++;
		b.b[p2] = r & 255;
		var p3 = p++;
		b.b[p3] = g & 255;
		var p4 = p++;
		b.b[p4] = b1 & 255;
	}
};
snow.utils.format.png.Tools.extractGrey = function(d) {
	var h = snow.utils.format.png.Tools.getHeader(d);
	var grey = haxe.io.Bytes.alloc(h.width * h.height);
	var data = null;
	var fullData = null;
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 2:
			var b = c[2];
			if(fullData != null) fullData.add(b); else if(data == null) data = b; else {
				fullData = new haxe.io.BytesBuffer();
				fullData.add(data);
				fullData.add(b);
				data = null;
			}
			break;
		default:
		}
	}
	if(fullData != null) data = fullData.getBytes();
	if(data == null) throw "Data not found";
	data = snow.utils.format.tools.Inflate.run(data);
	var r = 0;
	var w = 0;
	{
		var _g = h.color;
		switch(_g[1]) {
		case 0:
			var alpha = _g[2];
			if(h.colbits != 8) throw "Unsupported color mode";
			var width = h.width;
			var stride;
			stride = (alpha?2:1) * width + 1;
			if(data.length < h.height * stride) throw "Not enough data";
			var rinc;
			if(alpha) rinc = 2; else rinc = 1;
			var _g2 = 0;
			var _g1 = h.height;
			while(_g2 < _g1) {
				var y = _g2++;
				var f = data.get(r++);
				switch(f) {
				case 0:
					var _g3 = 0;
					while(_g3 < width) {
						var x = _g3++;
						var v = data.b[r];
						r += rinc;
						grey.set(w++,v);
					}
					break;
				case 1:
					var cv = 0;
					var _g31 = 0;
					while(_g31 < width) {
						var x1 = _g31++;
						cv += data.b[r];
						r += rinc;
						grey.set(w++,cv);
					}
					break;
				case 2:
					var stride1;
					if(y == 0) stride1 = 0; else stride1 = width;
					var _g32 = 0;
					while(_g32 < width) {
						var x2 = _g32++;
						var v1 = data.b[r] + grey.b[w - stride1];
						r += rinc;
						grey.set(w++,v1);
					}
					break;
				case 3:
					var cv1 = 0;
					var stride2;
					if(y == 0) stride2 = 0; else stride2 = width;
					var _g33 = 0;
					while(_g33 < width) {
						var x3 = _g33++;
						cv1 = data.b[r] + (cv1 + grey.b[w - stride2] >> 1) & 255;
						r += rinc;
						grey.set(w++,cv1);
					}
					break;
				case 4:
					var stride3 = width;
					var cv2 = 0;
					var _g34 = 0;
					while(_g34 < width) {
						var x4 = _g34++;
						cv2 = snow.utils.format.png.Tools.filter(grey,x4,y,stride3,cv2,w,1) + data.b[r] & 255;
						r += rinc;
						grey.set(w++,cv2);
					}
					break;
				default:
					throw "Invalid filter " + f;
				}
			}
			break;
		default:
			throw "Unsupported color mode";
		}
	}
	return grey;
};
snow.utils.format.png.Tools.extract32 = function(d,bytes) {
	var h = snow.utils.format.png.Tools.getHeader(d);
	var bgra;
	if(bytes == null) bgra = haxe.io.Bytes.alloc(h.width * h.height * 4); else bgra = bytes;
	var data = null;
	var fullData = null;
	var $it0 = d.iterator();
	while( $it0.hasNext() ) {
		var c = $it0.next();
		switch(c[1]) {
		case 2:
			var b = c[2];
			if(fullData != null) fullData.add(b); else if(data == null) data = b; else {
				fullData = new haxe.io.BytesBuffer();
				fullData.add(data);
				fullData.add(b);
				data = null;
			}
			break;
		default:
		}
	}
	if(fullData != null) data = fullData.getBytes();
	if(data == null) throw "Data not found";
	data = snow.utils.format.tools.Inflate.run(data);
	var r = 0;
	var w = 0;
	{
		var _g = h.color;
		switch(_g[1]) {
		case 2:
			var pal = snow.utils.format.png.Tools.getPalette(d);
			if(pal == null) throw "PNG Palette is missing";
			var alpha = null;
			try {
				var $it1 = d.iterator();
				while( $it1.hasNext() ) {
					var t = $it1.next();
					switch(t[1]) {
					case 4:
						switch(t[2]) {
						case "tRNS":
							var data1 = t[3];
							alpha = data1;
							throw "__break__";
							break;
						default:
						}
						break;
					default:
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			var width = h.width;
			var stride = width + 1;
			if(data.length < h.height * stride) throw "Not enough data";
			var vr;
			var vg;
			var vb;
			var va = 255;
			var _g2 = 0;
			var _g1 = h.height;
			while(_g2 < _g1) {
				var y = _g2++;
				var f = data.get(r++);
				switch(f) {
				case 0:
					var _g3 = 0;
					while(_g3 < width) {
						var x = _g3++;
						var c1 = data.get(r++);
						vr = pal.b[c1 * 3];
						vg = pal.b[c1 * 3 + 1];
						vb = pal.b[c1 * 3 + 2];
						if(alpha != null) va = alpha.b[c1];
						bgra.set(w++,vb);
						bgra.set(w++,vg);
						bgra.set(w++,vr);
						bgra.set(w++,va);
					}
					break;
				case 1:
					var cr = 0;
					var cg = 0;
					var cb = 0;
					var ca = 0;
					var _g31 = 0;
					while(_g31 < width) {
						var x1 = _g31++;
						var c2 = data.get(r++);
						vr = pal.b[c2 * 3];
						vg = pal.b[c2 * 3 + 1];
						vb = pal.b[c2 * 3 + 2];
						if(alpha != null) va = alpha.b[c2];
						cb += vb;
						bgra.set(w++,cb);
						cg += vg;
						bgra.set(w++,cg);
						cr += vr;
						bgra.set(w++,cr);
						ca += va;
						bgra.set(w++,ca);
						bgra.set(w++,va);
					}
					break;
				case 2:
					var stride1;
					if(y == 0) stride1 = 0; else stride1 = width * 4;
					var _g32 = 0;
					while(_g32 < width) {
						var x2 = _g32++;
						var c3 = data.get(r++);
						vr = pal.b[c3 * 3];
						vg = pal.b[c3 * 3 + 1];
						vb = pal.b[c3 * 3 + 2];
						if(alpha != null) va = alpha.b[c3];
						bgra.b[w] = vb + bgra.b[w - stride1] & 255;
						w++;
						bgra.b[w] = vg + bgra.b[w - stride1] & 255;
						w++;
						bgra.b[w] = vr + bgra.b[w - stride1] & 255;
						w++;
						bgra.b[w] = va + bgra.b[w - stride1] & 255;
						w++;
					}
					break;
				case 3:
					var cr1 = 0;
					var cg1 = 0;
					var cb1 = 0;
					var ca1 = 0;
					var stride2;
					if(y == 0) stride2 = 0; else stride2 = width * 4;
					var _g33 = 0;
					while(_g33 < width) {
						var x3 = _g33++;
						var c4 = data.get(r++);
						vr = pal.b[c4 * 3];
						vg = pal.b[c4 * 3 + 1];
						vb = pal.b[c4 * 3 + 2];
						if(alpha != null) va = alpha.b[c4];
						cb1 = vb + (cb1 + bgra.b[w - stride2] >> 1) & 255;
						bgra.set(w++,cb1);
						cg1 = vg + (cg1 + bgra.b[w - stride2] >> 1) & 255;
						bgra.set(w++,cg1);
						cr1 = vr + (cr1 + bgra.b[w - stride2] >> 1) & 255;
						bgra.set(w++,cr1);
						cr1 = va + (ca1 + bgra.b[w - stride2] >> 1) & 255;
						bgra.set(w++,ca1);
					}
					break;
				case 4:
					var stride3 = width * 4;
					var cr2 = 0;
					var cg2 = 0;
					var cb2 = 0;
					var ca2 = 0;
					var _g34 = 0;
					while(_g34 < width) {
						var x4 = _g34++;
						var c5 = data.get(r++);
						vr = pal.b[c5 * 3];
						vg = pal.b[c5 * 3 + 1];
						vb = pal.b[c5 * 3 + 2];
						if(alpha != null) va = alpha.b[c5];
						cb2 = snow.utils.format.png.Tools.filter(bgra,x4,y,stride3,cb2,w,null) + vb & 255;
						bgra.set(w++,cb2);
						cg2 = snow.utils.format.png.Tools.filter(bgra,x4,y,stride3,cg2,w,null) + vg & 255;
						bgra.set(w++,cg2);
						cr2 = snow.utils.format.png.Tools.filter(bgra,x4,y,stride3,cr2,w,null) + vr & 255;
						bgra.set(w++,cr2);
						ca2 = snow.utils.format.png.Tools.filter(bgra,x4,y,stride3,ca2,w,null) + va & 255;
						bgra.set(w++,ca2);
					}
					break;
				default:
					throw "Invalid filter " + f;
				}
			}
			break;
		case 0:
			var alpha1 = _g[2];
			if(h.colbits != 8) throw "Unsupported color mode";
			var width1 = h.width;
			var stride4;
			stride4 = (alpha1?2:1) * width1 + 1;
			if(data.length < h.height * stride4) throw "Not enough data";
			var _g21 = 0;
			var _g11 = h.height;
			while(_g21 < _g11) {
				var y1 = _g21++;
				var f1 = data.get(r++);
				switch(f1) {
				case 0:
					if(alpha1) {
						var _g35 = 0;
						while(_g35 < width1) {
							var x5 = _g35++;
							var v = data.get(r++);
							bgra.set(w++,v);
							bgra.set(w++,v);
							bgra.set(w++,v);
							bgra.set(w++,data.get(r++));
						}
					} else {
						var _g36 = 0;
						while(_g36 < width1) {
							var x6 = _g36++;
							var v1 = data.get(r++);
							bgra.set(w++,v1);
							bgra.set(w++,v1);
							bgra.set(w++,v1);
							bgra.set(w++,255);
						}
					}
					break;
				case 1:
					var cv = 0;
					var ca3 = 0;
					if(alpha1) {
						var _g37 = 0;
						while(_g37 < width1) {
							var x7 = _g37++;
							cv += data.get(r++);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							ca3 += data.get(r++);
							bgra.set(w++,ca3);
						}
					} else {
						var _g38 = 0;
						while(_g38 < width1) {
							var x8 = _g38++;
							cv += data.get(r++);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,cv);
							bgra.set(w++,255);
						}
					}
					break;
				case 2:
					var stride5;
					if(y1 == 0) stride5 = 0; else stride5 = width1 * 4;
					if(alpha1) {
						var _g39 = 0;
						while(_g39 < width1) {
							var x9 = _g39++;
							var v2 = data.get(r++) + bgra.b[w - stride5];
							bgra.set(w++,v2);
							bgra.set(w++,v2);
							bgra.set(w++,v2);
							bgra.set(w++,data.get(r++) + bgra.b[w - stride5]);
						}
					} else {
						var _g310 = 0;
						while(_g310 < width1) {
							var x10 = _g310++;
							var v3 = data.get(r++) + bgra.b[w - stride5];
							bgra.set(w++,v3);
							bgra.set(w++,v3);
							bgra.set(w++,v3);
							bgra.set(w++,255);
						}
					}
					break;
				case 3:
					var cv1 = 0;
					var ca4 = 0;
					var stride6;
					if(y1 == 0) stride6 = 0; else stride6 = width1 * 4;
					if(alpha1) {
						var _g311 = 0;
						while(_g311 < width1) {
							var x11 = _g311++;
							cv1 = data.get(r++) + (cv1 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							ca4 = data.get(r++) + (ca4 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,ca4);
						}
					} else {
						var _g312 = 0;
						while(_g312 < width1) {
							var x12 = _g312++;
							cv1 = data.get(r++) + (cv1 + bgra.b[w - stride6] >> 1) & 255;
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,cv1);
							bgra.set(w++,255);
						}
					}
					break;
				case 4:
					var stride7 = width1 * 4;
					var cv2 = 0;
					var ca5 = 0;
					if(alpha1) {
						var _g313 = 0;
						while(_g313 < width1) {
							var x13 = _g313++;
							cv2 = snow.utils.format.png.Tools.filter(bgra,x13,y1,stride7,cv2,w,null) + data.get(r++) & 255;
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							ca5 = snow.utils.format.png.Tools.filter(bgra,x13,y1,stride7,ca5,w,null) + data.get(r++) & 255;
							bgra.set(w++,ca5);
						}
					} else {
						var _g314 = 0;
						while(_g314 < width1) {
							var x14 = _g314++;
							cv2 = snow.utils.format.png.Tools.filter(bgra,x14,y1,stride7,cv2,w,null) + data.get(r++) & 255;
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,cv2);
							bgra.set(w++,255);
						}
					}
					break;
				default:
					throw "Invalid filter " + f1;
				}
			}
			break;
		case 1:
			var alpha2 = _g[2];
			if(h.colbits != 8) throw "Unsupported color mode";
			var width2 = h.width;
			var stride8;
			stride8 = (alpha2?4:3) * width2 + 1;
			if(data.length < h.height * stride8) throw "Not enough data";
			var _g22 = 0;
			var _g12 = h.height;
			while(_g22 < _g12) {
				var y2 = _g22++;
				var f2 = data.get(r++);
				switch(f2) {
				case 0:
					if(alpha2) {
						var _g315 = 0;
						while(_g315 < width2) {
							var x15 = _g315++;
							bgra.set(w++,data.b[r + 2]);
							bgra.set(w++,data.b[r + 1]);
							bgra.set(w++,data.b[r]);
							bgra.set(w++,data.b[r + 3]);
							r += 4;
						}
					} else {
						var _g316 = 0;
						while(_g316 < width2) {
							var x16 = _g316++;
							bgra.set(w++,data.b[r + 2]);
							bgra.set(w++,data.b[r + 1]);
							bgra.set(w++,data.b[r]);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 1:
					var cr3 = 0;
					var cg3 = 0;
					var cb3 = 0;
					var ca6 = 0;
					if(alpha2) {
						var _g317 = 0;
						while(_g317 < width2) {
							var x17 = _g317++;
							cb3 += data.b[r + 2];
							bgra.set(w++,cb3);
							cg3 += data.b[r + 1];
							bgra.set(w++,cg3);
							cr3 += data.b[r];
							bgra.set(w++,cr3);
							ca6 += data.b[r + 3];
							bgra.set(w++,ca6);
							r += 4;
						}
					} else {
						var _g318 = 0;
						while(_g318 < width2) {
							var x18 = _g318++;
							cb3 += data.b[r + 2];
							bgra.set(w++,cb3);
							cg3 += data.b[r + 1];
							bgra.set(w++,cg3);
							cr3 += data.b[r];
							bgra.set(w++,cr3);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 2:
					var stride9;
					if(y2 == 0) stride9 = 0; else stride9 = width2 * 4;
					if(alpha2) {
						var _g319 = 0;
						while(_g319 < width2) {
							var x19 = _g319++;
							bgra.b[w] = data.b[r + 2] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 1] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 3] + bgra.b[w - stride9] & 255;
							w++;
							r += 4;
						}
					} else {
						var _g320 = 0;
						while(_g320 < width2) {
							var x20 = _g320++;
							bgra.b[w] = data.b[r + 2] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r + 1] + bgra.b[w - stride9] & 255;
							w++;
							bgra.b[w] = data.b[r] + bgra.b[w - stride9] & 255;
							w++;
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 3:
					var cr4 = 0;
					var cg4 = 0;
					var cb4 = 0;
					var ca7 = 0;
					var stride10;
					if(y2 == 0) stride10 = 0; else stride10 = width2 * 4;
					if(alpha2) {
						var _g321 = 0;
						while(_g321 < width2) {
							var x21 = _g321++;
							cb4 = data.b[r + 2] + (cb4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cb4);
							cg4 = data.b[r + 1] + (cg4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cg4);
							cr4 = data.b[r] + (cr4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cr4);
							ca7 = data.b[r + 3] + (ca7 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,ca7);
							r += 4;
						}
					} else {
						var _g322 = 0;
						while(_g322 < width2) {
							var x22 = _g322++;
							cb4 = data.b[r + 2] + (cb4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cb4);
							cg4 = data.b[r + 1] + (cg4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cg4);
							cr4 = data.b[r] + (cr4 + bgra.b[w - stride10] >> 1) & 255;
							bgra.set(w++,cr4);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				case 4:
					var stride11 = width2 * 4;
					var cr5 = 0;
					var cg5 = 0;
					var cb5 = 0;
					var ca8 = 0;
					if(alpha2) {
						var _g323 = 0;
						while(_g323 < width2) {
							var x23 = _g323++;
							cb5 = snow.utils.format.png.Tools.filter(bgra,x23,y2,stride11,cb5,w,null) + data.b[r + 2] & 255;
							bgra.set(w++,cb5);
							cg5 = snow.utils.format.png.Tools.filter(bgra,x23,y2,stride11,cg5,w,null) + data.b[r + 1] & 255;
							bgra.set(w++,cg5);
							cr5 = snow.utils.format.png.Tools.filter(bgra,x23,y2,stride11,cr5,w,null) + data.b[r] & 255;
							bgra.set(w++,cr5);
							ca8 = snow.utils.format.png.Tools.filter(bgra,x23,y2,stride11,ca8,w,null) + data.b[r + 3] & 255;
							bgra.set(w++,ca8);
							r += 4;
						}
					} else {
						var _g324 = 0;
						while(_g324 < width2) {
							var x24 = _g324++;
							cb5 = snow.utils.format.png.Tools.filter(bgra,x24,y2,stride11,cb5,w,null) + data.b[r + 2] & 255;
							bgra.set(w++,cb5);
							cg5 = snow.utils.format.png.Tools.filter(bgra,x24,y2,stride11,cg5,w,null) + data.b[r + 1] & 255;
							bgra.set(w++,cg5);
							cr5 = snow.utils.format.png.Tools.filter(bgra,x24,y2,stride11,cr5,w,null) + data.b[r] & 255;
							bgra.set(w++,cr5);
							bgra.set(w++,255);
							r += 3;
						}
					}
					break;
				default:
					throw "Invalid filter " + f2;
				}
			}
			break;
		}
	}
	return bgra;
};
snow.utils.format.png.Tools.buildGrey = function(width,height,data) {
	var rgb = haxe.io.Bytes.alloc(width * height + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgb.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgb.set(w++,data.get(r++));
		}
	}
	var l = new List();
	l.add(snow.utils.format.png.Chunk.CHeader({ width : width, height : height, colbits : 8, color : snow.utils.format.png.Color.ColGrey(false), interlaced : false}));
	l.add(snow.utils.format.png.Chunk.CData(snow.utils.format.tools.Deflate.run(rgb)));
	l.add(snow.utils.format.png.Chunk.CEnd);
	return l;
};
snow.utils.format.png.Tools.buildRGB = function(width,height,data) {
	var rgb = haxe.io.Bytes.alloc(width * height * 3 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgb.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgb.set(w++,data.b[r + 2]);
			rgb.set(w++,data.b[r + 1]);
			rgb.set(w++,data.b[r]);
			r += 3;
		}
	}
	var l = new List();
	l.add(snow.utils.format.png.Chunk.CHeader({ width : width, height : height, colbits : 8, color : snow.utils.format.png.Color.ColTrue(false), interlaced : false}));
	l.add(snow.utils.format.png.Chunk.CData(snow.utils.format.tools.Deflate.run(rgb)));
	l.add(snow.utils.format.png.Chunk.CEnd);
	return l;
};
snow.utils.format.png.Tools.build32ARGB = function(width,height,data) {
	var rgba = haxe.io.Bytes.alloc(width * height * 4 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgba.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgba.set(w++,data.b[r + 1]);
			rgba.set(w++,data.b[r + 2]);
			rgba.set(w++,data.b[r + 3]);
			rgba.set(w++,data.b[r]);
			r += 4;
		}
	}
	var l = new List();
	l.add(snow.utils.format.png.Chunk.CHeader({ width : width, height : height, colbits : 8, color : snow.utils.format.png.Color.ColTrue(true), interlaced : false}));
	l.add(snow.utils.format.png.Chunk.CData(snow.utils.format.tools.Deflate.run(rgba)));
	l.add(snow.utils.format.png.Chunk.CEnd);
	return l;
};
snow.utils.format.png.Tools.build32BGRA = function(width,height,data) {
	var rgba = haxe.io.Bytes.alloc(width * height * 4 + height);
	var w = 0;
	var r = 0;
	var _g = 0;
	while(_g < height) {
		var y = _g++;
		rgba.set(w++,0);
		var _g1 = 0;
		while(_g1 < width) {
			var x = _g1++;
			rgba.set(w++,data.b[r + 2]);
			rgba.set(w++,data.b[r + 1]);
			rgba.set(w++,data.b[r]);
			rgba.set(w++,data.b[r + 3]);
			r += 4;
		}
	}
	var l = new List();
	l.add(snow.utils.format.png.Chunk.CHeader({ width : width, height : height, colbits : 8, color : snow.utils.format.png.Color.ColTrue(true), interlaced : false}));
	l.add(snow.utils.format.png.Chunk.CData(snow.utils.format.tools.Deflate.run(rgba)));
	l.add(snow.utils.format.png.Chunk.CEnd);
	return l;
};
snow.utils.format.tools = {};
snow.utils.format.tools.Adler32 = function() {
	this.a1 = 1;
	this.a2 = 0;
};
snow.utils.format.tools.Adler32.__name__ = true;
snow.utils.format.tools.Adler32.read = function(i) {
	var a = new snow.utils.format.tools.Adler32();
	var a2a = i.readByte();
	var a2b = i.readByte();
	var a1a = i.readByte();
	var a1b = i.readByte();
	a.a1 = a1a << 8 | a1b;
	a.a2 = a2a << 8 | a2b;
	return a;
};
snow.utils.format.tools.Adler32.prototype = {
	a1: null
	,a2: null
	,update: function(b,pos,len) {
		var a1 = this.a1;
		var a2 = this.a2;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var p = _g1++;
			var c = b.b[p];
			a1 = (a1 + c) % 65521;
			a2 = (a2 + a1) % 65521;
		}
		this.a1 = a1;
		this.a2 = a2;
	}
	,equals: function(a) {
		return a.a1 == this.a1 && a.a2 == this.a2;
	}
	,__class__: snow.utils.format.tools.Adler32
};
snow.utils.format.tools.Deflate = function() { };
snow.utils.format.tools.Deflate.__name__ = true;
snow.utils.format.tools.Deflate.run = function(b) {
	throw "Deflate is not supported on this platform";
	return null;
};
snow.utils.format.tools.Huffman = { __ename__ : true, __constructs__ : ["Found","NeedBit","NeedBits"] };
snow.utils.format.tools.Huffman.Found = function(i) { var $x = ["Found",0,i]; $x.__enum__ = snow.utils.format.tools.Huffman; $x.toString = $estr; return $x; };
snow.utils.format.tools.Huffman.NeedBit = function(left,right) { var $x = ["NeedBit",1,left,right]; $x.__enum__ = snow.utils.format.tools.Huffman; $x.toString = $estr; return $x; };
snow.utils.format.tools.Huffman.NeedBits = function(n,table) { var $x = ["NeedBits",2,n,table]; $x.__enum__ = snow.utils.format.tools.Huffman; $x.toString = $estr; return $x; };
snow.utils.format.tools.HuffTools = function() {
};
snow.utils.format.tools.HuffTools.__name__ = true;
snow.utils.format.tools.HuffTools.prototype = {
	treeDepth: function(t) {
		switch(t[1]) {
		case 0:
			return 0;
		case 2:
			throw "assert";
			break;
		case 1:
			var b = t[3];
			var a = t[2];
			var da = this.treeDepth(a);
			var db = this.treeDepth(b);
			return 1 + (da < db?da:db);
		}
	}
	,treeCompress: function(t) {
		var d = this.treeDepth(t);
		if(d == 0) return t;
		if(d == 1) switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			return snow.utils.format.tools.Huffman.NeedBit(this.treeCompress(a),this.treeCompress(b));
		default:
			throw "assert";
		}
		var size = 1 << d;
		var table = new Array();
		var _g = 0;
		while(_g < size) {
			var i = _g++;
			table.push(snow.utils.format.tools.Huffman.Found(-1));
		}
		this.treeWalk(table,0,0,d,t);
		return snow.utils.format.tools.Huffman.NeedBits(d,table);
	}
	,treeWalk: function(table,p,cd,d,t) {
		switch(t[1]) {
		case 1:
			var b = t[3];
			var a = t[2];
			if(d > 0) {
				this.treeWalk(table,p,cd + 1,d - 1,a);
				this.treeWalk(table,p | 1 << cd,cd + 1,d - 1,b);
			} else table[p] = this.treeCompress(t);
			break;
		default:
			table[p] = this.treeCompress(t);
		}
	}
	,treeMake: function(bits,maxbits,v,len) {
		if(len > maxbits) throw "Invalid huffman";
		var idx = v << 5 | len;
		if(bits.exists(idx)) return snow.utils.format.tools.Huffman.Found(bits.get(idx));
		v <<= 1;
		len += 1;
		return snow.utils.format.tools.Huffman.NeedBit(this.treeMake(bits,maxbits,v,len),this.treeMake(bits,maxbits,v | 1,len));
	}
	,make: function(lengths,pos,nlengths,maxbits) {
		var counts = new Array();
		var tmp = new Array();
		if(maxbits > 32) throw "Invalid huffman";
		var _g = 0;
		while(_g < maxbits) {
			var i = _g++;
			counts.push(0);
			tmp.push(0);
		}
		var _g1 = 0;
		while(_g1 < nlengths) {
			var i1 = _g1++;
			var p = lengths[i1 + pos];
			if(p >= maxbits) throw "Invalid huffman";
			counts[p]++;
		}
		var code = 0;
		var _g11 = 1;
		var _g2 = maxbits - 1;
		while(_g11 < _g2) {
			var i2 = _g11++;
			code = code + counts[i2] << 1;
			tmp[i2] = code;
		}
		var bits = new haxe.ds.IntMap();
		var _g3 = 0;
		while(_g3 < nlengths) {
			var i3 = _g3++;
			var l = lengths[i3 + pos];
			if(l != 0) {
				var n = tmp[l - 1];
				tmp[l - 1] = n + 1;
				bits.set(n << 5 | l,i3);
			}
		}
		return this.treeCompress(snow.utils.format.tools.Huffman.NeedBit(this.treeMake(bits,maxbits,0,1),this.treeMake(bits,maxbits,1,1)));
	}
	,__class__: snow.utils.format.tools.HuffTools
};
snow.utils.format.tools.Inflate = function() { };
snow.utils.format.tools.Inflate.__name__ = true;
snow.utils.format.tools.Inflate.run = function(bytes) {
	return snow.utils.format.tools.InflateImpl.run(new haxe.io.BytesInput(bytes));
};
snow.utils.format.tools._InflateImpl = {};
snow.utils.format.tools._InflateImpl.Window = function(hasCrc) {
	this.buffer = haxe.io.Bytes.alloc(65536);
	this.pos = 0;
	if(hasCrc) this.crc = new snow.utils.format.tools.Adler32();
};
snow.utils.format.tools._InflateImpl.Window.__name__ = true;
snow.utils.format.tools._InflateImpl.Window.prototype = {
	buffer: null
	,pos: null
	,crc: null
	,slide: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,32768);
		var b = haxe.io.Bytes.alloc(65536);
		this.pos -= 32768;
		b.blit(0,this.buffer,32768,this.pos);
		this.buffer = b;
	}
	,addBytes: function(b,p,len) {
		if(this.pos + len > 65536) this.slide();
		this.buffer.blit(this.pos,b,p,len);
		this.pos += len;
	}
	,addByte: function(c) {
		if(this.pos == 65536) this.slide();
		this.buffer.b[this.pos] = c & 255;
		this.pos++;
	}
	,getLastChar: function() {
		return this.buffer.b[this.pos - 1];
	}
	,available: function() {
		return this.pos;
	}
	,checksum: function() {
		if(this.crc != null) this.crc.update(this.buffer,0,this.pos);
		return this.crc;
	}
	,__class__: snow.utils.format.tools._InflateImpl.Window
};
snow.utils.format.tools._InflateImpl.State = { __ename__ : true, __constructs__ : ["Head","Block","CData","Flat","Crc","Dist","DistOne","Done"] };
snow.utils.format.tools._InflateImpl.State.Head = ["Head",0];
snow.utils.format.tools._InflateImpl.State.Head.toString = $estr;
snow.utils.format.tools._InflateImpl.State.Head.__enum__ = snow.utils.format.tools._InflateImpl.State;
snow.utils.format.tools._InflateImpl.State.Block = ["Block",1];
snow.utils.format.tools._InflateImpl.State.Block.toString = $estr;
snow.utils.format.tools._InflateImpl.State.Block.__enum__ = snow.utils.format.tools._InflateImpl.State;
snow.utils.format.tools._InflateImpl.State.CData = ["CData",2];
snow.utils.format.tools._InflateImpl.State.CData.toString = $estr;
snow.utils.format.tools._InflateImpl.State.CData.__enum__ = snow.utils.format.tools._InflateImpl.State;
snow.utils.format.tools._InflateImpl.State.Flat = ["Flat",3];
snow.utils.format.tools._InflateImpl.State.Flat.toString = $estr;
snow.utils.format.tools._InflateImpl.State.Flat.__enum__ = snow.utils.format.tools._InflateImpl.State;
snow.utils.format.tools._InflateImpl.State.Crc = ["Crc",4];
snow.utils.format.tools._InflateImpl.State.Crc.toString = $estr;
snow.utils.format.tools._InflateImpl.State.Crc.__enum__ = snow.utils.format.tools._InflateImpl.State;
snow.utils.format.tools._InflateImpl.State.Dist = ["Dist",5];
snow.utils.format.tools._InflateImpl.State.Dist.toString = $estr;
snow.utils.format.tools._InflateImpl.State.Dist.__enum__ = snow.utils.format.tools._InflateImpl.State;
snow.utils.format.tools._InflateImpl.State.DistOne = ["DistOne",6];
snow.utils.format.tools._InflateImpl.State.DistOne.toString = $estr;
snow.utils.format.tools._InflateImpl.State.DistOne.__enum__ = snow.utils.format.tools._InflateImpl.State;
snow.utils.format.tools._InflateImpl.State.Done = ["Done",7];
snow.utils.format.tools._InflateImpl.State.Done.toString = $estr;
snow.utils.format.tools._InflateImpl.State.Done.__enum__ = snow.utils.format.tools._InflateImpl.State;
snow.utils.format.tools.InflateImpl = function(i,header,crc) {
	if(crc == null) crc = true;
	if(header == null) header = true;
	this["final"] = false;
	this.htools = new snow.utils.format.tools.HuffTools();
	this.huffman = this.buildFixedHuffman();
	this.huffdist = null;
	this.len = 0;
	this.dist = 0;
	if(header) this.state = snow.utils.format.tools._InflateImpl.State.Head; else this.state = snow.utils.format.tools._InflateImpl.State.Block;
	this.input = i;
	this.bits = 0;
	this.nbits = 0;
	this.needed = 0;
	this.output = null;
	this.outpos = 0;
	this.lengths = new Array();
	var _g = 0;
	while(_g < 19) {
		var i1 = _g++;
		this.lengths.push(-1);
	}
	this.window = new snow.utils.format.tools._InflateImpl.Window(crc);
};
snow.utils.format.tools.InflateImpl.__name__ = true;
snow.utils.format.tools.InflateImpl.run = function(i,bufsize) {
	if(bufsize == null) bufsize = 65536;
	var buf = haxe.io.Bytes.alloc(bufsize);
	var output = new haxe.io.BytesBuffer();
	var inflate = new snow.utils.format.tools.InflateImpl(i);
	while(true) {
		var len = inflate.readBytes(buf,0,bufsize);
		output.addBytes(buf,0,len);
		if(len < bufsize) break;
	}
	return output.getBytes();
};
snow.utils.format.tools.InflateImpl.prototype = {
	nbits: null
	,bits: null
	,state: null
	,'final': null
	,huffman: null
	,huffdist: null
	,htools: null
	,len: null
	,dist: null
	,needed: null
	,output: null
	,outpos: null
	,input: null
	,lengths: null
	,window: null
	,buildFixedHuffman: function() {
		if(snow.utils.format.tools.InflateImpl.FIXED_HUFFMAN != null) return snow.utils.format.tools.InflateImpl.FIXED_HUFFMAN;
		var a = new Array();
		var _g = 0;
		while(_g < 288) {
			var n = _g++;
			a.push(n <= 143?8:n <= 255?9:n <= 279?7:8);
		}
		snow.utils.format.tools.InflateImpl.FIXED_HUFFMAN = this.htools.make(a,0,288,10);
		return snow.utils.format.tools.InflateImpl.FIXED_HUFFMAN;
	}
	,readBytes: function(b,pos,len) {
		this.needed = len;
		this.outpos = pos;
		this.output = b;
		if(len > 0) while(this.inflateLoop()) {
		}
		return len - this.needed;
	}
	,getBits: function(n) {
		while(this.nbits < n) {
			this.bits |= this.input.readByte() << this.nbits;
			this.nbits += 8;
		}
		var b = this.bits & (1 << n) - 1;
		this.nbits -= n;
		this.bits >>= n;
		return b;
	}
	,getBit: function() {
		if(this.nbits == 0) {
			this.nbits = 8;
			this.bits = this.input.readByte();
		}
		var b = (this.bits & 1) == 1;
		this.nbits--;
		this.bits >>= 1;
		return b;
	}
	,getRevBits: function(n) {
		if(n == 0) return 0; else if(this.getBit()) return 1 << n - 1 | this.getRevBits(n - 1); else return this.getRevBits(n - 1);
	}
	,resetBits: function() {
		this.bits = 0;
		this.nbits = 0;
	}
	,addBytes: function(b,p,len) {
		this.window.addBytes(b,p,len);
		this.output.blit(this.outpos,b,p,len);
		this.needed -= len;
		this.outpos += len;
	}
	,addByte: function(b) {
		this.window.addByte(b);
		this.output.b[this.outpos] = b & 255;
		this.needed--;
		this.outpos++;
	}
	,addDistOne: function(n) {
		var c = this.window.getLastChar();
		var _g = 0;
		while(_g < n) {
			var i = _g++;
			this.addByte(c);
		}
	}
	,addDist: function(d,len) {
		this.addBytes(this.window.buffer,this.window.pos - d,len);
	}
	,applyHuffman: function(h) {
		switch(h[1]) {
		case 0:
			var n = h[2];
			return n;
		case 1:
			var b = h[3];
			var a = h[2];
			return this.applyHuffman(this.getBit()?b:a);
		case 2:
			var tbl = h[3];
			var n1 = h[2];
			return this.applyHuffman(tbl[this.getBits(n1)]);
		}
	}
	,inflateLengths: function(a,max) {
		var i = 0;
		var prev = 0;
		while(i < max) {
			var n = this.applyHuffman(this.huffman);
			switch(n) {
			case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:case 10:case 11:case 12:case 13:case 14:case 15:
				prev = n;
				a[i] = n;
				i++;
				break;
			case 16:
				var end = i + 3 + this.getBits(2);
				if(end > max) throw "Invalid data";
				while(i < end) {
					a[i] = prev;
					i++;
				}
				break;
			case 17:
				i += 3 + this.getBits(3);
				if(i > max) throw "Invalid data";
				break;
			case 18:
				i += 11 + this.getBits(7);
				if(i > max) throw "Invalid data";
				break;
			default:
				throw "Invalid data";
			}
		}
	}
	,inflateLoop: function() {
		var _g = this.state;
		switch(_g[1]) {
		case 0:
			var cmf = this.input.readByte();
			var cm = cmf & 15;
			var cinfo = cmf >> 4;
			if(cm != 8 || cinfo != 7) throw "Invalid data";
			var flg = this.input.readByte();
			var fdict = (flg & 32) != 0;
			if(((cmf << 8) + flg) % 31 != 0) throw "Invalid data";
			if(fdict) throw "Unsupported dictionary";
			this.state = snow.utils.format.tools._InflateImpl.State.Block;
			return true;
		case 4:
			var calc = this.window.checksum();
			if(calc == null) {
				this.state = snow.utils.format.tools._InflateImpl.State.Done;
				return true;
			}
			var crc = snow.utils.format.tools.Adler32.read(this.input);
			if(!calc.equals(crc)) throw "Invalid CRC";
			this.state = snow.utils.format.tools._InflateImpl.State.Done;
			return true;
		case 7:
			return false;
		case 1:
			this["final"] = this.getBit();
			var _g1 = this.getBits(2);
			switch(_g1) {
			case 0:
				this.len = this.input.readUInt16();
				var nlen = this.input.readUInt16();
				if(nlen != 65535 - this.len) throw "Invalid data";
				this.state = snow.utils.format.tools._InflateImpl.State.Flat;
				var r = this.inflateLoop();
				this.resetBits();
				return r;
			case 1:
				this.huffman = this.buildFixedHuffman();
				this.huffdist = null;
				this.state = snow.utils.format.tools._InflateImpl.State.CData;
				return true;
			case 2:
				var hlit = this.getBits(5) + 257;
				var hdist = this.getBits(5) + 1;
				var hclen = this.getBits(4) + 4;
				var _g2 = 0;
				while(_g2 < hclen) {
					var i = _g2++;
					this.lengths[snow.utils.format.tools.InflateImpl.CODE_LENGTHS_POS[i]] = this.getBits(3);
				}
				var _g21 = hclen;
				while(_g21 < 19) {
					var i1 = _g21++;
					this.lengths[snow.utils.format.tools.InflateImpl.CODE_LENGTHS_POS[i1]] = 0;
				}
				this.huffman = this.htools.make(this.lengths,0,19,8);
				var lengths = new Array();
				var _g3 = 0;
				var _g22 = hlit + hdist;
				while(_g3 < _g22) {
					var i2 = _g3++;
					lengths.push(0);
				}
				this.inflateLengths(lengths,hlit + hdist);
				this.huffdist = this.htools.make(lengths,hlit,hdist,16);
				this.huffman = this.htools.make(lengths,0,hlit,16);
				this.state = snow.utils.format.tools._InflateImpl.State.CData;
				return true;
			default:
				throw "Invalid data";
			}
			break;
		case 3:
			var rlen;
			if(this.len < this.needed) rlen = this.len; else rlen = this.needed;
			var bytes = this.input.read(rlen);
			this.len -= rlen;
			this.addBytes(bytes,0,rlen);
			if(this.len == 0) if(this["final"]) this.state = snow.utils.format.tools._InflateImpl.State.Crc; else this.state = snow.utils.format.tools._InflateImpl.State.Block;
			return this.needed > 0;
		case 6:
			var rlen1;
			if(this.len < this.needed) rlen1 = this.len; else rlen1 = this.needed;
			this.addDistOne(rlen1);
			this.len -= rlen1;
			if(this.len == 0) this.state = snow.utils.format.tools._InflateImpl.State.CData;
			return this.needed > 0;
		case 5:
			while(this.len > 0 && this.needed > 0) {
				var rdist;
				if(this.len < this.dist) rdist = this.len; else rdist = this.dist;
				var rlen2;
				if(this.needed < rdist) rlen2 = this.needed; else rlen2 = rdist;
				this.addDist(this.dist,rlen2);
				this.len -= rlen2;
			}
			if(this.len == 0) this.state = snow.utils.format.tools._InflateImpl.State.CData;
			return this.needed > 0;
		case 2:
			var n = this.applyHuffman(this.huffman);
			if(n < 256) {
				this.addByte(n);
				return this.needed > 0;
			} else if(n == 256) {
				if(this["final"]) this.state = snow.utils.format.tools._InflateImpl.State.Crc; else this.state = snow.utils.format.tools._InflateImpl.State.Block;
				return true;
			} else {
				n -= 257;
				var extra_bits = snow.utils.format.tools.InflateImpl.LEN_EXTRA_BITS_TBL[n];
				if(extra_bits == -1) throw "Invalid data";
				this.len = snow.utils.format.tools.InflateImpl.LEN_BASE_VAL_TBL[n] + this.getBits(extra_bits);
				var dist_code;
				if(this.huffdist == null) dist_code = this.getRevBits(5); else dist_code = this.applyHuffman(this.huffdist);
				extra_bits = snow.utils.format.tools.InflateImpl.DIST_EXTRA_BITS_TBL[dist_code];
				if(extra_bits == -1) throw "Invalid data";
				this.dist = snow.utils.format.tools.InflateImpl.DIST_BASE_VAL_TBL[dist_code] + this.getBits(extra_bits);
				if(this.dist > this.window.available()) throw "Invalid data";
				if(this.dist == 1) this.state = snow.utils.format.tools._InflateImpl.State.DistOne; else this.state = snow.utils.format.tools._InflateImpl.State.Dist;
				return true;
			}
			break;
		}
	}
	,__class__: snow.utils.format.tools.InflateImpl
};
snow.window.Window = function(_manager,_config) {
	this.internal_resize = false;
	this.internal_position = false;
	this.minimized = false;
	this.closed = true;
	this.auto_render = true;
	this.auto_swap = true;
	this.height = 0;
	this.width = 0;
	this.y = 0;
	this.x = 0;
	this.fullscreen = false;
	this.grab = false;
	this.bordered = true;
	this.title = "snow window";
	this.set_max_size({ x : 0, y : 0});
	this.set_min_size({ x : 0, y : 0});
	this.manager = _manager;
	this.asked_config = _config;
	this.config = _config;
	if(this.config.x == null) this.config.x = 536805376;
	if(this.config.y == null) this.config.y = 536805376;
	this.manager.platform.create(_config,$bind(this,this.on_window_created));
};
snow.window.Window.__name__ = true;
snow.window.Window.prototype = {
	id: null
	,manager: null
	,asked_config: null
	,config: null
	,handle: null
	,onevent: null
	,onrender: null
	,title: null
	,bordered: null
	,grab: null
	,fullscreen: null
	,x: null
	,y: null
	,width: null
	,height: null
	,max_size: null
	,min_size: null
	,auto_swap: null
	,auto_render: null
	,closed: null
	,minimized: null
	,internal_position: null
	,internal_resize: null
	,on_window_created: function(_handle,_id,_config) {
		this.id = _id;
		this.handle = _handle;
		if(this.handle == null) {
			haxe.Log.trace("   i / window / " + "failed to create window",{ fileName : "Window.hx", lineNumber : 94, className : "snow.window.Window", methodName : "on_window_created"});
			return;
		}
		this.closed = false;
		this.config = _config;
		this.internal_position = true;
		this.set_x(_config.x);
		this.set_y(_config.y);
		this.internal_position = false;
		this.internal_resize = true;
		this.set_width(_config.width);
		this.set_height(_config.height);
		this.internal_resize = false;
		this.on_event({ type : 1, window_id : _id, timestamp : snow.Snow.core.timestamp(), event : { }});
		null;
	}
	,on_event: function(_event) {
		var _g = _event.type;
		switch(_g) {
		case 5:
			this.internal_position = true;
			this.set_position(_event.event.x,_event.event.y);
			this.internal_position = false;
			break;
		case 6:
			this.internal_resize = true;
			this.set_size(_event.event.x,_event.event.y);
			this.internal_resize = false;
			break;
		case 7:
			this.internal_resize = true;
			this.set_size(_event.event.x,_event.event.y);
			this.internal_resize = false;
			break;
		case 8:
			this.minimized = true;
			break;
		case 10:
			this.minimized = false;
			break;
		default:
		}
		if(this.onevent != null) this.onevent(_event);
	}
	,update: function() {
		if(this.handle != null && !this.closed) this.manager.platform.update(this);
	}
	,render: function() {
		if(this.minimized || this.closed) return;
		if(this.handle == null) return;
		this.manager.platform.render(this);
		if(this.onrender != null) {
			this.onrender(this);
			if(this.auto_swap) this.swap();
			return;
		}
		snow.platform.web.render.opengl.GL.clearColor(0.8,0.12,0.12,1.0);
		snow.platform.web.render.opengl.GL.clear(16384);
		if(this.auto_swap) this.swap();
	}
	,swap: function() {
		if(this.handle == null || this.closed || this.minimized) return;
		this.manager.platform.swap(this);
	}
	,destroy: function() {
		this.closed = true;
		if(this.handle == null) return;
		this.manager.remove(this);
		this.manager.platform.destroy_window(this);
		this.handle = null;
	}
	,close: function() {
		this.closed = true;
		if(this.handle == null) return;
		this.manager.platform.close(this);
	}
	,show: function() {
		if(this.handle == null) return;
		this.closed = false;
		this.manager.platform.show(this);
	}
	,simple_message: function(message,title) {
		if(title == null) title = "";
		if(this.handle == null) return;
		this.manager.platform.simple_message(this,message,title);
	}
	,get_fullscreen: function() {
		return this.fullscreen;
	}
	,set_fullscreen: function(_enable) {
		if(this.handle != null) this.manager.platform.fullscreen(this,_enable);
		return this.fullscreen = _enable;
	}
	,get_bordered: function() {
		return this.bordered;
	}
	,get_grab: function() {
		return this.grab;
	}
	,get_max_size: function() {
		return this.max_size;
	}
	,get_min_size: function() {
		return this.min_size;
	}
	,get_title: function() {
		return this.title;
	}
	,set_title: function(_title) {
		if(this.handle != null) this.manager.platform.set_title(this,_title);
		return this.title = _title;
	}
	,set_x: function(_x) {
		this.x = _x;
		if(this.handle != null && !this.internal_position) this.manager.platform.set_position(this,this.x,this.y);
		return this.x;
	}
	,set_y: function(_y) {
		this.y = _y;
		if(this.handle != null && !this.internal_position) this.manager.platform.set_position(this,this.x,this.y);
		return this.y;
	}
	,set_width: function(_width) {
		this.width = _width;
		if(this.handle != null && !this.internal_resize) this.manager.platform.set_size(this,this.width,this.height);
		return this.width;
	}
	,set_height: function(_height) {
		this.height = _height;
		if(this.handle != null && !this.internal_resize) this.manager.platform.set_size(this,this.width,this.height);
		return this.height;
	}
	,set_cursor_position: function(_x,_y) {
		if(this.handle != null && !this.closed) this.manager.platform.set_cursor_position(this,_x,_y);
	}
	,set_position: function(_x,_y) {
		var last_internal_position_flag = this.internal_position;
		this.internal_position = true;
		this.set_x(_x);
		this.set_y(_y);
		this.internal_position = last_internal_position_flag;
		if(this.handle != null && !this.internal_position) this.manager.platform.set_position(this,this.x,this.y);
	}
	,set_size: function(_width,_height) {
		var last_internal_resize_flag = this.internal_resize;
		this.internal_resize = true;
		this.set_width(_width);
		this.set_height(_height);
		this.internal_resize = last_internal_resize_flag;
		if(this.handle != null && !this.internal_resize) this.manager.platform.set_size(this,_width,_height);
	}
	,set_max_size: function(_size) {
		if(this.get_max_size() != null && this.handle != null) this.manager.platform.set_max_size(this,_size.x,_size.y);
		return this.max_size = _size;
	}
	,set_min_size: function(_size) {
		if(this.get_min_size() != null && this.handle != null) this.manager.platform.set_min_size(this,_size.x,_size.y);
		return this.min_size = _size;
	}
	,set_bordered: function(_bordered) {
		if(this.handle != null) this.manager.platform.bordered(this,_bordered);
		return this.bordered = _bordered;
	}
	,set_grab: function(_grab) {
		if(this.handle != null) this.manager.platform.grab(this,_grab);
		return this.grab = _grab;
	}
	,__class__: snow.window.Window
	,__properties__: {set_min_size:"set_min_size",get_min_size:"get_min_size",set_max_size:"set_max_size",get_max_size:"get_max_size",set_height:"set_height",set_width:"set_width",set_y:"set_y",set_x:"set_x",set_fullscreen:"set_fullscreen",get_fullscreen:"get_fullscreen",set_grab:"set_grab",get_grab:"get_grab",set_bordered:"set_bordered",get_bordered:"get_bordered",set_title:"set_title",get_title:"get_title"}
};
snow.window.Windowing = function(_lib) {
	this.window_count = 0;
	this.lib = _lib;
	this.window_list = new haxe.ds.IntMap();
	this.window_handles = new haxe.ds.ObjectMap();
	this.platform = new snow.platform.web.window.WindowSystem(this,this.lib);
	this.platform.init();
};
snow.window.Windowing.__name__ = true;
snow.window.Windowing.prototype = {
	window_list: null
	,window_handles: null
	,window_count: null
	,lib: null
	,platform: null
	,create: function(_config) {
		var _window = new snow.window.Window(this,_config);
		this.window_list.set(_window.id,_window);
		this.window_handles.set(_window.handle,_window.id);
		this.window_count++;
		this.platform.listen(_window);
		if(_config.no_input == null || _config.no_input == false) this.lib.input.listen(_window);
		return _window;
	}
	,remove: function(_window) {
		this.window_list.remove(_window.id);
		this.window_handles.remove(_window.handle);
		this.window_count--;
		this.platform.unlisten(_window);
		if(_window.config.no_input == null || _window.config.no_input == false) this.lib.input.unlisten(_window);
	}
	,window_from_handle: function(_handle) {
		if(this.window_handles.h.__keys__[_handle.__id__] != null) {
			var _id = this.window_handles.h[_handle.__id__];
			return this.window_list.get(_id);
		}
		return null;
	}
	,window_from_id: function(_id) {
		return this.window_list.get(_id);
	}
	,enable_vsync: function(_enable) {
		return this.platform.system_enable_vsync(_enable);
	}
	,enable_cursor: function(_enable) {
		this.platform.system_enable_cursor(_enable);
	}
	,enable_cursor_lock: function(_enable) {
		this.platform.system_lock_cursor(_enable);
	}
	,display_count: function() {
		return this.platform.display_count();
	}
	,display_mode_count: function(display) {
		return this.platform.display_mode_count(display);
	}
	,display_native_mode: function(display) {
		return this.platform.display_native_mode(display);
	}
	,display_current_mode: function(display) {
		return this.platform.display_current_mode(display);
	}
	,display_mode: function(display,mode_index) {
		return this.platform.display_mode(display,mode_index);
	}
	,display_bounds: function(display) {
		return this.platform.display_bounds(display);
	}
	,display_name: function(display) {
		return this.platform.display_name(display);
	}
	,on_event: function(_event) {
		if(_event.type == 5) {
			var _window_event = _event.window;
			var _window = this.window_list.get(_window_event.window_id);
			if(_window != null) _window.on_event(_window_event);
		}
	}
	,update: function() {
		this.platform.process();
		var $it0 = this.window_list.iterator();
		while( $it0.hasNext() ) {
			var $window = $it0.next();
			$window.update();
		}
		var $it1 = this.window_list.iterator();
		while( $it1.hasNext() ) {
			var window1 = $it1.next();
			if(window1.auto_render) window1.render();
		}
	}
	,destroy: function() {
		this.platform.destroy();
	}
	,__class__: snow.window.Windowing
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
haxe.Resource.content = [{ name : "tiny.button.png", data : "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"},{ name : "version", data : "MS4wLjAtYWxwaGEuMQ"},{ name : "cabin.png", data : "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"},{ name : "default.vert.glsl", data : "YXR0cmlidXRlIHZlYzMgdmVydGV4UG9zaXRpb247DQphdHRyaWJ1dGUgdmVjMiB2ZXJ0ZXhUQ29vcmQ7DQphdHRyaWJ1dGUgdmVjNCB2ZXJ0ZXhDb2xvcjsNCmF0dHJpYnV0ZSB2ZWMzIHZlcnRleE5vcm1hbDsNCg0KdmFyeWluZyB2ZWMyIHRjb29yZDsNCnZhcnlpbmcgdmVjNCBjb2xvcjsNCg0KdW5pZm9ybSBtYXQ0IHByb2plY3Rpb25NYXRyaXg7DQp1bmlmb3JtIG1hdDQgbW9kZWxWaWV3TWF0cml4Ow0KDQp2b2lkIG1haW4odm9pZCkgew0KDQogICAgZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNCh2ZXJ0ZXhQb3NpdGlvbiwgMS4wKTsNCiAgICB0Y29vcmQgPSB2ZXJ0ZXhUQ29vcmQ7DQogICAgY29sb3IgPSB2ZXJ0ZXhDb2xvcjsNCiAgICAgICAgLy9obW0hIEkgdGhpbmsgc2hhZGVycyBhcmUgY29tcGlsZWQgb3B0aW1pc2VkLCByZW1vdmluZyB1bnVzZWQgdmFsdWVzIHdoaWNoIG1lYW5zDQogICAgICAgIC8vdGhhdCB0aGUgc2hhZGVycyBnZXRWZXJ0ZXhOb3JtYWwgYXR0cmlidXRlIHJldHVybnMgaW52YWxpZCAoLTEpIHZhbHVlcyENCiAgICB2ZWMzIG4gPSB2ZXJ0ZXhOb3JtYWw7DQogICAgLy8gZ2xfUG9pbnRTaXplID0gNTEyLjA7DQoNCn0"},{ name : "build", data : "KzQxMDA5NThkZDQ"},{ name : "tiny.ui.png", data : "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"},{ name : "cabin.fnt", data : "aW5mbyBmYWNlPWNhYmluIHNpemU9MzIgYm9sZD0wIGl0YWxpYz0wIGNoYXJzZXQ9IHVuaWNvZGU9IHN0cmV0Y2hIPTEwMCBzbW9vdGg9MSBhYT0xIHBhZGRpbmc9MywzLDMsMyBzcGFjaW5nPTAsMCBvdXRsaW5lPTANCmNvbW1vbiBsaW5lSGVpZ2h0PTM5IGJhc2U9MzEgc2NhbGVXPTUxMiBzY2FsZUg9MjU2IHBhZ2VzPTEgcGFja2VkPTANCnBhZ2UgaWQ9MCBmaWxlPSJjYWJpbi5wbmciDQpjaGFycyBjb3VudD0yMzcNCmNoYXIgaWQ9MzMgeD0zIHk9MyB3aWR0aD00IGhlaWdodD0yNCB4b2Zmc2V0PTIgeW9mZnNldD03IHhhZHZhbmNlPTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MzQgeD0zIHk9MzAgd2lkdGg9MTEgaGVpZ2h0PTEwIHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MzUgeD0xMCB5PTMgd2lkdGg9MjEgaGVpZ2h0PTIzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MjMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MzYgeD0zIHk9NDMgd2lkdGg9MTQgaGVpZ2h0PTI1IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTcgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MzcgeD0zIHk9NzEgd2lkdGg9MjUgaGVpZ2h0PTIzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MjcgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MzggeD0yMCB5PTI5IHdpZHRoPTE4IGhlaWdodD0yNCB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTIwIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTM5IHg9MjAgeT01NiB3aWR0aD00IGhlaWdodD0xMCB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NDAgeD0zIHk9OTcgd2lkdGg9NyBoZWlnaHQ9MjkgeG9mZnNldD0xIHlvZmZzZXQ9NyB4YWR2YW5jZT05IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTQxIHg9MyB5PTEyOSB3aWR0aD03IGhlaWdodD0yOSB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTkgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NDIgeD0yNyB5PTU2IHdpZHRoPTEyIGhlaWdodD0xMSB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTE0IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTQzIHg9MzQgeT0zIHdpZHRoPTEyIGhlaWdodD0xMiB4b2Zmc2V0PTEgeW9mZnNldD0xNiB4YWR2YW5jZT0xNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD00NCB4PTM0IHk9MTggd2lkdGg9NCBoZWlnaHQ9NyB4b2Zmc2V0PTIgeW9mZnNldD0yOCB4YWR2YW5jZT03IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTQ1IHg9NDEgeT0xOCB3aWR0aD0xMCBoZWlnaHQ9MyB4b2Zmc2V0PTIgeW9mZnNldD0yMCB4YWR2YW5jZT0xNCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD00NiB4PTQ5IHk9MyB3aWR0aD00IGhlaWdodD00IHhvZmZzZXQ9MiB5b2Zmc2V0PTI4IHhhZHZhbmNlPTcgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NDcgeD00MSB5PTI0IHdpZHRoPTE2IGhlaWdodD0yNSB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTE3IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTQ4IHg9MyB5PTE2MSB3aWR0aD0xOSBoZWlnaHQ9MjQgeG9mZnNldD0yIHlvZmZzZXQ9OCB4YWR2YW5jZT0yMyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD00OSB4PTEzIHk9OTcgd2lkdGg9NyBoZWlnaHQ9MjMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xMSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD01MCB4PTEzIHk9MTIzIHdpZHRoPTE0IGhlaWdodD0yMyB4b2Zmc2V0PTIgeW9mZnNldD04IHhhZHZhbmNlPTE3IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTUxIHg9MyB5PTE4OCB3aWR0aD0xNSBoZWlnaHQ9MjQgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD01MiB4PTIzIHk9OTcgd2lkdGg9MTYgaGVpZ2h0PTIzIHhvZmZzZXQ9MCB5b2Zmc2V0PTggeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NTMgeD0zMSB5PTcwIHdpZHRoPTE0IGhlaWdodD0yMyB4b2Zmc2V0PTIgeW9mZnNldD04IHhhZHZhbmNlPTE3IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTU0IHg9MyB5PTIxNSB3aWR0aD0xNSBoZWlnaHQ9MjMgeG9mZnNldD0yIHlvZmZzZXQ9OCB4YWR2YW5jZT0xOCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD01NSB4PTIxIHk9MTg4IHdpZHRoPTE1IGhlaWdodD0yMyB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTU2IHg9MjUgeT0xNDkgd2lkdGg9MTYgaGVpZ2h0PTI0IHhvZmZzZXQ9MiB5b2Zmc2V0PTggeGFkdmFuY2U9MTkgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NTcgeD0zMCB5PTEyMyB3aWR0aD0xNSBoZWlnaHQ9MjMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xOCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD01OCB4PTQyIHk9NTIgd2lkdGg9NCBoZWlnaHQ9MTQgeG9mZnNldD0yIHlvZmZzZXQ9MTcgeGFkdmFuY2U9NyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD01OSB4PTU2IHk9MyB3aWR0aD00IGhlaWdodD0xOCB4b2Zmc2V0PTIgeW9mZnNldD0xNyB4YWR2YW5jZT03IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTYwIHg9NDIgeT05NiB3aWR0aD0xMSBoZWlnaHQ9MTQgeG9mZnNldD0xIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MTMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NjEgeD0yNSB5PTE3NiB3aWR0aD0xMiBoZWlnaHQ9OCB4b2Zmc2V0PTIgeW9mZnNldD0xOCB4YWR2YW5jZT0xNiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD02MiB4PTQ4IHk9Njkgd2lkdGg9MTEgaGVpZ2h0PTE0IHhvZmZzZXQ9MiB5b2Zmc2V0PTE1IHhhZHZhbmNlPTEzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTYzIHg9MjEgeT0yMTQgd2lkdGg9MTIgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTQgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NjQgeD0zNiB5PTIxNCB3aWR0aD0yMCBoZWlnaHQ9MjEgeG9mZnNldD0yIHlvZmZzZXQ9MTMgeGFkdmFuY2U9MjMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NjUgeD0zOSB5PTE4NyB3aWR0aD0yMCBoZWlnaHQ9MjMgeG9mZnNldD0wIHlvZmZzZXQ9OCB4YWR2YW5jZT0yMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD02NiB4PTQ0IHk9MTQ5IHdpZHRoPTE2IGhlaWdodD0yMyB4b2Zmc2V0PTMgeW9mZnNldD04IHhhZHZhbmNlPTE5IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTY3IHg9NDggeT0xMTMgd2lkdGg9MTggaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MjAgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NjggeD01NiB5PTg2IHdpZHRoPTIwIGhlaWdodD0yMyB4b2Zmc2V0PTMgeW9mZnNldD04IHhhZHZhbmNlPTIzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTY5IHg9NTkgeT0yMTMgd2lkdGg9MTUgaGVpZ2h0PTIzIHhvZmZzZXQ9MyB5b2Zmc2V0PTggeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NzAgeD02MiB5PTE3NSB3aWR0aD0xNCBoZWlnaHQ9MjMgeG9mZnNldD0zIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD03MSB4PTYzIHk9MTQwIHdpZHRoPTE5IGhlaWdodD0yNCB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTIxIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTcyIHg9NjkgeT0xMTIgd2lkdGg9MTkgaGVpZ2h0PTIzIHhvZmZzZXQ9MyB5b2Zmc2V0PTggeGFkdmFuY2U9MjQgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NzMgeD02MCB5PTI0IHdpZHRoPTQgaGVpZ2h0PTIzIHhvZmZzZXQ9MyB5b2Zmc2V0PTggeGFkdmFuY2U9OCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD03NCB4PTYyIHk9NTAgd2lkdGg9NyBoZWlnaHQ9MjggeG9mZnNldD0wIHlvZmZzZXQ9OCB4YWR2YW5jZT04IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTc1IHg9NjcgeT0zIHdpZHRoPTE3IGhlaWdodD0yMyB4b2Zmc2V0PTMgeW9mZnNldD04IHhhZHZhbmNlPTE5IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTc2IHg9NzcgeT0yMDEgd2lkdGg9MTQgaGVpZ2h0PTIzIHhvZmZzZXQ9MyB5b2Zmc2V0PTggeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NzcgeD03NyB5PTIyNyB3aWR0aD0yNCBoZWlnaHQ9MjMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0yNiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD03OCB4PTc5IHk9MTY3IHdpZHRoPTE4IGhlaWdodD0yMyB4b2Zmc2V0PTMgeW9mZnNldD04IHhhZHZhbmNlPTIzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTc5IHg9ODUgeT0xMzggd2lkdGg9MjIgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MjUgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODAgeD05NCB5PTE5MyB3aWR0aD0xNiBoZWlnaHQ9MjMgeG9mZnNldD0zIHlvZmZzZXQ9OCB4YWR2YW5jZT0xOSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MSB4PTEwMCB5PTE2NSB3aWR0aD0yMiBoZWlnaHQ9MjQgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0yNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MiB4PTEwNCB5PTIxOSB3aWR0aD0xNyBoZWlnaHQ9MjMgeG9mZnNldD0zIHlvZmZzZXQ9OCB4YWR2YW5jZT0yMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MyB4PTExMyB5PTE5MiB3aWR0aD0xNyBoZWlnaHQ9MjQgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xOSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04NCB4PTEyNCB5PTIxOSB3aWR0aD0xNyBoZWlnaHQ9MjMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xOCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04NSB4PTcyIHk9Mjkgd2lkdGg9MTkgaGVpZ2h0PTIzIHhvZmZzZXQ9MiB5b2Zmc2V0PTggeGFkdmFuY2U9MjMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODYgeD04NyB5PTMgd2lkdGg9MjEgaGVpZ2h0PTIzIHhvZmZzZXQ9MCB5b2Zmc2V0PTggeGFkdmFuY2U9MjEgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODcgeD03MiB5PTU1IHdpZHRoPTMxIGhlaWdodD0yMyB4b2Zmc2V0PTAgeW9mZnNldD04IHhhZHZhbmNlPTMxIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTg4IHg9OTQgeT0yOSB3aWR0aD0xOSBoZWlnaHQ9MjMgeG9mZnNldD0wIHlvZmZzZXQ9OCB4YWR2YW5jZT0xOSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04OSB4PTExMSB5PTMgd2lkdGg9MTkgaGVpZ2h0PTIzIHhvZmZzZXQ9MCB5b2Zmc2V0PTggeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9OTAgeD03OSB5PTgxIHdpZHRoPTE3IGhlaWdodD0yMyB4b2Zmc2V0PTAgeW9mZnNldD04IHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTkxIHg9OTkgeT04MSB3aWR0aD05IGhlaWdodD0yOSB4b2Zmc2V0PTIgeW9mZnNldD03IHhhZHZhbmNlPTExIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTkyIHg9MTEwIHk9MTEzIHdpZHRoPTE2IGhlaWdodD0yNSB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTE3IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTkzIHg9MTI1IHk9MTQxIHdpZHRoPTkgaGVpZ2h0PTI5IHhvZmZzZXQ9MCB5b2Zmc2V0PTcgeGFkdmFuY2U9MTEgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9OTQgeD0zIHk9MjQxIHdpZHRoPTE0IGhlaWdodD0xMSB4b2Zmc2V0PTIgeW9mZnNldD02IHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTk1IHg9NDAgeT0xNzYgd2lkdGg9MTggaGVpZ2h0PTMgeG9mZnNldD0wIHlvZmZzZXQ9MzIgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9OTYgeD05NCB5PTIxOSB3aWR0aD02IGhlaWdodD01IHhvZmZzZXQ9MiB5b2Zmc2V0PTcgeGFkdmFuY2U9MTAgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9OTcgeD05MSB5PTExMyB3aWR0aD0xNSBoZWlnaHQ9MTcgeG9mZnNldD0xIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9OTggeD0xMzMgeT0xNzMgd2lkdGg9MTUgaGVpZ2h0PTI1IHhvZmZzZXQ9MiB5b2Zmc2V0PTcgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9OTkgeD0xMDYgeT01NSB3aWR0aD0xMyBoZWlnaHQ9MTcgeG9mZnNldD0xIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MTQgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTAwIHg9MTExIHk9NzUgd2lkdGg9MTUgaGVpZ2h0PTI1IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTAxIHg9MTE2IHk9Mjkgd2lkdGg9MTUgaGVpZ2h0PTE3IHhvZmZzZXQ9MSB5b2Zmc2V0PTE1IHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTEwMiB4PTE0NCB5PTIwMSB3aWR0aD0xMCBoZWlnaHQ9MjQgeG9mZnNldD0wIHlvZmZzZXQ9NyB4YWR2YW5jZT0xMSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMDMgeD0xNDQgeT0yMjggd2lkdGg9MTYgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTE1IHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTEwNCB4PTEyOSB5PTQ5IHdpZHRoPTE0IGhlaWdodD0yNCB4b2Zmc2V0PTIgeW9mZnNldD03IHhhZHZhbmNlPTE3IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTEwNSB4PTEyMiB5PTQ5IHdpZHRoPTQgaGVpZ2h0PTIzIHhvZmZzZXQ9MiB5b2Zmc2V0PTggeGFkdmFuY2U9NyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMDYgeD0xMzQgeT0zIHdpZHRoPTYgaGVpZ2h0PTMwIHhvZmZzZXQ9MCB5b2Zmc2V0PTggeGFkdmFuY2U9NyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMDcgeD0xNDMgeT0zIHdpZHRoPTEzIGhlaWdodD0yNCB4b2Zmc2V0PTIgeW9mZnNldD03IHhhZHZhbmNlPTE1IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTEwOCB4PTEyOSB5PTc2IHdpZHRoPTYgaGVpZ2h0PTI1IHhvZmZzZXQ9MiB5b2Zmc2V0PTcgeGFkdmFuY2U9OCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMDkgeD0xNDMgeT0zMCB3aWR0aD0yNSBoZWlnaHQ9MTYgeG9mZnNldD0yIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MjggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTEwIHg9MTU5IHk9MyB3aWR0aD0xNCBoZWlnaHQ9MTYgeG9mZnNldD0yIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTExIHg9MTI5IHk9MTA0IHdpZHRoPTE2IGhlaWdodD0xNyB4b2Zmc2V0PTEgeW9mZnNldD0xNSB4YWR2YW5jZT0xOCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMTIgeD0xMzggeT03NiB3aWR0aD0xNSBoZWlnaHQ9MjQgeG9mZnNldD0yIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTEzIHg9MTQ2IHk9NDkgd2lkdGg9MTUgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTE1IHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTExNCB4PTExMCB5PTE0MSB3aWR0aD05IGhlaWdodD0xNyB4b2Zmc2V0PTIgeW9mZnNldD0xNSB4YWR2YW5jZT0xMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMTUgeD0xMzcgeT0xMjQgd2lkdGg9MTIgaGVpZ2h0PTE3IHhvZmZzZXQ9MSB5b2Zmc2V0PTE1IHhhZHZhbmNlPTEzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTExNiB4PTEzNyB5PTE0NCB3aWR0aD0xMCBoZWlnaHQ9MjEgeG9mZnNldD0xIHlvZmZzZXQ9MTEgeGFkdmFuY2U9MTEgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTE3IHg9MTQ4IHk9MTAzIHdpZHRoPTE0IGhlaWdodD0xNiB4b2Zmc2V0PTIgeW9mZnNldD0xNSB4YWR2YW5jZT0xNyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMTggeD0xNTYgeT03NiB3aWR0aD0xNiBoZWlnaHQ9MTYgeG9mZnNldD0wIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTE5IHg9MTY0IHk9NDkgd2lkdGg9MjMgaGVpZ2h0PTE2IHhvZmZzZXQ9MCB5b2Zmc2V0PTE1IHhhZHZhbmNlPTIzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTEyMCB4PTE3MSB5PTIyIHdpZHRoPTE1IGhlaWdodD0xNiB4b2Zmc2V0PTAgeW9mZnNldD0xNSB4YWR2YW5jZT0xNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMjEgeD0xNTAgeT0xNDQgd2lkdGg9MTcgaGVpZ2h0PTI0IHhvZmZzZXQ9MCB5b2Zmc2V0PTE1IHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTEyMiB4PTE3NiB5PTMgd2lkdGg9MTQgaGVpZ2h0PTE2IHhvZmZzZXQ9MSB5b2Zmc2V0PTE1IHhhZHZhbmNlPTE1IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTEyMyB4PTE2NSB5PTk1IHdpZHRoPTkgaGVpZ2h0PTI5IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTAgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTI0IHg9MTU3IHk9MTcxIHdpZHRoPTMgaGVpZ2h0PTMxIHhvZmZzZXQ9MiB5b2Zmc2V0PTcgeGFkdmFuY2U9NyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMjUgeD0xNjMgeT0xNzEgd2lkdGg9OSBoZWlnaHQ9MjkgeG9mZnNldD0wIHlvZmZzZXQ9NyB4YWR2YW5jZT0xMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xMjYgeD03OSB5PTE5MyB3aWR0aD0xMiBoZWlnaHQ9NCB4b2Zmc2V0PTIgeW9mZnNldD0yMiB4YWR2YW5jZT0xNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNjAgeD00MSB5PTUyIHdpZHRoPTAgaGVpZ2h0PTAgeG9mZnNldD0wIHlvZmZzZXQ9MzEgeGFkdmFuY2U9NyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNjEgeD0xODkgeT0yMiB3aWR0aD00IGhlaWdodD0yNCB4b2Zmc2V0PTIgeW9mZnNldD0xNSB4YWR2YW5jZT04IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE2MiB4PTE3MCB5PTEyNyB3aWR0aD0xMyBoZWlnaHQ9MjUgeG9mZnNldD0xIHlvZmZzZXQ9NyB4YWR2YW5jZT0xNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNjMgeD0xNzUgeT02OCB3aWR0aD0xNCBoZWlnaHQ9MjMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNjQgeD0xNzcgeT05NCB3aWR0aD0xNyBoZWlnaHQ9MjEgeG9mZnNldD0yIHlvZmZzZXQ9OSB4YWR2YW5jZT0yMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNjUgeD0xOTIgeT00OSB3aWR0aD0yMCBoZWlnaHQ9MjMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0yMiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNjYgeD0xOTYgeT0zIHdpZHRoPTMgaGVpZ2h0PTMxIHhvZmZzZXQ9MiB5b2Zmc2V0PTcgeGFkdmFuY2U9NyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNjcgeD0yMDIgeT0zIHdpZHRoPTEzIGhlaWdodD0yNyB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTE1IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE2OCB4PTE2NCB5PTY4IHdpZHRoPTggaGVpZ2h0PTQgeG9mZnNldD0zIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNjkgeD0xNjMgeT0yMDMgd2lkdGg9MjAgaGVpZ2h0PTIxIHhvZmZzZXQ9MSB5b2Zmc2V0PTkgeGFkdmFuY2U9MjIgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTcwIHg9NDkgeT01MiB3aWR0aD05IGhlaWdodD0xMCB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTExIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE3MSB4PTM2IHk9MjM5IHdpZHRoPTE3IGhlaWdodD0xNCB4b2Zmc2V0PTAgeW9mZnNldD0xNSB4YWR2YW5jZT0xOSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNzIgeD0xNTIgeT0xMjcgd2lkdGg9MTUgaGVpZ2h0PTkgeG9mZnNldD0yIHlvZmZzZXQ9MTggeGFkdmFuY2U9MTkgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTczIHg9NDggeT0xNDAgd2lkdGg9MTAgaGVpZ2h0PTMgeG9mZnNldD0yIHlvZmZzZXQ9MjAgeGFkdmFuY2U9MTQgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTc0IHg9MTYzIHk9MjI3IHdpZHRoPTIwIGhlaWdodD0yMSB4b2Zmc2V0PTEgeW9mZnNldD05IHhhZHZhbmNlPTIyIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE3NiB4PTEzIHk9MTQ5IHdpZHRoPTkgaGVpZ2h0PTkgeG9mZnNldD0xIHlvZmZzZXQ9NyB4YWR2YW5jZT0xMSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xNzcgeD0xOTIgeT03NSB3aWR0aD0xMiBoZWlnaHQ9MTYgeG9mZnNldD0yIHlvZmZzZXQ9MTQgeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTc4IHg9MTMzIHk9MjAxIHdpZHRoPTggaGVpZ2h0PTEzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MTAgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTc5IHg9MjAyIHk9MzMgd2lkdGg9OSBoZWlnaHQ9MTMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xODAgeD0xNTYgeT05NSB3aWR0aD02IGhlaWdodD01IHhvZmZzZXQ9MiB5b2Zmc2V0PTcgeGFkdmFuY2U9MTAgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTgxIHg9MTc1IHk9MTU1IHdpZHRoPTE2IGhlaWdodD0yNCB4b2Zmc2V0PTIgeW9mZnNldD0xNSB4YWR2YW5jZT0xOSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xODIgeD0xODYgeT0xMTggd2lkdGg9MTggaGVpZ2h0PTIzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MjAgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTgzIHg9NDkgeT0xMCB3aWR0aD00IGhlaWdodD01IHhvZmZzZXQ9MiB5b2Zmc2V0PTIwIHhhZHZhbmNlPTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTg0IHg9NDggeT04NiB3aWR0aD01IGhlaWdodD01IHhvZmZzZXQ9NCB5b2Zmc2V0PTMyIHhhZHZhbmNlPTEwIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE4NSB4PTEyOSB5PTEyNCB3aWR0aD01IGhlaWdodD0xMiB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTcgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTg2IHg9MjAgeT0yNDEgd2lkdGg9MTAgaGVpZ2h0PTEwIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MTIgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTg3IHg9NTYgeT0yMzkgd2lkdGg9MTcgaGVpZ2h0PTE0IHhvZmZzZXQ9MSB5b2Zmc2V0PTE1IHhhZHZhbmNlPTE5IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE4OCB4PTE4NiB5PTE4MiB3aWR0aD0yMSBoZWlnaHQ9MjUgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0yMyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xODkgeD0xOTQgeT0xNDQgd2lkdGg9MjEgaGVpZ2h0PTI1IHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MjMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTkwIHg9MTg2IHk9MjEwIHdpZHRoPTI3IGhlaWdodD0yNiB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTI5IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE5MSB4PTIxMCB5PTE3MiB3aWR0aD0xMiBoZWlnaHQ9MjQgeG9mZnNldD0yIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MTQgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTkyIHg9MjE2IHk9MTk5IHdpZHRoPTIwIGhlaWdodD0zMSB4b2Zmc2V0PTAgeW9mZnNldD0xIHhhZHZhbmNlPTIwIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE5MyB4PTIwNyB5PTc1IHdpZHRoPTIwIGhlaWdodD0zMSB4b2Zmc2V0PTAgeW9mZnNldD0xIHhhZHZhbmNlPTIwIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTE5NCB4PTIwNyB5PTEwOSB3aWR0aD0yMCBoZWlnaHQ9MzEgeG9mZnNldD0wIHlvZmZzZXQ9MCB4YWR2YW5jZT0yMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xOTUgeD0yMTUgeT0zMyB3aWR0aD0yMCBoZWlnaHQ9MzAgeG9mZnNldD0wIHlvZmZzZXQ9MSB4YWR2YW5jZT0yMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xOTYgeD0yMjUgeT0xNDMgd2lkdGg9MjAgaGVpZ2h0PTI5IHhvZmZzZXQ9MCB5b2Zmc2V0PTIgeGFkdmFuY2U9MjAgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTk3IHg9MjMwIHk9NjYgd2lkdGg9MjAgaGVpZ2h0PTMxIHhvZmZzZXQ9MCB5b2Zmc2V0PTAgeGFkdmFuY2U9MjAgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MTk4IHg9MjE4IHk9MyB3aWR0aD0yNyBoZWlnaHQ9MjMgeG9mZnNldD0wIHlvZmZzZXQ9OCB4YWR2YW5jZT0yOCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0xOTkgeD0yMzggeT0yOSB3aWR0aD0xOCBoZWlnaHQ9MjkgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0yMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMDAgeD0yMzAgeT0xMDAgd2lkdGg9MTUgaGVpZ2h0PTMxIHhvZmZzZXQ9MyB5b2Zmc2V0PTEgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjAxIHg9MjM5IHk9MTc1IHdpZHRoPTE1IGhlaWdodD0zMSB4b2Zmc2V0PTMgeW9mZnNldD0xIHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIwMiB4PTIzOSB5PTIwOSB3aWR0aD0xNSBoZWlnaHQ9MzEgeG9mZnNldD0zIHlvZmZzZXQ9MCB4YWR2YW5jZT0xOCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMDMgeD0yNDggeT0xMDAgd2lkdGg9MTUgaGVpZ2h0PTI5IHhvZmZzZXQ9MyB5b2Zmc2V0PTIgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjA0IHg9MjUzIHk9NjEgd2lkdGg9NiBoZWlnaHQ9MzEgeG9mZnNldD0xIHlvZmZzZXQ9MSB4YWR2YW5jZT04IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIwNSB4PTI0OCB5PTEzMiB3aWR0aD02IGhlaWdodD0zMSB4b2Zmc2V0PTEgeW9mZnNldD0xIHhhZHZhbmNlPTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjA2IHg9MjU5IHk9MyB3aWR0aD0xMCBoZWlnaHQ9MzEgeG9mZnNldD0wIHlvZmZzZXQ9MCB4YWR2YW5jZT04IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIwNyB4PTI2MiB5PTM3IHdpZHRoPTggaGVpZ2h0PTI5IHhvZmZzZXQ9MCB5b2Zmc2V0PTIgeGFkdmFuY2U9OCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMDggeD0yNjIgeT02OSB3aWR0aD0yMyBoZWlnaHQ9MjMgeG9mZnNldD0wIHlvZmZzZXQ9OCB4YWR2YW5jZT0yMyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMDkgeD0yNzIgeT0zIHdpZHRoPTE4IGhlaWdodD0zMCB4b2Zmc2V0PTMgeW9mZnNldD0xIHhhZHZhbmNlPTIzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIxMCB4PTI1NyB5PTEzMiB3aWR0aD0yMiBoZWlnaHQ9MzEgeG9mZnNldD0xIHlvZmZzZXQ9MSB4YWR2YW5jZT0yNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMTEgeD0yNjYgeT05NSB3aWR0aD0yMiBoZWlnaHQ9MzEgeG9mZnNldD0xIHlvZmZzZXQ9MSB4YWR2YW5jZT0yNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMTIgeD0yODggeT0zNiB3aWR0aD0yMiBoZWlnaHQ9MzEgeG9mZnNldD0xIHlvZmZzZXQ9MCB4YWR2YW5jZT0yNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMTMgeD0yOTMgeT0zIHdpZHRoPTIyIGhlaWdodD0zMCB4b2Zmc2V0PTEgeW9mZnNldD0xIHhhZHZhbmNlPTI1IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIxNCB4PTI1NyB5PTE2NiB3aWR0aD0yMiBoZWlnaHQ9MzAgeG9mZnNldD0xIHlvZmZzZXQ9MiB4YWR2YW5jZT0yNSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMTUgeD0yMjUgeT0xNzUgd2lkdGg9MTEgaGVpZ2h0PTExIHhvZmZzZXQ9MiB5b2Zmc2V0PTE3IHhhZHZhbmNlPTE0IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIxNiB4PTI1NyB5PTE5OSB3aWR0aD0yMiBoZWlnaHQ9MjQgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0yNCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMTcgeD0yODIgeT0xMjkgd2lkdGg9MTkgaGVpZ2h0PTMxIHhvZmZzZXQ9MiB5b2Zmc2V0PTEgeGFkdmFuY2U9MjMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjE4IHg9MjkxIHk9NzAgd2lkdGg9MTkgaGVpZ2h0PTMxIHhvZmZzZXQ9MiB5b2Zmc2V0PTEgeGFkdmFuY2U9MjMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjE5IHg9MjgyIHk9MTYzIHdpZHRoPTE5IGhlaWdodD0zMSB4b2Zmc2V0PTIgeW9mZnNldD0wIHhhZHZhbmNlPTIzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIyMCB4PTI4MiB5PTE5NyB3aWR0aD0xOSBoZWlnaHQ9MzAgeG9mZnNldD0yIHlvZmZzZXQ9MiB4YWR2YW5jZT0yMyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMjEgeD0zMDQgeT0xMDQgd2lkdGg9MTkgaGVpZ2h0PTMxIHhvZmZzZXQ9MCB5b2Zmc2V0PTEgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjIyIHg9MjU3IHk9MjMwIHdpZHRoPTE1IGhlaWdodD0yMyB4b2Zmc2V0PTMgeW9mZnNldD04IHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIyMyB4PTMxMyB5PTM2IHdpZHRoPTE3IGhlaWdodD0yOSB4b2Zmc2V0PTAgeW9mZnNldD03IHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIyNCB4PTMxOCB5PTMgd2lkdGg9MTUgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjI1IHg9MzEzIHk9Njggd2lkdGg9MTUgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjI2IHg9MzA0IHk9MTM4IHdpZHRoPTE1IGhlaWdodD0yNSB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIyNyB4PTI3NSB5PTIzMCB3aWR0aD0xNSBoZWlnaHQ9MjMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMjggeD0yOTMgeT0yMzAgd2lkdGg9MTUgaGVpZ2h0PTIzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjI5IHg9MzA0IHk9MTY2IHdpZHRoPTE1IGhlaWdodD0yNSB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIzMCB4PTMwNCB5PTE5NCB3aWR0aD0yNCBoZWlnaHQ9MTcgeG9mZnNldD0xIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MjYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjMxIHg9MzExIHk9MjE0IHdpZHRoPTEzIGhlaWdodD0yMyB4b2Zmc2V0PTEgeW9mZnNldD0xNSB4YWR2YW5jZT0xNCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMzIgeD0zMjcgeT0yMTQgd2lkdGg9MTUgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjMzIHg9MzIyIHk9MTM4IHdpZHRoPTE1IGhlaWdodD0yNCB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIzNCB4PTMyMiB5PTE2NSB3aWR0aD0xNSBoZWlnaHQ9MjUgeG9mZnNldD0xIHlvZmZzZXQ9NyB4YWR2YW5jZT0xNiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMzUgeD0zMjYgeT05NSB3aWR0aD0xNSBoZWlnaHQ9MjMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yMzYgeD0zMzEgeT02OCB3aWR0aD02IGhlaWdodD0yNCB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTcgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjM3IHg9MjczIHk9MzYgd2lkdGg9NiBoZWlnaHQ9MjQgeG9mZnNldD0xIHlvZmZzZXQ9NyB4YWR2YW5jZT03IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIzOCB4PTMzMyB5PTMwIHdpZHRoPTEwIGhlaWdodD0yNCB4b2Zmc2V0PS0xIHlvZmZzZXQ9NyB4YWR2YW5jZT03IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTIzOSB4PTI0OCB5PTMgd2lkdGg9OCBoZWlnaHQ9MjMgeG9mZnNldD0wIHlvZmZzZXQ9OCB4YWR2YW5jZT03IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTI0MCB4PTMzNiB5PTMgd2lkdGg9MTUgaGVpZ2h0PTIzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MTcgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjQxIHg9MzQwIHk9NTcgd2lkdGg9MTQgaGVpZ2h0PTIzIHhvZmZzZXQ9MiB5b2Zmc2V0PTggeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjQyIHg9MzQ2IHk9Mjkgd2lkdGg9MTYgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjQzIHg9MzQwIHk9MTIxIHdpZHRoPTE2IGhlaWdodD0yNCB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTI0NCB4PTM0NCB5PTgzIHdpZHRoPTE2IGhlaWdodD0yNSB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTI0NSB4PTM1NCB5PTMgd2lkdGg9MTYgaGVpZ2h0PTIzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjQ2IHg9MzU3IHk9NTYgd2lkdGg9MTYgaGVpZ2h0PTIzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjQ3IHg9MzMxIHk9MTkzIHdpZHRoPTE1IGhlaWdodD0xNyB4b2Zmc2V0PTIgeW9mZnNldD0xNCB4YWR2YW5jZT0xOSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yNDggeD0yMTYgeT0yMzMgd2lkdGg9MTcgaGVpZ2h0PTE5IHhvZmZzZXQ9MSB5b2Zmc2V0PTE0IHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTI0OSB4PTM2NSB5PTI5IHdpZHRoPTE0IGhlaWdodD0yNCB4b2Zmc2V0PTIgeW9mZnNldD03IHhhZHZhbmNlPTE3IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTI1MCB4PTM0NSB5PTIxMyB3aWR0aD0xNCBoZWlnaHQ9MjQgeG9mZnNldD0yIHlvZmZzZXQ9NyB4YWR2YW5jZT0xNyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yNTEgeD0zNDAgeT0xNDggd2lkdGg9MTQgaGVpZ2h0PTI1IHhvZmZzZXQ9MiB5b2Zmc2V0PTcgeGFkdmFuY2U9MTcgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjUyIHg9MzczIHk9MyB3aWR0aD0xNCBoZWlnaHQ9MjMgeG9mZnNldD0yIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0yNTMgeD0zNDkgeT0xNzYgd2lkdGg9MTcgaGVpZ2h0PTMyIHhvZmZzZXQ9MCB5b2Zmc2V0PTcgeGFkdmFuY2U9MTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MjU0IHg9MzYyIHk9MjExIHdpZHRoPTE2IGhlaWdodD0zMiB4b2Zmc2V0PTIgeW9mZnNldD03IHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTI1NSB4PTM1OSB5PTExMSB3aWR0aD0xNyBoZWlnaHQ9MzAgeG9mZnNldD0wIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0zMDUgeD0xMjUgeT0xNzMgd2lkdGg9NCBoZWlnaHQ9MTYgeG9mZnNldD0yIHlvZmZzZXQ9MTUgeGFkdmFuY2U9NyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0zMzggeD0zNTcgeT0xNDggd2lkdGg9MzIgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MzQgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MzM5IHg9MzYzIHk9ODIgd2lkdGg9MjcgaGVpZ2h0PTE3IHhvZmZzZXQ9MSB5b2Zmc2V0PTE1IHhhZHZhbmNlPTI5IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTM1MiB4PTM2OSB5PTE3NSB3aWR0aD0xNyBoZWlnaHQ9MzEgeG9mZnNldD0xIHlvZmZzZXQ9MCB4YWR2YW5jZT0xOSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0zNTMgeD0zNzkgeT0xMDIgd2lkdGg9MTIgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9Mzc2IHg9MzgxIHk9MjA5IHdpZHRoPTE5IGhlaWdodD0yOSB4b2Zmc2V0PTAgeW9mZnNldD0yIHhhZHZhbmNlPTE4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTM4MSB4PTM4OSB5PTE3NSB3aWR0aD0xNyBoZWlnaHQ9MzEgeG9mZnNldD0wIHlvZmZzZXQ9MCB4YWR2YW5jZT0xOCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD0zODIgeD0zOTIgeT0xMjkgd2lkdGg9MTQgaGVpZ2h0PTI0IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9MTUgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NDAyIHg9NDAzIHk9MjA5IHdpZHRoPTEzIGhlaWdodD0zMSB4b2Zmc2V0PS0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xMSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD01NjcgeD0zODIgeT0yOSB3aWR0aD02IGhlaWdodD0yNCB4b2Zmc2V0PTAgeW9mZnNldD0xNSB4YWR2YW5jZT03IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTcxMCB4PTMxMyB5PTk1IHdpZHRoPTEwIGhlaWdodD01IHhvZmZzZXQ9MiB5b2Zmc2V0PTcgeGFkdmFuY2U9MTQgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9NzExIHg9NjMgeT0xNjcgd2lkdGg9MTAgaGVpZ2h0PTUgeG9mZnNldD0yIHlvZmZzZXQ9NyB4YWR2YW5jZT0xNCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD03MzAgeD0yMTUgeT02NiB3aWR0aD03IGhlaWdodD02IHhvZmZzZXQ9MSB5b2Zmc2V0PTcgeGFkdmFuY2U9OSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD03MzIgeD0zNDQgeT0xMTEgd2lkdGg9MTIgaGVpZ2h0PTQgeG9mZnNldD0zIHlvZmZzZXQ9OCB4YWR2YW5jZT0xNyBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MjExIHg9MzYzIHk9MTAyIHdpZHRoPTEzIGhlaWdodD0zIHhvZmZzZXQ9MiB5b2Zmc2V0PTIwIHhhZHZhbmNlPTE2IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgyMTIgeD0yMzYgeT0yNDMgd2lkdGg9MTYgaGVpZ2h0PTMgeG9mZnNldD0yIHlvZmZzZXQ9MjAgeGFkdmFuY2U9MTkgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODIxNiB4PTMzMyB5PTU3IHdpZHRoPTQgaGVpZ2h0PTcgeG9mZnNldD0xIHlvZmZzZXQ9NyB4YWR2YW5jZT02IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgyMTcgeD0zMDQgeT0yMTQgd2lkdGg9NCBoZWlnaHQ9NyB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTYgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODIxOCB4PTIyNSB5PTE4OSB3aWR0aD00IGhlaWdodD03IHhvZmZzZXQ9MiB5b2Zmc2V0PTI4IHhhZHZhbmNlPTcgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODIyMCB4PTE5NCB5PTE3MiB3aWR0aD0xMSBoZWlnaHQ9NyB4b2Zmc2V0PTEgeW9mZnNldD03IHhhZHZhbmNlPTEzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgyMjEgeD0xMTEgeT0xMDMgd2lkdGg9MTEgaGVpZ2h0PTcgeG9mZnNldD0xIHlvZmZzZXQ9NyB4YWR2YW5jZT0xMiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MjIyIHg9MzI2IHk9MTIxIHdpZHRoPTExIGhlaWdodD03IHhvZmZzZXQ9MiB5b2Zmc2V0PTI4IHhhZHZhbmNlPTE0IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgyMjQgeD0zOTAgeT0zIHdpZHRoPTEyIGhlaWdodD0yMCB4b2Zmc2V0PTEgeW9mZnNldD0xMSB4YWR2YW5jZT0xNCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MjI1IHg9Mzc2IHk9NTYgd2lkdGg9MTIgaGVpZ2h0PTIyIHhvZmZzZXQ9MiB5b2Zmc2V0PTExIHhhZHZhbmNlPTE1IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgyMjYgeD0xOTcgeT05NCB3aWR0aD03IGhlaWdodD03IHhvZmZzZXQ9MSB5b2Zmc2V0PTE4IHhhZHZhbmNlPTEwIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgyMzAgeD0zODEgeT0yNDEgd2lkdGg9MTkgaGVpZ2h0PTQgeG9mZnNldD0yIHlvZmZzZXQ9MjggeGFkdmFuY2U9MjIgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODI0MCB4PTM5MSB5PTI2IHdpZHRoPTM3IGhlaWdodD0yMyB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTM4IHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgyNDkgeD0xODYgeT0yMzkgd2lkdGg9OSBoZWlnaHQ9MTQgeG9mZnNldD0wIHlvZmZzZXQ9MTUgeGFkdmFuY2U9MTEgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODI1MCB4PTE5OCB5PTIzOSB3aWR0aD05IGhlaWdodD0xNCB4b2Zmc2V0PTEgeW9mZnNldD0xNSB4YWR2YW5jZT0xMSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MzA0IHg9MzExIHk9MjQwIHdpZHRoPTExIGhlaWdodD0xMyB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTEzIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgzMDggeD0zNzkgeT0xMjkgd2lkdGg9MTAgaGVpZ2h0PTEyIHhvZmZzZXQ9MCB5b2Zmc2V0PTggeGFkdmFuY2U9MTEgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODMwOSB4PTM0NSB5PTI0MCB3aWR0aD05IGhlaWdodD0xMyB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTEwIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgzMTAgeD0yOTEgeT0xMDQgd2lkdGg9OSBoZWlnaHQ9MTMgeG9mZnNldD0xIHlvZmZzZXQ9OCB4YWR2YW5jZT0xMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MzExIHg9MzI1IHk9MjQxIHdpZHRoPTkgaGVpZ2h0PTEyIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9OSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MzEyIHg9MzkyIHk9MTU2IHdpZHRoPTkgaGVpZ2h0PTEzIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MTEgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODMxMyB4PTQwNCB5PTE1NiB3aWR0aD05IGhlaWdodD0xMyB4b2Zmc2V0PTEgeW9mZnNldD04IHhhZHZhbmNlPTEwIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgzMjAgeD00MDUgeT0zIHdpZHRoPTExIGhlaWdodD0xMyB4b2Zmc2V0PTEgeW9mZnNldD0xOCB4YWR2YW5jZT0xNCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MzIxIHg9MzM3IHk9MjQxIHdpZHRoPTUgaGVpZ2h0PTEyIHhvZmZzZXQ9MSB5b2Zmc2V0PTE5IHhhZHZhbmNlPTggcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODMyMiB4PTE3NSB5PTE4MiB3aWR0aD04IGhlaWdodD0xMyB4b2Zmc2V0PTEgeW9mZnNldD0xOCB4YWR2YW5jZT0xMSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MzIzIHg9NDE5IHk9MyB3aWR0aD05IGhlaWdodD0xMyB4b2Zmc2V0PTEgeW9mZnNldD0xOCB4YWR2YW5jZT0xMSBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MzI0IHg9MzkxIHk9NTIgd2lkdGg9MTAgaGVpZ2h0PTEyIHhvZmZzZXQ9MSB5b2Zmc2V0PTE5IHhhZHZhbmNlPTEyIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgzMjUgeD0zOTMgeT02NyB3aWR0aD05IGhlaWdodD0xMyB4b2Zmc2V0PTEgeW9mZnNldD0xOSB4YWR2YW5jZT0xMCBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MzI2IHg9MzkzIHk9ODMgd2lkdGg9OSBoZWlnaHQ9MTMgeG9mZnNldD0xIHlvZmZzZXQ9MTkgeGFkdmFuY2U9MTEgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODMyNyB4PTQwNCB5PTUyIHdpZHRoPTkgaGVpZ2h0PTEyIHhvZmZzZXQ9MSB5b2Zmc2V0PTE5IHhhZHZhbmNlPTExIHBhZ2U9MCBjaG5sPTE1DQpjaGFyIGlkPTgzMjggeD0zOTQgeT05OSB3aWR0aD05IGhlaWdodD0xMyB4b2Zmc2V0PTEgeW9mZnNldD0xOCB4YWR2YW5jZT0xMiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04MzI5IHg9NDA1IHk9Njcgd2lkdGg9OSBoZWlnaHQ9MTMgeG9mZnNldD0xIHlvZmZzZXQ9MTggeGFkdmFuY2U9MTEgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9ODM2NCB4PTQwOSB5PTE3MiB3aWR0aD0yMCBoZWlnaHQ9MjIgeG9mZnNldD0xIHlvZmZzZXQ9OSB4YWR2YW5jZT0yMiBwYWdlPTAgY2hubD0xNQ0KY2hhciBpZD04NDgyIHg9NDE2IHk9NTIgd2lkdGg9MjEgaGVpZ2h0PTEyIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9MjMgcGFnZT0wIGNobmw9MTUNCmNoYXIgaWQ9MzIgeD0wIHk9MCB3aWR0aD0wIGhlaWdodD0wIHhvZmZzZXQ9MSB5b2Zmc2V0PTggeGFkdmFuY2U9NyBwYWdlPTAgY2hubD0xNQ0Ka2VybmluZ3MgY291bnQ9MTcyMg0Ka2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MzggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTQ0IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9NDUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTM0IHNlY29uZD00NiBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTQ3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9NTIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTU0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTM0IHNlY29uZD02NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTY1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9NzcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTM0IHNlY29uZD05NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9OTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xMDMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTExNSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0zNCBzZWNvbmQ9MTcxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0xOTggYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTM0IHNlY29uZD0yMzggYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MzQgc2Vjb25kPTgyMTggYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTM4IHNlY29uZD0zNCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Mzggc2Vjb25kPTg0IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0zOCBzZWNvbmQ9ODUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Mzggc2Vjb25kPTg2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0zOCBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTM4IHNlY29uZD04OSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9Mzggc2Vjb25kPTk5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTM4IHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Mzggc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0zOCBzZWNvbmQ9MTE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0zOCBzZWNvbmQ9MTE3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTM4IHNlY29uZD0xMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Mzggc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0zOCBzZWNvbmQ9MTIxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0zOCBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTM4IHNlY29uZD04MjE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0zOSBzZWNvbmQ9MjM4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTQwIHNlY29uZD00OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTQ5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQwIHNlY29uZD01MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTU0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00MCBzZWNvbmQ9NTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQwIHNlY29uZD01NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00MCBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTY3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00MCBzZWNvbmQ9NjkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTc0IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTQwIHNlY29uZD03NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQwIHNlY29uZD04NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00MCBzZWNvbmQ9OTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQwIHNlY29uZD05OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTEwMiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTEwMyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTEwOSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTExNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTExNiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTExNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTExOCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTExOSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTEyMSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDAgc2Vjb25kPTEyMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00MCBzZWNvbmQ9MjIzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00MCBzZWNvbmQ9MjQwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00MiBzZWNvbmQ9NzcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQyIHNlY29uZD04NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00MiBzZWNvbmQ9ODYgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9NDIgc2Vjb25kPTEwMyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDIgc2Vjb25kPTE5OCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NDIgc2Vjb25kPTIzNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00MiBzZWNvbmQ9MjM3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQyIHNlY29uZD0yMzggYW1vdW50PTINCmtlcm5pbmcgZmlyc3Q9NDIgc2Vjb25kPTIzOSBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD00MiBzZWNvbmQ9MjQwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00MyBzZWNvbmQ9NDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQzIHNlY29uZD01MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDMgc2Vjb25kPTUxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQzIHNlY29uZD01NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDQgc2Vjb25kPTM0IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD00NCBzZWNvbmQ9NDkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDQgc2Vjb25kPTU3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ0IHNlY29uZD04MjE2IGFtb3VudD0tNA0Ka2VybmluZyBmaXJzdD00NCBzZWNvbmQ9ODIxNyBhbW91bnQ9LTQNCmtlcm5pbmcgZmlyc3Q9NDUgc2Vjb25kPTM0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NSBzZWNvbmQ9ODQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQ1IHNlY29uZD04NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDUgc2Vjb25kPTg4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ1IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDUgc2Vjb25kPTkwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NSBzZWNvbmQ9MTIwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ1IHNlY29uZD0xMjIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQ1IHNlY29uZD04MjE3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD00NiBzZWNvbmQ9MzQgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTQ2IHNlY29uZD00OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00NiBzZWNvbmQ9NTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDYgc2Vjb25kPTY3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ2IHNlY29uZD04NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDYgc2Vjb25kPTg1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ2IHNlY29uZD04NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDYgc2Vjb25kPTg3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NiBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQ2IHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDYgc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00NiBzZWNvbmQ9MTE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NiBzZWNvbmQ9MTE5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NiBzZWNvbmQ9MTIxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NiBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ2IHNlY29uZD04MjE2IGFtb3VudD0tNA0Ka2VybmluZyBmaXJzdD00NiBzZWNvbmQ9ODIxNyBhbW91bnQ9LTQNCmtlcm5pbmcgZmlyc3Q9NDcgc2Vjb25kPTQ3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9NDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDcgc2Vjb25kPTUyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9NTQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQ3IHNlY29uZD02NSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NDcgc2Vjb25kPTY3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ3IHNlY29uZD03NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDcgc2Vjb25kPTg5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ3IHNlY29uZD05NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDcgc2Vjb25kPTk5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9MTAzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9MTA5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9MTE1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9MTE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9MTIyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ3IHNlY29uZD0xOTggYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTQ3IHNlY29uZD0yMzggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDcgc2Vjb25kPTIzOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9MjQwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00NyBzZWNvbmQ9MzUzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00OCBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQ4IHNlY29uZD00NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00OCBzZWNvbmQ9NTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDggc2Vjb25kPTY1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ4IHNlY29uZD04NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NDggc2Vjb25kPTg2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ4IHNlY29uZD04OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00OCBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTQ4IHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD00OCBzZWNvbmQ9OTIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NDggc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD00OCBzZWNvbmQ9MTI1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTQ5IHNlY29uZD00MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD01MCBzZWNvbmQ9NDMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTEgc2Vjb25kPTQxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01MSBzZWNvbmQ9ODkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTIgc2Vjb25kPTM0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTUyIHNlY29uZD00MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NTIgc2Vjb25kPTg0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01MiBzZWNvbmQ9ODYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTIgc2Vjb25kPTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTUyIHNlY29uZD04OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD01MiBzZWNvbmQ9OTAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTIgc2Vjb25kPTkyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTUyIHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTIgc2Vjb25kPTE3NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD01NCBzZWNvbmQ9MzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTQgc2Vjb25kPTQxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NCBzZWNvbmQ9NDkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTQgc2Vjb25kPTg0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NCBzZWNvbmQ9ODYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTQgc2Vjb25kPTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTU0IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NTQgc2Vjb25kPTkyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTU1IHNlY29uZD0zNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NTUgc2Vjb25kPTQzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9NDQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTU1IHNlY29uZD00NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NTUgc2Vjb25kPTQ3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9NDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NTUgc2Vjb25kPTUyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9NTQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTU1IHNlY29uZD02MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9NjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTU1IHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9NzcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTU1IHNlY29uZD04NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9ODYgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9NTUgc2Vjb25kPTg3IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTU1IHNlY29uZD04OCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9ODkgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9NTUgc2Vjb25kPTkzIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTU1IHNlY29uZD05NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NTUgc2Vjb25kPTk5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9MTAzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9MTA5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9MTE1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9MTE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NSBzZWNvbmQ9MTIyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTU1IHNlY29uZD0xMjUgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9NTUgc2Vjb25kPTE4MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD01NiBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTU2IHNlY29uZD04OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD01NyBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTU3IHNlY29uZD00NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NTcgc2Vjb25kPTQ2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD01NyBzZWNvbmQ9NDcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTU3IHNlY29uZD02NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NTcgc2Vjb25kPTc3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTU3IHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02MSBzZWNvbmQ9NTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjQgc2Vjb25kPTM0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY0IHNlY29uZD04NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NjQgc2Vjb25kPTg2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02NCBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY0IHNlY29uZD04OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NCBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY0IHNlY29uZD05MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NjQgc2Vjb25kPTgyMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0zNCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTQyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02NSBzZWNvbmQ9NDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD01NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NSBzZWNvbmQ9NjMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTY3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD04NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTg1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02NSBzZWNvbmQ9ODYgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD04NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTg5IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD02NSBzZWNvbmQ9OTIgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD05OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MTAyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0xMDMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MTE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02NSBzZWNvbmQ9MTE3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0xMTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0xMTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0xMjEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD0xNzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NSBzZWNvbmQ9ODIxNiBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NjUgc2Vjb25kPTgyMTcgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTY1IHNlY29uZD04NDgyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD00MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9NTAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTU1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD02MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9ODQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD04NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD04OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTg5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9OTAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTkyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD05MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTk4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTEwMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9MTA1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD0xMDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTEwOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9MTE1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD0xMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTExNyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9MTE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9MTE5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD0xMjAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD0xMjEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NjYgc2Vjb25kPTE5OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NiBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY2IHNlY29uZD04NDgyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY3IHNlY29uZD00NSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9Njcgc2Vjb25kPTUyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02NyBzZWNvbmQ9NjcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njcgc2Vjb25kPTk5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY3IHNlY29uZD0xMDMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njcgc2Vjb25kPTEwOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02NyBzZWNvbmQ9MTE2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY3IHNlY29uZD0xMTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njcgc2Vjb25kPTE3MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Njcgc2Vjb25kPTIzOCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD02NyBzZWNvbmQ9MjM5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD00MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTQ0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD00NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9NDcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD01MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9NTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTYzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9NjUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTc3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD04NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTg2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD04NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9ODggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTkwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9OTIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9OTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTk4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD05OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD0xMDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9MTA5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD0xMTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTExNyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9MTIwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTE5OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Njggc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OCBzZWNvbmQ9MjQwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD04MjE4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY4IHNlY29uZD04NDgyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY5IHNlY29uZD00NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OSBzZWNvbmQ9NTIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTY5IHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OSBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njkgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OSBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY5IHNlY29uZD0xMDkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njkgc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OSBzZWNvbmQ9MTE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02OSBzZWNvbmQ9MTE4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY5IHNlY29uZD0xMTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Njkgc2Vjb25kPTEyMSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD02OSBzZWNvbmQ9MTcxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD02OSBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTY5IHNlY29uZD0yMzggYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9Njkgc2Vjb25kPTI0MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MzggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTQyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD00NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTQ2IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9NDcgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD01MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTU0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD01OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9NTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTY0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9NjUgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9NzcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD05MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9OTcgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD05OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9OTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTEwMyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTEwNSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTA4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xMDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xMTUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTExNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTE5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xMjAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTEyMSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTIyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MTI1IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0xNzEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTE4NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTE5OCBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MCBzZWNvbmQ9MjM4IGFtb3VudD0yDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD0yMzkgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzAgc2Vjb25kPTgyMTggYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTcwIHNlY29uZD04NDgyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcxIHNlY29uZD00MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MSBzZWNvbmQ9ODQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzEgc2Vjb25kPTk4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcxIHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzEgc2Vjb25kPTEwMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MSBzZWNvbmQ9MTA1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcxIHNlY29uZD0xMDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzEgc2Vjb25kPTEwOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MSBzZWNvbmQ9MTE2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcxIHNlY29uZD0xMTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzEgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MSBzZWNvbmQ9MTE5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcxIHNlY29uZD0xMjEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzEgc2Vjb25kPTEyMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MSBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcyIHNlY29uZD00MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MiBzZWNvbmQ9NzcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzIgc2Vjb25kPTk3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcyIHNlY29uZD05OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MiBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzIgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MiBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcyIHNlY29uZD0xMDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzIgc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MiBzZWNvbmQ9MTA5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcyIHNlY29uZD0xMTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzIgc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MiBzZWNvbmQ9MTE3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcyIHNlY29uZD0xMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzIgc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MiBzZWNvbmQ9MTIxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTcyIHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzIgc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03MiBzZWNvbmQ9MjQwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc0IHNlY29uZD00MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NCBzZWNvbmQ9NzcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzQgc2Vjb25kPTk3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc0IHNlY29uZD05OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NCBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzQgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NCBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc0IHNlY29uZD0xMDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzQgc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NCBzZWNvbmQ9MTA5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc0IHNlY29uZD0xMTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzQgc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NCBzZWNvbmQ9MTE3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc0IHNlY29uZD0xMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzQgc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NCBzZWNvbmQ9MTIxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc0IHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzQgc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NCBzZWNvbmQ9MjQwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NSBzZWNvbmQ9NDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTQ1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc1IHNlY29uZD02NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc1IHNlY29uZD05MyBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD03NSBzZWNvbmQ9OTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTEwMyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTExNiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTExNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTExOCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTExOSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTEyMSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTEyNSBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MTcxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MTc0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0yMzYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTIzOCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD03NSBzZWNvbmQ9MjM5IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTc1IHNlY29uZD0yNDAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzUgc2Vjb25kPTg0ODIgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTM0IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9NDIgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD00NSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTQ4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD00OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTUyIGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9NTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD02MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTY3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODQgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODYgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04NyBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTg5IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9OTIgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD05MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0xMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD0xMTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTExOCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTExOSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTEyMSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTEyNSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTcxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTc0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MTgzIGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc2IHNlY29uZD04MjE2IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD03NiBzZWNvbmQ9ODIxNyBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9NzYgc2Vjb25kPTg0ODIgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD0zNCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTQxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD00MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTQ5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD02MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTY3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD02OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTg0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9ODUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTg2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTkyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9OTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTk4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD05OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9MTAyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD0xMDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9MTA5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD0xMTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTExNiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTExNyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9MTE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9MTE5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9MTIxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9MTIyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD0yMjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD0yNDAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzcgc2Vjb25kPTgyMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTc3IHNlY29uZD04MjE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03NyBzZWNvbmQ9ODQ4MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTQxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03OSBzZWNvbmQ9NDQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTQ2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD00NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTU1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD02MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03OSBzZWNvbmQ9NjUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTc3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD04NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTg2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD04NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03OSBzZWNvbmQ9ODggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTkwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03OSBzZWNvbmQ9OTIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD03OSBzZWNvbmQ9OTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTk4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD05OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03OSBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD0xMDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03OSBzZWNvbmQ9MTA5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD0xMTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTExNyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD03OSBzZWNvbmQ9MTIwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTc5IHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTE5OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTgyMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9Nzkgc2Vjb25kPTg0ODIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTM4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD00MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9NDQgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD00NiBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTQ3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9NTEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTUyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD02NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9NjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9ODggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9OTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTk4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD05OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xMDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTA5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0xMTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTExNyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MTk4IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04MCBzZWNvbmQ9MjM4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTgwIHNlY29uZD0yMzkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODAgc2Vjb25kPTgyMTggYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTgyIHNlY29uZD01MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTg0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyIHNlY29uZD04NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MiBzZWNvbmQ9ODkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTk3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyIHNlY29uZD05OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MiBzZWNvbmQ9OTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyIHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTEwMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MiBzZWNvbmQ9MTA1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyIHNlY29uZD0xMDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTEwOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MiBzZWNvbmQ9MTE2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyIHNlY29uZD0xMTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MiBzZWNvbmQ9MTE5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyIHNlY29uZD0xMjEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIgc2Vjb25kPTE3MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MiBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyIHNlY29uZD0yNDAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODMgc2Vjb25kPTQxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgzIHNlY29uZD04OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MyBzZWNvbmQ9OTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODMgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MyBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgzIHNlY29uZD0xMDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODMgc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MyBzZWNvbmQ9MTA5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgzIHNlY29uZD0xMTUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODMgc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MyBzZWNvbmQ9MTE3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgzIHNlY29uZD0xMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODMgc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MyBzZWNvbmQ9MTIwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgzIHNlY29uZD0xMjEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODMgc2Vjb25kPTEyMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MyBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTQ0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NDUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg0IHNlY29uZD00NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTQ3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NDggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg0IHNlY29uZD01MiBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTU0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg0IHNlY29uZD01OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTY0IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9NjUgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTg0IHNlY29uZD02NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTc3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9OTMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTk3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9OTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTk5IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTAyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTAzIGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTA1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0xMDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEwOSBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExNSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExNiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExNyBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExOCBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTExOSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEyMCBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEyMSBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEyMiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTEyNSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTcxIGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTc0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTg3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MTk4IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjIzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjI3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NCBzZWNvbmQ9MjM4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg0IHNlY29uZD0yMzkgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTI1NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTM1MyBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODQgc2Vjb25kPTgyMTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg0IHNlY29uZD04NDgyIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD00MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NSBzZWNvbmQ9NDQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTQ2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD00NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTY1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NSBzZWNvbmQ9NzcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTkwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD05NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NSBzZWNvbmQ9OTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTk5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTEwMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NSBzZWNvbmQ9MTA1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD0xMDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTEwOSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTExNSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NSBzZWNvbmQ9MTE2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD0xMTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NSBzZWNvbmQ9MTE5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD0xMjAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTEyMSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NSBzZWNvbmQ9MTIyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD0xOTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg1IHNlY29uZD0yMjMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODUgc2Vjb25kPTI0MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NSBzZWNvbmQ9ODIxOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MzggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTQyIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD00NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTQ1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9NDYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD00NyBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTQ4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD01MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTU0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9NTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTU5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD02MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9NjQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD02NSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTY3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD03NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTkzIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD05NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTk5IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTAyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMDMgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMTUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTIwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xMjEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTEyMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTI1IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xNzEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0xNzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTE4NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MTk4IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yMzYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODYgc2Vjb25kPTIzOCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9MjM5IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0yNDAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD0zNTMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg2IHNlY29uZD04MjE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NiBzZWNvbmQ9ODQ4MiBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MzggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTQyIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD00NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTQ1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD00NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTQ3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NyBzZWNvbmQ9NTIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD01NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NyBzZWNvbmQ9NjQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD02NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTY3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD03NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTkzIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD05NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTk5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTAyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xMDMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xMDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xMTUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTExNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTE5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xMjAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTEyMSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MTIyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0xMjUgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE3MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTE5OCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NyBzZWNvbmQ9MjM4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD0yMzkgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODcgc2Vjb25kPTgyMTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg3IHNlY29uZD04NDgyIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg4IHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9NDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODggc2Vjb25kPTY3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9ODMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODggc2Vjb25kPTkzIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg4IHNlY29uZD05OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODggc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MTAzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MTE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MTE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MTE4IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MTE5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MTIxIGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MTI1IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg4IHNlY29uZD0xNzEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg4IHNlY29uZD0xNzQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg4IHNlY29uZD0yMjMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODggc2Vjb25kPTIzOCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD04OCBzZWNvbmQ9MjM5IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg4IHNlY29uZD0yNDAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODggc2Vjb25kPTg0ODIgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTM4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTQ0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NDUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD00NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTQ3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NDggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD01MiBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTU0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTU4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD02MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NjQgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD02NSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTY3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9NzcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD05MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9OTMgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTk3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9OTkgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMDIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMDMgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMDkgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTUgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTcgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMjAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMjEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMjIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0xMjUgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE3MSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE3NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE4NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTE5OCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIyMyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTIzNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04OSBzZWNvbmQ9MjM4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD0yMzkgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTI1NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTM1MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODkgc2Vjb25kPTgyMTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTg5IHNlY29uZD04NDgyIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD00NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTAgc2Vjb25kPTQ4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD01MiBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9OTAgc2Vjb25kPTU0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD02NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTAgc2Vjb25kPTkzIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD05NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05MCBzZWNvbmQ9OTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTAgc2Vjb25kPTk5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MCBzZWNvbmQ9MTAyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0xMDMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0xMDUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTAgc2Vjb25kPTEwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05MCBzZWNvbmQ9MTA5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MCBzZWNvbmQ9MTE1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0xMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0xMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0xMTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0xMTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0xMjEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTAgc2Vjb25kPTEyNSBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD05MCBzZWNvbmQ9MTcxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MCBzZWNvbmQ9MTc0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MCBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0yMzYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTAgc2Vjb25kPTIzOCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD05MCBzZWNvbmQ9MjM5IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTkwIHNlY29uZD0yNDAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTAgc2Vjb25kPTg0ODIgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9OTEgc2Vjb25kPTQ4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9NTIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD01NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTEgc2Vjb25kPTY1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9NjcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD03NCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9NzcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTEgc2Vjb25kPTg0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD04NiBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9ODcgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9OTEgc2Vjb25kPTg4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD04OSBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9OTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD05OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTEgc2Vjb25kPTEwNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTA5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTE1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTE5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTIwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTIxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MTIyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD0yMjcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD0yMzYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTEgc2Vjb25kPTIzOCBhbW91bnQ9Mg0Ka2VybmluZyBmaXJzdD05MSBzZWNvbmQ9MjM5IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD0yNDAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkxIHNlY29uZD0yNTQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTEgc2Vjb25kPTM4MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05MiBzZWNvbmQ9MzQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkyIHNlY29uZD00OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05MiBzZWNvbmQ9NDkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTIgc2Vjb25kPTU3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkyIHNlY29uZD02NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTIgc2Vjb25kPTc0IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTkyIHNlY29uZD04NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9OTIgc2Vjb25kPTg1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05MiBzZWNvbmQ9ODYgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTkyIHNlY29uZD04NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTIgc2Vjb25kPTg5IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD05MiBzZWNvbmQ9MTE2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTkyIHNlY29uZD0xMTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkyIHNlY29uZD0xMTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkyIHNlY29uZD0xMjEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTkyIHNlY29uZD04MjE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9MzQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk3IHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9NDIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk3IHNlY29uZD00OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTYzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTY3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9NjkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTc0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk3IHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9ODMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTg0IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9ODUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk3IHNlY29uZD04NiBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTg3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9ODkgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTk3IHNlY29uZD05MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9MTAyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk3IHNlY29uZD0xMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTExOCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9MTIxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9MTI1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk3IHNlY29uZD04MjE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05NyBzZWNvbmQ9ODIxNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTcgc2Vjb25kPTg0ODIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD0zNCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTM4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD00MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTQyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9NDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD01MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTU1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD02NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9NjYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9NjkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD03NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTc3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9ODMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD04NCBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTg1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9ODYgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD04NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTg4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9ODkgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD05MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTkyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9OTMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9MTE4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD0xMTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTEyMCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTEyMSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9MTIyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD0xMjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD0xODcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OCBzZWNvbmQ9ODIxNiBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9OTggc2Vjb25kPTgyMTcgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTk4IHNlY29uZD04NDgyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9MzggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk5IHNlY29uZD00MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9NDUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk5IHNlY29uZD01MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTkgc2Vjb25kPTYzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTkgc2Vjb25kPTY3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk5IHNlY29uZD02OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTkgc2Vjb25kPTc3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk5IHNlY29uZD04MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9ODQgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTk5IHNlY29uZD04NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9ODYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk5IHNlY29uZD04NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTk5IHNlY29uZD05MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9OTkgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTkgc2Vjb25kPTEyNSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD05OSBzZWNvbmQ9MTcxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTk5IHNlY29uZD0yNDAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTkgc2Vjb25kPTgyMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTkgc2Vjb25kPTgyMTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9OTkgc2Vjb25kPTg0ODIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAwIHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDAgc2Vjb25kPTY1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMCBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAwIHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDAgc2Vjb25kPTY5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMCBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAwIHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDAgc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMCBzZWNvbmQ9ODQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAwIHNlY29uZD04NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAwIHNlY29uZD04NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDAgc2Vjb25kPTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMCBzZWNvbmQ9ODkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAwIHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTM0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTM4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9NDIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9NDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9NTUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTY5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9ODQgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9ODUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9ODYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9ODggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD04OSBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTkyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTEyMCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTEyMSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAxIHNlY29uZD04MjE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDEgc2Vjb25kPTgyMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMSBzZWNvbmQ9ODQ4MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD0zOCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD00NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD00NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD00NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD00NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTY0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9NjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD02OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTc0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9NzcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9ODUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD04OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTkwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMiBzZWNvbmQ9OTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD05OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTE3MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTIzOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDIgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAyIHNlY29uZD04MjE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTM4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMyBzZWNvbmQ9NDcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAzIHNlY29uZD01NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAzIHNlY29uZD02MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTAzIHNlY29uZD02NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTY5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMyBzZWNvbmQ9NzQgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MTAzIHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTg0IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTg1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMyBzZWNvbmQ9ODYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAzIHNlY29uZD04NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTg4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwMyBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMyBzZWNvbmQ9OTAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTAzIHNlY29uZD05MyBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTEwNiBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTEyNSBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTI0MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDMgc2Vjb25kPTgyMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwMyBzZWNvbmQ9ODIxNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0zNCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTQxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTQyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTQ5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTU1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTYzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTY1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9NjYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9NjcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD02OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD03NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9ODQgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9ODUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9ODYgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9ODggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD04OSBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTkyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTEyMSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD0yMjMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA0IHNlY29uZD04MjE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDQgc2Vjb25kPTgyMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNCBzZWNvbmQ9ODQ4MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA1IHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDUgc2Vjb25kPTY1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwNSBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA1IHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDUgc2Vjb25kPTY5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwNSBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA1IHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDUgc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwNSBzZWNvbmQ9ODQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA1IHNlY29uZD04NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA1IHNlY29uZD04NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDUgc2Vjb25kPTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwNSBzZWNvbmQ9ODkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA1IHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTM4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTQ1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9NjcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9ODQgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9ODUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD04NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9OTMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD05NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTk5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTEwMyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA3IHNlY29uZD0xNzEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9MjQwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMDcgc2Vjb25kPTgyMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwNyBzZWNvbmQ9ODIxNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0zNCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDggc2Vjb25kPTM4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwOCBzZWNvbmQ9NDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD02NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD02NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD02OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD03NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDggc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwOCBzZWNvbmQ9ODQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwOCBzZWNvbmQ9ODUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwOCBzZWNvbmQ9ODYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwOCBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwOCBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEwOCBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0xMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0xMTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0xMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0xMTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0xMjEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0xNzEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD0yMjMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTA4IHNlY29uZD04MjE2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEwOCBzZWNvbmQ9ODIxNyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMDggc2Vjb25kPTg0ODIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0zNCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTQxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTQyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTQ5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTUwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTU1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTYzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTY1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9NjYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9NjcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD02OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD03NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD03NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD04MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD04NCBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD04NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD04NiBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD04NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD04OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD04OSBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD05MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD05MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD05MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD0xMjAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTIxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTIyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9MTI1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTE4NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTEgc2Vjb25kPTgyMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMSBzZWNvbmQ9ODIxNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTExIHNlY29uZD04NDgyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTM0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTM4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9NDIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9NDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9NTAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9NTUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9NjUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD02NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTY5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTc0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTc3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTgzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTg0IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTg1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTg2IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTg3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTg4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTg5IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTkwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTkyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTEyMCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD0xMjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMiBzZWNvbmQ9ODIxNiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTEyIHNlY29uZD04MjE3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTIgc2Vjb25kPTg0ODIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9MzggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTEzIHNlY29uZD00MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTEzIHNlY29uZD00MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTU1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTYzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTY1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTEzIHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTY5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTEzIHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9ODQgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9ODUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9ODYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9ODggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTEzIHNlY29uZD04OSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9MTEzIHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTkyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTEzIHNlY29uZD04MjE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTMgc2Vjb25kPTgyMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExMyBzZWNvbmQ9ODQ4MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0zOCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD00NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD01MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD01MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTU1IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTYzIGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTY0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTY1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTY2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9NjkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD03NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTc3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTg0IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTg1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9ODYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD04NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTg4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTg5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTkwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTk3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMDMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD0xMjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNCBzZWNvbmQ9MTcxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTQgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE0IHNlY29uZD04MjE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTUgc2Vjb25kPTQxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTUgc2Vjb25kPTQyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9NTUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE1IHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTUgc2Vjb25kPTY5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE1IHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTUgc2Vjb25kPTgzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9ODQgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9ODUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9ODYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9ODggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE1IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE1IHNlY29uZD05MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTUgc2Vjb25kPTkyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTUgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTUgc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE1IHNlY29uZD04MjE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTUgc2Vjb25kPTgyMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNSBzZWNvbmQ9ODQ4MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTUyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTU1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD02NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTY5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTg0IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTg1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9ODYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9ODcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD05MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTE3MSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTYgc2Vjb25kPTgyMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExNiBzZWNvbmQ9ODIxNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE2IHNlY29uZD04NDgyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9MzggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NDcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NTEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NTUgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NjQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD02NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD02NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTY5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9NzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD03NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD04NCBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD04NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTg2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9ODggYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9OTAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9OTMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOCBzZWNvbmQ9OTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD05OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTEwMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD0yNDAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE4IHNlY29uZD04MjE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTggc2Vjb25kPTgyMTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9MzggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDQgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NDcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NTEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD01NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD02MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD02NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTY1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTY2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9NjkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD03NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTc3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTg0IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTg1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9ODYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9ODcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD04OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD05MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD05MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTE5IHNlY29uZD05NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTk5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9MTI1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTI0MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMTkgc2Vjb25kPTgyMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTExOSBzZWNvbmQ9ODIxOCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0zOCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD00NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTYzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTY2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9NjcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9NjkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD03NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTc3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9ODMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD04NCBhbW91bnQ9LTMNCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD04NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTg2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9ODkgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9OTIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD05MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD05NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTk5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTEwMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTEyNSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTE3MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD0yNDAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIwIHNlY29uZD04MjE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjAgc2Vjb25kPTgyMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMCBzZWNvbmQ9ODQ4MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTM4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTQ3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTUxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTU1IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTYzIGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTY0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTY1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTY2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9NjkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD03NCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTc3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTg0IGFtb3VudD0tMw0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTg1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9ODYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9ODcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD04OCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD05MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD05MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD05NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTk5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTAzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTE1IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMSBzZWNvbmQ9MTI1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjEgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIxIHNlY29uZD04MjE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTM4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9NDEgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD00NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD01MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD01NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTYzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTY2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9NjcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD02OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTc0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9NzcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD04NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD04NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD04NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD04NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTg5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTkyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9OTMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMDMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD0xMjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9MTcxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTI0MCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xMjIgc2Vjb25kPTgyMTYgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMiBzZWNvbmQ9ODIxNyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIyIHNlY29uZD04NDgyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9NDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD01MiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD01NCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD02NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD03NCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTg0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9ODYgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD04NyBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTg4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9ODkgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD05NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD05OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0xMDYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0xMDkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MTE1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTExNiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0xMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MTE4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTExOSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0xMjAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0xMjEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTEyMyBzZWNvbmQ9MTIyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIzOCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTIzOSBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0xMjMgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTIzIHNlY29uZD0yNTQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTYxIHNlY29uZD04NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9MTYxIHNlY29uZD04NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTYxIHNlY29uZD04NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xNjEgc2Vjb25kPTg5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xNzEgc2Vjb25kPTg0IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0xNzEgc2Vjb25kPTg2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTE3MSBzZWNvbmQ9ODkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE3MSBzZWNvbmQ9OTkgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTc0IHNlY29uZD02NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTc0IHNlY29uZD03NyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xNzQgc2Vjb25kPTg0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xNzQgc2Vjb25kPTg2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTE3NCBzZWNvbmQ9ODcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTc0IHNlY29uZD04OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTc0IHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTc0IHNlY29uZD05MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTc0IHNlY29uZD0xOTggYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE3NiBzZWNvbmQ9NTIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE3NiBzZWNvbmQ9NTQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTgzIHNlY29uZD00OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xODMgc2Vjb25kPTUwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xODMgc2Vjb25kPTU1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xODcgc2Vjb25kPTM0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTE4NyBzZWNvbmQ9NjUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTg3IHNlY29uZD04MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTg3IHNlY29uZD04NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9MTg3IHNlY29uZD04NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTg3IHNlY29uZD04NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTg3IHNlY29uZD04OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTg3IHNlY29uZD04OSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9MTg3IHNlY29uZD05MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTg3IHNlY29uZD0xMjAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE4NyBzZWNvbmQ9MTIxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTE4NyBzZWNvbmQ9MTIyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xODcgc2Vjb25kPTE5OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xODcgc2Vjb25kPTIwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xODcgc2Vjb25kPTgyMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9NjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9NjYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD02OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xOTEgc2Vjb25kPTc0IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9NzcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9ODQgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9ODUgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD04NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD04NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD04OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD04OSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD05MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD05NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD05OCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xOTEgc2Vjb25kPTk5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xOTEgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0xOTEgc2Vjb25kPTEwMyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD0xMDUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9MTA2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9MTA4IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9MTA5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xOTEgc2Vjb25kPTExNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD0xMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD0xMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9MTIwIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTE5MSBzZWNvbmQ9MTIyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0xOTEgc2Vjb25kPTE5OCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD0yMjMgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MTkxIHNlY29uZD0yNDAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9NDEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9NDQgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9NDYgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9NDcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9NjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9NzcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjIyIHNlY29uZD04NCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9MjIyIHNlY29uZD04NiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjIgc2Vjb25kPTg4IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0yMjIgc2Vjb25kPTg5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0yMjIgc2Vjb25kPTkwIGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0yMjIgc2Vjb25kPTkyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9OTMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9OTcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjIyIHNlY29uZD0xMjAgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjIyIHNlY29uZD0xMjUgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTIyMiBzZWNvbmQ9MTk4IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD0yMjIgc2Vjb25kPTgyMTggYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTIyMyBzZWNvbmQ9MzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjIzIHNlY29uZD00MSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MjIzIHNlY29uZD00MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjMgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjMgc2Vjb25kPTExNiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjMgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjMgc2Vjb25kPTExOSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjMgc2Vjb25kPTEyMCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjMgc2Vjb25kPTEyMSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MjIzIHNlY29uZD0xMjIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjIzIHNlY29uZD04MjE2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTIyMyBzZWNvbmQ9ODIxNyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjMgc2Vjb25kPTg0ODIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjI2IHNlY29uZD05MyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjYgc2Vjb25kPTEyNSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMjcgc2Vjb25kPTkyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0yMzYgc2Vjb25kPTQyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTIzNiBzZWNvbmQ9ODQ4MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMzcgc2Vjb25kPTQyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTIzNyBzZWNvbmQ9ODQ4MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yMzggc2Vjb25kPTM0IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTIzOCBzZWNvbmQ9MzkgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MjM4IHNlY29uZD00MiBhbW91bnQ9Mg0Ka2VybmluZyBmaXJzdD0yMzggc2Vjb25kPTYzIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTIzOCBzZWNvbmQ9OTIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjM4IHNlY29uZD05MyBhbW91bnQ9Mg0Ka2VybmluZyBmaXJzdD0yMzggc2Vjb25kPTEyNSBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0yMzggc2Vjb25kPTgyMTYgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MjM4IHNlY29uZD04MjE3IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTIzOCBzZWNvbmQ9ODIyMCBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0yMzggc2Vjb25kPTgyMjEgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MjM4IHNlY29uZD04NDgyIGFtb3VudD0yDQprZXJuaW5nIGZpcnN0PTIzOSBzZWNvbmQ9NDIgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MjM5IHNlY29uZD02MyBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD0yMzkgc2Vjb25kPTkyIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTIzOSBzZWNvbmQ9OTMgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MjM5IHNlY29uZD0xMjUgYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9MjM5IHNlY29uZD04NDgyIGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTI0MCBzZWNvbmQ9MzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjQwIHNlY29uZD0zOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTQxIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTQyIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTQ0IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTI0MCBzZWNvbmQ9NDYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjQwIHNlY29uZD02MyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MjQwIHNlY29uZD05MiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTkzIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTExOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTEyMCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTEyMSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTEyMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTEyNSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9MjQwIHNlY29uZD0xODcgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9MjQwIHNlY29uZD04MjE2IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTgyMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTI0MCBzZWNvbmQ9ODIxOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD0yNDAgc2Vjb25kPTg0ODIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTM1MyBzZWNvbmQ9NjMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTYgc2Vjb25kPTQ0IGFtb3VudD0tNA0Ka2VybmluZyBmaXJzdD04MjE2IHNlY29uZD00NiBhbW91bnQ9LTQNCmtlcm5pbmcgZmlyc3Q9ODIxNiBzZWNvbmQ9NjUgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTgyMTYgc2Vjb25kPTc3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE2IHNlY29uZD05NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxNiBzZWNvbmQ9OTkgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTYgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MjE2IHNlY29uZD0xMDMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTYgc2Vjb25kPTEwOSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxNiBzZWNvbmQ9MTE1IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE2IHNlY29uZD0xMTcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTYgc2Vjb25kPTExOSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxNiBzZWNvbmQ9MTIwIGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE2IHNlY29uZD0xMjIgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTYgc2Vjb25kPTE5OCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODIxNiBzZWNvbmQ9MjM4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTgyMTYgc2Vjb25kPTI0MCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MzggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9NDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9NDQgYW1vdW50PS01DQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTQ1IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD00NiBhbW91bnQ9LTUNCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9NDcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTY0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD02NSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9NjcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTc3IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD04OSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD05NyBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9OTkgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTEwMiBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD0xMDMgYW1vdW50PS0yDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTEwOSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MTE1IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD0xMTYgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MTE3IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD0xMTggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MTE5IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTEyMCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MTIxIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTEyMiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MTcxIGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD0xNzQgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MTg3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTE5OCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MjIzIGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTIzNCBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MjM4IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTIzOSBhbW91bnQ9MQ0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD0yNDAgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTI0NSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODIxNyBzZWNvbmQ9MjU0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE3IHNlY29uZD0zNTMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTgyMTggYW1vdW50PS01DQprZXJuaW5nIGZpcnN0PTgyMTcgc2Vjb25kPTg0ODIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIxOCBzZWNvbmQ9MzQgYW1vdW50PS0zDQprZXJuaW5nIGZpcnN0PTgyMTggc2Vjb25kPTY3IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyMTggc2Vjb25kPTg0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE4IHNlY29uZD04NSBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MjE4IHNlY29uZD04NiBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxOCBzZWNvbmQ9ODcgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTggc2Vjb25kPTg5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE4IHNlY29uZD0xMDIgYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODIxOCBzZWNvbmQ9MTE2IGFtb3VudD0wDQprZXJuaW5nIGZpcnN0PTgyMTggc2Vjb25kPTExOCBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODIxOCBzZWNvbmQ9MTE5IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjE4IHNlY29uZD0xMjEgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyMTggc2Vjb25kPTIyMyBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04MjE4IHNlY29uZD04MjE3IGFtb3VudD0tNA0Ka2VybmluZyBmaXJzdD04MjIwIHNlY29uZD0yMzggYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODIyMSBzZWNvbmQ9MjM0IGFtb3VudD0tMg0Ka2VybmluZyBmaXJzdD04MjIxIHNlY29uZD0yMzggYW1vdW50PTENCmtlcm5pbmcgZmlyc3Q9ODIyMSBzZWNvbmQ9MjM5IGFtb3VudD0xDQprZXJuaW5nIGZpcnN0PTgyMjEgc2Vjb25kPTI0NSBhbW91bnQ9LTINCmtlcm5pbmcgZmlyc3Q9ODIyMSBzZWNvbmQ9MjU0IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04MjIxIHNlY29uZD0zNTMgYW1vdW50PS0xDQprZXJuaW5nIGZpcnN0PTgyNTAgc2Vjb25kPTIwOCBhbW91bnQ9MA0Ka2VybmluZyBmaXJzdD04NDgyIHNlY29uZD02NSBhbW91bnQ9LTENCmtlcm5pbmcgZmlyc3Q9ODQ4MiBzZWNvbmQ9MTk4IGFtb3VudD0tMQ0Ka2VybmluZyBmaXJzdD04NDgyIHNlY29uZD0yMDggYW1vdW50PTANCmtlcm5pbmcgZmlyc3Q9ODQ4MiBzZWNvbmQ9MjM4IGFtb3VudD0w"},{ name : "default.frag.glsl", data : "dmFyeWluZyB2ZWMyIHRjb29yZDsNCnZhcnlpbmcgdmVjNCBjb2xvcjsNCg0Kdm9pZCBtYWluKCkgew0KICAgIGdsX0ZyYWdDb2xvciA9IGNvbG9yOw0KfQ"},{ name : "default.frag.textured.glsl", data : "dW5pZm9ybSBzYW1wbGVyMkQgdGV4MDsNCnZhcnlpbmcgdmVjMiB0Y29vcmQ7DQp2YXJ5aW5nIHZlYzQgY29sb3I7DQoNCnZvaWQgbWFpbigpIHsNCiAgICB2ZWM0IHRleGNvbG9yID0gdGV4dHVyZTJEKHRleDAsIHRjb29yZCk7DQogICAgLy8gZmxvYXQgbHVtaW5vc2l0eSA9ICh0ZXhjb2xvci5yICsgdGV4Y29sb3IuZyArIHRleGNvbG9yLmIpIC8gMy4wOw0KICAgIC8vIHZlYzQgZ3JheSA9IHZlYzQobHVtaW5vc2l0eSxsdW1pbm9zaXR5LGx1bWlub3NpdHksMSk7DQogICAgLy8gdmVjNCBvY29sb3IgPSB2ZWM0KHRleGNvbG9yLnIsIHRleGNvbG9yLmcsIHRleGNvbG9yLmIsIDEpOw0KICAgIC8vIHZlYzQgdXZjb2xvciA9IHZlYzQodGNvb3JkLngsIHRjb29yZC55LCAodGNvb3JkLngrdGNvb3JkLnkpKjIuMCwgMSk7DQogICAgLy8gdmVjNCB3aGl0ZSA9IHZlYzQoMSwgMSwgMSwgMC42KTsNCiAgICAvLyBnbF9GcmFnQ29sb3IgPSBncmF5ICogKCh0Y29vcmQueCt0Y29vcmQueSkvMi4wKTsNCiAgICBnbF9GcmFnQ29sb3IgPSBjb2xvciAqIHRleGNvbG9yOyAvL3ZlYzQoMCwwLjksMC42LDEpOyA7DQogICAgLy8gZ2xfRnJhZ0NvbG9yID0gdmVjNChnbF9Qb2ludENvb3JkLngsIGdsX1BvaW50Q29vcmQueSwgMCwgMSk7DQogICAgLy8gdmVjNCBjYyA9IHV2Y29sb3IgKiBncmF5Ow0KICAgIC8vIGdsX0ZyYWdDb2xvciA9IHRleGNvbG9yOw0KfQ"}];
Luxe.version = "dev";
Luxe.build = "+4100958dd4";
format.tools._InflateImpl.Window.SIZE = 32768;
format.tools._InflateImpl.Window.BUFSIZE = 65536;
format.tools.InflateImpl.LEN_EXTRA_BITS_TBL = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,-1,-1];
format.tools.InflateImpl.LEN_BASE_VAL_TBL = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
format.tools.InflateImpl.DIST_EXTRA_BITS_TBL = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,-1,-1];
format.tools.InflateImpl.DIST_BASE_VAL_TBL = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
format.tools.InflateImpl.CODE_LENGTHS_POS = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
haxe.crypto.Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe.crypto.Base64.BYTES = haxe.io.Bytes.ofString(haxe.crypto.Base64.CHARS);
haxe.ds.ObjectMap.count = 0;
luxe.Core.core_tag_update = "real dt";
luxe.Core.core_tag_renderdt = "render dt";
luxe.Core.game_tag_update = "game.update";
luxe.Core.core_tag_render = "core.render";
luxe.Core.core_tag_debug = "core.debug";
luxe.Core.core_tag_updates = "core.updates";
luxe.Core.core_tag_events = "core.events";
luxe.Core.core_tag_audio = "core.audio";
luxe.Core.core_tag_input = "core.input";
luxe.Core.core_tag_timer = "core.timer";
luxe.Core.core_tag_scene = "core.scene";
luxe.Debug.shut_down = false;
luxe.Log._level = 1;
luxe.Log._log_width = 16;
luxe.Physics.tag_physics = "physics";
luxe.macros.BuildVersion._save = false;
luxe.structural._BalancedBST.NodeColor.red = true;
luxe.structural._BalancedBST.NodeColor.black = false;
luxe.tween.actuators.SimpleActuator.actuators = new Array();
luxe.tween.actuators.SimpleActuator.actuatorsLength = 0;
luxe.tween.actuators.SimpleActuator.addedEvent = false;
luxe.tween.actuators.SimpleActuator.update_timer = 0;
luxe.tween.actuators.SimpleActuator.current_time = 0;
luxe.tween.Actuate.defaultActuator = luxe.tween.actuators.SimpleActuator;
luxe.tween.Actuate.defaultEase = luxe.tween.easing.Quad.get_easeOut();
luxe.tween.Actuate.targetLibraries = new haxe.ds.ObjectMap();
luxe.utils.GeometryUtils.two_pi = 6.283185307179586;
luxe.utils.Maths.DEG2RAD = 0.017453292519943278;
luxe.utils.Maths.RAD2DEG = 57.29577951308238;
luxe.utils.UUID.rule30 = luxe.utils._UUID.Rule30.createWithLength(24);
luxe.utils.UUID.hexChars = "0123456789ABCDEF";
phoenix._Batcher.PrimitiveType_Impl_.none = 0;
phoenix._Batcher.PrimitiveType_Impl_.line_strip = 3;
phoenix._Batcher.PrimitiveType_Impl_.line_loop = 2;
phoenix._Batcher.PrimitiveType_Impl_.lines = 1;
phoenix._Batcher.PrimitiveType_Impl_.triangle_strip = 5;
phoenix._Batcher.PrimitiveType_Impl_.triangles = 4;
phoenix._Batcher.PrimitiveType_Impl_.triangle_fan = 6;
phoenix._Batcher.PrimitiveType_Impl_.points = 0;
phoenix._Batcher.BlendMode_Impl_.zero = 0;
phoenix._Batcher.BlendMode_Impl_.one = 1;
phoenix._Batcher.BlendMode_Impl_.src_color = 768;
phoenix._Batcher.BlendMode_Impl_.one_minus_src_color = 769;
phoenix._Batcher.BlendMode_Impl_.src_alpha = 770;
phoenix._Batcher.BlendMode_Impl_.one_minus_src_alpha = 771;
phoenix._Batcher.BlendMode_Impl_.dst_alpha = 772;
phoenix._Batcher.BlendMode_Impl_.one_minus_dst_alpha = 773;
phoenix._Batcher.BlendMode_Impl_.dst_color = 774;
phoenix._Batcher.BlendMode_Impl_.one_minus_dst_color = 775;
phoenix._Batcher.BlendMode_Impl_.src_alpha_saturate = 776;
phoenix._Batcher.BlendEquation_Impl_.add = 32774;
phoenix._Batcher.BlendEquation_Impl_.subtract = 32778;
phoenix._Batcher.BlendEquation_Impl_.reverse_subtract = 32779;
phoenix.Batcher._sequence_key = -1;
phoenix._Vector.ComponentOrder_Impl_.XYZ = 0;
phoenix._Vector.ComponentOrder_Impl_.YXZ = 1;
phoenix._Vector.ComponentOrder_Impl_.ZXY = 2;
phoenix._Vector.ComponentOrder_Impl_.ZYX = 3;
phoenix._Vector.ComponentOrder_Impl_.YZX = 4;
phoenix._Vector.ComponentOrder_Impl_.XZY = 5;
phoenix.geometry.Geometry._sequence_key = -1;
snow.Log._level = 1;
snow.Log._log_width = 16;
snow.input.Scancodes.MASK = 1073741824;
snow.input.Scancodes.unknown = 0;
snow.input.Scancodes.key_a = 4;
snow.input.Scancodes.key_b = 5;
snow.input.Scancodes.key_c = 6;
snow.input.Scancodes.key_d = 7;
snow.input.Scancodes.key_e = 8;
snow.input.Scancodes.key_f = 9;
snow.input.Scancodes.key_g = 10;
snow.input.Scancodes.key_h = 11;
snow.input.Scancodes.key_i = 12;
snow.input.Scancodes.key_j = 13;
snow.input.Scancodes.key_k = 14;
snow.input.Scancodes.key_l = 15;
snow.input.Scancodes.key_m = 16;
snow.input.Scancodes.key_n = 17;
snow.input.Scancodes.key_o = 18;
snow.input.Scancodes.key_p = 19;
snow.input.Scancodes.key_q = 20;
snow.input.Scancodes.key_r = 21;
snow.input.Scancodes.key_s = 22;
snow.input.Scancodes.key_t = 23;
snow.input.Scancodes.key_u = 24;
snow.input.Scancodes.key_v = 25;
snow.input.Scancodes.key_w = 26;
snow.input.Scancodes.key_x = 27;
snow.input.Scancodes.key_y = 28;
snow.input.Scancodes.key_z = 29;
snow.input.Scancodes.key_1 = 30;
snow.input.Scancodes.key_2 = 31;
snow.input.Scancodes.key_3 = 32;
snow.input.Scancodes.key_4 = 33;
snow.input.Scancodes.key_5 = 34;
snow.input.Scancodes.key_6 = 35;
snow.input.Scancodes.key_7 = 36;
snow.input.Scancodes.key_8 = 37;
snow.input.Scancodes.key_9 = 38;
snow.input.Scancodes.key_0 = 39;
snow.input.Scancodes.enter = 40;
snow.input.Scancodes.escape = 41;
snow.input.Scancodes.backspace = 42;
snow.input.Scancodes.tab = 43;
snow.input.Scancodes.space = 44;
snow.input.Scancodes.minus = 45;
snow.input.Scancodes.equals = 46;
snow.input.Scancodes.leftbracket = 47;
snow.input.Scancodes.rightbracket = 48;
snow.input.Scancodes.backslash = 49;
snow.input.Scancodes.nonushash = 50;
snow.input.Scancodes.semicolon = 51;
snow.input.Scancodes.apostrophe = 52;
snow.input.Scancodes.grave = 53;
snow.input.Scancodes.comma = 54;
snow.input.Scancodes.period = 55;
snow.input.Scancodes.slash = 56;
snow.input.Scancodes.capslock = 57;
snow.input.Scancodes.f1 = 58;
snow.input.Scancodes.f2 = 59;
snow.input.Scancodes.f3 = 60;
snow.input.Scancodes.f4 = 61;
snow.input.Scancodes.f5 = 62;
snow.input.Scancodes.f6 = 63;
snow.input.Scancodes.f7 = 64;
snow.input.Scancodes.f8 = 65;
snow.input.Scancodes.f9 = 66;
snow.input.Scancodes.f10 = 67;
snow.input.Scancodes.f11 = 68;
snow.input.Scancodes.f12 = 69;
snow.input.Scancodes.printscreen = 70;
snow.input.Scancodes.scrolllock = 71;
snow.input.Scancodes.pause = 72;
snow.input.Scancodes.insert = 73;
snow.input.Scancodes.home = 74;
snow.input.Scancodes.pageup = 75;
snow.input.Scancodes["delete"] = 76;
snow.input.Scancodes.end = 77;
snow.input.Scancodes.pagedown = 78;
snow.input.Scancodes.right = 79;
snow.input.Scancodes.left = 80;
snow.input.Scancodes.down = 81;
snow.input.Scancodes.up = 82;
snow.input.Scancodes.numlockclear = 83;
snow.input.Scancodes.kp_divide = 84;
snow.input.Scancodes.kp_multiply = 85;
snow.input.Scancodes.kp_minus = 86;
snow.input.Scancodes.kp_plus = 87;
snow.input.Scancodes.kp_enter = 88;
snow.input.Scancodes.kp_1 = 89;
snow.input.Scancodes.kp_2 = 90;
snow.input.Scancodes.kp_3 = 91;
snow.input.Scancodes.kp_4 = 92;
snow.input.Scancodes.kp_5 = 93;
snow.input.Scancodes.kp_6 = 94;
snow.input.Scancodes.kp_7 = 95;
snow.input.Scancodes.kp_8 = 96;
snow.input.Scancodes.kp_9 = 97;
snow.input.Scancodes.kp_0 = 98;
snow.input.Scancodes.kp_period = 99;
snow.input.Scancodes.nonusbackslash = 100;
snow.input.Scancodes.application = 101;
snow.input.Scancodes.power = 102;
snow.input.Scancodes.kp_equals = 103;
snow.input.Scancodes.f13 = 104;
snow.input.Scancodes.f14 = 105;
snow.input.Scancodes.f15 = 106;
snow.input.Scancodes.f16 = 107;
snow.input.Scancodes.f17 = 108;
snow.input.Scancodes.f18 = 109;
snow.input.Scancodes.f19 = 110;
snow.input.Scancodes.f20 = 111;
snow.input.Scancodes.f21 = 112;
snow.input.Scancodes.f22 = 113;
snow.input.Scancodes.f23 = 114;
snow.input.Scancodes.f24 = 115;
snow.input.Scancodes.execute = 116;
snow.input.Scancodes.help = 117;
snow.input.Scancodes.menu = 118;
snow.input.Scancodes.select = 119;
snow.input.Scancodes.stop = 120;
snow.input.Scancodes.again = 121;
snow.input.Scancodes.undo = 122;
snow.input.Scancodes.cut = 123;
snow.input.Scancodes.copy = 124;
snow.input.Scancodes.paste = 125;
snow.input.Scancodes.find = 126;
snow.input.Scancodes.mute = 127;
snow.input.Scancodes.volumeup = 128;
snow.input.Scancodes.volumedown = 129;
snow.input.Scancodes.kp_comma = 133;
snow.input.Scancodes.kp_equalsas400 = 134;
snow.input.Scancodes.international1 = 135;
snow.input.Scancodes.international2 = 136;
snow.input.Scancodes.international3 = 137;
snow.input.Scancodes.international4 = 138;
snow.input.Scancodes.international5 = 139;
snow.input.Scancodes.international6 = 140;
snow.input.Scancodes.international7 = 141;
snow.input.Scancodes.international8 = 142;
snow.input.Scancodes.international9 = 143;
snow.input.Scancodes.lang1 = 144;
snow.input.Scancodes.lang2 = 145;
snow.input.Scancodes.lang3 = 146;
snow.input.Scancodes.lang4 = 147;
snow.input.Scancodes.lang5 = 148;
snow.input.Scancodes.lang6 = 149;
snow.input.Scancodes.lang7 = 150;
snow.input.Scancodes.lang8 = 151;
snow.input.Scancodes.lang9 = 152;
snow.input.Scancodes.alterase = 153;
snow.input.Scancodes.sysreq = 154;
snow.input.Scancodes.cancel = 155;
snow.input.Scancodes.clear = 156;
snow.input.Scancodes.prior = 157;
snow.input.Scancodes.return2 = 158;
snow.input.Scancodes.separator = 159;
snow.input.Scancodes.out = 160;
snow.input.Scancodes.oper = 161;
snow.input.Scancodes.clearagain = 162;
snow.input.Scancodes.crsel = 163;
snow.input.Scancodes.exsel = 164;
snow.input.Scancodes.kp_00 = 176;
snow.input.Scancodes.kp_000 = 177;
snow.input.Scancodes.thousandsseparator = 178;
snow.input.Scancodes.decimalseparator = 179;
snow.input.Scancodes.currencyunit = 180;
snow.input.Scancodes.currencysubunit = 181;
snow.input.Scancodes.kp_leftparen = 182;
snow.input.Scancodes.kp_rightparen = 183;
snow.input.Scancodes.kp_leftbrace = 184;
snow.input.Scancodes.kp_rightbrace = 185;
snow.input.Scancodes.kp_tab = 186;
snow.input.Scancodes.kp_backspace = 187;
snow.input.Scancodes.kp_a = 188;
snow.input.Scancodes.kp_b = 189;
snow.input.Scancodes.kp_c = 190;
snow.input.Scancodes.kp_d = 191;
snow.input.Scancodes.kp_e = 192;
snow.input.Scancodes.kp_f = 193;
snow.input.Scancodes.kp_xor = 194;
snow.input.Scancodes.kp_power = 195;
snow.input.Scancodes.kp_percent = 196;
snow.input.Scancodes.kp_less = 197;
snow.input.Scancodes.kp_greater = 198;
snow.input.Scancodes.kp_ampersand = 199;
snow.input.Scancodes.kp_dblampersand = 200;
snow.input.Scancodes.kp_verticalbar = 201;
snow.input.Scancodes.kp_dblverticalbar = 202;
snow.input.Scancodes.kp_colon = 203;
snow.input.Scancodes.kp_hash = 204;
snow.input.Scancodes.kp_space = 205;
snow.input.Scancodes.kp_at = 206;
snow.input.Scancodes.kp_exclam = 207;
snow.input.Scancodes.kp_memstore = 208;
snow.input.Scancodes.kp_memrecall = 209;
snow.input.Scancodes.kp_memclear = 210;
snow.input.Scancodes.kp_memadd = 211;
snow.input.Scancodes.kp_memsubtract = 212;
snow.input.Scancodes.kp_memmultiply = 213;
snow.input.Scancodes.kp_memdivide = 214;
snow.input.Scancodes.kp_plusminus = 215;
snow.input.Scancodes.kp_clear = 216;
snow.input.Scancodes.kp_clearentry = 217;
snow.input.Scancodes.kp_binary = 218;
snow.input.Scancodes.kp_octal = 219;
snow.input.Scancodes.kp_decimal = 220;
snow.input.Scancodes.kp_hexadecimal = 221;
snow.input.Scancodes.lctrl = 224;
snow.input.Scancodes.lshift = 225;
snow.input.Scancodes.lalt = 226;
snow.input.Scancodes.lmeta = 227;
snow.input.Scancodes.rctrl = 228;
snow.input.Scancodes.rshift = 229;
snow.input.Scancodes.ralt = 230;
snow.input.Scancodes.rmeta = 231;
snow.input.Scancodes.mode = 257;
snow.input.Scancodes.audionext = 258;
snow.input.Scancodes.audioprev = 259;
snow.input.Scancodes.audiostop = 260;
snow.input.Scancodes.audioplay = 261;
snow.input.Scancodes.audiomute = 262;
snow.input.Scancodes.mediaselect = 263;
snow.input.Scancodes.www = 264;
snow.input.Scancodes.mail = 265;
snow.input.Scancodes.calculator = 266;
snow.input.Scancodes.computer = 267;
snow.input.Scancodes.ac_search = 268;
snow.input.Scancodes.ac_home = 269;
snow.input.Scancodes.ac_back = 270;
snow.input.Scancodes.ac_forward = 271;
snow.input.Scancodes.ac_stop = 272;
snow.input.Scancodes.ac_refresh = 273;
snow.input.Scancodes.ac_bookmarks = 274;
snow.input.Scancodes.brightnessdown = 275;
snow.input.Scancodes.brightnessup = 276;
snow.input.Scancodes.displayswitch = 277;
snow.input.Scancodes.kbdillumtoggle = 278;
snow.input.Scancodes.kbdillumdown = 279;
snow.input.Scancodes.kbdillumup = 280;
snow.input.Scancodes.eject = 281;
snow.input.Scancodes.sleep = 282;
snow.input.Scancodes.app1 = 283;
snow.input.Scancodes.app2 = 284;
snow.input.Scancodes.scancode_names = [null,null,null,null,"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5","6","7","8","9","0","Enter","Escape","Backspace","Tab","Space","-","=","[","]","\\","#",";","'","`",",",".","/","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","PrintScreen","ScrollLock","Pause","Insert","Home","PageUp","Delete","End","PageDown","Right","Left","Down","Up","Numlock","Keypad /","Keypad *","Keypad -","Keypad +","Keypad Enter","Keypad 1","Keypad 2","Keypad 3","Keypad 4","Keypad 5","Keypad 6","Keypad 7","Keypad 8","Keypad 9","Keypad 0","Keypad .",null,"Application","Power","Keypad =","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","Execute","Help","Menu","Select","Stop","Again","Undo","Cut","Copy","Paste","Find","Mute","VolumeUp","VolumeDown",null,null,null,"Keypad ,","Keypad = (AS400)",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"AltErase","SysReq","Cancel","Clear","Prior","Enter","Separator","Out","Oper","Clear / Again","CrSel","ExSel",null,null,null,null,null,null,null,null,null,null,null,"Keypad 00","Keypad 000","ThousandsSeparator","DecimalSeparator","CurrencyUnit","CurrencySubUnit","Keypad (","Keypad )","Keypad {","Keypad }","Keypad Tab","Keypad Backspace","Keypad A","Keypad B","Keypad C","Keypad D","Keypad E","Keypad F","Keypad XOR","Keypad ^","Keypad %","Keypad <","Keypad >","Keypad &","Keypad &&","Keypad |","Keypad ||","Keypad :","Keypad #","Keypad Space","Keypad @","Keypad !","Keypad MemStore","Keypad MemRecall","Keypad MemClear","Keypad MemAdd","Keypad MemSubtract","Keypad MemMultiply","Keypad MemDivide","Keypad +/-","Keypad Clear","Keypad ClearEntry","Keypad Binary","Keypad Octal","Keypad Decimal","Keypad Hexadecimal",null,null,"Left Ctrl","Left Shift","Left Alt","Left Meta","Right Ctrl","Right Shift","Right Alt","Right Meta",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"ModeSwitch","AudioNext","AudioPrev","AudioStop","AudioPlay","AudioMute","MediaSelect","WWW","Mail","Calculator","Computer","AC Search","AC Home","AC Back","AC Forward","AC Stop","AC Refresh","AC Bookmarks","BrightnessDown","BrightnessUp","DisplaySwitch","KBDIllumToggle","KBDIllumDown","KBDIllumUp","Eject","Sleep"];
snow.input.Keycodes.unknown = 0;
snow.input.Keycodes.enter = 13;
snow.input.Keycodes.escape = 27;
snow.input.Keycodes.backspace = 8;
snow.input.Keycodes.tab = 9;
snow.input.Keycodes.space = 32;
snow.input.Keycodes.exclaim = 33;
snow.input.Keycodes.quotedbl = 34;
snow.input.Keycodes.hash = 35;
snow.input.Keycodes.percent = 37;
snow.input.Keycodes.dollar = 36;
snow.input.Keycodes.ampersand = 38;
snow.input.Keycodes.quote = 39;
snow.input.Keycodes.leftparen = 40;
snow.input.Keycodes.rightparen = 41;
snow.input.Keycodes.asterisk = 42;
snow.input.Keycodes.plus = 43;
snow.input.Keycodes.comma = 44;
snow.input.Keycodes.minus = 45;
snow.input.Keycodes.period = 46;
snow.input.Keycodes.slash = 47;
snow.input.Keycodes.key_0 = 48;
snow.input.Keycodes.key_1 = 49;
snow.input.Keycodes.key_2 = 50;
snow.input.Keycodes.key_3 = 51;
snow.input.Keycodes.key_4 = 52;
snow.input.Keycodes.key_5 = 53;
snow.input.Keycodes.key_6 = 54;
snow.input.Keycodes.key_7 = 55;
snow.input.Keycodes.key_8 = 56;
snow.input.Keycodes.key_9 = 57;
snow.input.Keycodes.colon = 58;
snow.input.Keycodes.semicolon = 59;
snow.input.Keycodes.less = 60;
snow.input.Keycodes.equals = 61;
snow.input.Keycodes.greater = 62;
snow.input.Keycodes.question = 63;
snow.input.Keycodes.at = 64;
snow.input.Keycodes.leftbracket = 91;
snow.input.Keycodes.backslash = 92;
snow.input.Keycodes.rightbracket = 93;
snow.input.Keycodes.caret = 94;
snow.input.Keycodes.underscore = 95;
snow.input.Keycodes.backquote = 96;
snow.input.Keycodes.key_a = 97;
snow.input.Keycodes.key_b = 98;
snow.input.Keycodes.key_c = 99;
snow.input.Keycodes.key_d = 100;
snow.input.Keycodes.key_e = 101;
snow.input.Keycodes.key_f = 102;
snow.input.Keycodes.key_g = 103;
snow.input.Keycodes.key_h = 104;
snow.input.Keycodes.key_i = 105;
snow.input.Keycodes.key_j = 106;
snow.input.Keycodes.key_k = 107;
snow.input.Keycodes.key_l = 108;
snow.input.Keycodes.key_m = 109;
snow.input.Keycodes.key_n = 110;
snow.input.Keycodes.key_o = 111;
snow.input.Keycodes.key_p = 112;
snow.input.Keycodes.key_q = 113;
snow.input.Keycodes.key_r = 114;
snow.input.Keycodes.key_s = 115;
snow.input.Keycodes.key_t = 116;
snow.input.Keycodes.key_u = 117;
snow.input.Keycodes.key_v = 118;
snow.input.Keycodes.key_w = 119;
snow.input.Keycodes.key_x = 120;
snow.input.Keycodes.key_y = 121;
snow.input.Keycodes.key_z = 122;
snow.input.Keycodes.capslock = snow.input.Keycodes.from_scan(snow.input.Scancodes.capslock);
snow.input.Keycodes.f1 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f1);
snow.input.Keycodes.f2 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f2);
snow.input.Keycodes.f3 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f3);
snow.input.Keycodes.f4 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f4);
snow.input.Keycodes.f5 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f5);
snow.input.Keycodes.f6 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f6);
snow.input.Keycodes.f7 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f7);
snow.input.Keycodes.f8 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f8);
snow.input.Keycodes.f9 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f9);
snow.input.Keycodes.f10 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f10);
snow.input.Keycodes.f11 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f11);
snow.input.Keycodes.f12 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f12);
snow.input.Keycodes.printscreen = snow.input.Keycodes.from_scan(snow.input.Scancodes.printscreen);
snow.input.Keycodes.scrolllock = snow.input.Keycodes.from_scan(snow.input.Scancodes.scrolllock);
snow.input.Keycodes.pause = snow.input.Keycodes.from_scan(snow.input.Scancodes.pause);
snow.input.Keycodes.insert = snow.input.Keycodes.from_scan(snow.input.Scancodes.insert);
snow.input.Keycodes.home = snow.input.Keycodes.from_scan(snow.input.Scancodes.home);
snow.input.Keycodes.pageup = snow.input.Keycodes.from_scan(snow.input.Scancodes.pageup);
snow.input.Keycodes["delete"] = 127;
snow.input.Keycodes.end = snow.input.Keycodes.from_scan(snow.input.Scancodes.end);
snow.input.Keycodes.pagedown = snow.input.Keycodes.from_scan(snow.input.Scancodes.pagedown);
snow.input.Keycodes.right = snow.input.Keycodes.from_scan(snow.input.Scancodes.right);
snow.input.Keycodes.left = snow.input.Keycodes.from_scan(snow.input.Scancodes.left);
snow.input.Keycodes.down = snow.input.Keycodes.from_scan(snow.input.Scancodes.down);
snow.input.Keycodes.up = snow.input.Keycodes.from_scan(snow.input.Scancodes.up);
snow.input.Keycodes.numlockclear = snow.input.Keycodes.from_scan(snow.input.Scancodes.numlockclear);
snow.input.Keycodes.kp_divide = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_divide);
snow.input.Keycodes.kp_multiply = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_multiply);
snow.input.Keycodes.kp_minus = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_minus);
snow.input.Keycodes.kp_plus = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_plus);
snow.input.Keycodes.kp_enter = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_enter);
snow.input.Keycodes.kp_1 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_1);
snow.input.Keycodes.kp_2 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_2);
snow.input.Keycodes.kp_3 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_3);
snow.input.Keycodes.kp_4 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_4);
snow.input.Keycodes.kp_5 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_5);
snow.input.Keycodes.kp_6 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_6);
snow.input.Keycodes.kp_7 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_7);
snow.input.Keycodes.kp_8 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_8);
snow.input.Keycodes.kp_9 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_9);
snow.input.Keycodes.kp_0 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_0);
snow.input.Keycodes.kp_period = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_period);
snow.input.Keycodes.application = snow.input.Keycodes.from_scan(snow.input.Scancodes.application);
snow.input.Keycodes.power = snow.input.Keycodes.from_scan(snow.input.Scancodes.power);
snow.input.Keycodes.kp_equals = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_equals);
snow.input.Keycodes.f13 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f13);
snow.input.Keycodes.f14 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f14);
snow.input.Keycodes.f15 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f15);
snow.input.Keycodes.f16 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f16);
snow.input.Keycodes.f17 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f17);
snow.input.Keycodes.f18 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f18);
snow.input.Keycodes.f19 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f19);
snow.input.Keycodes.f20 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f20);
snow.input.Keycodes.f21 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f21);
snow.input.Keycodes.f22 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f22);
snow.input.Keycodes.f23 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f23);
snow.input.Keycodes.f24 = snow.input.Keycodes.from_scan(snow.input.Scancodes.f24);
snow.input.Keycodes.execute = snow.input.Keycodes.from_scan(snow.input.Scancodes.execute);
snow.input.Keycodes.help = snow.input.Keycodes.from_scan(snow.input.Scancodes.help);
snow.input.Keycodes.menu = snow.input.Keycodes.from_scan(snow.input.Scancodes.menu);
snow.input.Keycodes.select = snow.input.Keycodes.from_scan(snow.input.Scancodes.select);
snow.input.Keycodes.stop = snow.input.Keycodes.from_scan(snow.input.Scancodes.stop);
snow.input.Keycodes.again = snow.input.Keycodes.from_scan(snow.input.Scancodes.again);
snow.input.Keycodes.undo = snow.input.Keycodes.from_scan(snow.input.Scancodes.undo);
snow.input.Keycodes.cut = snow.input.Keycodes.from_scan(snow.input.Scancodes.cut);
snow.input.Keycodes.copy = snow.input.Keycodes.from_scan(snow.input.Scancodes.copy);
snow.input.Keycodes.paste = snow.input.Keycodes.from_scan(snow.input.Scancodes.paste);
snow.input.Keycodes.find = snow.input.Keycodes.from_scan(snow.input.Scancodes.find);
snow.input.Keycodes.mute = snow.input.Keycodes.from_scan(snow.input.Scancodes.mute);
snow.input.Keycodes.volumeup = snow.input.Keycodes.from_scan(snow.input.Scancodes.volumeup);
snow.input.Keycodes.volumedown = snow.input.Keycodes.from_scan(snow.input.Scancodes.volumedown);
snow.input.Keycodes.kp_comma = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_comma);
snow.input.Keycodes.kp_equalsas400 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_equalsas400);
snow.input.Keycodes.alterase = snow.input.Keycodes.from_scan(snow.input.Scancodes.alterase);
snow.input.Keycodes.sysreq = snow.input.Keycodes.from_scan(snow.input.Scancodes.sysreq);
snow.input.Keycodes.cancel = snow.input.Keycodes.from_scan(snow.input.Scancodes.cancel);
snow.input.Keycodes.clear = snow.input.Keycodes.from_scan(snow.input.Scancodes.clear);
snow.input.Keycodes.prior = snow.input.Keycodes.from_scan(snow.input.Scancodes.prior);
snow.input.Keycodes.return2 = snow.input.Keycodes.from_scan(snow.input.Scancodes.return2);
snow.input.Keycodes.separator = snow.input.Keycodes.from_scan(snow.input.Scancodes.separator);
snow.input.Keycodes.out = snow.input.Keycodes.from_scan(snow.input.Scancodes.out);
snow.input.Keycodes.oper = snow.input.Keycodes.from_scan(snow.input.Scancodes.oper);
snow.input.Keycodes.clearagain = snow.input.Keycodes.from_scan(snow.input.Scancodes.clearagain);
snow.input.Keycodes.crsel = snow.input.Keycodes.from_scan(snow.input.Scancodes.crsel);
snow.input.Keycodes.exsel = snow.input.Keycodes.from_scan(snow.input.Scancodes.exsel);
snow.input.Keycodes.kp_00 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_00);
snow.input.Keycodes.kp_000 = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_000);
snow.input.Keycodes.thousandsseparator = snow.input.Keycodes.from_scan(snow.input.Scancodes.thousandsseparator);
snow.input.Keycodes.decimalseparator = snow.input.Keycodes.from_scan(snow.input.Scancodes.decimalseparator);
snow.input.Keycodes.currencyunit = snow.input.Keycodes.from_scan(snow.input.Scancodes.currencyunit);
snow.input.Keycodes.currencysubunit = snow.input.Keycodes.from_scan(snow.input.Scancodes.currencysubunit);
snow.input.Keycodes.kp_leftparen = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_leftparen);
snow.input.Keycodes.kp_rightparen = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_rightparen);
snow.input.Keycodes.kp_leftbrace = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_leftbrace);
snow.input.Keycodes.kp_rightbrace = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_rightbrace);
snow.input.Keycodes.kp_tab = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_tab);
snow.input.Keycodes.kp_backspace = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_backspace);
snow.input.Keycodes.kp_a = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_a);
snow.input.Keycodes.kp_b = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_b);
snow.input.Keycodes.kp_c = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_c);
snow.input.Keycodes.kp_d = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_d);
snow.input.Keycodes.kp_e = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_e);
snow.input.Keycodes.kp_f = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_f);
snow.input.Keycodes.kp_xor = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_xor);
snow.input.Keycodes.kp_power = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_power);
snow.input.Keycodes.kp_percent = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_percent);
snow.input.Keycodes.kp_less = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_less);
snow.input.Keycodes.kp_greater = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_greater);
snow.input.Keycodes.kp_ampersand = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_ampersand);
snow.input.Keycodes.kp_dblampersand = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_dblampersand);
snow.input.Keycodes.kp_verticalbar = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_verticalbar);
snow.input.Keycodes.kp_dblverticalbar = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_dblverticalbar);
snow.input.Keycodes.kp_colon = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_colon);
snow.input.Keycodes.kp_hash = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_hash);
snow.input.Keycodes.kp_space = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_space);
snow.input.Keycodes.kp_at = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_at);
snow.input.Keycodes.kp_exclam = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_exclam);
snow.input.Keycodes.kp_memstore = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_memstore);
snow.input.Keycodes.kp_memrecall = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_memrecall);
snow.input.Keycodes.kp_memclear = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_memclear);
snow.input.Keycodes.kp_memadd = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_memadd);
snow.input.Keycodes.kp_memsubtract = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_memsubtract);
snow.input.Keycodes.kp_memmultiply = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_memmultiply);
snow.input.Keycodes.kp_memdivide = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_memdivide);
snow.input.Keycodes.kp_plusminus = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_plusminus);
snow.input.Keycodes.kp_clear = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_clear);
snow.input.Keycodes.kp_clearentry = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_clearentry);
snow.input.Keycodes.kp_binary = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_binary);
snow.input.Keycodes.kp_octal = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_octal);
snow.input.Keycodes.kp_decimal = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_decimal);
snow.input.Keycodes.kp_hexadecimal = snow.input.Keycodes.from_scan(snow.input.Scancodes.kp_hexadecimal);
snow.input.Keycodes.lctrl = snow.input.Keycodes.from_scan(snow.input.Scancodes.lctrl);
snow.input.Keycodes.lshift = snow.input.Keycodes.from_scan(snow.input.Scancodes.lshift);
snow.input.Keycodes.lalt = snow.input.Keycodes.from_scan(snow.input.Scancodes.lalt);
snow.input.Keycodes.lmeta = snow.input.Keycodes.from_scan(snow.input.Scancodes.lmeta);
snow.input.Keycodes.rctrl = snow.input.Keycodes.from_scan(snow.input.Scancodes.rctrl);
snow.input.Keycodes.rshift = snow.input.Keycodes.from_scan(snow.input.Scancodes.rshift);
snow.input.Keycodes.ralt = snow.input.Keycodes.from_scan(snow.input.Scancodes.ralt);
snow.input.Keycodes.rmeta = snow.input.Keycodes.from_scan(snow.input.Scancodes.rmeta);
snow.input.Keycodes.mode = snow.input.Keycodes.from_scan(snow.input.Scancodes.mode);
snow.input.Keycodes.audionext = snow.input.Keycodes.from_scan(snow.input.Scancodes.audionext);
snow.input.Keycodes.audioprev = snow.input.Keycodes.from_scan(snow.input.Scancodes.audioprev);
snow.input.Keycodes.audiostop = snow.input.Keycodes.from_scan(snow.input.Scancodes.audiostop);
snow.input.Keycodes.audioplay = snow.input.Keycodes.from_scan(snow.input.Scancodes.audioplay);
snow.input.Keycodes.audiomute = snow.input.Keycodes.from_scan(snow.input.Scancodes.audiomute);
snow.input.Keycodes.mediaselect = snow.input.Keycodes.from_scan(snow.input.Scancodes.mediaselect);
snow.input.Keycodes.www = snow.input.Keycodes.from_scan(snow.input.Scancodes.www);
snow.input.Keycodes.mail = snow.input.Keycodes.from_scan(snow.input.Scancodes.mail);
snow.input.Keycodes.calculator = snow.input.Keycodes.from_scan(snow.input.Scancodes.calculator);
snow.input.Keycodes.computer = snow.input.Keycodes.from_scan(snow.input.Scancodes.computer);
snow.input.Keycodes.ac_search = snow.input.Keycodes.from_scan(snow.input.Scancodes.ac_search);
snow.input.Keycodes.ac_home = snow.input.Keycodes.from_scan(snow.input.Scancodes.ac_home);
snow.input.Keycodes.ac_back = snow.input.Keycodes.from_scan(snow.input.Scancodes.ac_back);
snow.input.Keycodes.ac_forward = snow.input.Keycodes.from_scan(snow.input.Scancodes.ac_forward);
snow.input.Keycodes.ac_stop = snow.input.Keycodes.from_scan(snow.input.Scancodes.ac_stop);
snow.input.Keycodes.ac_refresh = snow.input.Keycodes.from_scan(snow.input.Scancodes.ac_refresh);
snow.input.Keycodes.ac_bookmarks = snow.input.Keycodes.from_scan(snow.input.Scancodes.ac_bookmarks);
snow.input.Keycodes.brightnessdown = snow.input.Keycodes.from_scan(snow.input.Scancodes.brightnessdown);
snow.input.Keycodes.brightnessup = snow.input.Keycodes.from_scan(snow.input.Scancodes.brightnessup);
snow.input.Keycodes.displayswitch = snow.input.Keycodes.from_scan(snow.input.Scancodes.displayswitch);
snow.input.Keycodes.kbdillumtoggle = snow.input.Keycodes.from_scan(snow.input.Scancodes.kbdillumtoggle);
snow.input.Keycodes.kbdillumdown = snow.input.Keycodes.from_scan(snow.input.Scancodes.kbdillumdown);
snow.input.Keycodes.kbdillumup = snow.input.Keycodes.from_scan(snow.input.Scancodes.kbdillumup);
snow.input.Keycodes.eject = snow.input.Keycodes.from_scan(snow.input.Scancodes.eject);
snow.input.Keycodes.sleep = snow.input.Keycodes.from_scan(snow.input.Scancodes.sleep);
snow.platform.web.input.DOMKeys.dom_shift = 16;
snow.platform.web.input.DOMKeys.dom_ctrl = 17;
snow.platform.web.input.DOMKeys.dom_alt = 18;
snow.platform.web.input.DOMKeys.dom_capslock = 20;
snow.platform.web.input.DOMKeys.dom_pageup = 33;
snow.platform.web.input.DOMKeys.dom_pagedown = 34;
snow.platform.web.input.DOMKeys.dom_end = 35;
snow.platform.web.input.DOMKeys.dom_home = 36;
snow.platform.web.input.DOMKeys.dom_left = 37;
snow.platform.web.input.DOMKeys.dom_up = 38;
snow.platform.web.input.DOMKeys.dom_right = 39;
snow.platform.web.input.DOMKeys.dom_down = 40;
snow.platform.web.input.DOMKeys.dom_printscr = 44;
snow.platform.web.input.DOMKeys.dom_insert = 45;
snow.platform.web.input.DOMKeys.dom_delete = 46;
snow.platform.web.input.DOMKeys.dom_lmeta = 91;
snow.platform.web.input.DOMKeys.dom_rmeta = 93;
snow.platform.web.input.DOMKeys.dom_kp_0 = 96;
snow.platform.web.input.DOMKeys.dom_kp_1 = 97;
snow.platform.web.input.DOMKeys.dom_kp_2 = 98;
snow.platform.web.input.DOMKeys.dom_kp_3 = 99;
snow.platform.web.input.DOMKeys.dom_kp_4 = 100;
snow.platform.web.input.DOMKeys.dom_kp_5 = 101;
snow.platform.web.input.DOMKeys.dom_kp_6 = 102;
snow.platform.web.input.DOMKeys.dom_kp_7 = 103;
snow.platform.web.input.DOMKeys.dom_kp_8 = 104;
snow.platform.web.input.DOMKeys.dom_kp_9 = 105;
snow.platform.web.input.DOMKeys.dom_kp_multiply = 106;
snow.platform.web.input.DOMKeys.dom_kp_plus = 107;
snow.platform.web.input.DOMKeys.dom_kp_minus = 109;
snow.platform.web.input.DOMKeys.dom_kp_decimal = 110;
snow.platform.web.input.DOMKeys.dom_kp_divide = 111;
snow.platform.web.input.DOMKeys.dom_kp_numlock = 144;
snow.platform.web.input.DOMKeys.dom_f1 = 112;
snow.platform.web.input.DOMKeys.dom_f2 = 113;
snow.platform.web.input.DOMKeys.dom_f3 = 114;
snow.platform.web.input.DOMKeys.dom_f4 = 115;
snow.platform.web.input.DOMKeys.dom_f5 = 116;
snow.platform.web.input.DOMKeys.dom_f6 = 117;
snow.platform.web.input.DOMKeys.dom_f7 = 118;
snow.platform.web.input.DOMKeys.dom_f8 = 119;
snow.platform.web.input.DOMKeys.dom_f9 = 120;
snow.platform.web.input.DOMKeys.dom_f10 = 121;
snow.platform.web.input.DOMKeys.dom_f11 = 122;
snow.platform.web.input.DOMKeys.dom_f12 = 123;
snow.platform.web.input.DOMKeys.dom_f13 = 124;
snow.platform.web.input.DOMKeys.dom_f14 = 125;
snow.platform.web.input.DOMKeys.dom_f15 = 126;
snow.platform.web.input.DOMKeys.dom_f16 = 127;
snow.platform.web.input.DOMKeys.dom_f17 = 128;
snow.platform.web.input.DOMKeys.dom_f18 = 129;
snow.platform.web.input.DOMKeys.dom_f19 = 130;
snow.platform.web.input.DOMKeys.dom_f20 = 131;
snow.platform.web.input.DOMKeys.dom_f21 = 132;
snow.platform.web.input.DOMKeys.dom_f22 = 133;
snow.platform.web.input.DOMKeys.dom_f23 = 134;
snow.platform.web.input.DOMKeys.dom_f24 = 135;
snow.platform.web.input.DOMKeys.dom_caret = 160;
snow.platform.web.input.DOMKeys.dom_exclaim = 161;
snow.platform.web.input.DOMKeys.dom_quotedbl = 162;
snow.platform.web.input.DOMKeys.dom_hash = 163;
snow.platform.web.input.DOMKeys.dom_dollar = 164;
snow.platform.web.input.DOMKeys.dom_percent = 165;
snow.platform.web.input.DOMKeys.dom_ampersand = 166;
snow.platform.web.input.DOMKeys.dom_underscore = 167;
snow.platform.web.input.DOMKeys.dom_leftparen = 168;
snow.platform.web.input.DOMKeys.dom_rightparen = 169;
snow.platform.web.input.DOMKeys.dom_asterisk = 170;
snow.platform.web.input.DOMKeys.dom_plus = 171;
snow.platform.web.input.DOMKeys.dom_pipe = 172;
snow.platform.web.input.DOMKeys.dom_minus = 173;
snow.platform.web.input.DOMKeys.dom_leftbrace = 174;
snow.platform.web.input.DOMKeys.dom_rightbrace = 175;
snow.platform.web.input.DOMKeys.dom_tilde = 176;
snow.platform.web.input.DOMKeys.dom_audiomute = 181;
snow.platform.web.input.DOMKeys.dom_volumedown = 182;
snow.platform.web.input.DOMKeys.dom_volumeup = 183;
snow.platform.web.input.DOMKeys.dom_comma = 188;
snow.platform.web.input.DOMKeys.dom_period = 190;
snow.platform.web.input.DOMKeys.dom_slash = 191;
snow.platform.web.input.DOMKeys.dom_backquote = 192;
snow.platform.web.input.DOMKeys.dom_leftbracket = 219;
snow.platform.web.input.DOMKeys.dom_rightbracket = 221;
snow.platform.web.input.DOMKeys.dom_backslash = 220;
snow.platform.web.input.DOMKeys.dom_quote = 222;
snow.platform.web.input.DOMKeys.dom_meta = 224;
snow.platform.web.render.opengl.GL.DEPTH_BUFFER_BIT = 256;
snow.platform.web.render.opengl.GL.STENCIL_BUFFER_BIT = 1024;
snow.platform.web.render.opengl.GL.COLOR_BUFFER_BIT = 16384;
snow.platform.web.render.opengl.GL.POINTS = 0;
snow.platform.web.render.opengl.GL.LINES = 1;
snow.platform.web.render.opengl.GL.LINE_LOOP = 2;
snow.platform.web.render.opengl.GL.LINE_STRIP = 3;
snow.platform.web.render.opengl.GL.TRIANGLES = 4;
snow.platform.web.render.opengl.GL.TRIANGLE_STRIP = 5;
snow.platform.web.render.opengl.GL.TRIANGLE_FAN = 6;
snow.platform.web.render.opengl.GL.ZERO = 0;
snow.platform.web.render.opengl.GL.ONE = 1;
snow.platform.web.render.opengl.GL.SRC_COLOR = 768;
snow.platform.web.render.opengl.GL.ONE_MINUS_SRC_COLOR = 769;
snow.platform.web.render.opengl.GL.SRC_ALPHA = 770;
snow.platform.web.render.opengl.GL.ONE_MINUS_SRC_ALPHA = 771;
snow.platform.web.render.opengl.GL.DST_ALPHA = 772;
snow.platform.web.render.opengl.GL.ONE_MINUS_DST_ALPHA = 773;
snow.platform.web.render.opengl.GL.DST_COLOR = 774;
snow.platform.web.render.opengl.GL.ONE_MINUS_DST_COLOR = 775;
snow.platform.web.render.opengl.GL.SRC_ALPHA_SATURATE = 776;
snow.platform.web.render.opengl.GL.FUNC_ADD = 32774;
snow.platform.web.render.opengl.GL.BLEND_EQUATION = 32777;
snow.platform.web.render.opengl.GL.BLEND_EQUATION_RGB = 32777;
snow.platform.web.render.opengl.GL.BLEND_EQUATION_ALPHA = 34877;
snow.platform.web.render.opengl.GL.FUNC_SUBTRACT = 32778;
snow.platform.web.render.opengl.GL.FUNC_REVERSE_SUBTRACT = 32779;
snow.platform.web.render.opengl.GL.BLEND_DST_RGB = 32968;
snow.platform.web.render.opengl.GL.BLEND_SRC_RGB = 32969;
snow.platform.web.render.opengl.GL.BLEND_DST_ALPHA = 32970;
snow.platform.web.render.opengl.GL.BLEND_SRC_ALPHA = 32971;
snow.platform.web.render.opengl.GL.CONSTANT_COLOR = 32769;
snow.platform.web.render.opengl.GL.ONE_MINUS_CONSTANT_COLOR = 32770;
snow.platform.web.render.opengl.GL.CONSTANT_ALPHA = 32771;
snow.platform.web.render.opengl.GL.ONE_MINUS_CONSTANT_ALPHA = 32772;
snow.platform.web.render.opengl.GL.BLEND_COLOR = 32773;
snow.platform.web.render.opengl.GL.ARRAY_BUFFER = 34962;
snow.platform.web.render.opengl.GL.ELEMENT_ARRAY_BUFFER = 34963;
snow.platform.web.render.opengl.GL.ARRAY_BUFFER_BINDING = 34964;
snow.platform.web.render.opengl.GL.ELEMENT_ARRAY_BUFFER_BINDING = 34965;
snow.platform.web.render.opengl.GL.STREAM_DRAW = 35040;
snow.platform.web.render.opengl.GL.STATIC_DRAW = 35044;
snow.platform.web.render.opengl.GL.DYNAMIC_DRAW = 35048;
snow.platform.web.render.opengl.GL.BUFFER_SIZE = 34660;
snow.platform.web.render.opengl.GL.BUFFER_USAGE = 34661;
snow.platform.web.render.opengl.GL.CURRENT_VERTEX_ATTRIB = 34342;
snow.platform.web.render.opengl.GL.FRONT = 1028;
snow.platform.web.render.opengl.GL.BACK = 1029;
snow.platform.web.render.opengl.GL.FRONT_AND_BACK = 1032;
snow.platform.web.render.opengl.GL.CULL_FACE = 2884;
snow.platform.web.render.opengl.GL.BLEND = 3042;
snow.platform.web.render.opengl.GL.DITHER = 3024;
snow.platform.web.render.opengl.GL.STENCIL_TEST = 2960;
snow.platform.web.render.opengl.GL.DEPTH_TEST = 2929;
snow.platform.web.render.opengl.GL.SCISSOR_TEST = 3089;
snow.platform.web.render.opengl.GL.POLYGON_OFFSET_FILL = 32823;
snow.platform.web.render.opengl.GL.SAMPLE_ALPHA_TO_COVERAGE = 32926;
snow.platform.web.render.opengl.GL.SAMPLE_COVERAGE = 32928;
snow.platform.web.render.opengl.GL.NO_ERROR = 0;
snow.platform.web.render.opengl.GL.INVALID_ENUM = 1280;
snow.platform.web.render.opengl.GL.INVALID_VALUE = 1281;
snow.platform.web.render.opengl.GL.INVALID_OPERATION = 1282;
snow.platform.web.render.opengl.GL.OUT_OF_MEMORY = 1285;
snow.platform.web.render.opengl.GL.CW = 2304;
snow.platform.web.render.opengl.GL.CCW = 2305;
snow.platform.web.render.opengl.GL.LINE_WIDTH = 2849;
snow.platform.web.render.opengl.GL.ALIASED_POINT_SIZE_RANGE = 33901;
snow.platform.web.render.opengl.GL.ALIASED_LINE_WIDTH_RANGE = 33902;
snow.platform.web.render.opengl.GL.CULL_FACE_MODE = 2885;
snow.platform.web.render.opengl.GL.FRONT_FACE = 2886;
snow.platform.web.render.opengl.GL.DEPTH_RANGE = 2928;
snow.platform.web.render.opengl.GL.DEPTH_WRITEMASK = 2930;
snow.platform.web.render.opengl.GL.DEPTH_CLEAR_VALUE = 2931;
snow.platform.web.render.opengl.GL.DEPTH_FUNC = 2932;
snow.platform.web.render.opengl.GL.STENCIL_CLEAR_VALUE = 2961;
snow.platform.web.render.opengl.GL.STENCIL_FUNC = 2962;
snow.platform.web.render.opengl.GL.STENCIL_FAIL = 2964;
snow.platform.web.render.opengl.GL.STENCIL_PASS_DEPTH_FAIL = 2965;
snow.platform.web.render.opengl.GL.STENCIL_PASS_DEPTH_PASS = 2966;
snow.platform.web.render.opengl.GL.STENCIL_REF = 2967;
snow.platform.web.render.opengl.GL.STENCIL_VALUE_MASK = 2963;
snow.platform.web.render.opengl.GL.STENCIL_WRITEMASK = 2968;
snow.platform.web.render.opengl.GL.STENCIL_BACK_FUNC = 34816;
snow.platform.web.render.opengl.GL.STENCIL_BACK_FAIL = 34817;
snow.platform.web.render.opengl.GL.STENCIL_BACK_PASS_DEPTH_FAIL = 34818;
snow.platform.web.render.opengl.GL.STENCIL_BACK_PASS_DEPTH_PASS = 34819;
snow.platform.web.render.opengl.GL.STENCIL_BACK_REF = 36003;
snow.platform.web.render.opengl.GL.STENCIL_BACK_VALUE_MASK = 36004;
snow.platform.web.render.opengl.GL.STENCIL_BACK_WRITEMASK = 36005;
snow.platform.web.render.opengl.GL.VIEWPORT = 2978;
snow.platform.web.render.opengl.GL.SCISSOR_BOX = 3088;
snow.platform.web.render.opengl.GL.COLOR_CLEAR_VALUE = 3106;
snow.platform.web.render.opengl.GL.COLOR_WRITEMASK = 3107;
snow.platform.web.render.opengl.GL.UNPACK_ALIGNMENT = 3317;
snow.platform.web.render.opengl.GL.PACK_ALIGNMENT = 3333;
snow.platform.web.render.opengl.GL.MAX_TEXTURE_SIZE = 3379;
snow.platform.web.render.opengl.GL.MAX_VIEWPORT_DIMS = 3386;
snow.platform.web.render.opengl.GL.SUBPIXEL_BITS = 3408;
snow.platform.web.render.opengl.GL.RED_BITS = 3410;
snow.platform.web.render.opengl.GL.GREEN_BITS = 3411;
snow.platform.web.render.opengl.GL.BLUE_BITS = 3412;
snow.platform.web.render.opengl.GL.ALPHA_BITS = 3413;
snow.platform.web.render.opengl.GL.DEPTH_BITS = 3414;
snow.platform.web.render.opengl.GL.STENCIL_BITS = 3415;
snow.platform.web.render.opengl.GL.POLYGON_OFFSET_UNITS = 10752;
snow.platform.web.render.opengl.GL.POLYGON_OFFSET_FACTOR = 32824;
snow.platform.web.render.opengl.GL.TEXTURE_BINDING_2D = 32873;
snow.platform.web.render.opengl.GL.SAMPLE_BUFFERS = 32936;
snow.platform.web.render.opengl.GL.SAMPLES = 32937;
snow.platform.web.render.opengl.GL.SAMPLE_COVERAGE_VALUE = 32938;
snow.platform.web.render.opengl.GL.SAMPLE_COVERAGE_INVERT = 32939;
snow.platform.web.render.opengl.GL.COMPRESSED_TEXTURE_FORMATS = 34467;
snow.platform.web.render.opengl.GL.DONT_CARE = 4352;
snow.platform.web.render.opengl.GL.FASTEST = 4353;
snow.platform.web.render.opengl.GL.NICEST = 4354;
snow.platform.web.render.opengl.GL.GENERATE_MIPMAP_HINT = 33170;
snow.platform.web.render.opengl.GL.BYTE = 5120;
snow.platform.web.render.opengl.GL.UNSIGNED_BYTE = 5121;
snow.platform.web.render.opengl.GL.SHORT = 5122;
snow.platform.web.render.opengl.GL.UNSIGNED_SHORT = 5123;
snow.platform.web.render.opengl.GL.INT = 5124;
snow.platform.web.render.opengl.GL.UNSIGNED_INT = 5125;
snow.platform.web.render.opengl.GL.FLOAT = 5126;
snow.platform.web.render.opengl.GL.DEPTH_COMPONENT = 6402;
snow.platform.web.render.opengl.GL.ALPHA = 6406;
snow.platform.web.render.opengl.GL.RGB = 6407;
snow.platform.web.render.opengl.GL.RGBA = 6408;
snow.platform.web.render.opengl.GL.LUMINANCE = 6409;
snow.platform.web.render.opengl.GL.LUMINANCE_ALPHA = 6410;
snow.platform.web.render.opengl.GL.UNSIGNED_SHORT_4_4_4_4 = 32819;
snow.platform.web.render.opengl.GL.UNSIGNED_SHORT_5_5_5_1 = 32820;
snow.platform.web.render.opengl.GL.UNSIGNED_SHORT_5_6_5 = 33635;
snow.platform.web.render.opengl.GL.FRAGMENT_SHADER = 35632;
snow.platform.web.render.opengl.GL.VERTEX_SHADER = 35633;
snow.platform.web.render.opengl.GL.MAX_VERTEX_ATTRIBS = 34921;
snow.platform.web.render.opengl.GL.MAX_VERTEX_UNIFORM_VECTORS = 36347;
snow.platform.web.render.opengl.GL.MAX_VARYING_VECTORS = 36348;
snow.platform.web.render.opengl.GL.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661;
snow.platform.web.render.opengl.GL.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660;
snow.platform.web.render.opengl.GL.MAX_TEXTURE_IMAGE_UNITS = 34930;
snow.platform.web.render.opengl.GL.MAX_FRAGMENT_UNIFORM_VECTORS = 36349;
snow.platform.web.render.opengl.GL.SHADER_TYPE = 35663;
snow.platform.web.render.opengl.GL.DELETE_STATUS = 35712;
snow.platform.web.render.opengl.GL.LINK_STATUS = 35714;
snow.platform.web.render.opengl.GL.VALIDATE_STATUS = 35715;
snow.platform.web.render.opengl.GL.ATTACHED_SHADERS = 35717;
snow.platform.web.render.opengl.GL.ACTIVE_UNIFORMS = 35718;
snow.platform.web.render.opengl.GL.ACTIVE_ATTRIBUTES = 35721;
snow.platform.web.render.opengl.GL.SHADING_LANGUAGE_VERSION = 35724;
snow.platform.web.render.opengl.GL.CURRENT_PROGRAM = 35725;
snow.platform.web.render.opengl.GL.NEVER = 512;
snow.platform.web.render.opengl.GL.LESS = 513;
snow.platform.web.render.opengl.GL.EQUAL = 514;
snow.platform.web.render.opengl.GL.LEQUAL = 515;
snow.platform.web.render.opengl.GL.GREATER = 516;
snow.platform.web.render.opengl.GL.NOTEQUAL = 517;
snow.platform.web.render.opengl.GL.GEQUAL = 518;
snow.platform.web.render.opengl.GL.ALWAYS = 519;
snow.platform.web.render.opengl.GL.KEEP = 7680;
snow.platform.web.render.opengl.GL.REPLACE = 7681;
snow.platform.web.render.opengl.GL.INCR = 7682;
snow.platform.web.render.opengl.GL.DECR = 7683;
snow.platform.web.render.opengl.GL.INVERT = 5386;
snow.platform.web.render.opengl.GL.INCR_WRAP = 34055;
snow.platform.web.render.opengl.GL.DECR_WRAP = 34056;
snow.platform.web.render.opengl.GL.VENDOR = 7936;
snow.platform.web.render.opengl.GL.RENDERER = 7937;
snow.platform.web.render.opengl.GL.VERSION = 7938;
snow.platform.web.render.opengl.GL.NEAREST = 9728;
snow.platform.web.render.opengl.GL.LINEAR = 9729;
snow.platform.web.render.opengl.GL.NEAREST_MIPMAP_NEAREST = 9984;
snow.platform.web.render.opengl.GL.LINEAR_MIPMAP_NEAREST = 9985;
snow.platform.web.render.opengl.GL.NEAREST_MIPMAP_LINEAR = 9986;
snow.platform.web.render.opengl.GL.LINEAR_MIPMAP_LINEAR = 9987;
snow.platform.web.render.opengl.GL.TEXTURE_MAG_FILTER = 10240;
snow.platform.web.render.opengl.GL.TEXTURE_MIN_FILTER = 10241;
snow.platform.web.render.opengl.GL.TEXTURE_WRAP_S = 10242;
snow.platform.web.render.opengl.GL.TEXTURE_WRAP_T = 10243;
snow.platform.web.render.opengl.GL.TEXTURE_2D = 3553;
snow.platform.web.render.opengl.GL.TEXTURE = 5890;
snow.platform.web.render.opengl.GL.TEXTURE_CUBE_MAP = 34067;
snow.platform.web.render.opengl.GL.TEXTURE_BINDING_CUBE_MAP = 34068;
snow.platform.web.render.opengl.GL.TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
snow.platform.web.render.opengl.GL.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070;
snow.platform.web.render.opengl.GL.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071;
snow.platform.web.render.opengl.GL.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072;
snow.platform.web.render.opengl.GL.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073;
snow.platform.web.render.opengl.GL.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074;
snow.platform.web.render.opengl.GL.MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
snow.platform.web.render.opengl.GL.TEXTURE0 = 33984;
snow.platform.web.render.opengl.GL.TEXTURE1 = 33985;
snow.platform.web.render.opengl.GL.TEXTURE2 = 33986;
snow.platform.web.render.opengl.GL.TEXTURE3 = 33987;
snow.platform.web.render.opengl.GL.TEXTURE4 = 33988;
snow.platform.web.render.opengl.GL.TEXTURE5 = 33989;
snow.platform.web.render.opengl.GL.TEXTURE6 = 33990;
snow.platform.web.render.opengl.GL.TEXTURE7 = 33991;
snow.platform.web.render.opengl.GL.TEXTURE8 = 33992;
snow.platform.web.render.opengl.GL.TEXTURE9 = 33993;
snow.platform.web.render.opengl.GL.TEXTURE10 = 33994;
snow.platform.web.render.opengl.GL.TEXTURE11 = 33995;
snow.platform.web.render.opengl.GL.TEXTURE12 = 33996;
snow.platform.web.render.opengl.GL.TEXTURE13 = 33997;
snow.platform.web.render.opengl.GL.TEXTURE14 = 33998;
snow.platform.web.render.opengl.GL.TEXTURE15 = 33999;
snow.platform.web.render.opengl.GL.TEXTURE16 = 34000;
snow.platform.web.render.opengl.GL.TEXTURE17 = 34001;
snow.platform.web.render.opengl.GL.TEXTURE18 = 34002;
snow.platform.web.render.opengl.GL.TEXTURE19 = 34003;
snow.platform.web.render.opengl.GL.TEXTURE20 = 34004;
snow.platform.web.render.opengl.GL.TEXTURE21 = 34005;
snow.platform.web.render.opengl.GL.TEXTURE22 = 34006;
snow.platform.web.render.opengl.GL.TEXTURE23 = 34007;
snow.platform.web.render.opengl.GL.TEXTURE24 = 34008;
snow.platform.web.render.opengl.GL.TEXTURE25 = 34009;
snow.platform.web.render.opengl.GL.TEXTURE26 = 34010;
snow.platform.web.render.opengl.GL.TEXTURE27 = 34011;
snow.platform.web.render.opengl.GL.TEXTURE28 = 34012;
snow.platform.web.render.opengl.GL.TEXTURE29 = 34013;
snow.platform.web.render.opengl.GL.TEXTURE30 = 34014;
snow.platform.web.render.opengl.GL.TEXTURE31 = 34015;
snow.platform.web.render.opengl.GL.ACTIVE_TEXTURE = 34016;
snow.platform.web.render.opengl.GL.REPEAT = 10497;
snow.platform.web.render.opengl.GL.CLAMP_TO_EDGE = 33071;
snow.platform.web.render.opengl.GL.MIRRORED_REPEAT = 33648;
snow.platform.web.render.opengl.GL.FLOAT_VEC2 = 35664;
snow.platform.web.render.opengl.GL.FLOAT_VEC3 = 35665;
snow.platform.web.render.opengl.GL.FLOAT_VEC4 = 35666;
snow.platform.web.render.opengl.GL.INT_VEC2 = 35667;
snow.platform.web.render.opengl.GL.INT_VEC3 = 35668;
snow.platform.web.render.opengl.GL.INT_VEC4 = 35669;
snow.platform.web.render.opengl.GL.BOOL = 35670;
snow.platform.web.render.opengl.GL.BOOL_VEC2 = 35671;
snow.platform.web.render.opengl.GL.BOOL_VEC3 = 35672;
snow.platform.web.render.opengl.GL.BOOL_VEC4 = 35673;
snow.platform.web.render.opengl.GL.FLOAT_MAT2 = 35674;
snow.platform.web.render.opengl.GL.FLOAT_MAT3 = 35675;
snow.platform.web.render.opengl.GL.FLOAT_MAT4 = 35676;
snow.platform.web.render.opengl.GL.SAMPLER_2D = 35678;
snow.platform.web.render.opengl.GL.SAMPLER_CUBE = 35680;
snow.platform.web.render.opengl.GL.VERTEX_ATTRIB_ARRAY_ENABLED = 34338;
snow.platform.web.render.opengl.GL.VERTEX_ATTRIB_ARRAY_SIZE = 34339;
snow.platform.web.render.opengl.GL.VERTEX_ATTRIB_ARRAY_STRIDE = 34340;
snow.platform.web.render.opengl.GL.VERTEX_ATTRIB_ARRAY_TYPE = 34341;
snow.platform.web.render.opengl.GL.VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922;
snow.platform.web.render.opengl.GL.VERTEX_ATTRIB_ARRAY_POINTER = 34373;
snow.platform.web.render.opengl.GL.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975;
snow.platform.web.render.opengl.GL.VERTEX_PROGRAM_POINT_SIZE = 34370;
snow.platform.web.render.opengl.GL.POINT_SPRITE = 34913;
snow.platform.web.render.opengl.GL.COMPILE_STATUS = 35713;
snow.platform.web.render.opengl.GL.LOW_FLOAT = 36336;
snow.platform.web.render.opengl.GL.MEDIUM_FLOAT = 36337;
snow.platform.web.render.opengl.GL.HIGH_FLOAT = 36338;
snow.platform.web.render.opengl.GL.LOW_INT = 36339;
snow.platform.web.render.opengl.GL.MEDIUM_INT = 36340;
snow.platform.web.render.opengl.GL.HIGH_INT = 36341;
snow.platform.web.render.opengl.GL.FRAMEBUFFER = 36160;
snow.platform.web.render.opengl.GL.RENDERBUFFER = 36161;
snow.platform.web.render.opengl.GL.RGBA4 = 32854;
snow.platform.web.render.opengl.GL.RGB5_A1 = 32855;
snow.platform.web.render.opengl.GL.RGB565 = 36194;
snow.platform.web.render.opengl.GL.DEPTH_COMPONENT16 = 33189;
snow.platform.web.render.opengl.GL.STENCIL_INDEX = 6401;
snow.platform.web.render.opengl.GL.STENCIL_INDEX8 = 36168;
snow.platform.web.render.opengl.GL.DEPTH_STENCIL = 34041;
snow.platform.web.render.opengl.GL.RENDERBUFFER_WIDTH = 36162;
snow.platform.web.render.opengl.GL.RENDERBUFFER_HEIGHT = 36163;
snow.platform.web.render.opengl.GL.RENDERBUFFER_INTERNAL_FORMAT = 36164;
snow.platform.web.render.opengl.GL.RENDERBUFFER_RED_SIZE = 36176;
snow.platform.web.render.opengl.GL.RENDERBUFFER_GREEN_SIZE = 36177;
snow.platform.web.render.opengl.GL.RENDERBUFFER_BLUE_SIZE = 36178;
snow.platform.web.render.opengl.GL.RENDERBUFFER_ALPHA_SIZE = 36179;
snow.platform.web.render.opengl.GL.RENDERBUFFER_DEPTH_SIZE = 36180;
snow.platform.web.render.opengl.GL.RENDERBUFFER_STENCIL_SIZE = 36181;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051;
snow.platform.web.render.opengl.GL.COLOR_ATTACHMENT0 = 36064;
snow.platform.web.render.opengl.GL.DEPTH_ATTACHMENT = 36096;
snow.platform.web.render.opengl.GL.STENCIL_ATTACHMENT = 36128;
snow.platform.web.render.opengl.GL.DEPTH_STENCIL_ATTACHMENT = 33306;
snow.platform.web.render.opengl.GL.NONE = 0;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_COMPLETE = 36053;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_UNSUPPORTED = 36061;
snow.platform.web.render.opengl.GL.FRAMEBUFFER_BINDING = 36006;
snow.platform.web.render.opengl.GL.RENDERBUFFER_BINDING = 36007;
snow.platform.web.render.opengl.GL.MAX_RENDERBUFFER_SIZE = 34024;
snow.platform.web.render.opengl.GL.INVALID_FRAMEBUFFER_OPERATION = 1286;
snow.platform.web.render.opengl.GL.UNPACK_FLIP_Y_WEBGL = 37440;
snow.platform.web.render.opengl.GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
snow.platform.web.render.opengl.GL.CONTEXT_LOST_WEBGL = 37442;
snow.platform.web.render.opengl.GL.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
snow.platform.web.render.opengl.GL.BROWSER_DEFAULT_WEBGL = 37444;
snow.platform.web.utils.ByteArray.BIG_ENDIAN = "bigEndian";
snow.platform.web.utils.ByteArray.LITTLE_ENDIAN = "littleEndian";
snow.types._Types.AssetType_Impl_.bytes = 0;
snow.types._Types.AssetType_Impl_.text = 1;
snow.types._Types.AssetType_Impl_.image = 2;
snow.types._Types.AssetType_Impl_.audio = 3;
snow.types._Types.AudioFormatType_Impl_.unknown = 0;
snow.types._Types.AudioFormatType_Impl_.ogg = 1;
snow.types._Types.AudioFormatType_Impl_.wav = 2;
snow.types._Types.AudioFormatType_Impl_.pcm = 3;
snow.types._Types.TextEventType_Impl_.unknown = 0;
snow.types._Types.TextEventType_Impl_.edit = 1;
snow.types._Types.TextEventType_Impl_.input = 2;
snow.types._Types.GamepadDeviceEventType_Impl_.unknown = 0;
snow.types._Types.GamepadDeviceEventType_Impl_.device_added = 1;
snow.types._Types.GamepadDeviceEventType_Impl_.device_removed = 2;
snow.types._Types.GamepadDeviceEventType_Impl_.device_remapped = 3;
snow.types._Types.SystemEventType_Impl_.unknown = 0;
snow.types._Types.SystemEventType_Impl_.init = 1;
snow.types._Types.SystemEventType_Impl_.ready = 2;
snow.types._Types.SystemEventType_Impl_.update = 3;
snow.types._Types.SystemEventType_Impl_.shutdown = 4;
snow.types._Types.SystemEventType_Impl_.window = 5;
snow.types._Types.SystemEventType_Impl_.input = 6;
snow.types._Types.SystemEventType_Impl_.quit = 7;
snow.types._Types.SystemEventType_Impl_.app_terminating = 8;
snow.types._Types.SystemEventType_Impl_.app_lowmemory = 9;
snow.types._Types.SystemEventType_Impl_.app_willenterbackground = 10;
snow.types._Types.SystemEventType_Impl_.app_didenterbackground = 11;
snow.types._Types.SystemEventType_Impl_.app_willenterforeground = 12;
snow.types._Types.SystemEventType_Impl_.app_didenterforeground = 13;
snow.types._Types.SystemEventType_Impl_.file = 14;
snow.types._Types.WindowEventType_Impl_.unknown = 0;
snow.types._Types.WindowEventType_Impl_.created = 1;
snow.types._Types.WindowEventType_Impl_.shown = 2;
snow.types._Types.WindowEventType_Impl_.hidden = 3;
snow.types._Types.WindowEventType_Impl_.exposed = 4;
snow.types._Types.WindowEventType_Impl_.moved = 5;
snow.types._Types.WindowEventType_Impl_.resized = 6;
snow.types._Types.WindowEventType_Impl_.size_changed = 7;
snow.types._Types.WindowEventType_Impl_.minimized = 8;
snow.types._Types.WindowEventType_Impl_.maximized = 9;
snow.types._Types.WindowEventType_Impl_.restored = 10;
snow.types._Types.WindowEventType_Impl_.enter = 11;
snow.types._Types.WindowEventType_Impl_.leave = 12;
snow.types._Types.WindowEventType_Impl_.focus_gained = 13;
snow.types._Types.WindowEventType_Impl_.focus_lost = 14;
snow.types._Types.WindowEventType_Impl_.close = 15;
snow.types._Types.WindowEventType_Impl_.destroy = 16;
snow.types._Types.InputEventType_Impl_.unknown = 0;
snow.types._Types.InputEventType_Impl_.key = 1;
snow.types._Types.InputEventType_Impl_.mouse = 2;
snow.types._Types.InputEventType_Impl_.touch = 3;
snow.types._Types.InputEventType_Impl_.joystick = 4;
snow.types._Types.InputEventType_Impl_.controller = 5;
snow.types._Types.FileEventType_Impl_.unknown = 0;
snow.types._Types.FileEventType_Impl_.modify = 1;
snow.types._Types.FileEventType_Impl_.remove = 2;
snow.types._Types.FileEventType_Impl_.create = 3;
snow.types._Types.FileEventType_Impl_.drop = 4;
snow.utils.Timer.running_timers = [];
snow.utils.format.tools._InflateImpl.Window.SIZE = 32768;
snow.utils.format.tools._InflateImpl.Window.BUFSIZE = 65536;
snow.utils.format.tools.InflateImpl.LEN_EXTRA_BITS_TBL = [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,-1,-1];
snow.utils.format.tools.InflateImpl.LEN_BASE_VAL_TBL = [3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258];
snow.utils.format.tools.InflateImpl.DIST_EXTRA_BITS_TBL = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,-1,-1];
snow.utils.format.tools.InflateImpl.DIST_BASE_VAL_TBL = [1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577];
snow.utils.format.tools.InflateImpl.CODE_LENGTHS_POS = [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
LuxeApp.main();
})();
