import UserRepository from './user.repository.js';
import { customErrorHandler } from '../../middlewares/errorHandler.js';
import { hashPassword } from '../../utils/hashPassword.js';

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // User Registration
  async signUp(req, res) {
    const { name, gender, email } = req.body;
    let { password } = req.body;
    const loginTokens = null;
    try {
      const hashedPassword = await hashPassword(password);
      password = hashedPassword;
      const userData = { name, gender, email, password };
      const user = await this.userRepository.signUp(userData);
      if (user) return res.status(201).send(user);
      else return res.status(400).send('Email already in use');
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // User Login
  async signIn(req, res) {
    try {
      let status = await this.userRepository.signIn(req.body);
      if (status.success) {
        res
          .status(201)
          .cookie('jwtToken', status.token, { maxAge: 900000, httpOnly: false })
          .cookie('userId', status.details._id, { maxAge: 900000, httpOnly: false })
          .json({ status: 'success', msg: 'login successful', token: status.token });
      } else {
        res.status(400).json({ status: 'failure', msg: 'invalid user details' });
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Updating Password
  async updatePassword(req, res, next) {
    try {
      const { newPassword } = req.body;
      const userId = req.cookies.userId;
      const resp = await this.userRepository.updatePassword(userId, newPassword, next);
      if (resp.success) {
        res
          .status(201)
          .json({ success: true, msg: 'password updated successfully', res: resp.res });
      } else {
        return next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // For Logging Out
  async logout(req, res, next) {
    try {
      const userId = req.cookies.userId;
      const token = req.cookies.jwtToken;
      const logout = await this.userRepository.logout(userId, token);
      if (logout.success)
        res.clearCookie('jwtToken').json({ success: true, msg: 'logout successful' });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Logging Out from all devices
  async logoutAllDevices(req, res, next) {
    try {
      const userId = req.cookies.userId;
      const logout = await this.userRepository.logoutAllDevices(userId);
      if (logout.success)
        res.clearCookie('jwtToken').json({ success: true, msg: 'logout successful' });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // fetching details
  async getDetails(req, res) {
    try {
      const userId = req.params.userId;
      const userDetails = await this.userRepository.getDetails(userId);
      if (userDetails.success) {
        return res.status(200).json({ details: userDetails.details });
      } else {
        return res.status(404).json({ details: userDetails.msg });
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // function to fetch details of all the users
  async getAllDetails(req, res) {
    try {
      const allUserDetails = await this.userRepository.getAllDetails();
      if (allUserDetails) {
        return res.status(200).json({ allUserDetails });
      } else {
        return res.status(404).json({ msg: 'No user found.' });
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // update the details
  async updateDetails(req, res) {
    try {
      const userId = req.params.userId;
      const userData = req.body;
      const update = await this.userRepository.updateDetails(userId, userData);
      if (update.success) {
        return res.status(201).json({ msg: update.msg });
      } else {
        return res.status(404).json({ msg: update.msg });
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
