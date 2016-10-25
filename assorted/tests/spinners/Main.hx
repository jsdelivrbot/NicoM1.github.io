package;

import js.Browser;
import js.html.Element;
import js.html.DivElement;
import js.html.svg.Element;
import js.html.svg.SVGElement;
import js.html.svg.CircleElement;
import js.html.svg.PathElement;

import haxe.Timer;

class Main {
	static function main() {
		Browser.window.onload = function() { new DemoApp(); };
	}
}

class DemoApp {
	public function new() {
		var first = new Spinner(0, 0, 5);
		first.onclick = function() {
			if(first.running) {
				first.stopTimer(); //pause on click
			}
			else {
				first.startTimer(); //start on click
			}
		}

		var second = new Spinner(500, 100, 15);
		second.onclick = function() {
			second.reuse(500, 500, 30); //reset and move positions
		}

		var third = new Spinner(1000, 0, 50);
		third.onfinished = function() {
			third.destroy(); //remove timer on finish
		}
	}
}

class Spinner {
	var namespace: String = 'http://www.w3.org/2000/svg';
	var container: DivElement;
	var arcElement: PathElement;
	var timer: Timer;

	var duration: Float;
	var currentAngle: Float = 0;

	public var running(default, null): Bool = false;

	public var onclick: Void -> Void;
	public var onfinished: Void -> Void;

	public function new(x: Float, y: Float, time: Float) {
		buildTimerDOM(x, y);

		reuse(x, y, time);
	}

	public function reuse(x: Float, y: Float, time: Float) : Void {
		duration = time;
		currentAngle = 0;
		setPosition(x, y);
		startTimer();
	}


	function buildTimerDOM(x: Float, y: Float) {
		container = Browser.document.createDivElement();
		var element = createSVG();
		container.appendChild(element);
		element.setAttribute('width', '130');
		element.setAttribute('height', '130');

		arcElement = createArc(65, 65, 40, 0, 'none', '#00517a', 30);
		element.appendChild(arcElement);

		var button = createSVG();
		button.appendChild(createCircle(65, 65, 42, '#00b1eb', '#555555', 1.5));
		button.appendChild(createLine(65, 45, 40, 'none', '#FFFFFF', 3.75, 'round'));
		button.appendChild(createLine(45, 65, 40, false, 'none', '#FFFFFF', 3.75, 'round'));

		button.onclick = function() {
			if(onclick != null) {
				onclick();
			}
		}

		element.appendChild(button);
		element.appendChild(createCircle(65, 65, 55, 'none', '#555555', 7));

		Browser.document.body.appendChild(container);
	}

	public function resetTimer() {
		currentAngle = 0;
		startTimer();
	}

	public function startTimer() {
		if(timer != null) {
			timer.stop();
		}

		timer = new Timer(Math.floor(duration*1000/360)); //ticks at timeInSeconds/360degrees
		timer.run = tick;
		running = true;
	}

	public function stopTimer() {
		timer.stop();
		running = false;
	}

	function tick() {
		currentAngle++;
		if(currentAngle >= 360) {
			if(onfinished != null) {
				onfinished();
			}
		}
		currentAngle %= 360;
		arcElement.setAttribute('d', createArcData(65, 65, 40, currentAngle));
	}

	public function destroy() {
		timer.stop();
		container.remove();
	}

	public function setPosition(x: Float, y: Float) {
		container.setAttribute('style', 'position: absolute; left:${x}px; top:${y}px;');
	}

	function createSVGElement<T: js.html.svg.Element>(element: String): T {
		return cast Browser.document.createElementNS(namespace, element);
	}

	function createSVG(): SVGElement {
		var svg: SVGElement = createSVGElement('svg');
		return svg;
	}

	function createCircle(cx: Float, cy: Float, r: Float, ?fill: String, ?stroke: String, ?strokeWidth: Float): CircleElement {
		var circle: CircleElement = createSVGElement('circle');
		circle.setAttribute('cx', Std.string(cx));
		circle.setAttribute('cy', Std.string(cy));
		circle.setAttribute('r', Std.string(r));
		if(fill != null) {
			circle.setAttribute('fill', fill);
		}
		if(stroke != null) {
			circle.setAttribute('stroke', stroke);
		}
		if(strokeWidth != null) {
			circle.setAttribute('stroke-width', Std.string(strokeWidth));
		}
		return circle;
	}

	function createLine(startX: Float, startY: Float, length: Float, vertical: Bool = true, ?fill: String, ?stroke: String, ?strokeWidth: Float, ?strokeCap: String): PathElement {
		var path: PathElement = createSVGElement('path');
		var data: Array<Dynamic> = [
			'M', startX, startY, (vertical)?'v':'h', length
		];
		path.setAttribute('d', data.join(' '));
		if(fill != null) {
			path.setAttribute('fill', fill);
		}
		if(stroke != null) {
			path.setAttribute('stroke', stroke);
		}
		if(strokeCap != null) {
			path.setAttribute('stroke-linecap', strokeCap);
		}
		if(strokeWidth != null) {
			path.setAttribute('stroke-width', Std.string(strokeWidth));
		}
		return path;
	}

	function createArc(cx: Float, cy: Float, radius: Float, endAngle: Float, ?fill: String, ?stroke: String, ?strokeWidth: Float, ?strokeCap: String): PathElement {
		var path: PathElement = createSVGElement('path');

		var data = createArcData(cx, cy, radius, endAngle);

		path.setAttribute('d', data);
		if(fill != null) {
			path.setAttribute('fill', fill);
		}
		if(stroke != null) {
			path.setAttribute('stroke', stroke);
		}
		if(strokeCap != null) {
			path.setAttribute('stroke-linecap', strokeCap);
		}
		if(strokeWidth != null) {
			path.setAttribute('stroke-width', Std.string(strokeWidth));
		}

		return path;
	}

	function createArcData(cx: Float, cy: Float, radius: Float, endAngle: Float): String {
		var start = polarToCartesian(cx, cy, radius, 0);
		var end = polarToCartesian(cx, cy, radius, endAngle);
		var largeArc: Int = endAngle <= 180? 0 : 1;
		var data: String = 'M ${start.x} ${start.y} A $radius $radius 0 $largeArc 1 ${end.x} ${end.y}';
		return data;
	}

	function polarToCartesian(centerX: Float, centerY: Float, radius: Float, degrees: Float) {
	  var radians = (degrees - 90) * Math.PI / 180.0;

	  return {
	    x: centerX + (radius * Math.cos(radians)),
	    y: centerY + (radius * Math.sin(radians))
	  };
	}
 }
