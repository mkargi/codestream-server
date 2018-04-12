'use strict';

var FindRepoTest = require('./find_repo_test');

class NormalizeTest extends FindRepoTest {

	get description () {
		return 'should find the appropriate repo even if the url is non-normalized';
	}

	// make the path we'll use to run the test request, with pre-established query parameters
	makePath (callback) {
		// add some junk to the url, this junk should get normalized out and the url should still match
		let url = decodeURIComponent(this.queryData.url);
		let match = url.match(/^https:\/\/(.+)@(.+)\?(.*)/);
		this.queryData.url = encodeURIComponent(`https://${match[2]}?x=a&y=b#def`).toUpperCase();
		this.queryData.knownCommitHashes = this.queryData.knownCommitHashes.toUpperCase();
		super.makePath(callback);
	}
}

module.exports = NormalizeTest;
