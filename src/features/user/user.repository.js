// Import necessary modules
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

import { userSchema } from './user.schema.js';
import { customErrorHandler } from '../../middlewares/errorHandler.js';
import { compareHashedPassword, hashPassword } from '../../utils/hashPassword.js';

// Create a Mongoose model based on the user schema
const UserModel = mongoose.model('User', userSchema);

// Exporting UserRepository class
export default class UserRepository {
  // Repository method for user signup
  async signUp(userData) {
    try {
      const email = userData.email;
      const user = await UserModel.findOne({ email });

      // Check if the user already exists
      if (user) return null;

      // Create a new user and save to the database
      const newUser = new UserModel(userData, { loginTokens: [] });
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository method for user signin
  async signIn(userData) {
    try {
      // Retrieve email and password from user data
      const email = userData.email;
      const password = userData.password;

      // Find the user by email
      const emailFind = await UserModel.findOne({ email });

      // If user not found, return an error response
      if (!emailFind) {
        return { success: false, error: { msg: 'user not found', statusCode: 404 } };
      } else {
        // Compare hashed password with the provided password
        const user = await compareHashedPassword(password, emailFind.password);

        // If passwords don't match, return an error response
        if (!user) {
          return {
            success: false,
            error: { msg: 'Incorrect Password', statusCode: 400 }
          };
        }

        // Generate JWT token for authentication
        const token = jwt.sign(
          { userId: emailFind._id, userEmail: email },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h'
          }
        );

        // Update user's login tokens and return a success response with token
        await UserModel.findOneAndUpdate(
          { email },
          { $push: { loginTokens: token } },
          { safe: true, upsert: true, new: true }
        );
        return {
          success: true,
          msg: 'Logged in successfully',
          details: emailFind,
          token: token
        };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository method for updating user password
  async updatePassword(id, newPassword, next) {
    try {
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      const userId = new ObjectId(id);

      // Find user by ID
      let user = await UserModel.findOne({ _id: userId });

      // If user not found, return an error response
      if (!user) {
        return { success: false, error: { msg: 'user not found', statusCode: 404 } };
      } else {
        // Update user's password and return success response
        user.password = hashedPassword;
        await user.save();
        return { success: true, error: { msg: user, statusCode: 201 } };
      }
    } catch (err) {
      console.log(err);
      return { success: false, error: { msg: err, statusCode: 400 } };
    }
  }

  // Repository method for fetching user details by ID
  async getDetails(userId) {
    try {
      // Find user by ID and exclude sensitive information
      const details = await UserModel.findById(userId)
        .select('-password')
        .select('-loginTokens');

      // Return success response with user details if found
      if (details) {
        return { success: true, msg: 'User found.', details: details };
      }
      return { success: false, msg: 'User not found.' };
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository method for fetching all user details
  async getAllDetails() {
    try {
      // Find all users and exclude sensitive information
      const allUserDetails = await UserModel.find()
        .select('-password')
        .select('-loginTokens');
      return allUserDetails;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository method for updating user details by ID
  async updateDetails(userId, userData) {
    try {
      // Find user by ID and update user details
      const update = await UserModel.findOneAndUpdate({ _id: userId }, { userData });

      // Return success or failure response based on update result
      if (update) {
        return { success: true, msg: 'Updated successfully.', details: update };
      } else {
        return { success: false, msg: 'Update failed.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository method for user logout
  async logout(userId, token) {
    try {
      // Remove token from user's login tokens array
      const removeToken = await UserModel.updateOne(
        { _id: userId },
        { $pull: { loginTokens: token } }
      );

      // Return success or failure response based on token removal
      if (removeToken.modifiedCount > 0) {
        return { success: true, msg: 'Token removed from DB.' };
      } else {
        return { success: false, msg: 'Token removal from DB failed.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository method for user logout from all devices
  async logoutAllDevices(userId) {
    try {
      // Remove all tokens from user's login tokens array
      const removeToken = await UserModel.updateOne(
        { _id: userId },
        { $set: { loginTokens: [] } }
      );

      // Return success or failure response based on token removal
      if (removeToken.modifiedCount > 0) {
        return { success: true, msg: 'Token removed from Database.' };
      } else {
        return { success: false, msg: 'Token removal from Database failed.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
