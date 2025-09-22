// pages/ParentAuth.jsx
import { useState } from 'react';
import { usePlayerSelection } from '../context/playerContext';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

function ParentAuth() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { setRequiresParentAuth } = usePlayerSelection();
  const navigate = useNavigate();
  const location = useLocation();

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
    setRequiresParentAuth(false);
    // Redirect back to the original page or to home
    navigate(location.state?.from?.pathname || '/');
  } catch (err) {
    console.error("Reauthentication error:", err); // Log the actual error for debugging
    setError('Incorrect password. Please try again.');
  }
};


  return (
    <div className="parent-auth">
      <h2>Parent Verification</h2>
      <p>Please enter your password to continue.</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default ParentAuth;
