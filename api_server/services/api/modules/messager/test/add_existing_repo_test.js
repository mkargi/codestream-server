'use strict';

var CodeStreamMessageTest = require('./codestream_message_test');
var BoundAsync = require(process.env.CS_API_TOP + '/lib/util/bound_async');

class AddExistingRepoTest extends CodeStreamMessageTest {

	get description () {
		return 'should be able to subscribe to and receive a message from the team channel when i introduce a repo to an existing team';
	}

	makeData (callback) {
		BoundAsync.series(this, [
			this.createOtherUser,
			this.createRepoWithoutMe,
			this.createSameRepo
		], callback);
	}

	// create another user who will create the repo with me added to the team
	createOtherUser (callback) {
		this.userFactory.createRandomUser(
			(error, response) => {
				if (error) { return callback(error); }
				this.otherUserData = response;
				callback();
			}
		);
	}

	// create a repo and a team without me as a member
	createRepoWithoutMe (callback) {
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				this.team = response.team;
				this.repo = response.repo;
				callback();
			},
			{
				withRandomEmails: 2,
				token: this.otherUserData.accessToken
			}
		);
	}
	// create a repo and a team with me as a member, since a team has already been created,
	// this just adds me to the existing team
	createSameRepo (callback) {
		let repoData = {
			url: this.repo.url,
			firstCommitSha: this.repo.firstCommitSha,
			teamId: this.team._id,
			emails: [this.currentUser.email]
		};
		this.repoFactory.createRepo(
			repoData,
			this.otherUserData.accessToken,
			callback
		);
	}

	setChannelName (callback) {
		this.channelName = 'team-' + this.team._id;
		callback();
	}
}

module.exports = AddExistingRepoTest;
