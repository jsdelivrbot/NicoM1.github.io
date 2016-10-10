;(function(window) {
    angular.module('sheets')
    .controller('sheets', function($scope, $location, googleAuth) {
		this.teachers = googleAuth.getTeachers();
		this.showSelectButton = function() {
			return !googleAuth.hasSheetId() || !googleAuth.authorized();
		}
		this.selectTeacher = function(teacher, index) {
			if(this.search && this.search.trim().length > 0) {
				$location.path('/details/search/'+this.search+'/'+index);
			}
			else {
				$location.path('/details/'+teacher.id);
			}
		}
        this.addTeacher = function() {
            var teacher = googleAuth.addTeacher();
            this.selectTeacher(teacher);
        }
        this.generateIds = function() {
            var ids = ''
            for(var i = 0; i < 50; i++) {
                ids += (googleAuth.generateID()) + '\n';
            }
            return ids;
        }

        this.getOrder = googleAuth.getOrder;
        this.orderBy = googleAuth.orderBy;

		this.signOut = googleAuth.signOut;
		this.pickSheet = googleAuth.pickSheet;
	})
	.controller('details', function($scope, $filter, $routeParams, $route, $location, googleAuth) {
		(function createScope() {
			console.log('refresh');
			this.teacherId = $routeParams.teacherId;
			this.editingTeacher = {};
			this.data = {};
			this.data.searchCriteria = $routeParams.searchCriteria;
			if(!this.data.searchCriteria) {
				this.currentTeacher = googleAuth.getTeacher(this.teacherId);
			}
			else {
				this.startCriteria = this.data.searchCriteria;
			}
		}).call(this);

		this.updateTeacher = function() {
			if(!googleAuth.compareTeachers(this.editingTeacher, this.currentTeacher)) {
				this.editingTeacher.lastUpdated = new Date();
				googleAuth.updateTeacher(this.editingTeacher, googleAuth.SHEET).then(function(d) {
					for(var key in this.currentTeacher) {
						this.currentTeacher[key] = null;
					}
					googleAuth.copyTeacher(this.editingTeacher, this.currentTeacher);
					console.log(d);
					alert('updated successfully');
				}.bind(this), function(e) {
					console.log(e);
					alert('failed update: ' + e);
				});
			}
		}

		this.promptRemoveTeacher = function() {
			var confirmed = confirm('ARE YOU SURE?');
			if(confirmed) {
				googleAuth.removeTeacher(this.currentTeacher).then(function(d) {
					alert('Member Removed');
					this.returnToMain();
				}.bind(this),function(e) {
					alert('ERROR: see console');
					console.log(e);
				});
			}
			else {
				alert('Action Cancelled');
			}
		}

		$scope.$watch(function() {return this.data.searchCriteria}.bind(this), function() {
			if(this.data.searchCriteria != this.startCriteria) {
				var confirmed = !this.changed() || confirm('LEAVE WITHOUT UPDATING?');
				if(confirmed) {
					this.teacherId = 0;
					this.startCriteria = this.data.searchCriteria;
					reset.call(this);
				}
			}
		}.bind(this));

		this.changed = function() {
			console.log(this.currentTeacher, this.editingTeacher, !googleAuth.compareTeachers(this.editingTeacher, this.currentTeacher))
			return this.currentTeacher != null && !googleAuth.compareTeachers(this.editingTeacher, this.currentTeacher);
		}

		this.updateSearchPath = function() {
			var confirmed = !this.changed() || confirm('LEAVE WITHOUT UPDATING?');
			if(confirmed) {
				if(this.data.searchCriteria) {
					this.teacherId = 0;
					$location.path('/details/search/'+this.data.searchCriteria+'/0');
					reset.call(this);
				}
			}
		}
		this.returnToMain = function(replace) {
			var confirmed = !this.changed() || confirm('RETURN WITHOUT UPDATING?');
			if(confirmed) {
				var path = $location.path('/');
	            if(replace) {
	                path.replace();
	            }
			}
		}
		this.nextRecord = function() {
			var confirmed = !this.changed() || confirm('LEAVE WITHOUT UPDATING?');
			if(confirmed) {
				if(this.data.searchCriteria) {
					$location.path('/details/search/'+this.data.searchCriteria+'/'+Number(this.recordNumber+1));
				}
				else {
					$location.path('/details/'+this.teachers[this.recordNumber+1].id);
				}
			}
		}
		this.previousRecord = function(replace) {
			var confirmed = !this.changed() || confirm('LEAVE WITHOUT UPDATING?');
			if(confirmed) {
	            var path = null;
				if(this.data.searchCriteria) {
					path = $location.path('/details/search/'+this.data.searchCriteria+'/'+Number(this.recordNumber-1));
				}
				else {
					path = $location.path('/details/'+this.teachers[this.recordNumber-1].id);
				}
	            if(replace && path) {
	                path.replace();
	            }
			}
		}

		this.switchTo = function() {
			var confirmed = !this.changed() || confirm('LEAVE WITHOUT UPDATING?');
			if(confirmed) {
				$location.path('/details/'+this.currentTeacher.id);
			}
		}

		function reset() {
			console.log('reset');
			this.teachers = googleAuth.getTeachers();
			this.foundSearch = true;
			if(this.teachers.length > 0) {
				if(this.data.searchCriteria) {
					this.teachers = googleAuth.getOrdered($filter('teachersearch')(this.teachers, this.data.searchCriteria));
	                if(this.teachers.length == 0) {
						this.teacherId = -1;
						this.foundSearch = false;
	                }
	                else if(this.teacherId >= this.teachers.length) {
	                    this.teacherId = this.teachers.length - 1;
	                }
					this.currentTeacher = this.teacherId != -1 ? this.teachers[this.teacherId] : null;
				}
				else {
					this.currentTeacher = googleAuth.getTeacher(this.teacherId);
	                if(this.currentTeacher == null) {
						console.log('null');
						if(googleAuth.getTeachers().length > 0) {
							console.log(googleAuth.getTeachers()[0].id);
							$location.path('/details/'+googleAuth.getTeachers()[0].id);
							$route.reload();
						}
						else {
							this.returnToMain();
						}
	                    return;
	                }
				}

				this.editingTeacher = {};
				googleAuth.copyTeacher(this.currentTeacher, this.editingTeacher);

				this.recordNumberTotal = this.teachers.length;
				if(this.currentTeacher) {
					this.recordNumber = this.teachers.indexOf(this.currentTeacher);
				}
			}
		}

        reset.call(this);

		$scope.$on('updated-teachers', reset.bind(this));

		$scope.$on('not-logged-in', function() {
			alert('not logged in');
			$scope.$apply(function() {
				this.returnToMain();
			})
		});
	})
}(window));
