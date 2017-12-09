import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import miradorManifestType from '../types/miradorManifest';

// models
import MiradorManifest from '../../models/miradorManifest';

// errors
import { AuthenticationError } from '../errors';

const miradorMutationFields = {
	mutationCreate: {
		type: miradorManifestType,
		args: {
			title: {
				type: new GraphQLNonNull(GraphQLString)
			},
		},
		async resolve(parent, { title }, { user, project }) {

			if (user && project.adminPage) {
				const mirador = {
					title
				};

				return MiradorManifest(mirador).save();
			}
			throw new AuthenticationError();
		}
	}
};

export default miradorMutationFields;



/*
ORIGINAL MIRADOR router code
import express from 'express';

// models
import Mirador from '../models/mirador';
import {Image} from '../models/image';

const router = express.Router();

router.post('/createManifest', (req, res) => {
	const newMirador = {
		images: []
	};

	req.body.images.forEach((image) => {
		newMirador.images.push(new Image(image));
	});

	const miradorObject = Object.assign({}, req.body, newMirador);

	const mirador = new Mirador(miradorObject);
	mirador.save((error) => {
		if (error) {
			console.log('Mirador DB save error: ', error);
		} else {
			const reqBody = {
				manifest: JSON.stringify(req.body),
				responseUrl: `${process.env.REACT_APP_SERVER}/manifestCreated`
			};
			request.post('http://generate-manifests.orphe.us/manifests', {form: reqBody});
		}
	});
});

router.post('/manifestCreated', (req, res) => {
	const exampleSecret = 'examplewebhookkey';
	if (req.body.secret === exampleSecret) {
		Mirador.findByIdAndUpdate(req.body.manifestId, {$set: {remoteUri: req.body.manifestUri}}, (error, manifest) => {
			if (error) {
				console.log('Manifest created callback error: ', error);
				res.send('Error updating manifest!');
			}			else {
				res.send('Roger that!');
			}
		});
	}	else {
		console.log('/manifestCreated: Authentication error!');
		res.send('Authentication needed!');
	}
});

export default router;
*/
