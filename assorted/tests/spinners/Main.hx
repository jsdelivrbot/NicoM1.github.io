package;

import js.Browser;
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
		new Spinner(0, 0, 5);
		new Spinner(500, 100, 15);
		new Spinner(1000, 0, 50);
	}
}

class Spinner {
	var namespace: String = 'http://www.w3.org/2000/svg';
	var element: SVGElement;


	public function new(x: Float, y: Float, time: Float) {
		element = createSVG();
		element.setAttribute('style', 'position: absolute; left:$x; top:$y;');
		element.setAttribute('width', '250');
		element.setAttribute('height', '250');

		var arc = createArc(65, 65, 40, 0, 'none', '#00517a', 30);
		element.appendChild(arc);

		element.appendChild(createCircle(65, 65, 42, '#00b1eb', '#555555', 1.5));
		element.appendChild(createCircle(65, 65, 55, 'none', '#555555', 7));
		element.appendChild(createLine(65, 45, 40, 'none', '#FFFFFF', 3.75, 'round'));
		element.appendChild(createLine(45, 65, 40, false, 'none', '#FFFFFF', 3.75, 'round'));

		Browser.document.body.appendChild(element);

		var a = 0;
		var timer = new Timer(Math.floor(time*1000/360));
		timer.run = function() {
			a++;
			a%=360;
			arc.setAttribute('d', createArcData(65, 65, 40, a).join(' '));
		}
	}

	function createSVG(): SVGElement {
		var svg: SVGElement = cast Browser.document.createElementNS(namespace, 'svg');
		return svg;
	}

	function createCircle(cx: Float, cy: Float, r: Float, ?fill: String, ?stroke: String, ?strokeWidth: Float): CircleElement {
		var circle: CircleElement = cast Browser.document.createElementNS(namespace, 'circle');
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
		var path: PathElement = cast Browser.document.createElementNS(namespace, 'path');
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
		var path: PathElement = cast Browser.document.createElementNS(namespace, 'path');

		var data = createArcData(cx, cy, radius, endAngle);

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

	function createArcData(cx: Float, cy: Float, radius: Float, endAngle: Float): Array<Dynamic> {
		var start = polarToCartesian(cx, cy, radius, 0);
		var end = polarToCartesian(cx, cy, radius, endAngle);
		var largeArc: Int = endAngle <= 180? 0 : 1;
		var data: Array<Dynamic> = [
			'M', start.x, start.y, 'A', radius, radius, 0, largeArc, 1, end.x, end.y
		];
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
