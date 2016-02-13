package ;

import js.Browser;
import js.html.ParagraphElement;

import haxe.Timer;

class Typwrit {
	static var instance: Typwrit;
	var page: ParagraphElement;

	var text =
"
Test.

So this appears to be working?

Do you hear me now?

Bye.
";

	public function new() {
		Browser.window.onload = ready;
	}

	function ready() {
		page = cast Browser.document.getElementById('page');
		typeLetters(text);
	}

	function typeLetters(message: String) {
		if(message.length == 0) {
			return;
		}
		page.innerHTML += message.charAt(0);
		message = message.substr(1);
		Timer.delay(typeLetters.bind(message), Std.int(50 + Math.random()*20));
	}

	public static function main() {
		instance = new Typwrit();
	}
}
