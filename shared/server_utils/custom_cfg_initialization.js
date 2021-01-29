
// This provides a configuration initialization hook, used when a brand new
// config is written to the database for the very first time (via the structured
// config class).
//
// This will generate random secrets, an installation ID and optionally, the
// public facing hostname and ports used for the Single Linux Host On-Prem
// installation type.
//
// It's generic enough to be used for all intended new-config setups.

const UUID = require('uuid').v4;
const RandomString = require('randomstring');

function getRandomIntBetween(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// this hook is called when a structured configuration file is loaded into the
// database for the very first time.
const firstConfigInstallationHook = (nativeCfg) => {
	console.log('inside firstConfigInstallationHook');

	// installation id
	if (!nativeCfg.sharedGeneral.installationId) nativeCfg.sharedGeneral.installationId = UUID();

	// secrets / random strings
	Object.keys(nativeCfg.sharedSecrets).forEach((prop) => {
		if (!nativeCfg.sharedSecrets[prop])
			nativeCfg.sharedSecrets[prop] = RandomString.generate(getRandomIntBetween(15, 30));
	});
	if ('codestreamBroadcaster' in nativeCfg.broadcastEngine) {
		if (!nativeCfg.broadcastEngine.codestreamBroadcaster.secrets.api)
			nativeCfg.broadcastEngine.codestreamBroadcaster.secrets.api = RandomString.generate(
				getRandomIntBetween(15, 30)
			);
		if (!nativeCfg.broadcastEngine.codestreamBroadcaster.secrets.auth)
			nativeCfg.broadcastEngine.codestreamBroadcaster.secrets.auth = RandomString.generate(
				getRandomIntBetween(15, 30)
			);
	}

	// if this property is null, we expect the public facing hostname and ports to have
	// been passed to this routine via environment variables.
	if (!nativeCfg.apiServer.publicApiUrl) {
		const publicHostName = process.env.CS_API_SET_PUBLIC_HOST || 'localhost';
		const publicPort = process.env.CS_API_SET_PUBLIC_PORT
			? parseInt(process.env.CS_API_SET_PUBLIC_PORT)
			: 80;
		const publicBroadcasterPort = process.env.CS_API_SET_PUBLIC_BROADCASTER_PORT
			? parseInt(process.env.CS_API_SET_PUBLIC_BROADCASTER_PORT)
			: 12080;
		const sufx = publicPort == 80 ? '' : ':' + publicPort;
		nativeCfg.apiServer.publicApiUrl = `http://${publicHostName}${sufx}`;
		nativeCfg.apiServer.port = publicPort;
		if ('codestreamBroadcaster' in nativeCfg.broadcastEngine) {
			nativeCfg.broadcastEngine.codestreamBroadcaster.host = publicHostName;
			nativeCfg.broadcastEngine.codestreamBroadcaster.port = publicBroadcasterPort;
		}
	}
};

module.exports = firstConfigInstallationHook;
