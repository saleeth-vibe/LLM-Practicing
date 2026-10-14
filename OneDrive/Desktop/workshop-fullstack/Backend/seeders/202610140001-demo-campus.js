'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = bcrypt.hashSync('Workshop123!', 10);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@campus.edu',
        password_hash: passwordHash,
        full_name: 'Campus Admin',
        role: 'admin',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        email: 'faculty@campus.edu',
        password_hash: passwordHash,
        full_name: 'Dr. Ada Faculty',
        role: 'faculty',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        email: 'student@campus.edu',
        password_hash: passwordHash,
        full_name: 'Sam Student',
        role: 'student',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    await queryInterface.bulkInsert('departments', [
      { name: 'Computer Science', code: 'CS', created_at: now, updated_at: now }
    ]);

    const [users] = await queryInterface.sequelize.query(
      "SELECT id, role FROM users WHERE email IN ('faculty@campus.edu', 'student@campus.edu')"
    );
    const [departments] = await queryInterface.sequelize.query("SELECT id FROM departments WHERE code = 'CS'");
    const faculty = users.find((u) => u.role === 'faculty');
    const student = users.find((u) => u.role === 'student');

    await queryInterface.bulkInsert('courses', [
      {
        department_id: departments[0].id,
        code: 'CS101',
        title: 'Introduction to Programming',
        faculty_user_id: faculty.id,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ]);

    const [courses] = await queryInterface.sequelize.query("SELECT id FROM courses WHERE code = 'CS101'");

    await queryInterface.bulkInsert('enrollments', [
      {
        course_id: courses[0].id,
        student_user_id: student.id,
        status: 'enrolled',
        enrolled_at: now,
        dropped_at: null,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('enrollments', null, {});
    await queryInterface.bulkDelete('courses', null, {});
    await queryInterface.bulkDelete('departments', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
