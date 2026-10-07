const CreatePost = require('../../application/use-cases/CreatePost');
const MongoPostRepository = require('../../infrastructure/database/MongoPostRepository');
const { publishPostCreated } = require('../../infrastructure/messaging/Postproducer');

const postRepository = new MongoPostRepository();
const createPostUseCase = new CreatePost(postRepository, publishPostCreated);

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await createPostUseCase.execute({ title, content });
    
    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postRepository.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Invalid ID format or server error'
    });
  }
};

const listPosts = async (req, res) => {
  try {
    const posts = await postRepository.findAll();
    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { createPost, getPostById, listPosts };