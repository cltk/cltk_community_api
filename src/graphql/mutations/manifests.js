/*
ORIGINAL MIRADOR router code
import express from 'express';

// models
import Manifest from '../models/manifest';
import {Image} from '../models/image';

const router = express.Router();

router.post('/createManifest', (req, res) => {
	const newManifest = {
		images: []
	};

	req.body.images.forEach((image) => {
		newManifest.images.push(new Image(image));
	});

	const manifestObject = Object.assign({}, req.body, newManifest);

	const manifest = new Manifest(manifestObject);
	manifest.save((error) => {
		if (error) {
			console.log('Manifest DB save error: ', error);
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
		Manifest.findByIdAndUpdate(req.body.manifestId, {$set: {remoteUri: req.body.manifestUri}}, (error, manifest) => {
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
