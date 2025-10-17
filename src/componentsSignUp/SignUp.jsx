// componentsSignUp/SignUp.jsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import PendingEmailVerification from './PendingEmailVerification'

function SignUp() {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!userEmail || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;

      // 2. Create user and player documents
      const now = new Date();
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: now,
      });

      await setDoc(doc(db, "players", user.uid), {
        email: user.email,
        createdAt: now,
        isParent: true,
        familyId: user.uid,
        name: user.email.split('@')[0],
        setupComplete: false,
      });

      // 3. Send verification email
      await sendEmailVerification(user);
      console.log("SignUp.jsx - Verification email sent to", user.email)
      setSuccess("Account created! Please check your email for verification.");
      setShowVerificationModal(true);

    } catch (error) {
      console.error("Sign up error:", error);
      setError(error.code === 'auth/email-already-in-use'
        ? 'This email is already registered.'
        : 'Registration failed. Please try again.');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
    navigate('/'); // Or redirect to a waiting page
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            name="userEmail"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            minLength="6"
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirmPassword"
            minLength="6"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <PendingEmailVerification
        show={showVerificationModal}
        onClose={handleCloseModal}
      >
        <h2>Check Your Email</h2>
        <p>
          We've sent a verification link to <strong>{userEmail}</strong>.
          Please verify your email to complete your registration and then refresh this page.
        </p>
        <p>Didn't receive the email?</p>
        <button onClick={() => {
          sendEmailVerification(auth.currentUser)
            .then(() => setSuccess("Verification email resent!"))
            .catch(() => setError("Failed to resend email."));
        }}>
          Resend Email
        </button>
      </PendingEmailVerification>
    </>
  );
}

export default SignUp;
