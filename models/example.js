import mongoose from 'mongoose';
import timestamp from 'mongoose-timestamp';
import URLSlugs from 'mongoose-url-slugs';

const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  exampleField: String,
  title: String,
});

// add timestamp (createdAt, updatedAt)
ExampleSchema.plugin(timestamp);

// add slug (slug)
ExampleSchema.plugin(URLSlugs('title'));

const Example = mongoose.model('example', ExampleSchema);

export default Example;
export {ExampleSchema};
