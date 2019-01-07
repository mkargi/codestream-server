// base class for many tests of the "POST /posts" requests

'use strict';

const Aggregation = require(process.env.CS_API_TOP + '/server_utils/aggregation');
const Assert = require('assert');
const CodeStreamAPITest = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');
const PostTestConstants = require('../post_test_constants');
const CommonInit = require('./common_init');

class PostPostTest extends Aggregation(CodeStreamAPITest, CommonInit) {

	constructor (options) {
		super(options);
		this.expectedVersion = 2;
	}

	get description () {
		return 'should return a valid post when creating a post in a channel stream (simplest case: me-group)';
	}

	get method () {
		return 'post';
	}

	get path () {
		return '/posts';
	}

	getExpectedFields () {
		return { post: PostTestConstants.EXPECTED_POST_FIELDS };
	}

	// before the test runs...
	before (callback) {
		this.init(callback);
	}

	/* eslint complexity: 0 */
	// validate the response to the test request
	validateResponse (data) {
		// verify we got back a post with the attributes we specified
		const post = data.post;
		const errors = [];
		const expectedSeqNum = this.expectedSeqNum || 1;
		const expectedOrigin = this.expectedOrigin || '';
		const result = (
			((post.id === post._id) || errors.push('id not set to _id')) && 	// DEPRECATE ME
			((post.text === this.data.text) || errors.push('text does not match')) &&
			((post.teamId === this.team.id) || errors.push('teamId does not match the team')) &&
			((post.streamId === this.data.streamId) || errors.push('streamId does not match')) &&
			((post.deactivated === false) || errors.push('deactivated not false')) &&
			((typeof post.createdAt === 'number') || errors.push('createdAt not number')) &&
			((post.modifiedAt >= post.createdAt) || errors.push('modifiedAt not greater than or equal to createdAt')) &&
			((post.creatorId === this.currentUser.user.id) || errors.push('creatorId not equal to current user id')) &&
			((post.seqNum === expectedSeqNum) || errors.push('seqNum not equal to expected seqNum')) &&
			((post.origin === expectedOrigin) || errors.push('origin not equal to expected origin')) &&
			((post.numReplies === 0) || errors.push('numReplies should be 0'))
		);
		Assert(result === true && errors.length === 0, 'response not valid: ' + errors.join(', '));

		// verify we also got a stream update
		if (!this.noStreamUpdate) {
			this.validateStreamUpdate(data);
		}

		// verify the post in the response has no attributes that should not go to clients
		this.validateSanitized(post, PostTestConstants.UNSANITIZED_ATTRIBUTES);
	}

	// verify we got the expected stream update in the response
	validateStreamUpdate (data) {
		if (!this.stream) { return; }
		const streamUpdate = data.streams.find(stream => stream.id === this.stream.id);
		const expectedStreamUpdate = {
			_id: this.stream.id,	// DEPRECATE ME
			id: this.stream.id,
			$set: {
				mostRecentPostId: data.post.id,
				sortId: data.post.id,
				mostRecentPostCreatedAt: data.post.createdAt,
				version: this.expectedVersion
			},
			$version: {
				before: this.expectedVersion - 1,
				after: this.expectedVersion
			}
		};
		if (this.expectMarker) {
			expectedStreamUpdate.$set.numMarkers = 1;
		}
		Assert(streamUpdate.$set.modifiedAt >= this.postCreatedAfter, 'modifiedAt not changed');
		expectedStreamUpdate.$set.modifiedAt = streamUpdate.$set.modifiedAt;
		Assert.deepEqual(streamUpdate, expectedStreamUpdate, 'stream update not correct');		
	}
}

module.exports = PostPostTest;
