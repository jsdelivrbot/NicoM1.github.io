(function () { "use strict";
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
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	window.document.body.style.backgroundColor = "#1a1a1a";
	window.document.body.style.height = "" + (window.innerHeight - 30) + "px";
	window.onresize = function(e) {
		window.document.body.style.height = "" + (window.innerHeight - 30) + "px";
	};
	window.document.body.style.overflow = "hidden";
	var containter;
	var _this = window.document;
	containter = _this.createElement("div");
	window.document.body.appendChild(containter);
	containter.style.height = "100%";
	containter.style.width = "100%";
	containter.style.overflow = "hidden";
	var input;
	var _this1 = window.document;
	input = _this1.createElement("textarea");
	containter.appendChild(input);
	input.innerHTML = Main.demo;
	input.style.width = "50%";
	input.style.height = "99%";
	input.style.boxSizing = "border-box";
	input.style.backgroundColor = "#1a1a1a";
	input.style.color = "#ecf0f1";
	input.style.borderColor = "#2b2b2b";
	input.style.borderWidth = "0px";
	input.style.resize = "none";
	input.style.overflow = "hidden";
	input.style.padding = "15px";
	input.style.margin = "0px";
	var _this2 = window.document;
	Main.output = _this2.createElement("textarea");
	containter.appendChild(Main.output);
	Main.output.innerText = "";
	Main.output.style.width = "50%";
	Main.output.style.height = "99%";
	Main.output.style.boxSizing = "border-box";
	Main.output.style.width = "50%";
	Main.output.style.backgroundColor = "#1a1a1a";
	Main.output.style.color = "#ecf0f1";
	Main.output.style.borderColor = "#2b2b2b";
	Main.output.style.borderWidth = "0px";
	Main.output.style.resize = "none";
	Main.output.style.overflow = "hidden";
	Main.output.style.padding = "15px";
	Main.output.style.margin = "0px";
	var lexer;
	var parser;
	input.addEventListener("input",function(e1) {
		try {
			Main.output.innerHTML = "";
			lexer = new ListLexer(input.value);
			parser = new ListParser(lexer);
			parser.stat();
		} catch( e2 ) {
			Main.output.innerHTML = Std.string(e2);
		}
	});
	try {
		lexer = new ListLexer(input.value);
		parser = new ListParser(lexer);
		parser.stat();
	} catch( e3 ) {
		Main.output.innerHTML = Std.string(e3);
	}
};
var Token = function(type_,text_) {
	this.type = type_;
	this.text = text_;
};
Token.__name__ = true;
Token.prototype = {
	toString: function() {
		var name = this.type[0];
		return "<'" + this.text + "'," + name + ">";
	}
};
var Lexer = function(input_) {
	this.p = 0;
	this._input = input_;
	this.c = this._input.charAt(this.p);
};
Lexer.__name__ = true;
Lexer.prototype = {
	_consume: function() {
		this.p++;
		if(this.p >= this._input.length) this.c = null; else this.c = this._input.charAt(this.p);
	}
	,_match: function(x) {
		var cp = 0;
		var findings = "";
		while(cp < x.length) {
			if(this.c == null) throw "Reached end of string, Expecting: " + x;
			if(this.c == x.charAt(cp)) {
				findings += this.c;
				this._consume();
			} else throw "Expecting: " + x + "; Found: " + findings;
			cp++;
		}
	}
	,_attempt: function(x) {
		var start = this.p;
		var cp = 0;
		var findings = "";
		while(cp < x.length) {
			if(this.c == null) return false;
			if(this.c == x.charAt(cp)) {
				findings += this.c;
				this._consume();
			} else {
				this.p = start;
				this.c = this._input.charAt(this.p);
				return false;
			}
			cp++;
		}
		this.p = start;
		this.c = this._input.charAt(this.p);
		return true;
	}
	,nextToken: function() {
		throw "nextToken() must be implemented in child class.";
	}
};
var ListLexer = function(input) {
	this._intMatch = new EReg("^[0-9]$","");
	this._letterMatch = new EReg("^[a-z]|_$","i");
	Lexer.call(this,input);
};
ListLexer.__name__ = true;
ListLexer.__super__ = Lexer;
ListLexer.prototype = $extend(Lexer.prototype,{
	_isLetter: function() {
		if(this.c != null) return this._letterMatch.match(this.c); else return false;
	}
	,_isInt: function() {
		if(this.c != null) return this._intMatch.match(this.c); else return false;
	}
	,nextToken: function() {
		while(this.c != null) {
			var _g = this.c;
			switch(_g) {
			case " ":case "\t":case "\n":case "\r":
				this._whitespace();
				continue;
				break;
			case ",":
				this._consume();
				return new Token(TokenType.COMMA,",");
			case "=":
				this._consume();
				return new Token(TokenType.EQUALS,"=");
			default:
				if(this._attempt("should")) {
					this._match("should");
					return new Token(TokenType.KEY,"if");
				} else if(this._attempt("otherwise")) {
					this._match("otherwise");
					return new Token(TokenType.KEY,"else");
				} else if(this._attempt("cease")) {
					this._match("cease");
					return new Token(TokenType.KEY,"end");
				} else if(this._attempt("utter")) {
					this._match("utter");
					return new Token(TokenType.KEY,"print");
				} else if(this._attempt("listen")) {
					this._match("listen");
					return new Token(TokenType.KEY,"input");
				} else if(this._attempt("granted")) {
					this._match("granted");
					return new Token(TokenType.KEY,"while");
				} else if(this._attempt("+=")) {
					this._match("+=");
					return new Token(TokenType.OP,"+=");
				} else if(this._attempt("-=")) {
					this._match("-=");
					return new Token(TokenType.OP,"-=");
				} else if(this._attempt("*=")) {
					this._match("*=");
					return new Token(TokenType.OP,"*=");
				} else if(this._attempt("/=")) {
					this._match("/=");
					return new Token(TokenType.OP,"/=");
				} else if(this._attempt("%=")) {
					this._match("%=");
					return new Token(TokenType.OP,"%=");
				} else if(this._isLetter()) return this._name(); else if(this._isInt()) return this._int(); else if(this.c == "~") return this._string();
				throw "Invalid character: " + this.c;
			}
		}
		return new Token(TokenType.EOF,"<EOF>");
	}
	,_name: function() {
		var name = "";
		do {
			name += this.c;
			this._consume();
		} while(this._isLetter());
		return new Token(TokenType.NAME,name);
	}
	,_int: function() {
		var digits = "";
		do {
			digits += this.c;
			this._consume();
		} while(this._isInt());
		return new Token(TokenType.INT,digits);
	}
	,_string: function() {
		var string = "";
		this._consume();
		while(this.c != "~" && this.c != null) {
			string += this.c;
			this._consume();
		}
		if(this.c != "~") throw "String not terminated; Lexer failed.";
		this._consume();
		return new Token(TokenType.STRING,string);
	}
	,_whitespace: function() {
		while(this.c == " " || this.c == "\t" || this.c == "\n" || this.c == "\r") this._consume();
	}
});
var TokenType = { __ename__ : true, __constructs__ : ["EOF","NAME","INT","EQUALS","OP","COMMA","KEY","STRING"] };
TokenType.EOF = ["EOF",0];
TokenType.EOF.__enum__ = TokenType;
TokenType.NAME = ["NAME",1];
TokenType.NAME.__enum__ = TokenType;
TokenType.INT = ["INT",2];
TokenType.INT.__enum__ = TokenType;
TokenType.EQUALS = ["EQUALS",3];
TokenType.EQUALS.__enum__ = TokenType;
TokenType.OP = ["OP",4];
TokenType.OP.__enum__ = TokenType;
TokenType.COMMA = ["COMMA",5];
TokenType.COMMA.__enum__ = TokenType;
TokenType.KEY = ["KEY",6];
TokenType.KEY.__enum__ = TokenType;
TokenType.STRING = ["STRING",7];
TokenType.STRING.__enum__ = TokenType;
var Parser = function(input_,k_) {
	this._loops = 0;
	this._exiting = false;
	this._p = 0;
	this._loopPoints = new Array();
	this._symbols = new haxe.ds.StringMap();
	this._input = input_;
	this._lookahead = new Array();
};
Parser.__name__ = true;
Parser.prototype = {
	outputtext: function(v) {
		Main.output.innerHTML = Main.output.value + "\n" + Std.string(v);
	}
	,_match: function(x) {
		if(this._LA(1) == x) this._consume(); else throw "Expecting: " + x[0] + "; found" + this._LT(1).toString();
	}
	,_consume: function() {
		this._p++;
		if(this._lookahead.length < this._p) this._lookahead[this._p] = this._input.nextToken();
	}
	,_LT: function(i) {
		while(this._lookahead.length < this._p + i) this._getNext();
		return this._lookahead[this._p + i - 1];
	}
	,_LA: function(i) {
		return this._LT(i).type;
	}
	,_getNext: function() {
		this._lookahead.push(this._input.nextToken());
	}
	,_markLoop: function() {
		this._loopPoints.push(this._p);
	}
	,_restartLoop: function() {
		this._loops++;
		if(this._loops > 10000) throw "Possible infinite loop, loops are currently capped at 10000 cycles.";
		this._p = this._loopPoints.pop();
	}
	,_exitLoop: function() {
		if(this._loopPoints.length == 0) throw "Attempted to exit a non-existent loop";
		this._loopPoints.pop();
		this._exiting = true;
		if(this._loopPoints.length == 0) this._loops = 0;
	}
};
var VarType = { __ename__ : true, __constructs__ : ["STRING","REF","INT"] };
VarType.STRING = ["STRING",0];
VarType.STRING.__enum__ = VarType;
VarType.REF = ["REF",1];
VarType.REF.__enum__ = VarType;
VarType.INT = ["INT",2];
VarType.INT.__enum__ = VarType;
var ListParser = function(input) {
	Parser.call(this,input,3);
};
ListParser.__name__ = true;
ListParser.__super__ = Parser;
ListParser.prototype = $extend(Parser.prototype,{
	stat: function(action) {
		if(action == null) action = true;
		while(this._LA(1) != TokenType.EOF) {
			if(this._LT(1).text == "end") return;
			var success = false;
			if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.EQUALS && (this._LA(3) == TokenType.NAME || this._LA(3) == TokenType.INT || this._LA(3) == TokenType.STRING)) {
				success = true;
				this._assign(action);
			}
			if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.OP && (this._LA(3) == TokenType.INT || this._LA(3) == TokenType.NAME)) {
				success = true;
				this._operator(action);
			}
			if(this._LA(1) == TokenType.KEY && this._LT(1).text == "if") {
				success = true;
				this._match(TokenType.KEY);
				this._conditional(action);
			}
			if(this._LA(1) == TokenType.KEY && this._LT(1).text == "print") {
				success = true;
				this._match(TokenType.KEY);
				this._print(action);
			}
			if(this._LA(1) == TokenType.KEY && this._LT(1).text == "input") {
				success = true;
				this._match(TokenType.KEY);
				this._takeInput(action);
			}
			if(this._LA(1) == TokenType.KEY && this._LT(1).text == "while") {
				success = true;
				this._while(action);
			}
			if(!success) throw "Error parsing <stat>; Current lookahead: " + this._LT(1).toString() + this._LT(2).toString() + this._LT(3).toString();
		}
		if(this._LA(1) != TokenType.EOF) throw "Expecting: <EOF> Found: " + this._LT(1).toString();
	}
	,_assign: function(action) {
		if(action == null) action = true;
		if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.EQUALS && this._LA(3) == TokenType.INT) {
			var symbol = this._LT(1).text;
			this._match(TokenType.NAME);
			this._match(TokenType.EQUALS);
			var value = this._LT(1).text;
			this._match(TokenType.INT);
			if(action) this._symbols.set(symbol,{ text : value, type : VarType.INT});
		} else if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.EQUALS && this._LA(3) == TokenType.NAME) {
			var symbol1 = this._LT(1).text;
			this._match(TokenType.NAME);
			this._match(TokenType.EQUALS);
			var value1 = this._LT(1).text;
			this._match(TokenType.NAME);
			if(action) this._symbols.set(symbol1,{ text : value1, type : VarType.REF});
		} else if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.EQUALS && this._LA(3) == TokenType.STRING) {
			var symbol2 = this._LT(1).text;
			this._match(TokenType.NAME);
			this._match(TokenType.EQUALS);
			var value2 = this._LT(1).text;
			this._match(TokenType.STRING);
			if(action) this._symbols.set(symbol2,{ text : value2, type : VarType.STRING});
		} else throw "Invalid assign: " + this._LT(1).toString() + this._LT(2).toString() + this._LT(2).toString();
	}
	,_operator: function(action) {
		if(action == null) action = true;
		var symbol = this._LT(1).text;
		this._match(TokenType.NAME);
		if(!this._symbols.exists(symbol)) throw "Symbol not defined: " + symbol;
		var op = this._LT(1).text;
		this._match(TokenType.OP);
		var value = this._LT(1).text;
		var $int;
		if(this._LA(1) == TokenType.INT) {
			this._match(TokenType.INT);
			$int = Std.parseInt(value);
		} else {
			this._match(TokenType.NAME);
			var matched = this._symbols.get(value);
			if(matched == null) throw "Symbol not defined: " + value;
			while(matched.type == VarType.REF) {
				var old = matched;
				matched = this._symbols.get(old.text);
				if(matched == null) throw "Symbol not defined: " + old.text;
			}
			$int = Std.parseInt(matched.text);
		}
		if(action) {
			var matched1 = this._symbols.get(symbol);
			while(matched1.type == VarType.REF) {
				var old1 = matched1;
				matched1 = this._symbols.get(old1.text);
				if(matched1 == null) throw "Symbol not defined: " + old1.text;
			}
			if(matched1.type != VarType.INT) throw "Variable must be INT for += operator";
			var current = Std.parseInt(matched1.text);
			switch(op) {
			case "+=":
				current += $int;
				break;
			case "-=":
				current -= $int;
				break;
			case "*=":
				current *= $int;
				break;
			case "/=":
				current = current / $int | 0;
				break;
			case "%=":
				current %= $int;
				break;
			}
			this._symbols.set(symbol,{ text : current == null?"null":"" + current, type : VarType.INT});
		}
	}
	,_conditional: function(action) {
		if(action == null) action = true;
		var condition = this._equality();
		this._body(condition && action);
		if(this._LA(1) == TokenType.KEY && this._LT(1).text == "else") {
			this._match(TokenType.KEY);
			this._body(!condition && action);
		}
	}
	,_while: function(action) {
		if(action == null) action = true;
		this._markLoop();
		this._match(TokenType.KEY);
		var condition = this._equality();
		this._body(condition && action);
		if(condition) {
			this._restartLoop();
			return;
		} else this._exitLoop();
	}
	,_equality: function() {
		var sucess = false;
		if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.EQUALS && this._LA(3) == TokenType.INT) {
			var symbol = this._LT(1).text;
			if(!this._symbols.exists(symbol)) throw "Symbol not defined: " + symbol;
			this._match(TokenType.NAME);
			this._match(TokenType.EQUALS);
			var match = this._LT(1).text;
			this._match(TokenType.INT);
			if(this._symbols.get(symbol).text == match) return true;
		} else if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.EQUALS && this._LA(3) == TokenType.NAME) {
			var symbol1 = this._LT(1).text;
			if(!this._symbols.exists(symbol1)) throw "Symbol not defined: " + symbol1;
			this._match(TokenType.NAME);
			this._match(TokenType.EQUALS);
			var match1 = this._LT(1).text;
			this._match(TokenType.NAME);
			var matched = this._symbols.get(match1);
			if(matched == null) throw "Symbol not defined: " + match1;
			while(matched.type == VarType.REF) {
				var old = matched;
				matched = this._symbols.get(old.text);
				if(matched == null) throw "Symbol not defined: " + old.text;
			}
			if(this._symbols.get(symbol1).text == matched.text) return true;
		} else if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.EQUALS && this._LA(3) == TokenType.STRING) {
			var symbol2 = this._LT(1).text;
			if(!this._symbols.exists(symbol2)) throw "Symbol not defined: " + symbol2;
			this._match(TokenType.NAME);
			this._match(TokenType.EQUALS);
			var match2 = this._LT(1).text;
			this._match(TokenType.STRING);
			if(this._symbols.get(symbol2).text == match2) return true;
		} else throw "Missing condition; Current lookahead: " + this._LT(1).toString() + this._LT(2).toString() + this._LT(3).toString();
		return false;
	}
	,_body: function(action) {
		if(action == null) action = true;
		this.stat(action);
		if(this._LA(1) == TokenType.KEY && this._LT(1).text == "end") {
			this._match(TokenType.KEY);
			this._exiting = false;
		} else throw "Missing: <'end', KEY>";
	}
	,_print: function(action) {
		if(action == null) action = true;
		if(this._LA(1) == TokenType.NAME || this._LA(1) == TokenType.INT || this._LA(1) == TokenType.STRING) {
			var symbol = this._LA(1);
			if(symbol == TokenType.STRING) {
				if(action) this.outputtext(this._LT(1).text);
				this._match(TokenType.STRING);
			} else if(symbol == TokenType.INT) {
				if(action) this.outputtext(this._LT(1).text);
				this._match(TokenType.INT);
			} else if(symbol == TokenType.NAME) {
				var ref = this._symbols.get(this._LT(1).text);
				if(ref == null) throw "Symbol not defined: " + this._LT(1).text;
				while(ref.type == VarType.REF) {
					var old = ref;
					ref = this._symbols.get(ref.text);
					if(ref == null) throw "Symbol not defined: " + old.text;
				}
				if(action) this.outputtext(ref.text);
				this._match(TokenType.NAME);
			}
		} else throw "Expectiong <NAME> after print statement; Found: " + this._LT(1).toString();
	}
	,_takeInput: function(action) {
		if(action == null) action = true;
		if(this._LA(1) == TokenType.NAME) {
			var symbol = this._LT(1).text;
			this._match(TokenType.NAME);
			if(action) {
				var value = { text : this.input(), type : VarType.STRING};
				this._symbols.set(symbol,value);
			}
		} else throw "Expecting <NAME> found: " + this._LT(1).toString();
	}
	,input: function() {
		return prompt();
	}
});
var IMap = function() { };
IMap.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var haxe = {};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
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
String.__name__ = true;
Array.__name__ = true;
Main.testVariables = "\n\t\ta = 100\n\t\tb = ~TEST~\n\t\tc = b\n\t\td = c\n\t\te = d\n\t";
Main.testIncorrectVariables = "\n\t\ta = 2a00\t\t\n\t";
Main.testStrings = "\n\t\ta = ~testing~\n\t";
Main.testIncorrectStrings = "\n\t\ta = ~testing\n\t";
Main.testConditionals = "\n\t\ta = 0\n\t\tshould a = 0 cease\n\t";
Main.testIncorrectConditionals = "\n\t\ta = 0\n\t\tshould a = cease\n\t";
Main.testNestedConditionals = "\n\t\ta = 100\n\t\tshould a = 0 \n\t\tcease\n\t\totherwise\n\t\tshould a = 100\n\t\t\t\tshould a = 0 cease\n\t\t\t\totherwise cease\n\t\t\tcease\n\t\tcease\n\t";
Main.testIncorrectNestedConditionals = "\n\t\ta = 100\n\t\tshould a = 0 \n\t\tcease\n\t\totherwise\n\t\t\tshould a = 100\n\t\t\t\tshould a = 0 cease\n\t\t\t\totherwise cease\n\t\tcease\n\t";
Main.testPrint = "\n\t\ta = ~test~\n\t\tb = 100\n\t\tutter a\n\t\tutter b\n\t\tutter ~test~\n\t\tutter 100\n\t\tc = a\n\t\td = c\n\t\tutter d\n\t";
Main.testIncorrectPrint = "\n\t\tutter ~test~ = 100\n\t";
Main.testInput = "\n\t\tutter ~Type Something Please:~\n\t\tlisten a\n\t";
Main.testIncorrectInput = "\n\t\tlisten 100\n\t";
Main.testConversation = "\n\t\tutter ~So hey, whats up?~\n\t";
Main.testWhile = "\n\t\ta = 0\n\t\tb = 1\n\t\tgranted a = 0\n\t\t\tutter ~IN LOOP A, 0~\n\t\t\tlisten a\n\t\t\tgranted b = 1\n\t\t\t\tutter ~IN LOOP B, 1~\n\t\t\t\tlisten b\n\t\t\tcease\n\t\tcease\n\t";
Main.testPlus = "\n\t\ta = 0\n\t\tb = 1\n\t\ta += b\n\t\tutter ~0 + 1 =~\n\t\tutter a\n\t";
Main.testMinus = "\n\t\ta = 1\n\t\ta -= 1\n\t\tutter ~1 - 1 =~\n\t\tutter a\n\t";
Main.testMult = "\n\t\ta = 1\n\t\ta *= 2\n\t\tutter ~1 * 2 =~\n\t\tutter a\n\t";
Main.testDiv = "\n\t\ta = 2\n\t\ta /= 2\n\t\tutter ~2 / 2 =~\n\t\tutter a\n\t";
Main.testIncrement = "\n\t\ttrue = ~true~\n\t\taccumulator = 0\n\t\tgranted true = ~true~\n\t\t\taccumulator += 1\n\t\t\tutter accumulator\n\t\t\tshould accumulator = 10\n\t\t\t\ttrue = ~false~\n\t\t\tcease\n\t\tcease\n\t\tutter ~done~\n\t";
Main.testDecrement = "\n\t\ttrue = ~true~\n\t\taccumulator = 10\n\t\tgranted true = ~true~\n\t\t\taccumulator -= 1\n\t\t\tutter accumulator\n\t\t\tshould accumulator = 0\n\t\t\t\ttrue = ~false~\n\t\t\tcease\n\t\tcease\n\t\tutter ~done~\n\t";
Main.fibionacci = "\n\tutter ~fibionacci~\n\ta = 0\n\tutter a\n\tb = 1\n\tutter b\n\tc = 0\n\toldb = 0\n \n \n\tloops = 10\n\tdo_fib = 1\n\tgranted do_fib = 1\n\t\toldb = b\n\t\tc = 0\n\t\tc += a\n\t\tc += b\n \n\t\tutter c\n \n\t\ta = oldb\n\t\ta += 0\n\t\tb = c\n\t\tb += 0\n \n\t\tloops -= 1\n\t\tshould loops = 0\n\t\t\tdo_fib = 0\n\t\tcease\n\tcease\n\t";
Main.demo = "utter ~This is a toy.~ \nutter ~~\n\nutter ~It is not nearly complete, is likely full of bugs, and is changing constantly.~ \nutter ~~\n\nutter ~It uses odd/interesting keywords because hey, thesauri are fun right? (I googled that, I had the plural wrong).~\nutter ~~\n \nutter ~If this interests you, let me know what you think/made.~\nutter ~~\n\nutter ~Here are the features of the language:~\nutter ~~\n\nutter ~Variables are declared like (look on code side), and are ALWAYS by reference.~\nutter ~Should you wish to convert an integer reference to the integer itself, you must use var += 0 (for now).~\n\na = 100 \nb = a \nc = ~I'm a string~\n\nutter ~~\n \nutter ~Conditionals (ifs) are replaced with 'should', 'otherwise', and 'cease'.~ utter ~~\n\nshould a = 100 \n\tutter ~Look at code again.~ \n\tutter ~~\ncease \notherwise \n\tutter ~This will not be shown~ \ncease \n\nutter ~Loops (whiles) are replaced with 'granted'.~\nutter ~~\n\ncondition = ~true~\ngranted condition = ~true~\n\ta += 1 \n\tshould a = 110 \n\t\tutter ~Look at code again.~\n\t\tutter ~~\n\t\tcondition = ~false~\n\tcease \ncease\n\nutter ~The only math operators are `+=` `-=` `*=` and `/=`.~\nutter ~They only act on integers.~\nutter ~They only work when used with a variable on the left and an int, or integer referencing variable on the right.~\nutter ~~\n\nutter ~You should really know how to output text by now, if not then figure it out.~\nutter ~~\n\nutter ~There's input too, it is `listen`, but it's not set up on web yet.~\nutter ~~\n\nutter ~I *think* that's all the features so far, but this'll change quick, let me know if you make something cool, or just try it, @nico_m__, ~\nutter ~~\n\nutter ~Enjoy.~";
Main.main();
})();
