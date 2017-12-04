import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import DataLoader from 'dataloader';
import createRedisDataLoader from 'redis-dataloader';

// models
import User from '../../models/user';


const setupJWTStrategy = (app, redisClient) => {
	const RedisDataLoader = createRedisDataLoader({ redis: redisClient });

	const userLoader = new RedisDataLoader(
		'user',
		new DataLoader(ids => Promise.all(ids.map(User.findById)), {
			cache: false
		}), {
			cache: false,
			// expire: 60,
		}
	);

	// JWT strategy
	const JWTOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeader(),
		secretOrKey: process.env.JWT_SECRET,
		ignoreExpiration: true,
	};

	passport.use(new JwtStrategy(JWTOptions, async (jwtPayload, done) => {

		try {
			const user = await userLoader.load(jwtPayload._id);

			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		} catch (err) {
			return done(err, false);
		}
	}));
};

export default setupJWTStrategy;
