import FriendshipRepository from './friendship.repository.js';

export default class FriendshipController {
  constructor() {
    this.friendshipRepository = new FriendshipRepository();
  }

  // fetching friends
  async getFriends(req, res) {
    try {
      const userId = req.params.userId;
      const friends = await this.friendshipRepository.getFriends(userId);
      if (friends) {
        return res.status(200).json({ friends });
      } else {
        return res.status(404).json({ msg: 'No friends found' });
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // fetching pending friend requests
  async getPendingRequests(req, res) {
    try {
      const userId = req.cookies.userId;
      const pendingRequests = await this.friendshipRepository.getPendingRequests(userId);
      if (pendingRequests) {
        return res.status(200).json({ pendingRequests });
      } else {
        return res.status(404).json({ msg: 'No pending requests found' });
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // adding/removing friends
  async toggleFriendship(req, res) {
    try {
      const friendId = req.params.friendId;
      const userId = req.cookies.userId;
      const friend = await this.friendshipRepository.toggleFriendship(userId, friendId);
      if (friend.success)
        return res.status(201).json({ success: friend.success, msg: friend.msg });
      else return res.status(400).json({ success: friend.success, msg: friend.msg });
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }

  // responding to friend request
  async friendReqRes(req, res) {
    try {
      const action = req.body;
      const friendId = req.params.friendId;
      const userId = req.cookies.userId;
      const friend = await this.friendshipRepository.friendReqRes(
        userId,
        friendId,
        action
      );
      if (friend.success) {
        return res.status(200).json({ success: friend.success, msg: friend.msg });
      } else {
        return res.status(404).json({ success: friend.success, msg: friend.msg });
      }
    } catch (err) {
      console.log(err);
      throw new customErrorHandler(500, 'Something went wrong.');
    }
  }
}
