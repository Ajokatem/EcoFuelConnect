'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Courses', [
      {
        title: 'Biogas Basics 101',
        description: 'Introduction to biogas production and its benefits for South Sudan.',
        shortDescription: 'Learn the basics of biogas.',
        category: 'Biogas Basics',
        level: 'beginner',
        tags: JSON.stringify(['biogas', 'energy', 'waste']),
        lessons: JSON.stringify([]),
        instructorId: 1,
        thumbnailUrl: 'https://via.placeholder.com/300x200',
        duration: 60,
        enrollmentCount: 0,
        rating: 0,
        ratingCount: 0,
        price: 0,
        published: true,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Waste Management for Communities',
        description: 'Best practices for managing organic waste in local communities.',
        shortDescription: 'Community waste management strategies.',
        category: 'Waste Management',
        level: 'intermediate',
        tags: JSON.stringify(['waste', 'community', 'management']),
        lessons: JSON.stringify([]),
        instructorId: 1,
        thumbnailUrl: 'https://via.placeholder.com/300x200',
        duration: 45,
        enrollmentCount: 0,
        rating: 0,
        ratingCount: 0,
        price: 0,
        published: true,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};
