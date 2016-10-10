;(function(window) {
	'use strict';
    angular.module('sheets')
    .factory('googleAuth', function($q, $rootScope, $filter) {
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
			'firstName',
			'lastName',
			'school',
			'email',
			'courses',
			'emailSecondary',
			'aceIt',
			'facebook',
			'facebookAlias',
			'conferences',
			'comments',
			'psa',
			'psaExpires',
			'representative',
			'exectutive',
			'retired',
			'retiredYear',
			'leave',
			'leaveYear',
			'academics',
			'maker',
			'startedTeaching',
			'lastUpdated',
			'id'
		];

		var checkboxes = ['academics', 'aceIt', 'facebook', 'retired', 'leave', 'psa', 'representative', 'executive', 'maker'];

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
				return loadSheetsApi();
			}).then(function() {
				var deffered1 = $q.defer();
				//TRIED TO CLEAN THIS UP BUT SOMETHING IS FUCKED, DOING ANY RETURN OR RESOLVE OF PROMISE CAUSES HARD LOCK
				gapi.auth2.init({
					client_id: CLIENT_ID,
					scope: SCOPES,
					immediate: true
				}).then(function(auth) {
					auth2 = auth;
					hasAuthApi = true;
					if(auth2.isSignedIn.get()) {
						handleAuthResult(auth2.currentUser.get().getAuthResponse());
					}
					else {
						$rootScope.$broadcast('not-logged-in');
					}
				}, function(e) {
					console.log(e);
				});
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
			var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
			return gapi.client.load(discoveryUrl).then(function(d) {
				hasSheetsApi = true;
			});
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
			return $q.reject('missing sheets api and or spreadsheet id');
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
					var deffered = $q.defer();
					$rootScope.$applyAsync(function() {
						if(response.result.values) {
							for(var t = 0; t < response.result.values.length; t++) {
								var teacher = response.result.values[t];
								var parsed = parseTeacher(teacher);
								//have to leave empty
								if(parsed) {
									teachers.push(parsed);
								}
							}
							$rootScope.$broadcast('updated-teachers');
							deffered.resolve();
						}
						else {
							deffered.reject('no teachers found');
						}
					});
					return deffered.promise;
				}).then(null, function(error) {
					console.log(error);
					return $q.reject(error);
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

		function parseTeacher(teacher) {
			var parsed = {};

			for(var i = 0; i < POSITIONS.length; i++) {
                var currentInfo = teacher[i];
				parsed[POSITIONS[i]] = currentInfo;
				if(currentInfo == null || currentInfo.trim() == '') {
					parsed[POSITIONS[i]] = MISSING;
				}
			}

            function parseDate(date) {
                return new Date(Date.parse(date));
            }

			if(parsed.lastUpdated != MISSING) {
				parsed.lastUpdated = parseDate(parsed.lastUpdated);
			}
			if(parsed.retiredYear != MISSING) {
				parsed.retiredYear = parseDate(parsed.retiredYear);
			}
			if(parsed.leaveYear != MISSING) {
				parsed.leaveYear = parseDate(parsed.leaveYear);
			}
			if(parsed.startedTeaching != MISSING) {
				parsed.startedTeaching = parseDate(parsed.startedTeaching);
			}
			if(parsed.psaExpires != MISSING) {
				parsed.psaExpires = parseDate(parsed.psaExpires);
			}

            function parseCheckboxes(checkboxes, teacher) {
                for(var c = 0; c < checkboxes.length; c++) {
                    var current = teacher[checkboxes[c]];
                    teacher[checkboxes[c]] = current != 'FALSE' && current != '' && current != null && current != MISSING;
                }
            }

            parseCheckboxes(checkboxes, parsed);

			if(parsed.id == '' || parsed.id == null || parsed.id.length != 8) {
                return null;
			}

			parsed.fullName = parsed.firstName + ' ' + parsed.lastName;

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
			var index = -1;
			for(var i = 0; i < teachers.length; i++) {
				if(teachers[i].id == id) {
					index = i;
				}
			}
			return index;
		}

        function getRealIndex(id) {
            var deffered = $q.defer();
            if(hasSheetsApi && spreadsheetId) {
				var spreadsheets = gapi.client.sheets.spreadsheets;
				spreadsheets.values.get({
					spreadsheetId: spreadsheetId,
					range: SHEET + '!'+ALPHABET[POSITIONS.indexOf('id')]+(OFFSET+1)+':'+ALPHABET[POSITIONS.indexOf('id')],
                    majorDimension: 'COLUMNS'
				}).then(function(response) {
					$rootScope.$apply(function() {
						if(response.result.values) {
							var ids = response.result.values[0];
							for(var i = 0; i < ids.length; i++) {
								if(ids[i].trim() == id.trim()) {
									return deffered.resolve(i);
								}
							}
						}
						return deffered.reject('could not find index');
					});
				}, function(error) {
					$rootScope.$apply(function() {
						console.log(error);
                    	return deffered.reject(error);
					});
				});
			}
            else {
                deffered.reject('missing api or sheetid');
            }
            return deffered.promise;
        }

		function updateTeacher(teacher, sheet, append) {
            var deffered = $q.defer();
            if(hasSheetsApi && spreadsheetId) {
                var spreadsheets = gapi.client.sheets.spreadsheets;
                if(!teacher) {
                    return deffered.reject('missing teacher argument');
                }

                var values = [];
                for(var i = 0; i < POSITIONS.length; i++) {
                    if(teacher[POSITIONS[i]] != MISSING) {
                        values[i] = teacher[POSITIONS[i]];
                    }
                }
                if(!append) {
                    getRealIndex(teacher.id).then(function(index) {
                        //index is 1-based here
            			index += OFFSET+1;

        				if(!append) {
        					spreadsheets.values.update({
        						spreadsheetId: spreadsheetId,
        						range: sheet + '!A'+index+':'+ALPHABET[POSITIONS.length-1]+index,
        						values: [values],
        						valueInputOption: 'RAW'
        					}).then(function(response) {
								$rootScope.$apply(function() {
									deffered.resolve(response);
								});
        					}, function(error) {
								$rootScope.$apply(function() {
									deffered.reject(error);
								});
        					});
        				}
                    }, function(e) {
						console.log(e);
                        deffered.reject(e);
                    });
                }
                else {
                    spreadsheets.values.append({
                        spreadsheetId: spreadsheetId,
                        range: "'"+sheet+"'"+'!A2',
                        values: [values],
                        valueInputOption: 'RAW',
                        insertDataOption: 'INSERT_ROWS'
                    }).then(function(response) {
						$rootScope.$apply(function() {
							deffered.resolve(response);
						});
                    }, function(error) {
						$rootScope.$apply(function() {
							deffered.reject(error);
						});
                    });
                }
            }
            else {
                deffered.reject('missing sheets api or spreadsheetid');
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
            return updateTeacher(teacher, SHEET_REMOVED, true).then(function(d) {
                return removeTeacherFromSheet(teacher);
            }, function(e) {
                console.log(e);
				return $q.reject(e);
            }).then(function(d) {
				var index = teachers.indexOf(teacher);
				if(index != -1) {
					teachers.splice(index, 1);
				}
			});
        }

		function removeTeacherFromSheet(teacher) {
			return getRealIndex(teacher.id).then(function(index) {
                var spreadsheets = gapi.client.sheets.spreadsheets;
				return spreadsheets.batchUpdate({
					spreadsheetId: spreadsheetId,
					requests: [{
						deleteDimension: {
							range: {
								sheetId: sheetId,
								dimension: 'ROWS',
								startIndex: index + OFFSET,
								endIndex: index + OFFSET + 1
							}
						}
					}]
				});
            }).then(function(d) {
				console.log(d);
			}, function(e) {
				console.log(e);
				return $q.reject(e);
			});
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
        }

        function getOrdered(array) {
            return $filter('orderBy')(array, listOrder);
        }

        function getOrder() {
            return listOrder;
        }

		function makeCSV(teachers) {
			var csv = '';
			for(var x = 0; x < POSITIONS.length; x++) {
				csv += POSITIONS[x];
				if(x < POSITIONS.length - 1) {
					csv += ',';
				}
			}
			csv += '\n';
			for(var i = 0; i < teachers.length; i++) {
				var teacher = teachers[i];
				for(var ii = 0; ii < POSITIONS.length; ii++) {
					var value = teacher[POSITIONS[ii]];
					if(value != MISSING && value != null) {
						csv += '"' + String(value) + '"';
					}
					if(ii < POSITIONS.length - 1) {
						csv += ',';
					}
				}
				csv += '\n';
			}
			console.log(csv);
			return csv;
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
            getRealIndex: getRealIndex,
            generateID: generateID,
			makeCSV: makeCSV,
            SHEET: SHEET
		};
	})
	.filter('teachersearch', function() {
		var keywords = {
			bctea: 'exectutive',
			lsa: 'representative',
			aceit: 'aceIt',
			facebookalias: 'facebookAlias',
			retiredyear: 'retiredYear',
			leaveyear: 'leaveYear',
			makerspace: 'maker',
			startedteaching: 'startedTeaching',
			lastupdated: 'lastUpdated',
			left: 'leave',
			firstname: 'firstName',
			lastname: 'lastName',
			emailsecondary: 'emailSecondary',
			psaexpires: 'psaExpires'
		};
		return function(teachers, search) {var out = [];
			if(search == null || search.trim().length == 0) {
				return teachers;
			}
			for(var t = 0; t < teachers.length; t++) {
				var teacher = teachers[t];
				for(var key in teacher) {
					if(search.indexOf(':') != -1) {
						var parts = search.split(':');
						if(keywords[parts[0]]) {
							parts[0] = keywords[parts[0]];
						}
						var value = teacher[parts[0].trim()].toLowerCase();
						var searchPiece = parts[1].trim().toLowerCase();
						if(value != null && searchPiece.length > 0) {
							if(typeof value == 'string' && value.includes(searchPiece)) {
								out.push(teacher);
								break;
							}
							else if(typeof value == 'boolean' && value==(searchPiece==='true')) {
								out.push(teacher);
								break;
							}
							else if (Object.prototype.toString.call(value) === '[object Date]') {
								if(value.toString().toLowerCase().includes(searchPiece)) {
									out.push(teacher);
									break;
								}
							}
						}
					}
					else {
						if(keywords[search]) {
							search = keywords[search];
						}
						if(key.toLowerCase().includes(search.toLowerCase()) && key.trim().length == search.trim().length) {
							if(teacher[key]) {
								out.push(teacher);
								break;
							}
						}
						else if(key != 'id' && teacher[key] != null) {
							var value = teacher[key];
							if(typeof value == 'string' && value.toLowerCase().includes(search.toLowerCase())) {
								out.push(teacher);
								break;
							}
							else if (Object.prototype.toString.call(value) === '[object Date]') {
								if(value.toString().toLowerCase().includes(search.toLowerCase())) {
									out.push(teacher);
									break;
								}
							}
						}
					}
				}
			}
			return out;
		}
	})
}(window));
