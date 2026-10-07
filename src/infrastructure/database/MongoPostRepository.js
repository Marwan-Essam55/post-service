const PostModel=require('./mongoose/PostModel');
const Post = require('../../domain/entities/Post');
class MongoPostRepository {
  async save(postEntity) {
    const doc = await PostModel.create({
      title: postEntity.title,
      content: postEntity.content,
      createdAt: postEntity.createdAt
    });

    return new Post({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      createdAt: doc.createdAt
    });
  }

  async findById(id) {
    const doc = await PostModel.findById(id);
    if (!doc) return null;

    return new Post({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      createdAt: doc.createdAt
    });
  }

  async findAll() {
    const docs = await PostModel.find().sort({ createdAt: -1 });
    return docs.map(doc => new Post({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      createdAt: doc.createdAt
    }));
  }
}
module.exports = MongoPostRepository;