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
import { useTranslation } from 'react-i18next';

function SignUp() {
  const [userEmail, setUserEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!userEmail || !confirmEmail || !password || !confirmPassword) {
      setError(t('signUp.error_all_fields'));
      setIsLoading(false);
      return;
    }

    if (userEmail !== confirmEmail) {
      setError(t('signUp.error_email_match'));
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(t('signUp.error_password_reqs'));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('signUp.error_password_match'));
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
      setSuccess(t('signUp.success_email_verification_sent'));
      setShowVerificationModal(true);

    } catch (error) {
      console.error("Sign up error:", error);
      setError(error.code === 'auth/email-already-in-use'
        ? t('signUp.email_in_use')
        : t('signUp.registration_failed'));
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
          <label>{t('signUp.email')}</label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            name="userEmail"
            required
          />
        </div>

        <div>
          <label>{t('signUp.confirm_email')}</label>
          <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            name="userEmail"
            required
          />
        </div>

        <div>
          <label>{t('signUp.password')}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            minLength="10"
            required
          />
        </div>
        <div>
          <label>{t('signUp.confirm_password')}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirmPassword"
            minLength="10"
            required
          />
        </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? t('signUp.button_loading') : t('signUp.button')}
      </button>
      </form>

      <PendingEmailVerification
        show={showVerificationModal}
        onClose={handleCloseModal}
      >
        <h2>Check Your Email</h2>
        <p>
          We've sent a verification link to <strong>{userEmail}</strong>.
          Please verify your email to complete your registration and go to <a href="https://openmoji.org/"></a> .
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
