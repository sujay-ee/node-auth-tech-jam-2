
---

# Lets start...

---

# Authentication vs Authorization ?

---

# Authentication vs Authorization

* **Authentication** is the process of verifying an identity (who they say they are)
<br />
* **Authorization** is the process of verifying what someone is allowed to do (permissions)

---

# What does the OAuth specification represent ?

* Is it an **authentication** standard ?
  <br />
* Is it an **authorization** standard ?

# Remember

* **Authentication** is the process of verifying an identity (who they say they are)
  <br />
* **Authorization** is the process of verifying what someone is allowed to do (permissions)

---

# World of API "Authentication"/Authorization  

* **BASIC AUTH** - Username and password were contained in a single header field, in plain text, base64 encoding.
<br />
* **API KEY** - API key issued using some sort of algorithm that the server can verify the validity of and manage the lifetime of the key.
<br />
* **ROLL YOUR OWN JWT** - Server manages access tokens as JWT tokens in a custom format - similar to the API key solution but using JWT tokens.
<br />
* **OAuth** - ??? 

---

# OAuth != Authentication
**OAuth is an "authorization" protocol**

https://oauth.net/articles/authentication/

---

# OAuth terminology - refresher

* **Resource owner (RO)** (the user) - the person who is giving access to some portion of their account.
  <br />
* **Resource server(RS)** (the API) - server that contains the user’s information that is being accessed by the third-party application.
  <br />
  **Examples**: a REST/graphQL API or a public facing API etc..
  <br />
* **Authorization server(AS)** (can be the same server as the API) - the server that displays the OAuth prompt, and where the user approves or denies the application’s request.
  <br />
  **Examples**: an IdP (identity provider) like Okta
  <br />
* **Client** (the application) - app that is attempting to act on the user’s behalf or access the user’s resources.
  <br />
  **Examples**: mobile app, a single-page-app(SPA)
```
                       ┌────┐
                       │ AS │
                       └────┘
                          ↑ 
                          ↑  (obtain token)
                          ↑
┌────┐ (delegate)    ┌─────────┐  (uses token)   ┌────┐
│ RO │ → → → → → →   │ Client  │  → → → → → →    │ RS │
└────┘               └─────────┘                 └────┘
```

---

# What about the 'access-token', is that not authentication ?

* OAuth2 access tokens have NO defined format - not necessary to be a JWT 
<br />
* **As long as a token enables a resource server** to perform the authorization decisions it needs to make when receiving a call, it can use whatever (verifiable) method it wants.
<br />
E.g. the token could simply be the ID of the row of a DB where the **AS** originally stored the consent info; as long as the **RS** can read the same DB, there’s no need to use any fancy token format.
<br />
<br />
**Result**: Client applications should NOT read these tokens or **peek** inside - **they were never meant for the client**.

---

# Who is the 'access-token' meant for then ?

A client is meant to do two things with an access token - 

* request it
  <br />
* use it to call the resource it is meant for
  <br />
* renew it when expired
  <br />

Ok, that's 3 things 😁
---

# Summary of points about the 'access-token'

* Access tokens do not represent a user
<br />
* Access tokens do not represent authentication
<br />
* Access tokens can be anything and contain anything
<br />
* Access tokens cannot be safely verified by the client application
<br />
* Access tokens cannot be safely verified by the client application
<br />

---

# Scope vs Claim

* **Claims** - assertions that one subject (e.g. a user or an Authorization Server) makes about itself or another subject.
<br />
**Example:** an ID Token will consist of some claims with information about the user, maybe their first and last name, e-mail or address.
<br />
* **Scopes** - are groups of claims.
<br />
**Example:** A common example is the standard OpenID Connect scope `profile`. 
Consenting to the use of this scope will result in getting an ID Token which will include the 
following claims: `name`, `family_name`, `given_name`, `birthdate`, `profile_picture` etc.
  <br />

---

# What if I want to do authentication with OAuth ? 

* Use **OpenID Connect (OIDC)** - OAuth + Identity
<br />
* OpenID Connect (OIDC) extends OAuth 2.0 with a new signed id_token for the client and a UserInfo endpoint to fetch user attributes
<br />
* Enter **identity-token** -
<br />
An identity token describes the authentication event that took place at the identity provider. 
<br />
It contains information such as when the user last authenticated and how they authenticated. 
<br />
An identity token is **always** a signed JSON Web Token (JWT).
<br />

---

# Your next API authentication/authorization

**Think about your needs - build a level of security that is sufficient for your use-case.**

* Who needs access ? 
<br />
* Is it public facing ?
<br />
* How much **trust** can you put into the **client** ? e.g. is another microservice you own ? or is it a browser ? or is it a 3rd party client service ?
<br />
* Can the **client** hold secrets ?
<br />
* Does it need to be **stateful** (e.g. session-id, api-key store) or can it be **stateless** ?
<br />
* Do you need to **authenticate** the **user** or the RO ? or maybe not ?
<br />
* Is the access time limited ? (e.g. token expiry, session expiry)
<br />
* How are the **scopes** and **claims** organized ? (e.g. a particular `role` might have access to certain `scopes` or `claims`, or an API might need certain `scopes` or `claims`.)

---
