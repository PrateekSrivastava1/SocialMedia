import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [3, 'The name should be at least 3 characters long']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    match: [/.+\@.+\../, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  loginTokens: {
    type: [String]
  }
});
