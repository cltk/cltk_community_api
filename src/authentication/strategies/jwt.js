import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import DataLoader from 'dataloader';

// models
import User from '../../models/user';


const setupJWTStrategy = (app) => {
	// JWT strategy
	const JWTOptions = {
		jwtFromRequest: ExtractJwt.fromAuthHeader(),
		secretOrKey: process.env.JWT_SECRET,
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
