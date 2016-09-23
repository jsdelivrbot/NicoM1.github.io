;(function(window) {
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    angular.module('app', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'login.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .when('/tasks', {
            templateUrl: 'main.html'
        })
    })
    .controller('LoginController', function($scope, $location) {
        var self = this;
        self.login = function() {
            $location.path('/tasks');
        }

		self.onSuccess = function(googleUser) {
			console.log(googleUser.toString());
		};

		self.renderButton = function() {
			gapi.signin2.render('googlelogin', {
				'scope': 'profile email',
				'width': 240,
				'height': 50,
				'longtitle': true,
				'theme': 'dark',
				'onsuccess': self.onSuccess,
				'onfailure': function() {
					alert('oh no');
				}
			});
		};

		self.renderButton();
    })
    .controller('TaskController', function($scope) {
        var self = this;
        self.tasks = [
            {name: 'test', checked: false},
            {name: 'fake', checked: false},
            {name: 'fake', checked: true}
        ];

        self.addTask = function(taskTitle) {
            self.tasks.push({
                name: taskTitle,
                checked: false
            });
            self.saveTasks();
        };

        self.removeTask = function(task) {
            self.tasks.splice(self.tasks.indexOf(task), 1);
            self.saveTasks();
        };

        self.saveTasks = function() {
            var tasksJSON = JSON.stringify(self.tasks);
            document.cookie = 'tasks='+tasksJSON+'; expires=Fri, 3 Aug, 2035, 20:47:11 UTC; path=/';
        }

        self.loadTasks = function() {
            var tasksJSON = getCookie('tasks');
            if(tasksJSON != undefined) {
                self.tasks = JSON.parse(tasksJSON);
            }
        }

        self.loadTasks();

        self.saveTasks();
    })
    .directive('tasklist', function() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'tasklist.html',
            controller: 'TaskController as tasks'
        };
    })
    .directive('task', function() {
        return {
            restrict: 'E',
            transclude: 'true',
            require: '^tasklist',
            templateUrl: 'task.html'
        };
    })
    /*.directive('googlelogin', function() {
        return {
            restrict: 'E',
            template: '<a class="g-signin2" data-onsuccess="console.log" data-theme="dark"></a>',
            link: function(scope, element) {
                var script = angular.element('<script/>');
                script.attr({
                    src: 'https://apis.google.com/js/platform.js?onload=login.renderButton',
                    type: 'text/javascript'
                });
                element.append(script);
            }
        };
    })*/
})(window);
