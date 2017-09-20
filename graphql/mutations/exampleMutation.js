// import { GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql';
//
// // types
// import UserType from '../types/models/user';
//
// import { RemoveType } from '../types';
//
// // models
// import User from '../../models/user';
//
// // errors
// import { AuthenticationError } from '../errors';
//
// const userMutationFields = {
//   exampleUpdate: {
//     type: UserType,
//     description: 'Example mutation',
//     args: {
//       _id: {
//         type: GraphQLID,
//       },
//       example: {
//         type: ExampleInputType
//       }
//     },
//     async resolve(obj, { user }, context) {
//       // if user is not logged in
//       if (!user) throw new AuthenticationError();
//
//       const FoundUser = await User.findById(context.user._id);
//
//       Object.keys(user).forEach((key) => {
//         FoundItem[key] = user[key];
//       });
//
//       try {
//         return await FoundUser.save();
//       } catch (err) {
//         handleMongooseError(err);
//       }
//     }
//   },
//   exampleRemove: {
//
//   }
// };
//
// export default userMutationFields;