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
		var SHEET = 'Main database!';
		var OFFSET = 2;

		var POSITIONS = [
			'district',
			'aceit',
			'facebook',
			'2015conf',
			'2016conf',
			'firstname',
			'lastname',
			'school',
			'email',
			'program',
			'2016/17contact',
			'contacted',
			'emailsecondary'
		];

		var POSITION_INDEX = {
			district: POSITIONS.indexOf('district'),
			ace_it: POSITIONS.indexOf('aceit'),
			facebook: POSITIONS.indexOf('facebook'),
			conference_2015: POSITIONS.indexOf('2015conf'),
			conference_2016: POSITIONS.indexOf('2016conf'),
			first_name: POSITIONS.indexOf('firstname'),
			last_name: POSITIONS.indexOf('lastname'),
			school: POSITIONS.indexOf('school'),
			email: POSITIONS.indexOf('email'),
			program: POSITIONS.indexOf('program'),
			contacted_2017: POSITIONS.indexOf('2016/17contact'),
			contacted: POSITIONS.indexOf('contacted'),
			email_secondary: POSITIONS.indexOf('emailsecondary'),
		};

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
					updateTeachers();
				}
			}
			else {
				deffered.reject(authResult.error);
			}
		}

		function findDuplicates(teacher) {
			var dupes = [];
			for(var t = 0; t < teachers.length; t++) {
				var foundTeacher = teachers[t];
				if(teacher !== foundTeacher && (teacher.firstName.trim() == foundTeacher.firstName.trim() && teacher.lastName.trim() == foundTeacher.lastName.trim() && teacher.email.trim() == foundTeacher.email.trim())) {
					dupes.push(foundTeacher);
				}
			}
			return dupes;
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

		function removeDuplicates(teacher) {
			if(hasSheetsApi) {
				var dupes = findDuplicates(teacher);
				if(dupes.length > 0) {
					var spreadsheets = gapi.client.sheets.spreadsheets;
					for(var d = 0; d < dupes.length; d++) {
						var dupe = dupes[d];
						console.log(dupe.index + 2);
						spreadsheets.batchUpdate({
							spreadsheetId: spreadsheetId,
							requests: [{
								deleteDimension: {
									range: {
										sheetId: 216514658,
										dimension: 'ROWS',
										startIndex: dupe.index + OFFSET,
										endIndex: dupe.index + OFFSET + 1
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
			}
		}

		function updateTeachers() {
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;

				spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: SHEET + 'A2:M'
				}).then(function(response) {
					teachers.length = 0;
					$rootScope.$applyAsync(function() {
						for(var t = 0; t < response.result.values.length; t++) {
							var teacher = response.result.values[t];
								teachers.push(parseTeacher(teacher, t));
							}
						console.log(teachers);
						$rootScope.$broadcast('updated-teachers');
					});
				}, function(error) {
					console.log(error);
				});
			}
		}

		function parseTeacher(teacher, index) {
			var parsed = {
				firstName: teacher[POSITION_INDEX.first_name] || '',
				lastName: teacher[POSITION_INDEX.last_name] || '',
				email: teacher[POSITION_INDEX.email] || '',
				emailSecondary: teacher[POSITION_INDEX.email_secondary] || '',
				district: teacher[POSITION_INDEX.district] || '',
				school: teacher[POSITION_INDEX.school] || '',
				facebook: teacher[POSITION_INDEX.facebook] || '',
				aceIt: teacher[POSITION_INDEX.ace_it] || '',
				conference2015: teacher[POSITION_INDEX.conference_2015] || '',
				conference2016: teacher[POSITION_INDEX.conference_2016] || '',
				courses: teacher[POSITION_INDEX.program] || '',
				contacted: teacher[POSITION_INDEX.contacted] || '',
				contacted2017: teacher[POSITION_INDEX.contacted_2017] || '',
				index: index
			}
			parsed.fullName = parsed.firstName + ' ' + parsed.lastName;
			return parsed;
		}

		function updateTeacher(index, teacher) {
			//index is 1-based here
			index += OFFSET+1;
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
			signOut: signOut,
			findDuplicates: findDuplicates,
			removeDuplicates: removeDuplicates,
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
			$location.path('/details/'+teacher.index);
		}
		this.signOut = googleAuth.signOut;
		this.pickSheet = googleAuth.pickSheet;
	})
	.controller('details', function($scope, $routeParams, $location, googleAuth) {
		function createScope() {
			this.teachers = googleAuth.getTeachers();
			this.teacherId = Number($routeParams.teacherId);
			this.currentTeacher = this.teachers[this.teacherId];
			this.editingTeacher = {};
			this.searchCriteria = '';

		}
		createScope.call(this);


		this.getDupes = googleAuth.findDuplicates;

		var findId = false;

		if(this.currentTeacher) {
			copyTeacher(this.currentTeacher, this.editingTeacher);
			this.hasDupes = this.getDupes(this.currentTeacher).length;
		}
		var removeListener = null;
		function copyTeacher(fromTeacher, toTeacher) {
			for(var t in fromTeacher) {
				toTeacher[t] = fromTeacher[t];
			}
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

		this.promptRemoveTeacher = function() {
			var confirmed = confirm('ARE YOU SURE?');
			if(confirmed) {
				alert('Member Removed');
			}
			else {
				alert('Action Cancelled');
			}
		}

		this.removeDupes = function(teacher) {
			googleAuth.removeDuplicates(teacher);
			findId = true;
			googleAuth.updateTeachers();
		}

		$scope.$on('updated-teachers', function() {
			if(findId) {
				findId = false;
				this.teacherId = googleAuth.findTeacherIndex(this.currentTeacher);
				$location.path('/details/'+this.teacherId).replace();
				this.removedDupes = true;
				this.hasDupes = false;
			}
			this.currentTeacher = this.teachers[this.teacherId];
			copyTeacher(this.currentTeacher, this.editingTeacher);
			if(!this.removedDupes) {
				this.hasDupes = this.getDupes(this.currentTeacher).length;
			}
			this.recordNumberTotal = this.teachers.length;
			this.recordNumber = this.teacherId;
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
