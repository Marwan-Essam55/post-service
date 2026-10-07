const express = require('express');
const router = express.Router();
const { createPost, getPostById, listPosts } = require('../controllers/postController');
router.post('/', createPost);      
router.get('/', listPosts);        
router.get('/:id', getPostById);   

module.exports = router;