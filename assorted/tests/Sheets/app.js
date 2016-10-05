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
			'id'
		];

		/*var POSITION_INDEX = {};

		for (var i = 0; i < POSITIONS.length; i++) {
			POSITION_INDEX[POSITIONS[i]] = i;
		}*/

		/*var POSITION_INDEX = {
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
		};*/

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

		/*function findDuplicates(teacher) {
			var dupes = [];
			for(var t = 0; t < teachers.length; t++) {
				var foundTeacher = teachers[t];
				if(teacher !== foundTeacher && (teacher.firstName.trim() == foundTeacher.firstName.trim() && teacher.lastName.trim() == foundTeacher.lastName.trim() && teacher.email.trim() == foundTeacher.email.trim())) {
					dupes.push(foundTeacher);
				}
			}
			return dupes;
		}*/

		function findTeacherIndex(teacher) {
			for(var t = 0; t < teachers.length; t++) {
				var foundTeacher = teachers[t];
				if(teacher.firstName == foundTeacher.firstName && teacher.lastName == foundTeacher.lastName) {
					return foundTeacher.index;
				}
			}
			return 0;
		}

		/*function removeDuplicates(teacher) {
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
		}*/

		function updateTeachers() {
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				//console.log(ALPHABET[POSITIONS.length-1]);
				spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: SHEET + 'A2:'+ALPHABET[POSITIONS.length-1]
				}).then(function(response) {
					teachers.length = 0;
					$rootScope.$applyAsync(function() {
						for(var t = 0; t < response.result.values.length; t++) {
							var teacher = response.result.values[t];
							teachers.push(parseTeacher(teacher, t));
						}
						//console.log(teachers);
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

		/*var batched = [];

		function addToBatched(teacher) {
			batched.push(teacher);
		}

		function pushBatched() {
			if(hasSheetsApi) {
				if(batched.length > 0) {
					var spreadsheets = gapi.client.sheets.spreadsheets;
					for(var d = 0; d < batched.length; d++) {
						var item = batched[d];
						var requests = [];
						//TODO
						for(var i = 0; i < 5; i++) {
							var current = batched[i];
							var rows = [];
							for(var x = 0; x < POSITIONS.length; x++) {
								rows[x] = current[POSITIONS[x]];
							}
							var index = getTeacherIndex(current);
							requests.push({
								range: SHEET + 'A'+index+':'+ALPHABET[POSITIONS.length-1]+index,
								majorDimension: 'ROWS',
								values: rows
							});
						}
						spreadsheets.values.batchUpdate({
							spreadsheetId: spreadsheetId,
							valueInputOption: 'RAW',
							data: requests
						}).then(function(d) {
							console.log(d);
						}, function(e) {
							console.log(e);
						});
					}
				}
				batched = [];
			}
		}*/

		function parseTeacher(teacher, index) {
			var parsed = {};

			for(var i = 0; i < POSITIONS.length; i++) {
				//if(i == POSITIONS.length-1) console.log(teacher[i]);
				parsed[POSITIONS[i]] = teacher[i];
			}
			parsed.index = index;
			parsed.facebook = parsed.facebook != 'FALSE' && parsed.facebook != '';
			if(parsed.id == '' || parsed.id == null || parsed.id.length != 8) {
				parsed.id = generateID();
				parsed.newID = true;
				//addToBatched(parsed);
				//console.log(parsed);
				/*updateTeacher(parsed).then(function(d) {
					console.log(d);
				}, function(e) {console.log(e)});*/
			}
			/*else {
				console.log('no');
			}*/
			/*var parsed = {
				firstName: teacher[POSITION_INDEX.first_name] || '',
				lastName: teacher[POSITION_INDEX.last_name] || '',
				email: teacher[POSITION_INDEX.email] || '',
				emailSecondary: teacher[POSITION_INDEX.email_secondary] || '',
				district: teacher[POSITION_INDEX.district] || '',
				school: teacher[POSITION_INDEX.school] || '',
				facebook: teacher[POSITION_INDEX.facebook] != 'FALSE' && teacher[POSITION_INDEX.facebook] != '',
				aceIt: teacher[POSITION_INDEX.ace_it] || '',
				conference2015: teacher[POSITION_INDEX.conference_2015] || '',
				conference2016: teacher[POSITION_INDEX.conference_2016] || '',
				courses: teacher[POSITION_INDEX.program] || '',
				contacted: teacher[POSITION_INDEX.contacted] || '',
				contacted2017: teacher[POSITION_INDEX.contacted_2017] || '',
				index: index
			};*/
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

		function updateTeacher(teacher) {
			var index = getTeacherIndex(teacher);
			//index is 1-based here
			index += OFFSET+1;
			var deffered = $q.defer();
			if(!teacher) {
				deffered.reject('missing teacher argument');
				return;
			}

			var values = [];
			for(var i =0; i < POSITIONS.length; i++) {
				values[i] = teacher[POSITIONS[i]];
			}
			/*values[POSITION_INDEX.first_name] = teacher.firstName;
			values[POSITION_INDEX.last_name] = teacher.lastName;
			values[POSITION_INDEX.email] = teacher.email;
			values[POSITION_INDEX.email_secondary] = teacher.emailSecondary;
			values[POSITION_INDEX.district] = teacher.district;
			values[POSITION_INDEX.school] = teacher.school;
			values[POSITION_INDEX.facebook] = teacher.facebook;
			values[POSITION_INDEX.ace_it] = teacher.aceIt;
			values[POSITION_INDEX.conference_2015] = teacher.conference2015;
			values[POSITION_INDEX.program] = teacher.courses;
			values[POSITION_INDEX.contacted] = teacher.contacted;
			values[POSITION_INDEX.contacted_2017] = teacher.contacted2017;*/
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				spreadsheets.values.update({
					spreadsheetId: spreadsheetId,
					range: SHEET + 'A'+index+':'+ALPHABET[POSITIONS.length-1]+index,
					values: [values],
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
			getTeacher: getTeacher,
			getTeacherIndex: getTeacherIndex,
			//findDuplicates: findDuplicates,
			//removeDuplicates: removeDuplicates,
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


		//this.getDupes = googleAuth.findDuplicates;

		var findId = false;

		/*if(this.currentTeacher) {
			copyTeacher(this.currentTeacher, this.editingTeacher);
			this.hasDupes = this.getDupes(this.currentTeacher).length;
		}*/
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
				alert('Member Removed');
			}
			else {
				alert('Action Cancelled');
			}
		}

		this.changed = function() {
			return !compareTeachers(this.currentTeacher, this.editingTeacher);
		}

		/*this.removeDupes = function(teacher) {
			googleAuth.removeDuplicates(teacher);
			findId = true;
			googleAuth.updateTeachers();
		}*/

		this.nextRecord = function() {
			$location.path('/details/'+this.teachers[Number(this.recordNumber+1)].id);
		}
		this.previousRecord = function() {
			$location.path('/details/'+this.teachers[Number(this.recordNumber-1)].id);
		}

		function reset() {
			/*if(findId) {
				findId = false;
				this.teacherId = googleAuth.findTeacherIndex(this.currentTeacher);
				$location.path('/details/'+this.teacherId).replace();
				this.removedDupes = true;
				this.hasDupes = false;
			}*/
			this.currentTeacher = googleAuth.getTeacher(this.teacherId);
			//console.log(this.currentTeacher, this.teacherId);
			copyTeacher(this.currentTeacher, this.editingTeacher);
			/*if(!this.removedDupes) {
				this.hasDupes = this.getDupes(this.currentTeacher).length;
			}*/
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
