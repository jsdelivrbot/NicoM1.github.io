;(function(window) {
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
    angular.module('app', ['ngRoute', 'ngAnimate'])
    .config(function($routeProvider, $sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
  			'self',
  			'https://www.youtube.com/**'
		]);
        $routeProvider.when('/', {
            templateUrl: 'main.html'
        })
    })
	.factory('googleAuth', function($q) {
		var user, deffered;
		deffered = $q.defer();
		function onSuccess(googleUser) {
			user = googleUser;
			deffered.resolve();
		}
		return {
			renderButton: function(element) {
				gapi.signin2.render(element, {
					'scope': 'profile email',
					'width': 240,
					'height': 50,
					'longtitle': true,
					'theme': 'dark',
					'onsuccess': onSuccess,
					'onfailure': function(x) {
						deffered.reject(x);
					}
				});
				return deffered.promise;
			},
			isSignedIn: function() {
				return user != undefined;
			},
			getUser: function() {
				return user.getBasicProfile().getName();
			}
		};
	})
	.factory('myJson', function($q, $http) {
		return {
			storeData: function(data) {
				var deffered = $q.defer();
				$http.post('https://api.myjson.com/bins', data).then(function(data) {
					deffered.resolve(data);
				}, function(error) {
					deffered.reject(error);
				});
				return deffered.promise;
			},
			retrieveData: function(id) {
				var deffered = $q.defer();
				$http.get('https://api.myjson.com/bins/'+id).then(function(data) {
					deffered.resolve(data);
				}, function(error) {
					deffered.reject(error);
				});
				return deffered.promise;
			},
			updateData: function(id, data) {
				var deffered = $q.defer();
				$http.put('https://api.myjson.com/bins/'+id, data).then(function(data) {
					deffered.resolve(data);
				}, function(error) {
					deffered.reject(error);
				});
				return deffered.promise;
			}
		}
	})
	.factory('youtube', function($q, $document) {
		var apiKey = 'AIzaSyDOzRyuyA3bAyFZYECJecgBO8UtG14iI2Y';
		var deffered = $q.defer();
		var available = false;
		window._initGAPI = function() {
			gapi.client.setApiKey(apiKey);
			gapi.client.load('youtube', 'v3').then(function(d) {
				available = true;
				deffered.resolve(gapi.client.youtube);
			}, function() {
				deffered.reject(e)
			});
		}

		return {
			init: function() {
				var script = $document[0].createElement('script');
				script.src = 'https://apis.google.com/js/client.js?onload=_initGAPI';
				$document[0].body.appendChild(script);
				return deffered.promise;
			},
			createPlayer: function(element) {
				var tag = $document[0].createElement('script');
				tag.src = 'https://www.youtube.com/iframe_api';
				$document[0].body.appendChild(tag);
				var deffered = $q.defer();

				console.log(tag);

				window.onYouTubeIframeAPIReady = function() {
					player = new YT.Player(element, {
						height: '390',
						width: '640',
						videoId: '9K7RokHjYd4',
						events: {
							'onReady': function() {
								deffered.resolve(player);
							}
						}
					});
				};
				return deffered.promise;
			},
			isAvailable: function() {
				return available;
			},
			search: function(query, pageToken) {
				var deffered = $q.defer();
				var result = {promise: deffered.promise, canceled: false};
				var request = gapi.client.youtube.search.list({
					q: query,
					part: 'snippet',
					pageToken: pageToken,
					type: 'video'
				});

				request.then(function(d) {
					if(!result.canceled) {
						deffered.resolve(d.result);
					}
					else {
						deffered.reject('CANCELLED');
					}
				}, function(e) {
					deffered.reject(e);
				});
				return result;
			},
			getVideoUrl: function(id) {
				return 'https://www.youtube.com/embed/'+id;
			}
		}
	})
	.directive('videodisplay', function() {
		return {
			templateUrl: 'videodisplay.html',
			scope: {
				videoId: '@'
			},
			controller: function($scope, youtube) {
				var self = this;
				self.getVideoUrl = function(id) {
					return youtube.getVideoUrl(id);
				};

				$scope.$on('videoselected', function(e, id) {
					console.log(id);
					self.videoId = id;
					if(self.player != null) {
						//self.player.loadVideoById(id);
						self.player.loadPlaylist(id);
					}
				});

				self.createPlayer = youtube.createPlayer;
			},
			link: function(scope, element, attrs, ctrl) {
				ctrl.createPlayer('videodisplay').then(function(p) {
					ctrl.player = p;
				});
			},
			controllerAs: 'videodisplay',
    		bindToController: true
		}
	})
	.directive('videosearch', function() {
		return {
			templateUrl: 'videosearch.html',
			controller: function($rootScope, $scope, $location, $document, googleAuth, youtube) {
		        var self = this;

				self.videos = [];
				self.nextPage = null;

				self.search = 'okkervil river black';

				self.playlist = [];

				var searching = false;

				var lastVideo = null;

				window.onscroll = function(ev) {
    				if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
						if(self.nextPage!= null) {
        					self.searchVideos(self.search, self.nextPage);
						}
    				}
				};

				self.getVideoUrl = function(id) {
					return youtube.getVideoUrl(id);
				};

				self.searchVideos = function(query, nextPageToken) {
					if(searching && nextPageToken != null) return;
					searching = true;
					if(lastVideo != null) {
						lastVideo.canceled = true;
					}

					lastVideo = youtube.search(query, nextPageToken);
					lastVideo.promise.then(function(d) {
						console.log(d);
						if(nextPageToken == null) {
							self.videos = d.items;
						}
						else {
							self.videos = self.videos.concat(d.items);
						}
						self.nextPage = d.nextPageToken;
					}, function(e) {
						console.log(e);
					}).finally(function() {
						searching = false;
					});
				};

				self.selectVideo = function(id) {
					self.playlist = [id].concat(self.playlist);
					$rootScope.$broadcast('videoselected', self.playlist);
				};

				youtube.init().then(function() {
					$scope.$watch(function() {return self.search}, function() {
						self.searchVideos(self.search);
					});

				}, function(e) {
					console.log(e);
				});
		    },
			controllerAs: 'videosearch'
		}
	})
})(window);
