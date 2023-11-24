import { FriendshipModel } from './friendship.schema.js';
import { ObjectId } from 'mongodb';

export default class FriendshipRepository {
  // fetching friends
  async getFriends(userId) {
    try {
      const friends = await FriendshipModel.find({
        user: new ObjectId(userId),
        state: 'Friend'
      });
      return friends;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // fetching pending friend request
  async getPendingRequests(userId) {
    try {
      const friends = await FriendshipModel.find({
        user: new ObjectId(userId),
        state: 'Pending'
      });
      return friends;
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // adding/removing friends
  async toggleFriendship(userId, friendId) {
    try {
      if (userId == friendId) {
        return { success: false, msg: 'Cannot add/remove thyself from friend list' };
      }
      const friend = await FriendshipModel.findOne({
        user: new ObjectId(userId),
        friend: new ObjectId(friendId),
        state: 'Friend'
      });
      if (friend) {
        await FriendshipModel.deleteOne({
          user: userId,
          friend: friendId,
          state: 'Friend'
        });
        return { success: true, msg: 'Unfriended the user.' };
      } else {
        const newFriend = new FriendshipModel({
          user: userId,
          friend: friendId,
          state: 'Friend'
        });
        await newFriend.save();
        return { success: true, msg: 'New friend added.' };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // responding to friend request
  async friendReqRes(userId, friendId, action) {
    try {
      if (action == 'accept') {
        const friend = new FriendshipModel({
          user: userId,
          friend: friendId,
          state: 'Friend'
        });
        await friend.save();
        return { success: true, msg: 'Accepted the friend request.' };
      } else if (action == 'reject') {
        const friend = await FriendshipModel.findOneAndDelete({
          user: userId,
          friend: friendId,
          state: 'Pending'
        });
        return { success: true, msg: 'Friend request rejected.' };
      } else {
        return {
          success: false,
          msg: 'No action has been taken since action needs to be either accept or reject'
        };
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
