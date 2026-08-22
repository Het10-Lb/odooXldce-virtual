const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { verifyToken, optionalVerifyToken } = require('../middleware/authMiddleware');

/**
 * Public / Optional Auth Routes
 */

// GET /api/community/posts - Get experience feed with search, filter, grouping & sorting (Screen 10)
router.get('/posts', optionalVerifyToken, communityController.getCommunityPosts);

// GET /api/community/posts/:id - Get single post details with comments
router.get('/posts/:id', optionalVerifyToken, communityController.getPostById);

/**
 * Protected Community Routes (Require Authentication)
 */

// POST /api/community/posts - Create a new community post
router.post('/posts', verifyToken, communityController.createPost);

// PUT /api/community/posts/:id - Update a post
router.put('/posts/:id', verifyToken, communityController.updatePost);

// DELETE /api/community/posts/:id - Delete a post
router.delete('/posts/:id', verifyToken, communityController.deletePost);

// POST /api/community/posts/:id/like - Toggle Like/Unlike on a post
router.post('/posts/:id/like', verifyToken, communityController.toggleLike);

// POST /api/community/posts/:id/comments - Add a comment to a post
router.post('/posts/:id/comments', verifyToken, communityController.addComment);

// POST /api/community/posts/:id/clone-trip - "Copy Trip" Integration: clone linked trip to user profile
router.post('/posts/:id/clone-trip', verifyToken, communityController.cloneTripFromPost);

module.exports = router;
