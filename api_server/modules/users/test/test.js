// handle unit tests for the users module

'use strict';

// make eslint happy
/* globals describe */

const UserRequestTester = require('./user_request_tester');
const GetSessionsRequestTester = require('./get_sessions/test');
const PresenceRequestTester = require('./presence/test');
const ChangePasswordRequestTester = require('./change_password/test');
const ForgotPasswordRequestTester = require('./forgot_password/test');
const CheckResetRequestTester = require('./check_reset/test');
const ResetPasswordRequestTester = require('./reset_password/test');
const ResendConfirmRequestTester = require('./resend_confirm/test');
const CheckSignupRequestTester = require('./check_signup/test');
const ChangeEmailRequestTester = require('./change_email/test');
const ChangeEmailConfirmRequestTester = require('./change_email_confirm/test');
const ProviderConnectRequestTester = require('./provider_connect/test');
const ProviderAuthCodeRequestTester = require('./provider_authcode/test');
const ProviderAuthRequestTester = require('./provider_auth/test');
const ProviderTokenRequestTester = require('./provider_token/test');
const ProviderDeauthRequestTester = require('./provider_deauth/test');
const BumpPostsRequestTester = require('./bump_posts/test');

const userRequestTester = new UserRequestTester();

describe('user requests', function() {

	this.timeout(20000);

	describe('POST /no-auth/register', userRequestTester.registrationTest);
	describe('POST /no-auth/confirm', userRequestTester.confirmationTest);
	describe('PUT /no-auth/login', userRequestTester.loginTest);
	describe('PUT /login', userRequestTester.rawLoginTest);
	describe('GET /users/:id', userRequestTester.getUserTest);
	describe('GET /users', userRequestTester.getUsersTest);
	describe('PUT /read/:streamId', userRequestTester.readTest);
	describe('PUT /unread/:postId', userRequestTester.unreadTest);
	describe('GET /preferences', userRequestTester.getPreferencesTest);
	describe('PUT /preferences', userRequestTester.putPreferencesTest);
	describe('PUT /users/:id', userRequestTester.putUserTest);
	describe('POST /users', userRequestTester.postUserTest);
	describe('PUT /grant/:channel', userRequestTester.grantTest);
	describe('GET /sessions', GetSessionsRequestTester.test);
	describe('PUT /presence', PresenceRequestTester.test);
	describe('PUT /password', ChangePasswordRequestTester.test);
	describe('PUT /no-auth/forgot-password', ForgotPasswordRequestTester.test);
	describe('GET /no-auth/check-reset', CheckResetRequestTester.test);
	describe('PUT /no-auth/reset-password', ResetPasswordRequestTester.test);
	describe('PUT /no-auth/resend-confirm', ResendConfirmRequestTester.test);
	describe('PUT /no-auth/check-signup', CheckSignupRequestTester.test);
	describe('PUT /change-email', ChangeEmailRequestTester.test);
	describe('PUT /no-auth/change-email-confirm', ChangeEmailConfirmRequestTester.test);
	describe('PUT /no-auth/provider-connect/:provider', ProviderConnectRequestTester.test);
	describe('GET /provider-auth-code', ProviderAuthCodeRequestTester.test);
	describe('GET /no-auth/provider-auth/:provider', ProviderAuthRequestTester.test);
	describe('GET /no-auth/provider-token/:provider', ProviderTokenRequestTester.test);
	describe('PUT /provider-deauth/:provider', ProviderDeauthRequestTester.test);
	describe('PUT /bump-posts', BumpPostsRequestTester.test);
});
