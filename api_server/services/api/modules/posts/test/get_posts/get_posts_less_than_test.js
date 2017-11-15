'use strict';

var GetPostsTest = require('./get_posts_test');
var ObjectID = require('mongodb').ObjectID;

class GetPostsLessThanTest extends GetPostsTest {

	get description () {
		return 'should return the correct posts when requesting posts in a stream with IDs less than some value';
	}

	setPath (callback) {
		let pivot = this.myPosts[2]._id;
		this.myPosts = this.myPosts.filter(post => ObjectID(post._id) < ObjectID(pivot));
		this.path = `/posts/?teamId=${this.team._id}&streamId=${this.stream._id}&lt=${pivot}`;
		callback();
	}
}

module.exports = GetPostsLessThanTest;
