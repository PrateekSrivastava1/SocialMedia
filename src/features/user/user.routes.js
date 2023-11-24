// Import required modules
import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwtAuth.js';

// Create an Express router
const router = express.Router();

// Create an instance of the UserController
const userController = new UserController();

// Defined routes for different user actions and linked them to respective controller methods

// Route for user signup
router.route('/signup').post((req, res) => {
  userController.signUp(req, res); // Calling signUp method from UserController
});

// Route for user signin
router.route('/signin').post((req, res) => {
  userController.signIn(req, res);
});

// Route for user logout
router.route('/logout').get(jwtAuth, (req, res) => {
  userController.logout(req, res); // Calling logout method from UserController after JWT authentication
});

// Route for user logout from all devices
router.route('/logout-all-devices').get(jwtAuth, (req, res) => {
  userController.logoutAllDevices(req, res);
});

// Route for updating user password
router.route('/update/password').post(jwtAuth, (req, res, next) => {
  userController.updatePassword(req, res, next);
});

// Route for getting user details by ID
router.route('/get-details/:userId').get(jwtAuth, (req, res) => {
  userController.getDetails(req, res);
});

// Route for getting all user details
router.route('/get-all-details').get(jwtAuth, (req, res) => {
  userController.getAllDetails(req, res);
});

// Route for updating user details by ID
router.route('/update-details/:userId').put(jwtAuth, (req, res) => {
  userController.updateDetails(req, res);
});

// Export the router to be used in other parts of the application
export default router;
