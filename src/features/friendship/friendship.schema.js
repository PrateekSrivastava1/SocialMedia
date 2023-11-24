import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  friend: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  state: {
    type: String,
    required: [true, 'Friendship status required'],
    enum: ['Friend', 'Pending']
  }
});

export const FriendshipModel = mongoose.model('Friendship', friendshipSchema);
