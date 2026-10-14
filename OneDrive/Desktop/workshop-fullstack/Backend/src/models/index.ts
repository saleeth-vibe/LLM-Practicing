import { User } from './User';
import { Department } from './Department';
import { Course } from './Course';
import { Enrollment } from './Enrollment';
import { CourseDocument } from './CourseDocument';
import { DocumentChunk } from './DocumentChunk';
import { ChatThread } from './ChatThread';
import { ChatMessage } from './ChatMessage';

Department.hasMany(Course, { foreignKey: 'departmentId' });
Course.belongsTo(Department, { foreignKey: 'departmentId' });

User.hasMany(Course, { foreignKey: 'facultyUserId', as: 'taughtCourses' });
Course.belongsTo(User, { foreignKey: 'facultyUserId', as: 'faculty' });

Course.hasMany(Enrollment, { foreignKey: 'courseId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });
User.hasMany(Enrollment, { foreignKey: 'studentUserId' });
Enrollment.belongsTo(User, { foreignKey: 'studentUserId', as: 'student' });

Course.hasMany(CourseDocument, { foreignKey: 'courseId' });
CourseDocument.belongsTo(Course, { foreignKey: 'courseId' });
CourseDocument.belongsTo(User, { foreignKey: 'uploadedByUserId', as: 'uploader' });

CourseDocument.hasMany(DocumentChunk, { foreignKey: 'documentId' });
DocumentChunk.belongsTo(CourseDocument, { foreignKey: 'documentId' });
Course.hasMany(DocumentChunk, { foreignKey: 'courseId' });

User.hasMany(ChatThread, { foreignKey: 'studentUserId' });
Course.hasMany(ChatThread, { foreignKey: 'courseId' });
ChatThread.belongsTo(User, { foreignKey: 'studentUserId', as: 'student' });
ChatThread.belongsTo(Course, { foreignKey: 'courseId' });
ChatThread.hasMany(ChatMessage, { foreignKey: 'threadId' });
ChatMessage.belongsTo(ChatThread, { foreignKey: 'threadId' });

export {
  User,
  Department,
  Course,
  Enrollment,
  CourseDocument,
  DocumentChunk,
  ChatThread,
  ChatMessage
};
