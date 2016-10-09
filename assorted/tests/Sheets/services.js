;(function(window) {
    angular.module('sheets')
    .factory('googleAuth', function($q, $rootScope) {
		var CLIENT_ID = '977588012097-tp6j1qv1ipm7s9c0582dprb157lp13p0.apps.googleusercontent.com';
		var API_KEY = 'AIzaSyCdKBQGd4QfCTFFqQ1Lh9FNDwO0mT1QY1c';
		var SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.readonly'].join(' ');
		var SHEET = 'Main database';
		var SHEET_REMOVED = 'Removed Teachers';
		var OFFSET = 1;
		var ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var MISSING = '[missing]';

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
							else {
								$rootScope.$broadcast('not-logged-in');
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

		function getSheetId() {
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				return spreadsheets.get({
					spreadsheetId: spreadsheetId
				}).then(function(d) {
					for(var i = 0; i < d.result.sheets.length; i++) {
						if(d.result.sheets[i].properties.title == SHEET) {
							sheetId = d.result.sheets[i].properties.sheetId;
						}
					}
				}, function(e) {
					console.log(e);
					return $q.reject(e);
				})
			}
			else {
				return $q.reject('missing sheets api and or spreadsheet id');
			}
		}

		function handleAuthClick() {
			if(hasAuthApi) {
				auth2.signIn().then(function(d) {
					handleAuthResult(auth2.currentUser.get().getAuthResponse());
				});
			}
			return deffered.promise;
		}

		function handleAuthResult(authResult) {
			if(authResult.access_token) {
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

        function gotPicker(data) {
            if(data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
                var doc = data[google.picker.Response.DOCUMENTS][0];
                spreadsheetId = doc[google.picker.Document.ID];
                localStorage.setItem('sheetid', spreadsheetId);
                getSheetId();
                updateTeachers();
            }
        }

		function updateTeachers() {
			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: SHEET + '!A'+(OFFSET+1)+':'+ALPHABET[POSITIONS.length-1]
				}).then(function(response) {
					teachers.length = 0;
					$rootScope.$applyAsync(function() {
						for(var t = 0; t < response.result.values.length; t++) {
							var teacher = response.result.values[t];
							var parsed = parseTeacher(teacher, t);
                            //have to leave empty
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
                var currentInfo = teacher[i];
				parsed[POSITIONS[i]] = currentInfo;
				if(currentInfo == null || currentInfo.trim() == '') {
					parsed[POSITIONS[i]] = MISSING;
				}
				if(parsed[POSITIONS[i]] != MISSING) {
					found = true;
				}
			}
			if(!found) {
                //Need to ignore this to ensure indexes stay the same
				//return null;
			}

            function parseDate(date) {
                return new Date(Date.parse(date));
            }

			parsed.index = index;
			if(parsed.lastUpdated) {
				parsed.lastUpdated = parseDate(parsed.lastUpdated);
			}
			if(parsed.retiredYear) {
				parsed.retiredYear = parseDate(parsed.retiredYear);
			}
			if(parsed.leaveYear) {
				parsed.leaveYear = parseDate(parsed.leaveYear);
			}

            function parseCheckboxes(checkboxes, teacher) {
                for(var c = 0; c < checkboxes.length; c++) {
                    var current = teacher[checkboxes[c]];
                    teacher[checkboxes[c]] = current != 'FALSE' && current != '' && current != null && current != MISSING;
                }
            }

			var checkboxes = ['facebook', 'retired', 'leave', 'psa', 'representative', 'executive'];

            parseCheckboxes(checkboxes, parsed);

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
            var index = getTeacherIndex(id);
            if(index != -1) {
                return teachers[index];
            }
            return null;
		}

		function getTeacherIndex(id) {
			var index = 0;
			for(var i = 0; i < teachers.length; i++) {
				if(teachers[i].id == id) {
					index = i;
				}
			}
			return index;
		}

		function updateTeacher(teacher, sheet, append) {
			var index = getTeacherIndex(teacher.id);
			//index is 1-based here
			index += OFFSET+1;
			var deffered = $q.defer();
			if(!teacher) {
				deffered.reject('missing teacher argument');
				return;
			}

			var values = [];
			for(var i = 0; i < POSITIONS.length; i++) {
				if(teacher[POSITIONS[i]] != MISSING) {
					values[i] = teacher[POSITIONS[i]];
				}
			}

			if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				if(!append) {
					spreadsheets.values.update({
						spreadsheetId: spreadsheetId,
						range: sheet + '!A'+index+':'+ALPHABET[POSITIONS.length-1]+index,
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
						range: sheet+'!A1',
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

        function addTeacher() {
            var teacher = {};
            teacher.id = generateID();
            teachers.push(teacher);
            updateTeacher(teacher, SHEET, true);
            return teacher;
        }

        function removeTeacher(teacher) {
            var index = teachers.indexOf(teacher);
            if(index != -1) {
                teachers.splice(index, 1);
                $rootScope.$broadcast('updated-teachers');
                return updateTeacher(teacher, SHEET_REMOVED, true).then(function(d) {
                    removeTeacherFromSheet(teacher);
                }, function(e) {
                    console.log(e);
                });
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

		function signOut() {
			if(hasAuthApi) {
				auth2.signOut().then(function() {
					alert('out');
				});
			}
		}

		function copyTeacher(fromTeacher, toTeacher) {
			for(var t in fromTeacher) {
				if(fromTeacher[t] != MISSING) {
					toTeacher[t] = fromTeacher[t];
				}
			}
		}

		function compareTeachers(t1, t2) {
            if(t1 == null || t2 == null) {
                return false;
            }
			for(var t in t1) {
				if(t1[t] != t2[t] && t1[t] != MISSING) {
					return false;
				}
			}
			return true;
		}

        var listOrder = 'firstName';

        function orderBy(order) {
            listOrder = order;
            console.log(listOrder);
        }

        function getOrdered(array) {
            return $filter('orderBy')(array, listOrder);
        }

        function getOrder() {
            console.log('got order ' + listOrder);
            return listOrder;
        }

		return {
			init: initApi,
			handleAuthClick: handleAuthClick,
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
			removeTeacher: removeTeacher,
			updateTeachers: updateTeachers,
            copyTeacher: copyTeacher,
            compareTeachers: compareTeachers,
            addTeacher: addTeacher,
            orderBy: orderBy,
            getOrdered: getOrdered,
            getOrder: getOrder,
            SHEET: SHEET
		};
	})
}(window));
