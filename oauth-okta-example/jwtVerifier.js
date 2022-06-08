const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: process.env.OKTA_ISSUER,
    clientId: process.env.OKTA_CLIENT_ID
})

module.exports = async (request, response, next) => {

    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(401).send();
    }

    const [authType, token] = authorization.trim().split(' ');

    try {
        const jwt = await oktaJwtVerifier.verifyAccessToken(token, process.env.OKTA_AUDIENCE)
        const claims = jwt.claims;

        if (!claims) {
            return response.status(401).send();
        }
        if (!claims.scp.includes('api')) {
            return response.status(401).send();
        }

        //TODO: add code to pass test for `v1` scope to be included
        //TODO: add code to pass test for token expiration
        //TODO: add code to pass test for verification of clientId match

        return next();
    }
    catch (err) {
        console.log(err);
        return response.status(401).send();
    }
}
