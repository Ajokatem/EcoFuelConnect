'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shortDescription: {
        type: Sequelize.STRING(300),
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('Biogas Basics', 'Waste Management', 'Environment & Health', 'Community Impact', 'Innovation', 'Getting Started'),
        allowNull: false
      },
      level: {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: false
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      lessons: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      instructorId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      thumbnailUrl: {
        type: Sequelize.STRING,
        defaultValue: 'https://via.placeholder.com/300x200'
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      enrollmentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      ratingCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};
