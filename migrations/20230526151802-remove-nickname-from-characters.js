'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Characters', 'nickname');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Characters', 'nickname', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
