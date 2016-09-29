;(function(window) {
	"use strict"
	angular.module('sheets', [])
	.factory('googleAuth', function($q, $rootScope) {
		var CLIENT_ID = '977588012097-tp6j1qv1ipm7s9c0582dprb157lp13p0.apps.googleusercontent.com';
		var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.readonly'];

		var hasSheetsApi = false;
		var hasPickerApi = false;
		var hasAuthApi = false;

		var authToken = null;

		var spreadsheetId = null;

		var teachers = [];


		var deffered;
		deffered = $q.defer();

		function updateTeachers() {
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;

				spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: '2015-2016 LISTSERVE Members!A3:C'
				}).then(function(response) {
					for(var t in response.result.values) {
						var teacher = response.result.values[t];
						$rootScope.$apply(function() {
							teachers.push({
								firstName: teacher[0],
								lastName: teacher[1],
								email: teacher[2]
							});
						});
					}
					$rootScope.$broadcast('updated-teachers');
				});
			}
		}

		function handleAuthResult(authResult) {
			if(!authResult.error) {
				authToken = authResult.access_token;
				loadSheetsApi();
				gapi.load('picker', {callback: function() {
					hasPickerApi = true;
					createPicker();
				}});
			}
			else {
				deffered.reject(authResult.error);
			}
		}
		function loadSheetsApi() {
			var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
			gapi.client.load(discoveryUrl).then(function(d) {
				hasSheetsApi = true;
				deffered.resolve();
				$rootScope.$broadcast('got-sheets-api');
			}, function(e) {
				deffered.reject(e);
			});
		}
		function gotPicker(data) {
			if(data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
				var doc = data[google.picker.Response.DOCUMENTS][0];
				spreadsheetId = doc[google.picker.Document.ID]
				updateTeachers();
			}
		}
		function createPicker() {
			if(hasPickerApi && authToken) {
				var picker = new google.picker.PickerBuilder()
					.addView(google.picker.ViewId.SPREADSHEETS)
					.setOAuthToken(authToken)
					.setDeveloperKey('AIzaSyCdKBQGd4QfCTFFqQ1Lh9FNDwO0mT1QY1c')
					.setCallback(gotPicker)
					.build();
				picker.setVisible(true);
			}
		}
		return {
			init: function() {
				gapi.load('client', function() {
					gapi.load('auth', {callback: function() {
						hasAuthApi = true;
					}});
				});
			},
			handleAuth: function() {
				if(hasAuthApi) {
					gapi.auth.authorize({
						client_id: CLIENT_ID,
						scope: SCOPES,
						immediate: false },
						handleAuthResult);
				}
				return deffered.promise;
			},
			getSpreadsheets: function() {
				if(hasSheetsApi) {
					return gapi.client.sheets.spreadsheets;
				}
				return null;
			},
			getTeachers: function() {
				return teachers;
			}
		};
	})
	.controller('sheets', function($scope, googleAuth) {
		this.spreadsheets = null;
		this.teachers = googleAuth.getTeachers();

		googleAuth.init();
	})
	.directive('googlelogin', function() {
		return {
			restrict: 'E',
			template: '<button id="authorize" ng-click="login.handleAuthClick()" ng-show="sheets.teachers.length == 0">Select Spreadsheet.</button>',
			controller: function(googleAuth) {
				this.hasUser = false;
				this.handleAuthClick = function() {
					googleAuth.handleAuth().then(function() {
						this.hasUser = true;
					}.bind(this), function(e) {
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
