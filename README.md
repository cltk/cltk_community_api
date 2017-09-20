# Orphe.us

The project consists of 2 applications:
1.	Client app (React / Redux) based on [`create-react-app`](https://github.com/facebookincubator/create-react-app)
2.	Server (Node.js / Express)

## Starting the project

To start the project you need to follow these steps:
1.	Clone repository

2.	Change catalog:

	```sh
	cd orpheus
	```

3.	Run npm install:

	```sh
	yarn
	```

4.	Setup environment variables:

	Environment variables for the *server*:
	```sh
	// .env
	SESSION_SECRET=secret

	DB_HOST=localhost
	DB_PORT=27017
	DB_NAME=orpheus

	CLIENT_SERVER=http://localhost:3000

	JWT_SECRET=secret

	WS_SERVER_PORT=3002
	WS_SERVER_HOST=localhost
	WS_SERVER_URI=subscriptions

	DEFAULT_LANGUAGE=en

	AWS_BUCKET=bucketName
	AWS_ACCESS_KEY_ID=x
	AWS_SECRET_ACCESS_KEY=x
	AWS_BUCKET=iiif-orpheus
	AWS_REGION=us-east-1
	```

	Environment variables for the *client* (*!IMPORTANT*: this should be set in the `client` folder):
	```sh
	// client/.env
	REACT_APP_GRAPHQL_SERVER=http://localhost:3001
	REACT_APP_GRAPHQL_URI=graphql
	REACT_APP_SERVER=http://localhost:3001
	REACT_APP_LOGIN_URI=auth/login
	REACT_APP_LOGIN_JWT_URI=auth/login-jwt
	REACT_APP_LOGOUT_URI=auth/logout
	REACT_APP_REGISTER_URI=auth/register
	REACT_APP_REGISTER_JWT_URI=auth/register
	REACT_APP_WS_SERVER=http://localhost:3002

	REACT_APP_WS_SERVER=ws://localhost:3002
	REACT_APP_WS_SERVER_URI=subscriptions

	AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS=
    AWS_BUCKET=iiif-orpheus
    AWS_REGION=us-east-1
    REACT_APP_BUCKET_URL=https://iiif-orpheus.s3.amazonaws.com
	```

5.	Generate mock data using the seed script:

	If your database is not clear use this script to remove all elements:
	```sh
	yarn db-clear
	```

	To generate the new documents, run:
	```sh
	yarn db-seed
	```

	To run both scripts, one after the other, use:
	```sh
	yarn db-setup
	```


6.	Use one of the following npm scripts to start the application:

	| shell script | Description |
	| ------ | ------ |
	| `yarn start` | Starts the server and the client application |
	| `yarn server` | Starts the server application |
	| `yarn client` | Starts the client application|

## Authentication

### Auth on Server

JSON Web Tokens (JWT):

1. Login route: **/auth/login**.

	Pass `username` and `password` in the req body.

	If username and password are correct, server will respond with a `token`.


2. Register route: **/auth/register**.

	Pass `username` and `password` in the req body.

	If username and password are correct, server will respond with a `token`.

3. When using the `fetch` method in the client app, remember to set `authorization' header to the token value`. Otherwise the request will not be authenticated.

4. `apollo-client` has a middleware attached to the `networkInterface`, which reads the token value from the a cookie set with `react-cookie`.

### Auth on Client

#### Authentication methods (`client/src/lib/auth.js`):

**1. login**

	Runs fetch method to the login route and on success sets `token` value in a cookie.

**2. logout**

	Deletes `token` cookie.

**3. register**

	Runs fetch method to the register route and on success sets `token` value in a cookie.

#### Auth redux:

There is a `AuthModal` component placed in the `Root` component, which handles all user authentication operations.

**Q: Where is user data stored in Redx Store?**

A: `userId` and `username` are stored in `store.auth`.


## Environment variables

Priority of environment variables in `.env` files (client and server):

1.	Development:

	1.	`.env.development.local`
	2.	`.env.development`
	3.	`.env.local`
	4.	`.env`

2.	Production:

	1.	`.env.production.local`
	2.	`.env.production`
	3.	`.env.local`
	4.	`.env`

**!IMPORTANT** do NOT commit `.env*.local` files to the repository. These should be used for __personal configuration__ and __secret values__.
