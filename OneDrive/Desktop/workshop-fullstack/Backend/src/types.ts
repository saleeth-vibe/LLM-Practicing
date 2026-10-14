export type UserRole = 'admin' | 'faculty' | 'student';

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
};
