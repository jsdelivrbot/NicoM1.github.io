if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
;(function(window) {
	"use strict"
	angular.module('sheets', ['ngRoute'])
	.config(function($compileProvider, $routeProvider) {
		$compileProvider.debugInfoEnabled = false;

		$routeProvider
			.when('/', {
				templateUrl: 'mainlist.html',
				controller: 'sheets as sheets'
			})
			.when('/details', {
				redirectTo: '/'
			})
			.when('/details/:teacherId', {
				templateUrl: 'details.html',
				controller: 'details as details'
			})
			.when('/details/search/:searchCriteria/:teacherId', {
				templateUrl: 'details.html',
				controller: 'details as details'
			})
			.otherwise({
				template: '404, page not found'
			})
			;
	})
	.directive('googlelogin', function() {
		return {
			restrict: 'E',
			template: '<button id="authorize" ng-click="login.handleAuthClick()" ng-show="sheets.showSelectButton()" class="btn btn-success">Select Spreadsheet.</button>',
			controller: function($scope, googleAuth) {
				this.hasUser = false;
				this.handleAuthClick = function() {
					googleAuth.handleAuthClick();
					$scope.$on('updated-teachers', function() {
						this.hasUser = true;
					}.bind(this));
				}
			},
			controllerAs: 'login',
			link: function(scope, element, attrs, ctrl) {
			}
		}
	})
	.run(function(googleAuth) {
		googleAuth.init();
	})
})(window);
