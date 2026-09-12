import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Button, Card, Field } from '../components/ui';

export default function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (next.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        current_password: current,
        new_password: next,
      });
      setMsg('Password updated successfully.');
      setTimeout(() => nav('/me'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ct-container py-10">
      <div className="ct-page-enter mx-auto max-w-lg">
        <Link to="/me" className="text-sm font-semibold text-care-blue hover:underline">
          ← Back to my health
        </Link>
        <Card className="mt-4 p-6 sm:p-8">
          <h1 className="ct-display mt-2 text-3xl">Change password</h1>

          {msg && (
            <div className="ct-feedback mt-4 rounded-control border border-green-200 bg-green-50 px-4 py-3 text-sm text-success">
              {msg}
            </div>
          )}
          {error && (
            <div className="ct-feedback mt-4 rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Current password" id="cp-current">
              <input
                id="cp-current"
                type="password"
                className="ct-input"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
              />
            </Field>
            <Field label="New password" id="cp-new">
              <input
                id="cp-new"
                type="password"
                className="ct-input"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                required
              />
            </Field>
            <Field label="Confirm new password" id="cp-confirm">
              <input
                id="cp-confirm"
                type="password"
                className="ct-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </Field>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Saving…' : 'Update password'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}