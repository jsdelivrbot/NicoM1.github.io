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
				redirectTo: '/details/0'
			})
			.when('/details/:teacherId', {
				templateUrl: 'details.html',
				controller: 'details as details'
		});
	})
	.factory('googleAuth', function($q, $rootScope) {
		var CLIENT_ID = '977588012097-tp6j1qv1ipm7s9c0582dprb157lp13p0.apps.googleusercontent.com';
		var API_KEY = 'AIzaSyCdKBQGd4QfCTFFqQ1Lh9FNDwO0mT1QY1c';
		var SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.readonly'].join(' ');
		var SHEET = '2015-2016 LISTSERVE Members!';

		var hasSheetsApi = false;
		var hasPickerApi = false;
		var hasAuthApi = false;

		var authToken = null;

		var spreadsheetId = localStorage.getItem('sheetid');

		var picker = null;

		var teachers = [];

		var deffered;
		deffered = $q.defer();

		var auth2 = null;

		function initApi() {
			gapi.load('client', function() {
				loadSheetsApi().then(function() {
					gapi.load('picker', {callback: function() {
						hasPickerApi = true;
						gapi.load('auth2', {callback: function() {
							gapi.auth2.init({
								client_id: CLIENT_ID,
								scope: SCOPES,
								immediate: true }).then(function(auth) {
									auth2 = auth;
									hasAuthApi = true;
									if(auth.isSignedIn.get()) {
										handleAuthResult(auth2.currentUser.get().getAuthResponse());
									}
								});
							}
						});
					}});
				});
			});
		}

		function handleAuth() {
			if(hasAuthApi) {
				auth2.signIn().then(function(d) {
					handleAuthResult(auth2.currentUser.get().getAuthResponse());
				});
			}
			return deffered.promise;
		}

		function handleAuthResult(authResult) {
			console.log(authResult);
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
					range: SHEET + 'A3:C'
				}).then(function(response) {
					teachers = [];
					$rootScope.$applyAsync(function() {
						for(var t = 0; t < response.result.values.length; t++) {
							var teacher = response.result.values[t];
								teachers.push({
									firstName: teacher[0],
									lastName: teacher[1],
									email: teacher[2],
									fullName: teacher[0] + ' ' + teacher[1] + ' ' + teacher[2],
									index: t
								});
							}
						$rootScope.$broadcast('updated-teachers');
					});
				});
			}
		}

		function updateTeacher(index, teacher) {
			index += 3;
			var deffered = $q.defer();
			if(!teacher) {
				deffered.reject('missing teacher argument');
			}
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				spreadsheets.values.update({
					spreadsheetId: spreadsheetId,
					range: SHEET + 'A'+index+':C'+index,
					values: [[teacher.firstName, teacher.lastName, teacher.email]],
					valueInputOption: 'RAW'
				}).then(function(response) {
					deffered.resolve(response);
				}, function(error) {
					deffered.reject(error);
				});
			}
			else {
				deffered.reject('could not save teacher, missing sheets api and or sheet id');
			}
			return deffered.promise;
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

		function signOut() {
			if(hasAuthApi) {
				auth2.signOut().then(function() {
					alert('out');
				});
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
			},
			updateTeacher: updateTeacher,
			authorized: function() {
				return authToken != null;
			},
			signOut: signOut
		};
	})
	.controller('sheets', function($scope, $location, googleAuth) {
		this.teachers = googleAuth.getTeachers();
		this.showSelectButton = function() {
			return !googleAuth.hasSheetId() || !googleAuth.authorized();
		}
		this.selectTeacher = function(teacher) {
			$location.path('/details/'+teacher.index);
		}
		this.signOut = googleAuth.signOut;
		this.pickSheet = googleAuth.pickSheet;
	})
	.controller('details', function($scope, $routeParams, googleAuth) {
		this.teachers = googleAuth.getTeachers();
		this.teacherId = Number($routeParams.teacherId);
		this.currentTeacher = this.teachers[this.teacherId];
		this.editingTeacher = {};
		if(this.currentTeacher) {
			copyTeacher(this.currentTeacher, this.editingTeacher);
		}
		var removeListener = null;
		function copyTeacher(fromTeacher, toTeacher) {
			toTeacher.firstName = fromTeacher.firstName;
			toTeacher.lastName = fromTeacher.lastName;
			toTeacher.email = fromTeacher.email;
			toTeacher.index = fromTeacher.index;
		}
		function compareTeachers(t1, t2) {
			return t1.firstName == t2.firstName && t1.lastName == t2.lastName && t1.email == t2.email;
		}

		this.updateTeacher = function() {
			if(this.editingTeacher && this.currentTeacher && !compareTeachers(this.editingTeacher, this.currentTeacher)) {
				googleAuth.updateTeacher(this.editingTeacher.index, this.editingTeacher).then(function() {
					copyTeacher(this.editingTeacher, this.currentTeacher)
				}.bind(this), function(e) {
					console.log(e);
				});
			}
		}
		$scope.$on('updated-teachers', function() {
			this.currentTeacher = this.teachers[this.teacherId];
			copyTeacher(this.currentTeacher, this.editingTeacher);
		}.bind(this));
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
	.run(function(googleAuth) {
		googleAuth.init();
	})
})(window);
