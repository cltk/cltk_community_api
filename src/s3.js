import aws from 'aws-sdk';
import S3Router from 'react-s3-uploader/s3router';


export default function s3Setup(app) {
	aws.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS,
	});
	
	app.use('/s3', S3Router({
		bucket: process.env.AWS_BUCKET,
		ACL: 'public-read',
		uniquePrefix: false
	}));
}
