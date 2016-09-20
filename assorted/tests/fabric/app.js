;(function(window) {
	"use strict";
	function addRect(x, y, w, h, color, canvas) {
		var rect = new fabric.Rect({
			left: x,
			top: y,
			fill: color,
			width: w,
			height: h
		});
		canvas.add(rect);
	}

	function addCircle(x, y, r, color, canvas) {
		var circle = new fabric.Circle({
			left: x,
			top: y,
			fill: color,
			radius: r
		});
		canvas.add(circle);
	}

	function addStroke(object, strokeWidth, color) {
		object.set({strokeWidth: strokeWidth, stroke: color});
	}

	var directionEnum = {
		back: -2,
		backwards: -1,
		forwards: 1,
		front: 2
	};

	function changeIndex(canvas, object, direction) {
		switch(direction) {
			case directionEnum.back:
				canvas.sendToBack(object);
				break;
			case directionEnum.backwards:
				canvas.sendBackwards(object);
				break;
			case directionEnum.forwards:
				canvas.bringForward(object);
				break;
			case directionEnum.front:
				canvas.bringToFront(object);
				break;
		}
	}

	function removeObject(object) {
		object.remove();
	}

	function setColor(object, color) {
		object.set({fill: color});
	}

	angular.module('app', ['colorpicker.module', 'ngAnimate', 'twitterApp.services'])
	.directive('fabric', function(){
		return {
			restrict: 'E',
			scope: {},
			templateUrl: 'fabric.html',
			controller: ['$scope', '$document', 'twitterService', function($scope, $document, twitterService) {
				$scope.objectSelected = false;
				$scope.selectedColor = '#00aaFF';
				$scope.strokeColor = '#004fff';
				$scope.freedraw = false;
				$scope.twitterConnected = false;

				twitterService.initialize();

				if(twitterService.isReady()) {
					$scope.twitterConnected = true;
				}

				$scope.addRect = function() {
					addRect(100, 100, 100, 100, $scope.selectedColor, $scope.canvas);
				};
				$scope.addCirc = function() {
					addCircle(100, 100, 50, $scope.selectedColor, $scope.canvas);
				};
				$scope.sendBackwards = function() {
					changeIndex($scope.canvas, $scope.canvas.getActiveObject(), directionEnum.backwards);
					$scope.canvas.renderAll();
				};
				$scope.sendForwards = function() {
					changeIndex($scope.canvas, $scope.canvas.getActiveObject(), directionEnum.forwards);
					$scope.canvas.renderAll();
				};
				$scope.sendToBack = function() {
					changeIndex($scope.canvas, $scope.canvas.getActiveObject(), directionEnum.back);
					$scope.canvas.renderAll();
				};
				$scope.sendToFront = function() {
					changeIndex($scope.canvas, $scope.canvas.getActiveObject(), directionEnum.front);
					$scope.canvas.renderAll();
				};
				$scope.removeObject = function() {
					removeObject($scope.canvas.getActiveObject());
					$scope.canvas.renderAll();
				};
				$scope.updateColor = function() {
					console.log($scope.selectedColor);
					setColor($scope.canvas.getActiveObject(), $scope.selectedColor);
					$scope.canvas.renderAll();
				};
				$scope.updateStroke = function() {
					addStroke($scope.canvas.getActiveObject(), $scope.strokeWidth, $scope.strokeColor);
					$scope.canvas.renderAll();
				};
				$scope.toggleFreeDraw = function() {
					$scope.freedraw = !$scope.freedraw;
					$scope.canvas.isDrawingMode = $scope.freedraw;
				};
				$scope.connectTwitter = function() {
					twitterService.connectTwitter().then(function() {
						if(twitterService.isReady()) {
							$scope.twitterConnected = true;
						}
						else {
						}
					}, function(error){
						console.log(error);
					})
				};
				$scope.postTweet = function() {
					twitterService.uploadMedia($scope.canvas.toDataURL().replace('data:image/png;base64,', '')).then(function(e){
						twitterService.postTweet('Check out my canvas: [angular testing]', [e.media_id_string]);
					}, function(e) {
						console.log(e);
					})
				};
			}],
			link: function(scope, element, attrs) {
				var ctx = element.find('canvas')[0];
				scope.canvas = new fabric.Canvas(ctx);
				scope.canvas.on('object:selected', function(evt) {
					if(scope.canvas.getActiveObject() != null) {
						scope.$apply(function() {
							scope.selectedColor = evt.target.getFill();
							scope.strokeWidth = evt.target.getStrokeWidth();
							scope.objectSelected = true;
						});
					}
				});
				scope.canvas.on('selection:cleared', function(evt) {
					scope.$apply(function() {
						scope.objectSelected = false;
					});
				});
				angular.element(scope.canvas.wrapperEl).on('mousewheel', function(e) {
					var delta = e.wheelDelta/4000;

					var posXview = e.offsetX;
					var posYview = e.offsetY;

					var zoomCenter = new fabric.Point(posXview, posYview);
					var zoomValue = scope.canvas.getZoom() + delta;

					scope.canvas.zoomToPoint(zoomCenter, zoomValue);
				});

				scope.panning = false;
				scope.canvas.wrapperEl.tabIndex = 0;
				scope.canvas.wrapperEl.addEventListener('keydown', function(e) {
					scope.panning = e.shiftKey;
				});
				scope.canvas.wrapperEl.addEventListener('keyup', function(e) {
					scope.panning = e.shiftKey;
				});

				scope.canvas.on('mouse:move', function (e) {
					if(scope.panning) {
						var delta = new fabric.Point(e.e.movementX, e.e.movementY);
						scope.canvas.relativePan(delta);
					}
				});
			}
		};
	})
})(window);
