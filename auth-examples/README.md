# Auth Examples

This directory contains code and excersices for api-key auth, basic auth and jwt auth

## Exercises

### API key based authenticaiton

-   An API key is a code used to identify and authenticate an application or user
-   API keys are commonly used to control the utilization of the API’s interface and track how it is being used. This is often as a precaution to prevent abuse or malicious use
-   API keys can be used to identify a specific project or the application making the call to the API. While API keys are not as secure as the tokens that provide authentication, they help identify the project or application that makes the call. This ensures they can also be used to designate usage information to a specific project and reject unauthorized access requests.
-   On a protected route, API key can be sent in the headers in the format

```
x-api-key: <API-Key>
```

-   More info on API keys [here](https://www.fortinet.com/resources/cyberglossary/api-key) and [here](https://blog.stoplight.io/api-keys-best-practices-to-authenticate-apis)

#### Sample user structure

```
{
    api_key: 'c0bd2ba0-5f40-4f95-9dbf-3f8b58177927',
    email: 'user@email.com',
    host: 'http://127.0.0.1:5500',
    usages: [{ date: '2020-05-08', count: 17 }],
}
```

### Basic Authentication

-   Basic Authentication is a method for an HTTP user agent (e.g., a web browser) to provide a username and password when making a request.
-   On a protected route, the header is formated as,

```
Authorization: Basic <base64 email:password>
```

-   More info on basic auth [here](https://www.twilio.com/docs/glossary/what-is-basic-authentication) and [here](https://www.geeksforgeeks.org/basic-authentication-in-node-js-using-http-header/)

#### Sample user structure

```
{
    email: 'user@email.com',
    password: '2b$10$CntnKq3xNN5gJv231CaGUeKT3UM/ZdJTUWIrYHNkaaPEhUrL0IiH2'
}
```

### JWT Authentication

-   JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object
-   On a protected route, the header is formated as,

```
Authorization: Basic <token>
```

-   More info on JWT auth [here](https://jwt.io/introduction), [here](https://blog.logrocket.com/jwt-authentication-best-practices/) and [here](https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52/)

#### Sample user structure

```
{
    id: "l3g7tq51",
    email: 'user@email.com'
    password: '2b$10$CntnKq3xNN5gJv231CaGUeKT3UM/ZdJTUWIrYHNkaaPEhUrL0IiH2'
}
```
