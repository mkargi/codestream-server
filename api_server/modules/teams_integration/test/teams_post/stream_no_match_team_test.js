'use strict';

var TeamsPostTest = require('./teams_post_test');
var BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');

class StreamNoMatchTeamTest extends TeamsPostTest {

	constructor (options) {
		super(options);
		this.type = 'channel';
	}

	get description () {
		return 'should return an error when trying to send a teams post request with a stream ID and a team ID that are not related';
	}

	getExpectedError () {
		return {
			code: 'INTG-1006',
		};
	}

	// before the test runs...
	before (callback) {
		BoundAsync.series(this, [
			this.createOtherRepo,	// create another repo (and team)
			super.before			// normal test setup
		], callback);
	}

	// create a second repo (and team) ... we'll use this team and repo's ID ... this is not allowed!
	createOtherRepo (callback) {
		this.repoFactory.createRandomRepo(
			(error, response) => {
				if (error) { return callback(error); }
				this.otherTeam = response.team;
				callback();
			},
			{
				token: this.token	// "current user" will create this repo/team
			}
		);
	}

	// make the data to be used in the request that triggers the message
	makePostData (callback) {
		super.makePostData(() => {
			// inject the other team ID
			this.data.teamId = this.otherTeam._id;
			callback();
		});
	}
}

module.exports = StreamNoMatchTeamTest;
