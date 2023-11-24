import mongoose from 'mongoose';

import { hashPassword } from '../../utils/hashPassword.js';
import { sendMail } from '../../utils/mailer.js';
import { userSchema } from '../user/user.schema.js';
import { OTPModel } from './otp.schema.js';
import { customErrorHandler } from '../../middlewares/errorHandler.js';

const UserModel = mongoose.model('User', userSchema);

export default class OTPRepository {
  // Repository for sending the otp
  async send(email) {
    try {
      const otp = Math.floor(Math.random() * 1000000) + 1;
      const updateOrCreate = await OTPModel.findOneAndUpdate(
        { email: email },
        { otp: otp },
        { new: true }
      );
      await sendMail(email, otp);
      if (updateOrCreate) {
        return { success: true, msg: 'OTP Generated.' };
      } else {
        return { success: false, msg: 'OTP generation failed.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for verifying the otp
  async verify(email, otp) {
    try {
      const verify = await OTPModel.findOne({ email: email, otp: otp });
      if (verify) {
        return { success: true, msg: 'OTP verification successful.' };
      } else {
        return { success: false, msg: 'OTP verification failed.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Repository for resetting the otp
  async resetPassword(email, newPassword) {
    try {
      const hashedPassword = hashPassword(newPassword);
      const reset = await UserModel.findOneAndUpdate(
        { email: email },
        { password: hashedPassword }
      );
      if (reset) {
        return { success: true, msg: 'Password reset successful.' };
      } else {
        return { success: false, msg: 'Password reset failed.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
