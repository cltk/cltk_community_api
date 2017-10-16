import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	name: String,
	type: String,
	path: String,
	thumbPath: String,
	_id: String
});

const Image = mongoose.model('Image', ImageSchema);

export {ImageSchema, Image};
