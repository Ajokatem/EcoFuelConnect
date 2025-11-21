
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Biogas Basics', 'Waste Management', 'Environment & Health', 'Community Impact', 'Innovation', 'Getting Started'),
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  lessons: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    defaultValue: 'https://via.placeholder.com/300x200'
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  enrollmentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'courses'
});

module.exports = Course;
