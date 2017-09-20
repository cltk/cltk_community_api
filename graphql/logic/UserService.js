// import {Meteor} from 'meteor/meteor';
// import PermissionService from './PermissionsService';
//
// export default class UserService extends PermissionService {
//   constructor(props) {
//     super(props);
//   }
//
//   userUpdate(_id, user) {
//     if (this.userIsAdmin) {
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
//     return new Error('Not authorized');
//   }
// }
