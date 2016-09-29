;(function(window) {
	"use strict"
	angular.module('sheets', [])
	.config(function($compileProvider) {
		$compileProvider.debugInfoEnabled = false;
	})
	.factory('googleAuth', function($q, $rootScope) {
		var CLIENT_ID = '977588012097-tp6j1qv1ipm7s9c0582dprb157lp13p0.apps.googleusercontent.com';
		var API_KEY = 'AIzaSyCdKBQGd4QfCTFFqQ1Lh9FNDwO0mT1QY1c';
		var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.readonly'];

		var hasSheetsApi = false;
		var hasPickerApi = false;
		var hasAuthApi = false;

		var authToken = null;

		var spreadsheetId = localStorage.getItem('sheetid');

		var picker = null;

		var teachers = [];

		var deffered;
		deffered = $q.defer();

		function initApi() {
			gapi.load('client', function() {
				loadSheetsApi().then(function() {
					gapi.load('picker', {callback: function() {
						hasPickerApi = true;
						gapi.load('auth', {callback: function() {
							hasAuthApi = true;
							gapi.auth.authorize({
								client_id: CLIENT_ID,
								scope: SCOPES,
								immediate: true },
								handleAuthResult);
						}});
					}});
				});
			});
		}

		function handleAuth() {
			if(hasAuthApi) {
				gapi.auth.authorize({
					client_id: CLIENT_ID,
					scope: SCOPES,
					immediate: false },
					handleAuthResult);
			}
			return deffered.promise;
		}

		function handleAuthResult(authResult) {
			if(!authResult.error) {
				authToken = authResult.access_token;
				deffered.resolve();
				if(spreadsheetId == null) {
					createPicker();
				}
				else {
					updateTeachers();
				}
			}
			else {
				deffered.reject(authResult.error);
			}
		}

		function updateTeachers() {
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;

				spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: '2015-2016 LISTSERVE Members!A3:C'
				}).then(function(response) {
					for(var t in response.result.values) {
						var teacher = response.result.values[t];
						$rootScope.$applyAsync(function(teacher) {
							teachers.push({
								firstName: teacher[0],
								lastName: teacher[1],
								email: teacher[2],
								fullName: teacher[0] + ' ' + teacher[1] + ' ' + teacher[2]
							});
						}.bind(this, teacher));
					}
					$rootScope.$broadcast('updated-teachers');
				});
			}
		}

		function loadSheetsApi() {
			var deffered = $q.defer();
			var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
			gapi.client.load(discoveryUrl).then(function(d) {
				hasSheetsApi = true;
				deffered.resolve();
			}, function(e) {
				deffered.reject(e);
			});
			return deffered.promise;
		}

		function gotPicker(data) {
			if(data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
				var doc = data[google.picker.Response.DOCUMENTS][0];
				spreadsheetId = doc[google.picker.Document.ID];
				localStorage.setItem('sheetid', spreadsheetId);
				updateTeachers();
			}
		}

		function createPicker() {
			if(hasPickerApi && authToken) {
				picker = new google.picker.PickerBuilder()
					.addView(google.picker.ViewId.SPREADSHEETS)
					.setOAuthToken(authToken)
					.setDeveloperKey(API_KEY)
					.setCallback(gotPicker)
					.build();
				picker.setVisible(true);
			}
		}

		return {
			init: initApi,
			handleAuth: handleAuth,
			getTeachers: function() {
				return teachers;
			},
			hasSheetId: function() {
				return spreadsheetId != null;
			},
			pickSheet: function() {
				createPicker();
			}
		};
	})
	.controller('sheets', function($scope, googleAuth) {
		this.teachers = googleAuth.getTeachers();
		this.showSelectButton = function() {
			return !googleAuth.hasSheetId();
		}
		this.pickSheet = googleAuth.pickSheet;
		googleAuth.init();
	})
	.directive('googlelogin', function() {
		return {
			restrict: 'E',
			template: '<button id="authorize" ng-click="login.handleAuthClick()" ng-show="sheets.showSelectButton()">Select Spreadsheet.</button>',
			controller: function($scope, googleAuth) {
				this.hasUser = false;
				this.handleAuthClick = function() {
					googleAuth.handleAuth();
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
})(window);
