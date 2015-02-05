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
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
};
var Main = function() { };
Main.__name__ = ["Main"];
Main.main = function() {
	var lexer;
	var parser;
	lexer = new ListLexer(prompt("Enter Code:", "code goes here"));
	parser = new ListParser(lexer);
	parser.stat();
};
var Token = function(type_,text_) {
	this.type = type_;
	this.text = text_;
};
Token.__name__ = ["Token"];
Token.prototype = {
	toString: function() {
		var name = this.type[0];
		return "<'" + this.text + "'," + name + ">";
	}
	,__class__: Token
};
var Lexer = function(input_) {
	this.p = 0;
	this._input = input_;
	this.c = this._input.charAt(this.p);
};
Lexer.__name__ = ["Lexer"];
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
	,__class__: Lexer
};
var ListLexer = function(input) {
	this._intMatch = new EReg("^[0-9]$","");
	this._letterMatch = new EReg("^[a-z]|_$","i");
	Lexer.call(this,input);
};
ListLexer.__name__ = ["ListLexer"];
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
				if(this._attempt("if")) {
					this._match("if");
					return new Token(TokenType.KEY,"if");
				} else if(this._attempt("else")) {
					this._match("else");
					return new Token(TokenType.KEY,"else");
				} else if(this._attempt("end")) {
					this._match("end");
					return new Token(TokenType.KEY,"end");
				} else if(this._attempt("print")) {
					this._match("print");
					return new Token(TokenType.KEY,"print");
				} else if(this._attempt("input")) {
					this._match("input");
					return new Token(TokenType.KEY,"input");
				} else if(this._attempt("while")) {
					this._match("while");
					return new Token(TokenType.KEY,"while");
				} else if(this.c == "'") return this._string(); else if(this._isLetter()) return this._name(); else if(this._isInt()) return this._int();
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
		this._consume();
		var string = "";
		var last = "";
		do {
			if(this.c != "x") {
				string += this.c;
				console.log(this.c);
			} else console.log("ESCAPE");
			this._consume();
			last = this.c;
			console.log(last);
		} while((this.c != "'" || last == "x") && this.c != null);
		if(this.c == null) throw "String not terminated; Lexer failed.";
		this._consume();
		return new Token(TokenType.STRING,string);
	}
	,_whitespace: function() {
		while(this.c == " " || this.c == "\t" || this.c == "\n" || this.c == "\r") this._consume();
	}
	,__class__: ListLexer
});
var TokenType = { __ename__ : true, __constructs__ : ["EOF","NAME","INT","EQUALS","COMMA","KEY","STRING"] };
TokenType.EOF = ["EOF",0];
TokenType.EOF.__enum__ = TokenType;
TokenType.NAME = ["NAME",1];
TokenType.NAME.__enum__ = TokenType;
TokenType.INT = ["INT",2];
TokenType.INT.__enum__ = TokenType;
TokenType.EQUALS = ["EQUALS",3];
TokenType.EQUALS.__enum__ = TokenType;
TokenType.COMMA = ["COMMA",4];
TokenType.COMMA.__enum__ = TokenType;
TokenType.KEY = ["KEY",5];
TokenType.KEY.__enum__ = TokenType;
TokenType.STRING = ["STRING",6];
TokenType.STRING.__enum__ = TokenType;
var Parser = function(input_,k_) {
	this._exiting = false;
	this._p = 0;
	this._loopPoints = new Array();
	this._symbols = new haxe.ds.StringMap();
	this._input = input_;
	this._lookahead = new Array();
};
Parser.__name__ = ["Parser"];
Parser.prototype = {
	_match: function(x) {
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
		this._p = this._loopPoints.pop();
	}
	,_exitLoop: function() {
		if(this._loopPoints.length == 0) throw "Attempted to exit a non-existent loop";
		this._loopPoints.pop();
		this._exiting = true;
	}
	,__class__: Parser
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
ListParser.__name__ = ["ListParser"];
ListParser.__super__ = Parser;
ListParser.prototype = $extend(Parser.prototype,{
	stat: function(action) {
		if(action == null) action = true;
		while(this._LA(1) != TokenType.EOF) {
			if(this._LT(1).text == "end") return;
			var success = false;
			if(this._LA(1) == TokenType.NAME && this._LA(2) == TokenType.EQUALS && this._LA(3) == TokenType.NAME || this._LA(3) == TokenType.INT || this._LA(3) == TokenType.STRING) {
				success = true;
				this._assign(action);
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
		}
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
				if(action) js.Lib.alert(this._LT(1).text);
				this._match(TokenType.STRING);
			} else if(symbol == TokenType.INT) {
				if(action) js.Lib.alert(this._LT(1).text);
				this._match(TokenType.INT);
			} else if(symbol == TokenType.NAME) {
				var ref = this._symbols.get(this._LT(1).text);
				if(ref == null) throw "Symbol not defined: " + this._LT(1).text;
				while(ref.type == VarType.REF) {
					var old = ref;
					ref = this._symbols.get(ref.text);
					if(ref == null) throw "Symbol not defined: " + old.text;
				}
				if(action) js.Lib.alert(ref.text);
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
				var value = { text : prompt(), type : VarType.STRING};
				this._symbols.set(symbol,value);
			}
		} else throw "Expecting <NAME> found: " + this._LT(1).toString();
	}
	,__class__: ListParser
});
var IMap = function() { };
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
var buddy = {};
buddy.Should = function(value,assert,inverse) {
	if(inverse == null) inverse = false;
	this.value = value;
	this.assert = assert;
	this.inverse = inverse;
};
buddy.Should.__name__ = ["buddy","Should"];
buddy.Should.prototype = {
	be: function(expected,p) {
		this.test(this.value == expected,p,"Expected " + this.quote(expected) + ", was " + this.quote(this.value),"Didn't expect " + this.quote(expected) + " but was equal to that");
	}
	,quote: function(v) {
		if(typeof(v) == "string") return "\"" + Std.string(v) + "\""; else return Std.string(v);
	}
	,stackPos: function(p) {
		return [haxe.StackItem.FilePos(null,p.fileName,p.lineNumber)];
	}
	,test: function(expr,p,error,errorInverted) {
		if(!this.inverse) this.assert(expr,error,this.stackPos(p)); else this.assert(!expr,errorInverted,this.stackPos(p));
	}
	,__class__: buddy.Should
};
buddy.ShouldDynamic = function(value,assert,inverse) {
	buddy.Should.call(this,value,assert,inverse);
};
buddy.ShouldDynamic.__name__ = ["buddy","ShouldDynamic"];
buddy.ShouldDynamic.should = function(d,assert) {
	return new buddy.ShouldDynamic(d,assert);
};
buddy.ShouldDynamic.__super__ = buddy.Should;
buddy.ShouldDynamic.prototype = $extend(buddy.Should.prototype,{
	get_not: function() {
		return new buddy.ShouldDynamic(this.value,this.assert,!this.inverse);
	}
	,__class__: buddy.ShouldDynamic
});
buddy.ShouldInt = function(value,assert,inverse) {
	if(inverse == null) inverse = false;
	buddy.Should.call(this,value,assert,inverse);
};
buddy.ShouldInt.__name__ = ["buddy","ShouldInt"];
buddy.ShouldInt.should = function(i,assert) {
	return new buddy.ShouldInt(i,assert);
};
buddy.ShouldInt.__super__ = buddy.Should;
buddy.ShouldInt.prototype = $extend(buddy.Should.prototype,{
	get_not: function() {
		return new buddy.ShouldInt(this.value,this.assert,!this.inverse);
	}
	,beLessThan: function(expected,p) {
		this.test(this.value < expected,p,"Expected less than " + this.quote(expected) + ", was " + this.quote(this.value),"Expected not less than " + this.quote(expected) + ", was " + this.quote(this.value));
	}
	,beGreaterThan: function(expected,p) {
		this.test(this.value > expected,p,"Expected greater than " + this.quote(expected) + ", was " + this.quote(this.value),"Expected not greater than " + this.quote(expected) + ", was " + this.quote(this.value));
	}
	,__class__: buddy.ShouldInt
});
buddy.ShouldFloat = function(value,assert,inverse) {
	if(inverse == null) inverse = false;
	buddy.Should.call(this,value,assert,inverse);
};
buddy.ShouldFloat.__name__ = ["buddy","ShouldFloat"];
buddy.ShouldFloat.should = function(i,assert) {
	return new buddy.ShouldFloat(i,assert);
};
buddy.ShouldFloat.__super__ = buddy.Should;
buddy.ShouldFloat.prototype = $extend(buddy.Should.prototype,{
	get_not: function() {
		return new buddy.ShouldFloat(this.value,this.assert,!this.inverse);
	}
	,beLessThan: function(expected,p) {
		this.test(this.value < expected,p,"Expected less than " + this.quote(expected) + ", was " + this.quote(this.value),"Expected not less than " + this.quote(expected) + ", was " + this.quote(this.value));
	}
	,beGreaterThan: function(expected,p) {
		this.test(this.value > expected,p,"Expected greater than " + this.quote(expected) + ", was " + this.quote(this.value),"Expected not greater than " + this.quote(expected) + ", was " + this.quote(this.value));
	}
	,beCloseTo: function(expected,precision,p) {
		if(precision == null) precision = 2;
		var expr = Math.abs(expected - this.value) < Math.pow(10,-precision) / 2;
		this.test(expr,p,"Expected close to " + this.quote(expected) + ", was " + this.quote(this.value),"Expected " + this.quote(this.value) + " not to be close to " + this.quote(expected));
	}
	,__class__: buddy.ShouldFloat
});
buddy.ShouldString = function(value,assert,inverse) {
	if(inverse == null) inverse = false;
	buddy.Should.call(this,value,assert,inverse);
};
buddy.ShouldString.__name__ = ["buddy","ShouldString"];
buddy.ShouldString.should = function(str,assert) {
	return new buddy.ShouldString(str,assert);
};
buddy.ShouldString.__super__ = buddy.Should;
buddy.ShouldString.prototype = $extend(buddy.Should.prototype,{
	get_not: function() {
		return new buddy.ShouldString(this.value,this.assert,!this.inverse);
	}
	,contain: function(substring,p) {
		this.test(this.value.indexOf(substring) >= 0,p,"Expected " + this.quote(this.value) + " to contain " + this.quote(substring),"Expected " + this.quote(this.value) + " not to contain " + this.quote(substring));
	}
	,startWith: function(substring,p) {
		this.test(StringTools.startsWith(this.value,substring),p,"Expected " + this.quote(this.value) + " to start with " + this.quote(substring),"Expected " + this.quote(this.value) + " not to start with " + this.quote(substring));
	}
	,endWith: function(substring,p) {
		this.test(StringTools.endsWith(this.value,substring),p,"Expected " + this.quote(this.value) + " to end with " + this.quote(substring),"Expected " + this.quote(this.value) + " not to end with " + this.quote(substring));
	}
	,match: function(regexp,p) {
		this.test(regexp.match(this.value),p,"Expected " + this.quote(this.value) + " to match regular expression","Expected " + this.quote(this.value) + " not to match regular expression");
	}
	,__class__: buddy.ShouldString
});
buddy.ShouldIterable = function(value,assert,inverse) {
	if(inverse == null) inverse = false;
	buddy.Should.call(this,value,assert,inverse);
};
buddy.ShouldIterable.__name__ = ["buddy","ShouldIterable"];
buddy.ShouldIterable.should = function(value,assert) {
	return new buddy.ShouldIterable(value,assert);
};
buddy.ShouldIterable.__super__ = buddy.Should;
buddy.ShouldIterable.prototype = $extend(buddy.Should.prototype,{
	get_not: function() {
		return new buddy.ShouldIterable(this.value,this.assert,!this.inverse);
	}
	,contain: function(o,p) {
		this.test(Lambda.exists(this.value,function(el) {
			return el == o;
		}),p,"Expected " + this.quote(this.value) + " to contain " + this.quote(o),"Expected " + this.quote(this.value) + " not to contain " + this.quote(o));
	}
	,containAll: function(values,p) {
		var expr = true;
		var $it0 = $iterator(values)();
		while( $it0.hasNext() ) {
			var a = $it0.next();
			var a1 = [a];
			if(!Lambda.exists(this.value,(function(a1) {
				return function(v) {
					return v == a1[0];
				};
			})(a1))) {
				expr = false;
				break;
			}
		}
		this.test(expr,p,"Expected " + this.quote(this.value) + " to contain all of " + this.quote(values),"Expected " + this.quote(this.value) + " not to contain all of " + this.quote(values));
	}
	,containExactly: function(values,p) {
		var a = $iterator(this.value)();
		var b = $iterator(values)();
		var expr = true;
		while(a.hasNext() || b.hasNext()) if(a.next() != b.next()) {
			expr = false;
			break;
		}
		this.test(expr,p,"Expected " + this.quote(this.value) + " to contain exactly " + this.quote(values),"Expected " + this.quote(this.value) + " not to contain exactly " + this.quote(values));
	}
	,__class__: buddy.ShouldIterable
});
buddy.ShouldFunctions = function(value,assert,inverse) {
	if(inverse == null) inverse = false;
	this.value = value;
	this.assert = assert;
	this.inverse = inverse;
};
buddy.ShouldFunctions.__name__ = ["buddy","ShouldFunctions"];
buddy.ShouldFunctions.should = function(value,assert) {
	return new buddy.ShouldFunctions(value,assert);
};
buddy.ShouldFunctions.prototype = {
	get_not: function() {
		return new buddy.ShouldFunctions(this.value,this.assert,!this.inverse);
	}
	,throwValue: function(v,p) {
		var expr = false;
		try {
			this.value();
		} catch( e ) {
			expr = e == v;
		}
		this.test(expr,p,"Expected " + this.quote(this.value) + " to throw " + this.quote(v),"Expected " + this.quote(this.value) + " not to throw " + this.quote(v));
	}
	,throwType: function(type,p) {
		var expr = false;
		var name = null;
		try {
			this.value();
		} catch( e ) {
			name = Type.getClassName(type);
			expr = js.Boot.__instanceof(e,type);
		}
		this.test(expr,p,"Expected " + this.quote(this.value) + " to throw type " + name,"Expected " + this.quote(this.value) + " not to throw type " + name);
	}
	,be: function(expected,p) {
		this.test(this.value == expected,p,"Expected " + this.quote(expected) + ", was " + this.quote(this.value),"Didn't expect " + this.quote(expected) + " but was equal to that");
	}
	,quote: function(v) {
		if(typeof(v) == "string") return "\"" + Std.string(v) + "\""; else return Std.string(v);
	}
	,stackPos: function(p) {
		return [haxe.StackItem.FilePos(null,p.fileName,p.lineNumber)];
	}
	,test: function(expr,p,error,errorInverted) {
		if(!this.inverse) this.assert(expr,error,this.stackPos(p)); else this.assert(!expr,errorInverted,this.stackPos(p));
	}
	,__class__: buddy.ShouldFunctions
};
var haxe = {};
haxe.StackItem = { __ename__ : true, __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe.StackItem; return $x; };
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
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
	,__class__: haxe.ds.StringMap
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = ["js","Boot"];
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
				if(js.Boot.__interfLoop((o instanceof Array) && o.__enum__ == null?Array:o.__class__,cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Lib = function() { };
js.Lib.__name__ = ["js","Lib"];
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
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
String.__name__ = ["String"];
Array.__name__ = ["Array"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
Main.testVariables = "\n\t\ta = 100\n\t\tb = 'TEST'\n\t\tc = b\n\t\td = c\n\t\te = d\n\t";
Main.testIncorrectVariables = "\n\t\ta = 2a00\t\t\n\t";
Main.testStrings = "\n\t\ta = 'testing'\n\t";
Main.testIncorrectStrings = "\n\t\ta = 'testing\n\t";
Main.testConditionals = "\n\t\ta = 0\n\t\tif a = 0 end\n\t";
Main.testIncorrectConditionals = "\n\t\ta = 0\n\t\tif a =  end\n\t";
Main.testNestedConditionals = "\n\t\ta = 100\n\t\tif a = 0 \n\t\tend\n\t\telse\n\t\t\tif a = 100\n\t\t\t\tif a = 0 end\n\t\t\t\telse end\n\t\t\tend\n\t\tend\n\t";
Main.testIncorrectNestedConditionals = "\n\t\ta = 100\n\t\tif a = 0 \n\t\tend\n\t\telse\n\t\t\tif a = 100\n\t\t\t\tif a = 0 end\n\t\t\t\telse end\n\t\tend\n\t";
Main.testPrint = "\n\t\ta = 'test'\n\t\tb = 100\n\t\tprint a\n\t\tprint b\n\t\tprint 'test'\n\t\tprint 100\n\t\tc = a\n\t\td = c\n\t\tprint d\n\t";
Main.testIncorrectPrint = "\n\t\tprint 'test' = 100\n\t";
Main.testInput = "\n\t\tprint 'Type Something Please:'\n\t\tinput a\n\t";
Main.testIncorrectInput = "\n\t\tinput 100\n\t";
Main.testConversation = "\n\t\tprint 'So hey, whatx's up?'\n\t";
Main.testWhile = "\n\t\ta = 0\n\t\tb = 1\n\t\twhile a = 0\n\t\t\tprint 'IN LOOP A, 0'\n\t\t\tinput a\n\t\t\twhile b = 1\n\t\t\t\tprint 'IN LOOP B, 1'\n\t\t\t\tinput b\n\t\t\tend\n\t\tend\n\t";
Main.main();
})();
