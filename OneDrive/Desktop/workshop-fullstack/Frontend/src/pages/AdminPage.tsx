import { FormEvent, useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../hooks/useAuth';

export function AdminPage() {
  const { user, logout } = useAuth();
  const admin = useAdmin();
  const [tab, setTab] = useState<'users' | 'departments' | 'courses' | 'enrollments'>('users');

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Administration</p>
          <h1>University configuration</h1>
        </div>
        <div className="user-meta">
          <span>{user?.fullName}</span>
          <button className="ghost" onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </header>
      <nav className="tabs">
        {(['users', 'departments', 'courses', 'enrollments'] as const).map((item) => (
          <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)} type="button">
            {item}
          </button>
        ))}
      </nav>
      {admin.error ? <p className="error">{admin.error}</p> : null}
      {admin.loading ? <p>Loading campus records…</p> : null}
      {tab === 'users' ? <UsersPanel admin={admin} /> : null}
      {tab === 'departments' ? <DepartmentsPanel admin={admin} /> : null}
      {tab === 'courses' ? <CoursesPanel admin={admin} /> : null}
      {tab === 'enrollments' ? <EnrollmentsPanel admin={admin} /> : null}
    </div>
  );
}

function UsersPanel({ admin }: { admin: ReturnType<typeof useAdmin> }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'faculty' | 'student'>('student');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await admin.createUser({ fullName, email, password, role });
    setFullName('');
    setEmail('');
    setPassword('');
    await admin.refresh();
  }

  return (
    <section className="grid-two">
      <form className="panel" onSubmit={onSubmit}>
        <h2>Create user</h2>
        <label>
          Full name
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            <option value="admin">Admin</option>
            <option value="faculty">Faculty</option>
            <option value="student">Student</option>
          </select>
        </label>
        <button type="submit">Add user</button>
      </form>
      <div className="panel">
        <h2>Directory</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admin.users.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.fullName}</strong>
                  <div className="muted">{item.email}</div>
                </td>
                <td>{item.role}</td>
                <td>{item.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className="ghost"
                    type="button"
                    onClick={async () => {
                      await admin.setUserActive(item.id, !item.isActive);
                      await admin.refresh();
                    }}
                  >
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DepartmentsPanel({ admin }: { admin: ReturnType<typeof useAdmin> }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await admin.createDepartment({ name, code });
    setName('');
    setCode('');
    await admin.refresh();
  }

  return (
    <section className="grid-two">
      <form className="panel" onSubmit={onSubmit}>
        <h2>Create department</h2>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Code
          <input value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <button type="submit">Add department</button>
      </form>
      <div className="panel">
        <h2>Departments</h2>
        <ul className="plain-list">
          {admin.departments.map((dept) => (
            <li key={dept.id}>
              <strong>{dept.code}</strong> — {dept.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CoursesPanel({ admin }: { admin: ReturnType<typeof useAdmin> }) {
  const [departmentId, setDepartmentId] = useState(admin.departments[0]?.id ?? 0);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [facultyUserId, setFacultyUserId] = useState<number | 0>(0);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await admin.createCourse({
      departmentId,
      code,
      title,
      facultyUserId: facultyUserId || null
    });
    setCode('');
    setTitle('');
    await admin.refresh();
  }

  return (
    <section className="grid-two">
      <form className="panel" onSubmit={onSubmit}>
        <h2>Create course</h2>
        <label>
          Department
          <select value={departmentId} onChange={(e) => setDepartmentId(Number(e.target.value))}>
            {admin.departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.code} — {dept.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Code
          <input value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Faculty
          <select value={facultyUserId} onChange={(e) => setFacultyUserId(Number(e.target.value))}>
            <option value={0}>Unassigned</option>
            {admin.faculty.map((item) => (
              <option key={item.id} value={item.id}>
                {item.fullName}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Add course</button>
      </form>
      <div className="panel">
        <h2>Catalog</h2>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Faculty</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admin.courses.map((course) => (
              <tr key={course.id}>
                <td>
                  <strong>
                    {course.code} {course.title}
                  </strong>
                  <div className="muted">{course.Department?.name}</div>
                </td>
                <td>{course.faculty?.fullName ?? 'Unassigned'}</td>
                <td>{course.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className="ghost"
                    type="button"
                    onClick={async () => {
                      await admin.updateCourse(course.id, { isActive: !course.isActive });
                      await admin.refresh();
                    }}
                  >
                    {course.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EnrollmentsPanel({ admin }: { admin: ReturnType<typeof useAdmin> }) {
  const [courseId, setCourseId] = useState(admin.courses[0]?.id ?? 0);
  const [studentUserId, setStudentUserId] = useState(admin.students[0]?.id ?? 0);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    await admin.enrollStudent({ courseId, studentUserId });
    await admin.refresh();
  }

  return (
    <section className="grid-two">
      <form className="panel" onSubmit={onSubmit}>
        <h2>Enroll student</h2>
        <label>
          Course
          <select value={courseId} onChange={(e) => setCourseId(Number(e.target.value))}>
            {admin.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} — {course.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Student
          <select value={studentUserId} onChange={(e) => setStudentUserId(Number(e.target.value))}>
            {admin.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Enroll</button>
      </form>
      <div className="panel">
        <h2>Enrollment history</h2>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {admin.enrollments.map((row) => (
              <tr key={row.id}>
                <td>{row.student?.fullName}</td>
                <td>{row.Course?.code}</td>
                <td>{row.status}</td>
                <td>
                  {row.status === 'enrolled' ? (
                    <button
                      className="ghost"
                      type="button"
                      onClick={async () => {
                        await admin.dropEnrollment(row.id);
                        await admin.refresh();
                      }}
                    >
                      Drop
                    </button>
                  ) : (
                    <span className="muted">Kept as history</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
