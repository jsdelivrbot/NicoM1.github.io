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
			.otherwise({
				template: '404, page not found'
			})
			;
	})
	.factory('googleAuth', function($q, $rootScope) {
		var CLIENT_ID = '977588012097-tp6j1qv1ipm7s9c0582dprb157lp13p0.apps.googleusercontent.com';
		var API_KEY = 'AIzaSyCdKBQGd4QfCTFFqQ1Lh9FNDwO0mT1QY1c';
		var SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.readonly'].join(' ');
		var SHEET = 'Main database';
		var SHEET_REMOVED = 'Removed Teachers';
		var OFFSET = 1;
		var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		var POSITIONS = [
			'district',
			'aceIt',
			'facebook',
			'conference2015',
			'conference2016',
			'firstName',
			'lastName',
			'school',
			'email',
			'courses',
			//'contacted2017',
			//'contacted',
			'emailSecondary',
			'id',
			'comments',
			'facebookAlias',
			'psa',
			'representative',
			'exectutive',
			'retired',
			'retiredYear',
			'leave',
			'leaveYear',
			'lastUpdated'
		];

		var hasSheetsApi = false;
		var hasPickerApi = false;
		var hasAuthApi = false;

		var authToken = null;

		var spreadsheetId = localStorage.getItem('sheetid');
		var sheetId = null;

		var picker = null;

		var teachers = [];

		var deffered;
		deffered = $q.defer();

		var auth2 = null;

		function initApi() {
			$q.all([loadApi('client'), loadApi('picker'), loadApi('auth2')]).then(function() {
				hasPickerApi = true;
				loadSheetsApi().then(function() {
					gapi.auth2.init({
						client_id: CLIENT_ID,
						scope: SCOPES,
						immediate: true }).then(function(auth) {
							auth2 = auth;
							hasAuthApi = true;
							if(auth2.isSignedIn.get()) {
								handleAuthResult(auth2.currentUser.get().getAuthResponse());
							}
						});
				})
			});
		}

		function getSheetId() {
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				spreadsheets.get({
					spreadsheetId: spreadsheetId
				}).then(function(d) {
					console.log(d);
					for(var i = 0; i < d.result.sheets.length; i++) {
						if(d.result.sheets[i].properties.title == SHEET) {
							sheetId = d.result.sheets[i].properties.sheetId;
						}
					}
				}, function(e) {
					console.log(e);
				})
			}
		}

		function loadApi(api) {
			var deffered = $q.defer();
			gapi.load(api, function() {
				deffered.resolve();
			});
			return deffered.promise;
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
			if(!authResult.error) {
				authToken = authResult.access_token;
				deffered.resolve();
				if(spreadsheetId == null) {
					createPicker();
				}
				else {
					getSheetId();
					updateTeachers();
				}
			}
			else {
				deffered.reject(authResult.error);
			}
		}

		function findTeacherIndex(teacher) {
			for(var t = 0; t < teachers.length; t++) {
				var foundTeacher = teachers[t];
				if(teacher.firstName == foundTeacher.firstName && teacher.lastName == foundTeacher.lastName) {
					return foundTeacher.index;
				}
			}
			return 0;
		}

		function updateTeachers() {
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: SHEET + '!A2:'+ALPHABET[POSITIONS.length-1]
				}).then(function(response) {
					teachers.length = 0;
					$rootScope.$applyAsync(function() {
						for(var t = 0; t < response.result.values.length; t++) {
							var teacher = response.result.values[t];
							var parsed = parseTeacher(teacher, t);
							if(parsed) {
								teachers.push(parsed);
							}
						}
						$rootScope.$broadcast('updated-teachers');
					});
				}, function(error) {
					console.log(error);
				});
			}
		}

		function generateID() {
			var final = '';
			var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
			for(var i = 0; i < 8; i++) {
				final += characters.charAt(Math.floor(Math.random() * characters.length));
			}
			return final;
		}

		function parseTeacher(teacher, index) {
			var parsed = {};

			var found = false;
			for(var i = 0; i < POSITIONS.length; i++) {
				parsed[POSITIONS[i]] = teacher[i];
				if(teacher[i] != null) {
					found = true;
				}
			}
			if(!found) {
				return null;
			}
			parsed.index = index;
			if(parsed.lastUpdated) {
				parsed.lastUpdated = new Date(Date.parse(parsed.lastUpdated));
			}
			if(parsed.retiredYear) {
				parsed.retiredYear = new Date(Date.parse(parsed.retiredYear));
			}
			if(parsed.leaveYear) {
				parsed.leaveYear = new Date(Date.parse(parsed.leaveYear));
			}
			var checkboxes = ['facebook', 'retired', 'leave', 'psa', 'representative', 'executive'];
			for(var c = 0; c < checkboxes.length; c++) {
				var current = parsed[checkboxes[c]];
				parsed[checkboxes[c]] = current != 'FALSE' && current != '' && current != null;
			}
			if(parsed.id == '' || parsed.id == null || parsed.id.length != 8) {
				parsed.id = generateID();
				parsed.newID = true;
			}
			parsed.fullName = parsed.firstName + ' ' + parsed.lastName;
			if(parsed.conference2016) {
				parsed.lastConference = new Date(2016, 0, 1);
			}
			else if(parsed.conference2015) {
				parsed.lastConference = new Date(2015, 0, 1);
			}
			return parsed;
		}

		function getTeacher(id) {
			for(var i = 0; i < teachers.length; i++) {
				if(teachers[i].id == 'asdf') console.log(teachers[i].id);
				if(teachers[i].id == id) {
					return teachers[i];
				}
			}
			return null;
		}

		function getTeacherIndex(teacher) {
			var index = 0;
			for(var i = 0; i < teachers.length; i++) {
				if(teachers[i].id == teacher.id) {
					index = i;
				}
			}
			return index;
		}

		function updateRemoved(teacher) {
			return updateTeacher(teacher, true);
		}

		function updateTeacher(teacher, removed) {
			var index = getTeacherIndex(teacher);
			//index is 1-based here
			index += OFFSET+1;
			var deffered = $q.defer();
			if(!teacher) {
				deffered.reject('missing teacher argument');
				return;
			}

			var values = [];
			for(var i = 0; i < POSITIONS.length; i++) {
				values[i] = teacher[POSITIONS[i]];
			}

			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				if(!removed) {
					spreadsheets.values.update({
						spreadsheetId: spreadsheetId,
						range: SHEET + '!A'+index+':'+ALPHABET[POSITIONS.length-1]+index,
						values: [values],
						valueInputOption: 'RAW'
					}).then(function(response) {
						deffered.resolve(response);
					}, function(error) {
						deffered.reject(error);
					});
				}
				else {
					spreadsheets.values.append({
						spreadsheetId: spreadsheetId,
						range: SHEET_REMOVED+'!A1',
						values: [values],
						valueInputOption: 'RAW',
						insertDataOption: 'INSERT_ROWS'
					}).then(function(response) {
						console.log(response);
						deffered.resolve(response);
					}, function(error) {
						deffered.reject(error);
					});
				}
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
				getSheetId();
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

		function removeTeacherFromSheet(teacher) {
			if(hasSheetsApi) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				spreadsheets.batchUpdate({
					spreadsheetId: spreadsheetId,
					requests: [{
						deleteDimension: {
							range: {
								sheetId: sheetId,
								dimension: 'ROWS',
								startIndex: teacher.index + OFFSET,
								endIndex: teacher.index + OFFSET + 1
							}
						}
					}]
				}).then(function(d) {
					console.log(d);
				}, function(e) {
					console.log(e);
				});
			}
		}

		function removeTeacher(teacher) {
			var index = teachers.indexOf(teacher);
			if(index != -1) {
				teachers.splice(index, 1);
				$rootScope.$broadcast('updated-teachers');
				return updateRemoved(teacher).then(function(d) {
					removeTeacherFromSheet(teacher);
				}, function(e) {
					console.log(e);
				});
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
			signOut: signOut,
			getTeacher: getTeacher,
			getTeacherIndex: getTeacherIndex,
			removeTeacher: removeTeacher,
			updateTeachers: updateTeachers,
			findTeacherIndex: findTeacherIndex
		};
	})
	.controller('sheets', function($scope, $location, googleAuth) {
		this.teachers = googleAuth.getTeachers();
		this.showSelectButton = function() {
			return !googleAuth.hasSheetId() || !googleAuth.authorized();
		}
		this.selectTeacher = function(teacher) {
			$location.path('/details/'+teacher.id);
		}
		this.signOut = googleAuth.signOut;
		this.pickSheet = googleAuth.pickSheet;
	})
	.controller('details', function($scope, $routeParams, $location, googleAuth) {
		function createScope() {
			this.teachers = googleAuth.getTeachers();
			this.teacherId = $routeParams.teacherId;
			this.currentTeacher = googleAuth.getTeacher(this.teacherId);
			this.editingTeacher = {};
			this.searchCriteria = '';
		}
		createScope.call(this);

		var findId = false;

		var removeListener = null;
		function copyTeacher(fromTeacher, toTeacher) {
			for(var t in fromTeacher) {
				toTeacher[t] = fromTeacher[t];
			}
		}
		function compareTeachers(t1, t2) {
			for(var t in t1) {
				if(t1[t] != t2[t]) {
					return false;
				}
			}
			return true;
		}

		this.updateTeacher = function() {
			if(this.editingTeacher && this.currentTeacher && !compareTeachers(this.editingTeacher, this.currentTeacher)) {
				this.editingTeacher.lastUpdated = new Date();
				googleAuth.updateTeacher(this.editingTeacher).then(function(d) {
					copyTeacher(this.editingTeacher, this.currentTeacher);
					console.log(d);
					alert('updated successfully');
				}.bind(this), function(e) {
					console.log(e);
					alert('failed update: ' + e.body);
				});
			}
		}

		this.promptRemoveTeacher = function() {
			var confirmed = confirm('ARE YOU SURE?');
			if(confirmed) {
				googleAuth.removeTeacher(this.currentTeacher).then(function(d) {
					alert('Member Removed');
					$location.path('/').replace();
				},function(e) {
					alert('ERROR: see console');
					console.log(e);
				});
			}
			else {
				alert('Action Cancelled');
			}
		}

		this.changed = function() {
			return !compareTeachers(this.currentTeacher, this.editingTeacher);
		}

		this.nextRecord = function() {
			$location.path('/details/'+this.teachers[this.recordNumber+1].id);
		}
		this.previousRecord = function() {
			$location.path('/details/'+this.teachers[this.recordNumber-1].id);
		}

		function reset() {
			this.currentTeacher = googleAuth.getTeacher(this.teacherId);
			copyTeacher(this.currentTeacher, this.editingTeacher);

			this.recordNumberTotal = this.teachers.length;
			if(this.currentTeacher) {
				this.recordNumber = googleAuth.getTeacherIndex(this.currentTeacher);
				if(this.currentTeacher.newID) {
					googleAuth.updateTeacher(this.currentTeacher).then(function(d) {
						console.log(d);
						this.currentTeacher.newID = false;
						this.editingTeacher.newID = false;
					}.bind(this), function(e) {
						console.log(e);
					});
				}
			}
		}

		$scope.$on('updated-teachers', reset.bind(this));
		reset.call(this);
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
