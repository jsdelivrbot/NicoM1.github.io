;(function(window) {
	"use strict"
	angular.module('sheets', [])
	.factory('googleAuth', function($q) {
		var deffered;
		deffered = $q.defer();
		function handleAuthResult(authResult) {
			alert('result');
			if(!authResult.error) {
				loadSheetsApi();
			}
			else {
				deffered.reject(authResult.error);
			}
		}
		function loadSheetsApi() {
			var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
			gapi.client.load(discoveryUrl).then(function(d) {
				deffered.resolve();
				alert('resolved');
			}, function(e) {
				alert('relved');
				deffered.reject(e);
			});
		}
		return {
			handleAuth: function() {
				var CLIENT_ID = '977588012097-tp6j1qv1ipm7s9c0582dprb157lp13p0.apps.googleusercontent.com';
				var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

				gapi.auth.authorize({
					client_id: CLIENT_ID,
					scope: SCOPES,
					immediate: false,
					handleAuthResult
				});
				return deffered.promise;
			}
		};
	})
	.directive('googlelogin', function() {
		return {
			restrict: 'E',
			scope: {},
			template: '<button id="authorize" ng-click="login.handleAuthClick()" ng-show="user == null">Authorize</button>',
			controller: function(googleAuth) {
				this.hasUser = false;
				this.handleAuthClick = function() {
					googleAuth.handleAuth().then(function() {
						this.hasUser = true;
						alert(this.hasUser);
					}, function(e) {
						console.log(e);
					});
				}
			},
			controllerAs: 'login',
			link: function(scope, element, attrs, ctrl) {
			}
		}
	})
})(window);
