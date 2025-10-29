const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class UserProgress extends Model {}

UserProgress.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enrolledAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completedLessons: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  currentLesson: {
    type: DataTypes.INTEGER
  },
  progressPercentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  completedAt: {
    type: DataTypes.DATE
  },
  certificateIssued: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'UserProgress',
  timestamps: true
});

module.exports = UserProgress;
