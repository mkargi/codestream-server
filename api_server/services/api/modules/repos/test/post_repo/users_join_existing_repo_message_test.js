'use strict';

var CodeStreamMessageTest = require(process.env.CS_API_TOP + '/services/api/modules/messager/test/codestream_message_test');
var BoundAsync = require(process.env.CS_API_TOP + '/lib/util/bound_async');

class UsersJoinExistingRepoMessageTest extends CodeStreamMessageTest {

	get description () {
		return 'users added to a team when a repo that already exists is introduced should receive a message that they have been added to the team';
	}

	makeData (callback) {
		BoundAsync.series(this, [
			this.createOtherUser,
			this.createRepo
		], callback);
	}

	createOtherUser (callback) {
		this.userFactory.createRandomUser(
			(error, response) => {
				if (error) { return callback(error); }
				this.otherUserData = response;
				callback();
			}
		);
	}

	createRepo (callback) {
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				this.repo = response.repo;
				this.team = response.team;
				callback();
			},
			{
				withRandomEmails: 1,
				token: this.otherUserData.accessToken
			}
		);
	}

	setChannelName (callback) {
		this.channelName = 'user-' + this.currentUser._id;
		callback();
	}


	generateMessage (callback) {
		let repoData = {
			teamId: this.team._id,
			url: this.repo.url,
			firstCommitSha: this.repo.firstCommitSha,
			emails: [this.currentUser.email]
		};
		this.repoFactory.createRepo(
			repoData,
			this.otherUserData.accessToken,
			error => {
				if (error) { return callback(error); }
				this.message = {
					users: [{
						_id: this.currentUser._id,
						$add: {
							teamIds: this.team._id
						}
					}]
				};
				callback();
			}
		);
	}
}

module.exports = UsersJoinExistingRepoMessageTest;
