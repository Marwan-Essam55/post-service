const Post = require('../../domain/entities/Post');

class CreatePost {
  constructor(postRepository, eventProducer) {
    this.postRepository = postRepository;
    this.eventProducer = eventProducer;
  }

  async execute({ title, content }) {
    const postEntity = new Post({ title, content });
    const savedPost = await this.postRepository.save(postEntity);
    if (this.eventProducer) {
      await this.eventProducer(savedPost);
    }

    return savedPost;
  }
}

module.exports = CreatePost;