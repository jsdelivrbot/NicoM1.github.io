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
	var values: Map<String, String> = new Map();

	var typeIndex = 0;

	var convo: ConvoNode = {
		id: 'first',
		prompt:
		'
		*cough*

		*ahem*

		Is this thing on?

		*tap* *tap*
		',
		responses: [{
			response: 'Seems like it.',
			prompt: 'Oh, uh, ok.',
			responses: [{
				response: 'Uh, ok, and?',
				id: 'interviewstart',
				prompt: '
				Normally we would conduct this in person,
				but you understand.

				In these circumstances.
				',
				responses: [{
					response: '...',
					prompt: "
					I'm equally out of my element here,
					sorry,

					give me a minute to find my notes.
					",
					responses: [{
						response: 'Uh, ok.',
						prompt: '
						...
						.....

						Sorry I mixed up my files,

						What was your name?
						',
						responses: [{
							id: 'gotname',
							response: 'John Doe',
							setVal: [
								{k:'firstname', v:'John'},
								{k:'lastname', v:'Doe'}],
							prompt: 'Ok *(firstname)*.'
						},{
							response: 'Jack Turner',
							setVal: [
								{k:'firstname', v:'Jack'},
								{k:'lastname', v:'Turner'}],
							switchTo: 'gotname'
						}]}]}]
			},{
				response: 'Yeah continue.',
				switchTo: 'interviewstart'
	}]}]}

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

	function playConvo(convo: ConvoNode, ?ignoreVals: Bool = false) {
		resetTypewriter();
		var curnode = convo;
		if(!ignoreVals) {
			if(curnode.setVal != null) {
				for(s in curnode.setVal) {
					values[s.k] = s.v;
				}
				trace(values);
			}
		}
		if(curnode.switchTo != null) {
			if(convoIDs[curnode.switchTo] != null) {
				playConvo(convoIDs[curnode.switchTo], true);
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
			typeLetters(replaceText(curnode.prompt), page, function() {
				playResponses(curnode);
			}, ++typeIndex);
		}
	}

	function playResponses(convo: ConvoNode, ?index: Int = 0) {
		if(convo.responses == null || index >= convo.responses.length) {
			return;
		}
		typeLetters(convo.responses[index].response, options[index], playResponses.bind(convo, ++index), ++typeIndex);
	}

	function typeLetters(message: String, element: Element, ?onComplete: Void -> Void, ?curIndex: Int = null) {
		if(curIndex != null) {
			if(curIndex != typeIndex) return;
		}
		if(message.length == 0) {
			onComplete();
			return;
		}
		element.innerHTML += message.charAt(0);
		message = message.substr(1);
		Timer.delay(typeLetters.bind(message, element, onComplete, curIndex), Std.int(50 + Math.random()*20));
	}

	function replaceText(text: String): String {
		text = text.trim();
		var replaceEReg: EReg = ~/\*\((.*?)\)\*/;
		if(replaceEReg.match(text)) {
			trace(replaceEReg.matched(0));
			text = replaceEReg.replace(text, values[replaceEReg.matched(1)]);
		}
		return text;
	}

	function resetTypewriter() {
		page.innerHTML = '';
		for(o in options) {
			o.innerHTML = '';
			o.style.display = 'none';
			o.blur();
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
	?switchTo: String,
	?setVal: Array<{k: String, v: String}>
}
