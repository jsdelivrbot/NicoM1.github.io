;(function(window){
	angular.module('twitterApp.services', [])
	.factory('twitterService', function($q) {
		var authorizationResult = false;

		return {
			initialize: function() {
				OAuth.initialize('mxLo9ved_mDxC6zBec_sENonHsk', {
					cache: true
				});

				authorizationResult = OAuth.create('twitter');
			},
			isReady: function() {
				return (authorizationResult);
			},
			connectTwitter: function() {
				var deferred = $q.defer();
				OAuth.popup('twitter', {
					cache: true
				}, function(error, result) {
					if(!error) {
						authorizationResult = result;
						deferred.resolve();
					}
					else {
						deferred.reject(error);
					}
				})
				return deferred.promise;
			},
			uploadMedia: function(media) {
				var deferred = $q.defer();
				var url = 'https://upload.twitter.com/1.1/media/upload.json';

				var promise = authorizationResult.post(url, {
					data: {
						media_data: media
					}
				}).done(function(data) {
					deferred.resolve(data);
				}).fail(function(err) {
					deferred.reject(err);
				})
				return deferred.promise;
			},
			postTweet: function(tweet, media) {
				var deferred = $q.defer();
				var url = '/1.1/statuses/update.json';

				var promise = authorizationResult.post(url, {
					data: {
						status: tweet,
						media_ids: media
					}
				}).done(function(data) {
					deferred.resolve(data);
				}).fail(function(err) {
					deferred.reject(err);
				})
				return deferred.promise;
			}
		}
	})
})(window);
