import createType from 'mongoose-schema-to-graphql';

// models
import Manifest from '../../models/manifest';

const config = {
	name: 'manifestType',
	description: 'IIIF Manifest base schema',
	class: 'GraphQLObjectType',
	schema: Manifest.schema,
	exclude: []
};

const ManifestType = createType(config);

export default ManifestType;
