const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ContentPost extends Model {}

ContentPost.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  summary: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    }
  },
  category: {
    type: DataTypes.ENUM(
      'Biogas Basics', 
      'Waste Management', 
      'Environment & Health', 
      'Community Impact', 
      'Innovation', 
      'Getting Started'
    ),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  imageUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  sequelize,
  modelName: 'ContentPost',
  tableName: 'content_posts',
  timestamps: true,
  indexes: [
    { fields: ['title'] },
    { fields: ['category', 'published'] },
    { fields: ['createdAt'] }
  ]
});

// Virtual method for like count
ContentPost.prototype.getLikeCount = function() {
  return Array.isArray(this.likes) ? this.likes.length : 0;
};

module.exports = ContentPost;
