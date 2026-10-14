'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('enrollments', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      course_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      student_user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      status: { type: Sequelize.ENUM('enrolled', 'dropped'), allowNull: false, defaultValue: 'enrolled' },
      enrolled_at: { type: Sequelize.DATE, allowNull: false },
      dropped_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('enrollments', ['course_id', 'student_user_id', 'status'], {
      name: 'enrollments_course_student_status'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('enrollments');
  }
};
