import createType from 'mongoose-schema-to-graphql';

// models
import MiradorManifest from '../../../models/miradorManifest';

const config = {
	name: 'miradorManifestType',
	description: 'Mirador Manifest base schema',
	class: 'GraphQLObjectType',
	schema: MiradorManifest.schema,
	exclude: ['_id']
};

const miradorManifestType = createType(config);

export default miradorManifestType;
