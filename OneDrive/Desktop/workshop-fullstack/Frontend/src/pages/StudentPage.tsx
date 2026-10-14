import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useStudentChat } from '../hooks/useStudentChat';

export function StudentPage() {
  const { user, logout } = useAuth();
  const chat = useStudentChat();
  const [prompt, setPrompt] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = prompt.trim();
    if (!text) return;
    setPrompt('');
    await chat.send(text);
  }

  return (
    <div className="chat-shell">
      <aside className="sidebar">
        <p className="eyebrow">Student classroom</p>
        <h2>Your courses</h2>
        {chat.courses.map((course) => (
          <button
            key={course.id}
            className={chat.courseId === course.id ? 'course-item active' : 'course-item'}
            type="button"
            onClick={() => chat.setCourseId(course.id)}
          >
            <strong>{course.code}</strong>
            <span>{course.title}</span>
          </button>
        ))}
        {chat.courses.length === 0 && !chat.loading ? (
          <p className="muted">You are not enrolled in any active course.</p>
        ) : null}
        <div className="sidebar-foot">
          <span>{user?.fullName}</span>
          <button className="ghost" onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </aside>
      <main className="chat-main">
        <header>
          <h1>Ask from course resources</h1>
          <p className="muted">Answers are retrieved only from files your faculty uploaded for this class.</p>
        </header>
        <div className="messages">
          {chat.messages.map((message) => (
            <article key={message.id} className={`bubble ${message.role}`}>
              <p>{message.content}</p>
            </article>
          ))}
          {chat.messages.length === 0 ? (
            <p className="muted">Start a question about this week’s materials.</p>
          ) : null}
        </div>
        {chat.error ? <p className="error">{chat.error}</p> : null}
        <form className="composer" onSubmit={onSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question about this course…"
            rows={3}
          />
          <button type="submit" disabled={chat.sending || !chat.courseId}>
            {chat.sending ? 'Thinking…' : 'Send'}
          </button>
        </form>
      </main>
    </div>
  );
}
