import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFaculty } from '../hooks/useFaculty';

export function FacultyPage() {
  const { user, logout } = useAuth();
  const faculty = useFaculty();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!faculty.selectedCourseId || !file) return;
    setBusy(true);
    setMessage(null);
    try {
      await faculty.uploadDocument(faculty.selectedCourseId, file);
      setFile(null);
      setMessage('Upload received. Ingest runs in the background.');
      await faculty.refreshDocuments();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Faculty workspace</p>
          <h1>Course materials</h1>
        </div>
        <div className="user-meta">
          <span>{user?.fullName}</span>
          <button className="ghost" onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </header>
      {faculty.error ? <p className="error">{faculty.error}</p> : null}
      <section className="grid-two">
        <form className="panel" onSubmit={onSubmit}>
          <h2>Upload against a course</h2>
          <label>
            Course
            <select
              value={faculty.selectedCourseId ?? ''}
              onChange={(e) => faculty.setSelectedCourseId(Number(e.target.value))}
            >
              {faculty.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} — {course.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Resource file
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <button type="submit" disabled={busy || !file}>
            {busy ? 'Uploading…' : 'Upload and ingest'}
          </button>
          {message ? <p className="muted">{message}</p> : null}
          <p className="hint">PDF, DOCX, TXT, or Markdown. Each upload is kept as a new historical record.</p>
        </form>
        <div className="panel">
          <h2>Ingest status</h2>
          {faculty.documents.length === 0 ? <p className="muted">No files uploaded yet.</p> : null}
          <ul className="plain-list">
            {faculty.documents.map((doc) => (
              <li key={doc.id}>
                <strong>{doc.originalFilename}</strong>
                <div className={`status ${doc.ingestStatus}`}>{doc.ingestStatus}</div>
                {doc.ingestError ? <div className="error">{doc.ingestError}</div> : null}
              </li>
            ))}
          </ul>
          <button className="ghost" type="button" onClick={() => void faculty.refreshDocuments()}>
            Refresh status
          </button>
        </div>
      </section>
    </div>
  );
}
