import createType from 'mongoose-schema-to-graphql';

// models
import Example from '../../../models/example';

const exampleType = {
  name: 'ExampleType',
  description: 'Example schema',
  class: 'GraphQLObjectType',
  schema: Example.schema,
  extend: {}
};

const exampleInputType = {
  name: 'ExampleInputType',
  description: 'Example schema',
  class: 'GraphQLInputObjectType',
  schema: Example.schema,
  extend: {}
};

const ExampleType = createType(exampleType);
const ExampleInputType = createType(exampleInputType);

export {ExampleType, ExampleInputType};
