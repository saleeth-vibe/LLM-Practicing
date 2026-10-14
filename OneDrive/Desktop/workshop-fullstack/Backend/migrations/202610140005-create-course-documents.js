'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course_documents', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      course_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'courses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      uploaded_by_user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      original_filename: { type: Sequelize.STRING(255), allowNull: false },
      storage_path: { type: Sequelize.STRING(512), allowNull: false },
      mime_type: { type: Sequelize.STRING(128), allowNull: false },
      ingest_status: {
        type: Sequelize.ENUM('pending', 'processing', 'ready', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      ingest_error: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('course_documents');
  }
};
