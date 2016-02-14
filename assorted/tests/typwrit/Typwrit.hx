package ;

import js.Browser;
import js.html.ParagraphElement;
import js.html.AnchorElement;
import js.html.Element;

import haxe.Timer;

using StringTools;

class Typwrit {
	static var instance: Typwrit;
	var page: ParagraphElement;
	var options: Array<AnchorElement> = [];

	var convoIDs: Map<String, ConvoNode> = new Map();

	var text =
"
Test.

So this appears to be working?

Do you hear me now?

Bye.
";

	var convo: ConvoNode = {
		id: 'first',
		prompt:
		'
		*cough*

		*ahem*

		Is this thing on?

		*tap* *tap*
		',
		responses: [
			{
				response: 'Seems like it.',
				prompt: 'Oh, uh, ok.',
				responses: [
					{
						response: 'uh, ok, and?',
						switchTo: 'first'
					},
					{
						response: 'yeah continue.',
						switchTo: 'first'
					}
				]
			}
		]
	}

	public function new() {
		Browser.window.onload = ready;
	}

	function ready() {
		page = cast Browser.document.getElementById('page');
		options[0] = cast Browser.document.getElementById('op1');
		options[1] = cast Browser.document.getElementById('op2');

		resetTypewriter();

		parseConvoIDs(convo);
		playConvo(convo);
	}

	function parseConvoIDs(convo: ConvoNode) {
		if(convo.id != null) {
			convoIDs[convo.id] = convo;
		}
		if(convo.responses != null) {
			for(r in convo.responses) {
				parseConvoIDs(r);
			}
		}
	}

	function playConvo(convo: ConvoNode) {
		resetTypewriter();
		var curnode = convo;
		if(curnode.switchTo != null) {
			if(convoIDs[curnode.switchTo] != null) {
				playConvo(convoIDs[curnode.switchTo]);
				return;
			}
			else {
				throw "convoid: " + "'" + curnode.switchTo + "'" + " not defined.";
			}
		}
		if(curnode.responses != null) {
			for(i in 0...curnode.responses.length) {
				options[i].onclick = function() {
					playConvo(curnode.responses[i]);
					return;
				}
				options[i].onkeypress = function(code) {
					trace(code);
					if(code.which == 13 || code.keyCode == 13) {
						playConvo(curnode.responses[i]);
						return;
					}
				}
				options[i].style.display = null;
			}
			if(options.length > curnode.responses.length) {
				for(i in curnode.responses.length...options.length) {
					options[i].style.display = 'none';
				}
			}
		}
		if(curnode.prompt != null) {
			trace(curnode.prompt);
			typeLetters(curnode.prompt.trim(), page, function() {
				playResponses(curnode);
			});
		}
	}

	function playResponses(convo: ConvoNode, ?index: Int = 0) {
		if(index >= convo.responses.length) {
			return;
		}
		typeLetters(convo.responses[index].response, options[index], playResponses.bind(convo, ++index));
	}

	function typeLetters(message: String, element: Element, ?onComplete: Void -> Void) {
		if(message.length == 0) {
			onComplete();
			return;
		}
		element.innerHTML += message.charAt(0);
		message = message.substr(1);
		Timer.delay(typeLetters.bind(message, element, onComplete), Std.int(50 + Math.random()*20));
	}

	function resetTypewriter() {
		page.innerHTML = '';
		for(o in options) {
			o.innerHTML = '';
			o.style.display = 'none';
		}
	}

	public static function main() {
		instance = new Typwrit();
	}
}

typedef ConvoNode = {
	?prompt: String,
	?response: String,
	?responses: Array<ConvoNode>,
	?id: String,
	?switchTo: String
}
