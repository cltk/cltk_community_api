import mongoose from 'mongoose';
import shortid from 'shortid';

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate
	},
	name: String,
	type: String,
	path: String,
	thumbPath: String,
	label: String,
});

export default ImageSchema;
