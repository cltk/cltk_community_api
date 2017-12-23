// main
import express from 'express';
import fs from 'fs';
import path from 'path';
import request from 'request';

// middleware
import bodyParser from 'body-parser';
import session from 'express-session';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

// dotenv
import dotenvSetup from './dotenv';

// mongoDB
import dbSetup, { storeSetup } from './mongoose';

// authentication
import authSetup from './authentication';

// cors
import corsSetup from './cors';

// graphQL
import setupGraphql from './graphql';

// S3
import s3Setup from './s3';

// Redis
import redisSetup from './redis';

// OAuth setup
import oauthSetup from './oauth';

// email
import EmailManager from './email';

// Routes
import authenticationRouter from './authentication/routes';


// environment variables setup
dotenvSetup();

const app = express();

const db = dbSetup();

const redisClient = redisSetup();

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false,
}));

// session:
app.use(session({
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: false,
	store: storeSetup(session),
}));

// CORS setup
corsSetup(app);

// Authentication setup
authSetup(app, redisClient);

// GraphQl setup
setupGraphql(app);

// S3 setup
s3Setup(app);

// OAuth setup
oauthSetup(app);

// Routes
app.use('/auth', authenticationRouter);

function listen() {
	app.listen(app.get('port'), () => {
		console.info(`Application listening on port ${app.get('port')}`);
	});
}

db.on('error', console.error)
  .on('disconnected', dbSetup)
  .once('open', () => {
	console.info(`Connected to mongodb ( host: ${db.host}, port: ${db.port}, name: ${db.name} )`);

    // START application:
	listen();
});
