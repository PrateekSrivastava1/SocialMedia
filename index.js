// Load all the environment variables in application
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';

import postRoutes from './src/features/post/post.routes.js';
import userRoutes from './src/features/user/user.routes.js';
import likeRoutes from './src/features/like/like.routes.js';
import commentRoutes from './src/features/comment/comment.routes.js';
import friendRoutes from './src/features/friendship/friendship.routes.js';
import otpRoutes from './src/features/otp/otp.routes.js';
import { errorHandlerMiddleware } from './src/middlewares/errorHandler.js';
import { invalidRoutesHandlerMiddleware } from './src/middlewares/invalidRoutes.middleware.js';
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import jwtAuth from './src/middlewares/jwtAuth.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Logger middleware
app.use(loggerMiddleware);

// Routes for post, user, like, comments, otp
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/likes', jwtAuth, likeRoutes);
app.use('/api/comments', jwtAuth, commentRoutes);
app.use('/api/friends', jwtAuth, friendRoutes);
app.use('/api/otp', jwtAuth, otpRoutes);

// Invalid Routes Middleware
app.use(invalidRoutesHandlerMiddleware);

// App level Error Handler
app.use(errorHandlerMiddleware);

export default app;
