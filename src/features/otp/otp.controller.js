import { customErrorHandler } from '../../middlewares/errorHandler.js';
import OTPRepository from './otp.repository.js';

export default class OTPController {
  constructor() {
    this.otpRepository = new OTPRepository();
  }

  // Controller for sending the otp
  async send(req, res) {
    try {
      const email = req.body.email;
      console.log(email);
      const send = await this.otpRepository.send(email);
      if (send.success) return res.status(201).json({ msg: send.msg });
      else return res.status(400).json({ msg: send.msg });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Controller for verifying the otp
  async verify(req, res) {
    try {
      const { otp, email } = req.body;
      const verify = await this.otpRepository.verify(email, otp);
      if (verify.success) return res.status(201).json({ msg: verify.msg });
      else return res.status(404).json({ msg: verify.msg });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // Controller for resetting the otp
  async resetPassword(req, res) {
    try {
      const newPassword = req.body;
      const email = req.body;
      const reset = await this.otpRepository.resetPassword(email, newPassword);
      return res.status(201).json({ msg: send.msg });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
