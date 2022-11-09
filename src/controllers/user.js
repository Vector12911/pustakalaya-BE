import { User } from '../models/user_model.js';

export const user = async (req, res) => {
  try {
    //1 check if user already exist
    const email = req.user?.email;
    const currentUser = await User.checkUser(email);
    res.status(200).send(currentUser);
  } catch (error) {
    res.status(400).json({ message: 'Error', error: error.message });
  }
};
// module.exports = {
//   user: async (req, res) => {
//     try {
//       //1 check if user already exist
//       const email = req.user?.email;
//       const currentUser = await User.checkUser(email);
//       res.status(200).send(currentUser);
//     } catch (error) {
//       res.status(400).json({ message: 'Error', error: error.message });
//     }
//   },
// };
