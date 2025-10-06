// pages/ParentAuth.jsx
import { useState } from 'react';
import { usePlayerSelection } from '../context/usePlayerSelection';
import { useAuth } from '../context/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

function ParentAuthPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { setRequiresParentAuth } = usePlayerSelection();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) 
    return
  <div>Loading ...</div>

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }
      if (!currentUser) {
    setError('No user is signed in. Please sign in again.');
    return;
  }
    setLoading(true);
    setError(null);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      setRequiresParentAuth(false);

// TO DO : See notes to improve this to allow navigation to destinations other than /manageprofile eg parent as player.      
      navigate(location.state?.from?.pathname || '/manageprofiles');
    } catch (err) {
      console.error("Reauthentication error:", err);
      setError('Incorrect password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent-auth">
      <h2>Parent Verification</h2>
      <p>Please enter your password to manage profiles.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Continue'}
          </button>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ParentAuthPage;