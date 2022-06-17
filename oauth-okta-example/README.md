# JWT authorization 

The authorization for the incoming JWT token is implemented in this file called `jwtVerifier`.

# Format of the JWT token

Sample token - 
```shell
✻ Header
{
	"alg": "RS256",
	"kid": "4lj2I0w9j2iR32VBn-91ip28TPRelHrkJBI4tih6UMI"
}
✻ Body
{
	"aud": "my_service",
	"cid": "0oa56t6mexzf8yj6N5d7",
	"exp": 1654436842,
	"iat": 1654433242,
	"iss": "https://dev-4353503.okta.com/oauth2/default",
	"jti": "AT.q5vpxOfuxkZWGGgua9Ru5Qwh6l2oagArJ03tHfVOAXs",
	"scp": [
		"api"
	],
	"sub": "0oa56t6mexzf8yj6N5d7",
	"ver": 1
}
Issued at: 05 Jun 22 18:17 IST
Not before: undefined
Expires at: 05 Jun 22 19:17 IST

✻ Signature
Mvz5ybzsO1dNvucirgMq4eneR2vAHQgiXXmJ-........
```
The verifier does the following things - 

1. Verifies that the token is _signed_ by the right _issuer_ (denoted by the `iss` part of the token and with the right algorithm (denoted by the `alg` in the header).
2. Verifies that the _audience_ for the token matches to what the token is valid for (denoted by the `aud` part of the body of the token)
3. Verifies that the _issuer_ is same as the one in the token's `iss` part of the body of the token.
4. Verifies that the _scope_ array contains the right _scopes_ for this resource.


# Exercise to the reader

Make the tests pass in `jwtVerifier.test.js`.

There are 2 tests here - 

1. Verify if the incoming token is _expired_ or not.  _Dev help_: In javascript, to get epoch time, you can use `getTime()` function on the `Date` object.
2. Verify if the `clientId` matches the expected `clientId` that the server expects.
3. Verify and assert on additional _claim_ named `v1`.