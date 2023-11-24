import mongoose from 'mongoose';

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected using Mongoose.');
  } catch (err) {
    console.log(err);
    console.log('Error while connecting to Database.');
  }
};
