import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function homeFor(role: string) {
  if (role === 'admin') return '/admin';
  if (role === 'faculty') return '/faculty';
  return '/student';
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@campus.edu');
  const [password, setPassword] = useState('Workshop123!');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user = await login(email, password);
      navigate(homeFor(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-shell">
      <form className="panel login-card" onSubmit={onSubmit}>
        <p className="eyebrow">Campus AI Assistant</p>
        <h1>Sign in to your campus workspace</h1>
        <p className="muted">Admin, faculty, and student roles each open a different dashboard.</p>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="hint">
          Demo accounts share password <code>Workshop123!</code>
          <br />
          admin@campus.edu · faculty@campus.edu · student@campus.edu
        </div>
      </form>
    </div>
  );
}
