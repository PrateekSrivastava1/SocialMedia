import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    match: [/.+\@.+\../, 'Please enter a valid email']
  },
  otp: {
    type: Number,
    required: true
  }
});

export const OTPModel = mongoose.model('Otp', otpSchema);
